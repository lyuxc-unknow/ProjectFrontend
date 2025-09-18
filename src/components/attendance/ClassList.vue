<template>
  <el-card class="class-card">
    <template #header>
      <div class="card-header">
        <span>班级列表</span>
        <!-- 左上角四个按钮 -->
        <div class="header-actions">
          <el-button
            type="success"
            size="small"
            @click="$emit('showAddClassDialog')"
            class="action-btn"
          >
            <el-icon><Plus /></el-icon>
            添加班级
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="$emit('showDeleteClassDialog')"
            :disabled="selectedClassIds.length === 0"
            class="action-btn"
          >
            <el-icon><Delete /></el-icon>
            删除班级
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="$emit('refreshClasses')"
            class="action-btn"
          >
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
          <el-button
            type="info"
            size="small"
            @click="$emit('exportAllAttendance')"
            class="action-btn"
          >
            <el-icon><Download /></el-icon>
            导出全部
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="$emit('exportProblemSummaryAll')"
            class="action-btn"
          >
            <el-icon><Download /></el-icon>
            导出全部(外部)
          </el-button>
        </div>
      </div>
    </template>
    <!-- 左边从后端获取的班级列表 -->
    <div class="class-list">
      <div
        v-for="classItem in classes"
        :key="classItem.id"
        class="class-item"
        :class="{
          active: selectedClass?.id === classItem.id,
          selected: selectedClassIds.includes(classItem.id),
        }"
        @click="$emit('selectClass', classItem)"
        @contextmenu.prevent="$emit('toggleClassSelection', classItem.id)"
      >
        <div class="class-item-header">
          <el-checkbox
            :model-value="selectedClassIds.includes(classItem.id)"
            @change="$emit('toggleClassSelection', classItem.id)"
            @click.stop
          />
          <div class="class-name">{{ classItem.name }}</div>
        </div>
        <div class="class-info">
          <span>学生数: {{ classItem.studentCount }}</span>
          <span style="margin-left: 10px;">班主任: {{ classItem.headTeacher }}</span>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { Plus, Delete, Refresh, Download } from "@element-plus/icons-vue";
import type { ClassInfo } from "@/types/attendanceType";

interface Props {
  classes: ClassInfo[];
  selectedClass: ClassInfo | null;
  selectedClassIds: number[];
}

interface Emits {
  (e: "showAddClassDialog"): void;
  (e: "showDeleteClassDialog"): void;
  (e: "refreshClasses"): void;
  (e: "exportAllAttendance"): void;
  (e: "exportProblemSummaryAll"): void;
  (e: "selectClass", classItem: ClassInfo): void;
  (e: "toggleClassSelection", classId: number): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>
