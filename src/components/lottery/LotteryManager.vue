<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

interface NewPool {
    poolName: string
}

interface NewItem {
    poolId: string
    name: string
}

const newPool = ref<NewPool>({ poolName: '' })
const newItem = ref<NewItem>({ poolId: '', name: '' })

const poolOptions = ref<string[]>([])

const fetchPools = async (): Promise<void> => {
    try {
        const res = await axios.get<{ pools: string[] }>('/api/lottery/pools')
        poolOptions.value = res.data.pools || []
    } catch {
        ElMessage.error('获取奖池失败')
    }
}

const createPool = async (): Promise<void> => {
    if (!newPool.value.poolName.trim()) {
        ElMessage.warning('请输入奖池名称')
        return
    }
    try {
        await axios.post('/api/lottery/pools', newPool.value)
        ElMessage.success('奖池创建成功')
        newPool.value.poolName = ''
        await fetchPools()
    } catch {
        ElMessage.error('创建失败，请重试')
    }
}

const addItem = async (): Promise<void> => {
    if (!newItem.value.poolId) {
        ElMessage.warning('请选择奖池')
        return
    }
    if (!newItem.value.name.trim()) {
        ElMessage.warning('请输入奖项名称')
        return
    }
    try {
        await axios.post(`/api/lottery/pool/${newItem.value.poolId}/items`, {
            name: newItem.value.name,
        })
        ElMessage.success('添加成功')
        newItem.value.name = ''
    } catch {
        ElMessage.error('添加失败')
    }
}
</script>

<template>
    <div class="p-6 max-w-lg mx-auto">
        <el-card shadow="always" class="mb-6">
            <h2 class="text-lg font-bold mb-4">新建奖池</h2>
            <el-form :model="newPool" label-width="80px" class="w-full">
                <el-form-item label="奖池名称">
                    <el-input v-model="newPool.poolName" placeholder="请输入奖池名称" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="createPool">创建奖池</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <el-card shadow="always">
            <h2 class="text-lg font-bold mb-4">向已有奖池添加奖项</h2>
            <el-form :model="newItem" label-width="80px" class="w-full">
                <el-form-item label="奖池选择">
                    <el-select v-model="newItem.poolId" placeholder="请选择奖池" @focus="fetchPools">
                        <el-option v-for="poolId in poolOptions" :key="poolId" :label="poolId" :value="poolId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="奖项名称">
                    <el-input v-model="newItem.name" placeholder="请输入奖项名称" />
                </el-form-item>
                <el-form-item>
                    <el-button type="success" @click="addItem">添加奖项</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<style scoped>
.el-card {
    margin-bottom: 24px;
}
</style>