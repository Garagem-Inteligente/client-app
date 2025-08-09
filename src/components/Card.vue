<script setup lang="ts">
interface Props {
  title: string;
  content?: string;
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

withDefaults(defineProps<Props>(), {
  content: '',
  headingLevel: 'h2'
});

const props = defineProps<Props>();
</script>

<template>
  <article 
    class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
    role="article"
  >
    <component 
      :is="props.headingLevel" 
      class="text-xl font-semibold text-gray-800 dark:text-white mb-2"
    >
      {{ props.title }}
    </component>
    <p 
      v-if="props.content" 
      class="text-gray-600 dark:text-gray-300"
    >
      {{ props.content }}
    </p>
    <div 
      v-if="$slots.default" 
      class="mt-4"
    >
      <slot></slot>
    </div>
  </article>
</template>