<template>
  <li 
    class="flex items-center justify-between gap-task-gap p-task-pad border border-border bg-card rounded-btn transition-all"
    :class="{ 'opacity-60': task.done }"
  >
    <div class="flex items-center gap-2 flex-1 min-w-0">
      <input 
        :id="`cb-${task.id}`"
        ref="checkboxRef"
        type="checkbox" 
        :checked="task.done"
        @change="$emit('toggle', task.id)"
        class="w-4 h-4 rounded border-border bg-bg text-done accent-done cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        :aria-labelledby="`cb-${task.id} title-${task.id}`"
      />
      <span 
        :id="`title-${task.id}`"
        class="text-task-item text-text break-all select-none"
        :class="{ 'line-through text-muted': task.done }"
      >
        <span v-if="task.done" class="sr-only">(выполнено) </span>
        {{ task.title }}
      </span>
    </div>

    <div class="flex items-center gap-modal-field-gap shrink-0">
      <button 
        type="button" 
        class="w-icon-btn h-icon-btn inline-flex items-center justify-center border border-border bg-card text-text rounded-icon-btn cursor-pointer transition-all hover:brightness-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        :aria-label="`Редактировать задачу: ${task.title}`"
        @click="$emit('edit', task)"
      >
        <span aria-hidden="true">&#9998;</span>
      </button>

      <button 
        type="button" 
        class="w-icon-btn h-icon-btn inline-flex items-center justify-center border border-border bg-card text-text rounded-icon-btn cursor-pointer transition-all hover:brightness-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        :aria-label="`Удалить задачу: ${task.title}`"
        @click="$emit('delete', task.id)"
      >
        <span aria-hidden="true">&#128465;</span>
      </button>
    </div>
  </li>
</template>

<script setup>
  import { ref } from 'vue'

  defineProps({
    task: {
      type: Object,
      required: true
    }
  })
  defineEmits(['toggle', 'edit', 'delete'])
  const checkboxRef = ref(null)

  function focusCheckbox() {
    checkboxRef.value?.focus()
  }
  defineExpose({
    focusCheckbox
  })
</script>