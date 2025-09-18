import type { AttendanceStatus, TimePeriod } from "@/types/attendanceType";

// 请假状态配置
export const attendanceStatuses: AttendanceStatus[] = [
  { value: "normal", label: "正常", color: "#67C23A" },
  { value: "leave", label: "请假", color: "#409EFF" },
  { value: "sick_leave", label: "病假", color: "#FE03F1" },
  { value: "personal_leave", label: "事假", color: "#E6A23C" },
  { value: "official_leave", label: "公假", color: "#909399" },
  { value: "absent", label: "旷课", color: "#F56C6C" },
  { value: "late", label: "迟到", color: "#F56C6C" },
  { value: "early_leave", label: "早退", color: "#F56C6C" },
];

// 课程时段配置 - 原子节次（不再合并）
export const timePeriods: TimePeriod[] = [
  { id: "morning12", name: "早1-2", startTime: "08:00", endTime: "09:40" },
  { id: "morning34", name: "早3-4", startTime: "10:00", endTime: "11:40" },
  { id: "afternoon56", name: "下5-6", startTime: "14:00", endTime: "15:40" },
  { id: "afternoon78", name: "下7-8", startTime: "16:00", endTime: "17:40" },
  { id: "evening910", name: "晚9-10", startTime: "19:00", endTime: "21:35" },
];

// 后端字段到前端格式的映射
export const backendFieldMapping = {
  mondayMorning12: { date: 0, periods: ["morning12"] },
  mondayMorning34: { date: 0, periods: ["morning34"] },
  mondayAfternoon56: { date: 0, periods: ["afternoon56"] },
  mondayAfternoon78: { date: 0, periods: ["afternoon78"] },
  mondayEvening910: { date: 0, periods: ["evening910"] },
  tuesdayMorning12: { date: 1, periods: ["morning12"] },
  tuesdayMorning34: { date: 1, periods: ["morning34"] },
  tuesdayAfternoon56: { date: 1, periods: ["afternoon56"] },
  tuesdayAfternoon78: { date: 1, periods: ["afternoon78"] },
  tuesdayEvening910: { date: 1, periods: ["evening910"] },
  wednesdayMorning12: { date: 2, periods: ["morning12"] },
  wednesdayMorning34: { date: 2, periods: ["morning34"] },
  wednesdayAfternoon56: { date: 2, periods: ["afternoon56"] },
  wednesdayAfternoon78: { date: 2, periods: ["afternoon78"] },
  wednesdayEvening910: { date: 2, periods: ["evening910"] },
  thursdayMorning12: { date: 3, periods: ["morning12"] },
  thursdayMorning34: { date: 3, periods: ["morning34"] },
  thursdayAfternoon56: { date: 3, periods: ["afternoon56"] },
  thursdayAfternoon78: { date: 3, periods: ["afternoon78"] },
  thursdayEvening910: { date: 3, periods: ["evening910"] },
  fridayMorning12: { date: 4, periods: ["morning12"] },
  fridayMorning34: { date: 4, periods: ["morning34"] },
  fridayAfternoon56: { date: 4, periods: ["afternoon56"] },
  fridayAfternoon78: { date: 4, periods: ["afternoon78"] },
  fridayEvening910: { date: 4, periods: ["evening910"] },
  saturdayMorning12: { date: 5, periods: ["morning12"] },
  saturdayMorning34: { date: 5, periods: ["morning34"] },
  saturdayAfternoon56: { date: 5, periods: ["afternoon56"] },
  saturdayAfternoon78: { date: 5, periods: ["afternoon78"] },
  saturdayEvening910: { date: 5, periods: ["evening910"] },
  sundayMorning12: { date: 6, periods: ["morning12"] },
  sundayMorning34: { date: 6, periods: ["morning34"] },
  sundayAfternoon56: { date: 6, periods: ["afternoon56"] },
  sundayAfternoon78: { date: 6, periods: ["afternoon78"] },
  sundayEvening910: { date: 6, periods: ["evening910"] },
} as const;


