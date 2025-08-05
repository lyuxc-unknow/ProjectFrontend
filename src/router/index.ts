import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Dashboard from '@/components/Dashboard.vue'
import FileDownloadAndUpload from '@/components/Files.vue'
import Settings from '@/components/Settings.vue'
import Lottery from '@/components/Lottery.vue'
import TodoList from '@/components/TodoList.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/login' },
  { path: '/dashboard', component: Dashboard },
  { path: '/file', component: FileDownloadAndUpload },
  { path: '/file/download', component: FileDownloadAndUpload },
  { path: '/file/upload', component: FileDownloadAndUpload },
  { path: '/settings', component: Settings },
  { path: '/lottery', component: Lottery },
  { path: '/todolist', component: TodoList },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 