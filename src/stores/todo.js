import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './user'

export const useTodoStore = defineStore('todo', () => {
  const tasks = ref([])
  const userStore = useUserStore()

  const userTasks = computed(() => {
    if (!userStore.currentUser) return []
    return tasks.value.filter(task => task.userId === userStore.currentUser.id)
  })

  function generateId() {
    return 't_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6)
  }

  function addTask(title) {
    if (!userStore.currentUser) return
    tasks.value.push({
      id: generateId(),
      userId: userStore.currentUser.id,
      title: title.trim(),
      done: false
    })
  }

  function toggleTask(id) {
    const task = tasks.value.find(t => t.id === id)
    if (task && task.userId === userStore.currentUser?.id) {
      task.done = !task.done
    }
  }

  function editTask(id, newTitle) {
    const task = tasks.value.find(t => t.id === id)
    if (task && task.userId === userStore.currentUser?.id) {
      task.title = newTitle.trim()
    }
  }

  function deleteTask(id) {
    tasks.value = tasks.value.filter(t => !(t.id === id && t.userId === userStore.currentUser?.id))
  }

  return { tasks, userTasks, addTask, toggleTask, editTask, deleteTask }
}, {
  persist: true
})