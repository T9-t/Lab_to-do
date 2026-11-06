<template>
  <div class="max-w-[900px] mx-auto my-8 px-4">
    <header class="flex justify-between items-center border-b border-border pb-4 mb-6 gap-3">
      <h1 class="text-xl font-bold text-primary">To-Do</h1>
      <nav class="flex gap-4 items-center">
        <RouterLink to="/" class="hover:text-primary transition focus-visible:outline-2" v-if="userStore.isAuthenticated">Задачи</RouterLink>
        <RouterLink to="/about" class="hover:text-primary transition focus-visible:outline-2">О приложении</RouterLink>
        
        <template v-if="!userStore.isAuthenticated">
          <RouterLink to="/login" class="hover:text-primary transition focus-visible:outline-2">Вход</RouterLink>
          <RouterLink to="/register" class="hover:text-primary transition focus-visible:outline-2">Регистрация</RouterLink>
        </template>
        <template v-else>
          <span class="text-sm text-muted hidden mobile:inline">{{ userStore.currentUser?.email }}</span>
          <button @click="handleLogout" class="bg-card hover:brightness-[0.97] text-text border border-border px-3 py-1.5 rounded-btn transition text-sm cursor-pointer focus-visible:outline-2">
            Выйти
          </button>
        </template>
      </nav>
    </header>

    <main>
      <RouterView/>
    </main>
  </div>
</template>

<script setup>
  import { useUserStore } from './stores/user'
  import { useRouter } from 'vue-router'

  const userStore = useUserStore()
  const router = useRouter()

  function handleLogout() {
    userStore.logout()
    router.push({ name: 'login' })
  }
</script>