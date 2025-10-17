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
            <ion-icon slot="start" :icon="add"></ion-icon>
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
                  <ion-icon slot="start" :icon="create"></ion-icon>
                  Editar
                </ion-button>
                <ion-button
                  fill="outline"
                  size="small"
                  expand="block"
                  color="danger"
                  @click.stop="handleDelete(vehicle)"
                >
                  <ion-icon slot="start" :icon="trash"></ion-icon>
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
/* Loading */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  min-height: 300px;
}

.loading-container p {
  margin-top: 1rem;
  color: #9ca3af; /* gray-400 */
}

/* Error State */
.error-state {
  text-align: center;
  padding: 2rem 1rem;
}

.error-state h3 {
  margin: 1rem 0 0.5rem 0;
  color: #ef4444; /* red-500 */
}

.error-state p {
  margin: 0 0 1rem 0;
  color: #9ca3af; /* gray-400 */
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
  max-width: 400px;
}

.empty-icon {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1.5rem;
  color: #4b5563; /* gray-600 */
}

.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 0.75rem;
}

.empty-state p {
  color: #9ca3af; /* gray-400 */
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

/* Vehicles Container */
.vehicles-container {
  padding: 16px;
}

.filter-segment {
  margin-bottom: 16px;
}

/* Vehicles Grid */
.vehicles-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 640px) {
  .vehicles-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .vehicles-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Vehicle Card */
.vehicle-card {
  margin: 0;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.vehicle-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.vehicle-image,
.vehicle-placeholder {
  width: 100%;
  height: 200px;
  background: #374151; /* gray-700 */
}

.vehicle-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.vehicle-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4f8ff7 0%, #3b82f6 100%); /* blue gradient */
}

.vehicle-placeholder ion-icon {
  font-size: 4rem;
  color: #ffffff;
  opacity: 0.7;
}

/* Card Content */
.vehicle-title {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffffff;
}

.vehicle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  gap: 8px;
}

.vehicle-year {
  display: flex;
  flex-direction: column;
}

.vehicle-year .label {
  font-size: 0.75rem;
  color: #9ca3af; /* gray-400 */
  margin-bottom: 2px;
}

.vehicle-year .value {
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
}

.fuel-chip {
  height: auto;
  font-size: 0.75rem;
  font-weight: 500;
}

/* Vehicle Details */
.vehicle-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #374151; /* gray-700 */
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-row .label {
  font-size: 0.875rem;
  color: #9ca3af; /* gray-400 */
}

.detail-row .value {
  font-size: 0.875rem;
  font-weight: 500;
  color: #ffffff;
}

/* Vehicle Actions */
.vehicle-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 1rem;
}

.vehicle-actions ion-button {
  margin: 0;
  font-size: 0.875rem;
}
</style>
