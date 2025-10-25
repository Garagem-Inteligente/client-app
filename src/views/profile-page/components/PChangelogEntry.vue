<template>
  <div class="changelog-entry">
    <div class="changelog-header">
      <div class="version-badge">
        <ion-icon :icon="gitBranchOutline"></ion-icon>
        <span>{{ version }}</span>
      </div>
      <div class="changelog-date">
        {{ formattedDate }}
      </div>
    </div>

    <div class="changelog-changes">
      <div v-for="(change, index) in changes" :key="index" class="changelog-item">
        <ion-badge :color="getChangeTypeColor(change.type)" class="change-badge">
          {{ getChangeTypeLabel(change.type) }}
        </ion-badge>
        <span class="change-message">{{ change.message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonIcon, IonBadge } from '@ionic/vue'
import { gitBranchOutline } from 'ionicons/icons'
import { getChangeTypeLabel, getChangeTypeColor } from '@/constants/changelog'

interface Change {
  type: 'style' | 'feat' | 'fix' | 'perf' | 'docs' | 'refactor' | 'test' | 'chore'
  message: string
}

interface Props {
  version: string
  date: string
  changes: Change[]
  formatDate?: (date: string) => string
}

const props = withDefaults(defineProps<Props>(), {
  formatDate: (date: string) => {
    const dateObj = new Date(date)
    return dateObj.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  },
})

const formattedDate = () => props.formatDate(props.date)
</script>

<style scoped lang="scss">
@use '@/theme/tokens' as *;

.changelog-entry {
  background: rgba(31, 41, 55, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  transition: all $transition-base;

  &:hover {
    background: rgba(31, 41, 55, 0.6);
    border-color: rgba(255, 255, 255, 0.12);
  }
}

.changelog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.version-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  color: white;

  ion-icon {
    font-size: 18px;
  }
}

.changelog-date {
  font-size: 13px;
  color: #9ca3af;
}

.changelog-changes {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.changelog-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 8px 0;
}

.change-badge {
  flex-shrink: 0;
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 8px;
  font-weight: 600;
  text-transform: none;
}

.change-message {
  flex: 1;
  font-size: 14px;
  color: #e5e7eb;
  line-height: 1.5;
}
</style>
