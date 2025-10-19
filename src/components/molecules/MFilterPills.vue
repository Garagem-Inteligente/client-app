<template>
  <div class="filter-pills-container">
    <div class="filter-pills-wrapper">
      <div class="filter-pills">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          class="filter-pill"
          :class="{ 
            '-active': modelValue === tab.id, 
            '-disabled': tab.disabled 
          }"
          :disabled="tab.disabled"
          @click="!tab.disabled && handleTabChange(tab.id)"
        >
          <span v-if="tab.icon" class="pill-icon">{{ tab.icon }}</span>
          <span class="pill-label">{{ tab.label }}</span>
          <span v-if="tab.badge !== undefined && tab.badge > 0" class="pill-count">
            {{ tab.badge }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Tab {
  id: string
  label: string
  icon?: string
  badge?: number
  disabled?: boolean
}

interface Props {
  tabs: Tab[]
  modelValue: string
}

defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const handleTabChange = (tabId: string) => {
  emit('update:modelValue', tabId)
}
</script>

<style scoped>
/* ====================================
   FILTER PILLS - RSCSS PATTERN
   Component: filter-pills-container
   ==================================== */

.filter-pills-container {
  margin: 0 0 2rem 0;
  padding-top: 16px;
}

.filter-pills-wrapper {
  overflow-x: auto;
  overflow-y: visible;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding-bottom: 8px;
}

.filter-pills-wrapper::-webkit-scrollbar {
  display: none;
}

.filter-pills {
  display: flex;
  gap: 12px;
  padding: 8px 4px 16px 4px;
  min-width: min-content;
}

/* Element: filter-pill */
.filter-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  background: rgba(31, 41, 55, 0.6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  flex-shrink: 0;
  color: white;
  font-family: inherit;
}

.filter-pill:hover:not(.-disabled) {
  background: rgba(31, 41, 55, 0.8);
  border-color: rgba(129, 140, 248, 0.4);
  transform: translateY(-2px);
}

/* Variant: -active */
.filter-pill.-active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: rgba(129, 140, 248, 0.6);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.5);
}

/* Variant: -disabled */
.filter-pill.-disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}

/* Elements inside filter-pill */
.pill-icon {
  font-size: 1.25rem;
  line-height: 1;
}

.pill-label {
  font-size: 0.938rem;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.pill-count {
  min-width: 24px;
  height: 24px;
  padding: 0 8px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.813rem;
  font-weight: 800;
}

.filter-pill.-active .pill-count {
  background: rgba(255, 255, 255, 0.25);
}

/* Responsive adjustments */
@media (min-width: 640px) {
  .filter-pills {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
