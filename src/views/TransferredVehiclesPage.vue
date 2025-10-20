<template>
  <ion-page>
    <ModernHeader title="Carros Transferidos" showBackButton />
    
    <ion-content class="custom-content">
      <!-- Background layers -->
      <div class="background-gradient"></div>
      <div class="background-pattern"></div>
      
      <div class="container">
        <!-- Info Banner -->
        <div class="info-banner-card">
          <div class="banner-icon">
            <ion-icon :icon="swapHorizontalOutline"></ion-icon>
          </div>
          <div class="banner-content">
            <h3>Histórico de Transferências</h3>
            <p>
              Estes são veículos que você transferiu para outros proprietários.
              Você pode visualizar o histórico completo, mas não pode mais editá-los.
            </p>
          </div>
        </div>

        <!-- Transferred Vehicles List -->
        <div v-if="!loading && transferredVehicles.length > 0" class="vehicles-grid">
          <div
            v-for="vehicle in transferredVehicles"
            :key="vehicle.id"
            class="vehicle-card"
            @click="viewVehicleHistory(vehicle)"
          >
            <!-- Status Badge -->
            <div class="status-badge">
              <ion-icon :icon="lockClosedOutline"></ion-icon>
              <span>Somente Leitura</span>
            </div>

            <!-- Vehicle Image -->
            <div class="vehicle-image-wrapper">
              <img
                v-if="vehicle.vehicleSnapshot.imageUrl"
                :src="vehicle.vehicleSnapshot.imageUrl"
                :alt="`${vehicle.vehicleSnapshot.make} ${vehicle.vehicleSnapshot.model}`"
                class="vehicle-image"
              />
              <div v-else class="vehicle-image-placeholder">
                <ion-icon :icon="carSportOutline"></ion-icon>
              </div>
              <div class="image-overlay">
                <ion-icon :icon="eyeOutline"></ion-icon>
                <span>Ver Histórico</span>
              </div>
            </div>

            <!-- Vehicle Info -->
            <div class="vehicle-content">
              <h3 class="vehicle-name">
                {{ vehicle.vehicleSnapshot.make }} 
                {{ vehicle.vehicleSnapshot.model }}
              </h3>
              
              <div class="vehicle-specs">
                <span class="spec-item">
                  <ion-icon :icon="calendarOutline"></ion-icon>
                  {{ vehicle.vehicleSnapshot.year }}
                </span>
                <span class="spec-divider">•</span>
                <span class="spec-item">
                  <ion-icon :icon="documentTextOutline"></ion-icon>
                  {{ vehicle.vehicleSnapshot.plate }}
                </span>
              </div>

              <div class="vehicle-mileage">
                <ion-icon :icon="speedometerOutline"></ion-icon>
                <span>{{ formatMileage(vehicle.vehicleSnapshot.mileage) }} km</span>
              </div>

              <!-- Transfer Details -->
              <div class="transfer-details">
                <div class="detail-row">
                  <ion-icon :icon="calendarOutline" class="detail-icon"></ion-icon>
                  <div class="detail-content">
                    <span class="detail-label">Transferido em</span>
                    <span class="detail-value">{{ formatDate(vehicle.transferredAt) }}</span>
                  </div>
                </div>
                
                <div class="detail-row">
                  <ion-icon :icon="personOutline" class="detail-icon"></ion-icon>
                  <div class="detail-content">
                    <span class="detail-label">Novo proprietário</span>
                    <span class="detail-value">{{ vehicle.transferredTo }}</span>
                  </div>
                </div>
              </div>

              <!-- Action Button -->
              <button class="view-history-btn" @click.stop="viewVehicleHistory(vehicle)">
                <ion-icon :icon="documentTextOutline"></ion-icon>
                <span>Ver Histórico Completo</span>
                <ion-icon :icon="chevronForwardOutline" class="arrow-icon"></ion-icon>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="!loading" class="empty-state-card">
          <div class="empty-icon-wrapper">
            <ion-icon :icon="swapHorizontalOutline" class="empty-icon"></ion-icon>
          </div>
          <h3 class="empty-title">Nenhum Veículo Transferido</h3>
          <p class="empty-description">
            Você ainda não transferiu nenhum veículo.<br>
            Quando fizer uma transferência, ela aparecerá aqui.
          </p>
          <AButton @click="router.push('/tabs/vehicles')" size="default">
            <template #icon-start>
              <ion-icon :icon="carOutline"></ion-icon>
            </template>
            Ver Meus Veículos
          </AButton>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="loading-state">
          <ion-spinner name="crescent" color="primary" />
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

    <!-- Info Modal -->
    <MConfirmModal
      v-model:is-open="showInfoModal"
      title="Histórico Completo"
      :message="infoMessage"
      variant="info"
      confirm-text="OK"
      :show-cancel="false"
      confirm-color="primary"
    />
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
  IonSpinner
} from '@ionic/vue'
import {
  carSportOutline,
  carOutline,
  speedometerOutline,
  lockClosedOutline,
  calendarOutline,
  personOutline,
  documentTextOutline,
  swapHorizontalOutline,
  eyeOutline,
  chevronForwardOutline
} from 'ionicons/icons'
import ModernHeader from '@/components/organisms/ModernHeader.vue'
import { AButton } from '@/components'
import MConfirmModal from '@/components/molecules/MConfirmModal.vue'
import { useTransfersStore } from '@/stores/transfers'
import type { TransferredVehicle } from '@/types'

const router = useRouter()
const transfersStore = useTransfersStore()

// State
const loading = ref(true)
const showHistoryModal = ref(false)
const selectedVehicle = ref<TransferredVehicle | null>(null)
const showInfoModal = ref(false)
const infoMessage = ref('')

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

  infoMessage.value = `O histórico completo de manutenções está disponível em modo somente leitura. ID do Veículo: ${selectedVehicle.value.vehicleId}. Este recurso será implementado em breve.`
  showInfoModal.value = true
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
/* Background layers */
.background-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 300px;
  background: linear-gradient(180deg, 
    rgba(var(--ion-color-secondary-rgb), 0.1) 0%,
    rgba(var(--ion-color-secondary-rgb), 0.05) 50%,
    transparent 100%);
  pointer-events: none;
  z-index: 0;
}

.background-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 300px;
  background-image: 
    radial-gradient(circle at 30% 40%, rgba(var(--ion-color-secondary-rgb), 0.1) 0%, transparent 50%),
    radial-gradient(circle at 70% 70%, rgba(var(--ion-color-tertiary-rgb), 0.1) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.container {
  position: relative;
  z-index: 1;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/* Info Banner Card */
.info-banner-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
  border-radius: 20px;
  margin-bottom: 24px;
  border: 2px solid #818cf8;
  box-shadow: 0 4px 12px rgba(129, 140, 248, 0.2);
}

.banner-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 8px rgba(99, 102, 241, 0.3);
}

.banner-icon ion-icon {
  font-size: 28px;
  color: white;
}

.banner-content h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 700;
  color: #3730a3;
}

.banner-content p {
  margin: 0;
  font-size: 14px;
  color: #4338ca;
  line-height: 1.6;
}

/* Vehicles Grid */
.vehicles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 20px;
}

/* Vehicle Card */
.vehicle-card {
  background: var(--ion-card-background, white);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.vehicle-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

/* Status Badge */
.status-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(245, 158, 11, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.4);
}

.status-badge ion-icon {
  font-size: 16px;
}

/* Vehicle Image */
.vehicle-image-wrapper {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
}

.vehicle-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.vehicle-card:hover .vehicle-image {
  transform: scale(1.1);
}

.vehicle-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, 
    rgba(var(--ion-color-secondary-rgb), 0.1) 0%, 
    rgba(var(--ion-color-secondary-rgb), 0.05) 100%);
}

.vehicle-image-placeholder ion-icon {
  font-size: 80px;
  color: var(--ion-color-medium);
  opacity: 0.5;
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.vehicle-card:hover .image-overlay {
  opacity: 1;
}

.image-overlay ion-icon {
  font-size: 20px;
}

/* Vehicle Content */
.vehicle-content {
  padding: 20px;
}

.vehicle-name {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--ion-color-dark);
  line-height: 1.3;
}

.vehicle-specs {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 13px;
  color: var(--ion-color-medium);
}

.spec-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.spec-item ion-icon {
  font-size: 16px;
}

.spec-divider {
  opacity: 0.5;
}

.vehicle-mileage {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: var(--ion-color-light);
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  color: var(--ion-color-dark);
  width: fit-content;
  margin-bottom: 16px;
}

.vehicle-mileage ion-icon {
  font-size: 18px;
  color: var(--ion-color-primary);
}

/* Transfer Details */
.transfer-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, 
    rgba(var(--ion-color-light-rgb), 0.5) 0%, 
    rgba(var(--ion-color-light-rgb), 0.3) 100%);
  border-radius: 12px;
  margin-bottom: 16px;
}

.detail-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.detail-icon {
  font-size: 20px;
  color: var(--ion-color-secondary);
  flex-shrink: 0;
  margin-top: 2px;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.detail-label {
  font-size: 12px;
  color: var(--ion-color-medium);
  font-weight: 500;
}

.detail-value {
  font-size: 14px;
  color: var(--ion-color-dark);
  font-weight: 600;
}

/* View History Button */
.view-history-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: linear-gradient(135deg, 
    var(--ion-color-primary) 0%, 
    var(--ion-color-primary-shade) 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(var(--ion-color-primary-rgb), 0.3);
}

.view-history-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(var(--ion-color-primary-rgb), 0.4);
}

.view-history-btn:active {
  transform: translateY(0);
}

.view-history-btn ion-icon:first-child {
  font-size: 20px;
}

.arrow-icon {
  font-size: 20px;
  transition: transform 0.3s ease;
}

.view-history-btn:hover .arrow-icon {
  transform: translateX(4px);
}

/* Empty State */
.empty-state-card {
  text-align: center;
  padding: 80px 20px;
  background: var(--ion-card-background, white);
  border-radius: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.empty-icon-wrapper {
  width: 120px;
  height: 120px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, 
    rgba(var(--ion-color-secondary-rgb), 0.1) 0%, 
    rgba(var(--ion-color-secondary-rgb), 0.05) 100%);
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon {
  font-size: 64px;
  color: var(--ion-color-secondary);
}

.empty-title {
  margin: 0 0 12px 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--ion-color-dark);
}

.empty-description {
  margin: 0 0 32px 0;
  font-size: 15px;
  color: var(--ion-color-medium);
  line-height: 1.6;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 80px 20px;
}

.loading-state ion-spinner {
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
}

.loading-state p {
  margin: 0;
  font-size: 15px;
  color: var(--ion-color-medium);
  font-weight: 500;
}

/* Modal Styles */
.modal-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.modal-vehicle-info {
  text-align: center;
  padding: 20px;
  background: var(--ion-color-light);
  border-radius: 16px;
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

/* Responsive */
@media (max-width: 768px) {
  .vehicles-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .container {
    padding: 16px;
  }

  .info-banner-card {
    padding: 16px;
  }

  .vehicle-image-wrapper {
    height: 180px;
  }

  .vehicle-content {
    padding: 16px;
  }
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .vehicle-card {
    background: var(--ion-card-background, #1a1f2e);
  }

  .empty-state-card {
    background: var(--ion-card-background, #1a1f2e);
  }

  .vehicle-image-placeholder {
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.05) 0%, 
      rgba(255, 255, 255, 0.02) 100%);
  }
}
</style>
