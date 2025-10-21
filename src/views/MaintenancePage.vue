<template>
  <ion-page>
    <ModernHeader
      title="Manutenções"
      :secondary-actions="[{ icon: add, handler: navigateToNew }]"
    />

    <ion-content :fullscreen="true" class="app-content">
      <!-- Background layers -->
      <div class="background-gradient"></div>
      <div class="background-pattern"></div>

      <div class="page-content-wrapper">
        <!-- Loading State -->
        <div v-if="vehiclesStore.loading" class="loading-container">
          <ion-spinner name="crescent"></ion-spinner>
          <p>Carregando manutenções...</p>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="vehiclesStore.maintenanceRecords.length === 0"
          class="empty-state-container"
        >
          <div class="empty-state">
            <svg class="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <h3>Nenhuma manutenção registrada</h3>
            <p>
              Comece registrando a primeira manutenção do seu veículo e mantenha um histórico
              completo
            </p>
            <ion-button @click="navigateToNew" color="primary">
              <template v-slot:start>
                <ion-icon :icon="add"></ion-icon>
              </template>
              Registrar primeira manutenção
            </ion-button>
          </div>
        </div>

        <!-- Maintenance List -->
        <div v-else class="maintenance-container">
          <!-- Modern Stats Cards with Glassmorphism -->
          <div class="modern-stats-grid">
            <div class="modern-stat-card gradient-primary">
              <div class="stat-background"></div>
              <div class="stat-content">
                <div class="stat-header">
                  <ion-icon :icon="construct" class="stat-icon-large"></ion-icon>
                  <span class="stat-trend">+{{ recentMaintenanceCount }}</span>
                </div>
                <div class="stat-body">
                  <h3 class="stat-number">{{ vehiclesStore.totalMaintenanceRecords }}</h3>
                  <p class="stat-label">Total de Manutenções</p>
                </div>
              </div>
            </div>

            <div class="modern-stat-card gradient-success">
              <div class="stat-background"></div>
              <div class="stat-content">
                <div class="stat-header">
                  <ion-icon :icon="cash" class="stat-icon-large"></ion-icon>
                  <span class="stat-trend-money">R$</span>
                </div>
                <div class="stat-body">
                  <h3 class="stat-number">
                    {{ formatCurrency(vehiclesStore.totalMaintenanceCost) }}
                  </h3>
                  <p class="stat-label">Total Investido</p>
                  <p class="stat-detail">Média: {{ formatCurrency(averageMaintenanceCost) }}</p>
                </div>
              </div>
            </div>

            <div class="modern-stat-card gradient-warning">
              <div class="stat-background"></div>
              <div class="stat-content">
                <div class="stat-header">
                  <ion-icon :icon="calendar" class="stat-icon-large"></ion-icon>
                  <span class="stat-badge">{{ vehiclesStore.upcomingMaintenance.length }}</span>
                </div>
                <div class="stat-body">
                  <h3 class="stat-number">{{ vehiclesStore.upcomingMaintenance.length }}</h3>
                  <p class="stat-label">Manutenções Próximas</p>
                  <p class="stat-detail">Agendadas</p>
                </div>
              </div>
            </div>

            <div
              v-if="vehiclesStore.overdueMaintenance.length > 0"
              class="modern-stat-card gradient-danger"
            >
              <div class="stat-background"></div>
              <div class="stat-content">
                <div class="stat-header">
                  <ion-icon :icon="alertCircle" class="stat-icon-large"></ion-icon>
                  <span class="stat-badge-danger">!</span>
                </div>
                <div class="stat-body">
                  <h3 class="stat-number">{{ vehiclesStore.overdueMaintenance.length }}</h3>
                  <p class="stat-label">Manutenções Atrasadas</p>
                  <p class="stat-detail">Necessitam atenção</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Maintenance Type Distribution Chart -->
          <div v-if="maintenanceTypeStats.length > 0" class="chart-card">
            <div class="chart-header">
              <h3 class="chart-title">
                <ion-icon :icon="pieChart"></ion-icon>
                Distribuição por Tipo
              </h3>
            </div>
            <div class="chart-content">
              <div class="chart-bars">
                <div
                  v-for="(stat, index) in maintenanceTypeStats"
                  :key="stat.type"
                  class="chart-bar-item"
                >
                  <div class="chart-bar-label">
                    <span class="chart-emoji">{{ stat.emoji }}</span>
                    <span class="chart-type">{{ stat.label }}</span>
                  </div>
                  <div class="chart-bar-container">
                    <div
                      class="chart-bar-fill"
                      :class="`chart-bar-color-${index % 6}`"
                      :style="{ width: `${stat.percentage}%` }"
                    >
                      <span class="chart-bar-value">{{ stat.count }}</span>
                    </div>
                  </div>
                  <span class="chart-bar-percentage">{{ stat.percentage.toFixed(0) }}%</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Cost Over Time Chart -->
          <div v-if="costOverTimeData.length > 0" class="chart-card">
            <div class="chart-header">
              <h3 class="chart-title">
                <ion-icon :icon="trendingUp"></ion-icon>
                Gastos nos Últimos Meses
              </h3>
            </div>
            <div class="chart-content">
              <div class="timeline-chart">
                <div v-for="month in costOverTimeData" :key="month.label" class="timeline-item">
                  <div class="timeline-bar-container">
                    <div
                      class="timeline-bar"
                      :style="{ height: `${(month.value / maxMonthlyCost) * 100}%` }"
                    >
                      <span class="timeline-value">{{ formatCurrency(month.value) }}</span>
                    </div>
                  </div>
                  <span class="timeline-label">{{ month.label }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Modern Filter Pills with Vehicle Select -->
          <div class="filters-container">
            <div class="filter-pills">
              <button
                class="filter-pill"
                :class="{ active: selectedFilter === 'all' }"
                @click="selectedFilter = 'all'"
              >
                <ion-icon :icon="list" class="pill-icon"></ion-icon>
                <span class="pill-label">Todas</span>
                <span class="pill-count">{{ vehiclesStore.maintenanceRecords.length }}</span>
              </button>

              <button
                class="filter-pill"
                :class="{ active: selectedFilter === 'upcoming' }"
                @click="selectedFilter = 'upcoming'"
              >
                <ion-icon :icon="calendar" class="pill-icon"></ion-icon>
                <span class="pill-label">Próximas</span>
                <span class="pill-count">{{ vehiclesStore.upcomingMaintenance.length }}</span>
              </button>

              <button
                v-if="vehiclesStore.overdueMaintenance.length > 0"
                class="filter-pill"
                :class="{ active: selectedFilter === 'overdue' }"
                @click="selectedFilter = 'overdue'"
              >
                <ion-icon :icon="alertCircle" class="pill-icon"></ion-icon>
                <span class="pill-label">Atrasadas</span>
                <span class="pill-count">{{ vehiclesStore.overdueMaintenance.length }}</span>
              </button>
            </div>

            <!-- Vehicle Select Filter -->
            <div v-if="vehiclesStore.vehicles.length > 0" class="vehicle-select-container">
              <ion-icon :icon="car" class="select-icon"></ion-icon>
              <select v-model="selectedVehicleId" class="vehicle-select">
                <option value="all">Todos os Veículos</option>
                <option
                  v-for="vehicle in vehiclesStore.vehicles"
                  :key="vehicle.id"
                  :value="vehicle.id"
                >
                  {{ vehicle.make }} {{ vehicle.model }} ({{
                    getVehicleMaintenanceCount(vehicle.id)
                  }})
                </option>
              </select>
            </div>
          </div>

          <!-- Maintenance Cards -->
          <div class="maintenance-list">
            <div
              v-for="record in filteredMaintenanceRecords"
              :key="record.id"
              class="modern-maintenance-card"
              @click="viewDetails(record)"
            >
              <div class="card-glass-background"></div>

              <!-- Card Header with Status Badge -->
              <div class="modern-card-header">
                <div class="header-left">
                  <span class="maintenance-emoji">{{ getMaintenanceIcon(record.type) }}</span>
                  <div class="header-info">
                    <h3 class="modern-card-title">{{ getMaintenanceTypeLabel(record.type) }}</h3>
                    <p class="modern-card-subtitle">
                      <ion-icon :icon="car" size="small"></ion-icon>
                      {{ getVehicleName(record.vehicleId) }}
                    </p>
                  </div>
                </div>
                <div class="status-badge" :class="`status-${getStatusColor(record)}`">
                  {{ getStatusLabel(record) }}
                </div>
              </div>

              <!-- Card Body with Info Grid -->
              <div class="modern-card-body">
                <div class="info-grid">
                  <div class="info-item">
                    <ion-icon :icon="calendar" class="info-icon"></ion-icon>
                    <div class="info-content">
                      <span class="info-label">Data</span>
                      <span class="info-value">{{ formatDate(record.date) }}</span>
                    </div>
                  </div>
                  <div class="info-item">
                    <ion-icon :icon="speedometer" class="info-icon"></ion-icon>
                    <div class="info-content">
                      <span class="info-label">KM</span>
                      <span class="info-value">{{ formatMileage(record.mileage) }}</span>
                    </div>
                  </div>
                  <div class="info-item">
                    <ion-icon :icon="cash" class="info-icon"></ion-icon>
                    <div class="info-content">
                      <span class="info-label">Custo</span>
                      <span class="info-value">{{ formatCurrency(record.cost) }}</span>
                    </div>
                  </div>
                </div>

                <!-- Description with Gradient Border -->
                <div v-if="record.description" class="description-box">
                  <p>{{ record.description }}</p>
                </div>
              </div>

              <!-- Card Footer Actions -->
              <div class="modern-card-footer">
                <button class="card-action-btn view-btn" @click.stop="viewDetails(record)">
                  <ion-icon :icon="eye"></ion-icon>
                  <span>Detalhes</span>
                </button>
                <button class="card-action-btn delete-btn" @click.stop="confirmDelete(record)">
                  <ion-icon :icon="trash"></ion-icon>
                  <span>Excluir</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Empty Filter State -->
          <div v-if="filteredMaintenanceRecords.length === 0" class="empty-filter-state">
            <ion-icon :icon="searchOutline" size="large" color="medium"></ion-icon>
            <p>Nenhuma manutenção encontrada para este filtro</p>
          </div>
        </div>
      </div>

      <!-- Floating Action Button -->
      <ion-fab vertical="bottom" horizontal="end">
        <ion-fab-button @click="navigateToNew">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>

    <!-- Delete Confirmation Modal -->
    <MConfirmModal
      v-model:is-open="showDeleteModal"
      title="Confirmar Exclusão"
      message="Deseja realmente excluir este registro de manutenção?"
      variant="danger"
      confirm-text="Excluir"
      cancel-text="Cancelar"
      confirm-color="danger"
      @confirm="handleDeleteConfirmed"
    />
  </ion-page>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import {
    IonPage,
    IonContent,
    IonButton,
    IonIcon,
    IonSpinner,
    IonFab,
    IonFabButton,
  } from '@ionic/vue';
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
    searchOutline,
    list,
    pieChart,
    trendingUp,
  } from 'ionicons/icons';
  import { useVehiclesStore } from '../stores/vehicles';
  import { MAINTENANCE_TYPE_LABELS, MAINTENANCE_TYPE_ICONS } from '@/constants/vehicles';
  import type { MaintenanceRecord } from '../stores/vehicles';
  import ModernHeader from '@/components/organisms/ModernHeader.vue';
  import MConfirmModal from '@/components/molecules/MConfirmModal.vue';

  const router = useRouter();
  const vehiclesStore = useVehiclesStore();

  // Navigate to new maintenance form with timestamp to force reset
  const navigateToNew = () => {
    router.push(`/tabs/maintenance/new?t=${Date.now()}`);
  };

  const selectedFilter = ref<'all' | 'upcoming' | 'overdue'>('all');
  const selectedVehicleId = ref<string>('all');
  const showDeleteModal = ref(false);
  const recordToDelete = ref<MaintenanceRecord | null>(null);

  const filteredMaintenanceRecords = computed(() => {
    // Filter by status
    let records: MaintenanceRecord[];

    switch (selectedFilter.value) {
      case 'upcoming':
        records = vehiclesStore.upcomingMaintenance;
        break;
      case 'overdue':
        records = vehiclesStore.overdueMaintenance;
        break;
      default:
        records = vehiclesStore.maintenanceRecords;
    }

    // Filter by vehicle
    if (selectedVehicleId.value !== 'all') {
      records = records.filter((record) => record.vehicleId === selectedVehicleId.value);
    }

    return records;
  });

  // Computed properties for statistics
  const recentMaintenanceCount = computed(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return vehiclesStore.maintenanceRecords.filter((record) => {
      const recordDate = typeof record.date === 'string' ? new Date(record.date) : record.date;
      return recordDate >= thirtyDaysAgo;
    }).length;
  });

  const averageMaintenanceCost = computed(() => {
    const total = vehiclesStore.totalMaintenanceCost;
    const count = vehiclesStore.totalMaintenanceRecords;
    return count > 0 ? total / count : 0;
  });

  const maintenanceTypeStats = computed(() => {
    const typeCounts: Record<string, number> = {};

    for (const record of vehiclesStore.maintenanceRecords) {
      typeCounts[record.type] = (typeCounts[record.type] || 0) + 1;
    }

    const stats = Object.entries(typeCounts).map(([type, count]) => ({
      type,
      count,
      label: getMaintenanceTypeLabel(type),
      emoji: getMaintenanceIcon(type),
      percentage: (count / vehiclesStore.totalMaintenanceRecords) * 100,
    }));

    return stats.sort((a, b) => b.count - a.count).slice(0, 6);
  });

  const costOverTimeData = computed(() => {
    const monthsData: Record<string, number> = {};
    const now = new Date();

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthsData[key] = 0;
    }

    // Sum costs per month
    for (const record of vehiclesStore.maintenanceRecords) {
      const recordDate = typeof record.date === 'string' ? new Date(record.date) : record.date;
      const key = `${recordDate.getFullYear()}-${String(recordDate.getMonth() + 1).padStart(
        2,
        '0',
      )}`;

      if (key in monthsData) {
        monthsData[key] += record.cost;
      }
    }

    return Object.entries(monthsData).map(([key, value]) => {
      const [year, month] = key.split('-');
      const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1);
      const label = date.toLocaleDateString('pt-BR', { month: 'short' });

      return { label: label.charAt(0).toUpperCase() + label.slice(1), value };
    });
  });

  const maxMonthlyCost = computed(() => {
    if (costOverTimeData.value.length === 0) return 0;
    return Math.max(...costOverTimeData.value.map((m) => m.value));
  });

  const getMaintenanceIcon = (type: string): string => {
    return MAINTENANCE_TYPE_ICONS[type as keyof typeof MAINTENANCE_TYPE_ICONS] || '🔧';
  };

  const getMaintenanceTypeLabel = (type: string): string => {
    return MAINTENANCE_TYPE_LABELS[type as keyof typeof MAINTENANCE_TYPE_LABELS] || type;
  };

  const getVehicleName = (vehicleId: string): string => {
    const vehicle = vehiclesStore.vehicles.find((v) => v.id === vehicleId);
    return vehicle ? `${vehicle.make} ${vehicle.model}` : 'Veículo não encontrado';
  };

  const getVehicleMaintenanceCount = (vehicleId: string): number => {
    return vehiclesStore.maintenanceRecords.filter((record) => record.vehicleId === vehicleId)
      .length;
  };

  const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatMileage = (mileage: number): string => {
    return mileage.toLocaleString('pt-BR');
  };

  const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const getStatusLabel = (record: MaintenanceRecord): string => {
    if (!record.nextDueDate && !record.nextDueMileage) {
      return 'Concluída';
    }

    if (record.nextDueDate) {
      const nextDate = new Date(record.nextDueDate);
      const today = new Date();
      if (nextDate < today) {
        return 'Atrasada';
      }
      return 'Agendada';
    }

    return 'Concluída';
  };

  const getStatusColor = (record: MaintenanceRecord): string => {
    const status = getStatusLabel(record);
    switch (status) {
      case 'Atrasada':
        return 'danger';
      case 'Agendada':
        return 'warning';
      default:
        return 'success';
    }
  };

  const viewDetails = (record: MaintenanceRecord) => {
    router.push(`/tabs/maintenance/${record.id}`);
  };

  const confirmDelete = async (record: MaintenanceRecord) => {
    recordToDelete.value = record;
    showDeleteModal.value = true;
  };

  const handleDeleteConfirmed = async () => {
    if (!recordToDelete.value) return;
    await handleDelete(recordToDelete.value.id);
    recordToDelete.value = null;
  };

  const handleDelete = async (recordId: string) => {
    try {
      await vehiclesStore.deleteMaintenanceRecord(recordId);
    } catch (error) {
      console.error('Error deleting maintenance record:', error);
    }
  };

  onMounted(async () => {
    // Fetch vehicles if not loaded yet
    if (vehiclesStore.vehicles.length === 0) {
      await vehiclesStore.fetchVehicles();
    }
    // Always fetch maintenance records
    await vehiclesStore.fetchMaintenanceRecords();
  });
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
    animation: fadeInDown 0.6s ease-out;
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
    color: #e5e7eb;
    margin-bottom: 12px;
  }

  .empty-state p {
    font-size: 1rem;
    color: #9ca3af;
    margin-bottom: 24px;
    line-height: 1.5;
  }

  /* Container */
  .maintenance-container {
    padding: 20px 16px 100px;
    max-width: 1200px;
    margin: 0 auto;
  }

  /* Modern Stats Cards with Glassmorphism */
  .modern-stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }

  .modern-stat-card {
    position: relative;
    padding: 24px;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    animation: fadeInUp 0.6s ease-out backwards;
  }

  .modern-stat-card:nth-child(1) {
    animation-delay: 0.1s;
  }
  .modern-stat-card:nth-child(2) {
    animation-delay: 0.15s;
  }
  .modern-stat-card:nth-child(3) {
    animation-delay: 0.2s;
  }
  .modern-stat-card:nth-child(4) {
    animation-delay: 0.25s;
  }

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

  .modern-stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  }

  .stat-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.1;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%);
  }

  .gradient-primary {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.1) 100%);
  }

  .gradient-success {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.1) 100%);
  }

  .gradient-warning {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.1) 100%);
  }

  .gradient-danger {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.1) 100%);
  }

  .stat-content {
    position: relative;
    z-index: 1;
  }

  .stat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .stat-icon-large {
    font-size: 2.5rem;
    color: #fff;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  }

  .stat-trend {
    background: rgba(16, 185, 129, 0.2);
    color: #10b981;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .stat-trend-money {
    background: rgba(59, 130, 246, 0.2);
    color: #3b82f6;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 0.875rem;
    font-weight: 700;
  }

  .stat-badge {
    background: rgba(245, 158, 11, 0.2);
    color: #f59e0b;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .stat-badge-danger {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 0.875rem;
    font-weight: 700;
  }

  .stat-body {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .stat-number {
    font-size: 2rem;
    font-weight: 700;
    color: #fff;
    margin: 0;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .stat-label {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .stat-detail {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.6);
    margin: 0;
  }

  /* Chart Cards */
  .chart-card {
    background: linear-gradient(135deg, rgba(31, 41, 55, 0.9) 0%, rgba(17, 24, 39, 0.95) 100%);
    border-radius: 20px;
    padding: 24px;
    margin-bottom: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
  }

  .chart-header {
    margin-bottom: 20px;
  }

  .chart-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 1.125rem;
    font-weight: 600;
    color: #fff;
    margin: 0;
  }

  .chart-title ion-icon {
    font-size: 1.5rem;
    color: #3b82f6;
  }

  .chart-content {
    padding: 8px 0;
  }

  /* Bar Chart Styles */
  .chart-bars {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .chart-bar-item {
    display: grid;
    grid-template-columns: 140px 1fr 60px;
    align-items: center;
    gap: 12px;
  }

  .chart-bar-label {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .chart-emoji {
    font-size: 1.5rem;
  }

  .chart-type {
    font-size: 0.875rem;
    color: #e5e7eb;
    font-weight: 500;
  }

  .chart-bar-container {
    flex: 1;
    height: 32px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    overflow: hidden;
    position: relative;
  }

  .chart-bar-fill {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 8px;
    border-radius: 8px;
    transition: width 0.6s ease;
    position: relative;
    overflow: hidden;
  }

  .chart-bar-value {
    font-size: 0.75rem;
    font-weight: 700;
    color: #fff;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    z-index: 1;
  }

  .chart-bar-percentage {
    font-size: 0.875rem;
    font-weight: 600;
    color: #9ca3af;
    text-align: right;
  }

  /* Chart Bar Colors */
  .chart-bar-color-0 {
    background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
  }
  .chart-bar-color-1 {
    background: linear-gradient(90deg, #10b981 0%, #059669 100%);
  }
  .chart-bar-color-2 {
    background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%);
  }
  .chart-bar-color-3 {
    background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
  }
  .chart-bar-color-4 {
    background: linear-gradient(90deg, #8b5cf6 0%, #7c3aed 100%);
  }
  .chart-bar-color-5 {
    background: linear-gradient(90deg, #ec4899 0%, #db2777 100%);
  }

  /* Timeline Chart */
  .timeline-chart {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 8px;
    height: 180px;
    padding: 16px 0;
  }

  .timeline-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .timeline-bar-container {
    flex: 1;
    width: 100%;
    display: flex;
    align-items: flex-end;
    position: relative;
  }

  .timeline-bar {
    width: 100%;
    background: linear-gradient(180deg, #3b82f6 0%, #2563eb 100%);
    border-radius: 8px 8px 0 0;
    min-height: 8px;
    transition: all 0.4s ease;
    position: relative;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 8px;
  }

  .timeline-bar:hover {
    transform: scaleY(1.05);
    box-shadow: 0 -4px 16px rgba(59, 130, 246, 0.4);
  }

  .timeline-value {
    position: absolute;
    top: -24px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.7rem;
    font-weight: 600;
    color: #3b82f6;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .timeline-bar:hover .timeline-value {
    opacity: 1;
  }

  .timeline-label {
    font-size: 0.75rem;
    color: #9ca3af;
    font-weight: 500;
    text-transform: capitalize;
  }

  /* Filters Container - Horizontal Layout */
  .filters-container {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
    flex-wrap: wrap;
    align-items: stretch;
  }

  @media (max-width: 768px) {
    .filters-container {
      flex-direction: column;
      gap: 8px;
    }
  }

  /* Modern Filter Pills */
  .filter-pills {
    display: flex;
    gap: 8px;
    flex: 1;
    min-width: 300px;
    padding: 4px;
    background: rgba(31, 41, 55, 0.5);
    border-radius: 16px;
    backdrop-filter: blur(10px);
  }

  @media (max-width: 768px) {
    .filter-pills {
      min-width: 100%;
    }
  }

  .filter-pill {
    flex: 1;
    min-width: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 16px;
    background: transparent;
    border: none;
    border-radius: 12px;
    color: #9ca3af;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .filter-pill:hover {
    background: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
  }

  .filter-pill.active {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: #fff;
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
  }

  .pill-icon {
    font-size: 1.125rem;
  }

  .pill-label {
    font-weight: 600;
  }

  .pill-count {
    background: rgba(255, 255, 255, 0.15);
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 0.75rem;
    font-weight: 700;
  }

  .filter-pill.active .pill-count {
    background: rgba(255, 255, 255, 0.25);
  }

  /* Vehicle Select Filter */
  .vehicle-select-container {
    position: relative;
    display: flex;
    align-items: center;
    min-width: 240px;
    background: rgba(31, 41, 55, 0.5);
    border-radius: 12px;
    padding: 0 12px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
  }

  @media (max-width: 768px) {
    .vehicle-select-container {
      min-width: 100%;
    }
  }

  .vehicle-select-container:hover {
    background: rgba(31, 41, 55, 0.7);
    border-color: rgba(59, 130, 246, 0.3);
  }

  .vehicle-select-container .select-icon {
    font-size: 1.125rem;
    color: #3b82f6;
    margin-right: 8px;
    flex-shrink: 0;
  }

  .vehicle-select {
    flex: 1;
    background: transparent;
    border: none;
    color: #e5e7eb;
    font-size: 0.875rem;
    font-weight: 500;
    padding: 12px 8px;
    cursor: pointer;
    outline: none;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%239ca3af' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 8px center;
    padding-right: 28px;
  }

  .vehicle-select option {
    background: #1f2937;
    color: #e5e7eb;
    padding: 8px;
  }

  .vehicle-select:hover {
    color: #fff;
  }

  .vehicle-select:focus {
    color: #3b82f6;
  }

  /* Maintenance List */
  .maintenance-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  /* Modern Maintenance Cards with Glassmorphism */
  .modern-maintenance-card {
    position: relative;
    background: linear-gradient(135deg, rgba(31, 41, 55, 0.9) 0%, rgba(17, 24, 39, 0.95) 100%);
    border-radius: 24px;
    padding: 24px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    transition: all 0.3s ease;
    overflow: hidden;
  }

  .modern-maintenance-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
    border-color: rgba(59, 130, 246, 0.3);
  }

  .card-glass-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%);
    pointer-events: none;
  }

  .modern-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
    position: relative;
    z-index: 1;
  }

  .header-left {
    display: flex;
    gap: 16px;
    align-items: flex-start;
    flex: 1;
  }

  .maintenance-emoji {
    font-size: 3rem;
    line-height: 1;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
  }

  .header-info {
    flex: 1;
  }

  .modern-card-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 8px 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .modern-card-subtitle {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.875rem;
    color: #9ca3af;
    margin: 0;
  }

  .status-badge {
    padding: 8px 16px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .status-success {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(5, 150, 105, 0.2) 100%);
    color: #10b981;
    border: 1px solid rgba(16, 185, 129, 0.3);
  }

  .status-warning {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.3) 0%, rgba(217, 119, 6, 0.2) 100%);
    color: #f59e0b;
    border: 1px solid rgba(245, 158, 11, 0.3);
  }

  .status-danger {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.2) 100%);
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.3);
  }

  .modern-card-body {
    position: relative;
    z-index: 1;
    margin-bottom: 16px;
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 16px;
    margin-bottom: 16px;
  }

  .info-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .info-icon {
    font-size: 1.5rem;
    color: #3b82f6;
  }

  .info-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .info-label {
    font-size: 0.7rem;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 500;
  }

  .info-value {
    font-size: 0.938rem;
    color: #fff;
    font-weight: 600;
  }

  .description-box {
    padding: 16px;
    background: rgba(59, 130, 246, 0.05);
    border-left: 3px solid #3b82f6;
    border-radius: 8px;
  }

  .description-box p {
    font-size: 0.875rem;
    color: #e5e7eb;
    line-height: 1.6;
    margin: 0;
  }

  .modern-card-footer {
    display: flex;
    gap: 12px;
    padding-top: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    position: relative;
    z-index: 1;
  }

  .card-action-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 16px;
    border: none;
    border-radius: 12px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .view-btn {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.1) 100%);
    color: #3b82f6;
    border: 1px solid rgba(59, 130, 246, 0.3);
  }

  .view-btn:hover {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(37, 99, 235, 0.2) 100%);
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
  }

  .delete-btn {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.1) 100%);
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.3);
  }

  .delete-btn:hover {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.2) 100%);
    box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
  }

  /* Empty Filter State */
  .empty-filter-state {
    text-align: center;
    padding: 64px 24px;
    color: #9ca3af;
  }

  .empty-filter-state ion-icon {
    font-size: 4rem;
    margin-bottom: 16px;
    opacity: 0.5;
  }

  .empty-filter-state p {
    margin-top: 12px;
    font-size: 0.938rem;
    color: #6b7280;
  }

  /* Responsive */
  @media (min-width: 768px) {
    .maintenance-container {
      padding: 24px 20px 100px;
    }

    .modern-stats-grid {
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    }

    .filter-pills {
      justify-content: center;
    }

    .filter-pill {
      flex: 0 1 auto;
    }
  }

  @media (min-width: 1024px) {
    .modern-stats-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  /* Floating Action Button - Always visible above tab bar */
  ion-fab {
    position: fixed;
    bottom: 80px; /* Above tab bar */
    right: 16px;
    z-index: 999;
  }

  ion-fab-button {
    --background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    --box-shadow: 0 8px 24px -4px rgba(59, 130, 246, 0.5);
    width: 56px;
    height: 56px;
    border-radius: 16px;
  }

  ion-fab-button::part(native) {
    border-radius: 16px;
  }

  ion-fab-button:hover {
    --box-shadow: 0 12px 32px -4px rgba(59, 130, 246, 0.6);
    transform: translateY(-2px);
    transition: all 0.3s ease;
  }

  @media (min-width: 768px) {
    ion-fab {
      bottom: 24px;
      right: 24px;
    }

    ion-fab-button {
      width: 64px;
      height: 64px;
    }
  }
</style>
