<template>
  <ion-page>
    <ModernHeader title="Carros Transferidos" showBackButton />
    
    <ion-content class="custom-content">
      <div class="container">
        <!-- Info Banner -->
        <div class="info-banner">
          <ion-icon :icon="informationCircleOutline" />
          <p>
            Estes são veículos que você transferiu para outros proprietários.
            Você pode visualizar o histórico, mas não pode mais editá-los.
          </p>
        </div>

        <!-- Transferred Vehicles List -->
        <div v-if="!loading && transferredVehicles.length > 0" class="vehicles-list">
          <ACard
            v-for="vehicle in transferredVehicles"
            :key="vehicle.id"
            class="vehicle-card"
            @click="viewVehicleHistory(vehicle)"
          >
            <div class="vehicle-header">
              <div class="vehicle-image">
                <img
                  v-if="vehicle.vehicleSnapshot.imageUrl"
                  :src="vehicle.vehicleSnapshot.imageUrl"
                  :alt="`${vehicle.vehicleSnapshot.make} ${vehicle.vehicleSnapshot.model}`"
                />
                <ion-icon v-else :icon="carSportOutline" class="placeholder-icon" />
              </div>
              
              <div class="vehicle-info">
                <h3>
                  {{ vehicle.vehicleSnapshot.make }} 
                  {{ vehicle.vehicleSnapshot.model }}
                </h3>
                <p class="vehicle-details">
                  {{ vehicle.vehicleSnapshot.year }} • 
                  {{ vehicle.vehicleSnapshot.plate }}
                </p>
                <p class="vehicle-mileage">
                  <ion-icon :icon="speedometerOutline" />
                  {{ formatMileage(vehicle.vehicleSnapshot.mileage) }} km
                </p>
              </div>

              <ion-icon :icon="lockClosedOutline" class="read-only-icon" />
            </div>

            <div class="transfer-info">
              <div class="info-row">
                <ion-icon :icon="calendarOutline" />
                <span>Transferido em {{ formatDate(vehicle.transferredAt) }}</span>
              </div>
              <div class="info-row">
                <ion-icon :icon="personOutline" />
                <span>Para: {{ vehicle.transferredTo }}</span>
              </div>
            </div>

            <div class="action-footer">
              <AButton
                fill="clear"
                size="small"
                @click.stop="viewVehicleHistory(vehicle)"
              >
                <template #icon-start>
                  <ion-icon :icon="documentTextOutline" />
                </template>
                Ver Histórico
              </AButton>
            </div>
          </ACard>
        </div>

        <!-- Empty State -->
        <div v-else-if="!loading" class="empty-state">
          <ion-icon :icon="carOutline" class="empty-icon" />
          <h3>Nenhum Veículo Transferido</h3>
          <p>Você ainda não transferiu nenhum veículo</p>
          <AButton @click="router.push('/tabs/vehicles')">
            Ver Meus Veículos
          </AButton>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="loading-state">
          <ion-spinner name="crescent" />
          <p>Carregando veículos transferidos...</p>
        </div>
      </div>
    </ion-content>

    <!-- Vehicle History Modal -->
    <ion-modal :is-open="showHistoryModal" @didDismiss="closeHistoryModal">
      <ion-header>
        <ion-toolbar>
          <ion-title>Histórico do Veículo</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="closeHistoryModal">Fechar</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div v-if="selectedVehicle" class="modal-content">
          <!-- Vehicle Info -->
          <div class="modal-vehicle-info">
            <h2>
              {{ selectedVehicle.vehicleSnapshot.make }} 
              {{ selectedVehicle.vehicleSnapshot.model }}
            </h2>
            <p>{{ selectedVehicle.vehicleSnapshot.year }} • {{ selectedVehicle.vehicleSnapshot.plate }}</p>
          </div>

          <!-- Read-Only Notice -->
          <div class="readonly-notice">
            <ion-icon :icon="lockClosedOutline" />
            <div>
              <strong>Somente Leitura</strong>
              <p>Este veículo foi transferido. Você pode visualizar o histórico mas não pode editá-lo.</p>
            </div>
          </div>

          <!-- Transfer Info -->
          <div class="transfer-details-box">
            <h4>Informações da Transferência</h4>
            <div class="detail-item">
              <span class="label">Transferido em:</span>
              <span class="value">{{ formatDate(selectedVehicle.transferredAt) }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Transferido para:</span>
              <span class="value">{{ selectedVehicle.transferredTo }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Quilometragem na transferência:</span>
              <span class="value">{{ formatMileage(selectedVehicle.vehicleSnapshot.mileage) }} km</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="modal-actions">
            <AButton
              expand="block"
              fill="outline"
              @click="viewFullHistory"
            >
              <template #icon-start>
                <ion-icon :icon="documentTextOutline" />
              </template>
              Ver Histórico Completo de Manutenções
            </AButton>
          </div>
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
  alertController
} from '@ionic/vue'
import {
  informationCircleOutline,
  carSportOutline,
  carOutline,
  speedometerOutline,
  lockClosedOutline,
  calendarOutline,
  personOutline,
  documentTextOutline
} from 'ionicons/icons'
import ModernHeader from '@/components/organisms/ModernHeader.vue'
import { AButton, ACard } from '@/components'
import { useTransfersStore } from '@/stores/transfers'
import type { TransferredVehicle } from '@/types'

const router = useRouter()
const transfersStore = useTransfersStore()

// State
const loading = ref(true)
const showHistoryModal = ref(false)
const selectedVehicle = ref<TransferredVehicle | null>(null)

// Computed
const transferredVehicles = computed(() => transfersStore.transferredVehicles)

// Methods
const formatMileage = (mileage: number): string => {
  return mileage.toLocaleString('pt-BR')
}

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

const viewVehicleHistory = (vehicle: TransferredVehicle) => {
  selectedVehicle.value = vehicle
  showHistoryModal.value = true
}

const closeHistoryModal = () => {
  showHistoryModal.value = false
  selectedVehicle.value = null
}

const viewFullHistory = async () => {
  if (!selectedVehicle.value) return

  // Navigate to a read-only vehicle detail page
  // For now, show an alert
  const alert = await alertController.create({
    header: 'Histórico Completo',
    message: `
      <p>O histórico completo de manutenções está disponível em modo somente leitura.</p>
      <br>
      <p><strong>ID do Veículo:</strong> ${selectedVehicle.value.vehicleId}</p>
      <p>Este recurso será implementado em breve.</p>
    `,
    buttons: ['OK']
  })

  await alert.present()
}

// Lifecycle
onMounted(async () => {
  loading.value = true
  try {
    await transfersStore.fetchTransferredVehicles()
    transfersStore.subscribeToTransferredVehicles()
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
  max-width: 1000px;
  margin: 0 auto;
}

.info-banner {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-left: 4px solid #3b82f6;
  border-radius: 12px;
  margin-bottom: 24px;
}

.info-banner ion-icon {
  font-size: 24px;
  color: #1e40af;
  flex-shrink: 0;
}

.info-banner p {
  margin: 0;
  font-size: 14px;
  color: #1e3a8a;
  line-height: 1.6;
}

.vehicles-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.vehicle-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  padding: 0 !important;
  overflow: hidden;
}

.vehicle-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.vehicle-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-bottom: 1px solid var(--ion-color-light);
}

.vehicle-image {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  background: var(--ion-color-light);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.vehicle-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-icon {
  font-size: 40px;
  color: var(--ion-color-medium);
}

.vehicle-info {
  flex: 1;
}

.vehicle-info h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--ion-color-dark);
}

.vehicle-details {
  margin: 4px 0;
  font-size: 13px;
  color: var(--ion-color-medium);
}

.vehicle-mileage {
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 4px 0 0 0;
  font-size: 13px;
  color: var(--ion-color-medium-shade);
}

.vehicle-mileage ion-icon {
  font-size: 16px;
}

.read-only-icon {
  font-size: 24px;
  color: var(--ion-color-warning);
  flex-shrink: 0;
}

.transfer-info {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--ion-color-medium-shade);
}

.info-row ion-icon {
  font-size: 18px;
  color: var(--ion-color-medium);
}

.action-footer {
  padding: 12px 20px;
  background: var(--ion-color-light);
  border-top: 1px solid var(--ion-color-medium-tint);
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  font-size: 100px;
  color: var(--ion-color-medium);
  margin-bottom: 24px;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--ion-color-dark);
}

.empty-state p {
  margin: 0 0 32px 0;
  font-size: 14px;
  color: var(--ion-color-medium);
}

.loading-state {
  text-align: center;
  padding: 80px 20px;
  color: var(--ion-color-medium);
}

.loading-state ion-spinner {
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
}

.modal-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.modal-vehicle-info {
  text-align: center;
  padding: 20px;
  background: var(--ion-color-light);
  border-radius: 12px;
}

.modal-vehicle-info h2 {
  margin: 0 0 8px 0;
  font-size: 22px;
  font-weight: 700;
  color: var(--ion-color-dark);
}

.modal-vehicle-info p {
  margin: 0;
  font-size: 14px;
  color: var(--ion-color-medium);
}

.readonly-notice {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-left: 4px solid #f59e0b;
  border-radius: 12px;
}

.readonly-notice ion-icon {
  font-size: 32px;
  color: #d97706;
  flex-shrink: 0;
}

.readonly-notice strong {
  display: block;
  margin-bottom: 4px;
  color: #92400e;
}

.readonly-notice p {
  margin: 0;
  font-size: 13px;
  color: #78350f;
  line-height: 1.5;
}

.transfer-details-box {
  padding: 20px;
  background: var(--ion-color-light);
  border-radius: 12px;
}

.transfer-details-box h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--ion-color-dark);
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--ion-color-medium-tint);
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-item .label {
  font-size: 14px;
  color: var(--ion-color-medium-shade);
}

.detail-item .value {
  font-size: 14px;
  font-weight: 600;
  color: var(--ion-color-dark);
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

@media (max-width: 576px) {
  .container {
    padding: 16px;
  }

  .vehicles-list {
    grid-template-columns: 1fr;
  }

  .vehicle-header {
    flex-wrap: wrap;
  }
}
</style>
