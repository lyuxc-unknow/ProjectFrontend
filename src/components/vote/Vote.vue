<template>
  <div class="p-6 max-w-lg mx-auto space-y-6" style="display: flex;flex-direction: column;">
    <div style="display: flex;flex-direction: row;">
      <!-- 1️⃣ 选择投票 -->
      <el-card style="width: 300px;" shadow="hover">
        <h2 class="text-xl font-bold mb-4">请选择投票</h2>
        <el-select v-model="selectedPollId" placeholder="选择投票" @change="loadPoll" clearable style="width: 100%;">
          <el-option v-for="pollItem in polls" :key="pollItem.id ?? pollItem.title" :label="pollItem.title"
            :value="pollItem.id ?? pollItem.title" />
        </el-select>
      </el-card>

      <!-- 2️⃣ 投票选项 -->
      <el-card style="width: 600px;" v-if="poll" shadow="hover">
        <h2 class="text-xl font-bold mb-4">{{ poll.title }}</h2>

        <el-radio-group v-model="selectedOptionId" class="flex flex-col space-y-3" v-if="poll?.options?.length">
          <el-radio v-for="option in poll?.options ?? []" :key="option.id ?? option.optionText"
            :value="option.id ?? option.optionText">
            {{ option.optionText }}
          </el-radio>
        </el-radio-group>

        <div class="flex mt-4" v-if="poll?.options?.length">
          <el-button type="primary" class="ml-auto" :disabled="!selectedOptionId" @click="submitVote">
            提交投票
          </el-button>
        </div>
      </el-card>
    </div>

    <div>
      <!-- 3️⃣ 投票结果 -->
      <el-card v-if="voted && poll?.options && poll?.options.length">
        <h3 class="font-bold mb-2">投票结果：</h3>
        <div v-for="option in poll?.options ?? []" :key="option.id ?? option.optionText" class="flex items-center mb-2">
          <div style="display: flex;flex-direction: row;">
            <span class="w-24">{{ option.optionText }}</span>
            <el-progress :percentage="getVotePercentage(option.votes)" :text-inside="true" :stroke-width="20"
              style="flex: 1;padding-left: 15px;padding-right: 10px;" />
            <span class="ml-2 text-gray-500">{{ option.votes }}票</span>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

// 保存 voterId
const voterId = localStorage.getItem('voterId') || `user-${Date.now()}`
localStorage.setItem('voterId', voterId)

// 投票列表和选中状态
interface Option {
  id: number | string
  optionText: string
  votes: number
}

interface Poll {
  id: number | string
  title: string
  options: Option[]
}

const polls = ref<Poll[]>([])
const selectedPollId = ref<number | string | null>(null)
const poll = ref<Poll | null>(null)
const selectedOptionId = ref<number | string | null>(null)
const voted = ref(false)

// 获取所有投票
const loadAllPolls = async () => {
  try {
    const res = await axios.get<Poll[]>('/api/poll')
    // 过滤掉 id 为空的投票
    polls.value = res.data.filter(p => p.id !== null && p.id !== undefined)
  } catch (e: any) {
    console.error('获取投票列表失败', e)
  }
}

// 加载单个投票选项
const loadPoll = async () => {
  if (!selectedPollId.value) return
  try {
    const res = await axios.get<Poll>(`/api/poll/${selectedPollId.value}`)
    poll.value = res.data
    selectedOptionId.value = null
    voted.value = false
  } catch (e: any) {
    console.error('加载投票失败', e)
  }
}

// 计算百分比
const getVotePercentage = (votes: number) => {
  if (!poll.value) return 0
  const total = poll.value.options.reduce((sum, o) => sum + o.votes, 0)
  return total === 0 ? 0 : Math.round((votes / total) * 100)
}

// 提交投票
const submitVote = async () => {
  if (!selectedPollId.value || !selectedOptionId.value) return
  try {
    const res = await axios.post<Poll>(
      `/api/poll/${selectedPollId.value}/vote/${selectedOptionId.value}`,
      null,
      { params: { voterId } }
    )
    poll.value = res.data
    voted.value = true
    ElMessage({
    message: '投票成功',
    type: 'success',
    duration: 500,
    showClose: false, // 是否显示关闭按钮
  })
  } catch (e: any) {
    console.error('投票失败', e)
    alert('投票失败')
  }
}

onMounted(() => {
  loadAllPolls()
})
</script>
