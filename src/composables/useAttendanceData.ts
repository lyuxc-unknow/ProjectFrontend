import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { AttendanceApi } from '@/api/attendance';
import { dataProcessor } from '@/utils/attendance/dataProcessor';
import { debounce } from '@/utils/attendance/debounce';
import type { ClassInfo, Student, WeekDay } from '@/types/attendanceType';

export function useAttendanceData() {
  // 响应式数据
  const loading = ref(false);
  const selectedWeek = ref('');
  const selectedClass = ref<ClassInfo | null>(null);
  const attendanceData = ref<Student[]>([]);
  const selectedStudentIds = ref<string[]>([]);
  
  // 分页相关
  const pageSize = ref(10);
  const currentPage = ref(1);
  const totalStudents = ref(0);
  const totalPages = ref(0);

  // 更新队列
  const updateQueue = ref<
    Map<string, { student: Student; date: string; fields: string[]; status: string }>
  >(new Map());

  // 计算属性：当前周的日期
  const weekDays = computed((): WeekDay[] => {
    if (!selectedWeek.value) return [];

    const selectedDate = new Date(selectedWeek.value);
    // 计算选中日期所在周的周一
    const dayOfWeek = selectedDate.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // 周日是0，需要-6；周一是1，需要0
    const startDate = new Date(selectedDate);
    startDate.setDate(selectedDate.getDate() + mondayOffset);

    const days: WeekDay[] = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const dayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
      days.push({
        date: dateStr,
        label: `${dayNames[i]}<br/>${date.getMonth() + 1}/${date.getDate()}`,
        dayName: dayNames[i],
        dateDisplay: `${date.getMonth() + 1}/${date.getDate()}`,
      });
    }

    return days;
  });

  // 获取课程考勤状态
  const getMergedAttendanceStatus = (
    student: Student,
    date: string,
    period: string
  ): string => {
    // 增加保护，如果 attendance 对象不存在，则返回 'normal'
    if (!student.attendance) {
      return 'normal';
    }
    return student.attendance[`${date}-${period}`] || 'normal';
  };

  // 选择班级方法
  const selectClass = async (classItem: ClassInfo) => {
    if (selectedClass.value?.id !== classItem.id) {
      selectedClass.value = classItem;
      // 清除旧班级的UI数据，以提供即时反馈
      attendanceData.value = [];
      // 重置分页到第一页
      currentPage.value = 1;
      await loadAttendanceData();
    } else {
      // 如果点击的是当前已选中的班级，则强制刷新数据
      currentPage.value = 1;
      await loadAttendanceData();
    }
  };

  // 分页处理函数
  const handleSizeChange = (newSize: number) => {
    pageSize.value = newSize;
    currentPage.value = 1;
    loadAttendanceData();
  };

  // 处理当前更改
  const handleCurrentChange = (newPage: number) => {
    currentPage.value = newPage;
    loadAttendanceData();
  };

  // 加载考勤数据
  const loadAttendanceData = async () => {
    if (!selectedClass.value || !selectedWeek.value) return;

    const classId = selectedClass.value.id;
    const week = selectedWeek.value;

    loading.value = true;

    // 从服务器获取数据
    await fetchLatestData(classId, week);
  };

  // 获取最新数据
  const fetchLatestData = async (classId: number, week: string) => {
    try {
      const response = await AttendanceApi.getStudents({
        classId,
        week,
        page: currentPage.value,
        pageSize: pageSize.value,
      });

      // 检查响应数据结构 - 根据实际返回格式调整
      let studentsData = [];
      let total = 0;
      let currentPageNum = 1;
      let currentPageSize = 10;
      let currentTotalPages = 1;

      if (response.data && response.data.data && response.data.data.data) {
        // 嵌套格式: {code, message, data: {data: [...], page, pageSize, total, totalPages, hasNext, hasPrevious}}
        studentsData = response.data.data.data;
        total = response.data.data.total || 0;
        currentPageNum = response.data.data.page || 1;
        currentPageSize = response.data.data.pageSize || 10;
        currentTotalPages = response.data.data.totalPages || 1;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        // 标准格式: {code, message, data: [...], total, page, pageSize, totalPages}
        studentsData = response.data.data;
        total = response.data.total || 0;
        currentPageNum = response.data.page || 1;
        currentPageSize = response.data.pageSize || 10;
        currentTotalPages = response.data.totalPages || 1;
      } else if (Array.isArray(response.data)) {
        // 直接返回数组
        studentsData = response.data;
        total = studentsData.length;
      } else {
        console.error('未知的响应数据格式:', response.data);
        ElMessage.error('数据格式错误');
        return;
      }

      // 更新分页信息
      totalStudents.value = total;
      totalPages.value = currentTotalPages;

      // 确保studentsData是数组
      if (!Array.isArray(studentsData)) {
        console.error('学生数据不是数组:', studentsData);
        ElMessage.error('学生数据格式错误');
        return;
      }

      // 使用 dataProcessor 处理数据转换
      const transformedData = dataProcessor.transformBackendData(studentsData, weekDays.value);
      attendanceData.value = transformedData;
    } catch (error) {
      ElMessage.error('获取学生请假数据失败');
      console.error(error);
    } finally {
      loading.value = false;
    }
  };

  // 修改周期时间处理逻辑
  const handleWeekChange = () => {
    if (selectedClass.value) {
      currentPage.value = 1;
      loadAttendanceData();
    }
  };

  // 单个学生更新处理
  const processBatchUpdates = debounce(async () => {
    if (updateQueue.value.size === 0) return;

    const updates = Array.from(updateQueue.value.values());
    updateQueue.value.clear();

    try {
      // 为每个更新发送单独的请求
      const promises = updates.map(async ({ student, date, fields, status }) => {
        const requests = fields.map((backendField) => {
          if (!backendField || !status) return null;
          const requestData = {
            studentId: student.studentId,
            classId: (selectedClass.value as ClassInfo).id,
            field: backendField,
            status: status,
            week: selectedWeek.value,
          };
          console.log('发送请求数据:', requestData);
          return AttendanceApi.updateAttendance(requestData);
        });
        return Promise.all(requests.filter((p) => p !== null));
      });

      await Promise.all(promises.flat());
      ElMessage.success(`更新成功`);
    } catch (error) {
      ElMessage.error('更新失败');
      console.error(error);
    }
  }, 300);

  // 更新考情状态
  const updateAttendance = async (
    student: Student,
    date: string,
    period: string,
    status: string
  ) => {
    // 1. 立即更新UI
    const studentToUpdate = attendanceData.value.find(
      (s) => s.studentId === student.studentId
    );
    if (studentToUpdate) {
      const tempAttendance = { ...studentToUpdate.attendance };
      tempAttendance[`${date}-${period}`] = status;
      studentToUpdate.attendance = tempAttendance;
    }

    // 2. 添加到批量更新队列（转成后端字段）
    const fields = [dataProcessor.getBackendFieldName(date, period, weekDays.value)].filter((f): f is string => !!f);
    const updateKey = `${student.studentId}-${date}-${period}`;
    updateQueue.value.set(updateKey, { student, date, fields, status });

    // 3. 处理批量更新
    processBatchUpdates();
  };

  // 学生选择相关方法
  const handleStudentSelectionChange = (selection: Student[]) => {
    selectedStudentIds.value = selection.map((student) => student.studentId);
  };

  return {
    // 响应式数据
    loading,
    selectedWeek,
    selectedClass,
    attendanceData,
    selectedStudentIds,
    pageSize,
    currentPage,
    totalStudents,
    totalPages,
    weekDays,
    
    // 方法
    selectClass,
    handleSizeChange,
    handleCurrentChange,
    loadAttendanceData,
    handleWeekChange,
    updateAttendance,
    getMergedAttendanceStatus,
    handleStudentSelectionChange,
  };
}
