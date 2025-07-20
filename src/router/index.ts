import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Dashboard from '@/components/Dashboard.vue'
import FileDownloadAndUpload from '@/components/Files.vue'
import Settings from '@/components/Settings.vue'
// import Login from '@/components/Login.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/login' },
  { path: '/dashboard', component: Dashboard },
  { path: '/file', component: FileDownloadAndUpload },
  { path: '/file/download', component: FileDownloadAndUpload },
  { path: '/file/upload', component: FileDownloadAndUpload },
  { path: '/settings', component: Settings },
  // 禁止嵌入login页
  // { path: '/login', component: Login },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 