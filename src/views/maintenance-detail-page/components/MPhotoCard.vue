<template>
  <div class="modern-photo-card">
    <div :class="['photo-badge', badgeClass]">
      <ion-icon :icon="badgeIcon"></ion-icon>
      <span>{{ badgeLabel }}</span>
    </div>

    <div class="photo-container" @click="handleViewPhoto">
      <img :src="photoUrl" :alt="alt" class="modern-photo" />
      <div class="photo-overlay">
        <ion-icon :icon="eyeOutline" class="view-icon-large"></ion-icon>
        <p>Clique para ampliar</p>
      </div>
    </div>

    <div class="photo-actions">
      <button class="photo-action-btn download-btn" @click.stop="handleDownload">
        <ion-icon :icon="downloadOutline"></ion-icon>
        <span>Baixar</span>
      </button>
      <button class="photo-action-btn share-btn" @click.stop="handleShare">
        <ion-icon :icon="shareOutline"></ion-icon>
        <span>Compartilhar</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { IonIcon } from '@ionic/vue'
  import {
    cameraOutline,
    checkmarkCircleOutline,
    downloadOutline,
    eyeOutline,
    shareOutline,
  } from 'ionicons/icons'
  import { computed } from 'vue'
  import { usePhotoHandling } from '@/composables/usePhotoHandling'

  interface Props {
    photoUrl: string
    type: 'before' | 'after'
    alt?: string
  }

const props = withDefaults(defineProps<Props>(), {
  alt: 'Foto da manutenção',
})

const emit = defineEmits<{
  view: [photoUrl: string, type: string]
  download: [photoUrl: string, type: string]
  share: [photoUrl: string, type: string]
}>()

const { downloadPhoto, sharePhoto } = usePhotoHandling()

const badgeClass = computed(() => (props.type === 'before' ? 'before-badge' : 'after-badge'))
const badgeIcon = computed(() => (props.type === 'before' ? cameraOutline : checkmarkCircleOutline))
const badgeLabel = computed(() => (props.type === 'before' ? 'ANTES' : 'DEPOIS'))

const handleViewPhoto = (): void => {
  emit('view', props.photoUrl, props.type)
}

const handleDownload = (): void => {
  emit('download', props.photoUrl, props.type)
  downloadPhoto(props.photoUrl, props.type)
}

const handleShare = async (): Promise<void> => {
  emit('share', props.photoUrl, props.type)
  await sharePhoto(props.photoUrl, props.type)
}
</script>

<style scoped lang="scss">
.modern-photo-card {
  position: relative;
  background: linear-gradient(135deg, rgba(31, 41, 55, 0.9) 0%, rgba(17, 24, 39, 0.95) 100%);
  border-radius: 24px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
    border-color: rgba(59, 130, 246, 0.3);
  }
}

.photo-badge {
  position: absolute;
  top: 32px;
  right: 32px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  z-index: 2;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);

  &.before-badge {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.9) 100%);
    color: white;
    border: 1px solid rgba(239, 68, 68, 0.5);
  }

  &.after-badge {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.9) 0%, rgba(5, 150, 105, 0.9) 100%);
    color: white;
    border: 1px solid rgba(16, 185, 129, 0.5);
  }
}

.photo-container {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 16px;
  cursor: pointer;
  background: #000;
  aspect-ratio: 4/3;

  &:hover .photo-overlay {
    opacity: 1;
  }

  &:hover .modern-photo {
    transform: scale(1.05);
  }
}

.modern-photo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.photo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.view-icon-large {
  font-size: 3rem;
  color: white;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5));
}

.photo-overlay p {
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.photo-actions {
  display: flex;
  gap: 12px;
}

.photo-action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border: none;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  ion-icon {
    font-size: 1.125rem;
  }
}

.download-btn {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.1) 100%);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);

  &:hover {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(37, 99, 235, 0.2) 100%);
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
    transform: translateY(-2px);
  }
}

.share-btn {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.1) 100%);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);

  &:hover {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(5, 150, 105, 0.2) 100%);
    box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
    transform: translateY(-2px);
  }
}
</style>
