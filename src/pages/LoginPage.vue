<template>
  <div class="max-w-[420px] mx-auto border border-gray-200 rounded-lg p-6 bg-surface shadow-sm">
    <h2 class="text-xl font-bold mb-4">Вход в аккаунт</h2>
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <label for="login-email" class="text-sm font-medium text-text">Email</label>
        <input id="login-email" type="email" v-model="email" required class="border border-gray-300 rounded px-3 py-2 text-base focus-visible:outline-3" />
      </div>
      <div class="flex flex-col gap-1">
        <label for="login-password" class="text-sm font-medium text-text">Пароль</label>
        <input id="login-password" type="password" v-model="password" required class="border border-gray-300 rounded px-3 py-2 text-base focus-visible:outline-3" />
      </div>
      <p v-if="error" class="text-red-600 text-sm font-medium" role="alert">{{ error }}</p>
      <button type="submit" class="bg-primary text-white font-medium py-2 rounded hover:bg-blue-700 transition cursor-pointer focus-visible:outline-3">
        Войти
      </button>
    </form>
    <p class="text-sm text-muted mt-4 text-center">
      Нет аккаунта? <RouterLink to="/register" class="text-primary underline">Зарегистрироваться</RouterLink>
    </p>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useUserStore } from '../stores/user'
  import { useRouter } from 'vue-router'

  const email = ref('')
  const password = ref('')
  const error = ref('')

  const userStore = useUserStore()
  const router = useRouter()

  function handleSubmit() {
    error.value = ''
    const res = userStore.login(email.value, password.value)
    if (res.success) {
      router.push({ name: 'todo' })
    } else {
      error.value = res.message
    }
  }
</script>
