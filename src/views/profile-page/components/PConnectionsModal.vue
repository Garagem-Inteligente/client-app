<template>
  <ion-modal :is-open="isOpen" @didDismiss="$emit('update:isOpen', false)">
    <ion-header>
      <ion-toolbar>
        <ion-title>Conexões de Conta</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="$emit('update:isOpen', false)">
            <ion-icon :icon="closeOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="modal-content">
      <PConnectionsList>
        <!-- Email/Password Provider -->
        <PProviderCard
          title="Email e Senha"
          :subtitle="userEmail"
          :icon="mailOutline"
          icon-variant="primary"
          :status-label="hasPassword ? 'Conectado' : 'Não configurado'"
          :status-variant="hasPassword ? 'connected' : 'inactive'"
        />

        <!-- Google Provider -->
        <PProviderCard
          title="Google"
          :subtitle="hasGoogle ? 'Conectado via Google' : 'Não conectado'"
          :icon="logoGoogle"
          icon-variant="google"
          :status-label="hasGoogle ? 'Conectado' : 'Não conectado'"
          :status-variant="hasGoogle ? 'connected' : 'inactive'"
        >
          <template v-if="hasGoogle && hasPassword" #action>
            <button
              class="provider-action-btn btn-danger"
              @click="$emit('unlink-google')"
              :disabled="unlinkingGoogle"
            >
              <ion-spinner v-if="unlinkingGoogle" name="crescent"></ion-spinner>
              <span v-else>Desvincular</span>
            </button>
          </template>
        </PProviderCard>

        <template #warnings>
          <div v-if="connectedProvidersCount === 1" class="alert alert-warning">
            <ion-icon :icon="warningOutline"></ion-icon>
            <p>
              Você precisa ter pelo menos um método de login ativo.
              {{ !hasPassword ? 'Configure uma senha antes de desvincular o Google.' : '' }}
            </p>
          </div>
        </template>

        <template #info>
          <div class="alert alert-info">
            <ion-icon :icon="informationCircleOutline"></ion-icon>
            <p>
              Vincular múltiplos métodos de login aumenta a segurança e conveniência da sua conta.
            </p>
          </div>
        </template>
      </PConnectionsList>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonSpinner,
} from '@ionic/vue'
import { closeOutline, mailOutline, logoGoogle, warningOutline, informationCircleOutline } from 'ionicons/icons'
import PConnectionsList from './PConnectionsList.vue'
import PProviderCard from './PProviderCard.vue'

interface Props {
  isOpen: boolean
  userEmail: string
  hasPassword: boolean
  hasGoogle: boolean
  connectedProvidersCount: number
  unlinkingGoogle?: boolean
}

withDefaults(defineProps<Props>(), {
  unlinkingGoogle: false,
})

defineEmits<{
  'update:isOpen': [value: boolean]
  'unlink-google': []
}>()
</script>

<style scoped lang="scss">
@use '@/theme/tokens' as *;

.modal-content {
  --padding-start: 0;
  --padding-end: 0;
  --padding-top: 0;
  --padding-bottom: 20px;
}

.provider-action-btn {
  width: 100%;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all $transition-base;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.btn-danger {
  background: #ef4444;
  color: white;

  &:hover:not(:disabled) {
    background: #dc2626;
  }
}

.alert {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.5;
  margin: 0 16px 12px 16px;

  ion-icon {
    font-size: 20px;
    flex-shrink: 0;
    margin-top: 2px;
  }

  p {
    margin: 0;
    flex: 1;
  }

  &-warning {
    background: rgba(251, 191, 36, 0.1);
    border: 1px solid rgba(251, 191, 36, 0.2);
    color: #f59e0b;

    ion-icon {
      color: #f59e0b;
    }
  }

  &-info {
    background: rgba(99, 102, 241, 0.1);
    border: 1px solid rgba(99, 102, 241, 0.2);
    color: #6366f1;

    ion-icon {
      color: #6366f1;
    }
  }
}
</style>
