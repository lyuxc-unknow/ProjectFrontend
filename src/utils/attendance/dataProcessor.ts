import type { Student, WeekDay } from "@/types/attendanceType";
import { backendFieldMapping } from "@/constants/attendanceConstants";

// 数据处理工具函数
export const dataProcessor = {
  // 转换后端数据到前端格式
  transformBackendData(backendData: any[], weekDays: WeekDay[]): Student[] {
    console.log("transformBackendData input:", backendData, "weekDays:", weekDays);
    
    if (!Array.isArray(backendData)) {
      console.error("transformBackendData: 输入数据不是数组:", backendData);
      return [];
    }

    const result = backendData.map((student, index) => {
      try {
        console.log(`Processing student ${index}:`, student);
        
        // 确保student对象存在且有必要的字段
        if (!student) {
          console.warn(`Student data is null or undefined at index ${index}`);
          return {
            studentId: `unknown-${index}`,
            studentName: "未知学生",
            attendance: {},
          };
        }
        
        // 检查student对象是否存在必要的字段
        if (!student.studentId || !student.studentName) {
          console.warn(`Invalid student data at index ${index}:`, student);
          return {
            studentId: student.studentId || `unknown-${index}`,
            studentName: student.studentName || "未知学生",
            attendance: {},
          };
        }
        
        const transformedStudent: Student = {
          studentId: student.studentId,
          studentName: student.studentName,
          attendance: {},
        };

        // 转换后端字段到前端格式
        Object.entries(backendFieldMapping).forEach(([backendField, mapping]) => {
          try {
            const { date, periods } = mapping;
            const dayDate = weekDays[date]?.date;
            // 仅处理非null且非undefined的值，同时处理空字符串
            if (dayDate && student[backendField] !== undefined && student[backendField] !== null && student[backendField] !== "") {
              periods.forEach((period) => {
                // 确保值是字符串类型
                const value = String(student[backendField]);
                transformedStudent.attendance[`${dayDate}-${period}`] = value;
              });
            }
          } catch (error) {
            console.error(`Error processing field ${backendField} for student ${student.studentId}:`, error);
          }
        });

        console.log("Transformed student:", transformedStudent);
        return transformedStudent;
      } catch (error) {
        console.error(`Error processing student at index ${index}:`, error);
        // 返回一个默认的学生对象以避免中断整个转换过程
        return {
          studentId: `error-${index}`,
          studentName: "转换错误",
          attendance: {},
        };
      }
    });
    
    console.log("transformBackendData result:", result);
    return result;
  },

  // 获取后端字段名（兼容原子节次与合并节次ID）
  getBackendFieldName(date: string, period: string, weekDays: WeekDay[]): string | null {
    console.log("getBackendFieldName 输入:", { date, period });
    console.log("weekDays:", weekDays);

    const dayIndex = weekDays.findIndex((day) => day.date === date);
    console.log("dayIndex:", dayIndex);

    if (dayIndex === -1) {
      console.error("未找到对应的日期:", date);
      return null;
    }

    const dayNames = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    const dayName = dayNames[dayIndex];
    console.log("dayName:", dayName);

    // 根据 period 确定合并时段后缀
    let periodSuffix = "";
    switch (period) {
      // 兼容原子节次（旧）
      case "morning1":
      case "morning2":
        periodSuffix = "Morning12";
        break;
      case "morning3":
      case "morning4":
        periodSuffix = "Morning34";
        break;
      case "afternoon1":
      case "afternoon2":
        periodSuffix = "Afternoon56";
        break;
      case "afternoon3":
      case "afternoon4":
        periodSuffix = "Afternoon78";
        break;
      case "evening1":
      case "evening2":
      case "evening3":
        periodSuffix = "Evening910";
        break;
      // 合并节次（新）
      case "morning12":
        periodSuffix = "Morning12";
        break;
      case "morning34":
        periodSuffix = "Morning34";
        break;
      case "afternoon56":
        periodSuffix = "Afternoon56";
        break;
      case "afternoon78":
        periodSuffix = "Afternoon78";
        break;
      case "evening910":
        periodSuffix = "Evening910";
        break;
      default:
        console.warn("未知的节次:", period);
        // 返回默认值而不是null，避免错误
        return `${dayName}Morning12`;
    }

    return `${dayName}${periodSuffix}`;
  }
};