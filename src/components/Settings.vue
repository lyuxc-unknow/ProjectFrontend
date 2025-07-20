<script setup lang="ts">
import axios from 'axios'
import { ElMessage } from 'element-plus'

interface ApiResponse {
  code: number
  message: string
}

const initDatabase = async (): Promise<void> => {
  try {
    const response = await axios.post<ApiResponse>('/api/auth/init')

    if (response.data.code === 200) {
      ElMessage.success(response.data.message || '初始化成功')
    } else {
      ElMessage.warning(response.data.message || '数据库已初始化')
    }
  } catch (error: any) {
    ElMessage.error('初始化失败，请检查网络或后端服务')
    console.error(error)
  }
}
</script>

<template>
    <!-- <div>这里是设置页面</div> -->
    <el-button type="warning" @click="initDatabase">初始化数据库</el-button>
</template>