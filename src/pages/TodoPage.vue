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
        @toggle-task="handleToggleTask"
        @edit-task="openEditModal"
        @delete-task="handleDeleteTask"
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
  import { ref, computed, nextTick } from 'vue'
  import { useTodoStore } from '../stores/todo'
  import SearchBar from '../components/SearchBar.vue'
  import TodoList from '../components/TodoList.vue'
  import AddTodoModal from '../components/AddTodoModal.vue'

  const todoStore = useTodoStore()

  const searchQuery = ref('')
  const isModalOpen = ref(false)
  const selectedTask = ref(null)

  const addButtonRef = ref(null)
  const todoListRef = ref(null)

  const filteredTasks = computed(() => {
    const query = searchQuery.value.toLowerCase().trim()
    const list = todoStore.userTasks.filter(t => t.title.toLowerCase().includes(query))

    return [...list].sort((a, b) => Number(a.done) - Number(b.done))
  })

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
      todoStore.editTask(id, title)
    } else {
      todoStore.addTask(title)
    }
    closeModal()
  }

  function handleToggleTask(id) {
    todoStore.toggleTask(id)
  }

  async function handleDeleteTask(id) {
    const currentIdx = filteredTasks.value.findIndex(t => t.id === id)
    todoStore.deleteTask(id)
    
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