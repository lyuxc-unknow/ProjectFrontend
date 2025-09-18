import { ref, reactive, type Ref } from 'vue';
import { ElMessage } from 'element-plus';
import { AttendanceApi } from '@/api/attendance';
import type { ClassInfo } from '@/types/attendanceType';

export function useStudentManagement(selectedStudentIds: Ref<string[]>) {

  // 表单数据
  const addStudentForm = reactive({
    studentId: '',
    name: '',
  });

  const importStudentsForm = reactive({
    rawText: '',
  });

  // 表单引用
  const addStudentFormRef = ref();

  // 新增学生相关方法
  const showAddStudentDialog = (selectedClass: any) => {
    if (!selectedClass) {
      ElMessage.warning('请先选择班级');
      return false;
    }
    return true; // 返回成功状态，让父组件处理对话框显示
  };

  // 导入学生
  const showImportStudentsDialog = (selectedClass: any) => {
    if (!selectedClass) {
      ElMessage.warning('请先选择班级');
      return false;
    }
    return true; // 返回成功状态，让父组件处理对话框显示
  };

  // 确定导入学生
  const confirmImportStudents = async (selectedClass: ClassInfo) => {
    const namesText = importStudentsForm.rawText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join('\n');
    if (!namesText) {
      ElMessage.warning('请输入要导入的学生名单');
      return false;
    }

    try {
      const payload = {
        classId: selectedClass.id,
        namesText,
      };
      const resp = await AttendanceApi.importStudents(payload);
      if (resp.data?.code === 200) {
        ElMessage.success('导入成功');
        return true;
      } else {
        ElMessage.error(resp.data?.message || '导入失败');
        return false;
      }
    } catch (e) {
      ElMessage.error('导入失败');
      console.error(e);
      return false;
    }
  };

  // 确定添加学生
  const confirmAddStudent = async (selectedClass: ClassInfo) => {
    if (!addStudentFormRef.value) return false;

    try {
      await addStudentFormRef.value.validate();

      const response = await AttendanceApi.createStudent({
        studentId: addStudentForm.studentId,
        studentName: addStudentForm.name,
        classId: selectedClass.id,
      });

      if (response.data.code === 200) {
        ElMessage.success('学生添加成功');
        return true;
      } else {
        ElMessage.error(response.data.message || '添加失败');
        return false;
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        ElMessage.error(error.response.data.message);
      } else {
        ElMessage.error('添加失败');
      }
      console.error(error);
      return false;
    }
  };

  // 显示删除学生对话框
  const showDeleteStudentDialog = () => {
    if (selectedStudentIds.value.length === 0) {
      ElMessage.warning('请先选择要删除的学生');
      return;
    }
    return true; // 返回成功状态，让父组件处理对话框显示
  };

  // 确定删除学生
  const confirmDeleteStudents = async (selectedClass: ClassInfo) => {
    if (!selectedClass) {
      ElMessage.warning('请先选择班级');
      return false;
    }

    try {
      const studentIds = selectedStudentIds.value.join('&');
      const response = await AttendanceApi.deleteStudents({
        classId: selectedClass.id,
        studentIds,
      });

      if (response.data.code === 200) {
        ElMessage.success(response.data.data.message);
        selectedStudentIds.value = [];
        return true;
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

  // 重置表单
  const resetAddStudentForm = () => {
    Object.assign(addStudentForm, {
      studentId: '',
      name: '',
    });
  };

  const resetImportStudentsForm = () => {
    Object.assign(importStudentsForm, { rawText: '' });
  };

  return {
    // 响应式数据
    selectedStudentIds,
    addStudentForm,
    importStudentsForm,
    addStudentFormRef,
    
    // 方法
    showAddStudentDialog,
    showImportStudentsDialog,
    confirmImportStudents,
    confirmAddStudent,
    showDeleteStudentDialog,
    confirmDeleteStudents,
    resetAddStudentForm,
    resetImportStudentsForm,
  };
}
