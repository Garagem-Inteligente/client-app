<template>
  <ion-page>
    <ModernHeader
      title="Detalhes do Veículo"
      :show-back-button="true"
      back-path="/tabs/vehicles"
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
        <div v-if="!vehicle" class="loading-container">
        <ion-spinner name="crescent"></ion-spinner>
        <p class="loading-text">Carregando informações do veículo...</p>
      </div>

      <div v-else class="detail-container">
        <!-- Vehicle Header -->
        <div class="vehicle-header">
          <div class="vehicle-header-content">
            <h1 class="vehicle-title">
              {{ vehicle.make }} {{ vehicle.model }}
            </h1>
            <div class="vehicle-badges">
              <ABadge :variant="getFuelTypeBadgeVariant(vehicle.fuelType)">
                {{ getFuelTypeLabel(vehicle.fuelType) }}
              </ABadge>
              <span class="vehicle-info-text">{{ vehicle.year }}</span>
              <span class="vehicle-info-separator">•</span>
              <span class="vehicle-info-text">{{ vehicle.plate }}</span>
              <template v-if="vehicle.color">
                <span class="vehicle-info-separator">•</span>
                <span class="vehicle-info-text">{{ vehicle.color }}</span>
              </template>
            </div>
          </div>

          <div class="header-actions">
            <AButton size="small" @click="router.push(`/tabs/maintenance?vehicleId=${vehicleId}`)">
              <template v-slot:start>
<ion-icon :icon="addCircleOutline" ></ion-icon>
</template>
              Nova Manutenção
            </AButton>
          </div>
        </div>

        <!-- Modern Filter Pills Tabs -->
        <div class="tabs-container">
          <div class="filter-pills-wrapper">
            <div class="filter-pills">
              <button 
                v-for="tab in tabs" 
                :key="tab.id"
                class="filter-pill"
                :class="{ active: activeTab === tab.id, disabled: tab.disabled }"
                @click="!tab.disabled && handleTabChange(tab.id)"
                :disabled="tab.disabled"
              >
                <span class="pill-icon">{{ tab.icon }}</span>
                <span class="pill-label">{{ tab.label }}</span>
                <span v-if="tab.badge" class="pill-count">{{ tab.badge }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Tab Content -->
        <div class="tab-content">
          <!-- TAB: Informações -->
          <div v-if="activeTab === 'info'" class="tab-panel">
            <!-- Stats Cards -->
            <div class="stats-grid">
              <!-- Quilometragem -->
              <div class="stat-card blue-gradient">
                <div class="stat-icon-wrapper blue">
                  <ion-icon :icon="speedometerOutline"></ion-icon>
                </div>
                <div class="stat-value">
                  {{ vehicle.mileage.toLocaleString('pt-BR') }} km
                </div>
                <p class="stat-label">Quilometragem atual</p>
              </div>

              <!-- Total Manutenções -->
              <div class="stat-card green-gradient">
                <div class="stat-icon-wrapper green">
                  <ion-icon :icon="checkmarkDoneOutline"></ion-icon>
                </div>
                <div class="stat-value">
                  {{ maintenanceHistory.length }}
                </div>
                <p class="stat-label">Manutenções realizadas</p>
              </div>

              <!-- Custo Total -->
              <div class="stat-card purple-gradient">
                <div class="stat-icon-wrapper purple">
                  <ion-icon :icon="cashOutline"></ion-icon>
                </div>
                <div class="stat-value">
                  {{ formatCurrency(totalMaintenanceCost) }}
                </div>
                <p class="stat-label">Investido em manutenções</p>
              </div>

              <!-- Próxima Manutenção -->
              <div class="stat-card yellow-gradient">
                <div class="stat-icon-wrapper yellow">
                  <ion-icon :icon="timeOutline"></ion-icon>
                </div>
                <div class="stat-value">
                  {{ nextMaintenanceDate ? daysUntilNext(nextMaintenanceDate) + ' dias' : 'N/A' }}
                </div>
                <p class="stat-label">Próxima manutenção</p>
              </div>
            </div>

            <!-- Main Info Grid: Informações à esquerda, Seguro e Próximas Manutenções à direita -->
            <div class="main-info-grid">
              <!-- Left Column: Informações do Veículo -->
              <div class="vehicle-info-column">
                <ACard class="vehicle-info-card">
                  <template v-slot:title>
                    <div class="card-title-with-icon">
                      <ion-icon :icon="carSportOutline"></ion-icon>
                      <span>Informações do Veículo</span>
                    </div>
                  </template>
                  
                  <div class="vehicle-info-content">
                    <!-- Seção Principal: Identificação -->
                    <div class="info-section">
                      <div class="section-header">
                        <ion-icon :icon="informationCircleOutline" class="section-icon"></ion-icon>
                        <h3 class="section-title">Identificação</h3>
                      </div>
                      <div class="info-grid">
                        <div class="info-item-modern">
                          <div class="info-icon-wrapper">
                            <ion-icon :icon="businessOutline"></ion-icon>
                          </div>
                          <div class="info-content">
                            <span class="info-label">Marca</span>
                            <span class="info-value">{{ vehicle.make }}</span>
                          </div>
                        </div>
                        <div class="info-item-modern">
                          <div class="info-icon-wrapper">
                            <ion-icon :icon="carOutline"></ion-icon>
                          </div>
                          <div class="info-content">
                            <span class="info-label">Modelo</span>
                            <span class="info-value">{{ vehicle.model }}</span>
                          </div>
                        </div>
                        <div class="info-item-modern">
                          <div class="info-icon-wrapper">
                            <ion-icon :icon="calendarOutline"></ion-icon>
                          </div>
                          <div class="info-content">
                            <span class="info-label">Ano</span>
                            <span class="info-value">{{ vehicle.year }}</span>
                          </div>
                        </div>
                        <div class="info-item-modern">
                          <div class="info-icon-wrapper">
                            <ion-icon :icon="documentTextOutline"></ion-icon>
                          </div>
                          <div class="info-content">
                            <span class="info-label">Placa</span>
                            <span class="info-value">{{ vehicle.plate }}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Seção: Características -->
                    <div class="info-section">
                      <div class="section-header">
                        <ion-icon :icon="settingsOutline" class="section-icon"></ion-icon>
                        <h3 class="section-title">Características</h3>
                      </div>
                      <div class="info-grid">
                        <div class="info-item-modern" v-if="vehicle.color">
                          <div class="info-icon-wrapper">
                            <ion-icon :icon="colorPaletteOutline"></ion-icon>
                          </div>
                          <div class="info-content">
                            <span class="info-label">Cor</span>
                            <span class="info-value">{{ vehicle.color }}</span>
                          </div>
                        </div>
                        <div class="info-item-modern">
                          <div class="info-icon-wrapper">
                            <ion-icon :icon="speedometerOutline"></ion-icon>
                          </div>
                          <div class="info-content">
                            <span class="info-label">Quilometragem</span>
                            <span class="info-value">{{ vehicle.mileage.toLocaleString('pt-BR') }} km</span>
                          </div>
                        </div>
                        <div class="info-item-modern">
                          <div class="info-icon-wrapper">
                            <ion-icon :icon="waterOutline"></ion-icon>
                          </div>
                          <div class="info-content">
                            <span class="info-label">Combustível</span>
                            <span class="info-value">{{ getFuelTypeLabel(vehicle.fuelType) }}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Seção: Manutenção -->
                    <div class="info-section">
                      <div class="section-header">
                        <ion-icon :icon="constructOutline" class="section-icon"></ion-icon>
                        <h3 class="section-title">Histórico</h3>
                      </div>
                      <div class="info-grid">
                        <div class="info-item-modern highlight">
                          <div class="info-icon-wrapper highlight">
                            <ion-icon :icon="timeOutline"></ion-icon>
                          </div>
                          <div class="info-content">
                            <span class="info-label">Última Manutenção</span>
                            <span class="info-value">
                              {{ lastMaintenanceDate ? formatDate(lastMaintenanceDate) : 'Nenhuma' }}
                            </span>
                          </div>
                        </div>
                        <div class="info-item-modern highlight">
                          <div class="info-icon-wrapper highlight">
                            <ion-icon :icon="cashOutline"></ion-icon>
                          </div>
                          <div class="info-content">
                            <span class="info-label">Custo Médio</span>
                            <span class="info-value">
                              {{ formatCurrency(averageMaintenanceCost) }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ACard>
              </div>

              <!-- Right Column: Seguro e Próximas Manutenções -->
              <div class="quick-access-column">
                <!-- Seguro Card Redesenhado -->
                <ACard class="insurance-modern-card">
                  <template v-slot:title>
                    <div class="card-title-with-icon">
                      <ion-icon :icon="shieldCheckmarkOutline" class="title-icon"></ion-icon>
                      <span>Seguro</span>
                    </div>
                  </template>

                  <div v-if="vehicle.insuranceCompany" class="insurance-modern-content">
                    <!-- Status Badge -->
                    <div class="insurance-status-badge" :class="{
                      'status-active': !isInsuranceExpired && !isInsuranceExpiringSoon,
                      'status-expiring': isInsuranceExpiringSoon,
                      'status-expired': isInsuranceExpired
                    }">
                      <ion-icon 
                        :icon="isInsuranceExpired ? closeCircleOutline : (isInsuranceExpiringSoon ? warningOutline : shieldCheckmarkOutline)"
                        class="status-icon"
                      ></ion-icon>
                      <span class="status-text">
                        {{ isInsuranceExpired ? 'Vencido' : (isInsuranceExpiringSoon ? 'Vence em breve' : 'Ativo') }}
                      </span>
                    </div>

                    <!-- Company Name -->
                    <div class="insurance-company-name">
                      {{ vehicle.insuranceCompany }}
                    </div>

                    <!-- Expiry Info -->
                    <div class="insurance-expiry-info">
                      <div class="expiry-label">
                        <ion-icon :icon="calendarOutline"></ion-icon>
                        <span>{{ isInsuranceExpired ? 'Venceu em' : 'Vence em' }}</span>
                      </div>
                      <div class="expiry-date">
                        {{ vehicle.insuranceExpiryDate ? formatDate(vehicle.insuranceExpiryDate) : 'N/A' }}
                      </div>
                    </div>

                    <!-- Action Button -->
                    <AButton 
                      variant="outline" 
                      size="small" 
                      class="insurance-action-button"
                      @click="activeTab = 'insurance'"
                    >
                      Ver Detalhes
                    </AButton>
                  </div>

                  <div v-else class="insurance-empty-state">
                    <ion-icon :icon="shieldCheckmarkOutline" class="empty-icon"></ion-icon>
                    <p class="empty-title">Sem dados de seguro</p>
                    <p class="empty-subtitle">Adicione as informações do seu seguro para acompanhar a validade</p>
                    <AButton 
                      size="small"
                      @click="activeTab = 'insurance'"
                    >
                      Adicionar Seguro
                    </AButton>
                  </div>
                </ACard>

                <!-- Próximas Manutenções Card -->
                <ACard class="upcoming-maintenance-card">
                  <template v-slot:title>
                    <div class="card-title-with-icon">
                      <ion-icon :icon="timeOutline" class="title-icon"></ion-icon>
                      <span>Próximas Manutenções</span>
                    </div>
                  </template>

                  <div v-if="upcomingMaintenance.length === 0" class="upcoming-empty-state">
                    <ion-icon :icon="checkmarkCircleOutline" class="empty-icon"></ion-icon>
                    <p class="empty-title">Tudo em dia!</p>
                    <p class="empty-subtitle">Nenhuma manutenção agendada no momento</p>
                    <AButton 
                      size="small"
                      @click="router.push(`/tabs/maintenance/new?vehicleId=${vehicleId}`)"
                    >
                      Agendar Manutenção
                    </AButton>
                  </div>

                  <div v-else class="upcoming-maintenance-list">
                    <div
                      v-for="maintenance in upcomingMaintenance.slice(0, 3)"
                      :key="maintenance.id"
                      class="upcoming-maintenance-item"
                      @click="router.push(`/tabs/maintenance/${maintenance.id}`)"
                    >
                      <div class="maintenance-type">
                        <ion-icon :icon="construct" class="type-icon"></ion-icon>
                        <span class="type-label">{{ getMaintenanceTypeLabel(maintenance.type) }}</span>
                      </div>
                      
                      <div class="maintenance-due-info">
                        <div class="due-date">
                          <ion-icon :icon="calendarOutline"></ion-icon>
                          <span>{{ formatDate(maintenance.nextDueDate!) }}</span>
                        </div>
                        <ABadge 
                          :variant="daysUntilNext(maintenance.nextDueDate!) <= 7 ? 'error' : 'warning'" 
                          size="small"
                        >
                          {{ daysUntilNext(maintenance.nextDueDate!) }} dias
                        </ABadge>
                      </div>

                      <div v-if="maintenance.nextDueMileage" class="maintenance-mileage-info">
                        <ion-icon :icon="speedometerOutline"></ion-icon>
                        <span>{{ maintenance.nextDueMileage.toLocaleString('pt-BR') }} km</span>
                      </div>
                    </div>

                    <AButton 
                      v-if="upcomingMaintenance.length > 3"
                      variant="outline" 
                      size="small" 
                      class="view-all-button"
                      @click="activeTab = 'maintenance'"
                    >
                      Ver todas ({{ upcomingMaintenance.length }})
                    </AButton>
                  </div>
                </ACard>
              </div>
            </div>
          </div>

          <!-- TAB: Manutenções -->
          <div v-if="activeTab === 'maintenance'" class="tab-panel">
            <div class="tab-header">
              <AButton 
                @click="router.push(`/tabs/maintenance?vehicleId=${vehicleId}`)"
              >
                <template v-slot:start>
<ion-icon :icon="addCircleOutline" ></ion-icon>
</template>
                Registrar Manutenção
              </AButton>
            </div>

            <ACard title="Histórico Completo de Manutenções">
              <div v-if="completedMaintenance.length === 0" class="empty-maintenance">
                <ion-icon :icon="documentTextOutline" class="empty-icon"></ion-icon>
                <p class="empty-text">Nenhuma manutenção registrada</p>
                <AButton size="small" @click="router.push('/tabs/maintenance')">
                  Registrar primeira manutenção
                </AButton>
              </div>

              <div v-else class="maintenance-history-list">
                <div
                  v-for="maintenance in completedMaintenance"
                  :key="maintenance.id"
                  class="maintenance-history-item clickable"
                  @click="router.push(`/tabs/maintenance/${maintenance.id}`)"
                >
                  <div class="maintenance-content">
                    <div class="maintenance-type-header">
                      <h4 class="maintenance-type-title">
                        {{ getMaintenanceTypeLabel(maintenance.type) }}
                      </h4>
                      <ABadge variant="success" size="small">Concluída</ABadge>
                    </div>
                    
                    <div class="maintenance-details">
                      <div class="maintenance-detail">
                        <ion-icon :icon="calendarOutline"></ion-icon>
                        {{ formatDate(maintenance.date) }}
                      </div>
                      
                      <div class="maintenance-detail">
                        <ion-icon :icon="speedometerOutline"></ion-icon>
                        {{ maintenance.mileage.toLocaleString('pt-BR') }} km
                      </div>
                      
                      <div v-if="maintenance.cost" class="maintenance-detail">
                        <ion-icon :icon="cashOutline"></ion-icon>
                        {{ formatCurrency(maintenance.cost) }}
                      </div>

                      <div v-if="maintenance.description" class="maintenance-description">
                        {{ maintenance.description }}
                      </div>
                    </div>
                  </div>

                  <div v-if="maintenance.nextDueDate" class="maintenance-next">
                    <p class="maintenance-next-label">Próxima manutenção</p>
                    <p class="maintenance-next-date">
                      {{ formatDate(maintenance.nextDueDate) }}
                    </p>
                    <p class="maintenance-next-mileage" v-if="maintenance.nextDueMileage">
                      {{ maintenance.nextDueMileage.toLocaleString('pt-BR') }} km
                    </p>
                    <ABadge 
                      :variant="daysUntilNext(maintenance.nextDueDate!) < 0 ? 'error' : 'warning'" 
                      size="small"
                      class="maintenance-next-badge"
                    >
                      {{ Math.abs(daysUntilNext(maintenance.nextDueDate!)) }} dias
                      {{ daysUntilNext(maintenance.nextDueDate!) < 0 ? 'atraso' : 'restantes' }}
                    </ABadge>
                  </div>
                </div>
              </div>
            </ACard>
          </div>

          <!-- TAB: Estatísticas -->
          <div v-if="activeTab === 'stats'" class="tab-panel">
            <ACard title="Custos Mensais" class="chart-card">
              <MonthlyCostsChart :maintenance-history="maintenanceHistory" />
            </ACard>

            <div class="charts-grid">
              <ACard title="Custos por Tipo" class="chart-card">
                <CostsByTypeChart :maintenance-history="maintenanceHistory" />
              </ACard>

              <ACard title="Preventiva vs Corretiva" class="chart-card">
                <PreventiveVsCorrectiveChart :maintenance-history="maintenanceHistory" />
              </ACard>
            </div>

            <!-- Resumo Estatístico -->
            <ACard title="Resumo Estatístico">
              <div class="stats-summary-grid">
                <div class="stats-summary-item">
                  <span class="stats-summary-label">Total de Manutenções</span>
                  <span class="stats-summary-value">{{ maintenanceHistory.length }}</span>
                </div>
                <div class="stats-summary-item">
                  <span class="stats-summary-label">Custo Total</span>
                  <span class="stats-summary-value">{{ formatCurrency(totalMaintenanceCost) }}</span>
                </div>
                <div class="stats-summary-item">
                  <span class="stats-summary-label">Custo Médio</span>
                  <span class="stats-summary-value">{{ formatCurrency(averageMaintenanceCost) }}</span>
                </div>
                <div class="stats-summary-item">
                  <span class="stats-summary-label">Custo por KM</span>
                  <span class="stats-summary-value">
                    {{ formatCurrency(vehicle.mileage > 0 ? totalMaintenanceCost / vehicle.mileage : 0) }}
                  </span>
                </div>
              </div>
            </ACard>
          </div>

          <!-- TAB: Documentos -->
          <div v-if="activeTab === 'documents'" class="tab-panel">
            <ACard title="CRLV (Documento do Veículo)">
              <div v-if="!vehicle.documentCRLV" class="document-empty">
                <p class="document-empty-text">Nenhum documento cadastrado</p>
                <AButton size="small" @click="uploadDocument('crlv')">
                  <template v-slot:start>
<ion-icon :icon="cloudUploadOutline" ></ion-icon>
</template>
                  Adicionar CRLV
                </AButton>
              </div>
              <div v-else class="document-preview">
                <img 
                  v-if="vehicle.documentCRLV.startsWith('data:image')" 
                  :src="vehicle.documentCRLV" 
                  alt="CRLV"
                  class="document-image"
                  @click="viewDocument(vehicle.documentCRLV)"
                />
                <div v-else class="document-file">
                  <ion-icon :icon="documentTextOutline"></ion-icon>
                  <span>Documento PDF</span>
                </div>
                <div class="document-actions">
                  <AButton 
                    size="small" 
                    variant="outline"
                    @click="viewDocument(vehicle.documentCRLV)"
                  >
                    <template v-slot:start>
<ion-icon :icon="eyeOutline" ></ion-icon>
</template>
                    Visualizar
                  </AButton>
                  <AButton 
                    size="small" 
                    variant="outline"
                    color="danger"
                    @click="deleteDocument('crlv')"
                  >
                    <template v-slot:start>
<ion-icon :icon="trashOutline" ></ion-icon>
</template>
                    Remover
                  </AButton>
                </div>
              </div>
            </ACard>

            <ACard title="Apólice de Seguro">
              <div v-if="!vehicle.documentInsurancePolicy" class="document-empty">
                <p class="document-empty-text">Nenhuma apólice cadastrada</p>
                <AButton size="small" @click="uploadDocument('insurance')">
                  <template v-slot:start>
<ion-icon :icon="cloudUploadOutline" ></ion-icon>
</template>
                  Adicionar Apólice
                </AButton>
              </div>
              <div v-else class="document-preview">
                <img 
                  v-if="vehicle.documentInsurancePolicy.startsWith('data:image')" 
                  :src="vehicle.documentInsurancePolicy" 
                  alt="Apólice"
                  class="document-image"
                  @click="viewDocument(vehicle.documentInsurancePolicy)"
                />
                <div v-else class="document-file">
                  <ion-icon :icon="documentTextOutline"></ion-icon>
                  <span>Documento PDF</span>
                </div>
                <div class="document-actions">
                  <AButton 
                    size="small" 
                    variant="outline"
                    @click="viewDocument(vehicle.documentInsurancePolicy)"
                  >
                    <template v-slot:start>
<ion-icon :icon="eyeOutline" ></ion-icon>
</template>
                    Visualizar
                  </AButton>
                  <AButton 
                    size="small" 
                    variant="outline"
                    color="danger"
                    @click="deleteDocument('insurance')"
                  >
                    <template v-slot:start>
<ion-icon :icon="trashOutline" ></ion-icon>
</template>
                    Remover
                  </AButton>
                </div>
              </div>
            </ACard>
          </div>

          <!-- TAB: Seguro -->
          <div v-if="activeTab === 'insurance'" class="tab-panel">
            <ACard title="Informações do Seguro">
              <div v-if="!vehicle.insuranceCompany" class="insurance-empty-state">
                <ion-icon :icon="shieldCheckmarkOutline" class="empty-icon"></ion-icon>
                <p class="empty-text">Nenhum seguro cadastrado</p>
                <AButton size="small" @click="router.push(`/tabs/vehicle/${vehicleId}`)">
                  Adicionar Seguro
                </AButton>
              </div>

              <div v-else class="insurance-details">
                <!-- Status do Seguro -->
                <div class="insurance-status-card" :class="{
                  'expired': isInsuranceExpired,
                  'expiring': isInsuranceExpiringSoon,
                  'active': !isInsuranceExpired && !isInsuranceExpiringSoon
                }">
                  <div class="insurance-status-icon">
                    <ion-icon 
                      :icon="isInsuranceExpired ? closeCircleOutline : 
                             isInsuranceExpiringSoon ? warningOutline : 
                             checkmarkCircleOutline"
                    ></ion-icon>
                  </div>
                  <div class="insurance-status-text">
                    <template v-if="isInsuranceExpired">
                      ⚠️ Seguro Vencido
                    </template>
                    <template v-else-if="isInsuranceExpiringSoon">
                      📅 Renovar em Breve
                    </template>
                    <template v-else>
                      ✓ Seguro em Dia
                    </template>
                  </div>
                </div>

                <div class="insurance-info-list">
                  <div class="insurance-info-item">
                    <span class="insurance-info-label">Seguradora</span>
                    <span class="insurance-info-value">{{ vehicle.insuranceCompany }}</span>
                  </div>
                  <div class="insurance-info-item" v-if="vehicle.insurancePhone">
                    <span class="insurance-info-label">Telefone</span>
                    <span class="insurance-info-value">{{ vehicle.insurancePhone }}</span>
                  </div>
                  <div class="insurance-info-item" v-if="vehicle.insurancePolicyNumber">
                    <span class="insurance-info-label">Número da Apólice</span>
                    <span class="insurance-info-value">{{ vehicle.insurancePolicyNumber }}</span>
                  </div>
                  <div class="insurance-info-item" v-if="vehicle.insuranceExpiryDate">
                    <span class="insurance-info-label">Data de Vencimento</span>
                    <span class="insurance-info-value">{{ formatDate(vehicle.insuranceExpiryDate) }}</span>
                  </div>
                  <div class="insurance-info-item" v-if="vehicle.insuranceValue">
                    <span class="insurance-info-label">Valor do Seguro</span>
                    <span class="insurance-info-value">{{ formatCurrency(vehicle.insuranceValue) }}</span>
                  </div>
                </div>

                <AButton 
                  variant="outline"
                  class="edit-insurance-button"
                  @click="router.push(`/tabs/vehicle/${vehicleId}`)"
                >
                  <template v-slot:start>
<ion-icon :icon="createOutline" ></ion-icon>
</template>
                  Editar Informações
                </AButton>
              </div>
            </ACard>
          </div>
        </div>
      </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
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
  addCircleOutline,
  speedometerOutline,
  checkmarkDoneOutline,
  cashOutline,
  timeOutline,
  checkmarkCircleOutline,
  documentTextOutline,
  calendarOutline,
  cloudUploadOutline,
  eyeOutline,
  shieldCheckmarkOutline,
  closeCircleOutline,
  warningOutline,
  construct,
  carSportOutline,
  informationCircleOutline,
  businessOutline,
  carOutline,
  settingsOutline,
  colorPaletteOutline,
  waterOutline,
  constructOutline
} from 'ionicons/icons'
import { useVehiclesStore } from '@/stores/vehicles'
import { FUEL_TYPE_LABELS, MAINTENANCE_TYPE_LABELS } from '@/constants/vehicles'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import ModernHeader from '@/components/organisms/ModernHeader.vue'
import AButton from '@/components/atoms/AButton.vue'
import ABadge from '@/components/atoms/ABadge.vue'
import ACard from '@/components/atoms/ACard.vue'
import MonthlyCostsChart from '@/components/charts/MonthlyCostsChart.vue'
import CostsByTypeChart from '@/components/charts/CostsByTypeChart.vue'
import PreventiveVsCorrectiveChart from '@/components/charts/PreventiveVsCorrectiveChart.vue'

const route = useRoute()
const router = useRouter()
const vehiclesStore = useVehiclesStore()
const activeTab = ref('info')

const vehicleId = route.params.id as string

const vehicle = computed(() => vehiclesStore.getVehicleById(vehicleId))

const maintenanceHistory = computed(() => {
  return vehiclesStore.maintenanceRecords.filter(
    record => record.vehicleId === vehicleId
  ).sort((a, b) => b.date.getTime() - a.date.getTime())
})

const upcomingMaintenance = computed(() => {
  return maintenanceHistory.value.filter(
    record => record.nextDueDate && record.nextDueDate > new Date()
  ).sort((a, b) => a.nextDueDate!.getTime() - b.nextDueDate!.getTime())
})

const completedMaintenance = computed(() => {
  return maintenanceHistory.value
})

const totalMaintenanceCost = computed(() => {
  return maintenanceHistory.value.reduce((sum, record) => sum + (record.cost || 0), 0)
})

const averageMaintenanceCost = computed(() => {
  const records = maintenanceHistory.value.filter(r => r.cost && r.cost > 0)
  if (records.length === 0) return 0
  return records.reduce((sum, r) => sum + (r.cost || 0), 0) / records.length
})

const lastMaintenanceDate = computed(() => {
  if (completedMaintenance.value.length === 0) return null
  return completedMaintenance.value[0].date
})

const nextMaintenanceDate = computed(() => {
  if (upcomingMaintenance.value.length === 0) return null
  return upcomingMaintenance.value[0].nextDueDate
})

// Tabs configuration
const tabs = computed(() => [
  { 
    id: 'info', 
    label: 'Informações', 
    icon: '📋'
  },
  { 
    id: 'maintenance', 
    label: 'Manutenções', 
    icon: '🔧',
    badge: maintenanceHistory.value.length
  },
  { 
    id: 'stats', 
    label: 'Estatísticas', 
    icon: '📊',
    disabled: maintenanceHistory.value.length === 0
  },
  { 
    id: 'documents', 
    label: 'Documentos', 
    icon: '📄'
  },
  { 
    id: 'insurance', 
    label: 'Seguro', 
    icon: '🛡️',
    badge: isInsuranceExpired.value || isInsuranceExpiringSoon.value ? 1 : undefined
  }
])

// Verificações de seguro
const isInsuranceExpired = computed(() => {
  if (!vehicle.value?.insuranceExpiryDate) return false
  return new Date(vehicle.value.insuranceExpiryDate) < new Date()
})

const isInsuranceExpiringSoon = computed(() => {
  if (!vehicle.value?.insuranceExpiryDate) return false
  const expiryDate = new Date(vehicle.value.insuranceExpiryDate)
  const today = new Date()
  const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return daysUntilExpiry > 0 && daysUntilExpiry <= 30
})

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

const getFuelTypeLabel = (type: string) => {
  return FUEL_TYPE_LABELS[type as keyof typeof FUEL_TYPE_LABELS] || type
}

const getFuelTypeBadgeVariant = (type: string) => {
  const variants: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
    flex: 'default',
    gasoline: 'default',
    ethanol: 'success',
    diesel: 'warning',
    electric: 'success',
    'hybrid-plugin': 'success',
    'hybrid-mild': 'success',
    gnv: 'warning'
  }
  return variants[type] || 'default'
}

const daysUntilNext = (date: Date) => {
  const now = new Date()
  const diff = date.getTime() - now.getTime()
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  return days
}

const handleEdit = () => {
  router.push(`/tabs/vehicle/${vehicleId}`)
}

const handleDelete = async () => {
  if (!vehicle.value) return
  
  const alert = await alertController.create({
    header: 'Confirmar Exclusão',
    message: `Tem certeza que deseja excluir o veículo ${vehicle.value.make} ${vehicle.value.model}?`,
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Excluir',
        role: 'destructive',
        handler: async () => {
          const success = await vehiclesStore.deleteVehicle(vehicleId)
          if (success) {
            router.push('/tabs/vehicles')
          }
        }
      }
    ]
  })

  await alert.present()
}

const handleTabChange = (tabId: string) => {
  activeTab.value = tabId
}

const uploadDocument = async (docType: 'crlv' | 'insurance') => {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos
    })

    if (image.dataUrl) {
      const updateData: Record<string, string> = {}
      if (docType === 'crlv') {
        updateData.documentCRLV = image.dataUrl
      } else {
        updateData.documentInsurancePolicy = image.dataUrl
      }

      await vehiclesStore.updateVehicle(vehicleId, updateData)
      
      const alert = await alertController.create({
        header: 'Sucesso',
        message: 'Documento adicionado com sucesso!',
        buttons: ['OK']
      })
      await alert.present()
    }
  } catch (error) {
    console.error('Erro ao fazer upload do documento:', error)
    const alert = await alertController.create({
      header: 'Erro',
      message: 'Erro ao fazer upload do documento. Tente novamente.',
      buttons: ['OK']
    })
    await alert.present()
  }
}

const viewDocument = (dataUrl: string) => {
  // Open in new window or use Capacitor Browser
  window.open(dataUrl, '_blank')
}

const deleteDocument = async (docType: 'crlv' | 'insurance') => {
  const alert = await alertController.create({
    header: 'Confirmar Exclusão',
    message: 'Tem certeza que deseja excluir este documento?',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Excluir',
        role: 'destructive',
        handler: async () => {
          const updateData: Record<string, null> = {}
          if (docType === 'crlv') {
            updateData.documentCRLV = null
          } else {
            updateData.documentInsurancePolicy = null
          }

          await vehiclesStore.updateVehicle(vehicleId, updateData)
        }
      }
    ]
  })

  await alert.present()
}

onMounted(async () => {
  await vehiclesStore.fetchVehicles()
  await vehiclesStore.fetchMaintenanceRecords()
  
  if (!vehicle.value) {
    router.push('/tabs/vehicles')
  }
})
</script>

<style scoped>
/* Toolbar */
.detail-toolbar {
  --background: #1f2937;
  --color: white;
  --border-color: #374151;
}

/* Content */
.detail-content {
  --background: #111827;
}

.detail-container {
  min-height: 100%;
  background: #111827;
  padding: 1rem;
  padding-bottom: 2rem;
}

/* Loading */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
}

.loading-text {
  margin-top: 1rem;
  color: #9ca3af;
}

/* Vehicle Header */
.vehicle-header {
  margin-bottom: 1.5rem;
}

.vehicle-header-content {
  margin-bottom: 1rem;
}

.vehicle-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
}

.vehicle-badges {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.vehicle-info-text {
  color: #9ca3af;
}

.vehicle-info-separator {
  color: #4b5563;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

/* Stats Grid */
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
  background: #1f2937;
  border-radius: 0.75rem;
  padding: 1rem;
  border: 1px solid;
  text-align: center;
}

.stat-card.blue-gradient {
  background: linear-gradient(to bottom right, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05));
  border-color: rgba(59, 130, 246, 0.3);
}

.stat-card.green-gradient {
  background: linear-gradient(to bottom right, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05));
  border-color: rgba(34, 197, 94, 0.3);
}

.stat-card.purple-gradient {
  background: linear-gradient(to bottom right, rgba(168, 85, 247, 0.1), rgba(168, 85, 247, 0.05));
  border-color: rgba(168, 85, 247, 0.3);
}

.stat-card.yellow-gradient {
  background: linear-gradient(to bottom right, rgba(234, 179, 8, 0.1), rgba(234, 179, 8, 0.05));
  border-color: rgba(234, 179, 8, 0.3);
}

.stat-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  margin: 0 auto 0.75rem;
}

.stat-icon-wrapper ion-icon {
  font-size: 1.5rem;
}

.stat-icon-wrapper.blue {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
}

.stat-icon-wrapper.green {
  background: rgba(34, 197, 94, 0.2);
  color: #4ade80;
}

.stat-icon-wrapper.purple {
  background: rgba(168, 85, 247, 0.2);
  color: #c084fc;
}

.stat-icon-wrapper.yellow {
  background: rgba(234, 179, 8, 0.2);
  color: #facc15;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  color: #9ca3af;
}

/* ====================================
   MAIN INFO GRID - NEW LAYOUT
   ==================================== */

.main-info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

@media (min-width: 1024px) {
  .main-info-grid {
    grid-template-columns: 1.5fr 1fr;
    gap: 2rem;
  }
}

.vehicle-info-column {
  display: flex;
  flex-direction: column;
}

.quick-access-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* ====================================
   VEHICLE INFO CARD - MODERNIZADO
   ==================================== */

.vehicle-info-card {
  background: linear-gradient(135deg, rgba(31, 41, 55, 0.9) 0%, rgba(17, 24, 39, 0.9) 100%);
  border: 2px solid rgba(129, 140, 248, 0.2);
  transition: all 0.3s ease;
}

.vehicle-info-card:hover {
  border-color: rgba(129, 140, 248, 0.4);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
}

.vehicle-info-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 0.5rem 0;
}

/* Seções de informação */
.info-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid rgba(129, 140, 248, 0.2);
  margin-bottom: 0.5rem;
}

.section-icon {
  font-size: 1.5rem;
  color: rgba(129, 140, 248, 0.8);
}

.section-title {
  font-size: 1rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

/* Grid de informações */
.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px) {
  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Item moderno de informação */
.info-item-modern {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: rgba(17, 24, 39, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.info-item-modern:hover {
  background: rgba(31, 41, 55, 0.7);
  border-color: rgba(129, 140, 248, 0.3);
  transform: translateY(-2px);
}

.info-item-modern.highlight {
  background: linear-gradient(135deg, rgba(129, 140, 248, 0.1) 0%, rgba(102, 126, 234, 0.05) 100%);
  border-color: rgba(129, 140, 248, 0.3);
}

.info-item-modern.highlight:hover {
  background: linear-gradient(135deg, rgba(129, 140, 248, 0.15) 0%, rgba(102, 126, 234, 0.08) 100%);
  border-color: rgba(129, 140, 248, 0.5);
}

.info-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  min-width: 2.5rem;
  border-radius: 10px;
  background: rgba(129, 140, 248, 0.15);
  border: 1px solid rgba(129, 140, 248, 0.3);
  transition: all 0.3s ease;
}

.info-icon-wrapper ion-icon {
  font-size: 1.25rem;
  color: rgba(129, 140, 248, 0.9);
}

.info-item-modern:hover .info-icon-wrapper {
  background: rgba(129, 140, 248, 0.25);
  border-color: rgba(129, 140, 248, 0.5);
  transform: scale(1.1);
}

.info-icon-wrapper.highlight {
  background: linear-gradient(135deg, rgba(129, 140, 248, 0.3) 0%, rgba(102, 126, 234, 0.2) 100%);
  border-color: rgba(129, 140, 248, 0.5);
}

.info-icon-wrapper.highlight ion-icon {
  color: rgba(147, 197, 253, 1);
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  min-width: 0;
}

.info-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(156, 163, 175, 1);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-value {
  font-size: 0.95rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  word-break: break-word;
}

.card-title-with-icon {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.125rem;
  font-weight: 700;
  color: white;
}

.card-title-with-icon .title-icon {
  font-size: 1.5rem;
  color: rgba(129, 140, 248, 0.8);
}

/* ====================================
   MODERN INSURANCE CARD
   ==================================== */

.insurance-modern-card {
  background: linear-gradient(135deg, rgba(31, 41, 55, 0.9) 0%, rgba(17, 24, 39, 0.9) 100%);
  border: 2px solid rgba(129, 140, 248, 0.2);
  transition: all 0.3s ease;
}

.insurance-modern-card:hover {
  border-color: rgba(129, 140, 248, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
}

.insurance-modern-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 12px;
}

.insurance-status-badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 12px;
  border: 2px solid;
  transition: all 0.3s ease;
}

.insurance-status-badge.status-active {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%);
  border-color: rgba(34, 197, 94, 0.4);
}

.insurance-status-badge.status-expiring {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%);
  border-color: rgba(245, 158, 11, 0.4);
}

.insurance-status-badge.status-expired {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%);
  border-color: rgba(239, 68, 68, 0.4);
  animation: pulse-error 2s ease-in-out infinite;
}

@keyframes pulse-error {
  0%, 100% {
    border-color: rgba(239, 68, 68, 0.4);
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
  }
  50% {
    border-color: rgba(239, 68, 68, 0.6);
    box-shadow: 0 0 0 8px rgba(239, 68, 68, 0.1);
  }
}

.insurance-status-badge .status-icon {
  font-size: 2rem;
}

.status-active .status-icon {
  color: #4ade80;
}

.status-expiring .status-icon {
  color: #fb923c;
}

.status-expired .status-icon {
  color: #f87171;
}

.insurance-status-badge .status-text {
  font-size: 1rem;
  font-weight: 600;
  color: white;
}

.insurance-company-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  padding: 0.5rem 0;
}

.insurance-expiry-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(17, 24, 39, 0.5);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.insurance-expiry-info .expiry-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #9ca3af;
  font-size: 0.875rem;
}

.insurance-expiry-info .expiry-label ion-icon {
  font-size: 1rem;
}

.insurance-expiry-info .expiry-date {
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  margin-left: 1.5rem;
}

.insurance-action-button {
  margin-top: 0.5rem;
}

.insurance-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem 1rem;
  gap: 1rem;
}

.insurance-empty-state .empty-icon {
  font-size: 4rem;
  color: rgba(129, 140, 248, 0.4);
}

.insurance-empty-state .empty-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  margin: 0;
}

.insurance-empty-state .empty-subtitle {
  font-size: 0.875rem;
  color: #9ca3af;
  margin: 0;
  max-width: 300px;
}

/* ====================================
   UPCOMING MAINTENANCE CARD
   ==================================== */

.upcoming-maintenance-card {
  background: linear-gradient(135deg, rgba(31, 41, 55, 0.9) 0%, rgba(17, 24, 39, 0.9) 100%);
  border: 2px solid rgba(129, 140, 248, 0.2);
  transition: all 0.3s ease;
}

.upcoming-maintenance-card:hover {
  border-color: rgba(129, 140, 248, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
}

.upcoming-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem 1rem;
  gap: 1rem;
}

.upcoming-empty-state .empty-icon {
  font-size: 4rem;
  color: rgba(34, 197, 94, 0.6);
}

.upcoming-empty-state .empty-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  margin: 0;
}

.upcoming-empty-state .empty-subtitle {
  font-size: 0.875rem;
  color: #9ca3af;
  margin: 0;
  max-width: 300px;
}

.upcoming-maintenance-list {
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.upcoming-maintenance-item {
  padding: 1rem;
  background: rgba(17, 24, 39, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.upcoming-maintenance-item:hover {
  background: rgba(31, 41, 55, 0.8);
  border-color: rgba(129, 140, 248, 0.4);
  transform: translateX(4px);
}

.maintenance-type {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.maintenance-type .type-icon {
  font-size: 1.25rem;
  color: rgba(129, 140, 248, 0.8);
}

.maintenance-type .type-label {
  font-size: 1rem;
  font-weight: 600;
  color: white;
}

.maintenance-due-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.maintenance-due-info .due-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #9ca3af;
  font-size: 0.875rem;
}

.maintenance-due-info .due-date ion-icon {
  font-size: 1rem;
}

.maintenance-mileage-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #9ca3af;
  font-size: 0.875rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.maintenance-mileage-info ion-icon {
  font-size: 1rem;
  color: rgba(129, 140, 248, 0.6);
}

.view-all-button {
  margin-top: 0.5rem;
}

/* Insurance Card (Legacy - ainda usado em outras tabs) */
.insurance-card {
  border-color: rgba(59, 130, 246, 0.3) !important;
  background: linear-gradient(to bottom right, rgba(59, 130, 246, 0.05), rgba(59, 130, 246, 0.02)) !important;
  cursor: pointer;
  transition: all 0.2s;
}

.insurance-card:hover {
  border-color: rgba(59, 130, 246, 0.5) !important;
}

.insurance-content {
  text-align: center;
  padding: 1.5rem 0;
}

.insurance-company {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
}

.insurance-expiry {
  font-size: 0.875rem;
  color: #9ca3af;
  margin-bottom: 1rem;
}

.insurance-empty {
  text-align: center;
  padding: 1.5rem 0;
}

.insurance-empty-text {
  color: #9ca3af;
  margin-bottom: 1rem;
}

.insurance-button {
  margin-top: 1rem;
}

/* Empty States */
.empty-maintenance {
  text-align: center;
  padding: 2rem 0;
}

.empty-icon {
  font-size: 3rem;
  color: #4b5563;
  margin-bottom: 1rem;
}

.empty-text {
  color: #9ca3af;
  margin-bottom: 1rem;
}

/* Maintenance List */
.upcoming-card {
  margin-bottom: 1.5rem;
}

.maintenance-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.maintenance-item {
  padding: 1rem;
  background: #1f2937;
  border-radius: 0.5rem;
  border: 1px solid #374151;
  transition: all 0.2s;
}

.maintenance-item:hover {
  border-color: #4b5563;
}

.maintenance-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.maintenance-title {
  font-weight: 500;
  color: white;
  font-size: 0.875rem;
}

.maintenance-date {
  font-size: 0.875rem;
  color: #9ca3af;
}

.maintenance-mileage {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

/* Tab Header */
.tab-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

/* Maintenance History */
.maintenance-history-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.maintenance-history-item {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem;
  background: #1f2937;
  border-radius: 0.5rem;
  border: 1px solid #374151;
  transition: all 0.2s;
}

@media (min-width: 640px) {
  .maintenance-history-item {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }
}

.maintenance-history-item:hover {
  border-color: #4b5563;
}

.maintenance-content {
  flex: 1;
}

.maintenance-type-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.maintenance-type-title {
  font-weight: 600;
  color: white;
  font-size: 1rem;
}

.maintenance-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.maintenance-detail {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #9ca3af;
  font-size: 0.875rem;
}

.maintenance-detail ion-icon {
  font-size: 1rem;
}

.maintenance-description {
  margin-top: 0.75rem;
  padding-left: 1.5rem;
  border-left: 2px solid #374151;
  color: #9ca3af;
  font-size: 0.875rem;
}

.maintenance-next {
  text-align: left;
}

@media (min-width: 640px) {
  .maintenance-next {
    text-align: right;
  }
}

.maintenance-next-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.maintenance-next-date {
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
}

.maintenance-next-mileage {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.25rem;
}

.maintenance-next-badge {
  margin-top: 0.5rem;
}

/* Charts */
.chart-card {
  margin-bottom: 1.5rem;
}

.charts-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

@media (min-width: 1024px) {
  .charts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Stats Summary */
.stats-summary-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

@media (min-width: 768px) {
  .stats-summary-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.stats-summary-item {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background: #1f2937;
  border-radius: 0.5rem;
  border: 1px solid #374151;
}

.stats-summary-label {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-bottom: 0.5rem;
}

.stats-summary-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
}

/* Documents */
.document-empty {
  text-align: center;
  padding: 2rem 0;
}

.document-empty-text {
  color: #9ca3af;
  margin-bottom: 1rem;
}

.document-preview {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.document-image {
  width: 100%;
  max-height: 400px;
  object-fit: contain;
  border-radius: 0.5rem;
  border: 1px solid #374151;
  cursor: pointer;
}

.document-file {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem;
  background: #1f2937;
  border-radius: 0.5rem;
  border: 1px solid #374151;
  color: #9ca3af;
}

.document-file ion-icon {
  font-size: 2rem;
}

.document-actions {
  display: flex;
  gap: 0.5rem;
}

/* Insurance Details */
.insurance-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.insurance-status-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid;
}

.insurance-status-card.active {
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.3);
}

.insurance-status-card.expiring {
  background: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.3);
}

.insurance-status-card.expired {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
}

.insurance-status-icon {
  font-size: 2rem;
}

.insurance-status-card.active .insurance-status-icon {
  color: #4ade80;
}

.insurance-status-card.expiring .insurance-status-icon {
  color: #fb923c;
}

.insurance-status-card.expired .insurance-status-icon {
  color: #f87171;
}

.insurance-status-text {
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
}

.insurance-info-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.insurance-info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #374151;
}

.insurance-info-item:last-child {
  border-bottom: none;
}

.insurance-info-label {
  color: #9ca3af;
  font-size: 0.875rem;
}

.insurance-info-value {
  font-weight: 500;
  color: white;
  text-align: right;
}

.edit-insurance-button {
  margin-top: 1rem;
}

/* ====================================
   MODERN FILTER PILLS TABS
   ==================================== */

.tabs-container {
  margin: 0 0 2rem 0;
  padding-top: 16px; /* Espaço extra para acomodar o movimento e blur */
}

.filter-pills-wrapper {
  overflow-x: auto;
  overflow-y: visible; /* Permite que o blur/shadow seja visível */
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  padding-bottom: 8px; /* Espaço para a sombra na parte inferior */
}

.filter-pills-wrapper::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.filter-pills {
  display: flex;
  gap: 12px;
  padding: 8px 4px 16px 4px; /* Padding superior e inferior aumentados */
  min-width: min-content;
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
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  flex-shrink: 0;
}

.filter-pill:hover:not(.disabled) {
  background: rgba(31, 41, 55, 0.8);
  border-color: rgba(129, 140, 248, 0.4);
  transform: translateY(-2px);
}

.filter-pill.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: rgba(129, 140, 248, 0.6);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.5);
  transform: translateY(-2px);
}

.filter-pill.disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}

.pill-icon {
  font-size: 1.25rem;
  line-height: 1;
}

.pill-label {
  font-size: 0.938rem;
  font-weight: 600;
  color: white;
  letter-spacing: 0.3px;
}

.pill-count {
  min-width: 24px;
  height: 24px;
  padding: 0 8px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.813rem;
  font-weight: 800;
  color: white;
}

.filter-pill.active .pill-count {
  background: rgba(255, 255, 255, 0.25);
}

.tab-content {
  animation: fadeIn 0.3s ease-in-out;
}

.tab-panel {
  animation: slideIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ====================================
   CLICKABLE ITEMS
   ==================================== */

.clickable {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.clickable::after {
  content: '→';
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.5rem;
  color: rgba(129, 140, 248, 0.6);
  opacity: 0;
  transition: all 0.3s ease;
}

.clickable:hover {
  background: rgba(31, 41, 55, 0.8) !important;
  border-color: rgba(129, 140, 248, 0.4) !important;
  transform: translateX(4px);
}

.clickable:hover::after {
  opacity: 1;
  transform: translateY(-50%) translateX(4px);
}

.clickable:active {
  transform: scale(0.98) translateX(4px);
}
</style>
