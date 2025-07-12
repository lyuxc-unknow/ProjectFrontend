<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, computed } from 'vue'
import Login from '@/components/Login.vue'
const router = useRouter()
const route = useRoute()
let isLogin = localStorage.getItem("token") ? true : false

// 让菜单高亮与当前路由同步
const activeMenu = computed(() => {
  if (route.path.startsWith('/dashboard')) return '1'
  if (route.path.startsWith("/frp")) return '2'
  if (route.path.startsWith('/settings')) return '3'
  if (route.path.startsWith('/login')) return '4'
  return '1'
})

const logout = () => {
  localStorage.removeItem("token")
  router.push("/login")
  setTimeout(() => {
    location.reload()
  }, 100);
}

// 菜单点击跳转
function handleMenuSelect(index) {
  if (index === '1') router.push('/dashboard')
  if (index === '2') router.push('/frp')
  if (index === '3') router.push('/settings')
  if (index === '4') router.push('/login')
}
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
          <el-menu-item index="1"><i class="el-icon-menu"></i> 仪表盘</el-menu-item>
          <el-menu-item index="2"><i class="el-icon-menu"></i> Frp设置</el-menu-item>
          <el-menu-item index="3"><i class="el-icon-setting"></i> 设置</el-menu-item>
          <el-menu-item index="4" @click="logout"><i class="el-icon-menu"></i> 登出</el-menu-item>
        </el-menu>
      </el-aside>
      <el-container class="main-container">
        <el-main class="main">
          <router-view />
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
