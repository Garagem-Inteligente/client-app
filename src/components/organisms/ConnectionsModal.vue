<template>
  <ion-modal
    :is-open="isOpen"
    @will-dismiss="$emit('close')"
    :backdrop-dismiss="false"
    class="connections-modal"
  >
    <ion-header>
      <ion-toolbar>
        <ion-title>Contas Vinculadas</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="$emit('close')">
            <ion-icon :icon="closeOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="modal-content">
      <div class="connections-list">
        <!-- Password Provider -->
        <div class="connection-item">
          <div class="connection-icon">
            <ion-icon :icon="lockClosedOutline"></ion-icon>
          </div>
          <div class="connection-info">
            <div class="connection-name">Senha</div>
            <div class="connection-status">Conectado</div>
          </div>
          <div class="connection-actions">
            <ion-button
              fill="outline"
              size="small"
              @click="$emit('changePassword')"
            >
              Alterar
            </ion-button>
          </div>
        </div>

        <!-- Google Provider -->
        <div class="connection-item">
          <div class="connection-icon google-icon">
            <ion-icon :icon="logoGoogle"></ion-icon>
          </div>
          <div class="connection-info">
            <div class="connection-name">Google</div>
            <div class="connection-status" :class="{ 'connected': hasGoogleProvider }">
              {{ hasGoogleProvider ? 'Conectado' : 'Não conectado' }}
            </div>
          </div>
          <div class="connection-actions">
            <ion-button
              v-if="hasGoogleProvider"
              fill="outline"
              size="small"
              color="danger"
              @click="$emit('unlinkGoogle')"
              :disabled="isUnlinkingGoogle"
            >
              <span v-if="!isUnlinkingGoogle">Desvincular</span>
              <span v-else>Desvinculando...</span>
            </ion-button>
            <ion-button
              v-else
              fill="solid"
              size="small"
              @click="$emit('linkGoogle')"
            >
              Conectar
            </ion-button>
          </div>
        </div>

        <!-- Facebook Provider (Future) -->
        <div class="connection-item disabled">
          <div class="connection-icon facebook-icon">
            <ion-icon :icon="logoFacebook"></ion-icon>
          </div>
          <div class="connection-info">
            <div class="connection-name">Facebook</div>
            <div class="connection-status">Em breve</div>
          </div>
          <div class="connection-actions">
            <ion-button fill="outline" size="small" disabled>
              Indisponível
            </ion-button>
          </div>
        </div>

        <!-- Apple Provider (Future) -->
        <div class="connection-item disabled">
          <div class="connection-icon apple-icon">
            <ion-icon :icon="logoApple"></ion-icon>
          </div>
          <div class="connection-info">
            <div class="connection-name">Apple</div>
            <div class="connection-status">Em breve</div>
          </div>
          <div class="connection-actions">
            <ion-button fill="outline" size="small" disabled>
              Indisponível
            </ion-button>
          </div>
        </div>
      </div>

      <!-- Info Section -->
      <div class="connections-info">
        <ion-icon :icon="informationCircleOutline"></ion-icon>
        <div class="info-text">
          <strong>Vincular contas</strong> permite fazer login com diferentes provedores.
          Você pode ter múltiplas contas vinculadas para maior flexibilidade.
        </div>
      </div>
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
} from '@ionic/vue'
import {
  closeOutline,
  lockClosedOutline,
  logoGoogle,
  logoFacebook,
  logoApple,
  informationCircleOutline,
} from 'ionicons/icons'

interface Props {
  isOpen: boolean
  hasGoogleProvider: boolean
  isUnlinkingGoogle: boolean
}

defineProps<Props>()

defineEmits<{
  close: []
  changePassword: []
  linkGoogle: []
  unlinkGoogle: []
}>()
</script>

<style scoped lang="scss">
/* ====================================
   CONNECTIONS MODAL - RSCSS
   ==================================== */

.connections-modal {
  --border-radius: 16px;
}

/* ====================================
   MODAL CONTENT
   ==================================== */

.modal-content {
  --padding-start: 20px;
  --padding-end: 20px;
  --padding-top: 0;
  --padding-bottom: 20px;
}

/* ====================================
   CONNECTIONS LIST
   ==================================== */

.connections-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

/* ====================================
   CONNECTION ITEM
   ==================================== */

.connection-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover:not(.disabled) {
    background: var(--bg-hover);
    transform: translateY(-1px);
  }

  &.disabled {
    opacity: 0.6;
    pointer-events: none;
  }
}

/* ====================================
   CONNECTION ICON
   ==================================== */

.connection-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-input);
  flex-shrink: 0;

  ion-icon {
    font-size: 24px;
    color: var(--primary-600);
  }
}

.google-icon {
  background: linear-gradient(135deg, #4285f4, #34a853);
  ion-icon {
    color: white;
  }
}

.facebook-icon {
  background: #1877f2;
  ion-icon {
    color: white;
  }
}

.apple-icon {
  background: #000000;
  ion-icon {
    color: white;
  }
}

/* ====================================
   CONNECTION INFO
   ==================================== */

.connection-info {
  flex: 1;
  min-width: 0;
}

.connection-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--ion-text-color);
  margin-bottom: 4px;
}

.connection-status {
  font-size: 14px;
  color: var(--text-secondary);

  &.connected {
    color: var(--success-600);
    font-weight: 500;
  }
}

/* ====================================
   CONNECTION ACTIONS
   ==================================== */

.connection-actions {
  flex-shrink: 0;
}

/* ====================================
   CONNECTIONS INFO
   ==================================== */

.connections-info {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: var(--bg-input);
  border: 1px solid var(--border-input);
  border-radius: 12px;

  ion-icon {
    font-size: 20px;
    color: var(--primary-600);
    flex-shrink: 0;
    margin-top: 2px;
  }

  .info-text {
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.4;

    strong {
      color: var(--ion-text-color);
    }
  }
}

/* ====================================
   RESPONSIVE DESIGN
   ==================================== */

@media (max-width: 480px) {
  .modal-content {
    --padding-start: 16px;
    --padding-end: 16px;
  }

  .connection-item {
    padding: 12px;
    gap: 12px;
  }

  .connection-icon {
    width: 40px;
    height: 40px;

    ion-icon {
      font-size: 20px;
    }
  }

  .connections-info {
    padding: 12px;
    gap: 10px;

    .info-text {
      font-size: 13px;
    }
  }
}
</style>