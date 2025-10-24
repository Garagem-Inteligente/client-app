<template>
  <div class="setting-item" @click="$emit('click')">
    <div class="setting-content">
      <div class="setting-icon" v-if="icon">
        <ion-icon :icon="icon"></ion-icon>
      </div>

      <div class="setting-text">
        <div class="setting-title">{{ title }}</div>
        <div v-if="subtitle" class="setting-subtitle">{{ subtitle }}</div>
      </div>

      <div class="setting-actions">
        <div v-if="value" class="setting-value">{{ value }}</div>
        <ion-icon :icon="chevronForward" class="setting-chevron"></ion-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import { chevronForward } from 'ionicons/icons'

interface Props {
  title: string
  subtitle?: string
  value?: string
  icon?: string
}

defineProps<Props>()

defineEmits<{
  click: []
}>()
</script>

<style scoped lang="scss">
/* ====================================
   SETTING ITEM - RSCSS
   ==================================== */

.setting-item {
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: var(--bg-hover);
  }

  &:active {
    background: var(--bg-active);
  }
}

.setting-content {
  display: flex;
  align-items: center;
  padding: 12px 0;
  gap: 12px;
}

/* ====================================
   SETTING ICON
   ==================================== */

.setting-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: var(--bg-input);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  ion-icon {
    font-size: 20px;
    color: var(--primary-600);
  }
}

/* ====================================
   SETTING TEXT
   ==================================== */

.setting-text {
  flex: 1;
  min-width: 0;
}

.setting-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--ion-text-color);
  margin-bottom: 2px;
}

.setting-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
}

/* ====================================
   SETTING ACTIONS
   ==================================== */

.setting-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.setting-value {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 500;
}

.setting-chevron {
  font-size: 16px;
  color: var(--text-secondary);
}

/* ====================================
   RESPONSIVE DESIGN
   ==================================== */

@media (max-width: 480px) {
  .setting-content {
    padding: 10px 0;
    gap: 10px;
  }

  .setting-icon {
    width: 36px;
    height: 36px;

    ion-icon {
      font-size: 18px;
    }
  }

  .setting-title {
    font-size: 15px;
  }

  .setting-subtitle {
    font-size: 13px;
  }
}
</style>