import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const users = ref([])
  const currentUser = ref(null)

  const isAuthenticated = computed(() => currentUser.value !== null)

  function register(email, password) {
    const exists = users.value.some(u => u.email.toLowerCase() === email.toLowerCase())
    if (exists) {
      return { success: false, message: 'Пользователь с таким email уже зарегистрирован' }
    }
    const newUser = {
      id: Date.now().toString(),
      email: email.trim(),
      password: password
    }
    users.value.push(newUser)
    return { success: true }
  }

  function login(email, password) {
    const user = users.value.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
    if (!user) {
      return { success: false, message: 'Неверный email или пароль' }
    }
    currentUser.value = user
    return { success: true }
  }

  function logout() {
    currentUser.value = null
  }

  return { users, currentUser, isAuthenticated, register, login, logout }
}, {
  persist: true
})