<script setup lang="ts">
import { ref } from 'vue'
import Lottery from './lottery/Lottery.vue'
import SetupLottery from './lottery/LotteryManager.vue'

const currentComponent = ref<'getLottery' | 'setupLottery'>('getLottery')

const switchToGetLotteryPage = (): void => {
    currentComponent.value = 'getLottery'
}

const switchToSetupLotteryPage = (): void => {
    currentComponent.value = 'setupLottery'
}
</script>

<template>
    <el-container direction="vertical">
        <nav>
            <el-button type="primary" plain :class="{ 'is-active': currentComponent === 'getLottery' }"
                @click="switchToGetLotteryPage">
                抽奖
            </el-button>
            <el-button type="primary" plain :class="{ 'is-active': currentComponent === 'setupLottery' }"
                @click="switchToSetupLotteryPage">
                奖项设置
            </el-button>
        </nav>
        <el-divider />
        <transition name="fade" mode="out-in">
            <el-container :key="currentComponent">
                <component :is="currentComponent === 'getLottery' ? Lottery : SetupLottery" />
            </el-container>
        </transition>
    </el-container>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
}
</style>
