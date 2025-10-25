<template>
  <ion-page>
    <ModernHeader
      title="Detalhes da Manutenção"
      :show-back-button="true"
      back-path="/tabs/maintenance"
      :secondary-actions="[
        { icon: createOutline, handler: handleEdit },
        { icon: trashOutline, handler: handleDelete },
      ]"
    />

    <ion-content :fullscreen="true" class="app-content detail-content">
      <!-- Loading State -->
      <div v-if="!maintenanceRecord" class="loading-container">
        <ion-spinner name="crescent"></ion-spinner>
        <p class="loading-text">Carregando informações da manutenção...</p>
      </div>

      <div v-else class="detail-container">
        <!-- Maintenance Header -->
          <div class="maintenance-header">
            <div class="header-content">
              <div class="type-icon">
                {{ getMaintenanceIcon(maintenanceRecord.type) }}
              </div>
              <div class="header-info">
                <h1 class="maintenance-title">
                  {{ getMaintenanceTypeLabel(maintenanceRecord.type) }}
                </h1>
                <p class="maintenance-description">
                  {{ maintenanceRecord.description }}
                </p>
                <div class="maintenance-badges">
                  <ABadge variant="info">
                    {{ formatDate(maintenanceRecord.date) }}
                  </ABadge>
                  <ABadge variant="secondary">
                    {{ maintenanceRecord.mileage.toLocaleString('pt-BR') }} km
                  </ABadge>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="modern-stats-grid">
            <!-- Custo Total -->
            <div class="modern-stat-card gradient-blue">
              <div class="stat-background"></div>
              <div class="stat-content-wrapper">
                <div class="stat-icon-modern blue">
                  <ion-icon :icon="cashOutline"></ion-icon>
                </div>
                <div class="stat-details">
                  <p class="stat-label-modern">Custo Total</p>
                  <h3 class="stat-value-modern">{{ formatCurrency(maintenanceRecord.cost) }}</h3>
                </div>
              </div>
            </div>

            <!-- Peças -->
            <div v-if="maintenanceRecord.partsCost" class="modern-stat-card gradient-purple">
              <div class="stat-background"></div>
              <div class="stat-content-wrapper">
                <div class="stat-icon-modern purple">
                  <ion-icon :icon="cubeOutline"></ion-icon>
                </div>
                <div class="stat-details">
                  <p class="stat-label-modern">Peças</p>
                  <h3 class="stat-value-modern">
                    {{ formatCurrency(maintenanceRecord.partsCost) }}
                  </h3>
                </div>
              </div>
            </div>

            <!-- Mão de Obra -->
            <div v-if="maintenanceRecord.laborCost" class="modern-stat-card gradient-green">
              <div class="stat-background"></div>
              <div class="stat-content-wrapper">
                <div class="stat-icon-modern green">
                  <ion-icon :icon="constructOutline"></ion-icon>
                </div>
                <div class="stat-details">
                  <p class="stat-label-modern">Mão de Obra</p>
                  <h3 class="stat-value-modern">
                    {{ formatCurrency(maintenanceRecord.laborCost) }}
                  </h3>
                </div>
              </div>
            </div>

            <!-- Próxima Manutenção -->
            <div v-if="maintenanceRecord.nextDueDate" class="modern-stat-card gradient-yellow">
              <div class="stat-background"></div>
              <div class="stat-content-wrapper">
                <div class="stat-icon-modern yellow">
                  <ion-icon :icon="calendarOutline"></ion-icon>
                </div>
                <div class="stat-details">
                  <p class="stat-label-modern">Próxima Manutenção</p>
                  <h3 class="stat-value-modern text-sm">
                    {{ formatDate(maintenanceRecord.nextDueDate) }}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          <!-- Fuel Consumption Card (if available) -->
          <div v-if="fuelConsumptionData" class="fuel-consumption-section">
            <MFuelCostDisplay
              title="Combustível Desde a Última Manutenção"
              subtitle="Estimativa baseada no consumo médio do veículo"
              :distance="fuelConsumptionData.distance"
              :liters="fuelConsumptionData.liters"
              :cost="fuelConsumptionData.cost"
              :show-distance="true"
              :show-average="false"
              :show-note="true"
            />
          </div>

          <!-- Vehicle Info Card -->
          <ACard class="vehicle-card" v-if="vehicle">
            <div class="vehicle-card-header">
              <ion-icon :icon="carOutline" class="vehicle-icon"></ion-icon>
              <h3>Veículo</h3>
            </div>
            <div class="vehicle-info" @click="goToVehicle">
              <div class="vehicle-details">
                <h4>{{ vehicle.make }} {{ vehicle.model }}</h4>
                <p class="vehicle-meta">
                  {{ vehicle.year }} • {{ vehicle.plate }}
                  <template v-if="vehicle.color"> • {{ vehicle.color }}</template>
                </p>
              </div>
              <ion-icon :icon="chevronForwardOutline" class="nav-icon"></ion-icon>
            </div>
          </ACard>

          <!-- Maintenance Details -->
          <ACard class="details-card">
            <h3 class="card-title">
              <ion-icon :icon="informationCircleOutline"></ion-icon>
              Informações Detalhadas
            </h3>

            <!-- Main Info Section -->
            <MInfoSection title="Execução do Serviço">
              <MInfoItem label="Data da Manutenção" :icon="calendarOutline" variant="blue">
                {{ formatFullDate(maintenanceRecord.date) }}
              </MInfoItem>
              <MInfoItem label="Quilometragem" :icon="speedometerOutline" variant="purple">
                {{ maintenanceRecord.mileage.toLocaleString('pt-BR') }} km
              </MInfoItem>
              <MInfoItem
                v-if="maintenanceRecord.serviceProvider"
                label="Prestador de Serviço"
                :icon="businessOutline"
                variant="green"
                :full-width="true"
              >
                {{ maintenanceRecord.serviceProvider }}
              </MInfoItem>
            </MInfoSection>

            <!-- Next Maintenance Section -->
            <MInfoSection v-if="maintenanceRecord.nextDueDate || maintenanceRecord.nextDueMileage" title="Próxima Manutenção">
              <MInfoItem
                v-if="maintenanceRecord.nextDueDate"
                label="Data Prevista"
                :icon="calendarOutline"
                variant="yellow"
              >
                {{ formatFullDate(maintenanceRecord.nextDueDate) }}
                <template #helper>{{ getTimeUntil(maintenanceRecord.nextDueDate) }}</template>
              </MInfoItem>

              <MInfoItem
                v-if="maintenanceRecord.nextDueMileage"
                label="Quilometragem Prevista"
                :icon="flagOutline"
                variant="yellow"
              >
                {{ maintenanceRecord.nextDueMileage.toLocaleString('pt-BR') }} km
                <template v-if="vehicle" #helper>
                  {{ getKmUntil(maintenanceRecord.nextDueMileage, vehicle.mileage) }}
                </template>
              </MInfoItem>
            </MInfoSection>

            <!-- Notes Section -->
            <MInfoBox v-if="maintenanceRecord.notes">
              <template #header>
                <ion-icon :icon="documentTextOutline"></ion-icon>
                <span>Observações</span>
              </template>
              <div class="notes-box">
                <ion-icon :icon="documentTextOutline" class="notes-icon"></ion-icon>
                <p class="notes-content">{{ maintenanceRecord.notes }}</p>
              </div>
            </MInfoBox>
          </ACard>

          <!-- Cost Breakdown -->
          <ACard
            v-if="maintenanceRecord.partsCost || maintenanceRecord.laborCost"
            class="cost-card"
          >
            <h3 class="card-title">
              <ion-icon :icon="calculatorOutline"></ion-icon>
              Detalhamento de Custos
            </h3>

            <MCostBreakdown>
              <MCostItem
                v-if="maintenanceRecord.partsCost"
                :icon="cubeOutline"
                :value="formatCurrency(maintenanceRecord.partsCost)"
              >
                Peças e Materiais
              </MCostItem>

              <MCostItem
                v-if="maintenanceRecord.laborCost"
                :icon="constructOutline"
                :value="formatCurrency(maintenanceRecord.laborCost)"
              >
                Mão de Obra
              </MCostItem>

              <MCostItem
                is-total
                :icon="cashOutline"
                :value="formatCurrency(maintenanceRecord.cost)"
              >
                <strong>Total</strong>
              </MCostItem>
            </MCostBreakdown>
          </ACard>

          <!-- Warranty Info -->
          <div
            v-if="maintenanceRecord.warrantyParts || maintenanceRecord.warrantyLabor"
            class="warranty-section"
          >
            <h3 class="section-title">
              <ion-icon :icon="shieldCheckmarkOutline"></ion-icon>
              Garantias
            </h3>

            <MWarrantyCards>
              <ACard v-if="maintenanceRecord.warrantyParts" class="warranty-card">
                <MWarrantyBadge
                  title="Garantia das Peças"
                  :icon="cubeOutline"
                  :months="maintenanceRecord.warrantyParts.months"
                  :expiry-date="formatDate(maintenanceRecord.warrantyParts.expiryDate)"
                  :is-valid="isWarrantyValid(maintenanceRecord.warrantyParts.expiryDate)"
                />
              </ACard>

              <ACard v-if="maintenanceRecord.warrantyLabor" class="warranty-card">
                <MWarrantyBadge
                  title="Garantia da Mão de Obra"
                  :icon="constructOutline"
                  :months="maintenanceRecord.warrantyLabor.months"
                  :expiry-date="formatDate(maintenanceRecord.warrantyLabor.expiryDate)"
                  :is-valid="isWarrantyValid(maintenanceRecord.warrantyLabor.expiryDate)"
                />
              </ACard>
            </MWarrantyCards>
          </div>

          <!-- Photos Before/After -->
          <div
            v-if="maintenanceRecord.beforePhoto || maintenanceRecord.afterPhoto"
            class="modern-photos-section"
          >
            <h3 class="modern-section-title">
              <ion-icon :icon="cameraOutline"></ion-icon>
              Fotos Antes/Depois
            </h3>

            <div class="modern-photos-grid">
              <MPhotoCard
                v-if="maintenanceRecord?.beforePhoto"
                :photo-url="maintenanceRecord.beforePhoto!"
                type="before"
                alt="Foto antes da manutenção"
                @view="() => maintenanceRecord?.beforePhoto && viewPhoto(maintenanceRecord.beforePhoto, 'before')"
                @download="() => maintenanceRecord?.beforePhoto && downloadPhoto(maintenanceRecord.beforePhoto, 'antes')"
                @share="() => maintenanceRecord?.beforePhoto && sharePhoto(maintenanceRecord.beforePhoto, 'antes')"
              />

              <MPhotoCard
                v-if="maintenanceRecord?.afterPhoto"
                :photo-url="maintenanceRecord.afterPhoto!"
                type="after"
                alt="Foto depois da manutenção"
                @view="() => maintenanceRecord?.afterPhoto && viewPhoto(maintenanceRecord.afterPhoto, 'after')"
                @download="() => maintenanceRecord?.afterPhoto && downloadPhoto(maintenanceRecord.afterPhoto, 'depois')"
                @share="() => maintenanceRecord?.afterPhoto && sharePhoto(maintenanceRecord.afterPhoto, 'depois')"
              />
            </div>
          </div>

          <!-- Attachments -->
          <ACard
            v-if="maintenanceRecord.attachments && maintenanceRecord.attachments.length > 0"
            class="attachments-card"
          >
            <h3 class="card-title">
              <ion-icon :icon="documentTextOutline"></ion-icon>
              Anexos ({{ maintenanceRecord.attachments.length }})
            </h3>

            <MAttachmentsList>
              <MAttachmentItem
                v-for="(attachment, index) in maintenanceRecord.attachments"
                :key="index"
                :name="attachment.name"
                :icon="getAttachmentIcon(attachment.type)"
                :size="formatFileSize(attachment.size)"
                :date="formatDate(attachment.uploadedAt)"
                @view="viewAttachment(attachment)"
              />
            </MAttachmentsList>
          </ACard>

          <!-- Timeline/History -->
          <ACard class="timeline-card">
            <h3 class="card-title">
              <ion-icon :icon="timeOutline"></ion-icon>
              Histórico
            </h3>

            <MTimeline>
              <MTimelineItem
                title="Manutenção registrada"
                :date="formatDateTime(maintenanceRecord.createdAt)"
                :is-last="true"
              />
            </MTimeline>
          </ACard>
        </div>
      </ion-content>

      <!-- Delete Confirmation Modal -->
    <MConfirmModal
      v-model:is-open="showDeleteModal"
      title="Confirmar Exclusão"
      message="Tem certeza que deseja excluir esta manutenção? Esta ação não pode ser desfeita."
      variant="danger"
      confirm-text="Excluir"
      cancel-text="Cancelar"
      confirm-color="danger"
      @confirm="confirmDelete"
    />
  </ion-page>
</template>

<script setup lang="ts">
  import { IonPage, IonContent, IonIcon, IonSpinner } from '@ionic/vue'
  import {
    createOutline,
    trashOutline,
    cashOutline,
    cubeOutline,
    constructOutline,
    calendarOutline,
    carOutline,
    chevronForwardOutline,
    informationCircleOutline,
    calculatorOutline,
    shieldCheckmarkOutline,
    cameraOutline,
    documentTextOutline,
    timeOutline,
    speedometerOutline,
    businessOutline,
    flagOutline,
  } from 'ionicons/icons'
  import { useMaintenanceDetail } from '@/composables/useMaintenanceDetail'
  import { useMaintenanceFormatters } from '@/composables/useMaintenanceFormatters'
  import { usePhotoHandling } from '@/composables/usePhotoHandling'
  import { useWarrantyLogic } from '@/composables/useWarrantyLogic'
  import ModernHeader from '@/components/organisms/ModernHeader.vue'
  import ABadge from '@/components/atoms/ABadge.vue'
  import ACard from '@/components/atoms/ACard.vue'
  import MConfirmModal from '@/components/molecules/MConfirmModal.vue'
  import MFuelCostDisplay from '@/components/molecules/MFuelCostDisplay.vue'
  import {
    MInfoBox,
    MInfoItem,
    MCostItem,
    MWarrantyBadge,
    MTimelineItem,
    MAttachmentItem,
    MInfoSection,
    MCostBreakdown,
    MWarrantyCards,
    MTimeline,
    MAttachmentsList,
    MPhotoCard,
  } from './components'

  // Composables
  const { maintenanceRecord, vehicle, fuelConsumptionData, showDeleteModal, goToVehicle, handleEdit, handleDelete, confirmDelete } =
    useMaintenanceDetail()
  const {
    formatCurrency,
    formatDate,
    formatFullDate,
    formatDateTime,
    formatFileSize,
    getTimeUntil,
    getKmUntil,
  } = useMaintenanceFormatters()
  const { viewPhoto, downloadPhoto, sharePhoto, viewAttachment, getAttachmentIcon } =
    usePhotoHandling()
  const { isWarrantyValid, getMaintenanceTypeLabel, getMaintenanceIcon } = useWarrantyLogic()
</script>

<style scoped lang="scss">
@use '@/theme/tokens' as *;

.detail-content {
  --background: var(--ion-background-color);
}

.loading-container {
  @include flex-center;
  flex-direction: column;
  min-height: 50vh;
  @include flex-gap($spacing-lg);
}

.loading-text {
  color: $color-text-tertiary;
  font-size: $font-size-sm;
}

.detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: $spacing-lg;
}

.maintenance-header {
  @include card-base;
  padding: $spacing-3xl;
  margin-bottom: $spacing-2xl;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: $gradient-background-overlay;
    pointer-events: none;
  }

  > .header-content {
    @include flex-gap($spacing-xl);
    align-items: flex-start;
    position: relative;
    z-index: 1;
  }
}

.type-icon {
  font-size: 4rem;
  line-height: 1;
  filter: drop-shadow($shadow-dark);
}

.header-info {
  flex: 1;
}

.maintenance-title {
  @include heading-primary;
  font-size: 1.75rem;
  margin: 0 0 $spacing-md 0;
}

.maintenance-description {
  color: $color-text-secondary;
  font-size: $font-size-lg;
  margin: 0 0 $spacing-lg 0;
  line-height: $line-height-normal;
}

.maintenance-badges {
  @include flex-gap($spacing-sm);
  flex-wrap: wrap;
}

.modern-stats-grid {
  @include grid-auto-fit;
  margin-bottom: $spacing-2xl;
}

.vehicle-card,
.details-card,
.cost-card,
.attachments-card,
.timeline-card {
  margin-bottom: $spacing-2xl;
  @include card-base;
  @include card-hover;
}

.card-title {
  @include flex-gap($spacing-md);
  align-items: center;
  @include heading-primary;
  font-size: $font-size-xl;
  margin: 0 0 $spacing-xl 0;

  > ion-icon {
    font-size: 1.75rem;
    color: $color-primary;
  }
}

.vehicle-card-header {
  @include flex-gap($spacing-sm);
  align-items: center;
  margin-bottom: $spacing-md;

  > h3 {
    color: $color-text-primary;
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    margin: 0;
  }
}

.vehicle-icon {
  font-size: 1.25rem;
  color: $color-primary;
}

.vehicle-info {
  @include flex-gap($spacing-lg);
  justify-content: space-between;
  align-items: center;
  padding: $spacing-md;
  background: $color-bg-surface;
  border-radius: $radius-sm;
  cursor: pointer;
  @include smooth-transition;

  &:hover {
    background: $color-bg-surface-hover;
  }

  > .vehicle-details {
    > h4 {
      color: $color-text-primary;
      font-size: $font-size-base;
      font-weight: $font-weight-semibold;
      margin: 0 0 $spacing-sm 0;
    }
  }
}

.vehicle-meta {
  color: $color-text-tertiary;
  font-size: $font-size-sm;
  margin: 0;
}

.nav-icon {
  color: $color-text-tertiary;
  font-size: 1.25rem;
}

.notes-box {
  @include info-box-base;
  @include flex-gap($spacing-lg);

  > .notes-icon {
    font-size: 1.5rem;
    color: $color-primary;
    flex-shrink: 0;
    margin-top: 2px;
  }

  > .notes-content {
    color: $color-text-secondary;
    line-height: $line-height-relaxed;
    margin: 0;
    white-space: pre-wrap;
    word-break: break-word;
  }
}

.warranty-section {
  margin-bottom: 1.5rem;
}

.section-title {
  @include flex-gap($spacing-sm);
  align-items: center;
  color: $color-text-primary;
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  margin: 0 0 $spacing-xl 0;

  > ion-icon {
    font-size: 1.5rem;
    color: $color-success;
  }
}

.warranty-card {
  border: 1px solid rgba($color-success, 0.3);
}

.modern-photos-section {
  margin-bottom: $spacing-2xl;
}

.modern-section-title {
  @include flex-gap($spacing-lg);
  align-items: center;
  @include heading-primary;
  font-size: $font-size-xl;
  margin: 0 0 $spacing-xl 0;

  > ion-icon {
    font-size: 1.75rem;
    color: $color-primary;
  }
}

.modern-photos-grid {
  @include grid-auto-fit(300px, $spacing-xl);
}

.fuel-consumption-section {
  margin-top: $spacing-2xl;
  animation: fadeInUp $transition-slow;
}

.modern-stat-card {
  position: relative;
  padding: $spacing-2xl;
  border-radius: $radius-xl;
  @include smooth-transition;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-dark;
  }

  > .stat-background {
    position: absolute;
    inset: 0;
    border-radius: $radius-xl;
  }

  > .stat-content-wrapper {
    position: relative;
    z-index: 1;
    @include flex-gap($spacing-lg);
    align-items: flex-start;
  }

  .stat-details {
    flex: 1;
  }
}

.stat-icon-modern {
  width: 56px;
  height: 56px;
  @include flex-center;
  border-radius: $radius-sm;
  flex-shrink: 0;

  > ion-icon {
    font-size: 1.75rem;
    color: $color-text-primary;
  }

  &.blue {
    background: $gradient-blue;
  }

  &.purple {
    background: $gradient-purple;
  }

  &.green {
    background: $gradient-green;
  }

  &.yellow {
    background: $gradient-yellow;
  }
}

.stat-label-modern {
  color: $color-text-secondary;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  margin: 0 0 $spacing-xs 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value-modern {
  color: $color-text-primary;
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  margin: 0;
  line-height: $line-height-tight;

  &.text-sm {
    font-size: $font-size-lg;
  }
}

.gradient-blue {
  background: $gradient-blue !important;
}

.gradient-purple {
  background: $gradient-purple !important;
}

.gradient-green {
  background: $gradient-green !important;
}

.gradient-yellow {
  background: $gradient-yellow !important;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY($spacing-xl);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .modern-stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .modern-photos-grid {
    grid-template-columns: 1fr;
  }
}
</style>
