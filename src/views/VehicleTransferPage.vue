<template>
  <ion-page>
    <ModernHeader title="Transferir Veículo" showBackButton />
    
    <ion-content class="custom-content">
      <!-- Background layers -->
      <div class="background-gradient"></div>
      <div class="background-pattern"></div>
      
      <div class="container">
        <!-- Vehicle Header Card -->
        <div v-if="vehicle" class="vehicle-header-card">
          <div class="vehicle-badge">
            <ion-icon :icon="swapHorizontalOutline" class="transfer-icon"></ion-icon>
          </div>
          <div class="vehicle-header-content">
            <div class="vehicle-image-section">
              <img 
                v-if="vehicle.imageUrl" 
                :src="vehicle.imageUrl" 
                :alt="`${vehicle.make} ${vehicle.model}`"
                class="vehicle-image"
              />
              <div v-else class="vehicle-placeholder">
                <ion-icon :icon="carSportOutline"></ion-icon>
              </div>
            </div>
            <div class="vehicle-info-section">
              <h1 class="vehicle-title">{{ vehicle.make }} {{ vehicle.model }}</h1>
              <div class="vehicle-meta">
                <span class="meta-item">
                  <ion-icon :icon="calendarOutline"></ion-icon>
                  {{ vehicle.year }}
                </span>
                <span class="meta-divider">•</span>
                <span class="meta-item">
                  <ion-icon :icon="documentTextOutline"></ion-icon>
                  {{ vehicle.plate }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Warning Card -->
        <div class="warning-card">
          <div class="warning-header">
            <div class="warning-icon-wrapper">
              <ion-icon :icon="warningOutline"></ion-icon>
            </div>
            <div>
              <h3 class="warning-title">Atenção - Leia com Cuidado</h3>
              <p class="warning-subtitle">Esta ação é irreversível após confirmação</p>
            </div>
          </div>
          <div class="warning-content">
            <p class="warning-intro">Ao transferir este veículo:</p>
            <div class="warning-list">
              <div class="warning-item">
                <ion-icon :icon="checkmarkCircleOutline" class="check-icon"></ion-icon>
                <span>Todo o histórico de manutenções será transferido</span>
              </div>
              <div class="warning-item">
                <ion-icon :icon="checkmarkCircleOutline" class="check-icon"></ion-icon>
                <span>O novo proprietário terá acesso completo aos dados</span>
              </div>
              <div class="warning-item">
                <ion-icon :icon="checkmarkCircleOutline" class="check-icon"></ion-icon>
                <span>Você não poderá mais editar o histórico</span>
              </div>
              <div class="warning-item">
                <ion-icon :icon="checkmarkCircleOutline" class="check-icon"></ion-icon>
                <span>O veículo será movido para "Carros Transferidos"</span>
              </div>
              <div class="warning-item">
                <ion-icon :icon="checkmarkCircleOutline" class="check-icon"></ion-icon>
                <span>Você poderá apenas visualizar o histórico anterior</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Transfer Form Card -->
        <form @submit.prevent="handleSubmit" class="transfer-form-card">
          <h2 class="form-title">Informações do Novo Proprietário</h2>
          
          <div class="form-group">
            <AInput
              v-model="toEmail"
              label="Email do Novo Proprietário"
              type="email"
              placeholder="exemplo@email.com"
              required
              :disabled="loading"
            >
              <template #helper>
                <div class="input-helper">
                  <ion-icon :icon="mailOutline"></ion-icon>
                  O novo proprietário receberá um email com código de confirmação
                </div>
              </template>
            </AInput>
          </div>

          <div class="form-group">
            <label class="form-label">
              <ion-icon :icon="chatbubbleOutline"></ion-icon>
              Mensagem Personalizada (Opcional)
            </label>
            <ion-textarea
              v-model="message"
              placeholder="Adicione uma mensagem para o novo proprietário..."
              :rows="4"
              :disabled="loading"
              class="custom-textarea"
            />
            <p class="textarea-hint">Escreva uma mensagem amigável para acompanhar a transferência</p>
          </div>

          <!-- Process Info Card -->
          <div class="process-card">
            <div class="process-header">
              <ion-icon :icon="informationCircleOutline" class="process-icon"></ion-icon>
              <h3>Como Funciona a Transferência</h3>
            </div>
            <div class="process-steps">
              <div class="step-item">
                <div class="step-number">1</div>
                <div class="step-content">
                  <strong>Envio de Códigos</strong>
                  <p>Você e o novo proprietário receberão códigos únicos por email</p>
                </div>
              </div>
              <div class="step-item">
                <div class="step-number">2</div>
                <div class="step-content">
                  <strong>Dupla Confirmação</strong>
                  <p>Ambos precisam confirmar com seus códigos respectivos</p>
                </div>
              </div>
              <div class="step-item">
                <div class="step-number">3</div>
                <div class="step-content">
                  <strong>Prazo de Confirmação</strong>
                  <p>Você tem 7 dias para completar a transferência</p>
                </div>
              </div>
              <div class="step-item">
                <div class="step-number">4</div>
                <div class="step-content">
                  <strong>Conclusão</strong>
                  <p>Após ambas confirmações, a transferência é finalizada</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="form-actions">
            <AButton
              expand="block"
              type="submit"
              :loading="loading"
              :disabled="!toEmail || loading"
              size="large"
            >
              <template #icon-start>
                <ion-icon :icon="sendOutline" />
              </template>
              Iniciar Transferência
            </AButton>
            
            <AButton
              expand="block"
              color="medium"
              fill="clear"
              @click="router.back()"
              :disabled="loading"
            >
              Cancelar
            </AButton>
          </div>
        </form>
      </div>
    </ion-content>

    <!-- Modals -->
    <MConfirmModal
      v-model:is-open="showValidationModal"
      title="Email Inválido"
      :message="modalMessage"
      variant="warning"
      confirm-text="OK"
      :show-cancel="false"
      confirm-color="primary"
    />

    <MConfirmModal
      v-model:is-open="showConfirmModal"
      title="Confirmar Transferência"
      :message="`Você está prestes a iniciar a transferência de ${vehicle?.make} ${vehicle?.model} - ${vehicle?.plate} para ${toEmail}. Esta ação não pode ser desfeita após ambas as confirmações.`"
      :details="[
        'Ambos receberão emails com códigos de confirmação',
        'A transferência só será concluída após ambas as confirmações',
        'O histórico de manutenções será transferido',
        'Você não poderá mais editar este veículo após a conclusão'
      ]"
      variant="transfer"
      confirm-text="Sim, Iniciar"
      cancel-text="Cancelar"
      confirm-color="primary"
      @confirm="confirmTransfer"
    />

    <MConfirmModal
      v-model:is-open="showSuccessModal"
      title="Transferência Iniciada!"
      message="A transferência foi iniciada com sucesso! Você e o novo proprietário receberam emails com códigos de confirmação. Ambos precisam confirmar para completar a transferência."
      :details="[
        'Verifique seu email',
        'Confirme sua parte da transferência',
        'Aguarde a confirmação do novo proprietário'
      ]"
      variant="success"
      confirm-text="OK"
      :show-cancel="false"
      confirm-color="success"
      @confirm="handleSuccessClose"
    />

    <MConfirmModal
      v-model:is-open="showErrorModal"
      title="Erro"
      :message="modalMessage"
      variant="danger"
      confirm-text="OK"
      :show-cancel="false"
      confirm-color="danger"
      @confirm="handleErrorClose"
    />
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  IonPage,
  IonContent,
  IonIcon,
  IonTextarea,
  loadingController
} from '@ionic/vue'
import {
  carSportOutline,
  warningOutline,
  informationCircleOutline,
  sendOutline,
  swapHorizontalOutline,
  calendarOutline,
  documentTextOutline,
  checkmarkCircleOutline,
  mailOutline,
  chatbubbleOutline
} from 'ionicons/icons'
import ModernHeader from '@/components/organisms/ModernHeader.vue'
import { AButton, AInput } from '@/components'
import MConfirmModal from '@/components/molecules/MConfirmModal.vue'
import { useVehiclesStore, type Vehicle } from '@/stores/vehicles'
import { useTransfersStore } from '@/stores/transfers'

const router = useRouter()
const route = useRoute()
const vehiclesStore = useVehiclesStore()
const transfersStore = useTransfersStore()

// State
const vehicle = ref<Vehicle | null>(null)
const toEmail = ref('')
const message = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

// Modal control
const showValidationModal = ref(false)
const showConfirmModal = ref(false)
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const modalMessage = ref('')

// Get vehicle ID from route params
const vehicleId = route.params.id as string

// Load vehicle data
onMounted(async () => {
  if (!vehicleId) {
    router.push('/tabs/vehicles')
    return
  }

  vehicle.value = vehiclesStore.vehicles.find(v => v.id === vehicleId) || null

  if (!vehicle.value) {
    modalMessage.value = 'Veículo não encontrado'
    showErrorModal.value = true
  }
})

// Handle form submission
const handleSubmit = async () => {
  if (!vehicle.value || !toEmail.value) return

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(toEmail.value)) {
    error.value = 'Por favor, insira um email válido'
    modalMessage.value = 'Por favor, insira um email válido'
    showValidationModal.value = true
    return
  }

  // Show confirmation dialog
  showConfirmModal.value = true
}

const confirmTransfer = async () => {
  await executeTransfer()
}

// Execute the transfer
const executeTransfer = async () => {
  if (!vehicle.value) return

  const loadingEl = await loadingController.create({
    message: 'Iniciando transferência...'
  })
  await loadingEl.present()

  loading.value = true
  error.value = null

  try {
    await transfersStore.initiateTransfer(
      vehicle.value.id,
      toEmail.value.trim(),
      message.value.trim() || undefined
    )

    await loadingEl.dismiss()

    // Show success message
    showSuccessModal.value = true
  } catch (err) {
    await loadingEl.dismiss()
    error.value = err instanceof Error ? err.message : 'Erro ao iniciar transferência'
  } finally {
    loading.value = false
  }
}

const handleSuccessClose = () => {
  router.push('/tabs/vehicles')
}

const handleErrorClose = () => {
  router.push('/tabs/vehicles')
}
</script>

<style scoped>
/* Background layers */
.background-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100vh;
  background: linear-gradient(180deg, 
    rgba(var(--ion-color-primary-rgb), 0.1) 0%,
    rgba(var(--ion-color-primary-rgb), 0.05) 50%,
    transparent 100%);
  pointer-events: none;
  z-index: 0;
}

.background-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100vh;
  background-image: 
    radial-gradient(circle at 20% 50%, rgba(var(--ion-color-primary-rgb), 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(var(--ion-color-secondary-rgb), 0.1) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.container {
  position: relative;
  z-index: 1;
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  height: 91vh;
}

/* Vehicle Header Card */
.vehicle-header-card {
  background: linear-gradient(135deg, 
    rgba(var(--ion-color-primary-rgb), 0.95) 0%, 
    rgba(var(--ion-color-primary-rgb), 1) 100%);
  border-radius: 24px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  position: relative;
  overflow: hidden;
}

.vehicle-header-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  pointer-events: none;
}

.vehicle-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  margin: 0 auto 16px;
  backdrop-filter: blur(10px);
}

.transfer-icon {
  font-size: 32px;
  color: white;
}

.vehicle-header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
}

.vehicle-image-section {
  width: 120px;
  height: 120px;
  border-radius: 20px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.vehicle-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.vehicle-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.vehicle-placeholder ion-icon {
  font-size: 64px;
  color: rgba(255, 255, 255, 0.8);
}

.vehicle-info-section {
  color: white;
}

.vehicle-title {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.vehicle-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.meta-item ion-icon {
  font-size: 16px;
}

.meta-divider {
  opacity: 0.6;
}

/* Warning Card */
.warning-card {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 20px;
  border: 2px solid #f59e0b;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
}

.warning-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

.warning-icon-wrapper {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 8px rgba(245, 158, 11, 0.3);
}

.warning-icon-wrapper ion-icon {
  font-size: 28px;
  color: white;
}

.warning-title {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 700;
  color: #92400e;
}

.warning-subtitle {
  margin: 0;
  font-size: 14px;
  color: #b45309;
  font-weight: 500;
}

.warning-content {
  padding-left: 0;
}

.warning-intro {
  margin: 0 0 12px 0;
  font-size: 15px;
  font-weight: 600;
  color: #78350f;
}

.warning-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.warning-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 14px;
  color: #78350f;
  line-height: 1.5;
}

.check-icon {
  font-size: 20px;
  color: #f59e0b;
  flex-shrink: 0;
  margin-top: 2px;
}

/* Transfer Form Card */
.transfer-form-card {
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
}

.form-title {
  margin: 0 0 24px 0;
  font-size: 20px;
  font-weight: 700;
  color: #fff;
}

.form-group {
  margin-bottom: 24px;
}

.input-helper {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--ion-color-medium);
  margin-top: 6px;
}

.input-helper ion-icon {
  font-size: 16px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 8px;
}

.form-label ion-icon {
  font-size: 18px;
  color: var(--ion-color-primary);
}

.custom-textarea {
  --background: var(--ion-color-light);
  --padding-start: 16px;
  --padding-end: 16px;
  --padding-top: 12px;
  --padding-bottom: 12px;
  --border-radius: 12px;
  border: 2px solid var(--ion-color-light-shade);
  border-radius: 12px;
  min-height: 120px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.custom-textarea:focus-within {
  border-color: var(--ion-color-primary);
}

.textarea-hint {
  margin: 8px 0 0 0;
  font-size: 13px;
  color: var(--ion-color-medium);
}

/* Process Card */
.process-card {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  border: 2px solid #3b82f6;
}

.process-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.process-icon {
  font-size: 28px;
  color: #1e40af;
}

.process-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #1e3a8a;
}

.process-steps {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.step-number {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
}

.step-content {
  flex: 1;
  padding-top: 2px;
}

.step-content strong {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #1e3a8a;
  margin-bottom: 4px;
}

.step-content p {
  margin: 0;
  font-size: 13px;
  color: #1e40af;
  line-height: 1.5;
}

/* Form Actions */
.form-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
}

/* Responsive */
@media (max-width: 576px) {
  .container {
    padding: 16px;
  }

  .vehicle-header-card {
    padding: 20px;
    border-radius: 20px;
  }

  .vehicle-image-section {
    width: 100px;
    height: 100px;
  }

  .vehicle-title {
    font-size: 20px;
  }

  .warning-card,
  .transfer-form-card {
    padding: 16px;
  }

  .form-title {
    font-size: 18px;
  }
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .custom-textarea {
    --background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .custom-textarea:focus-within {
    border-color: var(--ion-color-primary);
  }
}
</style>
