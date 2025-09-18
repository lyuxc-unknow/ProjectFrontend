import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { AttendanceApi } from '@/api/attendance';
import type { ClassInfo } from '@/types/attendanceType';

export function useClassManagement() {
  // 响应式数据
  const classes = ref<ClassInfo[]>([]);
  const selectedClassIds = ref<number[]>([]);
  const loading = ref(false);

  // 刷新班级方法
  const refreshClasses = async () => {
    try {
      loading.value = true;
      const response = await AttendanceApi.getClasses();
      classes.value = response.data.data;
    } catch (error) {
      ElMessage.error('获取班级列表失败');
      console.error(error);
    } finally {
      loading.value = false;
    }
  };

  // 班级选择相关方法
  const toggleClassSelection = (classId: number) => {
    const index = selectedClassIds.value.indexOf(classId);
    if (index > -1) {
      selectedClassIds.value.splice(index, 1);
    } else {
      selectedClassIds.value.push(classId);
    }
  };

  // 确定删除班级
  const confirmDeleteClasses = async () => {
    try {
      const classIds = selectedClassIds.value.join('&');
      const response = await AttendanceApi.deleteClasses({ classIds });

      if (response.data.code === 200) {
        ElMessage.success(response.data.data.message);
        selectedClassIds.value = [];
        await refreshClasses();
        return true; // 返回成功状态
      } else {
        ElMessage.error(response.data.message || '删除失败');
        return false;
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        ElMessage.error(error.response.data.message);
      } else {
        ElMessage.error('删除失败');
      }
      console.error(error);
      return false;
    }
  };

  return {
    // 响应式数据
    classes,
    selectedClassIds,
    loading,
    
    // 方法
    refreshClasses,
    toggleClassSelection,
    confirmDeleteClasses,
  };
}
