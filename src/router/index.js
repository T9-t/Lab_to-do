import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '../stores/user'
import LoginPage from '../pages/LoginPage.vue'
import RegisterPage from '../pages/RegisterPage.vue'
import TodoPage from '../pages/TodoPage.vue'
import AboutPage from '../pages/AboutPage.vue'

const routes = [
  { path: '/login', name: 'login', component: LoginPage },
  { path: '/register', name: 'register', component: RegisterPage },
  { path: '/about', name: 'about', component: AboutPage },
  { 
    path: '/', 
    name: 'todo', 
    component: TodoPage,
    meta: { requiresAuth: true }
  },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    return { name: 'login' }
  }
  if ((to.name === 'login' || to.name === 'register') && userStore.isAuthenticated) {
    return { name: 'todo' }
  }
})

export default router