<template>
  <!-- Banner discreto de atualização -->
  <transition name="slide-down">
    <div v-if="!isVisible" class="update-banner" :class="{ 'update-banner-critical': isCritical }">
      <div class="banner-content">
        <div class="banner-text">
          <span class="banner-icon">
            <ion-icon v-if="isCritical" :icon="warningOutline" />
            <ion-icon v-else :icon="cloudDownloadOutline" />
          </span>
          <span class="banner-label">
            {{ isCritical ? 'Atualização crítica' : 'Nova versão' }} ({{ currentVersion }} → {{ latestVersion }})
          </span>
        </div>
        <div class="banner-buttons">
          <button class="btn-dismiss" @click="handleDismiss" title="Descartar por 12h">
            ✕
          </button>
          <button class="btn-update" @click="handleUpdate">
            Atualizar
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAppVersionStore } from '@/stores/appVersion'
import { IonIcon } from '@ionic/vue'
import { warningOutline, cloudDownloadOutline } from 'ionicons/icons'
import type { UpdateBannerProps } from '@/types/version'

/**
 * UpdateBanner Component
 * Exibe banner de atualização com design glassmorphism
 *
 * Props:
 * - showDimissButton: mostrar botão de dismiss (default: true)
 * - animationDuration: duração da animação em ms (default: 300)
 */
withDefaults(defineProps<UpdateBannerProps>(), {
  showDismissButton: true,
  animationDuration: 300,
})

const emit = defineEmits<{
  update: []
  dismiss: []
}>()

const store = useAppVersionStore()
const isAnimating = ref(false)

// Computed properties
const isVisible = computed(() => {
  return store.hasUpdateAvailable && !isAnimating.value
})

const currentVersion = computed(() => store.currentVersion)
const latestVersion = computed(() => (store.latestVersion ?? 'desconhecida'))
const isCritical = computed(() => store.isCritical)

/**
 * Handler para botão "Atualizar"
 */
const handleUpdate = async (): Promise<void> => {
  emit('update')
  store.openUpdateLink()
}

/**
 * Handler para botão "Descartar"
 */
const handleDismiss = (): void => {
  isAnimating.value = true
  emit('dismiss')
  store.dismissBanner()

  // Esperar animação terminar
  setTimeout(() => {
    isAnimating.value = false
  }, 300)
}
</script>

<style scoped lang="scss">
$primary-color: var(--ion-color-primary);
$danger-color: var(--ion-color-danger);

.update-banner {
  margin: 0.5rem;
  animation: slideDown 0.3s ease-out;

  > .banner-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.6rem 0.8rem;
    background: rgba(59, 130, 246, 0.12);
    border-left: 3px solid $primary-color;
    border-radius: 0.4rem;
    font-size: 0.85rem;
    line-height: 1;
    transition: all 0.2s ease-out;

    &:hover {
      background: rgba(59, 130, 246, 0.16);
    }
  }

  &.update-banner-critical {
    > .banner-content {
      background: rgba(239, 68, 68, 0.12);
      border-left-color: $danger-color;

      &:hover {
        background: rgba(239, 68, 68, 0.16);
      }
    }
  }

  > .banner-content > .banner-text {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
    min-width: 0;
    color: rgba(255, 255, 255, 0.85);

    > .banner-icon {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 1.2rem;
      height: 1.2rem;
      color: $primary-color;

      .update-banner-critical & {
        color: $danger-color;
        animation: pulse 2s infinite;
      }

      > ion-icon {
        font-size: 1rem;
      }
    }

    > .banner-label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: 500;
    }
  }

  > .banner-content > .banner-buttons {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    flex-shrink: 0;

    > button {
      padding: 0.35rem 0.6rem;
      border: none;
      border-radius: 0.3rem;
      cursor: pointer;
      font-size: 0.8rem;
      font-weight: 600;
      transition: all 0.2s ease-out;
      white-space: nowrap;
    }

    > .btn-dismiss {
      background: rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.6);

      &:hover {
        background: rgba(255, 255, 255, 0.12);
        color: rgba(255, 255, 255, 0.8);
      }

      &:active {
        transform: scale(0.95);
      }
    }

    > .btn-update {
      background: $primary-color;
      color: white;

      .update-banner-critical & {
        background: $danger-color;
      }

      &:hover {
        opacity: 0.9;
        transform: translateY(-1px);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-0.5rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease-out;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-0.5rem);
}
</style>

