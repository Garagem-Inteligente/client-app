<template>
  <div class="settings-section">
    <div class="settings-header">
      <h2 class="settings-title">{{ title }}</h2>
      <p v-if="description" class="settings-description">{{ description }}</p>
    </div>

    <div class="settings-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description?: string
}

defineProps<Props>()
</script>

<style scoped lang="scss">
/* ====================================
   SETTINGS SECTION - RSCSS
   ==================================== */

.settings-section {
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
}

/* ====================================
   SETTINGS HEADER
   ==================================== */

.settings-header {
  margin-bottom: 16px;
}

.settings-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--ion-text-color);
  margin: 0 0 4px 0;
}

.settings-description {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.4;
}

/* ====================================
   SETTINGS CONTENT
   ==================================== */

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* ====================================
   RESPONSIVE DESIGN
   ==================================== */

@media (max-width: 480px) {
  .settings-section {
    padding: 16px;
  }

  .settings-title {
    font-size: 16px;
  }
}
</style>