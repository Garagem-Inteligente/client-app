<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
  maskCurrency, 
  unmaskCurrency, 
  maskMileage, 
  unmaskMileage,
  maskPlate,
  maskDate,
  maskPhone,
  maskYear
} from '@/utils/masks';

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
  mask?: 'currency' | 'mileage' | 'plate' | 'date' | 'phone' | 'year';
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
  autocomplete: '',
  mask: undefined
});

const emit = defineEmits<Emits>();

// Valor interno para exibição com máscara
const displayValue = ref('');

// Aplica máscara inicial
if (props.modelValue) {
  displayValue.value = applyMask(props.modelValue.toString());
}

// Aplica a máscara apropriada
function applyMask(value: string): string {
  if (!props.mask || !value) return value;
  
  switch (props.mask) {
    case 'currency':
      return maskCurrency(value);
    case 'mileage':
      return maskMileage(value);
    case 'plate':
      return maskPlate(value);
    case 'date':
      return maskDate(value);
    case 'phone':
      return maskPhone(value);
    case 'year':
      return maskYear(value);
    default:
      return value;
  }
}

// Remove a máscara para obter o valor real
function removeMask(value: string): string | number {
  if (!props.mask || !value) return value;
  
  switch (props.mask) {
    case 'currency':
      return unmaskCurrency(value);
    case 'mileage':
      return unmaskMileage(value);
    case 'plate':
    case 'date':
    case 'phone':
    case 'year':
      return value.replace(/\D/g, '');
    default:
      return value;
  }
}

// Handler de input
function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  const rawValue = target.value;
  
  if (props.mask) {
    // Aplica a máscara
    const maskedValue = applyMask(rawValue);
    displayValue.value = maskedValue;
    
    // Atualiza o input com o valor mascarado
    target.value = maskedValue;
    
    // Emite o valor sem máscara (valor real)
    const unmaskedValue = removeMask(rawValue);
    emit('update:modelValue', unmaskedValue);
  } else {
    // Sem máscara, emite o valor diretamente
    displayValue.value = rawValue;
    emit('update:modelValue', rawValue);
  }
}

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
      :value="displayValue || modelValue"
      @input="handleInput"
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