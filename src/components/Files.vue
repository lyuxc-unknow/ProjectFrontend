<script setup>
import { ref } from 'vue'
import FileUploadPage from './file/FileUpload.vue'
import FileDownloadPage from './file/FileDonwload.vue'

const currentComponent = ref('download')

const switchToDownloadPage = () => {
    currentComponent.value = 'download'
}

const switchToUploadPage = () => {
    currentComponent.value = 'upload'
}
</script>

<template>
    <el-container direction="vertical">
        <nav style="display: flex;">
            <el-button type="primary" plain :class="{ 'is-active': currentComponent === 'download' }"
                @click="switchToDownloadPage">
                文件下载
            </el-button>
            <el-button type="primary" plain :class="{ 'is-active': currentComponent === 'upload' }"
                @click="switchToUploadPage">
                文件上传
            </el-button>
        </nav>
        <el-divider />
        <transition name="fade" mode="out-in">
            <el-container :key="currentComponent">
                <component :is="currentComponent === 'download' ? FileDownloadPage : FileUploadPage" />
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
