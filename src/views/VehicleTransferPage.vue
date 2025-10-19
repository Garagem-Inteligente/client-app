<template>
  <ion-page>
    <ModernHeader title="Transferir Veículo" showBackButton />
    
    <ion-content class="custom-content">
      <div class="container">
        <!-- Vehicle Info Card -->
        <ACard v-if="vehicle" class="vehicle-card">
          <div class="vehicle-info">
            <ion-icon :icon="carSportOutline" class="vehicle-icon" />
            <div>
              <h2>{{ vehicle.make }} {{ vehicle.model }}</h2>
              <p class="vehicle-details">
                {{ vehicle.year }} • {{ vehicle.plate }}
              </p>
            </div>
          </div>
        </ACard>

        <!-- Warning Box -->
        <div class="warning-box">
          <h3>
            <ion-icon :icon="warningOutline" /> 
            ATENÇÃO - Leia com cuidado
          </h3>
          <p>Ao transferir este veículo:</p>
          <ul>
            <li>✓ Todo o histórico de manutenções será transferido</li>
            <li>✓ O novo proprietário terá acesso completo aos dados</li>
            <li>✓ Você não poderá mais editar o histórico deste veículo</li>
            <li>✓ O veículo será movido para "Carros Transferidos"</li>
            <li>✓ Você poderá apenas visualizar o histórico anterior</li>
          </ul>
          <p class="warning-emphasis">
            <strong>Esta ação é IRREVERSÍVEL após ambas as confirmações!</strong>
          </p>
        </div>

        <!-- Transfer Form -->
        <form @submit.prevent="handleSubmit" class="transfer-form">
          <AInput
            v-model="toEmail"
            label="Email do Novo Proprietário"
            type="email"
            placeholder="exemplo@email.com"
            required
            :disabled="loading"
          >
            <template #helper>
              O novo proprietário receberá um email com código de confirmação
            </template>
          </AInput>

          <div class="form-field">
            <label class="field-label">Mensagem (Opcional)</label>
            <ion-textarea
              v-model="message"
              placeholder="Adicione uma mensagem para o novo proprietário..."
              :rows="4"
              :disabled="loading"
              class="custom-textarea"
            />
          </div>

          <!-- Info Box -->
          <div class="info-box">
            <h4>
              <ion-icon :icon="informationCircleOutline" />
              Como funciona
            </h4>
            <ol>
              <li>Você receberá um código de confirmação por email</li>
              <li>O novo proprietário também receberá um código diferente</li>
              <li>Ambos precisam confirmar com seus códigos</li>
              <li>Você tem 7 dias para completar a transferência</li>
              <li>Após confirmação de ambos, a transferência é concluída</li>
            </ol>
          </div>

          <!-- Error Alert -->
          <ion-alert
            :is-open="!!error"
            header="Erro"
            :message="error"
            :buttons="['OK']"
            @didDismiss="error = null"
          />

          <!-- Action Buttons -->
          <div class="button-group">
            <AButton
              expand="block"
              color="danger"
              fill="outline"
              @click="router.back()"
              :disabled="loading"
            >
              Cancelar
            </AButton>
            
            <AButton
              expand="block"
              type="submit"
              :loading="loading"
              :disabled="!toEmail || loading"
            >
              <template #icon-start>
                <ion-icon :icon="sendOutline" />
              </template>
              Iniciar Transferência
            </AButton>
          </div>
        </form>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  IonPage,
  IonContent,
  IonIcon,
  IonAlert,
  IonTextarea,
  alertController,
  loadingController
} from '@ionic/vue'
import {
  carSportOutline,
  warningOutline,
  informationCircleOutline,
  sendOutline
} from 'ionicons/icons'
import ModernHeader from '@/components/organisms/ModernHeader.vue'
import { AButton, ACard, AInput } from '@/components'
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
    const alert = await alertController.create({
      header: 'Erro',
      message: 'Veículo não encontrado',
      buttons: ['OK']
    })
    await alert.present()
    router.push('/tabs/vehicles')
  }
})

// Handle form submission
const handleSubmit = async () => {
  if (!vehicle.value || !toEmail.value) return

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(toEmail.value)) {
    error.value = 'Por favor, insira um email válido'
    return
  }

  // Show confirmation dialog
  const alert = await alertController.create({
    header: 'Confirmar Transferência',
    message: `
      <p>Você está prestes a iniciar a transferência de:</p>
      <p><strong>${vehicle.value.make} ${vehicle.value.model} - ${vehicle.value.plate}</strong></p>
      <p>Para: <strong>${toEmail.value}</strong></p>
      <br>
      <p><strong>Esta ação não pode ser desfeita após ambas as confirmações.</strong></p>
      <p>Deseja continuar?</p>
    `,
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Sim, Iniciar',
        handler: async () => {
          await executeTransfer()
        }
      }
    ]
  })

  await alert.present()
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
    const successAlert = await alertController.create({
      header: 'Transferência Iniciada!',
      message: `
        <p>A transferência foi iniciada com sucesso!</p>
        <br>
        <p>Você e o novo proprietário receberam emails com códigos de confirmação.</p>
        <p><strong>Ambos precisam confirmar para completar a transferência.</strong></p>
        <br>
        <p>Verifique seu email e confirme sua parte.</p>
      `,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            router.push('/tabs/vehicles')
          }
        }
      ]
    })

    await successAlert.present()
  } catch (err) {
    await loadingEl.dismiss()
    error.value = err instanceof Error ? err.message : 'Erro ao iniciar transferência'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.container {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.vehicle-card {
  margin-bottom: 24px;
}

.vehicle-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.vehicle-icon {
  font-size: 48px;
  color: var(--ion-color-primary);
}

.vehicle-info h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--ion-color-dark);
}

.vehicle-details {
  margin: 4px 0 0 0;
  font-size: 14px;
  color: var(--ion-color-medium);
}

.warning-box {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border-left: 4px solid #ef4444;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}

.warning-box h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 700;
  color: #b91c1c;
}

.warning-box h3 ion-icon {
  font-size: 24px;
}

.warning-box p {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #7f1d1d;
  line-height: 1.6;
}

.warning-box ul {
  margin: 0 0 12px 0;
  padding-left: 20px;
  color: #7f1d1d;
}

.warning-box li {
  margin-bottom: 8px;
  font-size: 14px;
  line-height: 1.5;
}

.warning-emphasis {
  padding: 12px;
  background: rgba(239, 68, 68, 0.2);
  border-radius: 8px;
  text-align: center;
  font-weight: 600 !important;
}

.transfer-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--ion-color-dark);
}

.custom-textarea {
  --background: var(--ion-color-light);
  --padding-start: 16px;
  --padding-end: 16px;
  --padding-top: 12px;
  --padding-bottom: 12px;
  border-radius: 12px;
  border: 1px solid var(--ion-color-medium-tint);
  min-height: 100px;
}

.info-box {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-left: 4px solid #3b82f6;
  border-radius: 12px;
  padding: 20px;
}

.info-box h4 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1e40af;
}

.info-box h4 ion-icon {
  font-size: 24px;
}

.info-box ol {
  margin: 0;
  padding-left: 20px;
  color: #1e3a8a;
}

.info-box li {
  margin-bottom: 8px;
  font-size: 14px;
  line-height: 1.5;
}

.button-group {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 12px;
  margin-top: 24px;
}

@media (max-width: 576px) {
  .container {
    padding: 16px;
  }

  .button-group {
    grid-template-columns: 1fr;
  }

  .vehicle-info {
    flex-direction: column;
    text-align: center;
  }
}
</style>
