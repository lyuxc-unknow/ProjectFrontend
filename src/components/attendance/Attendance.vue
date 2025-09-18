<template>
  <div class="attendance-container">
    <el-card class="header-card">
      <div class="header">
        <h2>学生请假管理系统</h2>
        <div class="date-selector">
          <el-date-picker
            v-model="selectedWeek"
            type="date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            placeholder="选择日期"
            @change="handleWeekChange"
          />
          <el-button type="primary" @click="showDbManagementDialog">
            <el-icon><UploadFilled /></el-icon>
            数据库管理
          </el-button>
        </div>
      </div>
    </el-card>

    <el-row :gutter="20" class="attendance-row">
      <!-- 左边班级列表 -->
      <el-col :span="6">
        <ClassList
          :classes="classes"
          :selected-class="selectedClass"
          :selected-class-ids="selectedClassIds"
          @show-add-class-dialog="showAddClassDialog"
          @show-delete-class-dialog="showDeleteClassDialog"
          @refresh-classes="refreshClasses"
          @export-all-attendance="() => exportAllAttendance(selectedWeek)"
          @export-problem-summary-all="() => exportProblemSummaryAll(selectedWeek)"
          @select-class="selectClass"
          @toggle-class-selection="toggleClassSelection"
        />
      </el-col>

      <!-- 右边选择班级后展开的考勤情况 -->
      <el-col :span="18">
        <AttendanceTable
          :selected-class="selectedClass"
          :attendance-data="attendanceData"
          :week-days="weekDays"
          :loading="loading"
          :selected-student-ids="selectedStudentIds"
          :current-page="currentPage"
          :page-size="pageSize"
          :total-students="totalStudents"
          @show-add-student-dialog="showAddStudentDialog"
          @show-import-students-dialog="showImportStudentsDialog"
          @show-delete-student-dialog="showDeleteStudentDialog"
          @export-attendance="() => exportAttendance(selectedClass, selectedWeek)"
          @export-problem-summary="() => exportProblemSummary(selectedClass, selectedWeek)"
          @batch-update="batchUpdate"
          @batch-remark="batchRemark"
          @handle-student-selection-change="handleStudentSelectionChange"
          @update-attendance="updateAttendance"
          @open-remark="openRemark"
          @handle-size-change="handleSizeChange"
          @handle-current-change="handleCurrentChange"
        />

        <el-empty v-if="!selectedClass" description="请先选择一个班级" />
      </el-col>
    </el-row>

    <!-- 对话框管理器 -->
    <DialogManager
      v-model:add-class-dialog-visible="addClassDialogVisible"
      v-model:add-student-dialog-visible="addStudentDialogVisible"
      v-model:import-students-dialog-visible="importStudentsDialogVisible"
      v-model:delete-class-dialog-visible="deleteClassDialogVisible"
      v-model:delete-student-dialog-visible="deleteStudentDialogVisible"
      v-model:batch-dialog-visible="batchDialogVisible"
      v-model:batch-remark-dialog-visible="batchRemarkDialogVisible"
      v-model:remark-dialog-visible="remarkDialogVisible"
      v-model:db-management-dialog-visible="dbManagementDialogVisible"
      :add-class-form="addClassForm"
      :add-student-form="addStudentForm"
      :import-students-form="importStudentsForm"
      :batch-form="batchForm"
      :batch-remark-form="batchRemarkForm"
      :remark-form="remarkForm"
      :selected-class="selectedClass"
      :selected-class-ids="selectedClassIds"
      :selected-student-ids="selectedStudentIds"
      :attendance-data="attendanceData"
      :week-days="weekDays"
      @confirm-add-class="confirmAddClass"
      @confirm-add-student="confirmAddStudent"
      @confirm-import-students="confirmImportStudents"
      @confirm-delete-classes="confirmDeleteClassesHandler"
      @confirm-delete-students="confirmDeleteStudents"
      @confirm-batch-update="confirmBatchUpdate"
      @save-remark="saveRemark"
      @download-database="downloadDatabase"
      @upload-database="uploadDatabase"
      @handle-database-upload="handleDatabaseUpload"
      @set-db-file-input-ref="setDbFileInputRef"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { UploadFilled } from "@element-plus/icons-vue";
import { AttendanceApi } from "@/api/attendance";
import "./Attendance.css";

// 导入组合式函数
import { useAttendanceData } from "@/composables/useAttendanceData";
import { useClassManagement } from "@/composables/useClassManagement";
import { useStudentManagement } from "@/composables/useStudentManagement";
import { useExport } from "@/composables/useExport";
import { useDatabase } from "@/composables/useDatabase";
import { dataProcessor } from "@/utils/attendance/dataProcessor";

// 导入子组件
import ClassList from "./ClassList.vue";
import AttendanceTable from "./AttendanceTable.vue";
import DialogManager from "./DialogManager.vue";

// 使用组合式函数
const {
  loading,
  selectedWeek,
  selectedClass,
  attendanceData,
  selectedStudentIds,
  pageSize,
  currentPage,
  totalStudents,
  weekDays,
  selectClass,
  handleSizeChange,
  handleCurrentChange,
  loadAttendanceData,
  handleWeekChange,
  updateAttendance,
  getMergedAttendanceStatus,
  handleStudentSelectionChange,
} = useAttendanceData();

const {
  classes,
  selectedClassIds,
  refreshClasses,
  toggleClassSelection,
  confirmDeleteClasses,
} = useClassManagement();

const {
  addStudentForm,
  importStudentsForm,
  addStudentFormRef,
  showAddStudentDialog: showAddStudentDialogBase,
  showImportStudentsDialog: showImportStudentsDialogBase,
  confirmImportStudents: confirmImportStudentsBase,
  showDeleteStudentDialog: showDeleteStudentDialogBase,
  confirmDeleteStudents: confirmDeleteStudentsBase,
  resetAddStudentForm,
  resetImportStudentsForm,
} = useStudentManagement(selectedStudentIds);

const {
  exportAttendance,
  exportAllAttendance,
  exportProblemSummaryAll,
  exportProblemSummary,
} = useExport();

const {
  dbFileInputRef,
  downloadDatabase,
  uploadDatabase,
  handleDatabaseUpload: handleDatabaseUploadBase,
} = useDatabase();

// 对话框状态
const addClassDialogVisible = ref(false);
const addStudentDialogVisible = ref(false);
const importStudentsDialogVisible = ref(false);
const deleteClassDialogVisible = ref(false);
const deleteStudentDialogVisible = ref(false);
const batchDialogVisible = ref(false);
const batchRemarkDialogVisible = ref(false);
const remarkDialogVisible = ref(false);
const dbManagementDialogVisible = ref(false);

// 表单数据
const addClassForm = reactive({
  name: "",
  headTeacher: ""
});

const batchForm = reactive({
  studentIds: [] as string[],
  dateRange: [] as string[],
  days: [] as string[],
  periods: [] as string[],
  status: "",
});

const batchRemarkForm = reactive({
  studentIds: [] as string[],
  days: [] as string[],
  periods: [] as string[],
  remark: "",
});

const remarkForm = reactive({
  studentId: "",
  classId: 0 as number,
  field: "",
  date: "",
  text: "",
});

// 新增班级相关方法
const showAddClassDialog = () => {
  addClassDialogVisible.value = true;
  // 重置表单
  Object.assign(addClassForm, {
    name: "",
    headTeacher: ""
  });
};

const confirmAddClass = async (formData: { name: string; headTeacher: string }) => {
  try {
    const response = await AttendanceApi.createClass(formData);

    if (response.data.code === 200) {
      ElMessage.success("班级创建成功");
      addClassDialogVisible.value = false;
      await refreshClasses();
    } else {
      ElMessage.error(response.data.message || "创建失败");
    }
  } catch (error: any) {
    if (error.response?.data?.message) {
      ElMessage.error(error.response.data.message);
    } else {
      ElMessage.error("创建失败");
    }
    console.error(error);
  }
};

// 学生管理相关方法
const showAddStudentDialog = () => {
  if (showAddStudentDialogBase(selectedClass.value)) {
    addStudentDialogVisible.value = true;
    resetAddStudentForm();
  }
};

const showImportStudentsDialog = () => {
  if (showImportStudentsDialogBase(selectedClass.value)) {
    importStudentsDialogVisible.value = true;
    resetImportStudentsForm();
  }
};

const showDeleteStudentDialog = () => {
  if (showDeleteStudentDialogBase()) {
    deleteStudentDialogVisible.value = true;
  }
};

const confirmAddStudent = async (formData: { studentId: string; name: string }) => {
  if (selectedClass.value) {
    try {
      const response = await AttendanceApi.createStudent({
        studentId: formData.studentId,
        studentName: formData.name,
        classId: selectedClass.value.id,
      });

      if (response.data.code === 200) {
        ElMessage.success("学生添加成功");
        addStudentDialogVisible.value = false;
        currentPage.value = 1;
        await loadAttendanceData();
        await refreshClasses();
      } else {
        ElMessage.error(response.data.message || "添加失败");
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        ElMessage.error(error.response.data.message);
      } else {
        ElMessage.error("添加失败");
      }
      console.error(error);
    }
  }
};

const confirmImportStudents = async () => {
  if (selectedClass.value) {
    const success = await confirmImportStudentsBase(selectedClass.value);
    if (success) {
      importStudentsDialogVisible.value = false;
      currentPage.value = 1;
      await loadAttendanceData();
      await refreshClasses();
    }
  }
};

const confirmDeleteStudents = async () => {
  if (selectedClass.value) {
    const success = await confirmDeleteStudentsBase(selectedClass.value);
    if (success) {
      deleteStudentDialogVisible.value = false;
      currentPage.value = 1;
      await loadAttendanceData();
      await refreshClasses();
    }
  }
};

// 删除班级
const showDeleteClassDialog = () => {
  if (selectedClassIds.value.length === 0) {
    ElMessage.warning("请先选择要删除的班级");
    return;
  }
  deleteClassDialogVisible.value = true;
};

const confirmDeleteClassesHandler = async () => {
  const success = await confirmDeleteClasses();
  if (success) {
    deleteClassDialogVisible.value = false;
    // 如果当前选中的班级被删除了，清空选择
    if (
      selectedClass.value &&
      selectedClassIds.value.includes(selectedClass.value.id)
    ) {
      selectedClass.value = null;
      attendanceData.value = [];
    }
  }
};

// 批量更新
const batchUpdate = () => {
  if (!attendanceData.value.length) {
    ElMessage.warning("没有学生数据");
    return;
  }
  batchDialogVisible.value = true;
};

// 批量备注
const batchRemark = () => {
  if (!attendanceData.value.length) {
    ElMessage.warning("没有学生数据");
    return;
    }
  // 预填选中学生
  batchRemarkForm.studentIds = [...selectedStudentIds.value];
  batchRemarkForm.days = [];
  batchRemarkForm.periods = [];
  batchRemarkForm.remark = "";
  batchRemarkDialogVisible.value = true;
};

const confirmBatchRemark = async () => {
  if (!selectedClass.value) return;
  if (
    !batchRemarkForm.studentIds.length ||
    !batchRemarkForm.days.length ||
    !batchRemarkForm.periods.length ||
    !batchRemarkForm.remark
  ) {
    ElMessage.warning("请填写完整的批量备注信息");
    return;
  }

  try {
    // 生成后端字段名（去重）
    const fieldSet = new Set<string>();
    batchRemarkForm.days.forEach((date) => {
      batchRemarkForm.periods.forEach((p) => {
        const f = dataProcessor.getBackendFieldName(date, p, weekDays.value);
        if (f) fieldSet.add(f);
      });
    });
    const field = Array.from(fieldSet);

    const resp = await AttendanceApi.batchSaveRemark({
      classId: selectedClass.value.id,
      week: selectedWeek.value,
      studentIds: batchRemarkForm.studentIds,
      field,
      remark: batchRemarkForm.remark,
    });

    if (resp.data?.code === 200) {
      ElMessage.success("批量备注成功");
      batchRemarkDialogVisible.value = false;
    } else {
      ElMessage.error(resp.data?.message || "批量备注失败");
    }
  } catch (e) {
    ElMessage.error("批量备注失败");
    console.error(e);
  }
};

const confirmBatchUpdate = async () => {
  if (
    !batchForm.studentIds.length ||
    (!batchForm.days.length && !batchForm.dateRange.length) ||
    !batchForm.periods.length ||
    !batchForm.status
  ) {
    ElMessage.warning("请填写完整的批量修改信息");
    return;
  }

  try {
    // 1) 生成日期数组：优先使用 days，其次兼容旧的 dateRange
    let dateList: string[] = [];
    if (batchForm.days && batchForm.days.length) {
      dateList = [...batchForm.days];
    } else if (batchForm.dateRange && batchForm.dateRange.length === 2) {
      const [startStr, endStr] = batchForm.dateRange;
      const startDate = new Date(startStr);
      const endDate = new Date(endStr);
      for (
        let d = new Date(startDate.getTime());
        d.getTime() <= endDate.getTime();
        d.setDate(d.getDate() + 1)
      ) {
        dateList.push(d.toISOString().split("T")[0]);
      }
    }

    // 2) 生成后端需要的字段名列表 field（去重）
    const fieldSet = new Set<string>();
    dateList.forEach((date) => {
      batchForm.periods.forEach((p) => {
        const f = dataProcessor.getBackendFieldName(date, p, weekDays.value);
        if (f) fieldSet.add(f);
      });
    });
    const field = Array.from(fieldSet);

    await AttendanceApi.batchUpdate({
      classId: selectedClass.value?.id as number,
      week: selectedWeek.value,
      studentIds: batchForm.studentIds,
      dateRange: batchForm.dateRange,
      field,
      status: batchForm.status,
    });
    ElMessage.success("批量修改成功");
    batchDialogVisible.value = false;
    currentPage.value = 1;
    await loadAttendanceData();
  } catch (error) {
    ElMessage.error("批量修改失败");
    console.error(error);
  }
};

// 备注相关
const openRemark = async (student: any, date: string, period: string) => {
  const backendField = dataProcessor.getBackendFieldName(date, period, weekDays.value);
  if (!backendField || !selectedClass.value) return;

  remarkForm.studentId = student.studentId;
  remarkForm.classId = selectedClass.value.id;
  remarkForm.field = backendField;
  remarkForm.date = date;
  remarkForm.text = "";
  try {
    const resp = await AttendanceApi.getRemark({
      studentId: remarkForm.studentId,
      classId: remarkForm.classId,
      week: selectedWeek.value,
      field: remarkForm.field,
    });
    remarkForm.text = resp.data?.data?.remark || "";
  } catch (e) {
    console.error(e);
  }
  remarkDialogVisible.value = true;
};

const saveRemark = async () => {
  try {
    await AttendanceApi.saveRemark({
      studentId: remarkForm.studentId,
      classId: remarkForm.classId,
      week: selectedWeek.value,
      field: remarkForm.field,
      remark: remarkForm.text,
    });
    ElMessage.success("备注已保存");
    remarkDialogVisible.value = false;
  } catch (e) {
    ElMessage.error("保存备注失败");
    console.error(e);
  }
};

// 数据库管理
const showDbManagementDialog = () => {
  dbManagementDialogVisible.value = true;
};

const setDbFileInputRef = (el: any) => {
  dbFileInputRef.value = el;
};

const handleDatabaseUpload = async (event: Event) => {
  const success = await handleDatabaseUploadBase(event);
  if (success) {
    await refreshClasses();
    if (selectedClass.value) {
      await loadAttendanceData();
    }
  }
};

// 初始化
onMounted(() => {
  // 设置默认日期为当前日期
  const today = new Date();
  selectedWeek.value = today.toISOString().split("T")[0];

  refreshClasses();
});
</script>