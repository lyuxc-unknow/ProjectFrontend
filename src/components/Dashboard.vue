<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

interface Tile {
  title: string
  value: string | number
}

const tiles = ref<Tile[]>([])
const error = ref<string | null>(null)
const loading = ref<boolean>(true)

const apiData = async (): Promise<void> => {
  try {
    loading.value = false
    const res = await axios.get<Tile[]>('/api/dashboard')
    tiles.value = res.data
    error.value = null
  } catch (e: any) {
    error.value = '获取数据失败' + e.message
    loading.value = true
  }
}

let timer: number | null = null

onMounted(() => {
  timer = setInterval(apiData, 1500)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
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
