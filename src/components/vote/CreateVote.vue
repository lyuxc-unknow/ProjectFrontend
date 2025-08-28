<template>
    <div class="p-6 max-w-lg mx-auto space-y-6">
        <el-card shadow="hover">
            <h2 class="text-xl font-bold mb-4">创建新投票</h2>

            <el-form label-position="top">
                <!-- 投票标题 -->
                <el-form-item label="投票标题">
                    <el-input v-model="poll.title" placeholder="请输入投票标题" />
                </el-form-item>

                <!-- 动态选项 -->
                <el-form-item label="选项">
                    <div class="flex flex-col space-y-2" style="display: flex;flex-direction: row;">
                        <!-- 现有选项 -->
                        <div v-for="(option, index) in poll.options" :key="index" class="flex items-center space-x-2">
                            <el-input v-model="option.optionText" placeholder="请输入选项内容" class="flex-1" />
                            <el-button type="danger" @click="removeOption(index)" :disabled="poll.options.length <= 2">
                                删除
                            </el-button>
                        </div>

                        <!-- 新增选项按钮平齐 -->
                        <div class="flex items-center space-x-2">
                            <!-- 占位空输入框保持对齐 -->
                            <el-input disabled placeholder="" class="flex-1" />
                            <el-button type="primary" plain @click="addOption">
                                新增选项
                            </el-button>
                        </div>
                    </div>
                </el-form-item>


                <!-- 提交按钮 -->
                <el-form-item>
                    <el-button type="success" @click="submitPoll">提交投票</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import axios from 'axios'

interface Option {
    optionText: string
}

interface Poll {
    title: string
    options: Option[]
}

// 初始化投票表单
const poll = reactive<Poll>({
    title: '',
    options: [
        { optionText: '' },
        { optionText: '' }
    ]
})

// 添加选项
const addOption = () => {
    poll.options.push({ optionText: '' })
}

// 删除选项
const removeOption = (index: number) => {
    if (poll.options.length > 2) {
        poll.options.splice(index, 1)
    }
}

// 提交投票
const submitPoll = async () => {
    // 校验输入
    if (!poll.title.trim()) {
        alert('投票标题不能为空')
        return
    }
    if (poll.options.some(o => !o.optionText.trim())) {
        alert('每个选项不能为空')
        return
    }

    // 构建干净的 payload，避免发送整个对象
    const payload = {
        title: poll.title,
        options: poll.options.map(o => ({ optionText: o.optionText }))
    }

    try {
        await axios.post('/api/poll', payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        alert('投票创建成功！')
        // 重置表单
        poll.title = ''
        poll.options = [{ optionText: '' }, { optionText: '' }]
    } catch (e: any) {
        alert(e.response?.data || '投票创建失败')
        console.error(e)
    }
}
</script>