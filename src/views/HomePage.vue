<template>
  <ion-page>
    <ModernHeader title="Dashboard" />

    <ion-content :fullscreen="true" class="c-dashboard__content">
      <!-- Backgrounds -->
      <div class="c-dashboard__bg-gradient"></div>
      <div class="c-dashboard__bg-pattern"></div>

      <main class="c-dashboard__main">
        <!-- Welcome Section -->
        <section class="c-dashboard__welcome">
          <h1 class="c-dashboard__title">Bem-vindo, {{ authStore.userName }}</h1>
        </section>

        <!-- Quick Actions -->
        <section class="c-dashboard__section">
          <h2 class="c-dashboard__section-title">Ações Rápidas</h2>
          <div class="c-dashboard__grid c-dashboard__grid--4col">
            <MQuickActionCard color="blue" @click="handleNavigation('/tabs/maintenance/new')">
              <template #icon>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </template>
              <template #title>Registrar</template>
              <template #subtitle>Manutenção</template>
            </MQuickActionCard>

            <MQuickActionCard color="green" @click="handleNavigation('/tabs/vehicle/new')">
              <template #icon>
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M5 11l-2 0 0-1c0-.5.2-1.1.5-1.5l1.8-2.2c.4-.4 1-.7 1.7-.7l13 0c.7 0 1.3.3 1.7.7l1.8 2.2c.3.4.5 1 .5 1.5l0 1-2 0 0-1c0-.3-.1-.5-.3-.7l-1.8-2.2c-.2-.2-.4-.3-.7-.3l-13 0c-.3 0-.5.1-.7.3l-1.8 2.2c-.2.2-.3.4-.3.7l0 1zm-.5 1c-.3 0-.5.2-.5.5l0 2.5 0 2.5c0 .3.2.5.5.5l.5 0 0 1.5c0 .3.2.5.5.5l2 0c.3 0 .5-.2.5-.5l0-1.5 10 0 0 1.5c0 .3.2.5.5.5l2 0c.3 0 .5-.2.5-.5l0-1.5.5 0c.3 0 .5-.2.5-.5l0-2.5 0-2.5c0-.3-.2-.5-.5-.5zm2 1.5c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm11 0c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z"
                  />
                </svg>
              </template>
              <template #title>Adicionar</template>
              <template #subtitle>Veículo</template>
            </MQuickActionCard>

            <MQuickActionCard color="purple" @click="handleNavigation('/tabs/maintenance')">
              <template #icon>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </template>
              <template #title>Ver</template>
              <template #subtitle>Histórico</template>
            </MQuickActionCard>

            <MQuickActionCard color="orange" @click="handleNavigation('/tabs/vehicles')">
              <template #icon>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </template>
              <template #title>Meus</template>
              <template #subtitle>Veículos</template>
            </MQuickActionCard>
          </div>
        </section>

        <!-- Overdue Alert -->
        <section v-if="overdueCount > 0" class="c-dashboard__alert-danger">
          <div class="c-dashboard__alert-content">
            <div class="c-dashboard__alert-left">
              <svg
                class="c-dashboard__alert-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>Você tem {{ overdueCount }} manutenção(ões) atrasada(s)!</span>
            </div>
            <ABtnOutline @click="$router.push('/tabs/vehicles')">Ver detalhes</ABtnOutline>
          </div>
        </section>

        <!-- Stats Grid -->
        <section class="c-dashboard__section">
          <div class="c-dashboard__grid c-dashboard__grid--4col">
            <MStatCard
              color="primary"
              label="Total de Veículos"
              :value="vehiclesStore.vehicleCount"
              subtitle="Veículos na sua garagem"
              :icon="carOutline"
              @click="$router.push('/tabs/vehicles')"
            />

            <MStatCard
              color="success"
              label="Manutenções"
              :value="vehiclesStore.totalMaintenanceRecords"
              subtitle="Registros no histórico"
              :icon="constructOutline"
              @click="handleNavigation('/tabs/maintenance')"
            />

            <MStatCard
              color="warning"
              label="Custo Total"
              :value="formatCurrency(totalCost)"
              subtitle="Investido em manutenções"
              :icon="cashOutline"
              @click="$router.push('/tabs/vehicles')"
            />

            <MStatCard
              color="secondary"
              label="Agendadas"
              :value="vehiclesStore.upcomingMaintenance.length"
              subtitle="Próximas manutenções"
              :icon="calendarOutline"
              @click="$router.push('/tabs/vehicles')"
            />
          </div>
        </section>

        <!-- Vehicles Section -->
        <section class="c-dashboard__card">
          <h3 class="c-dashboard__card-title">Meus Veículos</h3>

          <div v-if="vehiclesStore.vehicles.length === 0" class="c-dashboard__empty">
            <p>Nenhum veículo cadastrado</p>
            <ABtnPrimary @click="$router.push('/tabs/vehicle/new')">
              Adicionar primeiro veículo
            </ABtnPrimary>
          </div>

          <div v-else class="c-dashboard__list">
            <MVehicleCard
              v-for="vehicle in vehiclesStore.vehicles.slice(0, 3)"
              :key="vehicle.id"
              @click="$router.push(`/tabs/vehicle/${vehicle.id}`)"
            >
              <template #icon>
                <svg
                  v-if="vehicle.vehicleType === 'motorcycle'"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M6.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm11 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM9 11v5h6v-5h-6zm0-2h6V6.5H9V9z"
                  />
                </svg>
                <svg
                  v-else-if="vehicle.vehicleType === 'van'"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M3 6h2V4h14v2h2c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2v2h-2v-2H5v2H3v-2c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2zm0 2v6h18V8H3z"
                  />
                </svg>
                <svg
                  v-else-if="vehicle.vehicleType === 'truck'"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M18 18.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm1.5-9L23 16v6h-3v-3.5h-13V22H2V8.5h14.5V9.5H4v11h12v-3h3V9.5h.5z"
                  />
                </svg>
                <svg v-else fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M5 11l-2 0 0-1c0-.5.2-1.1.5-1.5l1.8-2.2c.4-.4 1-.7 1.7-.7l13 0c.7 0 1.3.3 1.7.7l1.8 2.2c.3.4.5 1 .5 1.5l0 1-2 0 0-1c0-.3-.1-.5-.3-.7l-1.8-2.2c-.2-.2-.4-.3-.7-.3l-13 0c-.3 0-.5.1-.7.3l-1.8 2.2c-.2.2-.3.4-.3.7l0 1zm-.5 1c-.3 0-.5.2-.5.5l0 2.5 0 2.5c0 .3.2.5.5.5l.5 0 0 1.5c0 .3.2.5.5.5l2 0c.3 0 .5-.2.5-.5l0-1.5 10 0 0 1.5c0 .3.2.5.5.5l2 0c.3 0 .5-.2.5-.5l0-1.5.5 0c.3 0 .5-.2.5-.5l0-2.5 0-2.5c0-.3-.2-.5-.5-.5zm2 1.5c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm11 0c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z"
                  />
                </svg>
              </template>
              <template #name>{{ vehicle.make }} {{ vehicle.model }}</template>
              <template #details>{{ vehicle.year }} • {{ vehicle.plate }}</template>
              <template #mileage>{{ vehicle.mileage.toLocaleString('pt-BR') }} km</template>
              <template #badge>
                <ABadgeStatus :type="vehicle.fuelType === 'electric' ? 'success' : 'default'">
                  {{ getFuelLabel(vehicle.fuelType) }}
                </ABadgeStatus>
              </template>
            </MVehicleCard>

            <ABtnOutline
              v-if="vehiclesStore.vehicles.length > 3"
              full-width
              @click="$router.push('/tabs/vehicles')"
            >
              Ver todos os veículos
            </ABtnOutline>
          </div>
        </section>

        <!-- Overdue Maintenance -->
        <section v-if="overdueCount > 0" class="c-dashboard__card c-dashboard__card--danger">
          <h3 class="c-dashboard__card-title">⚠️ Manutenções Atrasadas</h3>
          <div class="c-dashboard__list">
            <MMaintenanceCard
              v-for="maintenance in vehiclesStore.overdueMaintenance.slice(0, 3)"
              :key="maintenance.id"
              status="danger"
            >
              <template #badge>
                <ABadgeStatus type="error">ATRASADA</ABadgeStatus>
              </template>
              <template #title>{{ getMaintenanceTypeLabel(maintenance.type) }}</template>
              <template #vehicle>{{ getVehicleName(maintenance.vehicleId) }}</template>
              <template #date>{{ formatDate(maintenance.nextDueDate!) }}</template>
              <template #days
                >{{ Math.abs(daysUntilNext(maintenance.nextDueDate!)) }} dias atrás</template
              >
            </MMaintenanceCard>
          </div>
        </section>

        <!-- Recent & Upcoming Grid -->
        <section class="c-dashboard__grid-2col">
          <!-- Recent -->
          <article class="c-dashboard__card">
            <h3 class="c-dashboard__card-title">🔧 Últimas Manutenções</h3>

            <div v-if="vehiclesStore.recentMaintenance.length === 0" class="c-dashboard__empty">
              <p>Nenhuma manutenção registrada</p>
              <ABtnPrimary @click="$router.push('/tabs/vehicles')">
                Registrar manutenção
              </ABtnPrimary>
            </div>

            <div v-else class="c-dashboard__list">
              <MMaintenanceCard
                v-for="maintenance in vehiclesStore.recentMaintenance"
                :key="maintenance.id"
                @click="handleNavigation(`/tabs/maintenance/${maintenance.id}`)"
              >
                <template #badge>
                  <ABadgeMaintenance :maintenance-type="maintenance.type" />
                </template>
                <template #vehicle>{{ getVehicleName(maintenance.vehicleId) }}</template>
                <template v-if="maintenance.description" #description>
                  {{ maintenance.description }}
                </template>
                <template #date>{{ formatDate(maintenance.date) }}</template>
                <template #cost>{{ formatCurrency(maintenance.cost) }}</template>
                <template v-if="maintenance.mileage" #mileage>
                  {{ maintenance.mileage.toLocaleString('pt-BR') }} km
                </template>
              </MMaintenanceCard>

              <ABtnOutline full-width @click="handleNavigation('/tabs/maintenance')">
                Ver histórico completo
              </ABtnOutline>
            </div>
          </article>

          <!-- Upcoming -->
          <article class="c-dashboard__card">
            <h3 class="c-dashboard__card-title">📅 Próximas Manutenções</h3>

            <div v-if="vehiclesStore.upcomingMaintenance.length === 0" class="c-dashboard__empty">
              <p>Nenhuma manutenção agendada</p>
              <ABtnPrimary @click="$router.push('/tabs/vehicles')">
                Agendar manutenção
              </ABtnPrimary>
            </div>

            <div v-else class="c-dashboard__list">
              <MMaintenanceCard
                v-for="maintenance in vehiclesStore.upcomingMaintenance.slice(0, 5)"
                :key="maintenance.id"
                :status="getMaintenanceStatus(maintenance.nextDueDate!)"
              >
                <template #badge>
                  <ABadgeTime :urgency-type="getUrgencyType(maintenance.nextDueDate!)">
                    {{ daysUntilNext(maintenance.nextDueDate!) }} dias
                  </ABadgeTime>
                </template>
                <template #title>{{ getMaintenanceTypeLabel(maintenance.type) }}</template>
                <template #vehicle>{{ getVehicleName(maintenance.vehicleId) }}</template>
                <template #date>{{ formatDate(maintenance.nextDueDate!) }}</template>
                <template v-if="maintenance.nextDueMileage" #mileage>
                  {{ maintenance.nextDueMileage.toLocaleString('pt-BR') }} km
                </template>
              </MMaintenanceCard>

              <ABtnOutline full-width @click="handleNavigation('/tabs/maintenance')">
                Ver todas as manutenções
              </ABtnOutline>
            </div>
          </article>
        </section>

        <!-- Spacer -->
        <div style="height: 80px"></div>
      </main>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
  import { onMounted, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { IonPage, IonContent } from '@ionic/vue';
  import { carOutline, constructOutline, cashOutline, calendarOutline } from 'ionicons/icons';
  import { useAuthStore } from '@/stores/auth';
  import { useVehiclesStore } from '@/stores/vehicles';
  import { FUEL_TYPE_LABELS, MAINTENANCE_TYPE_LABELS } from '@/constants/vehicles';
  import ModernHeader from '@/components/organisms/ModernHeader.vue';
  import {
    MQuickActionCard,
    MStatCard,
    MVehicleCard,
    MMaintenanceCard,
    ABtnPrimary,
    ABtnOutline,
    ABadgeStatus,
    ABadgeMaintenance,
    ABadgeTime,
  } from '@/components';

  const router = useRouter();
  const authStore = useAuthStore();
  const vehiclesStore = useVehiclesStore();

  onMounted(async () => {
    if (authStore.isAuthenticated) {
      await vehiclesStore.fetchVehicles();
      await vehiclesStore.fetchMaintenanceRecords();
    }
  });

  const handleNavigation = (path: string) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setTimeout(() => {
      router.push(path);
    }, 10);
  };

  const totalCost = computed(() => vehiclesStore.totalMaintenanceCost);
  const overdueCount = computed(() => vehiclesStore.overdueMaintenance.length);

  const daysUntilNext = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getMaintenanceStatus = (date: Date): 'default' | 'danger' | 'urgent' | 'soon' => {
    const days = daysUntilNext(date);
    if (days < 0) return 'danger';
    if (days <= 7) return 'urgent';
    if (days <= 30) return 'soon';
    return 'default';
  };

  const getUrgencyType = (date: Date): 'overdue' | 'urgent' | 'soon' | 'normal' => {
    const days = daysUntilNext(date);
    if (days < 0) return 'overdue';
    if (days <= 7) return 'urgent';
    if (days <= 30) return 'soon';
    return 'normal';
  };

  const getMaintenanceTypeLabel = (type: string) => {
    return MAINTENANCE_TYPE_LABELS[type as keyof typeof MAINTENANCE_TYPE_LABELS] || type;
  };

  const getVehicleName = (vehicleId: string) => {
    const vehicle = vehiclesStore.getVehicleById(vehicleId);
    return vehicle ? `${vehicle.make} ${vehicle.model}` : 'Veículo desconhecido';
  };

  const getFuelLabel = (fuelType: string) => {
    const label = FUEL_TYPE_LABELS[fuelType as keyof typeof FUEL_TYPE_LABELS];
    if (fuelType === 'gasoline') return 'Gasolina';
    if (fuelType === 'diesel') return 'Diesel';
    if (fuelType === 'electric') return 'Elétrico';
    if (fuelType === 'flex') return 'Flex';
    return label || fuelType;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };
</script>

<style scoped lang="scss">
  .c-dashboard {
    &__content {
      --background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
    }

    &__bg-gradient {
      position: fixed;
      inset: 0;
      background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%);
      z-index: 0;
      opacity: 0.5;
    }

    &__bg-pattern {
      position: fixed;
      inset: 0;
      background-image: radial-gradient(
          circle at 20% 50%,
          rgba(99, 102, 241, 0.1) 0%,
          transparent 50%
        ),
        radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
      z-index: 0;
      pointer-events: none;
    }

    &__main {
      padding: 1rem 1rem 2rem;
      max-width: 1200px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }

    &__welcome {
      text-align: center;
      margin-bottom: 1.5rem;
      animation: fadeInDown 0.6s ease-out;
    }

    &__title {
      font-size: 1.125rem;
      font-weight: 600;
      color: white;
      margin: 0;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      letter-spacing: 0.01em;
    }

    &__section {
      margin-bottom: 1.5rem;
    }

    &__section-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      color: white;
      margin: 0 0 0.875rem 0;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      svg {
        width: 1.125rem;
        height: 1.125rem;
        color: rgba(255, 255, 255, 0.9);
      }
    }

    &__grid {
      display: grid;
      gap: 0.75rem;

      &--4col {
        grid-template-columns: repeat(2, 1fr);

        @media (min-width: 768px) {
          grid-template-columns: repeat(4, 1fr);
        }
      }
    }

    &__grid-2col {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;

      @media (min-width: 1024px) {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    &__alert-danger {
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

    &__alert-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }

    &__alert-left {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      flex: 1;
      min-width: 0;
    }

    &__alert-icon {
      width: 1.25rem;
      height: 1.25rem;
      color: #fca5a5;
      flex-shrink: 0;
    }

    &__card {
      background: rgba(31, 41, 55, 0.75);
      backdrop-filter: blur(15px);
      -webkit-backdrop-filter: blur(15px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 16px;
      padding: 1.25rem;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      animation: fadeInUp 0.6s ease-out backwards;
      margin-bottom: 1.5rem;

      &:hover {
        background: rgba(31, 41, 55, 0.9);
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
      }

      &--danger {
        border: 1.5px solid rgba(239, 68, 68, 0.4);
      }
    }

    &__card-title {
      font-size: 1rem;
      font-weight: 600;
      color: white;
      margin: 0 0 1rem 0;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      letter-spacing: 0.01em;
    }

    &__list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    &__empty {
      text-align: center;
      padding: 2rem 0;

      p {
        color: #9ca3af;
        margin: 0 0 1rem 0;
      }
    }
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

  /* Accessibility */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
    }
  }
</style>
