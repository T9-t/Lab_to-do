<template>
  <div>
    <header class="flex items-center flex-wrap gap-header-gap p-header-pad border-b border-border sticky top-0 bg-bg z-header tablet:gap-[calc(var(--spacing-header-gap)+4px)] tablet:py-[calc(var(--spacing-header-pad)+4px)] tablet:px-header-pad">
      <h1 class="sr-only">To-Do List</h1>
      
      <SearchBar v-model="searchQuery" />
      
      <button 
        ref="addButtonRef"
        type="button" 
        class="bg-primary text-text-white border-none py-btn-py px-btn-px rounded-btn cursor-pointer transition-all hover:brightness-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary tablet:py-[calc(var(--spacing-btn-py)+2px)] tablet:px-[calc(var(--spacing-btn-px)+4px)]"
        @click="openAddModal"
      >
        Добавить задачу
      </button>
    </header>

    <main class="max-w-container-max-w mx-auto my-container-my px-container-px desktop:my-[calc(var(--spacing-container-my)+16px)]">
      <TodoList 
        ref="todoListRef"
        :tasks="filteredTasks"
        @toggle-task="toggleTask"
        @edit-task="openEditModal"
        @delete-task="deleteTask"
      />
    </main>

    <AddTodoModal 
      :is-open="isModalOpen" 
      :editing-task="selectedTask"
      @close="closeModal"
      @save="saveTask"
    />
  </div>
</template>

<script setup>
  import { ref, computed, watch, nextTick } from 'vue'
  import SearchBar from './components/SearchBar.vue'
  import TodoList from './components/TodoList.vue'
  import AddTodoModal from './components/AddTodoModal.vue'

  const STORAGE_KEY = 'todo-app-v4'

  const tasks = ref(loadTasks())
  const searchQuery = ref('')
  const isModalOpen = ref(false)
  const selectedTask = ref(null)

  const addButtonRef = ref(null)
  const todoListRef = ref(null)

  function loadTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return []
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) 
        ? parsed.filter(t => t && typeof t.id === 'string' && typeof t.title === 'string' && typeof t.done === 'boolean') 
        : []
    } catch {
      return []
    }
  }

  watch(tasks, (newTasks) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks))
  }, { deep: true })

  const filteredTasks = computed(() => {
    const query = searchQuery.value.toLowerCase().trim()
    const list = tasks.value.filter(t => t.title.toLowerCase().includes(query))

    return [...list].sort((a, b) => Number(a.done) - Number(b.done))
  })

  function generateId() {
    return 't_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6)
  }

  function openAddModal() {
    selectedTask.value = null
    isModalOpen.value = true
  }

  function openEditModal(task) {
    selectedTask.value = task
    isModalOpen.value = true
  }

  async function closeModal() {
    isModalOpen.value = false
    selectedTask.value = null

    await nextTick()
    addButtonRef.value?.focus()
  }

  function saveTask({ id, title }) {
    if (id) {
      const task = tasks.value.find(t => t.id === id)
      if (task) task.title = title

    } else {
      tasks.value.push({
        id: generateId(),
        title,
        done: false
      })
    }
    closeModal()
  }

  function toggleTask(id) {
    const task = tasks.value.find(t => t.id === id)
    
    if (task) {
      task.done = !task.done
    }
  }

  async function deleteTask(id) {
    const currentIdx = filteredTasks.value.findIndex(t => t.id === id)
    tasks.value = tasks.value.filter(t => t.id !== id)
    
    await nextTick()
    const remainingCount = filteredTasks.value.length
    
    if (remainingCount > 0) {
      const nextTargetIdx = Math.min(currentIdx, remainingCount - 1)
      todoListRef.value?.focusItemAt(nextTargetIdx)
      
    } else {
      addButtonRef.value?.focus()
    }
  }
</script>