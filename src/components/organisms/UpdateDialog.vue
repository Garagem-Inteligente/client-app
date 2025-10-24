<template>
  <ion-modal
    :is-open="isOpen"
    :backdrop-dismiss="false"
    :show-backdrop="true"
    class="update-modal"
    @will-dismiss="handleDismiss"
  >
    <ion-header class="ion-no-border">
      <ion-toolbar class="update-toolbar">
        <ion-title class="update-title">
          <ion-icon :icon="cloudDownload" class="update-icon" />
          Atualização Disponível
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="update-content">
      <div class="update-container">
        <div class="update-header">
          <div class="update-badge" :class="{ 'required': updateRequired }">
            <ion-icon :icon="updateRequired ? warning : informationCircle" />
            {{ updateRequired ? 'Atualização Obrigatória' : 'Nova Versão Disponível' }}
          </div>
        </div>

        <div class="update-body">
          <div class="version-info">
            <div class="version-current">
              <span class="version-label">Versão Atual:</span>
              <span class="version-value">{{ currentVersion }}</span>
            </div>
            <div class="version-arrow">
              <ion-icon :icon="arrowForward" />
            </div>
            <div class="version-latest">
              <span class="version-label">Nova Versão:</span>
              <span class="version-value">{{ latestVersion }}</span>
            </div>
          </div>

          <div class="update-message">
            <h3 class="update-message-title">
              {{ updateRequired ? 'Esta atualização é obrigatória' : 'Melhorias e correções importantes' }}
            </h3>
            <p class="update-message-text">
              {{ updateRequired
                ? 'Para continuar usando o app com segurança e todas as funcionalidades, é necessário atualizar para a versão mais recente.'
                : 'Atualize para aproveitar as últimas melhorias, correções de bugs e novos recursos.'
              }}
            </p>
          </div>

          <div class="update-features" v-if="!updateRequired">
            <h4 class="features-title">O que há de novo:</h4>
            <ul class="features-list">
              <li class="feature-item">
                <ion-icon :icon="checkmarkCircle" class="feature-icon" />
                Correções de bugs e melhorias de performance
              </li>
              <li class="feature-item">
                <ion-icon :icon="checkmarkCircle" class="feature-icon" />
                Novos recursos e funcionalidades
              </li>
              <li class="feature-item">
                <ion-icon :icon="checkmarkCircle" class="feature-icon" />
                Melhorias na segurança e estabilidade
              </li>
            </ul>
          </div>
        </div>

        <div class="update-actions">
          <ion-button
            fill="solid"
            color="primary"
            class="update-button update-now"
            @click="handleUpdateNow"
            :disabled="isUpdating"
          >
            <ion-icon :icon="isUpdating ? refresh : download" />
            {{ isUpdating ? 'Atualizando...' : 'Atualizar Agora' }}
          </ion-button>

          <ion-button
            v-if="!updateRequired"
            fill="clear"
            color="medium"
            class="update-button update-later"
            @click="handleUpdateLater"
          >
            <ion-icon :icon="time" />
            Lembrar Depois
          </ion-button>

          <div v-if="updateRequired" class="required-notice">
            <ion-icon :icon="warning" class="warning-icon" />
            <small>Esta atualização é necessária para continuar usando o app</small>
          </div>
        </div>
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
  IonContent,
  IonButton,
  IonIcon
} from '@ionic/vue'
import {
  cloudDownload,
  warning,
  informationCircle,
  arrowForward,
  checkmarkCircle,
  download,
  refresh,
  time
} from 'ionicons/icons'

interface Props {
  isOpen: boolean
  currentVersion: string
  latestVersion: string
  updateRequired: boolean
}

interface Emits {
  (e: 'update-now'): void
  (e: 'update-later'): void
  (e: 'dismiss'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isUpdating = ref(false)

const handleUpdateNow = async () => {
  isUpdating.value = true
  try {
    emit('update-now')
  } finally {
    isUpdating.value = false
  }
}

const handleUpdateLater = () => {
  emit('update-later')
}

const handleDismiss = () => {
  // Só permite dismiss se não for obrigatório
  if (!props.updateRequired) {
    emit('dismiss')
  }
}
</script>

<style scoped lang="scss">
.update-modal {
  --border-radius: 16px;
  --background: var(--ion-color-primary-contrast);
  --box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.update-toolbar {
  --background: var(--ion-color-primary);
  --color: var(--ion-color-primary-contrast);
}

.update-title {
  font-weight: 600;
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.update-icon {
  font-size: 24px;
}

.update-content {
  --background: var(--ion-color-primary-contrast);
}

.update-container {
  padding: 24px;
  max-width: 400px;
  margin: 0 auto;
}

.update-header {
  text-align: center;
  margin-bottom: 24px;
}

.update-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;

  &.required {
    background: var(--ion-color-danger-tint);
    color: var(--ion-color-danger-contrast);
  }

  &:not(.required) {
    background: var(--ion-color-primary-tint);
    color: var(--ion-color-primary-contrast);
  }
}

.update-body {
  margin-bottom: 32px;
}

.version-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
  padding: 16px;
  background: var(--ion-color-light);
  border-radius: 12px;
}

.version-current,
.version-latest {
  text-align: center;
  flex: 1;
}

.version-label {
  display: block;
  font-size: 12px;
  color: var(--ion-color-medium);
  margin-bottom: 4px;
  text-transform: uppercase;
  font-weight: 500;
}

.version-value {
  display: block;
  font-size: 18px;
  font-weight: 600;
  color: var(--ion-color-dark);
}

.version-arrow {
  color: var(--ion-color-medium);
}

.update-message {
  text-align: center;
  margin-bottom: 24px;
}

.update-message-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--ion-color-dark);
  margin-bottom: 8px;
}

.update-message-text {
  font-size: 14px;
  color: var(--ion-color-medium);
  line-height: 1.5;
}

.update-features {
  background: var(--ion-color-light);
  border-radius: 12px;
  padding: 16px;
}

.features-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--ion-color-dark);
  margin-bottom: 12px;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--ion-color-dark);
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
}

.feature-icon {
  font-size: 16px;
  color: var(--ion-color-success);
  flex-shrink: 0;
}

.update-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.update-button {
  --border-radius: 12px;
  font-weight: 600;
  height: 48px;

  &.update-now {
    --background: var(--ion-color-primary);
    --color: var(--ion-color-primary-contrast);
  }

  &.update-later {
    --color: var(--ion-color-medium);
  }
}

.required-notice {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 8px;

  small {
    color: var(--ion-color-danger);
    font-size: 12px;
  }
}

.warning-icon {
  font-size: 14px;
  color: var(--ion-color-danger);
}

// Responsividade
@media (max-width: 480px) {
  .update-container {
    padding: 16px;
  }

  .version-info {
    flex-direction: column;
    gap: 8px;
  }

  .version-arrow {
    transform: rotate(90deg);
  }
}
</style>