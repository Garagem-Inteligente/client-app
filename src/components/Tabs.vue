<script setup lang="ts">
import { ref, provide, computed } from 'vue'

interface Tab {
  id: string
  label: string
  icon?: string
  badge?: number
  disabled?: boolean
}

const props = defineProps<{
  tabs: Tab[]
  defaultTab?: string
}>()

const emit = defineEmits<{
  change: [tabId: string]
}>()

const activeTab = ref(props.defaultTab || props.tabs[0]?.id || '')

const selectTab = (tabId: string, disabled?: boolean) => {
  if (disabled) return
  activeTab.value = tabId
  emit('change', tabId)
}

// Provide active tab to children
provide('activeTab', computed(() => activeTab.value))
</script>

<template>
  <div class="w-full">
    <!-- Tab Headers -->
    <div class="border-b border-gray-700 mb-6">
      <nav class="-mb-px flex space-x-1 overflow-x-auto" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="selectTab(tab.id, tab.disabled)"
          :class="[
            'whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-all duration-200 flex items-center gap-2',
            activeTab === tab.id
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600',
            tab.disabled 
              ? 'opacity-50 cursor-not-allowed' 
              : 'cursor-pointer'
          ]"
          :disabled="tab.disabled"
          :aria-selected="activeTab === tab.id"
          role="tab"
        >
          <span v-if="tab.icon" class="text-lg">{{ tab.icon }}</span>
          <span>{{ tab.label }}</span>
          <span 
            v-if="tab.badge !== undefined && tab.badge > 0"
            class="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-400"
          >
            {{ tab.badge }}
          </span>
        </button>
      </nav>
    </div>

    <!-- Tab Content -->
    <div class="tab-content">
      <slot :active-tab="activeTab" />
    </div>
  </div>
</template>
