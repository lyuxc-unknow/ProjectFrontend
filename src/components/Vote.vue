<script setup lang="ts">
import { ref } from 'vue'
import Vote from './vote/Vote.vue'
import CreateVote from './vote/CreateVote.vue'

const currentComponent = ref<'vote' | 'create'>('vote')

const switchToVotePage = (): void => {
    currentComponent.value = 'vote'
}

const switchToCreatePage = (): void => {
    currentComponent.value = 'create'
}
</script>

<template>
    <el-container direction="vertical">
        <nav style="display: flex;">
            <el-button type="primary" plain :class="{ 'is-active': currentComponent === 'vote' }"
                @click="switchToVotePage">
                投票
            </el-button>
            <el-button type="primary" plain :class="{ 'is-active': currentComponent === 'create' }"
                @click="switchToCreatePage">
                新建投票
            </el-button>
        </nav>
        <el-divider />
        <transition name="fade" mode="out-in">
            <el-container :key="currentComponent">
                <component :is="currentComponent === 'vote' ? Vote : CreateVote" />
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
