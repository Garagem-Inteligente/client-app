<template>
  <ion-page>
    <ModernHeader
      title="Detalhes da Manutenção"
      :show-back-button="true"
      back-path="/tabs/maintenance"
      :secondary-actions="[
        { icon: createOutline, handler: handleEdit },
        { icon: trashOutline, handler: handleDelete }
      ]"
    />

    <ion-content :fullscreen="true" class="app-content detail-content">
      <!-- Background layers -->
      <div class="background-gradient"></div>
      <div class="background-pattern"></div>
      
      <div class="page-content-wrapper">
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
        <div class="stats-grid">
          <!-- Custo Total -->
          <div class="stat-card blue-gradient">
            <div class="stat-icon-wrapper blue">
              <ion-icon :icon="cashOutline"></ion-icon>
            </div>
            <div class="stat-value">
              {{ formatCurrency(maintenanceRecord.cost) }}
            </div>
            <p class="stat-label">Custo Total</p>
          </div>

          <!-- Peças -->
          <div v-if="maintenanceRecord.partsCost" class="stat-card purple-gradient">
            <div class="stat-icon-wrapper purple">
              <ion-icon :icon="cubeOutline"></ion-icon>
            </div>
            <div class="stat-value">
              {{ formatCurrency(maintenanceRecord.partsCost) }}
            </div>
            <p class="stat-label">Peças</p>
          </div>

          <!-- Mão de Obra -->
          <div v-if="maintenanceRecord.laborCost" class="stat-card green-gradient">
            <div class="stat-icon-wrapper green">
              <ion-icon :icon="constructOutline"></ion-icon>
            </div>
            <div class="stat-value">
              {{ formatCurrency(maintenanceRecord.laborCost) }}
            </div>
            <p class="stat-label">Mão de Obra</p>
          </div>

          <!-- Próxima Manutenção -->
          <div v-if="maintenanceRecord.nextDueDate" class="stat-card yellow-gradient">
            <div class="stat-icon-wrapper yellow">
              <ion-icon :icon="calendarOutline"></ion-icon>
            </div>
            <div class="stat-value text-sm">
              {{ formatDate(maintenanceRecord.nextDueDate) }}
            </div>
            <p class="stat-label">Próxima Manutenção</p>
          </div>
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

          <div class="details-grid">
            <!-- Data -->
            <div class="detail-item">
              <span class="detail-label">📅 Data da Manutenção</span>
              <span class="detail-value">{{ formatDate(maintenanceRecord.date) }}</span>
            </div>

            <!-- Quilometragem -->
            <div class="detail-item">
              <span class="detail-label">🛣️ Quilometragem</span>
              <span class="detail-value">{{ maintenanceRecord.mileage.toLocaleString('pt-BR') }} km</span>
            </div>

            <!-- Próxima Data -->
            <div v-if="maintenanceRecord.nextDueDate" class="detail-item">
              <span class="detail-label">📆 Próxima Data Prevista</span>
              <span class="detail-value">{{ formatDate(maintenanceRecord.nextDueDate) }}</span>
            </div>

            <!-- Próxima Quilometragem -->
            <div v-if="maintenanceRecord.nextDueMileage" class="detail-item">
              <span class="detail-label">🏁 Próxima Quilometragem</span>
              <span class="detail-value">{{ maintenanceRecord.nextDueMileage.toLocaleString('pt-BR') }} km</span>
            </div>

            <!-- Prestador de Serviço -->
            <div v-if="maintenanceRecord.serviceProvider" class="detail-item full-width">
              <span class="detail-label">🏢 Prestador de Serviço</span>
              <span class="detail-value">{{ maintenanceRecord.serviceProvider }}</span>
            </div>

            <!-- Observações -->
            <div v-if="maintenanceRecord.notes" class="detail-item full-width">
              <span class="detail-label">📝 Observações</span>
              <p class="detail-notes">{{ maintenanceRecord.notes }}</p>
            </div>
          </div>
        </ACard>

        <!-- Cost Breakdown -->
        <ACard v-if="maintenanceRecord.partsCost || maintenanceRecord.laborCost" class="cost-card">
          <h3 class="card-title">
            <ion-icon :icon="calculatorOutline"></ion-icon>
            Detalhamento de Custos
          </h3>

          <div class="cost-breakdown">
            <div v-if="maintenanceRecord.partsCost" class="cost-item">
              <div class="cost-label">
                <ion-icon :icon="cubeOutline"></ion-icon>
                <span>Peças e Materiais</span>
              </div>
              <span class="cost-value">{{ formatCurrency(maintenanceRecord.partsCost) }}</span>
            </div>

            <div v-if="maintenanceRecord.laborCost" class="cost-item">
              <div class="cost-label">
                <ion-icon :icon="constructOutline"></ion-icon>
                <span>Mão de Obra</span>
              </div>
              <span class="cost-value">{{ formatCurrency(maintenanceRecord.laborCost) }}</span>
            </div>

            <div class="cost-separator"></div>

            <div class="cost-item total">
              <div class="cost-label">
                <strong>Total</strong>
              </div>
              <span class="cost-value">{{ formatCurrency(maintenanceRecord.cost) }}</span>
            </div>
          </div>
        </ACard>

        <!-- Warranty Info -->
        <div v-if="maintenanceRecord.warrantyParts || maintenanceRecord.warrantyLabor" class="warranty-section">
          <h3 class="section-title">
            <ion-icon :icon="shieldCheckmarkOutline"></ion-icon>
            Garantias
          </h3>

          <div class="warranty-cards">
            <ACard v-if="maintenanceRecord.warrantyParts" class="warranty-card">
              <div class="warranty-header">
                <ion-icon :icon="cubeOutline"></ion-icon>
                <h4>Garantia das Peças</h4>
              </div>
              <p class="warranty-months">{{ maintenanceRecord.warrantyParts.months }} meses</p>
              <p class="warranty-expiry">
                Válida até: <strong>{{ formatDate(maintenanceRecord.warrantyParts.expiryDate) }}</strong>
              </p>
              <ABadge :variant="isWarrantyValid(maintenanceRecord.warrantyParts.expiryDate) ? 'success' : 'danger'">
                {{ isWarrantyValid(maintenanceRecord.warrantyParts.expiryDate) ? '✅ Ativa' : '❌ Expirada' }}
              </ABadge>
            </ACard>

            <ACard v-if="maintenanceRecord.warrantyLabor" class="warranty-card">
              <div class="warranty-header">
                <ion-icon :icon="constructOutline"></ion-icon>
                <h4>Garantia da Mão de Obra</h4>
              </div>
              <p class="warranty-months">{{ maintenanceRecord.warrantyLabor.months }} meses</p>
              <p class="warranty-expiry">
                Válida até: <strong>{{ formatDate(maintenanceRecord.warrantyLabor.expiryDate) }}</strong>
              </p>
              <ABadge :variant="isWarrantyValid(maintenanceRecord.warrantyLabor.expiryDate) ? 'success' : 'danger'">
                {{ isWarrantyValid(maintenanceRecord.warrantyLabor.expiryDate) ? '✅ Ativa' : '❌ Expirada' }}
              </ABadge>
            </ACard>
          </div>
        </div>

        <!-- Photos Before/After -->
        <div v-if="maintenanceRecord.beforePhoto || maintenanceRecord.afterPhoto" class="photos-section">
          <h3 class="section-title">
            <ion-icon :icon="cameraOutline"></ion-icon>
            Fotos Antes/Depois
          </h3>

          <div class="photos-grid">
            <div v-if="maintenanceRecord.beforePhoto" class="photo-card">
              <div class="photo-header">
                <span class="photo-label">📸 ANTES</span>
              </div>
              <img 
                :src="maintenanceRecord.beforePhoto" 
                alt="Foto antes da manutenção"
                class="maintenance-photo"
                @click="viewPhoto(maintenanceRecord.beforePhoto)"
              />
            </div>

            <div v-if="maintenanceRecord.afterPhoto" class="photo-card">
              <div class="photo-header">
                <span class="photo-label">✅ DEPOIS</span>
              </div>
              <img 
                :src="maintenanceRecord.afterPhoto" 
                alt="Foto depois da manutenção"
                class="maintenance-photo"
                @click="viewPhoto(maintenanceRecord.afterPhoto)"
              />
            </div>
          </div>
        </div>

        <!-- Attachments -->
        <ACard v-if="maintenanceRecord.attachments && maintenanceRecord.attachments.length > 0" class="attachments-card">
          <h3 class="card-title">
            <ion-icon :icon="documentTextOutline"></ion-icon>
            Anexos ({{ maintenanceRecord.attachments.length }})
          </h3>

          <div class="attachments-list">
            <div 
              v-for="(attachment, index) in maintenanceRecord.attachments"
              :key="index"
              class="attachment-item"
              @click="viewAttachment(attachment)"
            >
              <ion-icon :icon="getAttachmentIcon(attachment.type)" class="attachment-icon"></ion-icon>
              <div class="attachment-info">
                <p class="attachment-name">{{ attachment.name }}</p>
                <p class="attachment-meta">
                  {{ formatFileSize(attachment.size) }} • {{ formatDate(attachment.uploadedAt) }}
                </p>
              </div>
              <ion-icon :icon="eyeOutline" class="view-icon"></ion-icon>
            </div>
          </div>
        </ACard>

        <!-- Timeline/History -->
        <ACard class="timeline-card">
          <h3 class="card-title">
            <ion-icon :icon="timeOutline"></ion-icon>
            Histórico
          </h3>

          <div class="timeline">
            <div class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <p class="timeline-title">Manutenção registrada</p>
                <p class="timeline-date">{{ formatDateTime(maintenanceRecord.createdAt) }}</p>
              </div>
            </div>
          </div>
        </ACard>
      </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonBackButton,
  IonIcon,
  IonSpinner,
  alertController
} from '@ionic/vue'
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
  eyeOutline,
  timeOutline,
  documentOutline,
  imageOutline
} from 'ionicons/icons'
import { useVehiclesStore } from '@/stores/vehicles'
import type { MaintenanceType } from '@/stores/vehicles'
import { MAINTENANCE_TYPE_LABELS, MAINTENANCE_TYPE_ICONS } from '@/constants/vehicles'
import ModernHeader from '@/components/organisms/ModernHeader.vue'
import ABadge from '@/components/atoms/ABadge.vue'
import ACard from '@/components/atoms/ACard.vue'

const route = useRoute()
const router = useRouter()
const vehiclesStore = useVehiclesStore()

const maintenanceId = route.params.id as string

const maintenanceRecord = computed(() => {
  return vehiclesStore.maintenanceRecords.find(r => r.id === maintenanceId)
})

const vehicle = computed(() => {
  if (!maintenanceRecord.value) return null
  return vehiclesStore.getVehicleById(maintenanceRecord.value.vehicleId)
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}

const formatDateTime = (date: Date) => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const getMaintenanceTypeLabel = (type: string) => {
  return MAINTENANCE_TYPE_LABELS[type as MaintenanceType] || type
}

const getMaintenanceIcon = (type: string) => {
  return MAINTENANCE_TYPE_ICONS[type as MaintenanceType] || '🔧'
}

const isWarrantyValid = (expiryDate: Date) => {
  return new Date(expiryDate) > new Date()
}

const getAttachmentIcon = (type: string) => {
  if (type.includes('image')) return imageOutline
  if (type.includes('pdf')) return documentOutline
  return documentTextOutline
}

const goToVehicle = () => {
  if (vehicle.value) {
    router.push(`/tabs/vehicle/${vehicle.value.id}`)
  }
}

const handleEdit = () => {
  router.push(`/tabs/maintenance/${maintenanceId}/edit`)
}

const handleDelete = async () => {
  const alert = await alertController.create({
    header: 'Confirmar Exclusão',
    message: 'Tem certeza que deseja excluir esta manutenção? Esta ação não pode ser desfeita.',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Excluir',
        role: 'destructive',
        handler: async () => {
          const success = await vehiclesStore.deleteMaintenanceRecord(maintenanceId)
          if (success) {
            router.back()
          }
        }
      }
    ]
  })

  await alert.present()
}

const viewPhoto = async (photoUrl: string) => {
  // TODO: Open photo in full screen modal
  window.open(photoUrl, '_blank')
}

const viewAttachment = async (attachment: any) => {
  // TODO: Open attachment in modal or download
  window.open(attachment.data, '_blank')
}

onMounted(async () => {
  // Ensure data is loaded
  if (vehiclesStore.maintenanceRecords.length === 0) {
    await vehiclesStore.fetchMaintenanceRecords()
  }
  if (vehiclesStore.vehicles.length === 0) {
    await vehiclesStore.fetchVehicles()
  }

  // Check if maintenance exists
  if (!maintenanceRecord.value) {
    router.push('/tabs/maintenance')
  }
})
</script>

<style scoped>
/* Dark Theme Base */
.detail-content {
  --background: #111827;
}

.detail-toolbar {
  --background: #1f2937;
  --color: white;
  --border-color: #374151;
}

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 1rem;
}

.loading-text {
  color: #9ca3af;
  font-size: 0.875rem;
}

/* Container */
.detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

/* Header */
.maintenance-header {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid #374151;
}

.header-content {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.type-icon {
  font-size: 3rem;
  line-height: 1;
}

.header-info {
  flex: 1;
}

.maintenance-title {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.maintenance-description {
  color: #9ca3af;
  font-size: 1rem;
  margin: 0 0 0.75rem 0;
}

.maintenance-badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  padding: 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.blue-gradient {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.05) 100%);
}

.purple-gradient {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(147, 51, 234, 0.05) 100%);
}

.green-gradient {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.05) 100%);
}

.yellow-gradient {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.05) 100%);
}

.stat-icon-wrapper {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
  font-size: 1.25rem;
}

.stat-icon-wrapper.blue {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}

.stat-icon-wrapper.purple {
  background: rgba(168, 85, 247, 0.2);
  color: #a855f7;
}

.stat-icon-wrapper.green {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.stat-icon-wrapper.yellow {
  background: rgba(251, 191, 36, 0.2);
  color: #fbbf24;
}

.stat-value {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.stat-value.text-sm {
  font-size: 1rem;
}

.stat-label {
  color: #9ca3af;
  font-size: 0.75rem;
  margin: 0;
}

/* Cards */
.vehicle-card,
.details-card,
.cost-card,
.attachments-card,
.timeline-card {
  margin-bottom: 1.5rem;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
}

.card-title ion-icon {
  font-size: 1.5rem;
  color: #3b82f6;
}

/* Vehicle Card */
.vehicle-card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.vehicle-card-header h3 {
  color: white;
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.vehicle-icon {
  font-size: 1.25rem;
  color: #3b82f6;
}

.vehicle-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: #1f2937;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
}

.vehicle-info:hover {
  background: #374151;
}

.vehicle-details h4 {
  color: white;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
}

.vehicle-meta {
  color: #9ca3af;
  font-size: 0.875rem;
  margin: 0;
}

.nav-icon {
  color: #9ca3af;
  font-size: 1.25rem;
}

/* Details Grid */
.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-item.full-width {
  grid-column: 1 / -1;
}

.detail-label {
  color: #9ca3af;
  font-size: 0.875rem;
}

.detail-value {
  color: white;
  font-weight: 500;
}

.detail-notes {
  color: white;
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
}

/* Cost Breakdown */
.cost-breakdown {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.cost-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #1f2937;
  border-radius: 0.5rem;
}

.cost-item.total {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.05) 100%);
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.cost-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #9ca3af;
  font-size: 0.875rem;
}

.cost-label ion-icon {
  font-size: 1.25rem;
}

.cost-value {
  color: white;
  font-weight: 600;
  font-size: 1rem;
}

.cost-separator {
  height: 1px;
  background: #374151;
}

/* Warranty Section */
.warranty-section {
  margin-bottom: 1.5rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
}

.section-title ion-icon {
  font-size: 1.5rem;
  color: #10b981;
}

.warranty-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.warranty-card {
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.warranty-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.warranty-header ion-icon {
  font-size: 1.5rem;
  color: #10b981;
}

.warranty-header h4 {
  color: white;
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.warranty-months {
  color: #3b82f6;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.warranty-expiry {
  color: #9ca3af;
  font-size: 0.875rem;
  margin: 0 0 0.75rem 0;
}

/* Photos Section */
.photos-section {
  margin-bottom: 1.5rem;
}

.photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.photo-card {
  border: 1px solid #374151;
  border-radius: 0.75rem;
  overflow: hidden;
  background: #1f2937;
}

.photo-header {
  padding: 0.75rem;
  background: #111827;
}

.photo-label {
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
}

.maintenance-photo {
  width: 100%;
  height: 250px;
  object-fit: contain;
  background: #000;
  cursor: pointer;
  transition: transform 0.2s;
}

.maintenance-photo:hover {
  transform: scale(1.02);
}

/* Attachments List */
.attachments-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #1f2937;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
}

.attachment-item:hover {
  background: #374151;
}

.attachment-icon {
  font-size: 2rem;
  color: #3b82f6;
}

.attachment-info {
  flex: 1;
  min-width: 0;
}

.attachment-name {
  color: white;
  font-weight: 500;
  margin: 0 0 0.25rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.attachment-meta {
  color: #9ca3af;
  font-size: 0.75rem;
  margin: 0;
}

.view-icon {
  color: #9ca3af;
  font-size: 1.25rem;
}

/* Timeline */
.timeline {
  position: relative;
  padding-left: 2rem;
}

.timeline-item {
  position: relative;
  padding-bottom: 1.5rem;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-dot {
  position: absolute;
  left: -2rem;
  top: 0.25rem;
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background: #3b82f6;
  border: 2px solid #1f2937;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: -1.625rem;
  top: 1rem;
  bottom: -0.5rem;
  width: 2px;
  background: #374151;
}

.timeline-item:last-child::before {
  display: none;
}

.timeline-content {
  padding-left: 0.5rem;
}

.timeline-title {
  color: white;
  font-weight: 500;
  margin: 0 0 0.25rem 0;
}

.timeline-date {
  color: #9ca3af;
  font-size: 0.875rem;
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .warranty-cards,
  .photos-grid {
    grid-template-columns: 1fr;
  }
}
</style>

