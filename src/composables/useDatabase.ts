import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { AttendanceApi } from '@/api/attendance';

export function useDatabase() {
  // 响应式数据
  const dbFileInputRef = ref();

  // 下载数据库
  const downloadDatabase = async () => {
    try {
      const response = await AttendanceApi.downloadDatabase();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'StudentManagerDataBase.db');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      ElMessage.success('数据库下载成功');
    } catch (error) {
      ElMessage.error('数据库下载失败');
      console.error(error);
    }
  };

  // 上传数据库
  const uploadDatabase = () => {
    dbFileInputRef.value?.click();
  };

  // 处理数据库上传
  const handleDatabaseUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (!files || files.length === 0) return;

    try {
      await AttendanceApi.uploadDatabase(Array.from(files));
      ElMessage.success('数据库上传成功');
      window.location.reload();
      return true; // 返回成功状态
    } catch (error) {
      ElMessage.error('数据库上传失败');
      console.error(error);
      return false;
    }
  };

  return {
    // 响应式数据
    dbFileInputRef,
    
    // 方法
    downloadDatabase,
    uploadDatabase,
    handleDatabaseUpload,
  };
}
