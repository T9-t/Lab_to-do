import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, AuthResult } from '../types/user'

export const useUserStore = defineStore(
  'user',
  () => {
    const users = ref<User[]>([])
    const currentUser = ref<User | null>(null)

    const isAuthenticated = computed(() => currentUser.value !== null)

    function register(email: string, password: string): AuthResult {
      const normalizedEmail = email.trim().toLowerCase()
      const exists = users.value.some(
        (u) => u.email.toLowerCase() === normalizedEmail
      )
      if (exists) {
        return {
          success: false,
          message: 'Пользователь с таким email уже зарегистрирован'
        }
      }

      const newUser: User = {
        id: Date.now().toString(),
        email: email.trim(),
        password
      }
      users.value.push(newUser)
      return { success: true }
    }

    function login(email: string, password: string): AuthResult {
      const normalizedEmail = email.trim().toLowerCase()
      const user = users.value.find(
        (u) =>
          u.email.toLowerCase() === normalizedEmail && u.password === password
      )
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
  },
  {
    persist: true
  }
)
