<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import Login from '@/components/Login.vue'

const router = useRouter()
const route = useRoute()
const isLogin = ref<boolean>(false)

interface VerifyResponse {
  code: number
  message: string
}

// 菜单高亮同步
const activeMenu = computed((): string => {
  if (route.path.startsWith('/dashboard')) return '1'
  if (route.path.startsWith("/file")) return '2'
  if (route.path.startsWith("/lottery")) return '3'
  if (route.path.startsWith("/todolist")) return '4'
  if (route.path.startsWith('/settings')) return '5'
  if (route.path.startsWith('/login')) return '6'
  return '1'
})

const logout = (): void => {
  router.push("/login")
  localStorage.removeItem("token")
  setTimeout(() => {
    location.reload()
  }, 100);
}

// 菜单点击跳转
function handleMenuSelect(index: string): void {
  if (index === '1') router.push('/dashboard')
  if (index === '2') router.push('/file')
  if (index === '3') router.push('/lottery')
  if (index === '4') router.push('/todolist')
  if (index === '5') router.push('/settings')
  if (index === '6') router.push('/login')
}

onMounted(async (): Promise<void> => {
  const tokenData = localStorage.getItem('token')

  if (!tokenData || !tokenData.includes("+")) {
    router.push('/login')
    return
  }

  const [username, token] = tokenData.split("+")

  if (username && token) {
    try {
      const res = await axios.post<VerifyResponse>('/api/auth/verify', {
        username,
        token
      })

      if (res.data.code !== 200) {
        ElMessage.warning('登录状态已过期，请重新登录')
        router.push('/login')
      } else {
        isLogin.value = true
      }
    } catch (error: any) {
      ElMessage.error('验证失败，服务器无响应')
      console.error(error)
    }
  } else {
    router.push('/login')
  }
})
</script>

<template>
  <div class="root-container">
    <div class="root-container" v-if="!isLogin">
      <Login></Login>
    </div>
    <el-container v-else class="root-container">
      <el-aside width="200px" class="aside">
        <el-menu :default-active="activeMenu" background-color="#2d3a4b" text-color="#fff" active-text-color="#409EFF"
          @select="handleMenuSelect">
          <el-menu-item index="1"><i class="el-icon-menu"></i>仪表盘</el-menu-item>
          <el-menu-item index="2"><i class="el-icon-menu"></i>文件管理</el-menu-item>
          <el-menu-item index="3"><i class="el-icon-menu"></i>抽奖</el-menu-item>
          <el-menu-item index="4"><i class="el-icon-menu"></i>待办事项</el-menu-item>
          <el-menu-item index="5"><i class="el-icon-setting"></i>设置</el-menu-item>
          <el-menu-item index="6" @click="logout"><i class="el-icon-menu"></i>登出</el-menu-item>
        </el-menu>
      </el-aside>
      <el-container class="main-container">
        <el-main class="main">
          <el-watermark style="height: 100%;width: 100%;" content="testing">
            <router-view />
          </el-watermark>
        </el-main>
        <el-footer class="footer">
          <div class="footer-content">
            <span>© 2025 lyuxc_</span>
          </div>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  max-width: 100%;
  display: flex;
  width: 100%;
  height: 100%;
}

.root-container {
  display: flex;
  height: 100vh;
  width: 100%;
}

.aside {
  background: #2d3a4b;
  transition: width 0.2s;
}

.main-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.main {
  background: #f0f2f5;
  overflow: auto;
  flex: 1 1 0%;
  min-height: 0;
}

.footer {
  background: #f0f2f5;
  height: 10px;
  display: flex;
  align-items: center;
  text-align: center;
}

@media (max-width: 600px) {
  .aside {
    width: 60px !important;
  }
}
</style>