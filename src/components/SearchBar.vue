<template>
  <form class="flex items-center gap-search-gap flex-1" role="search" @submit.prevent>
    <label for="search-input" class="sr-only">Поиск по названию</label>
    <input 
      id="search-input" 
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="w-full py-search-py px-search-px rounded-search-input border border-border bg-card text-text placeholder-muted tablet:py-[calc(var(--spacing-search-py)+2px)] tablet:px-[calc(var(--spacing-search-px)+2px)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" 
      type="search" 
      placeholder="Поиск задач..."
    />
  </form>
</template>

<script setup>
  defineProps({
    modelValue: {
      type: String,
      required: true
    }
  })
  defineEmits(['update:modelValue'])
</script>