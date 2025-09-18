// 考勤模块通用类型

export interface ClassInfo {
  id: number;
  name: string;
  studentCount: number;
  headTeacher: string;
}

export interface Student {
  studentId: string;
  studentName: string;
  attendance: Record<string, string>;
}

export interface AttendanceStatus {
  value: string;
  label: string;
  color: string;
}

export interface TimePeriod {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
}

export interface WeekDay {
  date: string;
  label: string;
  dayName: string;
  dateDisplay: string;
}


