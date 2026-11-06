<template>
  <dialog 
    ref="dialogRef"
    class="backdrop:bg-black/50 fixed inset-0 m-auto w-[min(90vw,var(--spacing-modal-max-w))] h-fit p-modal-pad tablet:p-[calc(var(--spacing-modal-pad)+8px)] bg-surface border border-border rounded-btn" 
    aria-labelledby="modal-heading"
    @cancel="closeModal"
  >
    <h3 id="modal-heading" class="m-0 mb-modal-title-mb text-modal-title text-model-text font-semibold">
      {{ isEdit ? 'Редактировать задачу' : 'Добавить задачу' }}
    </h3>
    
    <form @submit.prevent="handleSubmit">
      <div class="flex flex-col gap-modal-field-gap">
        <label for="modal-title-input" class="sr-only">Название задачи</label>
        <input 
          id="modal-title-input" 
          ref="inputRef"
          v-model="title"
          class="w-full py-search-py px-search-px rounded-search-input border border-border bg-card text-text placeholder-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" 
          type="text" 
          placeholder="Название задачи" 
          required 
        />
      </div>
      <div class="flex justify-end gap-modal-actions-gap mt-modal-actions-mt">
        <button 
          type="submit" 
          class="py-btn-py px-btn-px rounded-btn bg-primary text-text-white font-medium hover:brightness-[0.97] transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Сохранить
        </button>
        <button 
          type="button" 
          class="py-btn-py px-btn-px rounded-btn border border-border text-text font-medium hover:brightness-[0.97] transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          @click="closeModal"
        >
          Отмена
        </button>
      </div>
    </form>
  </dialog>
</template>

<script setup>
  import { ref, watch, nextTick } from 'vue'

  const props = defineProps({
    isOpen: Boolean,
    editingTask: Object
  })
  const emit = defineEmits(['close', 'save'])

  const title = ref('')
  const isEdit = ref(false)
  const dialogRef = ref(null)
  const inputRef = ref(null)

  watch(() => props.isOpen, async (newVal) => {
    if (newVal) {
      if (props.editingTask) {
        title.value = props.editingTask.title
        isEdit.value = true

      } else {
        title.value = ''
        isEdit.value = false
      }
      await nextTick()
      dialogRef.value?.showModal()
      inputRef.value?.focus()

    } else {
      dialogRef.value?.close()
    }
  })

  function closeModal() {
    emit('close')
  }

  function handleSubmit() {
    if (!title.value.trim()) return

    emit('save', {
      id: props.editingTask?.id || null,
      title: title.value.trim()
    })
  }
</script>