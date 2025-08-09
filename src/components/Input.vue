<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  modelValue?: string | number;
  label?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  ariaLabel?: string;
  autocomplete?: string;
}

interface Emits {
  'update:modelValue': [value: string | number];
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: '',
  placeholder: '',
  type: 'text',
  required: false,
  disabled: false,
  error: '',
  helperText: '',
  ariaLabel: '',
  autocomplete: ''
});

const emit = defineEmits<Emits>();

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const inputId = ref(`input-${Math.random().toString(36).substring(2, 9)}`);

const hasError = computed(() => props.error !== '');
</script>

<template>
  <div class="mb-4">
    <label 
      v-if="label" 
      :for="inputId" 
      class="block text-sm font-medium mb-1 transition-colors duration-300"
      :class="{
        'text-gray-700 dark:text-gray-300': !hasError,
        'text-red-600 dark:text-red-500': hasError
      }"
    >
      {{ label }}
      <span v-if="required" class="text-red-600 dark:text-red-500">*</span>
    </label>
    
    <input 
      :id="inputId"
      :type="type"
      v-model="inputValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :aria-label="ariaLabel || label"
      :aria-describedby="hasError ? `${inputId}-error` : (helperText ? `${inputId}-helper` : undefined)"
      :aria-invalid="hasError"
      :autocomplete="autocomplete"
      class="w-full px-3 py-2 border rounded-md shadow-sm transition-colors duration-300 focus:outline-none focus:ring-2"
      :class="{
        'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-600': !hasError && !disabled,
        'border-red-500 dark:border-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-red-500 focus:ring-red-500': hasError && !disabled,
        'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed': disabled
      }"
    />
    
    <div v-if="hasError" :id="`${inputId}-error`" class="mt-1 text-sm text-red-600 dark:text-red-500" role="alert">{{ error }}</div>
    <div v-else-if="helperText" :id="`${inputId}-helper`" class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ helperText }}</div>
  </div>
</template>