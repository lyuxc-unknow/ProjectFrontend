import axios from "axios";

export const AttendanceApi = {
  // 获取所有班级
  getClasses() {
    return axios.get("/api/attendance/classes");
  },
  // 根据班级获取学生
  getStudents(params: { classId: number; week: string; page: number; pageSize: number; }) {
    return axios.get("/api/attendance/students", { params });
  },
  // 更新单个学生考情状态
  updateAttendance(payload: { studentId: string; classId: number; field: string; status: string; week: string; }) {
    return axios.post("/api/attendance/update", payload);
  },
  // 获取备注：按 学生 + 班级 + 周 + 后端字段名（如 mondayMorning12）
  getRemark(params: { studentId: string; classId: number; week: string; field: string; }) {
    return axios.get("/api/attendance/remarks", { params });
  },
  // 统一备注保存（仅 POST）：按 学生 + 班级 + 周 + 后端字段名 + 备注
  saveRemark(payload: { studentId: string; classId: number; week: string; field: string; remark: string; }) {
    return axios.post("/api/attendance/remarks", payload);
  },
  // 批量备注保存
  batchSaveRemark(payload: { classId: number; week: string; studentIds: string[]; field: string[]; remark: string; }) {
    return axios.post("/api/attendance/remarks/batch", payload);
  },
  // 批量更新考勤状态
  batchUpdate(payload: { classId: number; week: string; studentIds: string[]; dateRange: string[]; field: string[]; status: string; }) {
    return axios.post("/api/attendance/batch-update", payload);
  },
  // 导出班级excel
  exportClass(params: { classId: number; week: string; }) {
    return axios.get("/api/attendance/export", { params, responseType: "blob" });
  },
  // 导出所有
  exportAll(params: { week: string; format?: string; }) {
    return axios.get("/api/attendance/export-all", { params, responseType: "blob" });
  },
  // 异常汇总导出
  exportProblemSummaryAll(params: { week: string; }) {
    return axios.get("/api/attendance/export-problem-summary-all", { params, responseType: "blob" });
  },
  // 异常导出
  exportProblemSummary(params: { classId: number; week: string; }) {
    return axios.get("/api/attendance/export-problem-summary", { params, responseType: "blob" });
  },
  // 创建班级
  createClass(payload: { name: string; headTeacher: string; }) {
    return axios.post("/api/attendance/classes", payload);
  },
  // 导入学生（学号自动自增）
  importStudents(payload: { classId: number; namesText: string; }) {
    return axios.post("/api/attendance/students/import", payload);
  },
  // 创建学生
  createStudent(payload: { studentId: string; studentName: string; classId: number; }) {
    return axios.post("/api/attendance/students", payload);
  },
  // 删除班级
  deleteClasses(params: { classIds: string; }) {
    return axios.delete("/api/attendance/classes", { params });
  },
  // 删除学生
  deleteStudents(params: { classId: number; studentIds: string; }) {
    return axios.delete("/api/attendance/students", { params });
  },
  
  // 数据库导出
  downloadDatabase() {
    return axios.get("/api/db/download", { responseType: "blob" });
  },
  
  // 数据库导入
  uploadDatabase(files: File[]) {
    const formData = new FormData();
    files.forEach(file => {
      formData.append("files", file);
    });
    return axios.post("/api/db/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  }
};


