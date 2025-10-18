<template>
  <div class="searchable-select">
    <ion-item lines="none">
      <ion-label position="stacked">{{ label }}</ion-label>
      <ion-input
        v-model="searchQuery"
        :placeholder="placeholder"
        @ion-input="handleSearch"
        @ion-focus="showOptions = true"
      />
    </ion-item>

    <div v-if="showOptions && filteredOptions.length > 0" class="options-list">
      <ion-item
        v-for="option in filteredOptions"
        :key="option.value"
        button
        @click="selectOption(option)"
        :class="{ 'option-selected': modelValue === option.value }"
      >
        <ion-label>{{ option.label }}</ion-label>
        <ion-icon v-if="modelValue === option.value" slot="end" :icon="checkmark" color="primary"></ion-icon>
      </ion-item>
    </div>

    <div v-if="showOptions && filteredOptions.length === 0 && searchQuery" class="no-results">
      <p>Nenhum resultado encontrado</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { IonItem, IonLabel, IonInput, IonIcon } from '@ionic/vue'
import { checkmark } from 'ionicons/icons'

export interface SelectOption {
  value: string | number
  label: string
}

interface Props {
  modelValue?: string | number
  options: SelectOption[]
  label: string
  placeholder?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const searchQuery = ref('')
const showOptions = ref(false)

const filteredOptions = computed(() => {
  if (!searchQuery.value) {
    return props.options
  }

  const query = searchQuery.value.toLowerCase()
  return props.options.filter(option =>
    option.label.toLowerCase().includes(query)
  )
})

const handleSearch = (event: CustomEvent) => {
  searchQuery.value = event.detail.value || ''
  showOptions.value = true
}

const selectOption = (option: SelectOption) => {
  emit('update:modelValue', option.value)
  searchQuery.value = option.label
  showOptions.value = false
}

// Update search query when modelValue changes externally
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    const option = props.options.find(opt => opt.value === newValue)
    if (option) {
      searchQuery.value = option.label
    }
  } else {
    searchQuery.value = ''
  }
}, { immediate: true })

// Close options when clicking outside
if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
  window.document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.searchable-select')) {
      showOptions.value = false
    }
  })
}
</script>

<style scoped>
.searchable-select {
  position: relative;
  width: 100%;
}

.options-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 300px;
  overflow-y: auto;
  background: var(--ion-background-color);
  border: 1px solid var(--ion-color-light);
  border-radius: 8px;
  margin-top: 4px;
  z-index: 1000;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.option-selected {
  --background: var(--ion-color-primary-tint);
}

.no-results {
  padding: 16px;
  text-align: center;
  color: var(--ion-color-medium);
}

.no-results p {
  margin: 0;
}
</style>

