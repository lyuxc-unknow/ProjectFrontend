<template>
  <!-- 新增班级对话框 -->
  <el-dialog :model-value="addClassDialogVisible" @update:model-value="$emit('update:addClassDialogVisible', $event)" title="新增班级" width="400px">
    <el-form
      :model="addClassForm"
      :rules="addClassRules"
      ref="addClassFormRef"
      label-width="100px"
    >
      <el-form-item label="班级名称" prop="name">
        <el-input v-model="addClassForm.name" placeholder="请输入班级名称" />
      </el-form-item>
      <el-form-item label="班主任名称" prop="headTeacher">
        <el-input v-model="addClassForm.headTeacher" placeholder="请输入班主任名称" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="$emit('update:addClassDialogVisible', false)">取消</el-button>
      <el-button type="primary" @click="handleConfirmAddClass">确定</el-button>
    </template>
  </el-dialog>

  <!-- 新增学生对话框 -->
  <el-dialog :model-value="addStudentDialogVisible" @update:model-value="$emit('update:addStudentDialogVisible', $event)" title="新增学生" width="600px">
    <el-form
      :model="addStudentForm"
      :rules="addStudentRules"
      ref="addStudentFormRef"
      label-width="100px"
    >
      <el-form-item label="学号" prop="studentId">
        <el-input v-model="addStudentForm.studentId" placeholder="请输入学号" />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="addStudentForm.name" placeholder="请输入学生姓名" />
      </el-form-item>
      <el-form-item label="班级">
        <el-input :value="selectedClass?.name" disabled />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="$emit('update:addStudentDialogVisible', false)">取消</el-button>
      <el-button type="primary" @click="handleConfirmAddStudent">确定</el-button>
    </template>
  </el-dialog>

  <!-- 导入学生对话框 -->
  <el-dialog :model-value="importStudentsDialogVisible" @update:model-value="$emit('update:importStudentsDialogVisible', $event)" title="批量导入学生" width="600px">
    <el-form :model="importStudentsForm" label-width="100px">
      <el-form-item label="目标班级">
        <el-input :value="selectedClass?.name" disabled />
      </el-form-item>
      <el-form-item label="学生姓名">
        <el-input
          v-model="importStudentsForm.rawText"
          type="textarea"
          :rows="12"
          placeholder="每行一个名字，例如: 
张三
李四
王五"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="$emit('update:importStudentsDialogVisible', false)">取消</el-button>
      <el-button type="primary" @click="$emit('confirmImportStudents')">开始导入</el-button>
    </template>
  </el-dialog>

  <!-- 删除班级对话框 -->
  <el-dialog :model-value="deleteClassDialogVisible" @update:model-value="$emit('update:deleteClassDialogVisible', $event)" title="删除班级" width="500px">
    <div class="delete-warning">
      <el-icon class="warning-icon"><Warning /></el-icon>
      <div class="warning-content">
        <h4>确认删除选中的班级吗？</h4>
        <p>此操作将同时删除：</p>
        <ul>
          <li>选中的 {{ selectedClassIds.length }} 个班级</li>
          <li>这些班级下的所有学生</li>
          <li>所有相关的考勤记录</li>
        </ul>
        <p class="danger-text">此操作不可恢复！</p>
      </div>
    </div>
    <template #footer>
      <el-button @click="$emit('update:deleteClassDialogVisible', false)">取消</el-button>
      <el-button type="danger" @click="$emit('confirmDeleteClasses')">确定删除</el-button>
    </template>
  </el-dialog>

  <!-- 删除学生对话框 -->
  <el-dialog :model-value="deleteStudentDialogVisible" @update:model-value="$emit('update:deleteStudentDialogVisible', $event)" title="删除学生" width="500px">
    <div class="delete-warning">
      <el-icon class="warning-icon"><Warning /></el-icon>
      <div class="warning-content">
        <h4>确认删除选中的学生吗？</h4>
        <p>此操作将同时删除：</p>
        <ul>
          <li>选中的 {{ selectedStudentIds.length }} 名学生</li>
          <li>这些学生的所有考勤记录</li>
        </ul>
        <p class="danger-text">此操作不可恢复！</p>
      </div>
    </div>
    <template #footer>
      <el-button @click="$emit('update:deleteStudentDialogVisible', false)">取消</el-button>
      <el-button type="danger" @click="$emit('confirmDeleteStudents')">确定删除</el-button>
    </template>
  </el-dialog>

  <!-- 批量修改对话框 -->
  <el-dialog :model-value="batchDialogVisible" @update:model-value="$emit('update:batchDialogVisible', $event)" title="批量修改请假状态" width="600px">
    <el-form :model="batchForm" label-width="100px">
      <el-form-item label="选择学生">
        <el-select
          v-model="batchForm.studentIds"
          multiple
          placeholder="选择要修改的学生"
          style="width: 100%"
        >
          <el-option
            v-for="student in attendanceData"
            :key="student.studentId"
            :label="student.studentName"
            :value="student.studentId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="选择日期">
        <el-select
          v-model="batchForm.days"
          multiple
          placeholder="选择周内的日期"
          style="width: 100%"
        >
          <el-option
            v-for="d in weekDays"
            :key="d.date"
            :label="`${d.dayName} (${d.dateDisplay})`"
            :value="d.date"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="选择课程">
        <el-select
          v-model="batchForm.periods"
          multiple
          placeholder="选择课程时段"
          style="width: 100%"
        >
          <el-option
            v-for="period in timePeriods"
            :key="period.id"
            :label="period.name"
            :value="period.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="请假状态">
        <el-select v-model="batchForm.status" placeholder="选择请假状态">
          <el-option
            v-for="status in attendanceStatuses"
            :key="status.value"
            :label="status.label"
            :value="status.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="$emit('update:batchDialogVisible', false)">取消</el-button>
      <el-button type="primary" @click="$emit('confirmBatchUpdate')">确定</el-button>
    </template>
  </el-dialog>

  <!-- 批量备注对话框 -->
  <el-dialog :model-value="batchRemarkDialogVisible" @update:model-value="$emit('update:batchRemarkDialogVisible', $event)" title="批量备注" width="600px">
    <el-form :model="batchRemarkForm" label-width="100px">
      <el-form-item label="选择学生">
        <el-select
          v-model="batchRemarkForm.studentIds"
          multiple
          placeholder="选择要备注的学生"
          style="width: 100%"
        >
          <el-option
            v-for="student in attendanceData"
            :key="student.studentId"
            :label="student.studentName"
            :value="student.studentId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="选择日期">
        <el-select
          v-model="batchRemarkForm.days"
          multiple
          placeholder="选择周内的日期"
          style="width: 100%"
        >
          <el-option
            v-for="d in weekDays"
            :key="d.date"
            :label="`${d.dayName} (${d.dateDisplay})`"
            :value="d.date"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="选择课程">
        <el-select
          v-model="batchRemarkForm.periods"
          multiple
          placeholder="选择课程时段"
          style="width: 100%"
        >
          <el-option
            v-for="period in timePeriods"
            :key="period.id"
            :label="period.name"
            :value="period.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备注内容">
        <el-input v-model="batchRemarkForm.remark" type="textarea" :rows="5" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="$emit('update:batchRemarkDialogVisible', false)">取消</el-button>
      <el-button type="primary" @click="$emit('confirmBatchRemark')">确定</el-button>
    </template>
  </el-dialog>

  <!-- 备注对话框 -->
  <el-dialog :model-value="remarkDialogVisible" @update:model-value="$emit('update:remarkDialogVisible', $event)" title="备注" width="500px">
    <el-input
      v-model="remarkForm.text"
      type="textarea"
      :rows="8"
      placeholder="请输入备注"
    />
    <template #footer>
      <el-button @click="$emit('update:remarkDialogVisible', false)">取消</el-button>
      <el-button type="primary" @click="$emit('saveRemark')">保存</el-button>
    </template>
  </el-dialog>

  <!-- 数据库管理对话框 -->
  <el-dialog :model-value="dbManagementDialogVisible" @update:model-value="$emit('update:dbManagementDialogVisible', $event)" title="数据库管理" width="500px">
    <div class="db-management-dialog">
      <div class="db-options">
        <el-button
          type="primary"
          size="large"
          class="db-option-btn"
          @click="$emit('downloadDatabase')"
        >
          <el-icon><Download /></el-icon>
          下载数据库备份
        </el-button>
        <div class="import-section">
          <el-button
            type="success"
            size="large"
            class="db-option-btn"
            @click="$emit('uploadDatabase')"
          >
            <el-icon><Upload /></el-icon>
            上传数据库备份
          </el-button>
          <input
            :ref="(el) => $emit('setDbFileInputRef', el)"
            type="file"
            accept=".db"
            style="display: none"
            @change="$emit('handleDatabaseUpload', $event)"
          />
          <div class="import-tip">
            请选择 .db 格式的数据库文件
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <el-button @click="$emit('update:dbManagementDialogVisible', false)">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Warning, Download, Upload } from "@element-plus/icons-vue";
import { addClassRules, addStudentRules } from "@/rules/attendanceRule";
import type { ClassInfo, Student, WeekDay } from "@/types/attendanceType";
import { attendanceStatuses, timePeriods } from "@/constants/attendanceConstants";

interface Props {
  // 对话框状态
  addClassDialogVisible: boolean;
  addStudentDialogVisible: boolean;
  importStudentsDialogVisible: boolean;
  deleteClassDialogVisible: boolean;
  deleteStudentDialogVisible: boolean;
  batchDialogVisible: boolean;
  batchRemarkDialogVisible: boolean;
  remarkDialogVisible: boolean;
  dbManagementDialogVisible: boolean;
  
  // 表单数据
  addClassForm: {
    name: string;
    headTeacher: string;
  };
  addStudentForm: {
    studentId: string;
    name: string;
  };
  importStudentsForm: {
    rawText: string;
  };
  batchForm: {
    studentIds: string[];
    dateRange: string[];
    days: string[];
    periods: string[];
    status: string;
  };
  batchRemarkForm: {
    studentIds: string[];
    days: string[];
    periods: string[];
    remark: string;
  };
  remarkForm: {
    text: string;
  };
  
  // 其他数据
  selectedClass: ClassInfo | null;
  selectedClassIds: number[];
  selectedStudentIds: string[];
  attendanceData: Student[];
  weekDays: WeekDay[];
}

interface Emits {
  (e: "update:addClassDialogVisible", value: boolean): void;
  (e: "update:addStudentDialogVisible", value: boolean): void;
  (e: "update:importStudentsDialogVisible", value: boolean): void;
  (e: "update:deleteClassDialogVisible", value: boolean): void;
  (e: "update:deleteStudentDialogVisible", value: boolean): void;
  (e: "update:batchDialogVisible", value: boolean): void;
  (e: "update:batchRemarkDialogVisible", value: boolean): void;
  (e: "update:remarkDialogVisible", value: boolean): void;
  (e: "update:dbManagementDialogVisible", value: boolean): void;
  (e: "confirmAddClass", formData: { name: string; headTeacher: string }): void;
  (e: "confirmAddStudent", formData: { studentId: string; name: string }): void;
  (e: "confirmImportStudents"): void;
  (e: "confirmDeleteClasses"): void;
  (e: "confirmDeleteStudents"): void;
  (e: "confirmBatchUpdate"): void;
  (e: "confirmBatchRemark"): void;
  (e: "saveRemark"): void;
  (e: "downloadDatabase"): void;
  (e: "uploadDatabase"): void;
  (e: "handleDatabaseUpload", event: Event): void;
  (e: "setDbFileInputRef", el: any): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// 表单引用
const addClassFormRef = ref();
const addStudentFormRef = ref();

// 处理添加班级
const handleConfirmAddClass = async () => {
  if (!addClassFormRef.value) return;
  
  try {
    await addClassFormRef.value.validate();
    emit('confirmAddClass', { ...props.addClassForm });
  } catch (error) {
    console.error('表单验证失败:', error);
  }
};

// 处理添加学生
const handleConfirmAddStudent = async () => {
  if (!addStudentFormRef.value) return;
  
  try {
    await addStudentFormRef.value.validate();
    emit('confirmAddStudent', { ...props.addStudentForm });
  } catch (error) {
    console.error('表单验证失败:', error);
  }
};
</script>
