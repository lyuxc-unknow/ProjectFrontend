<script setup lang="ts">
import { ElMessage } from 'element-plus'
import type { UploadProps, UploadUserFile } from 'element-plus'

// 鉴权改进:传入token
const headers: Record<string, string> = {
  // Authorization: `Bearer ${localStorage.getItem('token')}`
}

const handleSuccess: UploadProps['onSuccess'] = (response: any, file: UploadUserFile) => {
  ElMessage.success(`${file.name} 上传成功`)
}

const handleError: UploadProps['onError'] = (error: any, file: UploadUserFile) => {
  ElMessage.error(`${file.name} 上传失败`)
}
</script>

<template>
  <div class="upload-container">
    <el-card class="upload-card">
      <h2 class="upload-title">上传文件到服务器</h2>
      <el-upload class="upload-area" drag action="/api/file/upload" :headers="headers" :on-success="handleSuccess"
        :on-error="handleError" multiple>
        <div class="upload-area-size">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或 <em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">仅限普通文件类型，文件会自动上传</div>
        </div>
      </el-upload>
    </el-card>
  </div>
</template>

<style scoped>
.upload-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.upload-card {
  width: 800px;
  height: 480px;
  padding: 0px;
}

.upload-title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 22px;
  color: #333;
}

.upload-area {
  width: 100%;
  height: 300px;
}

.upload-area-size {
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>