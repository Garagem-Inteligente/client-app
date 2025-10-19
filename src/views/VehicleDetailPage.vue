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
      <div class="background-gradient"></div>
      <div class="background-pattern"></div>

      <div class="page-content-wrapper">
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
                <template #start>
                  <ion-icon :icon="addCircleOutline" />
                </template>
                Nova Manutenção
              </AButton>
            </div>
          </div>

          <!-- Tabs -->
          <MFilterPills v-model="activeTab" :tabs="tabs" />

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

              <!-- Main Info Grid: Left info and Right quick access -->
              <div class="main-info-grid">
                <div class="vehicle-info-column">
                  <ACard class="vehicle-info-card">
                    <template #title>
                      <div class="card-title-with-icon">
                        <ion-icon :icon="carSportOutline"></ion-icon>
                        <span>Informações do Veículo</span>
                      </div>
                    </template>

                    <div class="vehicle-info-content">
                      <!-- Identificação -->
                      <div class="info-section">
                        <div class="section-header">
                          <ion-icon :icon="informationCircleOutline" class="section-icon"></ion-icon>
                          <h3 class="section-title">Identificação</h3>
                        </div>
                        <div class="info-grid">
                          <MInfoItem :icon="businessOutline" label="Marca" :value="vehicle.make" />
                          <MInfoItem :icon="carOutline" label="Modelo" :value="vehicle.model" />
                          <MInfoItem :icon="calendarOutline" label="Ano" :value="vehicle.year" />
                          <MInfoItem :icon="documentTextOutline" label="Placa" :value="vehicle.plate" />
                        </div>
                      </div>

                      <!-- Características -->
                      <div class="info-section">
                        <div class="section-header">
                          <ion-icon :icon="settingsOutline" class="section-icon"></ion-icon>
                          <h3 class="section-title">Características</h3>
                        </div>
                        <div class="info-grid">
                          <MInfoItem v-if="vehicle.color" :icon="colorPaletteOutline" label="Cor" :value="vehicle.color" />
                          <MInfoItem :icon="speedometerOutline" label="Quilometragem" :value="`${vehicle.mileage.toLocaleString('pt-BR')} km`" />
                          <MInfoItem :icon="waterOutline" label="Combustível" :value="getFuelTypeLabel(vehicle.fuelType)" />
                        </div>
                      </div>

                      <!-- Histórico -->
                      <div class="info-section">
                        <div class="section-header">
                          <ion-icon :icon="constructOutline" class="section-icon"></ion-icon>
                          <h3 class="section-title">Histórico</h3>
                        </div>
                        <div class="info-grid">
                          <MInfoItem 
                            :icon="timeOutline" 
                            label="Última Manutenção" 
                            :value="lastMaintenanceDate ? formatDate(lastMaintenanceDate) : 'Nenhuma'" 
                            highlight 
                          />
                          <MInfoItem 
                            :icon="cashOutline" 
                            label="Custo Médio" 
                            :value="formatCurrency(averageMaintenanceCost)" 
                            highlight 
                          />
                        </div>
                      </div>
                    </div>
                  </ACard>
                </div>

                <div class="quick-access-column">
                  <!-- Insurance card (modern) -->
                  <ACard class="insurance-modern-card">
                    <template #title>
                      <div class="card-title-with-icon">
                        <ion-icon :icon="shieldCheckmarkOutline" class="title-icon"></ion-icon>
                        <span>Seguro</span>
                      </div>
                    </template>

                    <div v-if="vehicle.insuranceCompany" class="insurance-modern-content">
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

                      <div class="insurance-company-name">
                        {{ vehicle.insuranceCompany }}
                      </div>

                      <div class="insurance-expiry-info">
                        <div class="expiry-label">
                          <ion-icon :icon="calendarOutline"></ion-icon>
                          <span>{{ isInsuranceExpired ? 'Venceu em' : 'Vence em' }}</span>
                        </div>
                        <div class="expiry-date">
                          {{ vehicle.insuranceExpiryDate ? formatDate(vehicle.insuranceExpiryDate) : 'N/A' }}
                        </div>
                      </div>

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

                  <!-- Próximas Manutenções -->
                  <ACard class="upcoming-maintenance-card">
                    <template #title>
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
            <div v-else-if="activeTab === 'maintenance'" class="tab-panel">
              <MaintenanceSection :vehicle-id="vehicleId" />
            </div>

            <!-- TAB: Estatísticas -->
            <div v-else-if="activeTab === 'stats'" class="tab-panel">
              <!-- Empty State -->
              <div v-if="maintenanceHistory.length === 0" class="stats-empty-state">
                <div class="empty-icon-wrapper">
                  <ion-icon :icon="statsChartOutline" class="empty-icon" />
                </div>
                <h3 class="empty-title">Sem Dados Estatísticos</h3>
                <p class="empty-text">
                  Registre manutenções para visualizar estatísticas detalhadas sobre custos,
                  padrões de manutenção e análises do seu veículo.
                </p>
                <AButton @click="router.push(`/tabs/maintenance/new?vehicleId=${vehicleId}`)">
                  <template #start>
                    <ion-icon :icon="addCircleOutline" />
                  </template>
                  Registrar Primeira Manutenção
                </AButton>
              </div>

              <!-- Stats Content -->
              <div v-else class="stats-content">
                <!-- Stats Cards Grid -->
                <div class="stats-cards-grid">
                  <div class="stat-detail-card blue-gradient">
                    <div class="stat-detail-header">
                      <div class="stat-detail-icon blue">
                        <ion-icon :icon="constructOutline"></ion-icon>
                      </div>
                      <span class="stat-detail-label">Total de Manutenções</span>
                    </div>
                    <div class="stat-detail-value">{{ maintenanceHistory.length }}</div>
                    <div class="stat-detail-meta">
                      <span class="meta-item">
                        <ion-icon :icon="trendingUpOutline"></ion-icon>
                        Histórico completo
                      </span>
                    </div>
                  </div>

                  <div class="stat-detail-card green-gradient">
                    <div class="stat-detail-header">
                      <div class="stat-detail-icon green">
                        <ion-icon :icon="cashOutline"></ion-icon>
                      </div>
                      <span class="stat-detail-label">Custo Total Investido</span>
                    </div>
                    <div class="stat-detail-value">{{ formatCurrency(totalMaintenanceCost) }}</div>
                    <div class="stat-detail-meta">
                      <span class="meta-item">
                        <ion-icon :icon="walletOutline"></ion-icon>
                        Valor acumulado
                      </span>
                    </div>
                  </div>

                  <div class="stat-detail-card purple-gradient">
                    <div class="stat-detail-header">
                      <div class="stat-detail-icon purple">
                        <ion-icon :icon="calculatorOutline"></ion-icon>
                      </div>
                      <span class="stat-detail-label">Custo Médio</span>
                    </div>
                    <div class="stat-detail-value">{{ formatCurrency(averageMaintenanceCost) }}</div>
                    <div class="stat-detail-meta">
                      <span class="meta-item">
                        <ion-icon :icon="analyticsOutline"></ion-icon>
                        Por manutenção
                      </span>
                    </div>
                  </div>

                  <div class="stat-detail-card orange-gradient">
                    <div class="stat-detail-header">
                      <div class="stat-detail-icon orange">
                        <ion-icon :icon="speedometerOutline"></ion-icon>
                      </div>
                      <span class="stat-detail-label">Custo por Km</span>
                    </div>
                    <div class="stat-detail-value">
                      {{ formatCurrency(vehicle.mileage > 0 ? totalMaintenanceCost / vehicle.mileage : 0) }}
                    </div>
                    <div class="stat-detail-meta">
                      <span class="meta-item">
                        <ion-icon :icon="pulseOutline"></ion-icon>
                        Eficiência
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Chart Section -->
                <div class="chart-section">
                  <div class="section-header-simple">
                    <h3 class="section-title-simple">
                      <ion-icon :icon="pieChartOutline"></ion-icon>
                      Análise de Manutenções
                    </h3>
                    <p class="section-subtitle-simple">Distribuição entre preventivas e corretivas</p>
                  </div>
                  <div class="chart-card-modern">
                    <PreventiveVsCorrectiveChart :maintenance-history="maintenanceHistory" />
                  </div>
                </div>
              </div>
            </div>

            <!-- TAB: Documentos -->
            <div v-else-if="activeTab === 'documents'" class="tab-panel">
              <div class="documents-grid">
                <!-- CRLV Card -->
                <div class="document-card modern-card">
                  <div class="document-card-header">
                    <div class="document-icon-wrapper blue-gradient">
                      <ion-icon :icon="documentTextOutline"></ion-icon>
                    </div>
                    <div class="document-header-text">
                      <h3 class="document-title">CRLV</h3>
                      <p class="document-subtitle">Documento do Veículo</p>
                    </div>
                  </div>

                  <div v-if="!vehicle.documentCRLV" class="document-empty-state">
                    <div class="empty-doc-icon">
                      <ion-icon :icon="cloudUploadOutline"></ion-icon>
                    </div>
                    <p class="empty-doc-text">Nenhum documento cadastrado</p>
                    <AButton variant="gradient" @click="uploadDocument('crlv')">
                      <template v-slot:start>
                        <ion-icon :icon="addCircleOutline"></ion-icon>
                      </template>
                      Adicionar CRLV
                    </AButton>
                  </div>

                  <div v-else class="document-content">
                    <div class="document-preview-wrapper" @click="viewDocument(vehicle.documentCRLV)">
                      <img 
                        v-if="!isPDF(vehicle.documentCRLV)" 
                        :src="vehicle.documentCRLV" 
                        alt="CRLV"
                        class="document-image-preview"
                      />
                      <div v-else class="document-file-preview">
                        <ion-icon :icon="documentTextOutline"></ion-icon>
                        <span class="pdf-label">Documento PDF</span>
                        <span class="pdf-hint">Clique para abrir</span>
                      </div>
                      <div class="preview-overlay">
                        <ion-icon :icon="eyeOutline"></ion-icon>
                        <span>Clique para visualizar</span>
                      </div>
                    </div>
                    <div class="document-actions-modern">
                      <AButton 
                        size="small" 
                        variant="outline"
                        @click="viewDocument(vehicle.documentCRLV)"
                      >
                        <template v-slot:start>
                          <ion-icon :icon="eyeOutline"></ion-icon>
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
                          <ion-icon :icon="trashOutline"></ion-icon>
                        </template>
                        Remover
                      </AButton>
                    </div>
                  </div>
                </div>

                <!-- Insurance Policy Card -->
                <div class="document-card modern-card">
                  <div class="document-card-header">
                    <div class="document-icon-wrapper purple-gradient">
                      <ion-icon :icon="shieldCheckmarkOutline"></ion-icon>
                    </div>
                    <div class="document-header-text">
                      <h3 class="document-title">Apólice de Seguro</h3>
                      <p class="document-subtitle">Documento de Cobertura</p>
                    </div>
                  </div>

                  <div v-if="!vehicle.documentInsurancePolicy" class="document-empty-state">
                    <div class="empty-doc-icon">
                      <ion-icon :icon="cloudUploadOutline"></ion-icon>
                    </div>
                    <p class="empty-doc-text">Nenhuma apólice cadastrada</p>
                    <AButton variant="gradient" @click="uploadDocument('insurance')">
                      <template v-slot:start>
                        <ion-icon :icon="addCircleOutline"></ion-icon>
                      </template>
                      Adicionar Apólice
                    </AButton>
                  </div>

                  <div v-else class="document-content">
                    <div class="document-preview-wrapper" @click="viewDocument(vehicle.documentInsurancePolicy)">
                      <img 
                        v-if="!isPDF(vehicle.documentInsurancePolicy)" 
                        :src="vehicle.documentInsurancePolicy" 
                        alt="Apólice"
                        class="document-image-preview"
                      />
                      <div v-else class="document-file-preview">
                        <ion-icon :icon="documentTextOutline"></ion-icon>
                        <span class="pdf-label">Documento PDF</span>
                        <span class="pdf-hint">Clique para abrir</span>
                      </div>
                      <div class="preview-overlay">
                        <ion-icon :icon="eyeOutline"></ion-icon>
                        <span>Clique para visualizar</span>
                      </div>
                    </div>
                    <div class="document-actions-modern">
                      <AButton 
                        size="small" 
                        variant="outline"
                        @click="viewDocument(vehicle.documentInsurancePolicy)"
                      >
                        <template v-slot:start>
                          <ion-icon :icon="eyeOutline"></ion-icon>
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
                          <ion-icon :icon="trashOutline"></ion-icon>
                        </template>
                        Remover
                      </AButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- TAB: Seguro -->
            <div v-else-if="activeTab === 'insurance'" class="tab-panel">
              <!-- Empty State -->
              <div v-if="!vehicle.insuranceCompany" class="insurance-empty-modern">
                <div class="empty-insurance-icon">
                  <ion-icon :icon="shieldCheckmarkOutline"></ion-icon>
                </div>
                <h3>Nenhum seguro cadastrado</h3>
                <p>Adicione as informações do seu seguro para melhor controle</p>
                <AButton variant="gradient" @click="router.push(`/tabs/vehicle/${vehicleId}`)">
                  <template v-slot:start>
                    <ion-icon :icon="addCircleOutline"></ion-icon>
                  </template>
                  Adicionar Seguro
                </AButton>
              </div>

              <!-- Insurance Details -->
              <div v-else class="insurance-content-modern">
                <!-- Status Card with Gradient -->
                <div class="insurance-status-modern" :class="{
                  'status-expired': isInsuranceExpired,
                  'status-expiring': isInsuranceExpiringSoon,
                  'status-active': !isInsuranceExpired && !isInsuranceExpiringSoon
                }">
                  <div class="status-icon-modern">
                    <ion-icon 
                      :icon="isInsuranceExpired ? closeCircleOutline : 
                             isInsuranceExpiringSoon ? warningOutline : 
                             checkmarkCircleOutline"
                    ></ion-icon>
                  </div>
                  <div class="status-info-modern">
                    <h3 class="status-title">
                      <template v-if="isInsuranceExpired">Seguro Vencido</template>
                      <template v-else-if="isInsuranceExpiringSoon">Renovar em Breve</template>
                      <template v-else>Seguro em Dia</template>
                    </h3>
                    <p class="status-subtitle">
                      <template v-if="isInsuranceExpired">Renove seu seguro o quanto antes</template>
                      <template v-else-if="isInsuranceExpiringSoon">Seu seguro vence em breve</template>
                      <template v-else>Seu seguro está ativo e protegido</template>
                    </p>
                  </div>
                </div>

                <!-- Insurance Info Grid -->
                <div class="insurance-info-grid">
                  <div class="insurance-info-card">
                    <div class="info-card-icon blue-gradient">
                      <ion-icon :icon="businessOutline"></ion-icon>
                    </div>
                    <div class="info-card-content">
                      <span class="info-card-label">Seguradora</span>
                      <span class="info-card-value">{{ vehicle.insuranceCompany }}</span>
                    </div>
                  </div>

                  <div v-if="vehicle.insurancePolicyNumber" class="insurance-info-card">
                    <div class="info-card-icon purple-gradient">
                      <ion-icon :icon="documentTextOutline"></ion-icon>
                    </div>
                    <div class="info-card-content">
                      <span class="info-card-label">Número da Apólice</span>
                      <span class="info-card-value">{{ vehicle.insurancePolicyNumber }}</span>
                    </div>
                  </div>

                  <div v-if="vehicle.insuranceExpiryDate" class="insurance-info-card">
                    <div class="info-card-icon orange-gradient">
                      <ion-icon :icon="calendarOutline"></ion-icon>
                    </div>
                    <div class="info-card-content">
                      <span class="info-card-label">Data de Vencimento</span>
                      <span class="info-card-value">{{ formatDate(vehicle.insuranceExpiryDate) }}</span>
                    </div>
                  </div>

                  <div v-if="vehicle.insuranceValue" class="insurance-info-card">
                    <div class="info-card-icon green-gradient">
                      <ion-icon :icon="cashOutline"></ion-icon>
                    </div>
                    <div class="info-card-content">
                      <span class="info-card-label">Valor do Seguro</span>
                      <span class="info-card-value">{{ formatCurrency(vehicle.insuranceValue) }}</span>
                    </div>
                  </div>

                  <div v-if="vehicle.insurancePhone" class="insurance-info-card">
                    <div class="info-card-icon blue-gradient">
                      <ion-icon :icon="callOutline"></ion-icon>
                    </div>
                    <div class="info-card-content">
                      <span class="info-card-label">Telefone</span>
                      <span class="info-card-value">{{ vehicle.insurancePhone }}</span>
                    </div>
                  </div>
                </div>

                <!-- Edit Button -->
                <AButton 
                  variant="gradient"
                  class="edit-insurance-modern"
                  @click="router.push(`/tabs/vehicle/${vehicleId}`)"
                >
                  <template v-slot:start>
                    <ion-icon :icon="createOutline"></ion-icon>
                  </template>
                  Editar Informações do Seguro
                </AButton>
              </div>
            </div>
          </div> <!-- tab-content -->
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
  IonSpinner, 
  IonIcon,
  alertController, 
  actionSheetController 
} from '@ionic/vue'
import {
  createOutline,
  trashOutline,
  addCircleOutline,
  speedometerOutline,
  cashOutline,
  timeOutline,
  checkmarkDoneOutline,
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
  constructOutline,
  statsChartOutline,
  trendingUpOutline,
  walletOutline,
  calculatorOutline,
  analyticsOutline,
  pulseOutline,
  pieChartOutline,
  callOutline,
  imageOutline,
  documentOutline,
  closeOutline
} from 'ionicons/icons'
import { useVehiclesStore } from '@/stores/vehicles'
import { FUEL_TYPE_LABELS, MAINTENANCE_TYPE_LABELS } from '@/constants/vehicles'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import ModernHeader from '@/components/organisms/ModernHeader.vue'
import AButton from '@/components/atoms/AButton.vue'
import ABadge from '@/components/atoms/ABadge.vue'
import ACard from '@/components/atoms/ACard.vue'
import MFilterPills from '@/components/molecules/MFilterPills.vue'
import MInfoItem from '@/components/molecules/MInfoItem.vue'
import PreventiveVsCorrectiveChart from '@/components/charts/PreventiveVsCorrectiveChart.vue'
import MaintenanceSection from '@/components/organisms/MaintenanceSection.vue'

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

// Helper to check if document is PDF
const isPDF = (dataUrl: string | undefined) => {
  if (!dataUrl) return false
  return dataUrl.startsWith('data:application/pdf')
}

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

const uploadDocument = async (docType: 'crlv' | 'insurance') => {
  try {
    // Show action sheet to choose between image or PDF
    const actionSheet = await actionSheetController.create({
      header: 'Escolha o tipo de arquivo',
      buttons: [
        {
          text: 'Imagem (JPG, PNG)',
          icon: imageOutline,
          handler: async () => {
            await uploadImage(docType)
          }
        },
        {
          text: 'Documento PDF',
          icon: documentOutline,
          handler: async () => {
            await uploadPDF(docType)
          }
        },
        {
          text: 'Cancelar',
          icon: closeOutline,
          role: 'cancel'
        }
      ]
    })

    await actionSheet.present()
  } catch (error) {
    console.error('Erro ao abrir seleção:', error)
  }
}

const uploadImage = async (docType: 'crlv' | 'insurance') => {
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
        message: 'Imagem adicionada com sucesso!',
        buttons: ['OK']
      })
      await alert.present()
    }
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error)
    const alert = await alertController.create({
      header: 'Erro',
      message: 'Erro ao fazer upload da imagem. Tente novamente.',
      buttons: ['OK']
    })
    await alert.present()
  }
}

const uploadPDF = async (docType: 'crlv' | 'insurance') => {
  try {
    // Create file input element
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/pdf'
    
    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement
      const file = target.files?.[0]
      
      if (!file) return
      
      // Check if it's a PDF
      if (file.type !== 'application/pdf') {
        const alert = await alertController.create({
          header: 'Erro',
          message: 'Por favor, selecione apenas arquivos PDF.',
          buttons: ['OK']
        })
        await alert.present()
        return
      }
      
      // Check file size (max 5MB)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        const alert = await alertController.create({
          header: 'Erro',
          message: 'O arquivo deve ter no máximo 5MB.',
          buttons: ['OK']
        })
        await alert.present()
        return
      }
      
      // Convert to base64
      const reader = new FileReader()
      reader.onload = async (event) => {
        const dataUrl = event.target?.result as string
        
        const updateData: Record<string, string> = {}
        if (docType === 'crlv') {
          updateData.documentCRLV = dataUrl
        } else {
          updateData.documentInsurancePolicy = dataUrl
        }

        await vehiclesStore.updateVehicle(vehicleId, updateData)
        
        const alert = await alertController.create({
          header: 'Sucesso',
          message: 'PDF adicionado com sucesso!',
          buttons: ['OK']
        })
        await alert.present()
      }
      
      reader.onerror = async () => {
        const alert = await alertController.create({
          header: 'Erro',
          message: 'Erro ao ler o arquivo. Tente novamente.',
          buttons: ['OK']
        })
        await alert.present()
      }
      
      reader.readAsDataURL(file)
    }
    
    // Trigger file selection
    input.click()
  } catch (error) {
    console.error('Erro ao fazer upload do PDF:', error)
    const alert = await alertController.create({
      header: 'Erro',
      message: 'Erro ao fazer upload do PDF. Tente novamente.',
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
  --background: var(--ion-background-color);
}

.detail-container {
  min-height: 100%;
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

/* ====================================
   STATISTICS TAB - MODERN DESIGN
   ==================================== */

.stats-empty-state {
  text-align: center;
  padding: 4rem 1.5rem;
  animation: fadeIn 0.6s ease-in-out;
}

.empty-icon-wrapper {
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(129, 140, 248, 0.2);
}

.empty-icon-wrapper ion-icon {
  font-size: 4rem;
  color: #667eea;
}

.stats-empty-state h3 {
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
}

.stats-empty-state p {
  color: #9ca3af;
  font-size: 1rem;
  margin: 0;
  line-height: 1.6;
}

.stats-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.stats-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
}

.stat-detail-card {
  background: rgba(31, 41, 55, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1.75rem;
  border: 2px solid rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideInUp 0.6s ease-out;
  animation-fill-mode: both;
  position: relative;
  overflow: hidden;
}

.stat-detail-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stat-detail-card.blue-gradient::before {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}

.stat-detail-card.green-gradient::before {
  background: linear-gradient(90deg, #10b981 0%, #22c55e 100%);
}

.stat-detail-card.purple-gradient::before {
  background: linear-gradient(90deg, #a855f7 0%, #d946ef 100%);
}

.stat-detail-card.orange-gradient::before {
  background: linear-gradient(90deg, #f97316 0%, #fb923c 100%);
}

.stat-detail-card:hover {
  transform: translateY(-4px);
  border-color: rgba(129, 140, 248, 0.3);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
}

.stat-detail-card:hover::before {
  opacity: 1;
}

.stat-detail-card:nth-child(1) {
  animation-delay: 0.05s;
}

.stat-detail-card:nth-child(2) {
  animation-delay: 0.1s;
}

.stat-detail-card:nth-child(3) {
  animation-delay: 0.15s;
}

.stat-detail-card:nth-child(4) {
  animation-delay: 0.2s;
}

.stat-detail-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-detail-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s ease;
  flex-shrink: 0;
}

.blue-gradient .stat-detail-icon {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.08) 100%);
}

.green-gradient .stat-detail-icon {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(34, 197, 94, 0.08) 100%);
}

.purple-gradient .stat-detail-icon {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(217, 70, 239, 0.08) 100%);
}

.orange-gradient .stat-detail-icon {
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(251, 146, 60, 0.08) 100%);
}

.stat-detail-card:hover .stat-detail-icon {
  transform: rotate(5deg) scale(1.1);
}

.stat-detail-icon ion-icon {
  font-size: 1.75rem;
}

.blue-gradient .stat-detail-icon ion-icon {
  color: #667eea;
}

.green-gradient .stat-detail-icon ion-icon {
  color: #10b981;
}

.purple-gradient .stat-detail-icon ion-icon {
  color: #a855f7;
}

.orange-gradient .stat-detail-icon ion-icon {
  color: #f97316;
}

.stat-detail-label {
  font-size: 0.938rem;
  color: #9ca3af;
  margin-bottom: 0.5rem;
  font-weight: 500;
  letter-spacing: 0.3px;
}

.stat-detail-value {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  line-height: 1;
  margin-bottom: 0.75rem;
}

.stat-detail-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.813rem;
  color: #6b7280;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.stat-detail-meta ion-icon {
  font-size: 1rem;
}

.chart-section {
  animation: slideInUp 0.6s ease-out 0.25s;
  animation-fill-mode: both;
}

.section-header-simple {
  margin-bottom: 1.5rem;
}

.section-title-simple {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin: 0 0 0.25rem 0;
}

.section-subtitle-simple {
  font-size: 0.938rem;
  color: #9ca3af;
  margin: 0;
}

.chart-card-modern {
  background: rgba(31, 41, 55, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  border: 2px solid rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.chart-card-modern:hover {
  border-color: rgba(129, 140, 248, 0.3);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

@media (max-width: 767px) {
  .stats-cards-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-detail-value {
    font-size: 1.75rem;
  }
  
  .chart-card-modern {
    padding: 1.5rem;
  }
}

@media (min-width: 1200px) {
  .stats-cards-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* ====================================
   DOCUMENTS TAB - MODERN DESIGN
   ==================================== */

.documents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.document-card {
  background: rgba(31, 41, 55, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1.75rem;
  border: 2px solid rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideInUp 0.6s ease-out;
  animation-fill-mode: both;
}

.document-card:hover {
  transform: translateY(-4px);
  border-color: rgba(129, 140, 248, 0.3);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
}

.document-card:nth-child(1) {
  animation-delay: 0.05s;
}

.document-card:nth-child(2) {
  animation-delay: 0.1s;
}

.document-card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.document-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.4s ease;
}

.document-icon-wrapper.blue-gradient {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.08) 100%);
}

.document-icon-wrapper.purple-gradient {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(217, 70, 239, 0.08) 100%);
}

.document-card:hover .document-icon-wrapper {
  transform: rotate(5deg) scale(1.1);
}

.document-icon-wrapper ion-icon {
  font-size: 1.75rem;
}

.document-icon-wrapper.blue-gradient ion-icon {
  color: #667eea;
}

.document-icon-wrapper.purple-gradient ion-icon {
  color: #a855f7;
}

.document-header-text {
  flex: 1;
}

.document-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  margin: 0 0 0.25rem 0;
}

.document-subtitle {
  font-size: 0.875rem;
  color: #9ca3af;
  margin: 0;
}

.document-empty-state {
  text-align: center;
  padding: 2rem 1rem;
}

.empty-doc-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(129, 140, 248, 0.15);
}

.empty-doc-icon ion-icon {
  font-size: 2.5rem;
  color: #667eea;
}

.empty-doc-text {
  color: #9ca3af;
  font-size: 0.938rem;
  margin: 0 0 1.25rem 0;
}

.document-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.document-preview-wrapper {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.document-preview-wrapper:hover {
  transform: scale(1.02);
}

.document-preview-wrapper:hover .preview-overlay {
  opacity: 1;
}

.document-image-preview {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
  border-radius: 12px;
}

.document-file-preview {
  height: 200px;
  background: rgba(31, 41, 55, 0.4);
  border: 2px dashed rgba(129, 140, 248, 0.3);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.document-file-preview ion-icon {
  font-size: 3rem;
  color: #667eea;
}

.document-file-preview .pdf-label {
  color: white;
  font-size: 1rem;
  font-weight: 600;
}

.document-file-preview .pdf-hint {
  color: #9ca3af;
  font-size: 0.813rem;
  font-style: italic;
}

.preview-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 12px;
}

.preview-overlay ion-icon {
  font-size: 2.5rem;
  color: white;
}

.preview-overlay span {
  color: white;
  font-size: 0.938rem;
  font-weight: 500;
}

.document-actions-modern {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.document-actions-modern a-button {
  flex: 1;
  min-width: 140px;
}

@media (max-width: 767px) {
  .documents-grid {
    grid-template-columns: 1fr;
  }
  
  .document-actions-modern {
    flex-direction: column;
  }
  
  .document-actions-modern a-button {
    width: 100%;
  }
}

/* ====================================
   INSURANCE TAB - MODERN DESIGN
   ==================================== */

.insurance-empty-modern {
  text-align: center;
  padding: 4rem 1.5rem;
  animation: fadeIn 0.6s ease-in-out;
}

.empty-insurance-icon {
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(129, 140, 248, 0.2);
}

.empty-insurance-icon ion-icon {
  font-size: 4rem;
  color: #667eea;
}

.insurance-empty-modern h3 {
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
}

.insurance-empty-modern p {
  color: #9ca3af;
  font-size: 1rem;
  margin: 0 0 2rem 0;
  line-height: 1.6;
}

.insurance-content-modern {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.insurance-status-modern {
  background: rgba(31, 41, 55, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  border: 2px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideInUp 0.6s ease-out;
  position: relative;
  overflow: hidden;
}

.insurance-status-modern::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.insurance-status-modern.status-active::before {
  background: linear-gradient(90deg, #10b981 0%, #22c55e 100%);
}

.insurance-status-modern.status-expiring::before {
  background: linear-gradient(90deg, #f97316 0%, #fb923c 100%);
}

.insurance-status-modern.status-expired::before {
  background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
}

.insurance-status-modern:hover {
  transform: translateY(-2px);
  border-color: rgba(129, 140, 248, 0.3);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
}

.status-icon-modern {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.4s ease;
}

.status-active .status-icon-modern {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(34, 197, 94, 0.08) 100%);
}

.status-expiring .status-icon-modern {
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(251, 146, 60, 0.08) 100%);
}

.status-expired .status-icon-modern {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.08) 100%);
}

.insurance-status-modern:hover .status-icon-modern {
  transform: scale(1.1) rotate(5deg);
}

.status-icon-modern ion-icon {
  font-size: 2.25rem;
}

.status-active .status-icon-modern ion-icon {
  color: #10b981;
}

.status-expiring .status-icon-modern ion-icon {
  color: #f97316;
}

.status-expired .status-icon-modern ion-icon {
  color: #ef4444;
}

.status-info-modern {
  flex: 1;
}

.status-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin: 0 0 0.5rem 0;
}

.status-subtitle {
  font-size: 1rem;
  color: #9ca3af;
  margin: 0;
}

.insurance-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
  animation: slideInUp 0.6s ease-out 0.1s;
  animation-fill-mode: both;
}

.insurance-info-card {
  background: rgba(31, 41, 55, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 2px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.insurance-info-card:hover {
  transform: translateY(-2px);
  border-color: rgba(129, 140, 248, 0.3);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.info-card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.4s ease;
}

.info-card-icon.blue-gradient {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.08) 100%);
}

.info-card-icon.purple-gradient {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(217, 70, 239, 0.08) 100%);
}

.info-card-icon.orange-gradient {
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(251, 146, 60, 0.08) 100%);
}

.info-card-icon.green-gradient {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(34, 197, 94, 0.08) 100%);
}

.insurance-info-card:hover .info-card-icon {
  transform: rotate(5deg) scale(1.1);
}

.info-card-icon ion-icon {
  font-size: 1.5rem;
}

.info-card-icon.blue-gradient ion-icon {
  color: #667eea;
}

.info-card-icon.purple-gradient ion-icon {
  color: #a855f7;
}

.info-card-icon.orange-gradient ion-icon {
  color: #f97316;
}

.info-card-icon.green-gradient ion-icon {
  color: #10b981;
}

.info-card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-card-label {
  font-size: 0.875rem;
  color: #9ca3af;
  font-weight: 500;
  letter-spacing: 0.3px;
}

.info-card-value {
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  line-height: 1.3;
  word-break: break-word;
}

.edit-insurance-modern {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  animation: slideInUp 0.6s ease-out 0.2s;
  animation-fill-mode: both;
}

@media (max-width: 767px) {
  .insurance-info-grid {
    grid-template-columns: 1fr;
  }
  
  .insurance-status-modern {
    flex-direction: column;
    text-align: center;
  }
  
  .status-title {
    font-size: 1.25rem;
  }
  
  .edit-insurance-modern {
    max-width: 100%;
  }
}

@media (min-width: 1200px) {
  .insurance-info-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}


.clickable:active {
  transform: scale(0.98) translateX(4px);
}
</style>
