<template>
  <div v-show="isActive" class="tab-panel">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { inject, computed, type Ref } from 'vue'

interface Props {
  tabId: string
}

const props = defineProps<Props>()

// Inject active tab from parent Tabs component
const activeTab = inject<Ref<string>>('activeTab')

const isActive = computed(() => activeTab?.value === props.tabId)
</script>

<style scoped>
.tab-panel {
  width: 100%;
  animation: fadeIn 0.2s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

