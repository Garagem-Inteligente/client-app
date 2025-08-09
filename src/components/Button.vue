<script setup lang="ts">
interface Props {
  label: string;
  primary?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
}

interface Emits {
  click: [event: MouseEvent];
}

const props = withDefaults(defineProps<Props>(), {
  primary: false,
  disabled: false,
  type: 'button'
});

const emit = defineEmits<Emits>();

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event);
  }
};
</script>

<template>
  <button
    :type="props.type"
    @click="handleClick"
    :disabled="props.disabled"
    :aria-label="props.ariaLabel || props.label"
    :class="[
      'px-4 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
      props.primary 
        ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white disabled:bg-blue-400' 
        : 'bg-gray-200 hover:bg-gray-300 focus:ring-gray-500 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white disabled:bg-gray-300 dark:disabled:bg-gray-600',
      props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
    ]"
  >
    {{ props.label }}
  </button>
</template>