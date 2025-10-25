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
@use '@/theme/tokens' as *;

.modern-photo-card {
  position: relative;
  @include card-base;
  @include card-hover;
  overflow: hidden;
  padding: $spacing-lg;

  > .photo-badge {
    position: absolute;
    top: $spacing-4xl;
    right: $spacing-4xl;
    @include flex-gap($spacing-sm);
    align-items: center;
    padding: $spacing-sm $spacing-lg;
    border-radius: $radius-md;
    font-size: $font-size-xs;
    font-weight: $font-weight-bold;
    text-transform: uppercase;
    letter-spacing: 1px;
    z-index: 2;
    box-shadow: $shadow-md;

    &.before-badge {
      @include box-bordered($color-danger);
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.9) 100%);
      color: $color-text-primary;
    }

    &.after-badge {
      @include box-bordered($color-success);
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.9) 0%, rgba(5, 150, 105, 0.9) 100%);
      color: $color-text-primary;
    }
  }
}

.photo-container {
  position: relative;
  border-radius: $radius-lg;
  overflow: hidden;
  margin-bottom: $spacing-lg;
  cursor: pointer;
  background: #000;
  aspect-ratio: 4/3;
  @include smooth-transition;

  > .modern-photo {
    width: 100%;
    height: 100%;
    object-fit: contain;
    @include smooth-transition;
  }

  > .photo-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: $color-overlay-dark;
    @include flex-center;
    flex-direction: column;
    @include flex-gap($spacing-lg);
    opacity: 0;
    @include smooth-transition;
  }

  &:hover > .modern-photo {
    transform: scale(1.05);
  }

  &:hover > .photo-overlay {
    opacity: 1;
  }
}

.view-icon-large {
  font-size: 3rem;
  color: $color-text-primary;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5));
}

.photo-overlay p {
  color: $color-text-primary;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.photo-actions {
  @include flex-gap($spacing-md);
}

.photo-action-btn {
  flex: 1;
  @include flex-center;
  @include flex-gap($spacing-sm);
  padding: $spacing-md $spacing-lg;
  border: none;
  border-radius: $radius-md;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  cursor: pointer;
  @include smooth-transition;

  > ion-icon {
    font-size: 1.125rem;
  }

  &.download-btn {
    background: $gradient-blue;
    color: $color-primary;
    border: 1px solid rgba($color-primary, 0.3);

    &:hover {
      background: rgba($color-primary, 0.2);
      box-shadow: $shadow-blue;
      transform: translateY(-2px);
    }
  }

  &.share-btn {
    background: $gradient-green;
    color: $color-success;
    border: 1px solid rgba($color-success, 0.3);

    &:hover {
      background: rgba($color-success, 0.2);
      box-shadow: $shadow-green;
      transform: translateY(-2px);
    }
  }
}
</style>
