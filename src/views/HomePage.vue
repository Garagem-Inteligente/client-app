<template>
  <ion-page>
    <ModernHeader title="Dashboard" />

    <ion-content :fullscreen="true" class="app-content">
      <!-- Background layers -->
      <div class="background-gradient"></div>
      <div class="background-pattern"></div>
      
      <div class="page-content-wrapper dashboard-container">
        <!-- Compact Header -->
        <div class="compact-header">
          <h1 class="welcome-text">Bem-vindo, {{ authStore.userName }}</h1>
        </div>

        <!-- Quick Actions Section -->
        <div class="quick-actions-section">
          <h2 class="section-title">
            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Ações Rápidas
          </h2>
          <div class="quick-actions-grid">
                    <!-- Registrar Manutenção -->
                    <button
                      @click="handleNavigation('/tabs/maintenance/new')"
                      class="quick-action-btn"
                    >
              <div class="action-icon blue">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div class="action-text">
                <p class="action-title">Registrar</p>
                <p class="action-subtitle">Manutenção</p>
              </div>
            </button>

            <!-- Adicionar Veículo -->
            <button
              @click="handleNavigation('/tabs/vehicle/new')"
              class="quick-action-btn"
            >
              <div class="action-icon green">
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 11l-2 0 0-1c0-.5.2-1.1.5-1.5l1.8-2.2c.4-.4 1-.7 1.7-.7l13 0c.7 0 1.3.3 1.7.7l1.8 2.2c.3.4.5 1 .5 1.5l0 1-2 0 0-1c0-.3-.1-.5-.3-.7l-1.8-2.2c-.2-.2-.4-.3-.7-.3l-13 0c-.3 0-.5.1-.7.3l-1.8 2.2c-.2.2-.3.4-.3.7l0 1zm-.5 1c-.3 0-.5.2-.5.5l0 2.5 0 2.5c0 .3.2.5.5.5l.5 0 0 1.5c0 .3.2.5.5.5l2 0c.3 0 .5-.2.5-.5l0-1.5 10 0 0 1.5c0 .3.2.5.5.5l2 0c.3 0 .5-.2.5-.5l0-1.5.5 0c.3 0 .5-.2.5-.5l0-2.5 0-2.5c0-.3-.2-.5-.5-.5zm2 1.5c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm11 0c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z"/>
                </svg>
              </div>
              <div class="action-text">
                <p class="action-title">Adicionar</p>
                <p class="action-subtitle">Veículo</p>
              </div>
            </button>

            <!-- Ver Histórico -->
            <button
              @click="handleNavigation('/tabs/maintenance')"
              class="quick-action-btn"
            >
              <div class="action-icon purple">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="action-text">
                <p class="action-title">Ver</p>
                <p class="action-subtitle">Histórico</p>
              </div>
            </button>

            <!-- Meus Veículos -->
            <button
              @click="handleNavigation('/tabs/vehicles')"
              class="quick-action-btn"
            >
              <div class="action-icon orange">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div class="action-text">
                <p class="action-title">Meus</p>
                <p class="action-subtitle">Veículos</p>
              </div>
            </button>
          </div>
        </div>

        <!-- Alert Manutenções Atrasadas -->
        <div v-if="overdueCount > 0" class="alert-danger">
          <div class="alert-content">
            <div class="alert-left">
              <svg class="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span class="alert-text">Você tem {{ overdueCount }} manutenção(ões) atrasada(s)!</span>
            </div>
            <button class="alert-btn" @click="$router.push('/tabs/vehicles')">
              Ver detalhes
            </button>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="stats-grid">
          <!-- Veículos Card -->
          <div class="stat-card blue" @click="$router.push('/tabs/vehicles')">
            <div class="stat-content">
              <div class="stat-info">
                <p class="stat-label">Total de Veículos</p>
                <div class="stat-value">{{ vehiclesStore.vehicleCount }}</div>
              </div>
              <div class="stat-icon blue">
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 11l-2 0 0-1c0-.5.2-1.1.5-1.5l1.8-2.2c.4-.4 1-.7 1.7-.7l13 0c.7 0 1.3.3 1.7.7l1.8 2.2c.3.4.5 1 .5 1.5l0 1-2 0 0-1c0-.3-.1-.5-.3-.7l-1.8-2.2c-.2-.2-.4-.3-.7-.3l-13 0c-.3 0-.5.1-.7.3l-1.8 2.2c-.2.2-.3.4-.3.7l0 1zm-.5 1c-.3 0-.5.2-.5.5l0 2.5 0 2.5c0 .3.2.5.5.5l.5 0 0 1.5c0 .3.2.5.5.5l2 0c.3 0 .5-.2.5-.5l0-1.5 10 0 0 1.5c0 .3.2.5.5.5l2 0c.3 0 .5-.2.5-.5l0-1.5.5 0c.3 0 .5-.2.5-.5l0-2.5 0-2.5c0-.3-.2-.5-.5-.5zm2 1.5c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm11 0c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z"/>
                </svg>
              </div>
            </div>
            <p class="stat-description">Veículos na sua garagem</p>
          </div>

          <!-- Manutenções Card -->
          <div class="stat-card green" @click="handleNavigation('/tabs/maintenance')">
            <div class="stat-content">
              <div class="stat-info">
                <p class="stat-label">Manutenções</p>
                <div class="stat-value">{{ vehiclesStore.totalMaintenanceRecords }}</div>
              </div>
              <div class="stat-icon green">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            <p class="stat-description">Registros no histórico</p>
          </div>

          <!-- Custo Total Card -->
          <div class="stat-card purple" @click="$router.push('/tabs/vehicles')">
            <div class="stat-content">
              <div class="stat-info">
                <p class="stat-label">Custo Total</p>
                <div class="stat-value currency">{{ formatCurrency(totalCost) }}</div>
              </div>
              <div class="stat-icon purple">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p class="stat-description">Investido em manutenções</p>
          </div>

          <!-- Agendadas Card -->
          <div class="stat-card yellow" @click="$router.push('/tabs/vehicles')">
            <div class="stat-content">
              <div class="stat-info">
                <p class="stat-label">Agendadas</p>
                <div class="stat-value">{{ vehiclesStore.upcomingMaintenance.length }}</div>
              </div>
              <div class="stat-icon yellow">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div class="stat-footer">
              <p class="stat-description">Próximas manutenções</p>
              <span v-if="overdueCount > 0" class="badge-error">{{ overdueCount }} atrasadas</span>
            </div>
          </div>
        </div>

        <!-- Meus Veículos -->
        <div class="card">
          <h3 class="card-title">Meus Veículos</h3>
          
          <!-- Empty State -->
          <div v-if="vehiclesStore.vehicles.length === 0" class="empty-state">
            <svg class="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <p class="empty-text">Nenhum veículo cadastrado</p>
            <button class="btn-primary" @click="$router.push('/tabs/vehicle/new')">
              Adicionar primeiro veículo
            </button>
          </div>

          <!-- Lista de Veículos -->
          <div v-else class="vehicles-list">
            <div
              v-for="vehicle in vehiclesStore.vehicles.slice(0, 3)"
              :key="vehicle.id"
              @click="$router.push(`/tabs/vehicle/${vehicle.id}`)"
              class="vehicle-item"
            >
              <div class="vehicle-icon-wrapper">
                <svg class="vehicle-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 11l-2 0 0-1c0-.5.2-1.1.5-1.5l1.8-2.2c.4-.4 1-.7 1.7-.7l13 0c.7 0 1.3.3 1.7.7l1.8 2.2c.3.4.5 1 .5 1.5l0 1-2 0 0-1c0-.3-.1-.5-.3-.7l-1.8-2.2c-.2-.2-.4-.3-.7-.3l-13 0c-.3 0-.5.1-.7.3l-1.8 2.2c-.2.2-.3.4-.3.7l0 1zm-.5 1c-.3 0-.5.2-.5.5l0 2.5 0 2.5c0 .3.2.5.5.5l.5 0 0 1.5c0 .3.2.5.5.5l2 0c.3 0 .5-.2.5-.5l0-1.5 10 0 0 1.5c0 .3.2.5.5.5l2 0c.3 0 .5-.2.5-.5l0-1.5.5 0c.3 0 .5-.2.5-.5l0-2.5 0-2.5c0-.3-.2-.5-.5-.5zm2 1.5c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm11 0c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z"/>
                </svg>
              </div>
              <div class="vehicle-info">
                <h3 class="vehicle-name">{{ vehicle.make }} {{ vehicle.model }}</h3>
                <p class="vehicle-details">{{ vehicle.year }} • {{ vehicle.plate }}</p>
              </div>
              <div class="vehicle-meta">
                <p class="vehicle-mileage">{{ vehicle.mileage.toLocaleString('pt-BR') }} km</p>
                <span :class="['badge', getFuelBadgeClass(vehicle.fuelType)]">
                  {{ getFuelLabel(vehicle.fuelType) }}
                </span>
              </div>
              <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>

            <button
              v-if="vehiclesStore.vehicles.length > 3"
              class="btn-outline full-width"
              @click="$router.push('/tabs/vehicles')"
            >
              Ver todos os veículos
            </button>
          </div>
        </div>

        <!-- Manutenções Atrasadas -->
        <div v-if="overdueCount > 0" class="card card-danger">
          <h3 class="card-title">⚠️ Manutenções Atrasadas</h3>
          <div class="maintenance-list">
            <div
              v-for="maintenance in vehiclesStore.overdueMaintenance.slice(0, 3)"
              :key="maintenance.id"
              class="maintenance-item danger"
            >
              <div class="maintenance-info">
                <div class="maintenance-header">
                  <span class="badge-error">ATRASADA</span>
                  <h3 class="maintenance-name">{{ getMaintenanceTypeLabel(maintenance.type) }}</h3>
                </div>
                <p class="maintenance-vehicle">{{ getVehicleName(maintenance.vehicleId) }}</p>
              </div>
              <div class="maintenance-date">
                <p class="date-text danger">{{ formatDate(maintenance.nextDueDate!) }}</p>
                <p class="days-text">{{ Math.abs(daysUntilNext(maintenance.nextDueDate!)) }} dias atrás</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Grid de Últimas e Próximas Manutenções -->
        <div class="maintenance-grid">
          <!-- Últimas Manutenções -->
          <div class="card">
            <h3 class="card-title">🔧 Últimas Manutenções</h3>
            
            <!-- Empty State -->
            <div v-if="vehiclesStore.recentMaintenance.length === 0" class="empty-state">
              <svg class="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p class="empty-text">Nenhuma manutenção registrada</p>
              <button class="btn-primary" @click="$router.push('/tabs/vehicles')">
                Registrar manutenção
              </button>
            </div>

            <!-- Lista -->
            <div v-else class="maintenance-list">
              <div
                v-for="maintenance in vehiclesStore.recentMaintenance"
                :key="maintenance.id"
                @click="handleNavigation(`/tabs/maintenance/${maintenance.id}`)"
                class="maintenance-item"
              >
                <div class="maintenance-info">
                  <div class="maintenance-header">
                    <span class="badge-success">{{ getMaintenanceTypeLabel(maintenance.type) }}</span>
                  </div>
                  <p class="maintenance-vehicle">{{ getVehicleName(maintenance.vehicleId) }}</p>
                  <p v-if="maintenance.description" class="maintenance-description">{{ maintenance.description }}</p>
                </div>
                <div class="maintenance-meta">
                  <p class="date-text">{{ formatDate(maintenance.date) }}</p>
                  <p class="cost-text">{{ formatCurrency(maintenance.cost) }}</p>
                  <p v-if="maintenance.mileage" class="mileage-text">
                    {{ maintenance.mileage.toLocaleString('pt-BR') }} km
                  </p>
                </div>
              </div>

              <button class="btn-outline full-width" @click="handleNavigation('/tabs/maintenance')">
                Ver histórico completo
              </button>
            </div>
          </div>

          <!-- Próximas Manutenções -->
          <div class="card">
            <h3 class="card-title">📅 Próximas Manutenções</h3>
            
            <!-- Empty State -->
            <div v-if="vehiclesStore.upcomingMaintenance.length === 0" class="empty-state">
              <svg class="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="empty-text">Nenhuma manutenção agendada</p>
              <button class="btn-primary" @click="$router.push('/tabs/vehicles')">
                Agendar manutenção
              </button>
            </div>

            <!-- Lista -->
            <div v-else class="maintenance-list">
              <div
                v-for="maintenance in vehiclesStore.upcomingMaintenance.slice(0, 5)"
                :key="maintenance.id"
                :class="['maintenance-item', getMaintenanceItemClass(maintenance.nextDueDate!)]"
              >
                <div class="maintenance-info">
                  <div class="maintenance-header">
                    <span :class="['badge', getMaintenanceBadgeClass(maintenance.nextDueDate!)]">
                      {{ daysUntilNext(maintenance.nextDueDate!) }} dias
                    </span>
                    <h3 class="maintenance-name">{{ getMaintenanceTypeLabel(maintenance.type) }}</h3>
                  </div>
                  <p class="maintenance-vehicle">{{ getVehicleName(maintenance.vehicleId) }}</p>
                </div>
                <div class="maintenance-meta">
                  <p class="date-text">{{ formatDate(maintenance.nextDueDate!) }}</p>
                  <p v-if="maintenance.nextDueMileage" class="mileage-text">
                    {{ maintenance.nextDueMileage.toLocaleString('pt-BR') }} km
                  </p>
                </div>
              </div>

              <button class="btn-outline full-width" @click="handleNavigation('/tabs/maintenance')">
                Ver todas as manutenções
              </button>
            </div>
          </div>
        </div>

        <!-- Spacer final -->
        <div style="height: 80px;"></div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  IonPage,
  IonContent
} from '@ionic/vue'
import { useAuthStore } from '@/stores/auth'
import { useVehiclesStore } from '@/stores/vehicles'
import { FUEL_TYPE_LABELS, MAINTENANCE_TYPE_LABELS } from '@/constants/vehicles'
import ModernHeader from '@/components/organisms/ModernHeader.vue'

const router = useRouter()
const authStore = useAuthStore()
const vehiclesStore = useVehiclesStore()

onMounted(async () => {
  if (authStore.isAuthenticated) {
    await vehiclesStore.fetchVehicles()
    await vehiclesStore.fetchMaintenanceRecords()
  }
})

// Navigation handler to prevent focus issues
const handleNavigation = (path: string) => {
  // Remove focus from current element before navigation
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur()
  }
  // Small delay to allow blur to complete
  setTimeout(() => {
    router.push(path)
  }, 10)
}

// Computed properties
const totalCost = computed(() => vehiclesStore.totalMaintenanceCost)
const overdueCount = computed(() => vehiclesStore.overdueMaintenance.length)

// Helper functions
const daysUntilNext = (date: Date) => {
  const now = new Date()
  const diff = date.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

const getMaintenanceStatus = (date: Date) => {
  const days = daysUntilNext(date)
  if (days < 0) return 'overdue'
  if (days <= 7) return 'urgent'
  if (days <= 30) return 'soon'
  return 'normal'
}

const getMaintenanceBadgeClass = (date: Date) => {
  const status = getMaintenanceStatus(date)
  if (status === 'urgent') return 'badge-error'
  if (status === 'soon') return 'badge-warning'
  return 'badge-default'
}

const getMaintenanceItemClass = (date: Date) => {
  const status = getMaintenanceStatus(date)
  if (status === 'urgent') return 'urgent'
  if (status === 'soon') return 'soon'
  return ''
}

const getMaintenanceTypeLabel = (type: string) => {
  return MAINTENANCE_TYPE_LABELS[type as keyof typeof MAINTENANCE_TYPE_LABELS] || type
}

const getVehicleName = (vehicleId: string) => {
  const vehicle = vehiclesStore.getVehicleById(vehicleId)
  return vehicle ? `${vehicle.make} ${vehicle.model}` : 'Veículo desconhecido'
}

const getFuelLabel = (fuelType: string) => {
  const label = FUEL_TYPE_LABELS[fuelType as keyof typeof FUEL_TYPE_LABELS]
  if (fuelType === 'gasoline') return 'Gasolina'
  if (fuelType === 'diesel') return 'Diesel'
  if (fuelType === 'electric') return 'Elétrico'
  if (fuelType === 'flex') return 'Flex'
  return label || fuelType
}

const getFuelBadgeClass = (fuelType: string) => {
  if (fuelType === 'electric') return 'badge-success'
  return 'badge-default'
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
</script>

<style scoped>
/* ====================================
   MODERN DASHBOARD - 2025 DESIGN
   ==================================== */

/* Container com padding */
.dashboard-container {
  padding: 1rem 1rem 2rem;
}

/* ====================================
   COMPACT HEADER
   ==================================== */

.compact-header {
  text-align: center;
  margin-bottom: 1.5rem;
  animation: fadeInDown 0.6s ease-out;
}

.welcome-text {
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.01em;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ====================================
   SECTION TITLE
   ==================================== */

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin: 0 0 0.875rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.section-title .icon {
  width: 1.125rem;
  height: 1.125rem;
  color: rgba(255, 255, 255, 0.9);
}

/* ====================================
   QUICK ACTIONS - GLASSMORPHISM
   ==================================== */

.quick-actions-section {
  margin-bottom: 1.5rem;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

@media (min-width: 768px) {
  .quick-actions-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.quick-action-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(31, 41, 55, 0.75);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 0.875rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  animation: fadeInUp 0.6s ease-out backwards;
}

.quick-action-btn:nth-child(1) { animation-delay: 0.1s; }
.quick-action-btn:nth-child(2) { animation-delay: 0.15s; }
.quick-action-btn:nth-child(3) { animation-delay: 0.2s; }
.quick-action-btn:nth-child(4) { animation-delay: 0.25s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.quick-action-btn:hover {
  background: rgba(31, 41, 55, 0.9);
  transform: translateY(-2px);
  box-shadow: 
    0 8px 20px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

/* ====================================
   ACTION ICONS
   ==================================== */

.action-icon {
  padding: 0.625rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.action-icon svg {
  width: 1.125rem;
  height: 1.125rem;
}

.action-icon.blue {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(96, 165, 250, 0.1));
  color: #93c5fd;
}

.action-icon.green {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(74, 222, 128, 0.1));
  color: #86efac;
}

.action-icon.purple {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(167, 139, 250, 0.1));
  color: #c4b5fd;
}

.action-icon.orange {
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(251, 146, 60, 0.1));
  color: #fdba74;
}

.quick-action-btn:hover .action-icon {
  transform: scale(1.05);
}

/* ====================================
   ACTION TEXT
   ==================================== */

.action-text {
  flex: 1;
  text-align: left;
}

.action-title {
  font-size: 0.8125rem;
  font-weight: 600;
  color: white;
  margin: 0 0 0.125rem 0;
  letter-spacing: 0.01em;
}

.quick-action-btn:hover .action-title {
  color: #60a5fa;
}

.action-subtitle {
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.65);
  margin: 0;
  letter-spacing: 0.01em;
}

/* ====================================
   ALERT DANGER - GLASSMORPHISM
   ==================================== */

.alert-danger {
  background: rgba(31, 41, 55, 0.75);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(239, 68, 68, 0.4);
  border-radius: 16px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  animation: fadeInUp 0.6s ease-out 0.3s backwards;
}

.alert-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.alert-left {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  flex: 1;
  min-width: 0;
}

.alert-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #fca5a5;
  flex-shrink: 0;
}

.alert-text {
  font-weight: 500;
  color: white;
  font-size: 0.8125rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.alert-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  color: white;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.alert-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

/* ====================================
   STATS GRID - GLASSMORPHISM CARDS
   ==================================== */

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

@media (min-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.stat-card {
  background: rgba(31, 41, 55, 0.75);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  animation: fadeInUp 0.6s ease-out backwards;
}

.stat-card:nth-child(1) { animation-delay: 0.35s; }
.stat-card:nth-child(2) { animation-delay: 0.4s; }
.stat-card:nth-child(3) { animation-delay: 0.45s; }
.stat-card:nth-child(4) { animation-delay: 0.5s; }

.stat-card:hover {
  background: rgba(31, 41, 55, 0.9);
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
}

.stat-card.blue {
  border-color: rgba(147, 197, 253, 0.3);
}

.stat-card.green {
  border-color: rgba(134, 239, 172, 0.3);
}

.stat-card.purple {
  border-color: rgba(196, 181, 253, 0.3);
}

.stat-card.yellow {
  border-color: rgba(253, 224, 71, 0.3);
}

.stat-content {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0.625rem;
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 0.375rem 0;
  font-weight: 500;
  letter-spacing: 0.01em;
}

.stat-value {
  font-size: 1.625rem;
  font-weight: 700;
  color: white;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-value.currency {
  font-size: 1.125rem;
}

.stat-icon {
  padding: 0.5rem;
  border-radius: 10px;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.stat-card:hover .stat-icon {
  transform: scale(1.1);
}

.stat-icon svg {
  width: 1.25rem;
  height: 1.25rem;
}

.stat-icon.blue {
  background: linear-gradient(135deg, rgba(147, 197, 253, 0.25), rgba(96, 165, 250, 0.15));
  color: #93c5fd;
}

.stat-icon.green {
  background: linear-gradient(135deg, rgba(134, 239, 172, 0.25), rgba(74, 222, 128, 0.15));
  color: #86efac;
}

.stat-icon.purple {
  background: linear-gradient(135deg, rgba(196, 181, 253, 0.25), rgba(167, 139, 250, 0.15));
  color: #c4b5fd;
}

.stat-icon.yellow {
  background: linear-gradient(135deg, rgba(253, 224, 71, 0.25), rgba(250, 204, 21, 0.15));
  color: #fde047;
}

.stat-description {
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  letter-spacing: 0.01em;
}

.stat-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

/* Badges */
.badge-error {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.625rem;
  font-weight: 600;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.badge-success {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.625rem;
  font-weight: 600;
  background: rgba(34, 197, 94, 0.1);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.badge-warning {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.625rem;
  font-weight: 600;
  background: rgba(234, 179, 8, 0.1);
  color: #facc15;
  border: 1px solid rgba(234, 179, 8, 0.3);
}

.badge-default {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.625rem;
  font-weight: 600;
  background: rgba(107, 114, 128, 0.1);
  color: #9ca3af;
  border: 1px solid rgba(107, 114, 128, 0.3);
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.625rem;
  font-weight: 600;
}

/* ====================================
   GLASS CARD
   ==================================== */

.card {
  background: rgba(31, 41, 55, 0.75);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  animation: fadeInUp 0.6s ease-out 0.55s backwards;
}

.card:hover {
  background: rgba(31, 41, 55, 0.9);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
}

.card-danger {
  border: 1.5px solid rgba(239, 68, 68, 0.4);
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin: 0 0 1rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.01em;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 2rem 0;
}

.empty-icon {
  width: 3rem;
  height: 3rem;
  color: #6b7280;
  margin: 0 auto 1rem;
}

.empty-text {
  color: #9ca3af;
  margin: 0 0 1rem 0;
}

/* ====================================
   MODERN BUTTONS
   ==================================== */

.btn-primary {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-primary:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.15));
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn-outline {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 0.625rem 1.25rem;
  color: white;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-outline:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.btn-outline.full-width {
  width: 100%;
  margin-top: 0.75rem;
}

/* Vehicles List */
.vehicles-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.vehicle-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(31, 41, 55, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.vehicle-item:hover {
  background: rgba(55, 65, 81, 0.7);
  border-color: rgba(59, 130, 246, 0.5);
  transform: translateY(-2px);
}

.vehicle-icon-wrapper {
  padding: 0.75rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.vehicle-item:hover .vehicle-icon-wrapper {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.5);
}

.vehicle-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #60a5fa;
}

.vehicle-info {
  flex: 1;
  min-width: 0;
}

.vehicle-name {
  font-weight: 500;
  color: white;
  margin: 0 0 0.25rem 0;
  transition: color 0.2s;
}

.vehicle-item:hover .vehicle-name {
  color: #60a5fa;
}

.vehicle-details {
  font-size: 0.875rem;
  color: #9ca3af;
  margin: 0;
}

.vehicle-meta {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.vehicle-mileage {
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  margin: 0 0 0.25rem 0;
}

.chevron-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #6b7280;
  flex-shrink: 0;
  transition: color 0.2s;
}

.vehicle-item:hover .chevron-icon {
  color: #60a5fa;
}

/* Maintenance List */
.maintenance-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.maintenance-item {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  background: rgba(31, 41, 55, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.maintenance-item:hover {
  background: rgba(55, 65, 81, 0.7);
  border-color: rgba(59, 130, 246, 0.3);
  transform: translateY(-2px);
}

.maintenance-item.danger {
  background: rgba(153, 27, 27, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.maintenance-item.urgent {
  background: rgba(154, 52, 18, 0.2);
  border: 1px solid rgba(249, 115, 22, 0.3);
}

.maintenance-item.soon {
  background: rgba(133, 77, 14, 0.2);
  border: 1px solid rgba(234, 179, 8, 0.3);
}

.maintenance-info {
  flex: 1;
  min-width: 0;
}

.maintenance-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  flex-wrap: wrap;
}

.maintenance-name {
  font-weight: 500;
  color: white;
  margin: 0;
  font-size: 0.9375rem;
}

.maintenance-vehicle {
  font-size: 0.875rem;
  color: #9ca3af;
  margin: 0.25rem 0;
}

.maintenance-description {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0.25rem 0 0 0;
}

.maintenance-meta,
.maintenance-date {
  text-align: right;
  flex-shrink: 0;
}

.date-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  margin: 0 0 0.25rem 0;
}

.date-text.danger {
  color: #ef4444;
}

.cost-text {
  font-size: 0.75rem;
  font-weight: 600;
  color: #10b981;
  margin: 0.25rem 0;
}

.mileage-text,
.days-text {
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 0.25rem 0 0 0;
}

/* Maintenance Grid */
.maintenance-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 1024px) {
  .maintenance-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Hover States para Web/Desktop */
@media (hover: hover) {
  .quick-action-btn:hover {
    background: rgba(31, 41, 55, 0.8);
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
  }

  .stat-card:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 12px -1px rgba(0, 0, 0, 0.4);
  }

  .stat-card.blue:hover {
    border-color: rgba(59, 130, 246, 0.6);
    box-shadow: 0 4px 12px -1px rgba(59, 130, 246, 0.2);
  }

  .stat-card.green:hover {
    border-color: rgba(34, 197, 94, 0.6);
    box-shadow: 0 4px 12px -1px rgba(34, 197, 94, 0.2);
  }

  .stat-card.purple:hover {
    border-color: rgba(168, 85, 247, 0.6);
    box-shadow: 0 4px 12px -1px rgba(168, 85, 247, 0.2);
  }

  .stat-card.yellow:hover {
    border-color: rgba(234, 179, 8, 0.6);
    box-shadow: 0 4px 12px -1px rgba(234, 179, 8, 0.2);
  }

  .vehicle-item:hover {
    background: rgba(55, 65, 81, 0.7);
    border-color: rgba(59, 130, 246, 0.5);
    transform: translateX(4px);
  }

  .maintenance-item:hover {
    background: rgba(55, 65, 81, 0.7);
    border-color: rgba(59, 130, 246, 0.5);
  }

  .btn-primary:hover {
    background: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px -1px rgba(59, 130, 246, 0.4);
  }

  .btn-outline:hover {
    background: rgba(59, 130, 246, 0.1);
    border-color: rgba(59, 130, 246, 0.6);
    color: #60a5fa;
  }

  .alert-btn:hover {
    background: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.7);
  }
}
</style>
