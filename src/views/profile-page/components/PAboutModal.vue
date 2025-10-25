<template>
  <ion-modal :is-open="isOpen" @didDismiss="$emit('update:isOpen', false)">
    <ion-header>
      <ion-toolbar>
        <ion-title>Sobre</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="$emit('update:isOpen', false)">
            <ion-icon :icon="closeOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar>
        <ion-segment v-model="activeTab" mode="md">
          <ion-segment-button value="info">
            <ion-label>Info</ion-label>
          </ion-segment-button>
          <ion-segment-button value="changelog">
            <ion-label>Novidades</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar>
    </ion-header>
    <ion-content class="modal-content">
      <!-- Info Tab -->
      <div v-show="activeTab === 'info'">
        <PAboutContent :versionString="versionString">
          <PFeatureItem
            v-for="feature in features"
            :key="feature.id"
            :label="feature.label"
            :icon="feature.icon"
          />
        </PAboutContent>
      </div>

      <!-- Changelog Tab -->
      <div v-show="activeTab === 'changelog'">
        <PChangelogTab>
          <template v-if="changelog.length > 0">
            <PChangelogEntry
              v-for="entry in changelog"
              :key="entry.version"
              :version="entry.version"
              :date="entry.date"
              :changes="entry.changes"
              :formatDate="formatChangelogDate"
            />
          </template>
          <template v-else>
            <div class="empty-changelog">
              <ion-icon :icon="documentTextOutline"></ion-icon>
              <p>Nenhuma atualização disponível</p>
            </div>
          </template>
        </PChangelogTab>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from '@ionic/vue'
import { closeOutline, checkmarkCircleOutline, documentTextOutline } from 'ionicons/icons'
import PAboutContent from './PAboutContent.vue'
import PFeatureItem from './PFeatureItem.vue'
import PChangelogTab from './PChangelogTab.vue'
import PChangelogEntry from './PChangelogEntry.vue'

interface Feature {
  id: string
  label: string
  icon: string
}

interface ChangelogEntry {
  version: string
  date: string
  changes: Array<{
    type: 'style' | 'feat' | 'fix' | 'perf' | 'docs' | 'refactor' | 'test' | 'chore'
    message: string
  }>
}

interface Props {
  isOpen: boolean
  versionString: string
  features?: Feature[]
  changelog?: ChangelogEntry[]
}

withDefaults(defineProps<Props>(), {
  features: () => [
    { id: '1', label: 'Controle completo de veículos', icon: checkmarkCircleOutline },
    { id: '2', label: 'Histórico de manutenções', icon: checkmarkCircleOutline },
    { id: '3', label: 'Lembretes automáticos', icon: checkmarkCircleOutline },
    { id: '4', label: 'Análise de custos', icon: checkmarkCircleOutline },
  ],
  changelog: () => [],
})

defineEmits<{
  'update:isOpen': [value: boolean]
}>()

const activeTab = ref<'info' | 'changelog'>('info')

const formatChangelogDate = (date: string) => {
  const dateObj = new Date(date)
  return dateObj.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<style scoped lang="scss">
@use '@/theme/tokens' as *;

.modal-content {
  --padding-start: 0;
  --padding-end: 0;
  --padding-top: 0;
  --padding-bottom: 20px;
}

.empty-changelog {
  text-align: center;
  padding: 60px 24px;
  color: #9ca3af;

  ion-icon {
    font-size: 64px;
    color: rgba(255, 255, 255, 0.1);
    margin-bottom: 16px;
  }

  p {
    font-size: 16px;
    margin: 0;
  }
}
</style>
