<template>
  <section class="mt-todo-sec-mt" aria-labelledby="todo-list-title">
    <h2 id="todo-list-title" class="text-todo-sec-title m-0 mb-todo-sec-title-mb text-text font-bold">
      Список задач
    </h2>
    
    <ul v-if="tasks.length > 0" class="flex flex-col gap-task-gap">
      <TodoItem 
        v-for="(task, index) in tasks" 
        :key="task.id" 
        ref="itemRefs"
        :task="task"
        @toggle="$emit('toggle-task', $event)"
        @edit="$emit('edit-task', $event)"
        @delete="$emit('delete-task', $event)"
      />
    </ul>

    <div v-else class="text-muted text-center py-4">
      Список задач пуст или ничего не найдено
    </div>
  </section>
</template>

<script setup>
  import { ref, onBeforeUpdate } from 'vue'
  import TodoItem from './TodoItem.vue'

  defineProps({
    tasks: {
      type: Array,
      required: true
    }
  })
  defineEmits(['toggle-task', 'edit-task', 'delete-task'])

  const itemRefs = ref([])

  onBeforeUpdate(() => {
    itemRefs.value = []
  })

  function focusItemAt(index) {
    if (itemRefs.value[index]) {
      itemRefs.value[index].focusCheckbox()
    }
  }

  defineExpose({
    focusItemAt
  })
</script>