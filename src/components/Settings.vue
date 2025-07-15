<!-- Settings.vue -->
<template>
    <div>这里是设置页面</div>
    <el-button type="warning" @click="initDatabase">初始化数据库</el-button>
</template>

<script setup>
import axios from 'axios'
import { ElMessage } from 'element-plus'

const initDatabase = async () => {
  try {
    const response = await axios.post('/api/auth/init')

    if (response.data.code === 200) {
      ElMessage.success(response.data.message || '初始化成功')
    } else {
      ElMessage.warning(response.data.message || '数据库已初始化')
    }
  } catch (error) {
    ElMessage.error('初始化失败，请检查网络或后端服务')
    console.error(error)
  }
}
</script>