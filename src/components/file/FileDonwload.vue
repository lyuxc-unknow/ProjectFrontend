<template>
  <el-card>
    <h3>可下载文件列表：</h3>
    <el-list v-if="fileList.length > 0">
      <el-list-item v-for="file in fileList" :key="file">
        <el-link :href="`/api/file/download?filename=${encodeURIComponent(file)}`" target="_blank">
          {{ file }}
        </el-link>
        <br>
      </el-list-item>
    </el-list>
    <p v-else>暂无文件</p>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const fileList = ref([])

onMounted(async () => {
  try {
    const res = await axios.get('/api/file/getFiles')
    fileList.value = res.data.files || []
  } catch (err) {
    console.error('获取文件列表失败', err)
  }
})
</script>