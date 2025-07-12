import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/components/Dashboard.vue'
import FprSetting from '@/components/FprSetting.vue'
import Settings from '@/components/Settings.vue'
import Login from '@/components/Login.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/dashboard', component: Dashboard },
  { path: '/frp', component: FprSetting},
  { path: '/frp/server', component: FprSetting},
  { path: '/frp/client', component: FprSetting},
  { path: '/settings', component: Settings },
  { path: '/login', component: Login },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
