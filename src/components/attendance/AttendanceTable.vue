<template>
  <el-card v-if="selectedClass" class="attendance-card">
    <template #header>
      <div class="card-header">
        <span>{{ selectedClass.name }} - 请假管理</span>
        <!-- N个按钮 -->
        <div class="header-actions">
          <el-button
            type="warning"
            size="small"
            @click="$emit('showAddStudentDialog')"
            class="action-btn"
          >
            <el-icon><User /></el-icon>
            新增学生
          </el-button>
          <el-button
            type="success"
            size="small"
            @click="$emit('showImportStudentsDialog')"
            class="action-btn"
          >
            <el-icon><Upload /></el-icon>
            导入学生
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="$emit('showDeleteStudentDialog')"
            :disabled="selectedStudentIds.length === 0"
            class="action-btn"
          >
            <el-icon><Delete /></el-icon>
            删除学生
          </el-button>
          <el-button
            type="info"
            size="small"
            @click="$emit('exportAttendance')"
            class="action-btn"
          >
            <el-icon><Download /></el-icon>
            导出
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="$emit('exportProblemSummary')"
            class="action-btn"
          >
            <el-icon><Download /></el-icon>
            导出(外部)
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="$emit('batchUpdate')"
            class="action-btn"
            :disabled="attendanceData.length === 0"
          >
            <el-icon><Edit /></el-icon>
            批量修改
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="$emit('batchRemark')"
            class="action-btn"
            :disabled="attendanceData.length === 0"
          >
            <el-icon><Edit /></el-icon>
            批量备注
          </el-button>
        </div>
      </div>
    </template>
    <div class="attendance-content">
      <!-- 课程时间表 -->
      <div class="schedule-table">
        <el-scrollbar class="table-wrapper" :wrap-style="{ overflowX: 'hidden' }" :max-height="'calc(100vh - 300px)'">
          <el-table
            ref="tableRef"
            :data="attendanceData"
            border
            style="width: 100%"
            :loading="loading"
            @selection-change="$emit('handleStudentSelectionChange', $event)"
          >
            <el-table-column type="selection" width="55" fixed="left" />
            <el-table-column
              prop="studentId"
              label="学号"
              width="100"
              fixed="left"
            />
            <el-table-column
              prop="studentName"
              label="学生姓名"
              width="100"
              fixed="left"
            />

            <!-- 动态生成课程时间列 -->
            <el-table-column v-for="day in weekDays" :key="day.date" align="center">
              <template #header>
                <div class="day-header">
                  <div class="day-name">{{ day.dayName }}</div>
                  <div class="day-date">{{ day.dateDisplay }}</div>
                </div>
              </template>
              <el-table-column
                v-for="period in timePeriods"
                :key="`${day.date}-${period.id}`"
                :label="period.name"
                width="120"
                align="center"
              >
                <template #default="{ row }">
                  <div style="display: flex; gap: 6px; align-items: center; justify-content: center;">
                    <el-select
                      :model-value="getMergedAttendanceStatus(row, day.date, period.id)"
                      size="small"
                      @change="$emit('updateAttendance', row, day.date, period.id, $event)"
                    >
                      <el-option
                        v-for="status in attendanceStatuses"
                        :key="status.value"
                        :label="status.label"
                        :value="status.value"
                        :style="{ color: status.color }"
                      />
                    </el-select>
                    <el-button
                      link
                      type="primary"
                      size="small"
                      @click="$emit('openRemark', row, day.date, period.id)"
                    >备注</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
        </el-scrollbar>

        <!-- 分页组件 -->
        <div class="pagination-container">
          <el-pagination
            :current-page="currentPage"
            :page-size="pageSize"
            :total="totalStudents"
            :page-sizes="[6, 8, 10, 12]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="$emit('handleSizeChange', $event)"
            @current-change="$emit('handleCurrentChange', $event)"
            :loading="loading"
          />
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { User, Upload, Delete, Download, Edit } from "@element-plus/icons-vue";
import type { ClassInfo, Student, WeekDay } from "@/types/attendanceType";
import { attendanceStatuses, timePeriods } from "@/constants/attendanceConstants";

interface Props {
  selectedClass: ClassInfo | null;
  attendanceData: Student[];
  weekDays: WeekDay[];
  loading: boolean;
  selectedStudentIds: string[];
  currentPage: number;
  pageSize: number;
  totalStudents: number;
}

interface Emits {
  (e: "showAddStudentDialog"): void;
  (e: "showImportStudentsDialog"): void;
  (e: "showDeleteStudentDialog"): void;
  (e: "exportAttendance"): void;
  (e: "exportProblemSummary"): void;
  (e: "batchUpdate"): void;
  (e: "batchRemark"): void;
  (e: "handleStudentSelectionChange", selection: Student[]): void;
  (e: "updateAttendance", student: Student, date: string, period: string, status: string): void;
  (e: "openRemark", student: Student, date: string, period: string): void;
  (e: "handleSizeChange", size: number): void;
  (e: "handleCurrentChange", page: number): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// 表格引用
const tableRef = ref();

// 获取考勤状态
const getMergedAttendanceStatus = (student: Student, date: string, period: string): string => {
  if (!student.attendance) {
    return 'normal';
  }
  return student.attendance[`${date}-${period}`] || 'normal';
};
</script>
