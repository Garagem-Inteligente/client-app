<template>
  <ion-page>
    <ModernHeader 
      title="Meus Veículos"
      :show-back-button="true"
      back-path="/tabs/home"
    />

    <ion-content :fullscreen="true" class="app-content">
      <!-- Background layers -->
      <div class="background-gradient"></div>
      <div class="background-pattern"></div>
      
      <div class="page-content-wrapper">
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
        <!-- Modern Filter Pills -->
        <div class="filter-pills">
          <button 
            class="filter-pill"
            :class="{ active: selectedFilter === 'all' }"
            @click="selectedFilter = 'all'"
          >
            <ion-icon :icon="apps" class="pill-icon"></ion-icon>
            <span class="pill-label">Todos</span>
            <span class="pill-count">{{ vehiclesStore.vehicleCount }}</span>
          </button>
          
          <button 
            class="filter-pill"
            :class="{ active: selectedFilter === 'car' }"
            @click="selectedFilter = 'car'"
          >
            <ion-icon :icon="car" class="pill-icon"></ion-icon>
            <span class="pill-label">Carros</span>
            <span class="pill-count">{{ vehicleTypeCount('car') }}</span>
          </button>
          
          <button 
            class="filter-pill"
            :class="{ active: selectedFilter === 'motorcycle' }"
            @click="selectedFilter = 'motorcycle'"
          >
            <ion-icon :icon="bicycle" class="pill-icon"></ion-icon>
            <span class="pill-label">Motos</span>
            <span class="pill-count">{{ vehicleTypeCount('motorcycle') }}</span>
          </button>
          
          <button 
            class="filter-pill"
            :class="{ active: selectedFilter === 'van' }"
            @click="selectedFilter = 'van'"
          >
            <ion-icon :icon="bus" class="pill-icon"></ion-icon>
            <span class="pill-label">Vans</span>
            <span class="pill-count">{{ vehicleTypeCount('van') }}</span>
          </button>
          
          <button 
            class="filter-pill"
            :class="{ active: selectedFilter === 'heavy' }"
            @click="selectedFilter = 'heavy'"
          >
            <ion-icon :icon="cube" class="pill-icon"></ion-icon>
            <span class="pill-label">Pesados</span>
            <span class="pill-count">{{ heavyVehiclesCount }}</span>
          </button>
        </div>

        <!-- Vehicles Grid -->
        <div class="vehicles-grid">
          <!-- Empty Category CTA -->
          <ion-card
            v-if="filteredVehicles.length === 0"
            class="empty-category-card"
            button
            @click="$router.push('/tabs/vehicle/new')"
          >
            <ion-card-content>
              <div class="empty-category-content">
                <ion-icon :icon="addCircle" class="empty-category-icon"></ion-icon>
                <h3 class="empty-category-title">Nenhum veículo nesta categoria</h3>
                <p class="empty-category-text">
                  {{ getEmptyCategoryMessage() }}
                </p>
                <ion-button expand="block" class="empty-category-button">
                  <template v-slot:start>
                    <ion-icon :icon="add"></ion-icon>
                  </template>
                  Cadastrar Veículo
                </ion-button>
              </div>
            </ion-card-content>
          </ion-card>

          <!-- Vehicle Cards -->
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
  IonChip,
  IonAlert
} from '@ionic/vue'
import {
  add,
  addCircle,
  car,
  bicycle,
  apps,
  bus,
  cube,
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
  if (selectedFilter.value === 'heavy') {
    return vehiclesStore.vehicles.filter(
      vehicle => vehicle.vehicleType === 'truck' || vehicle.vehicleType === 'bus'
    )
  }
  return vehiclesStore.vehicles.filter(
    vehicle => vehicle.vehicleType === selectedFilter.value
  )
})

const vehicleTypeCount = (type: VehicleType) => {
  return vehiclesStore.vehicles.filter(v => v.vehicleType === type).length
}

const heavyVehiclesCount = computed(() => {
  return vehiclesStore.vehicles.filter(
    v => v.vehicleType === 'truck' || v.vehicleType === 'bus'
  ).length
})

const getVehicleIcon = (type: VehicleType) => {
  switch (type) {
    case 'car':
      return car
    case 'motorcycle':
      return bicycle
    case 'van':
      return bus
    case 'truck':
      return cube
    case 'bus':
      return bus
    case 'pickup':
      return car
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

const getEmptyCategoryMessage = () => {
  const messages: Record<string, string> = {
    car: 'Adicione seu primeiro carro para começar a gerenciar manutenções e histórico.',
    motorcycle: 'Cadastre sua primeira moto e mantenha tudo organizado.',
    van: 'Registre sua van para acompanhar manutenções e custos.',
    heavy: 'Adicione caminhões ou ônibus para gerenciar sua frota pesada.'
  }
  return messages[selectedFilter.value] || 'Cadastre um veículo nesta categoria.'
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
   VEHICLES PAGE - NEW DESIGN SYSTEM 2025
   Dark Glassmorphism + Modern Typography
   ==================================== */

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  min-height: 300px;
  gap: 1.5rem;
}

.loading-container ion-spinner {
  --color: #818cf8;
  transform: scale(1.5);
}

.loading-container p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  font-weight: 500;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* Error State */
ion-card.error-state-card {
  background: rgba(31, 41, 55, 0.75);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(239, 68, 68, 0.4);
  border-radius: 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  margin: 16px;
}

.error-state {
  text-align: center;
  padding: 2.5rem 1.5rem;
}

.error-state ion-icon {
  margin-bottom: 1rem;
}

.error-state h3 {
  margin: 0 0 0.75rem 0;
  color: #fca5a5;
  font-size: 1.25rem;
  font-weight: 700;
}

.error-state p {
  margin: 0 0 1.5rem 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.938rem;
  line-height: 1.6;
}

.error-state ion-button {
  --background: rgba(239, 68, 68, 0.15);
  --background-hover: rgba(239, 68, 68, 0.25);
  --color: #fca5a5;
  --border-radius: 12px;
  font-weight: 600;
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
  max-width: 480px;
  background: rgba(31, 41, 55, 0.75);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  padding: 3rem 2rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.empty-icon {
  width: 6rem;
  height: 6rem;
  margin: 0 auto 2rem;
  color: rgba(129, 140, 248, 0.4);
  animation: float 3s ease-in-out infinite;
  filter: drop-shadow(0 4px 12px rgba(129, 140, 248, 0.3));
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-12px) rotate(3deg); }
}

.empty-state h3 {
  font-size: 1.75rem;
  font-weight: 800;
  color: white;
  margin-bottom: 1rem;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.empty-state p {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2rem;
  line-height: 1.7;
  font-size: 1rem;
}

.empty-state ion-button {
  --background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --background-hover: linear-gradient(135deg, #5568d3 0%, #6a3f91 100%);
  --color: white;
  --border-radius: 14px;
  --padding-top: 14px;
  --padding-bottom: 14px;
  --padding-start: 24px;
  --padding-end: 24px;
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: -0.2px;
  text-transform: none;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
}

.empty-state ion-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(102, 126, 234, 0.5);
}

/* Vehicles Container */
.vehicles-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

/* Modern Filter Pills */
.filter-pills {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  flex-wrap: wrap;
  justify-content: center;
}

.filter-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  background: rgba(31, 41, 55, 0.6);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.938rem;
  font-weight: 600;
  letter-spacing: -0.2px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.filter-pill::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.filter-pill:hover {
  transform: translateY(-2px);
  border-color: rgba(129, 140, 248, 0.4);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.filter-pill:hover::before {
  opacity: 1;
}

.filter-pill.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: rgba(129, 140, 248, 0.6);
  color: white;
  box-shadow: 
    0 8px 24px rgba(102, 126, 234, 0.5),
    0 0 32px rgba(102, 126, 234, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transform: translateY(-4px);
}

.filter-pill.active::before {
  opacity: 0;
}

.filter-pill .pill-icon {
  font-size: 1.25rem;
  position: relative;
  z-index: 1;
  transition: transform 0.3s ease;
}

.filter-pill:hover .pill-icon {
  transform: scale(1.15);
}

.filter-pill.active .pill-icon {
  transform: scale(1.1) rotate(-5deg);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.filter-pill .pill-label {
  position: relative;
  z-index: 1;
  font-weight: 700;
}

.filter-pill .pill-count {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 8px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  font-size: 0.813rem;
  font-weight: 800;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
}

.filter-pill.active .pill-count {
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* Vehicles Grid - Responsive: Mobile 1, Desktop 3 */
.vehicles-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 768px) {
  .vehicles-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .vehicles-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
  }
}

/* Empty Category CTA Card */
.empty-category-card {
  background: rgba(31, 41, 55, 0.75);
  backdrop-filter: blur(15px);
  border-radius: 24px;
  border: 2px dashed rgba(129, 140, 248, 0.4);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  grid-column: 1 / -1;
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
}

.empty-category-card:hover {
  transform: translateY(-4px);
  border-color: rgba(129, 140, 248, 0.7);
  box-shadow: 
    0 12px 32px rgba(0, 0, 0, 0.4),
    0 0 40px rgba(129, 140, 248, 0.2);
}

.empty-category-card ion-card-content {
  padding: 48px 32px;
}

.empty-category-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 20px;
}

.empty-category-icon {
  font-size: 5rem;
  color: rgba(129, 140, 248, 0.6);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { 
    opacity: 0.6;
    transform: scale(1);
  }
  50% { 
    opacity: 1;
    transform: scale(1.05);
  }
}

.empty-category-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 800;
  color: white;
  letter-spacing: -0.5px;
}

.empty-category-text {
  margin: 0;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  max-width: 400px;
}

.empty-category-button {
  --background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --background-hover: linear-gradient(135deg, #5568d3 0%, #6a3f91 100%);
  --color: white;
  --border-radius: 14px;
  --padding-top: 14px;
  --padding-bottom: 14px;
  margin-top: 12px;
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: -0.2px;
  text-transform: none;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
}

.empty-category-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(102, 126, 234, 0.5);
}

.empty-category-button ion-icon {
  font-size: 1.25rem;
}

/* Vehicle Card - Dark Glassmorphism Design System */
.vehicle-card {
  margin: 0;
  overflow: hidden;
  background: rgba(31, 41, 55, 0.75);
  backdrop-filter: blur(15px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 
    0 8px 20px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  isolation: isolate;
}

.vehicle-card::before {
  content: '';
  position: absolute;
  inset: -1px;
  background: linear-gradient(135deg, 
    rgba(102, 126, 234, 0) 0%,
    rgba(102, 126, 234, 0.3) 50%,
    rgba(139, 92, 246, 0.3) 100%
  );
  border-radius: 24px;
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: -1;
}

.vehicle-card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: rgba(129, 140, 248, 0.4);
  box-shadow: 
    0 24px 48px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(129, 140, 248, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
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
  inset: 0;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(0, 0, 0, 0.7) 100%
  );
  pointer-events: none;
  z-index: 1;
}

.vehicle-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.vehicle-card:hover .vehicle-image img {
  transform: scale(1.15);
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
  background: 
    radial-gradient(
      circle at 30% 30%,
      rgba(255, 255, 255, 0.25) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 70% 70%,
      rgba(139, 92, 246, 0.3) 0%,
      transparent 50%
    );
  animation: shimmer 4s ease-in-out infinite;
  z-index: 0;
}

@keyframes shimmer {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}

.vehicle-placeholder ion-icon {
  font-size: 6rem;
  color: white;
  opacity: 0.9;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.4));
  z-index: 2;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.vehicle-card:hover .vehicle-placeholder ion-icon {
  transform: scale(1.15) rotate(-5deg);
  opacity: 1;
}

/* Card Content */
.vehicle-card ion-card-content {
  padding: 24px;
  background: transparent;
}

.vehicle-title {
  margin: 0 0 20px 0;
  font-size: 1.5rem;
  font-weight: 800;
  color: white;
  line-height: 1.2;
  letter-spacing: -0.8px;
  transition: all 0.3s ease;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.vehicle-card:hover .vehicle-title {
  color: #c7d2fe;
  transform: translateX(4px);
}

/* Header Section */
.vehicle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 16px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.vehicle-year {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.vehicle-year .label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.55);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.vehicle-year .value {
  font-size: 1.375rem;
  font-weight: 800;
  color: white;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Fuel Chip - Modern Badge */
.fuel-chip {
  height: auto;
  font-size: 0.813rem;
  font-weight: 700;
  padding: 8px 16px;
  border-radius: 14px;
  letter-spacing: 0.3px;
  background: rgba(129, 140, 248, 0.2);
  color: #c7d2fe;
  border: 1px solid rgba(129, 140, 248, 0.4);
  box-shadow: 
    0 4px 8px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  text-transform: uppercase;
}

.vehicle-card:hover .fuel-chip {
  background: rgba(129, 140, 248, 0.35);
  border-color: rgba(129, 140, 248, 0.6);
  transform: translateY(-2px);
  box-shadow: 
    0 6px 16px rgba(129, 140, 248, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

/* Vehicle Details - Clean Grid */
.vehicle-details {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 20px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  transition: background 0.2s ease;
}

.detail-row:not(:last-child) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.detail-row:hover {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  padding-left: 8px;
  padding-right: 8px;
}

.detail-row .label {
  font-size: 0.938rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 600;
  letter-spacing: -0.1px;
}

.detail-row .value {
  font-size: 0.938rem;
  font-weight: 700;
  color: white;
  letter-spacing: -0.3px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* Vehicle Actions - Modern Buttons */
.vehicle-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.vehicle-actions ion-button {
  margin: 0;
  font-size: 0.938rem;
  font-weight: 700;
  height: 44px;
  letter-spacing: -0.2px;
  --border-radius: 14px;
  --box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: none;
}

.vehicle-actions ion-button:not([color="danger"]) {
  --background: rgba(129, 140, 248, 0.15);
  --background-hover: rgba(129, 140, 248, 0.25);
  --background-activated: rgba(129, 140, 248, 0.3);
  --border-color: rgba(129, 140, 248, 0.4);
  --color: #c7d2fe;
  --border-width: 1px;
  --border-style: solid;
}

.vehicle-actions ion-button[color="danger"] {
  --background: rgba(239, 68, 68, 0.15);
  --background-hover: rgba(239, 68, 68, 0.25);
  --background-activated: rgba(239, 68, 68, 0.3);
  --border-color: rgba(239, 68, 68, 0.4);
  --color: #fca5a5;
  --border-width: 1px;
  --border-style: solid;
}

.vehicle-actions ion-button:hover {
  transform: translateY(-3px);
  --box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.vehicle-actions ion-button ion-icon {
  font-size: 1.125rem;
}

/* Desktop Enhancements */
@media (min-width: 768px) {
  .vehicles-container {
    padding: 32px;
  }

  .filter-pills {
    margin-bottom: 40px;
    gap: 16px;
  }

  .filter-pill {
    padding: 14px 24px;
    font-size: 1rem;
  }

  .filter-pill .pill-icon {
    font-size: 1.375rem;
  }

  .filter-pill .pill-count {
    min-width: 28px;
    height: 28px;
    font-size: 0.875rem;
  }

  .vehicle-card ion-card-content {
    padding: 28px;
  }

  .vehicle-title {
    font-size: 1.625rem;
    margin-bottom: 24px;
  }

  .vehicle-actions {
    gap: 14px;
  }

  .vehicle-actions ion-button {
    height: 48px;
    font-size: 1rem;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Dark Mode Optimization (already dark, but ensures consistency) */
@media (prefers-color-scheme: dark) {
  .vehicle-card {
    background: rgba(31, 41, 55, 0.85);
  }
  
  .vehicle-title {
    color: #f9fafb;
  }
}
</style>
