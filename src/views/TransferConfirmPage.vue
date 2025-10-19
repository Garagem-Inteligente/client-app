<template>
  <ion-page>
    <ModernHeader title="Confirmar Transferência" showBackButton />
    
    <ion-content class="custom-content">
      <div class="container">
        <!-- Transfers List -->
        <div v-if="!loading && transfers.length > 0" class="transfers-list">
          <h2 class="section-title">Transferências Pendentes</h2>
          
          <ACard
            v-for="transfer in transfers"
            :key="transfer.id"
            class="transfer-card"
          >
            <div class="transfer-header">
              <ion-icon :icon="carSportOutline" class="transfer-icon" />
              <div class="transfer-info">
                <h3>{{ transfer.vehicleName }}</h3>
                <p>{{ transfer.vehiclePlate }}</p>
              </div>
            </div>

            <div class="transfer-details">
              <div class="detail-row">
                <ion-icon :icon="personOutline" />
                <span v-if="isReceiver(transfer)">
                  De: {{ transfer.fromUserName }}
                </span>
                <span v-else>
                  Para: {{ transfer.toEmail }}
                </span>
              </div>

              <div class="detail-row">
                <ion-icon :icon="calendarOutline" />
                <span>Expira em: {{ getExpiryDate(transfer.expiresAt) }}</span>
              </div>

              <div v-if="transfer.message" class="message-box">
                <ion-icon :icon="chatbubbleOutline" />
                <p>{{ transfer.message }}</p>
              </div>
            </div>

            <!-- Status Badge -->
            <div class="status-section">
              <div class="status-badges">
                <div
                  class="status-badge"
                  :class="{ confirmed: transfer.fromConfirmed }"
                >
                  <ion-icon
                    :icon="transfer.fromConfirmed ? checkmarkCircle : ellipseOutline"
                  />
                  Vendedor
                </div>
                <div
                  class="status-badge"
                  :class="{ confirmed: transfer.toConfirmed }"
                >
                  <ion-icon
                    :icon="transfer.toConfirmed ? checkmarkCircle : ellipseOutline"
                  />
                  Comprador
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
              <AButton
                v-if="canConfirm(transfer)"
                expand="block"
                @click="openConfirmModal(transfer)"
              >
                <template #icon-start>
                  <ion-icon :icon="keyOutline" />
                </template>
                Confirmar com Código
              </AButton>

              <AButton
                v-if="canCancel(transfer)"
                expand="block"
                color="danger"
                fill="outline"
                @click="handleCancel(transfer.id)"
              >
                Cancelar Transferência
              </AButton>
            </div>
          </ACard>
        </div>

        <!-- Empty State -->
        <div v-else-if="!loading" class="empty-state">
          <ion-icon :icon="documentTextOutline" class="empty-icon" />
          <h3>Nenhuma Transferência Pendente</h3>
          <p>Você não possui transferências aguardando confirmação</p>
          <AButton @click="router.push('/tabs/vehicles')">
            Ver Meus Veículos
          </AButton>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="loading-state">
          <ion-spinner name="crescent" />
          <p>Carregando transferências...</p>
        </div>
      </div>
    </ion-content>

    <!-- Confirm Modal -->
    <ion-modal :is-open="showConfirmModal" @didDismiss="closeConfirmModal">
      <ion-header>
        <ion-toolbar>
          <ion-title>Digite o Código</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="closeConfirmModal">Fechar</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div class="modal-content">
          <p class="modal-description">
            Digite o código de 6 caracteres que você recebeu por email
          </p>

          <AInput
            v-model="confirmationCode"
            label="Código de Confirmação"
            placeholder="ABC123"
            :maxlength="6"
            class="code-input"
            @input="confirmationCode = confirmationCode.toUpperCase()"
          />

          <div v-if="modalError" class="error-message">
            <ion-icon :icon="alertCircleOutline" />
            {{ modalError }}
          </div>

          <AButton
            expand="block"
            :disabled="confirmationCode.length !== 6 || submitting"
            :loading="submitting"
            @click="handleConfirm"
          >
            Confirmar
          </AButton>
        </div>
      </ion-content>
    </ion-modal>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  IonPage,
  IonContent,
  IonIcon,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonSpinner,
  alertController,
  loadingController
} from '@ionic/vue'
import {
  carSportOutline,
  personOutline,
  calendarOutline,
  chatbubbleOutline,
  checkmarkCircle,
  ellipseOutline,
  keyOutline,
  documentTextOutline,
  alertCircleOutline
} from 'ionicons/icons'
import ModernHeader from '@/components/organisms/ModernHeader.vue'
import { AButton, ACard, AInput } from '@/components'
import { useTransfersStore } from '@/stores/transfers'
import { useAuthStore } from '@/stores/auth'
import type { Transfer } from '@/types'

const router = useRouter()
const transfersStore = useTransfersStore()
const authStore = useAuthStore()

// State
const loading = ref(true)
const showConfirmModal = ref(false)
const confirmationCode = ref('')
const selectedTransfer = ref<Transfer | null>(null)
const submitting = ref(false)
const modalError = ref<string | null>(null)

// Computed
const transfers = computed(() => [
  ...transfersStore.pendingTransfersAsSender,
  ...transfersStore.pendingTransfersAsReceiver
])

// Methods
const isReceiver = (transfer: Transfer): boolean => {
  return transfer.toEmail === authStore.userEmail?.toLowerCase()
}

const canConfirm = (transfer: Transfer): boolean => {
  const receiver = isReceiver(transfer)
  return receiver ? !transfer.toConfirmed : !transfer.fromConfirmed
}

const canCancel = (transfer: Transfer): boolean => {
  return (
    transfer.fromUserId === authStore.user?.id &&
    transfer.status === 'pending'
  )
}

const getExpiryDate = (expiresAt: Date): string => {
  const now = new Date()
  const diff = expiresAt.getTime() - now.getTime()
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))

  if (days < 0) return 'Expirado'
  if (days === 0) return 'Hoje'
  if (days === 1) return 'Amanhã'
  return `${days} dias`
}

const openConfirmModal = (transfer: Transfer) => {
  selectedTransfer.value = transfer
  confirmationCode.value = ''
  modalError.value = null
  showConfirmModal.value = true
}

const closeConfirmModal = () => {
  showConfirmModal.value = false
  selectedTransfer.value = null
  confirmationCode.value = ''
  modalError.value = null
}

const handleConfirm = async () => {
  if (!selectedTransfer.value || confirmationCode.value.length !== 6) return

  submitting.value = true
  modalError.value = null

  try {
    const isNewOwner = isReceiver(selectedTransfer.value)
    
    await transfersStore.confirmTransfer(
      selectedTransfer.value.id,
      confirmationCode.value,
      isNewOwner
    )

    // Show success message
    const alert = await alertController.create({
      header: 'Confirmação Registrada!',
      message: isNewOwner
        ? 'Aguardando confirmação do vendedor para completar a transferência.'
        : 'Aguardando confirmação do comprador para completar a transferência.',
      buttons: ['OK']
    })

    await alert.present()
    closeConfirmModal()
  } catch (err) {
    modalError.value = err instanceof Error ? err.message : 'Erro ao confirmar'
  } finally {
    submitting.value = false
  }
}

const handleCancel = async (transferId: string) => {
  const alert = await alertController.create({
    header: 'Cancelar Transferência',
    message: 'Tem certeza que deseja cancelar esta transferência?',
    buttons: [
      {
        text: 'Não',
        role: 'cancel'
      },
      {
        text: 'Sim, Cancelar',
        handler: async () => {
          const loadingEl = await loadingController.create({
            message: 'Cancelando...'
          })
          await loadingEl.present()

          try {
            await transfersStore.cancelTransfer(transferId)
            
            const successAlert = await alertController.create({
              header: 'Cancelado',
              message: 'Transferência cancelada com sucesso',
              buttons: ['OK']
            })
            await loadingEl.dismiss()
            await successAlert.present()
          } catch (err) {
            await loadingEl.dismiss()
            const errorAlert = await alertController.create({
              header: 'Erro',
              message: err instanceof Error ? err.message : 'Erro ao cancelar',
              buttons: ['OK']
            })
            await errorAlert.present()
          }
        }
      }
    ]
  })

  await alert.present()
}

// Lifecycle
onMounted(async () => {
  loading.value = true
  try {
    await transfersStore.fetchActiveTransfers()
    transfersStore.subscribeToActiveTransfers()
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  transfersStore.unsubscribeAll()
})
</script>

<style scoped>
.container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--ion-color-dark);
  margin: 0 0 20px 0;
}

.transfers-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.transfer-card {
  padding: 0 !important;
}

.transfer-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-bottom: 1px solid var(--ion-color-light);
}

.transfer-icon {
  font-size: 40px;
  color: var(--ion-color-primary);
}

.transfer-info h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--ion-color-dark);
}

.transfer-info p {
  margin: 4px 0 0 0;
  font-size: 14px;
  color: var(--ion-color-medium);
}

.transfer-details {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--ion-color-dark);
}

.detail-row ion-icon {
  font-size: 20px;
  color: var(--ion-color-medium);
}

.message-box {
  background: var(--ion-color-light);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  gap: 8px;
}

.message-box ion-icon {
  font-size: 20px;
  color: var(--ion-color-primary);
  flex-shrink: 0;
}

.message-box p {
  margin: 0;
  font-size: 14px;
  font-style: italic;
  color: var(--ion-color-medium-shade);
}

.status-section {
  padding: 16px 20px;
  background: var(--ion-color-light);
  border-top: 1px solid var(--ion-color-medium-tint);
}

.status-badges {
  display: flex;
  gap: 12px;
}

.status-badge {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border-radius: 8px;
  background: white;
  border: 2px solid var(--ion-color-medium-tint);
  font-size: 14px;
  font-weight: 600;
  color: var(--ion-color-medium);
}

.status-badge.confirmed {
  border-color: var(--ion-color-success);
  background: var(--ion-color-success-tint);
  color: var(--ion-color-success-shade);
}

.status-badge ion-icon {
  font-size: 20px;
}

.action-buttons {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 80px;
  color: var(--ion-color-medium);
  margin-bottom: 16px;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--ion-color-dark);
}

.empty-state p {
  margin: 0 0 24px 0;
  font-size: 14px;
  color: var(--ion-color-medium);
}

.loading-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--ion-color-medium);
}

.loading-state ion-spinner {
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
}

.modal-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal-description {
  margin: 0;
  text-align: center;
  color: var(--ion-color-medium-shade);
}

.code-input {
  font-size: 24px;
  text-align: center;
  letter-spacing: 4px;
  font-weight: 700;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: var(--ion-color-danger-tint);
  border-radius: 8px;
  color: var(--ion-color-danger-shade);
  font-size: 14px;
}

.error-message ion-icon {
  font-size: 20px;
}

@media (max-width: 576px) {
  .container {
    padding: 16px;
  }

  .transfer-header {
    flex-direction: column;
    text-align: center;
  }

  .status-badges {
    flex-direction: column;
  }
}
</style>
