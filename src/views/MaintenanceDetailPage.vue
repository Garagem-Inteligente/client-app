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
                <h3 class="stat-value-modern">{{ formatCurrency(maintenanceRecord.partsCost) }}</h3>
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
                <h3 class="stat-value-modern">{{ formatCurrency(maintenanceRecord.laborCost) }}</h3>
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
                <h3 class="stat-value-modern text-sm">{{ formatDate(maintenanceRecord.nextDueDate) }}</h3>
              </div>
            </div>
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

          <!-- Main Info Section -->
          <div class="info-section">
            <h4 class="info-section-title">Execução do Serviço</h4>
            <div class="info-grid">
              <div class="info-box">
                <div class="info-box-header">
                  <ion-icon :icon="calendarOutline" class="info-icon blue"></ion-icon>
                  <span class="info-label">Data da Manutenção</span>
                </div>
                <p class="info-value">{{ formatFullDate(maintenanceRecord.date) }}</p>
              </div>

              <div class="info-box">
                <div class="info-box-header">
                  <ion-icon :icon="speedometerOutline" class="info-icon purple"></ion-icon>
                  <span class="info-label">Quilometragem</span>
                </div>
                <p class="info-value">{{ maintenanceRecord.mileage.toLocaleString('pt-BR') }} km</p>
              </div>

              <div v-if="maintenanceRecord.serviceProvider" class="info-box full-width">
                <div class="info-box-header">
                  <ion-icon :icon="businessOutline" class="info-icon green"></ion-icon>
                  <span class="info-label">Prestador de Serviço</span>
                </div>
                <p class="info-value">{{ maintenanceRecord.serviceProvider }}</p>
              </div>
            </div>
          </div>

          <!-- Next Maintenance Section -->
          <div v-if="maintenanceRecord.nextDueDate || maintenanceRecord.nextDueMileage" class="info-section">
            <h4 class="info-section-title">Próxima Manutenção</h4>
            <div class="info-grid">
              <div v-if="maintenanceRecord.nextDueDate" class="info-box">
                <div class="info-box-header">
                  <ion-icon :icon="calendarOutline" class="info-icon yellow"></ion-icon>
                  <span class="info-label">Data Prevista</span>
                </div>
                <p class="info-value">{{ formatFullDate(maintenanceRecord.nextDueDate) }}</p>
                <p class="info-helper">{{ getTimeUntil(maintenanceRecord.nextDueDate) }}</p>
              </div>

              <div v-if="maintenanceRecord.nextDueMileage" class="info-box">
                <div class="info-box-header">
                  <ion-icon :icon="flagOutline" class="info-icon yellow"></ion-icon>
                  <span class="info-label">Quilometragem Prevista</span>
                </div>
                <p class="info-value">{{ maintenanceRecord.nextDueMileage.toLocaleString('pt-BR') }} km</p>
                <p v-if="vehicle" class="info-helper">{{ getKmUntil(maintenanceRecord.nextDueMileage, vehicle.mileage) }}</p>
              </div>
            </div>
          </div>

          <!-- Notes Section -->
          <div v-if="maintenanceRecord.notes" class="info-section">
            <h4 class="info-section-title">Observações</h4>
            <div class="notes-box">
              <ion-icon :icon="documentTextOutline" class="notes-icon"></ion-icon>
              <p class="notes-content">{{ maintenanceRecord.notes }}</p>
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
        <div v-if="maintenanceRecord.beforePhoto || maintenanceRecord.afterPhoto" class="modern-photos-section">
          <h3 class="modern-section-title">
            <ion-icon :icon="cameraOutline"></ion-icon>
            Fotos Antes/Depois
          </h3>

          <div class="modern-photos-grid">
            <!-- Before Photo -->
            <div v-if="maintenanceRecord.beforePhoto" class="modern-photo-card">
              <div class="photo-badge before-badge">
                <ion-icon :icon="cameraOutline"></ion-icon>
                <span>ANTES</span>
              </div>
              
              <div class="photo-container" @click="viewPhoto(maintenanceRecord.beforePhoto, 'before')">
                <img 
                  :src="maintenanceRecord.beforePhoto" 
                  alt="Foto antes da manutenção"
                  class="modern-photo"
                />
                <div class="photo-overlay">
                  <ion-icon :icon="eyeOutline" class="view-icon-large"></ion-icon>
                  <p>Clique para ampliar</p>
                </div>
              </div>

              <div class="photo-actions">
                <button 
                  class="photo-action-btn download-btn"
                  @click.stop="downloadPhoto(maintenanceRecord.beforePhoto, 'antes')"
                >
                  <ion-icon :icon="downloadOutline"></ion-icon>
                  <span>Baixar</span>
                </button>
                <button 
                  class="photo-action-btn share-btn"
                  @click.stop="sharePhoto(maintenanceRecord.beforePhoto, 'antes')"
                >
                  <ion-icon :icon="shareOutline"></ion-icon>
                  <span>Compartilhar</span>
                </button>
              </div>
            </div>

            <!-- After Photo -->
            <div v-if="maintenanceRecord.afterPhoto" class="modern-photo-card">
              <div class="photo-badge after-badge">
                <ion-icon :icon="checkmarkCircleOutline"></ion-icon>
                <span>DEPOIS</span>
              </div>
              
              <div class="photo-container" @click="viewPhoto(maintenanceRecord.afterPhoto, 'after')">
                <img 
                  :src="maintenanceRecord.afterPhoto" 
                  alt="Foto depois da manutenção"
                  class="modern-photo"
                />
                <div class="photo-overlay">
                  <ion-icon :icon="eyeOutline" class="view-icon-large"></ion-icon>
                  <p>Clique para ampliar</p>
                </div>
              </div>

              <div class="photo-actions">
                <button 
                  class="photo-action-btn download-btn"
                  @click.stop="downloadPhoto(maintenanceRecord.afterPhoto, 'depois')"
                >
                  <ion-icon :icon="downloadOutline"></ion-icon>
                  <span>Baixar</span>
                </button>
                <button 
                  class="photo-action-btn share-btn"
                  @click.stop="sharePhoto(maintenanceRecord.afterPhoto, 'depois')"
                >
                  <ion-icon :icon="shareOutline"></ion-icon>
                  <span>Compartilhar</span>
                </button>
              </div>
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
  IonContent,
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
  imageOutline,
  downloadOutline,
  shareOutline,
  checkmarkCircleOutline,
  speedometerOutline,
  businessOutline,
  flagOutline
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

const formatFullDate = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(dateObj)
}

const getTimeUntil = (futureDate: Date | string) => {
  const future = typeof futureDate === 'string' ? new Date(futureDate) : futureDate
  const now = new Date()
  const diffTime = future.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) {
    return `Atrasada há ${Math.abs(diffDays)} dias`
  }
  if (diffDays === 0) {
    return 'Vence hoje'
  }
  if (diffDays === 1) {
    return 'Vence amanhã'
  }
  if (diffDays <= 7) {
    return `Vence em ${diffDays} dias`
  }
  if (diffDays <= 30) {
    const weeks = Math.floor(diffDays / 7)
    return `Vence em ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`
  }
  const months = Math.floor(diffDays / 30)
  return `Vence em ${months} ${months === 1 ? 'mês' : 'meses'}`
}

const getKmUntil = (targetKm: number, currentKm: number) => {
  const diff = targetKm - currentKm
  if (diff < 0) {
    return `${Math.abs(diff).toLocaleString('pt-BR')} km acima`
  }
  return `Faltam ${diff.toLocaleString('pt-BR')} km`
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

const viewPhoto = async (photoUrl: string, type: string) => {
  // Create a modal-like overlay to view the photo in full screen
  const overlay = document.createElement('div')
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.95);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 20px;
    backdrop-filter: blur(10px);
  `
  
  const img = document.createElement('img')
  img.src = photoUrl
  img.alt = `Foto ${type} da manutenção`
  img.style.cssText = `
    max-width: 100%;
    max-height: 80vh;
    object-fit: contain;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  `
  
  const label = document.createElement('div')
  label.textContent = type === 'before' ? '📸 ANTES' : '✅ DEPOIS'
  label.style.cssText = `
    color: white;
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 20px;
    text-transform: uppercase;
    letter-spacing: 2px;
  `
  
  const closeBtn = document.createElement('button')
  closeBtn.innerHTML = '✕'
  closeBtn.style.cssText = `
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(239, 68, 68, 0.9);
    color: white;
    border: none;
    border-radius: 50%;
    width: 48px;
    height: 48px;
    font-size: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    box-shadow: 0 4px 16px rgba(239, 68, 68, 0.4);
  `
  
  closeBtn.onmouseover = () => {
    closeBtn.style.background = 'rgba(220, 38, 38, 0.9)'
    closeBtn.style.transform = 'scale(1.1)'
  }
  
  closeBtn.onmouseout = () => {
    closeBtn.style.background = 'rgba(239, 68, 68, 0.9)'
    closeBtn.style.transform = 'scale(1)'
  }
  
  const closeOverlay = () => {
    overlay.remove()
  }
  
  closeBtn.onclick = closeOverlay
  overlay.onclick = (e) => {
    if (e.target === overlay) closeOverlay()
  }
  
  overlay.appendChild(label)
  overlay.appendChild(img)
  overlay.appendChild(closeBtn)
  document.body.appendChild(overlay)
}

const downloadPhoto = (photoUrl: string, type: string) => {
  const link = document.createElement('a')
  link.href = photoUrl
  link.download = `manutencao-${type}-${Date.now()}.jpg`
  document.body.appendChild(link)
  link.click()
  link.remove()
}

const sharePhoto = async (photoUrl: string, type: string) => {
  try {
    // Check if Web Share API is available
    if (navigator.share) {
      // Convert base64 to blob
      const response = await fetch(photoUrl)
      const blob = await response.blob()
      const file = new File([blob], `manutencao-${type}.jpg`, { type: 'image/jpeg' })
      
      await navigator.share({
        title: `Manutenção - Foto ${type}`,
        text: `Foto ${type} da manutenção`,
        files: [file]
      })
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(photoUrl)
      alert('Link da foto copiado para a área de transferência!')
    }
  } catch (error) {
    console.error('Error sharing photo:', error)
    // Fallback: download
    downloadPhoto(photoUrl, type)
  }
}

const viewAttachment = async (attachment: { name: string; data: string; type: string; size: number }) => {
  // Open attachment in new tab or trigger download
  if (attachment.type.includes('image')) {
    viewPhoto(attachment.data, attachment.name)
  } else {
    // Download PDF or other files
    const link = document.createElement('a')
    link.href = attachment.data
    link.download = attachment.name
    document.body.appendChild(link)
    link.click()
    link.remove()
  }
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
  --background: var(--ion-background-color);
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
  background: linear-gradient(135deg, rgba(31, 41, 55, 0.95) 0%, rgba(17, 24, 39, 1) 100%);
  border-radius: 24px;
  padding: 28px;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.maintenance-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, transparent 100%);
  pointer-events: none;
}

.header-content {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  position: relative;
  z-index: 1;
}

.type-icon {
  font-size: 4rem;
  line-height: 1;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
}

.header-info {
  flex: 1;
}

.maintenance-title {
  color: white;
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0 0 12px 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}

.maintenance-description {
  color: #d1d5db;
  font-size: 1.125rem;
  margin: 0 0 16px 0;
  line-height: 1.6;
}

.maintenance-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* Modern Stats Grid */
.modern-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
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

.gradient-blue {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.1) 100%);
}

.gradient-purple {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(147, 51, 234, 0.1) 100%);
}

.gradient-green {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.1) 100%);
}

.gradient-yellow {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(245, 158, 11, 0.1) 100%);
}

.stat-content-wrapper {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon-modern {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  flex-shrink: 0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.stat-icon-modern.blue {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.stat-icon-modern.purple {
  background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
  color: white;
}

.stat-icon-modern.green {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.stat-icon-modern.yellow {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: white;
}

.stat-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label-modern {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value-modern {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.stat-value-modern.text-sm {
  font-size: 1.125rem;
}

/* Cards */
.vehicle-card,
.details-card,
.cost-card,
.attachments-card,
.timeline-card {
  margin-bottom: 24px;
  background: linear-gradient(135deg, rgba(31, 41, 55, 0.9) 0%, rgba(17, 24, 39, 0.95) 100%);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.vehicle-card:hover,
.details-card:hover,
.cost-card:hover,
.attachments-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  border-color: rgba(59, 130, 246, 0.2);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 20px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.card-title ion-icon {
  font-size: 1.75rem;
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

/* Details Card - New Modern Layout */
.info-section {
  margin-bottom: 28px;
}

.info-section:last-child {
  margin-bottom: 0;
}

.info-section-title {
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #3b82f6;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid rgba(59, 130, 246, 0.2);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.info-box {
  background: linear-gradient(135deg, rgba(31, 41, 55, 0.6) 0%, rgba(17, 24, 39, 0.8) 100%);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.info-box:hover {
  border-color: rgba(59, 130, 246, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.info-box.full-width {
  grid-column: 1 / -1;
}

.info-box-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.info-icon {
  font-size: 1.5rem;
  padding: 8px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
}

.info-icon.blue {
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}

.info-icon.purple {
  color: #a855f7;
  background: rgba(168, 85, 247, 0.1);
}

.info-icon.green {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.info-icon.yellow {
  color: #fbbf24;
  background: rgba(251, 191, 36, 0.1);
}

.info-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.info-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  line-height: 1.4;
}

.info-helper {
  font-size: 0.813rem;
  color: #6b7280;
  margin: 6px 0 0 0;
  font-weight: 500;
}

/* Notes Box */
.notes-box {
  background: linear-gradient(135deg, rgba(31, 41, 55, 0.6) 0%, rgba(17, 24, 39, 0.8) 100%);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  gap: 16px;
}

.notes-icon {
  font-size: 1.5rem;
  color: #3b82f6;
  flex-shrink: 0;
  margin-top: 2px;
}

.notes-content {
  color: #e5e7eb;
  line-height: 1.7;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
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

/* Modern Photos Section */
.modern-photos-section {
  margin-bottom: 24px;
}

.modern-section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 20px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.modern-section-title ion-icon {
  font-size: 1.75rem;
  color: #3b82f6;
}

.modern-photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.modern-photo-card {
  position: relative;
  background: linear-gradient(135deg, rgba(31, 41, 55, 0.9) 0%, rgba(17, 24, 39, 0.95) 100%);
  border-radius: 24px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  overflow: hidden;
  transition: all 0.3s ease;
}

.modern-photo-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  border-color: rgba(59, 130, 246, 0.3);
}

.photo-badge {
  position: absolute;
  top: 32px;
  right: 32px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  z-index: 2;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.before-badge {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.9) 100%);
  color: white;
  border: 1px solid rgba(239, 68, 68, 0.5);
}

.after-badge {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.9) 0%, rgba(5, 150, 105, 0.9) 100%);
  color: white;
  border: 1px solid rgba(16, 185, 129, 0.5);
}

.photo-container {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 16px;
  cursor: pointer;
  background: #000;
  aspect-ratio: 4/3;
}

.modern-photo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.photo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.photo-container:hover .photo-overlay {
  opacity: 1;
}

.photo-container:hover .modern-photo {
  transform: scale(1.05);
}

.view-icon-large {
  font-size: 3rem;
  color: white;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5));
}

.photo-overlay p {
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.photo-actions {
  display: flex;
  gap: 12px;
}

.photo-action-btn {
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

.download-btn {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.1) 100%);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.download-btn:hover {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(37, 99, 235, 0.2) 100%);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
  transform: translateY(-2px);
}

.share-btn {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.1) 100%);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.share-btn:hover {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(5, 150, 105, 0.2) 100%);
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
  transform: translateY(-2px);
}

.photo-action-btn ion-icon {
  font-size: 1.125rem;
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

