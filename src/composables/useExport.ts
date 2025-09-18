import { ElMessage } from 'element-plus';
import { AttendanceApi } from '@/api/attendance';
import type { ClassInfo } from '@/types/attendanceType';

export function useExport() {
  // 导出单个班级考勤表
  const exportAttendance = async (selectedClass: ClassInfo | null, selectedWeek: string) => {
    if (!selectedClass) {
      ElMessage.warning('请先选择班级');
      return;
    }

    try {
      const response = await AttendanceApi.exportClass({
        classId: selectedClass.id,
        week: selectedWeek,
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `${selectedClass.name}_${selectedWeek}_考勤表.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      ElMessage.success('导出成功');
    } catch (error) {
      ElMessage.error('导出失败');
      console.error(error);
    }
  };

  // 导出所有考勤表
  const exportAllAttendance = async (selectedWeek: string) => {
    if (!selectedWeek) {
      ElMessage.warning('请先选择日期');
      return;
    }

    try {
      const response = await AttendanceApi.exportAll({
        week: selectedWeek,
        format: 'xlsx',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `全部班级_${selectedWeek}_考勤表.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      ElMessage.success('导出全部考勤表成功');
    } catch (error) {
      ElMessage.error('导出全部考勤表失败');
      console.error(error);
    }
  };

  // 导出异常：全部班级
  const exportProblemSummaryAll = async (selectedWeek: string) => {
    if (!selectedWeek) {
      ElMessage.warning('请先选择日期');
      return;
    }
    try {
      const response = await AttendanceApi.exportProblemSummaryAll({
        week: selectedWeek,
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `异常汇总_全部_${selectedWeek}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      ElMessage.success('导出异常汇总(全部)成功');
    } catch (error) {
      ElMessage.error('导出异常汇总(全部)失败');
      console.error(error);
    }
  };

  // 导出异常：单个班级
  const exportProblemSummary = async (selectedClass: ClassInfo | null, selectedWeek: string) => {
    if (!selectedClass) {
      ElMessage.warning('请先选择班级');
      return;
    }
    try {
      const response = await AttendanceApi.exportProblemSummary({
        classId: selectedClass.id,
        week: selectedWeek,
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `异常汇总_${selectedClass.name}_${selectedWeek}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      ElMessage.success('导出异常汇总成功');
    } catch (error) {
      ElMessage.error('导出异常汇总失败');
      console.error(error);
    }
  };

  return {
    exportAttendance,
    exportAllAttendance,
    exportProblemSummaryAll,
    exportProblemSummary,
  };
}
