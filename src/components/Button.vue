<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
}

interface Emits {
  click: [event: MouseEvent];
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  type: 'button'
});

const emit = defineEmits<Emits>();

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
};

const getVariantClasses = () => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white disabled:bg-blue-400',
    secondary: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 text-white disabled:bg-gray-500',
    outline: 'border border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white focus:ring-gray-500 disabled:border-gray-700 disabled:text-gray-500',
    ghost: 'text-gray-300 hover:bg-gray-800 hover:text-white focus:ring-gray-500 disabled:text-gray-500'
  };
  return variants[props.variant];
};

const getSizeClasses = () => {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  return sizes[props.size];
};
</script>

<template>
  <button
    :type="props.type"
    @click="handleClick"
    :disabled="props.disabled || props.loading"
    :aria-label="props.ariaLabel"
    :class="[
      'inline-flex items-center justify-center rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900',
      getSizeClasses(),
      getVariantClasses(),
      (props.disabled || props.loading) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
    ]"
  >
    <span v-if="props.loading" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></span>
    <slot></slot>
  </button>
</template>