<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const poolList = ref([])
const selectedPool = ref('')
const count = ref(1)
const results = ref([])
const loading = ref(false)

const fetchPools = async () => {
    try {
        const res = await axios.get('/api/lottery/pools')
        poolList.value = res.data.pools || []
        if (poolList.value.length > 0) {
            selectedPool.value = poolList.value[0]
        }
    } catch (err) {
        ElMessage.error('奖池列表获取失败')
    }
}

const draw = async () => {
    if (!selectedPool.value || count.value < 1) {
        ElMessage.warning('请选择奖池并设置有效数量')
        return
    }

    loading.value = true
    results.value = []

    try {
        const res = await axios.post('/api/lottery/draw', {
            count: count.value,
            poolId: selectedPool.value
        })
        results.value = res.data.items || []
        ElMessage.success('抽奖成功')
    } catch (err) {
        console.error(err)
        ElMessage.error('抽奖失败')
    } finally {
        loading.value = false
    }
}

const clearResults = () => {
    results.value = []
    ElMessage.info('结果已清除')
}

onMounted(fetchPools)
</script>

<template>
    <div class="lottery-container">
        <el-card class="box-card" shadow="hover">
            <template #header>
                <div class="card-header">🎯 简洁版奖池抽奖</div>
            </template>

            <!-- 表单区域 -->
            <el-form :inline="true" class="form-area">
                <el-form-item label="选择奖池">
                    <el-select v-model="selectedPool" placeholder="请选择奖池" style="width: 200px">
                        <el-option v-for="poolId in poolList" :key="poolId" :label="poolId" :value="poolId" />
                    </el-select>
                </el-form-item>

                <el-form-item label="抽取数量">
                    <el-input-number v-model="count" :min="1" :max="20" />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" :loading="loading" @click="draw">抽奖</el-button>
                    <el-button type="danger" :disabled="loading" @click="clearResults" class="ml-2">
                        清除结果
                    </el-button>
                </el-form-item>
            </el-form>

            <el-divider />

            <!-- 抽奖结果 -->
            <div v-if="results.length">
                <el-alert title="抽奖结果：" type="success" show-icon class="mb-4" />

                <div class="result-scroll">
                    <el-tag v-for="(item, index) in results" :key="index" type="success" effect="light"
                        class="result-tag">
                        {{ item }}
                    </el-tag>
                </div>
            </div>

            <div v-else class="text-gray-500 text-center mt-4">暂无抽奖结果</div>
        </el-card>
    </div>
</template>

<style scoped>
.lottery-container {
    max-width: 720px;
    margin: 40px auto;
    padding: 20px;
}

.card-header {
    font-size: 20px;
    font-weight: bold;
}

.ml-2 {
    margin-left: 0.5rem;
}

.mb-4 {
    margin-bottom: 1rem;
}

.result-tag {
    margin: 6px;
    font-size: 16px;
}

.result-scroll {
    max-height: 300px;
    overflow-y: auto;
    padding: 4px;
    border-radius: 8px;
}
</style>