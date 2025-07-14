<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

const tiles = ref([])
const error = ref(null)
const apiData = async () => {
  try {
    loading.value = false
    const res = await axios.get('/api/dashboard')
    tiles.value = res.data
    error.value = null
  } catch (e) {
    error.value = '获取数据失败' + e.value
    loading = true
  }
}

let timer = null
let loading = ref(true)

onMounted(() => {
  // 进入页面时发送一次不用发送一次请求到后端服务器，直接交给定时器处理
  // apiData()
  timer = setInterval(apiData, 500)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<template>
  <div>
    <div v-if="loading">加载中...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else class="tiles">
      <transition-group name="el-fade-in-linear">
        <div class="tile" v-for="(item, idx) in tiles" :key="idx">
          <div class="tile-title">{{ item.title }}</div>
          <div class="tile-value">{{ item.value }}</div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<style>
.tiles {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
}

.tile {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 24px 32px;
  min-width: 180px;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: box-shadow 0.2s;
}

.tile-title {
  font-size: 16px;
  color: #888;
  margin-bottom: 8px;
}

.tile-value {
  font-size: 28px;
  font-weight: bold;
  color: #409EFF;
}

.tile:hover {
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.15);
}
</style>
