<script setup lang="ts">
type BadgeColor = 'gray' | 'blue' | 'green' | 'red' | 'yellow' | 'indigo' | 'purple' | 'pink' | 'orange';
type BadgeSize = 'sm' | 'md' | 'lg';

interface Props {
  text: string;
  color?: BadgeColor;
  size?: BadgeSize;
  rounded?: boolean;
}

const colorClasses: Record<BadgeColor, string> = {
  gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  indigo: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  pink: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
  orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-0.5',
  lg: 'text-base px-3 py-1'
};

const props = withDefaults(defineProps<Props>(), {
  color: 'gray',
  size: 'md',
  rounded: false
});
</script>

<template>
  <span 
    :class="[
      'inline-flex items-center font-medium transition-colors duration-300',
      colorClasses[props.color],
      sizeClasses[props.size],
      props.rounded ? 'rounded-full' : 'rounded'
    ]"
    role="status"
    :aria-label="props.text"
  >
    {{ props.text }}
  </span>
</template>