<template>
  <div class="tabs-container">
    <!-- Tabs Header -->
    <div class="tabs-header">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tab-button', { active: activeTab === tab.id, disabled: tab.disabled }]"
        :disabled="tab.disabled"
        @click="handleTabChange(tab.id)"
      >
        <span class="tab-icon" v-if="tab.icon">{{ tab.icon }}</span>
        <span class="tab-label">{{ tab.label }}</span>
        <span v-if="tab.badge !== undefined && tab.badge > 0" class="tab-badge">
          {{ tab.badge }}
        </span>
      </button>
    </div>

    <!-- Tabs Content -->
    <div class="tabs-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, provide } from 'vue'

interface Tab {
  id: string
  label: string
  icon?: string
  badge?: number
  disabled?: boolean
}

interface Props {
  tabs: Tab[]
  defaultTab?: string
}

const props = withDefaults(defineProps<Props>(), {
  defaultTab: ''
})

const emit = defineEmits<{
  change: [tabId: string]
}>()

const activeTab = ref(props.defaultTab || props.tabs[0]?.id || '')

// Provide active tab to children
provide('activeTab', activeTab)

const handleTabChange = (tabId: string) => {
  const tab = props.tabs.find(t => t.id === tabId)
  if (tab?.disabled) return
  
  activeTab.value = tabId
  emit('change', tabId)
}

// Watch for external changes to defaultTab
watch(() => props.defaultTab, (newTab) => {
  if (newTab) {
    activeTab.value = newTab
  }
})
</script>

<style scoped>
.tabs-container {
  width: 100%;
}

.tabs-header {
  display: flex;
  gap: 0.5rem;
  border-bottom: 2px solid #374151; /* border-gray-700 */
  margin-bottom: 1.5rem;
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: #4b5563 transparent;
}

.tabs-header::-webkit-scrollbar {
  height: 4px;
}

.tabs-header::-webkit-scrollbar-track {
  background: transparent;
}

.tabs-header::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 2px;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: #9ca3af; /* text-gray-400 */
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: -2px;
}

.tab-button:hover:not(.disabled) {
  color: #d1d5db; /* text-gray-300 */
  background: rgba(55, 65, 81, 0.5); /* bg-gray-700/50 */
}

.tab-button.active {
  color: #3b82f6; /* text-blue-500 */
  border-bottom-color: #3b82f6; /* border-blue-500 */
}

.tab-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tab-icon {
  font-size: 1.125rem;
}

.tab-label {
  font-size: 0.875rem;
}

.tab-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.375rem;
  background: #3b82f6; /* bg-blue-500 */
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
}

.tab-button.active .tab-badge {
  background: #2563eb; /* bg-blue-600 */
}

.tabs-content {
  width: 100%;
}

/* Responsive */
@media (max-width: 640px) {
  .tab-button {
    padding: 0.5rem 0.75rem;
    font-size: 0.813rem;
  }

  .tab-icon {
    font-size: 1rem;
  }
}
</style>

