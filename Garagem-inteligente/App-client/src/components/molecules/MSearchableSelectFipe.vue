<template>
  <div class="searchable-select-fipe">
    <label v-if="label" class="label">
      {{ label }} <span v-if="required" class="required">*</span>
    </label>
    
    <div class="input-wrapper">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="placeholder"
        :disabled="disabled || loading"
        @input="handleInput"
        @focus="showDropdown = true"
        @blur="handleBlur"
        class="search-input"
        :class="{ 'input-disabled': disabled || loading }"
      />
      
      <div v-if="loading" class="loading-indicator">
        <ion-spinner name="dots" class="spinner"></ion-spinner>
      </div>
    </div>

    <!-- Dropdown -->
    <div v-if="showDropdown && filteredOptions.length > 0" class="dropdown">
      <div
        v-for="option in filteredOptions"
        :key="option.code"
        class="dropdown-item"
        @mousedown.prevent="selectOption(option)"
      >
        {{ option.name }}
      </div>
    </div>

    <div v-if="showDropdown && filteredOptions.length === 0 && searchQuery && !loading" class="no-results">
      Nenhum resultado encontrado
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { IonSpinner } from '@ionic/vue'

interface Option {
  code: string
  name: string
}

interface Props {
  modelValue?: string
  options: Option[]
  label?: string
  placeholder?: string
  disabled?: boolean
  loading?: boolean
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Selecione...',
  disabled: false,
  loading: false,
  required: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'select', option: Option): void
}>()

const searchQuery = ref('')
const showDropdown = ref(false)

const filteredOptions = computed(() => {
  if (!searchQuery.value) {
    return props.options
  }

  const query = searchQuery.value.toLowerCase().trim()
  return props.options.filter(option =>
    option.name.toLowerCase().includes(query)
  )
})

const selectOption = (option: Option) => {
  searchQuery.value = option.name
  emit('update:modelValue', option.code)
  emit('select', option)
  showDropdown.value = false
}

const handleInput = () => {
  showDropdown.value = true
  emit('update:modelValue', '')
}

const handleBlur = () => {
  setTimeout(() => {
    showDropdown.value = false
  }, 200)
}

// Update search query when modelValue changes externally
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    const option = props.options.find(opt => opt.code === newValue)
    if (option) {
      searchQuery.value = option.name
    }
  } else if (!searchQuery.value) {
    searchQuery.value = ''
  }
})

// Update when options change
watch(() => props.options, () => {
  if (props.modelValue) {
    const option = props.options.find(opt => opt.code === props.modelValue)
    if (option) {
      searchQuery.value = option.name
    }
  }
})
</script>

<style scoped>
.searchable-select-fipe {
  position: relative;
  width: 100%;
}

.label {
  display: block;
  font-size: 0.875rem; /* text-sm */
  font-weight: 500; /* font-medium */
  color: #d1d5db; /* text-gray-300 */
  margin-bottom: 0.5rem;
}

.required {
  color: #ef4444; /* red-500 */
}

.input-wrapper {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 0.5rem 0.75rem; /* py-2 px-3 */
  background-color: #1f2937; /* bg-gray-800 */
  border: 1px solid #4b5563; /* border-gray-600 */
  border-radius: 0.375rem; /* rounded-md */
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  ring: 2px;
  ring-color: #3b82f6; /* ring-blue-500 */
  border-color: transparent;
}

.search-input::placeholder {
  color: #6b7280; /* text-gray-500 */
}

.input-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-indicator {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
}

.spinner {
  width: 20px;
  height: 20px;
  --color: #3b82f6;
}

.dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  max-height: 300px;
  overflow-y: auto;
  background-color: #1f2937; /* bg-gray-800 */
  border: 1px solid #4b5563; /* border-gray-600 */
  border-radius: 0.375rem;
  z-index: 1000;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2);
}

.dropdown-item {
  padding: 0.75rem 1rem;
  color: #ffffff;
  cursor: pointer;
  transition: background-color 0.15s;
  border-bottom: 1px solid #374151; /* border-gray-700 */
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background-color: #374151; /* bg-gray-700 */
}

.no-results {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  padding: 1rem;
  background-color: #1f2937; /* bg-gray-800 */
  border: 1px solid #4b5563; /* border-gray-600 */
  border-radius: 0.375rem;
  color: #9ca3af; /* text-gray-400 */
  text-align: center;
  font-size: 0.875rem;
  z-index: 1000;
}
</style>

