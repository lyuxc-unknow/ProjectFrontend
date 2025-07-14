<template>
    <div class="login-container">
        <el-card class="login-card">
            <h2 class="login-title">欢迎登录</h2>
            <el-form :model="loginForm" :rules="rules" ref="loginRef" label-width="80px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="loginForm.username" placeholder="请输入用户名" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleLogin" :loading="loading">登录</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const loginRef = ref(null)
const loading = ref(false)

const loginForm = ref({
    username: '',
    password: ''
})

const rules = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = () => {
    loginRef.value.validate(async (valid) => {
        if (!valid) {
            ElMessage.error('请填写完整信息')
            return
        }

        loading.value = true
        try {
            const response = await axios.post('/api/login', {
                username: loginForm.value.username,
                password: loginForm.value.password
            })

            const { code, message, token } = response.data
            if (code === 200) {
                ElMessage.success(message || '登录成功')
                localStorage.setItem('token', token)
                router.push("/dashboard")
                setTimeout(() => {
                    location.reload()
                }, 1000);
            } else {
                ElMessage.error(message || '登录失败')
            }
        } catch (err) {
            ElMessage.error('网络或服务器错误')
            console.error(err)
        } finally {
            loading.value = false
        }
    })
}

onMounted(() => {
    if (localStorage.getItem('token') !== null) {
        localStorage.removeItem('token');
        setTimeout(() => {
            location.reload();
        }, 100)
    }
}
)
</script>


<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    background-image: url("https://www.loliapi.com/acg/pc/");
    background-size: cover;
}

.login-card {
    width: 400px;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.login-title {
    text-align: center;
    margin-bottom: 20px;
    font-size: 24px;
    color: #333;
}
</style>