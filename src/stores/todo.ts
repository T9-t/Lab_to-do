import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './user'
import type { TodoItem } from '../types/todo'

export const useTodoStore = defineStore(
  'todo',
  () => {
    const tasks = ref<TodoItem[]>([])
    const userStore = useUserStore()

    const userTasks = computed<TodoItem[]>(() => {
      const currentUser = userStore.currentUser
      if (!currentUser) return []
      return tasks.value.filter((task) => task.userId === currentUser.id)
    })

    function generateId(): string {
      return (
        't_' +
        Date.now().toString(36) +
        '_' +
        Math.random().toString(36).slice(2, 6)
      )
    }

    function addTask(title: string) {
      const currentUser = userStore.currentUser
      if (!currentUser) return

      tasks.value.push({
        id: generateId(),
        userId: currentUser.id,
        title: title.trim(),
        done: false
      })
    }

    function toggleTask(id: TodoItem['id']) {
      const currentUserId = userStore.currentUser?.id
      if (!currentUserId) return

      const task = tasks.value.find((t) => t.id === id)
      if (task && task.userId === currentUserId) {
        task.done = !task.done
      }
    }

    function editTask(id: TodoItem['id'], newTitle: string) {
      const currentUserId = userStore.currentUser?.id
      if (!currentUserId) return

      const task = tasks.value.find((t) => t.id === id)
      if (task && task.userId === currentUserId) {
        task.title = newTitle.trim()
      }
    }

    function deleteTask(id: TodoItem['id']) {
      const currentUserId = userStore.currentUser?.id
      if (!currentUserId) return

      tasks.value = tasks.value.filter(
        (t) => !(t.id === id && t.userId === currentUserId)
      )
    }

    return { tasks, userTasks, addTask, toggleTask, editTask, deleteTask }
  },
  {
    persist: true
  }
)
