<template>
  <ion-page>
    <ModernHeader 
      title="Manutenções"
      :show-back-button="true"
      back-path="/tabs/home"
    />

    <ion-content :fullscreen="true">
      <!-- Loading State -->
      <div v-if="vehiclesStore.loading" class="loading-container">
        <ion-spinner name="crescent"></ion-spinner>
        <p>Carregando manutenções...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="vehiclesStore.maintenanceRecords.length === 0" class="empty-state-container">
        <div class="empty-state">
          <svg class="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3>Nenhuma manutenção registrada</h3>
          <p>
            Comece registrando a primeira manutenção do seu veículo e mantenha um histórico completo
          </p>
          <ion-button @click="$router.push('/tabs/maintenance/new')" color="primary">
            <ion-icon slot="start" :icon="add"></ion-icon>
            Registrar primeira manutenção
          </ion-button>
        </div>
      </div>

      <!-- Maintenance List -->
      <div v-else class="maintenance-container">
        <!-- Stats Summary -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon primary">
              <ion-icon :icon="construct"></ion-icon>
            </div>
            <div class="stat-info">
              <span class="stat-label">Total</span>
              <span class="stat-value">{{ vehiclesStore.totalMaintenanceRecords }}</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon success">
              <ion-icon :icon="cash"></ion-icon>
            </div>
            <div class="stat-info">
              <span class="stat-label">Investido</span>
              <span class="stat-value">{{ formatCurrency(vehiclesStore.totalMaintenanceCost) }}</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon warning">
              <ion-icon :icon="calendar"></ion-icon>
            </div>
            <div class="stat-info">
              <span class="stat-label">Próximas</span>
              <span class="stat-value">{{ vehiclesStore.upcomingMaintenance.length }}</span>
            </div>
          </div>

          <div v-if="vehiclesStore.overdueMaintenance.length > 0" class="stat-card">
            <div class="stat-icon danger">
              <ion-icon :icon="alertCircle"></ion-icon>
            </div>
            <div class="stat-info">
              <span class="stat-label">Atrasadas</span>
              <span class="stat-value">{{ vehiclesStore.overdueMaintenance.length }}</span>
            </div>
          </div>
        </div>

        <!-- Filter Segment -->
        <ion-segment v-model="selectedFilter" class="filter-segment">
          <ion-segment-button value="all">
            <ion-label>Todas</ion-label>
          </ion-segment-button>
          <ion-segment-button value="upcoming">
            <ion-label>Próximas</ion-label>
          </ion-segment-button>
          <ion-segment-button value="overdue" v-if="vehiclesStore.overdueMaintenance.length > 0">
            <ion-label>Atrasadas</ion-label>
          </ion-segment-button>
        </ion-segment>

        <!-- Maintenance Cards -->
        <div class="maintenance-list">
          <ion-card
            v-for="record in filteredMaintenanceRecords"
            :key="record.id"
            class="maintenance-card"
            button
            @click="viewDetails(record)"
          >
            <ion-card-content>
              <!-- Header -->
              <div class="card-header">
                <div class="card-title-section">
                  <span class="maintenance-icon">{{ getMaintenanceIcon(record.type) }}</span>
                  <div>
                    <h3 class="maintenance-title">{{ getMaintenanceTypeLabel(record.type) }}</h3>
                    <p class="maintenance-vehicle">
                      <ion-icon :icon="car" size="small"></ion-icon>
                      {{ getVehicleName(record.vehicleId) }}
                    </p>
                  </div>
                </div>
                <ion-chip :color="getStatusColor(record)" class="status-chip">
                  {{ getStatusLabel(record) }}
                </ion-chip>
              </div>

              <!-- Details -->
              <div class="card-details">
                <div class="detail-item">
                  <ion-icon :icon="calendar" size="small"></ion-icon>
                  <span>{{ formatDate(record.date) }}</span>
                </div>
                <div class="detail-item">
                  <ion-icon :icon="speedometer" size="small"></ion-icon>
                  <span>{{ formatMileage(record.mileage) }} km</span>
                </div>
                <div class="detail-item">
                  <ion-icon :icon="cash" size="small"></ion-icon>
                  <span>{{ formatCurrency(record.cost) }}</span>
                </div>
              </div>

              <!-- Description -->
              <p v-if="record.description" class="maintenance-description">
                {{ record.description }}
              </p>

              <!-- Actions -->
              <div class="card-actions">
                <ion-button size="small" fill="clear" @click.stop="viewDetails(record)">
                  <ion-icon slot="start" :icon="eye" size="small"></ion-icon>
                  Ver Detalhes
                </ion-button>
                <ion-button size="small" fill="clear" color="danger" @click.stop="confirmDelete(record)">
                  <ion-icon :icon="trash" size="small"></ion-icon>
                </ion-button>
              </div>
            </ion-card-content>
          </ion-card>
        </div>

        <!-- Empty Filter State -->
        <div v-if="filteredMaintenanceRecords.length === 0" class="empty-filter-state">
          <ion-icon :icon="searchOutline" size="large" color="medium"></ion-icon>
          <p>Nenhuma manutenção encontrada para este filtro</p>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonChip,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonSpinner,
  alertController
} from '@ionic/vue'
import {
  add,
  construct,
  calendar,
  cash,
  alertCircle,
  car,
  speedometer,
  eye,
  trash,
  searchOutline
} from 'ionicons/icons'
import { useVehiclesStore } from '../stores/vehicles'
import { MAINTENANCE_TYPE_LABELS, MAINTENANCE_TYPE_ICONS } from '@/constants/vehicles'
import type { MaintenanceRecord } from '../stores/vehicles'
import ModernHeader from '@/components/organisms/ModernHeader.vue'

const router = useRouter()
const vehiclesStore = useVehiclesStore()
const selectedFilter = ref<'all' | 'upcoming' | 'overdue'>('all')

const filteredMaintenanceRecords = computed(() => {
  const records = vehiclesStore.maintenanceRecords
  
  switch (selectedFilter.value) {
    case 'upcoming':
      return vehiclesStore.upcomingMaintenance
    case 'overdue':
      return vehiclesStore.overdueMaintenance
    default:
      return records
  }
})

const getMaintenanceIcon = (type: string): string => {
  return MAINTENANCE_TYPE_ICONS[type as keyof typeof MAINTENANCE_TYPE_ICONS] || '🔧'
}

const getMaintenanceTypeLabel = (type: string): string => {
  return MAINTENANCE_TYPE_LABELS[type as keyof typeof MAINTENANCE_TYPE_LABELS] || type
}

const getVehicleName = (vehicleId: string): string => {
  const vehicle = vehiclesStore.vehicles.find(v => v.id === vehicleId)
  return vehicle ? `${vehicle.make} ${vehicle.model}` : 'Veículo não encontrado'
}

const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

const formatMileage = (mileage: number): string => {
  return mileage.toLocaleString('pt-BR')
}

const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const getStatusLabel = (record: MaintenanceRecord): string => {
  if (!record.nextDueDate && !record.nextDueMileage) {
    return 'Concluída'
  }
  
  if (record.nextDueDate) {
    const nextDate = new Date(record.nextDueDate)
    const today = new Date()
    if (nextDate < today) {
      return 'Atrasada'
    }
    return 'Agendada'
  }
  
  return 'Concluída'
}

const getStatusColor = (record: MaintenanceRecord): string => {
  const status = getStatusLabel(record)
  switch (status) {
    case 'Atrasada':
      return 'danger'
    case 'Agendada':
      return 'warning'
    default:
      return 'success'
  }
}

const viewDetails = (record: MaintenanceRecord) => {
  router.push(`/tabs/maintenance/${record.id}`)
}

const confirmDelete = async (record: MaintenanceRecord) => {
  const alert = await alertController.create({
    header: 'Confirmar Exclusão',
    message: `Deseja realmente excluir este registro de manutenção?`,
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Excluir',
        role: 'destructive',
        handler: () => {
          handleDelete(record.id)
        }
      }
    ]
  })
  await alert.present()
}

const handleDelete = async (recordId: string) => {
  try {
    await vehiclesStore.deleteMaintenanceRecord(recordId)
  } catch (error) {
    console.error('Error deleting maintenance record:', error)
  }
}

onMounted(async () => {
  if (vehiclesStore.vehicles.length === 0) {
    await vehiclesStore.fetchVehicles()
  }
})
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;
  color: var(--ion-color-medium);
}

/* Empty State */
.empty-state-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 32px;
}

.empty-state {
  text-align: center;
  max-width: 400px;
}

.empty-icon {
  width: 120px;
  height: 120px;
  margin: 0 auto 24px;
  color: var(--ion-color-medium);
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--ion-color-step-850, #1f1f1f);
  margin-bottom: 12px;
}

.empty-state p {
  font-size: 1rem;
  color: var(--ion-color-medium);
  margin-bottom: 24px;
  line-height: 1.5;
}

/* Container */
.maintenance-container {
  padding: 16px;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.stat-card {
  background: var(--ion-color-step-50, #f9f9f9);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.375rem;
}

.stat-icon.primary {
  background: rgba(102, 126, 234, 0.15);
  color: var(--ion-color-primary);
}

.stat-icon.success {
  background: rgba(16, 185, 129, 0.15);
  color: var(--ion-color-success);
}

.stat-icon.warning {
  background: rgba(245, 158, 11, 0.15);
  color: var(--ion-color-warning);
}

.stat-icon.danger {
  background: rgba(239, 68, 68, 0.15);
  color: var(--ion-color-danger);
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--ion-color-medium);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--ion-color-step-850, #1f1f1f);
}

/* Filter Segment */
.filter-segment {
  margin-bottom: 16px;
}

/* Maintenance List */
.maintenance-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.maintenance-card {
  margin: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.maintenance-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.card-title-section {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  flex: 1;
}

.maintenance-icon {
  font-size: 2rem;
  line-height: 1;
}

.maintenance-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--ion-color-step-850, #1f1f1f);
  margin: 0 0 4px 0;
}

.maintenance-vehicle {
  font-size: 0.875rem;
  color: var(--ion-color-medium);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-chip {
  height: 28px;
  font-size: 0.75rem;
  font-weight: 600;
}

.card-details {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 12px;
  padding: 12px;
  background: var(--ion-color-step-50, #f9f9f9);
  border-radius: 8px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  color: var(--ion-color-step-700, #4a4a4a);
}

.detail-item ion-icon {
  color: var(--ion-color-medium);
}

.maintenance-description {
  font-size: 0.875rem;
  color: var(--ion-color-step-650, #666);
  line-height: 1.5;
  margin: 0 0 12px 0;
  padding: 12px;
  background: var(--ion-color-step-50, #f9f9f9);
  border-radius: 8px;
  border-left: 3px solid var(--ion-color-primary);
}

.card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid var(--ion-color-step-150, #e5e5e5);
}

/* Empty Filter State */
.empty-filter-state {
  text-align: center;
  padding: 48px 24px;
  color: var(--ion-color-medium);
}

.empty-filter-state p {
  margin-top: 12px;
  font-size: 0.938rem;
}

/* Responsive */
@media (min-width: 768px) {
  .maintenance-container {
    max-width: 800px;
    margin: 0 auto;
  }

  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>

