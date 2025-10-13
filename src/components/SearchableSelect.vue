<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

interface Option {
  code: string
  name: string
}

interface Props {
  modelValue?: string
  options: Option[]
  placeholder?: string
  label?: string
  loading?: boolean
  disabled?: boolean
  error?: string
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Selecione...',
  loading: false,
  disabled: false,
  required: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'select': [option: Option]
}>()

const isOpen = ref(false)
const searchQuery = ref('')
const dropdownRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

// Filtra opções baseado na busca
const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options

  const query = searchQuery.value.toLowerCase().trim()
  return props.options.filter(option =>
    option.name.toLowerCase().includes(query) ||
    option.code.toLowerCase().includes(query)
  )
})

// Opção selecionada atual
const selectedOption = computed(() => {
  return props.options.find(option => option.code === props.modelValue)
})

// Abre o dropdown
const openDropdown = () => {
  if (props.disabled || props.loading) return
  
  isOpen.value = true
  searchQuery.value = ''
  
  // Focus no input após abrir
  setTimeout(() => {
    inputRef.value?.focus()
  }, 50)
}

// Fecha o dropdown
const closeDropdown = () => {
  isOpen.value = false
  searchQuery.value = ''
}

// Seleciona uma opção
const selectOption = (option: Option) => {
  emit('update:modelValue', option.code)
  emit('select', option)
  closeDropdown()
}

// Limpa a seleção
const clearSelection = () => {
  emit('update:modelValue', '')
  emit('select', { code: '', name: '' })
  searchQuery.value = ''
}

// Fecha dropdown ao clicar fora
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Limpa busca quando fecha
watch(isOpen, (newValue) => {
  if (!newValue) {
    searchQuery.value = ''
  }
})
</script>

<template>
  <div ref="dropdownRef" class="relative w-full">
    <!-- Label -->
    <label
      v-if="label"
      class="block text-sm font-medium text-gray-300 mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-red-400">*</span>
    </label>

    <!-- Input Container -->
    <div
      class="relative flex items-center cursor-pointer"
      @click="openDropdown"
    >
      <!-- Input -->
      <input
        ref="inputRef"
        v-model="searchQuery"
        type="text"
        :placeholder="!isOpen && selectedOption ? selectedOption.name : placeholder"
        :disabled="disabled || loading"
        class="w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors"
        :class="[
          error
            ? 'border-red-500 focus:ring-red-500'
            : isOpen
            ? 'border-blue-500 focus:ring-blue-500'
            : 'border-gray-700 focus:ring-blue-500',
          disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-text'
        ]"
        @focus="openDropdown"
        @keydown.esc="closeDropdown"
        @keydown.enter.prevent="filteredOptions.length === 1 && selectOption(filteredOptions[0])"
      />

      <!-- Icons Container -->
      <div class="absolute right-3 flex items-center space-x-2">
        <!-- Loading Spinner -->
        <svg
          v-if="loading"
          class="animate-spin h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>

        <!-- Clear Button -->
        <button
          v-else-if="selectedOption && !disabled"
          type="button"
          class="text-gray-400 hover:text-gray-300 transition-colors"
          @click.stop="clearSelection"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Dropdown Arrow -->
        <svg
          v-else
          class="w-5 h-5 text-gray-400 transition-transform duration-200"
          :class="{ 'transform rotate-180': isOpen }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>

    <!-- Error Message -->
    <p v-if="error" class="mt-1 text-sm text-red-400">{{ error }}</p>

    <!-- Dropdown Options -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-if="isOpen && !loading"
        class="absolute z-50 w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto"
      >
        <!-- Empty State -->
        <div
          v-if="filteredOptions.length === 0"
          class="px-4 py-8 text-center text-gray-400"
        >
          <svg class="w-12 h-12 mx-auto mb-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-sm">Nenhum resultado encontrado</p>
          <p v-if="searchQuery" class="text-xs mt-1">
            para "{{ searchQuery }}"
          </p>
        </div>

        <!-- Options List -->
        <button
          v-for="option in filteredOptions"
          :key="option.code"
          type="button"
          class="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors flex items-center justify-between group"
          :class="{
            'bg-gray-700': option.code === modelValue
          }"
          @click="selectOption(option)"
        >
          <span class="text-white group-hover:text-blue-400 transition-colors">
            {{ option.name }}
          </span>
          
          <!-- Check Icon for selected -->
          <svg
            v-if="option.code === modelValue"
            class="w-5 h-5 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </button>

        <!-- Loading State Inside Dropdown -->
        <div v-if="loading" class="px-4 py-8 text-center">
          <svg class="animate-spin h-8 w-8 mx-auto text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="mt-2 text-sm text-gray-400">Carregando...</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* Custom scrollbar for dropdown */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #1f2937; /* gray-800 */
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #4b5563; /* gray-600 */
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #6b7280; /* gray-500 */
}
</style>
