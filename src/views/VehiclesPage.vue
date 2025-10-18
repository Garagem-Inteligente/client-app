<template>
  <ion-page>
    <ModernHeader 
      title="Meus Veículos"
      :show-back-button="true"
      back-path="/tabs/home"
    />

    <ion-content :fullscreen="true">
      <!-- Loading State -->
      <div v-if="vehiclesStore.loading" class="loading-container">
        <ion-spinner name="crescent"></ion-spinner>
        <p>Carregando veículos...</p>
      </div>

      <!-- Error State -->
      <ion-card v-else-if="vehiclesStore.error">
        <ion-card-content class="error-state">
          <ion-icon :icon="alertCircle" color="danger" size="large"></ion-icon>
          <h3>Erro ao carregar veículos</h3>
          <p>{{ vehiclesStore.error }}</p>
          <ion-button @click="vehiclesStore.fetchVehicles()">
            Tentar Novamente
          </ion-button>
        </ion-card-content>
      </ion-card>

      <!-- Empty State -->
      <div v-else-if="vehiclesStore.vehicles.length === 0" class="empty-state-container">
        <div class="empty-state">
          <svg class="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <h3>Nenhum veículo cadastrado</h3>
          <p>
            Comece adicionando seu primeiro veículo e mantenha um histórico completo de manutenções
          </p>
          <ion-button @click="$router.push('/tabs/vehicle/new')" color="primary">
            <template v-slot:start>
<ion-icon  :icon="add"></ion-icon>
</template>
            Adicionar primeiro veículo
          </ion-button>
        </div>
      </div>

      <!-- Vehicles Grid -->
      <div v-else class="vehicles-container">
        <!-- Filter Tabs -->
        <ion-segment v-model="selectedFilter" @ion-change="filterVehicles" class="filter-segment">
          <ion-segment-button value="all">
            <ion-label>Todos ({{ vehiclesStore.vehicleCount }})</ion-label>
          </ion-segment-button>
          <ion-segment-button value="car">
            <ion-label>Carros</ion-label>
          </ion-segment-button>
          <ion-segment-button value="motorcycle">
            <ion-label>Motos</ion-label>
          </ion-segment-button>
        </ion-segment>

        <!-- Vehicles Grid -->
        <div class="vehicles-grid">
          <ion-card
            v-for="vehicle in filteredVehicles"
            :key="vehicle.id"
            class="vehicle-card"
            button
            @click="handleViewDetails(vehicle.id)"
          >
            <!-- Vehicle Image -->
            <div v-if="vehicle.imageUrl" class="vehicle-image">
              <img :src="vehicle.imageUrl" :alt="`${vehicle.make} ${vehicle.model}`" />
            </div>
            <div v-else class="vehicle-placeholder">
              <ion-icon :icon="getVehicleIcon(vehicle.vehicleType)" size="large"></ion-icon>
            </div>

            <ion-card-content>
              <!-- Title -->
              <h2 class="vehicle-title">
                {{ vehicle.make }} {{ vehicle.model }}
              </h2>

              <!-- Header: Year and Fuel -->
              <div class="vehicle-header">
                <div class="vehicle-year">
                  <span class="label">Ano</span>
                  <span class="value">{{ vehicle.year }}</span>
                </div>
                <ion-chip :color="getFuelTypeColor(vehicle.fuelType)" class="fuel-chip">
                  {{ getFuelTypeLabel(vehicle.fuelType) }}
                </ion-chip>
              </div>

              <!-- Details -->
              <div class="vehicle-details">
                <div class="detail-row">
                  <span class="label">Placa</span>
                  <span class="value">{{ vehicle.plate }}</span>
                </div>

                <div v-if="vehicle.color" class="detail-row">
                  <span class="label">Cor</span>
                  <span class="value">{{ vehicle.color }}</span>
                </div>

                <div class="detail-row">
                  <span class="label">Quilometragem</span>
                  <span class="value">{{ vehicle.mileage.toLocaleString('pt-BR') }} km</span>
                </div>
              </div>

              <!-- Actions -->
              <div class="vehicle-actions">
                <ion-button
                  fill="outline"
                  size="small"
                  expand="block"
                  @click.stop="handleEdit(vehicle)"
                >
                  <template v-slot:start>
<ion-icon  :icon="create"></ion-icon>
</template>
                  Editar
                </ion-button>
                <ion-button
                  fill="outline"
                  size="small"
                  expand="block"
                  color="danger"
                  @click.stop="handleDelete(vehicle)"
                >
                  <template v-slot:start>
<ion-icon  :icon="trash"></ion-icon>
</template>
                  Excluir
                </ion-button>
              </div>
            </ion-card-content>
          </ion-card>
        </div>
      </div>
    </ion-content>

    <!-- Delete Confirmation Modal -->
    <ion-alert
      :is-open="showDeleteModal"
      header="Excluir Veículo"
      :message="`Tem certeza que deseja excluir o veículo ${vehicleToDelete?.make} ${vehicleToDelete?.model}?`"
      :buttons="alertButtons"
      @did-dismiss="showDeleteModal = false"
    ></ion-alert>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonSpinner,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonChip,
  IonAlert
} from '@ionic/vue'
import {
  add,
  car,
  bicycle,
  alertCircle,
  create,
  trash
} from 'ionicons/icons'
import { useVehiclesStore, type Vehicle, type VehicleType, type FuelType } from '@/stores/vehicles'
import { FUEL_TYPE_LABELS } from '@/constants/vehicles'
import ModernHeader from '@/components/organisms/ModernHeader.vue'

const router = useRouter()
const vehiclesStore = useVehiclesStore()

const selectedFilter = ref<string>('all')
const showDeleteModal = ref(false)
const vehicleToDelete = ref<Vehicle | null>(null)
const deletingVehicle = ref(false)

const filteredVehicles = computed(() => {
  if (selectedFilter.value === 'all') {
    return vehiclesStore.vehicles
  }
  return vehiclesStore.vehicles.filter(
    vehicle => vehicle.vehicleType === selectedFilter.value
  )
})

const getVehicleIcon = (type: VehicleType) => {
  switch (type) {
    case 'car':
      return car
    case 'motorcycle':
      return bicycle
    default:
      return car
  }
}

const getFuelTypeLabel = (type: FuelType) => {
  return FUEL_TYPE_LABELS[type] || type
}

const getFuelTypeColor = (type: FuelType) => {
  const colors: Record<FuelType, string> = {
    flex: 'primary',
    gasoline: 'primary',
    ethanol: 'success',
    diesel: 'warning',
    electric: 'success',
    'hybrid-plugin': 'success',
    'hybrid-mild': 'success',
    gnv: 'warning'
  }
  return colors[type] || 'medium'
}

const filterVehicles = () => {
  // Filter is handled by computed property
}

const handleViewDetails = (vehicleId: string) => {
  console.log('Navigating to vehicle:', vehicleId)
  router.push(`/tabs/vehicle/${vehicleId}`)
}

const handleEdit = (vehicle: Vehicle) => {
  router.push(`/tabs/vehicle/${vehicle.id}`)
}

const handleDelete = (vehicle: Vehicle) => {
  vehicleToDelete.value = vehicle
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!vehicleToDelete.value) return

  try {
    deletingVehicle.value = true
    await vehiclesStore.deleteVehicle(vehicleToDelete.value.id)
    showDeleteModal.value = false
    vehicleToDelete.value = null
  } catch (error) {
    console.error('Error deleting vehicle:', error)
  } finally {
    deletingVehicle.value = false
  }
}

const cancelDelete = () => {
  showDeleteModal.value = false
  vehicleToDelete.value = null
}

const alertButtons = computed(() => [
  {
    text: 'Cancelar',
    role: 'cancel',
    handler: cancelDelete
  },
  {
    text: 'Excluir',
    role: 'destructive',
    handler: confirmDelete
  }
])

onMounted(async () => {
  await vehiclesStore.fetchVehicles()
})
</script>

<style scoped>
/* ====================================
   MODERN VEHICLES PAGE - 2025 DESIGN
   ==================================== */

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  min-height: 300px;
  gap: 1rem;
}

.loading-container p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.938rem;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

/* Error State */
.error-state {
  text-align: center;
  padding: 2rem 1rem;
}

.error-state h3 {
  margin: 1rem 0 0.5rem 0;
  color: var(--ion-color-danger);
}

.error-state p {
  margin: 0 0 1rem 0;
  color: rgba(255, 255, 255, 0.6);
}

/* Empty State */
.empty-state-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
  padding: 2rem;
}

.empty-state {
  text-align: center;
  max-width: 420px;
}

.empty-icon {
  width: 5rem;
  height: 5rem;
  margin: 0 auto 1.5rem;
  color: rgba(255, 255, 255, 0.3);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.75rem;
}

.empty-state p {
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 2rem;
  line-height: 1.6;
  font-size: 0.938rem;
}

/* Vehicles Container */
.vehicles-container {
  padding: 16px;
  max-width: 1400px;
  margin: 0 auto;
}

/* Filter Segment - Modern Tabs */
.filter-segment {
  margin-bottom: 24px;
  background: rgba(31, 41, 55, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 4px;
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.filter-segment::part(indicator) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  box-shadow: 
    0 4px 8px rgba(102, 126, 234, 0.4),
    0 0 20px rgba(102, 126, 234, 0.2);
}

.filter-segment ion-segment-button {
  --color: rgba(255, 255, 255, 0.6);
  --color-checked: white;
  --indicator-color: transparent;
  min-height: 44px;
  font-weight: 500;
  font-size: 0.938rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.filter-segment ion-segment-button::part(native) {
  transition: all 0.3s ease;
}

.filter-segment ion-segment-button.segment-button-checked {
  --color: white;
  font-weight: 600;
}

/* Vehicles Grid - Responsive */
.vehicles-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 640px) {
  .vehicles-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}

@media (min-width: 1024px) {
  .vehicles-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1400px) {
  .vehicles-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Vehicle Card - Modern Glassmorphism */
.vehicle-card {
  margin: 0;
  overflow: hidden;
  background: rgba(31, 41, 55, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  isolation: isolate;
}

.vehicle-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 240px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(0, 0, 0, 0.3) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 1;
}

.vehicle-card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: rgba(102, 126, 234, 0.3);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(102, 126, 234, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.vehicle-card:hover::before {
  opacity: 1;
}

/* Vehicle Image/Placeholder - Enhanced */
.vehicle-image,
.vehicle-placeholder {
  width: 100%;
  height: 240px;
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  position: relative;
  overflow: hidden;
}

.vehicle-image::after,
.vehicle-placeholder::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(0, 0, 0, 0.6) 100%
  );
  pointer-events: none;
}

.vehicle-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.vehicle-card:hover .vehicle-image img {
  transform: scale(1.1);
}

.vehicle-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
}

.vehicle-placeholder::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(255, 255, 255, 0.2) 0%,
    transparent 60%
  );
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.vehicle-placeholder ion-icon {
  font-size: 5rem;
  color: white;
  opacity: 0.8;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
  z-index: 1;
  transition: transform 0.3s ease;
}

.vehicle-card:hover .vehicle-placeholder ion-icon {
  transform: scale(1.1) rotate(5deg);
}

/* Card Content - Enhanced */
.vehicle-card ion-card-content {
  padding: 20px;
}

.vehicle-title {
  margin: 0 0 16px 0;
  font-size: 1.375rem;
  font-weight: 700;
  color: white;
  line-height: 1.3;
  letter-spacing: -0.5px;
  transition: color 0.3s ease;
}

.vehicle-card:hover .vehicle-title {
  color: #a5b4fc;
}

/* Header Section */
.vehicle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.vehicle-year {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.vehicle-year .label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.vehicle-year .value {
  font-size: 1.125rem;
  font-weight: 700;
  color: white;
  letter-spacing: -0.5px;
}

/* Fuel Chip - Modern Badge */
.fuel-chip {
  height: auto;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 12px;
  letter-spacing: 0.3px;
  background: rgba(102, 126, 234, 0.2);
  color: #a5b4fc;
  border: 1px solid rgba(102, 126, 234, 0.3);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.vehicle-card:hover .fuel-chip {
  background: rgba(102, 126, 234, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

/* Vehicle Details - Clean Grid */
.vehicle-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.detail-row:not(:last-child) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.detail-row .label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
}

.detail-row .value {
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  letter-spacing: -0.2px;
}

/* Vehicle Actions - Modern Buttons */
.vehicle-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.vehicle-actions ion-button {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  height: 40px;
  --border-radius: 12px;
  --box-shadow: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.vehicle-actions ion-button:not([color="danger"]) {
  --background: rgba(102, 126, 234, 0.1);
  --background-hover: rgba(102, 126, 234, 0.2);
  --border-color: rgba(102, 126, 234, 0.3);
  --color: #a5b4fc;
}

.vehicle-actions ion-button[color="danger"] {
  --background: rgba(239, 68, 68, 0.1);
  --background-hover: rgba(239, 68, 68, 0.2);
  --border-color: rgba(239, 68, 68, 0.3);
  --color: #fca5a5;
}

.vehicle-actions ion-button:hover {
  transform: translateY(-2px);
  --box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Desktop Enhancements */
@media (min-width: 768px) {
  .vehicles-container {
    padding: 24px;
  }

  .filter-segment {
    margin-bottom: 32px;
    padding: 6px;
  }

  .filter-segment ion-segment-button {
    min-height: 48px;
    font-size: 1rem;
  }

  .vehicle-card ion-card-content {
    padding: 24px;
  }

  .vehicle-title {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }

  .vehicle-actions {
    gap: 12px;
  }

  .vehicle-actions ion-button {
    height: 44px;
    font-size: 0.938rem;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
