<template>
  <div class="multi-select-container">
    <!-- Selected Items -->
    <div v-if="selectedOptions.length > 0" class="selected-items">
      <div
        v-for="(item, index) in selectedOptions"
        :key="item.value"
        class="selected-item"
      >
        <span class="item-label">{{ item.label }}</span>
        <button
          type="button"
          class="remove-btn"
          @click="removeItem(index)"
          :disabled="disabled"
        >
          ×
        </button>
      </div>
    </div>

    <!-- Search Input -->
    <div class="search-container">
      <input
        ref="searchInput"
        v-model="searchQuery"
        type="text"
        :placeholder="placeholder"
        class="search-input"
        :disabled="disabled"
        @focus="showDropdown = true"
        @blur="handleBlur"
        @keydown.enter.prevent="selectFirstMatch"
      />
      <div v-if="searchQuery" class="clear-search" @click="clearSearch">
        ×
      </div>
    </div>

    <!-- Dropdown -->
    <div v-if="showDropdown && filteredOptions.length > 0" class="dropdown">
      <div
        v-for="option in filteredOptions"
        :key="option.value"
        class="dropdown-item"
        @mousedown.prevent="selectOption(option)"
      >
        <span class="option-label">{{ option.label }}</span>
        <span v-if="isSelected(option.value)" class="check-icon">✓</span>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="showDropdown && filteredOptions.length === 0 && searchQuery" class="empty-state">
      Nenhum resultado encontrado
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

export interface MultiSelectOption {
  value: string
  label: string
}

interface Props {
  modelValue: string[]
  options: MultiSelectOption[]
  placeholder?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Buscar e selecionar...',
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const searchQuery = ref('')
const showDropdown = ref(false)
const searchInput = ref<HTMLInputElement | null>(null)

const selectedOptions = computed(() => {
  return props.modelValue
    .map(value => props.options.find(opt => opt.value === value))
    .filter(Boolean) as MultiSelectOption[]
})

const filteredOptions = computed(() => {
  if (!searchQuery.value) {
    // Mostrar apenas opções não selecionadas quando não há busca
    return props.options.filter(opt => !props.modelValue.includes(opt.value))
  }
  
  const query = searchQuery.value.toLowerCase()
  return props.options.filter(opt => {
    const isNotSelected = !props.modelValue.includes(opt.value)
    const matchesQuery = opt.label.toLowerCase().includes(query)
    return isNotSelected && matchesQuery
  })
})

const isSelected = (value: string) => {
  return props.modelValue.includes(value)
}

const selectOption = (option: MultiSelectOption) => {
  if (!props.modelValue.includes(option.value)) {
    emit('update:modelValue', [...props.modelValue, option.value])
    searchQuery.value = ''
    showDropdown.value = false
    // Manter o foco no input
    setTimeout(() => {
      searchInput.value?.focus()
    }, 100)
  }
}

const removeItem = (index: number) => {
  const newValue = [...props.modelValue]
  newValue.splice(index, 1)
  emit('update:modelValue', newValue)
}

const handleBlur = () => {
  setTimeout(() => {
    showDropdown.value = false
  }, 200)
}

const clearSearch = () => {
  searchQuery.value = ''
  searchInput.value?.focus()
}

const selectFirstMatch = () => {
  if (filteredOptions.value.length > 0) {
    selectOption(filteredOptions.value[0])
  }
}

// Watch para fechar dropdown quando não há opções
watch(filteredOptions, (newOptions) => {
  if (newOptions.length === 0 && searchQuery.value) {
    // Manter aberto para mostrar "nenhum resultado"
  }
})
</script>

<style scoped>
.multi-select-container {
  position: relative;
  width: 100%;
}

.selected-items {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.selected-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 8px;
  font-size: 0.875rem;
  color: white;
  animation: slideIn 0.2s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.item-label {
  font-weight: 500;
}

.remove-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 50%;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
}

.remove-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.remove-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.search-container {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 10px 40px 10px 12px;
  background: #1f2937;
  border: 1px solid #374151;
  border-radius: 8px;
  color: white;
  font-size: 0.875rem;
  outline: none;
  transition: all 0.2s ease;
}

.search-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.search-input::placeholder {
  color: #6b7280;
}

.clear-search {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #374151;
  border-radius: 50%;
  color: #9ca3af;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  transition: all 0.2s ease;
}

.clear-search:hover {
  background: #4b5563;
  color: white;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: #1f2937;
  border: 1px solid #374151;
  border-radius: 8px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  animation: fadeInDown 0.2s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  color: #d1d5db;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid #374151;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background: #374151;
  color: white;
}

.option-label {
  font-size: 0.875rem;
}

.check-icon {
  color: #10b981;
  font-weight: bold;
  font-size: 18px;
}

.empty-state {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  padding: 20px;
  background: #1f2937;
  border: 1px solid #374151;
  border-radius: 8px;
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
  z-index: 1000;
}

/* Scrollbar */
.dropdown::-webkit-scrollbar {
  width: 8px;
}

.dropdown::-webkit-scrollbar-track {
  background: #1f2937;
  border-radius: 8px;
}

.dropdown::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 8px;
}

.dropdown::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>
