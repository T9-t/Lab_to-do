<template>
  <form
    class="flex items-center gap-search-gap flex-1"
    role="search"
    @submit.prevent
  >
    <label for="search-input" class="sr-only">Поиск по названию</label>
    <input
      id="search-input"
      :value="modelValue"
      class="w-full py-search-py px-search-px rounded-search-input border border-border bg-card text-text placeholder-muted tablet:py-[calc(var(--spacing-search-py)+2px)] tablet:px-[calc(var(--spacing-search-px)+2px)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      type="search"
      placeholder="Поиск задач..."
      @input="onInput"
    />
  </form>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onInput(event: Event) {
  if (event.target instanceof HTMLInputElement) {
    emit('update:modelValue', event.target.value)
  }
}
</script>
