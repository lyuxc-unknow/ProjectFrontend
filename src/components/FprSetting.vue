<script setup>
import { ref } from 'vue'
import Server from './frp/Server.vue'
import Client from './frp/Client.vue'

const currentComponent = ref('server')

const switchToServer = () => {
    currentComponent.value = 'server'
}

const switchToClient = () => {
    currentComponent.value = 'client'
}
</script>

<template>
    <el-container direction="vertical">
        <nav style="display: flex;">
            <el-button 
                type="primary" 
                plain 
                :class="{ 'is-active': currentComponent === 'server' }"
                @click="switchToServer"
            >
                FrpServer配置
            </el-button>
            <el-button 
                type="primary" 
                plain 
                :class="{ 'is-active': currentComponent === 'client' }"
                @click="switchToClient"
            >
                FrpClient配置
            </el-button>
        </nav>
        <el-divider />
        <transition name="fade" mode="out-in">
            <el-container :key="currentComponent">
                <component :is="currentComponent === 'server' ? Server : Client" />
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

