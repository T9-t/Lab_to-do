<template>
  <section class="mt-todo-sec-mt" aria-labelledby="todo-list-title">
    <h2
      id="todo-list-title"
      class="text-todo-sec-title m-0 mb-todo-sec-title-mb text-text font-bold"
    >
      Список задач
    </h2>

    <ul v-if="tasks.length > 0" class="flex flex-col gap-task-gap">
      <TodoItem
        v-for="task in tasks"
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

<script setup lang="ts">
import { ref, onBeforeUpdate } from 'vue'
import TodoItem from './TodoItem.vue'
import type { TodoItem as TodoItemType } from '../types/todo'

defineProps<{
  tasks: TodoItemType[]
}>()

defineEmits<{
  'toggle-task': [id: TodoItemType['id']]
  'edit-task': [task: TodoItemType]
  'delete-task': [id: TodoItemType['id']]
}>()

const itemRefs = ref<InstanceType<typeof TodoItem>[]>([])

onBeforeUpdate(() => {
  itemRefs.value = []
})

function focusItemAt(index: number) {
  itemRefs.value[index]?.focusCheckbox()
}

defineExpose({
  focusItemAt
})
</script>
