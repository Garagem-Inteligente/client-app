<script setup lang="ts">
import { inject, computed } from 'vue'

const props = defineProps<{
  tabId: string
}>()

const activeTab = inject<{ value: string }>('activeTab', { value: '' })

const isActive = computed(() => activeTab.value === props.tabId)
</script>

<template>
  <div 
    v-show="isActive"
    role="tabpanel"
    class="animate-fadeIn"
  >
    <slot />
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>
