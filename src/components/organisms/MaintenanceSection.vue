<template>
  <div class="maintenance-section">
    <!-- Header with CTA -->
    <div class="section-header">
      <div class="header-info">
        <h2 class="section-title">Histórico de Manutenções</h2>
        <p class="section-subtitle">{{ completedMaintenance.length }} registro{{ completedMaintenance.length !== 1 ? 's' : '' }}</p>
      </div>
      <AButton @click="router.push(`/tabs/maintenance/new?vehicleId=${vehicleId}`)">
        <template #start>
          <ion-icon :icon="addCircleOutline" />
        </template>
        Nova Manutenção
      </AButton>
    </div>

    <!-- Empty State -->
    <div v-if="completedMaintenance.length === 0" class="empty-state">
      <div class="empty-icon-wrapper">
        <ion-icon :icon="constructOutline" class="empty-icon" />
      </div>
      <h3 class="empty-title">Nenhuma manutenção registrada</h3>
      <p class="empty-text">
        Comece mantendo o histórico completo das manutenções do seu veículo para 
        acompanhar custos e prazos de revisão.
      </p>
      <AButton size="small" @click="router.push(`/tabs/maintenance/new?vehicleId=${vehicleId}`)">
        <template #start>
          <ion-icon :icon="addCircleOutline" />
        </template>
        Registrar Primeira Manutenção
      </AButton>
    </div>

    <!-- Maintenance List -->
    <div v-else class="maintenance-list">
      <div
        v-for="maintenance in completedMaintenance"
        :key="maintenance.id"
        class="maintenance-card"
        @click="router.push(`/tabs/maintenance/${maintenance.id}`)"
      >
        <!-- Card Header -->
        <div class="card-header">
          <div class="header-left">
            <div class="maintenance-icon-wrapper">
              <ion-icon :icon="constructOutline" />
            </div>
            <div class="header-text">
              <h3 class="maintenance-title">
                {{ getMaintenanceTypeLabel(maintenance.type) }}
              </h3>
              <div class="maintenance-meta">
                <span class="meta-item">
                  <ion-icon :icon="calendarOutline" />
                  {{ formatDate(maintenance.date) }}
                </span>
                <span class="meta-separator">•</span>
                <span class="meta-item">
                  <ion-icon :icon="speedometerOutline" />
                  {{ maintenance.mileage.toLocaleString('pt-BR') }} km
                </span>
              </div>
            </div>
          </div>
          <ABadge variant="success" size="small">✓ Concluída</ABadge>
        </div>

        <!-- Card Body -->
        <div class="card-body">
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">
                <ion-icon :icon="cashOutline" />
                Custo
              </div>
              <div class="info-value">
                {{ maintenance.cost ? formatCurrency(maintenance.cost) : 'N/A' }}
              </div>
            </div>

            <div v-if="maintenance.nextDueDate" class="info-item highlight">
              <div class="info-label">
                <ion-icon :icon="timeOutline" />
                Próxima Revisão
              </div>
              <div class="info-value">
                {{ formatDate(maintenance.nextDueDate) }}
              </div>
              <ABadge
                :variant="getDueBadgeVariant(maintenance.nextDueDate)"
                size="small"
                class="due-badge"
              >
                {{ getDaysUntilText(maintenance.nextDueDate) }}
              </ABadge>
            </div>
          </div>

          <div v-if="maintenance.description" class="description">
            <p class="description-text">{{ maintenance.description }}</p>
          </div>
        </div>

        <!-- Card Footer - Next Due Info -->
        <div v-if="maintenance.nextDueMileage" class="card-footer">
          <div class="footer-item">
            <ion-icon :icon="speedometerOutline" />
            <span>Próxima em {{ maintenance.nextDueMileage.toLocaleString('pt-BR') }} km</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { IonIcon } from '@ionic/vue'
import { 
  addCircleOutline,
  calendarOutline,
  cashOutline,
  constructOutline,
  speedometerOutline,
  timeOutline
} from 'ionicons/icons'
import { useVehiclesStore } from '@/stores/vehicles'
import { MAINTENANCE_TYPE_LABELS } from '@/constants/vehicles'
import AButton from '@/components/atoms/AButton.vue'
import ABadge from '@/components/atoms/ABadge.vue'

interface Props {
  vehicleId: string
}
const props = defineProps<Props>()

const router = useRouter()
const vehiclesStore = useVehiclesStore()

const maintenanceHistory = computed(() => {
  return vehiclesStore.maintenanceRecords
    .filter(record => record.vehicleId === props.vehicleId)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
})

const completedMaintenance = computed(() => maintenanceHistory.value)

const getMaintenanceTypeLabel = (type: string) => {
  return MAINTENANCE_TYPE_LABELS[type as import('@/stores/vehicles').MaintenanceType] || type
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const daysUntilNext = (date: Date) => {
  const now = new Date()
  const diff = date.getTime() - now.getTime()
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  return days
}

const getDueBadgeVariant = (date: Date): 'success' | 'warning' | 'error' => {
  const days = daysUntilNext(date)
  if (days < 0) return 'error'
  if (days <= 7) return 'warning'
  return 'success'
}

const getDaysUntilText = (date: Date): string => {
  const days = daysUntilNext(date)
  if (days < 0) {
    const absDays = Math.abs(days)
    return `${absDays} dia${absDays === 1 ? '' : 's'} de atraso`
  }
  if (days === 0) return 'Hoje'
  if (days === 1) return 'Amanhã'
  return `${days} dias restantes`
}
</script>

<style scoped>
/* ====================================
   MAINTENANCE SECTION - MODERN DESIGN
   ==================================== */

.maintenance-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

/* Section Header */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
}

.header-info {
  flex: 1;
  min-width: 200px;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  margin: 0 0 0.25rem 0;
}

.section-subtitle {
  font-size: 0.875rem;
  color: #9ca3af;
  margin: 0;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 3rem 1.5rem;
  background: rgba(31, 41, 55, 0.6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 2px solid rgba(129, 140, 248, 0.2);
  border-radius: 1rem;
  transition: all 0.3s ease;
}

.empty-state:hover {
  border-color: rgba(129, 140, 248, 0.4);
  transform: translateY(-2px);
}

.empty-icon-wrapper {
  width: 5rem;
  height: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(129, 140, 248, 0.15) 0%, rgba(102, 126, 234, 0.08) 100%);
  border: 2px solid rgba(129, 140, 248, 0.25);
  border-radius: 1rem;
  margin-bottom: 1.5rem;
}

.empty-icon {
  font-size: 2.5rem;
  color: rgba(129, 140, 248, 0.8);
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  margin: 0 0 0.75rem 0;
}

.empty-text {
  font-size: 0.938rem;
  color: #9ca3af;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
  max-width: 400px;
}

/* Maintenance List */
.maintenance-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 400px), 1fr));
  gap: 1rem;
}

@media (min-width: 768px) {
  .maintenance-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1400px) {
  .maintenance-list {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Maintenance Card */
.maintenance-card {
  background: rgba(31, 41, 55, 0.6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.maintenance-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.maintenance-card:hover {
  border-color: rgba(129, 140, 248, 0.4);
  transform: translateX(4px) translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
}

.maintenance-card:hover::before {
  opacity: 1;
}

.maintenance-card:active {
  transform: translateX(2px) translateY(-1px);
}

/* Card Header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.header-left {
  display: flex;
  gap: 1rem;
  flex: 1;
  min-width: 0;
}

.maintenance-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  min-width: 3rem;
  background: linear-gradient(135deg, rgba(129, 140, 248, 0.15) 0%, rgba(102, 126, 234, 0.08) 100%);
  border: 1px solid rgba(129, 140, 248, 0.25);
  border-radius: 0.75rem;
  transition: all 0.3s ease;
}

.maintenance-card:hover .maintenance-icon-wrapper {
  background: linear-gradient(135deg, rgba(129, 140, 248, 0.25) 0%, rgba(102, 126, 234, 0.15) 100%);
  border-color: rgba(129, 140, 248, 0.4);
  transform: scale(1.05) rotate(5deg);
}

.maintenance-icon-wrapper ion-icon {
  font-size: 1.5rem;
  color: rgba(129, 140, 248, 0.9);
}

.header-text {
  flex: 1;
  min-width: 0;
}

.maintenance-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: white;
  margin: 0 0 0.5rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.maintenance-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.813rem;
  color: #9ca3af;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.meta-item ion-icon {
  font-size: 1rem;
  color: rgba(129, 140, 248, 0.6);
}

.meta-separator {
  color: #4b5563;
}

/* Card Body */
.card-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(17, 24, 39, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 0.75rem;
  transition: all 0.3s ease;
}

.info-item.highlight {
  background: linear-gradient(135deg, rgba(129, 140, 248, 0.08) 0%, rgba(102, 126, 234, 0.04) 100%);
  border-color: rgba(129, 140, 248, 0.15);
}

.maintenance-card:hover .info-item {
  background: rgba(31, 41, 55, 0.5);
}

.maintenance-card:hover .info-item.highlight {
  background: linear-gradient(135deg, rgba(129, 140, 248, 0.12) 0%, rgba(102, 126, 234, 0.06) 100%);
  border-color: rgba(129, 140, 248, 0.25);
}

.info-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-label ion-icon {
  font-size: 1rem;
  color: rgba(129, 140, 248, 0.6);
}

.info-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: white;
}

.due-badge {
  margin-top: 0.5rem;
  align-self: flex-start;
}

.description {
  padding: 1rem;
  background: rgba(17, 24, 39, 0.4);
  border-left: 3px solid rgba(129, 140, 248, 0.25);
  border-radius: 0.5rem;
}

.description-text {
  font-size: 0.875rem;
  color: #d1d5db;
  line-height: 1.6;
  margin: 0;
}

/* Card Footer */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding-top: 1rem;
  margin-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.footer-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #9ca3af;
}

.footer-item ion-icon {
  font-size: 1.125rem;
  color: rgba(129, 140, 248, 0.6);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .section-header {
    flex-direction: column;
    align-items: stretch;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .maintenance-card {
    padding: 1rem;
  }

  .header-left {
    flex-direction: column;
    gap: 0.75rem;
  }

  .maintenance-icon-wrapper {
    width: 2.5rem;
    height: 2.5rem;
    min-width: 2.5rem;
  }

  .maintenance-icon-wrapper ion-icon {
    font-size: 1.25rem;
  }
}

/* Animation for card entrance */
.maintenance-list .maintenance-card {
  animation: slideInUp 0.4s ease-out backwards;
}

.maintenance-list .maintenance-card:nth-child(1) { animation-delay: 0.05s; }
.maintenance-list .maintenance-card:nth-child(2) { animation-delay: 0.1s; }
.maintenance-list .maintenance-card:nth-child(3) { animation-delay: 0.15s; }
.maintenance-list .maintenance-card:nth-child(4) { animation-delay: 0.2s; }
.maintenance-list .maintenance-card:nth-child(5) { animation-delay: 0.25s; }

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
