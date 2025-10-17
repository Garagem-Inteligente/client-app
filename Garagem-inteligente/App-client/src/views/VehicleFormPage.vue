<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/vehicles"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ isEdit ? 'Editar Veículo' : 'Adicionar Veículo' }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="form-page">
        <form @submit.prevent="handleSubmit" class="form-content">
          <!-- Error Alert -->
          <div v-if="vehiclesStore.error" class="alert alert-error">
            <div class="alert-body">
              <svg class="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ vehiclesStore.error }}</span>
              <button type="button" @click="vehiclesStore.clearError" class="alert-close">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Info Alert -->
          <div v-if="!isEdit" class="alert alert-info">
            <div class="alert-body">
              <svg class="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-sm">Use os campos de busca abaixo para encontrar seu veículo na tabela FIPE</span>
            </div>
          </div>

          <!-- Main Fields Grid -->
          <div class="fields-grid">
            <!-- Brand (FIPE) -->
            <div v-if="!isEdit">
              <MSearchableSelectFipe
                v-model="formData.brandCode"
                :options="brands"
                label="Marca"
                placeholder="Digite para buscar a marca..."
                :loading="loadingBrands"
                :disabled="vehiclesStore.loading"
                required
                @select="handleBrandSelect"
              />
            </div>

            <!-- Brand (Manual) -->
            <div v-else>
              <label for="make" class="field-label">
                Marca *
              </label>
              <input
                id="make"
                v-model="formData.make"
                type="text"
                placeholder="Ex: Toyota, Honda, Ford"
                required
                :disabled="vehiclesStore.loading"
                class="field-input"
              />
            </div>

            <!-- Model (FIPE) -->
            <div v-if="!isEdit">
              <MSearchableSelectFipe
                v-model="formData.modelCode"
                :options="models"
                label="Modelo"
                placeholder="Selecione primeiro a marca..."
                :loading="loadingModels"
                :disabled="vehiclesStore.loading || !formData.brandCode"
                required
                @select="handleModelSelect"
              />
            </div>

            <!-- Model (Manual) -->
            <div v-else>
              <label for="model" class="field-label">
                Modelo *
              </label>
              <input
                id="model"
                v-model="formData.model"
                type="text"
                placeholder="Ex: Corolla, Civic, Focus"
                required
                :disabled="vehiclesStore.loading"
                class="field-input"
              />
            </div>

            <!-- Year (FIPE) -->
            <div v-if="!isEdit">
              <MSearchableSelectFipe
                v-model="formData.yearCode"
                :options="years"
                label="Ano"
                placeholder="Selecione primeiro o modelo..."
                :loading="loadingYears"
                :disabled="vehiclesStore.loading || !formData.modelCode"
                required
                @select="handleYearSelect"
              />
            </div>

            <!-- Year (Manual) -->
            <div v-else>
              <label for="year" class="field-label">
                Ano *
              </label>
              <input
                id="year"
                v-model.number="formData.year"
                type="number"
                :min="1900"
                :max="new Date().getFullYear() + 1"
                required
                :disabled="vehiclesStore.loading"
                class="field-input"
              />
            </div>

            <!-- Plate -->
            <div>
              <label for="plate" class="field-label">
                Placa *
              </label>
              <input
                id="plate"
                v-model="formData.plate"
                type="text"
                placeholder="ABC-1234"
                required
                :disabled="vehiclesStore.loading"
                class="field-input"
                maxlength="8"
              />
            </div>

            <!-- Color -->
            <div>
              <label for="color" class="field-label">
                Cor
              </label>
              <input
                id="color"
                v-model="formData.color"
                type="text"
                placeholder="Ex: Branco, Preto, Prata"
                :disabled="vehiclesStore.loading"
                class="field-input"
              />
            </div>

            <!-- Mileage -->
            <div>
              <label for="mileage" class="field-label">
                Quilometragem *
              </label>
              <input
                id="mileage"
                v-model.number="formData.mileage"
                type="number"
                min="0"
                placeholder="0"
                required
                :disabled="vehiclesStore.loading"
                class="field-input"
              />
            </div>

            <!-- Vehicle Type -->
            <div>
              <label for="vehicleType" class="field-label">
                Tipo de Veículo *
              </label>
              <select
                id="vehicleType"
                v-model="formData.vehicleType"
                required
                :disabled="vehiclesStore.loading"
                class="field-select"
              >
                <option value="">Selecione o tipo</option>
                <option value="car">🚗 Carro</option>
                <option value="motorcycle">🏍️ Moto</option>
                <option value="van">🚐 Van</option>
                <option value="truck">🚚 Caminhão</option>
                <option value="bus">🚌 Ônibus</option>
                <option value="pickup">🛻 Caminhonete</option>
              </select>
            </div>

            <!-- Fuel Type -->
            <div>
              <label for="fuelType" class="field-label">
                Tipo de Combustível *
              </label>
              <select
                id="fuelType"
                v-model="formData.fuelType"
                required
                :disabled="vehiclesStore.loading"
                class="field-select"
              >
                <option value="">Selecione o combustível</option>
                <option value="flex">⛽ Flex (Gasolina/Etanol)</option>
                <option value="gasoline">⛽ Gasolina</option>
                <option value="ethanol">🌱 Álcool (Etanol)</option>
                <option value="diesel">🛢️ Diesel</option>
                <option value="electric">🔋 Elétrico</option>
                <option value="hybrid-plugin">🔌 Híbrido Plugin</option>
                <option value="hybrid-mild">🔋 Híbrido Leve</option>
                <option value="gnv">💨 GNV (Gás Natural)</option>
              </select>
            </div>
          </div>

          <!-- Photo Section -->
          <div class="section-divider"></div>
          <div class="photo-section">
            <div class="photo-header">
              <svg class="photo-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="photo-title">📸 Foto do Veículo (Opcional)</span>
            </div>

            <div class="photo-content">
              <label class="field-label">Adicionar Foto</label>
              <input
                type="file"
                accept="image/*"
                @change="handlePhotoUpload"
                :disabled="vehiclesStore.loading"
                class="file-input"
              />
              <p class="photo-hint">Imagem do veículo (máx 2MB)</p>

              <!-- Preview -->
              <div v-if="formData.imageUrl" class="photo-preview-wrapper">
                <img
                  :src="formData.imageUrl"
                  alt="Preview do veículo"
                  class="photo-preview"
                />
                <button
                  type="button"
                  @click="formData.imageUrl = ''"
                  class="photo-remove"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <!-- Upload Error -->
              <div v-if="uploadError" class="alert alert-error alert-small">
                <div class="alert-body">
                  <svg class="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{{ uploadError }}</span>
                  <button type="button" @click="uploadError = ''" class="alert-close">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Insurance Section -->
          <div class="section-divider"></div>
          <div class="insurance-section">
            <h3 class="section-title">
              <svg class="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Dados do Seguro
              <span class="section-subtitle">(Opcional)</span>
            </h3>

            <div class="fields-grid">
              <!-- Insurance Company -->
              <div>
                <label for="insuranceCompany" class="field-label">
                  Seguradora
                </label>
                <input
                  id="insuranceCompany"
                  v-model="formData.insuranceCompany"
                  type="text"
                  placeholder="Ex: Porto Seguro, Itaú, Allianz"
                  :disabled="vehiclesStore.loading"
                  class="field-input"
                />
              </div>

              <!-- Insurance Phone -->
              <div>
                <label for="insurancePhone" class="field-label">
                  Telefone da Seguradora
                </label>
                <input
                  id="insurancePhone"
                  v-model="formData.insurancePhone"
                  type="tel"
                  placeholder="Ex: 0800 123 4567"
                  :disabled="vehiclesStore.loading"
                  class="field-input"
                />
              </div>

              <!-- Policy Number -->
              <div>
                <label for="insurancePolicyNumber" class="field-label">
                  Número da Apólice
                </label>
                <input
                  id="insurancePolicyNumber"
                  v-model="formData.insurancePolicyNumber"
                  type="text"
                  placeholder="Ex: 123456789"
                  :disabled="vehiclesStore.loading"
                  class="field-input"
                />
              </div>

              <!-- Expiry Date -->
              <div>
                <label for="insuranceExpiryDate" class="field-label">
                  Data de Vencimento
                </label>
                <input
                  id="insuranceExpiryDate"
                  v-model="formData.insuranceExpiryDate"
                  type="date"
                  :disabled="vehiclesStore.loading"
                  class="field-input"
                />
              </div>

              <!-- Insurance Value -->
              <div class="full-width">
                <label for="insuranceValue" class="field-label">
                  Valor do Seguro (Anual)
                </label>
                <input
                  id="insuranceValue"
                  v-model.number="formData.insuranceValue"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="R$ 0,00"
                  :disabled="vehiclesStore.loading"
                  class="field-input"
                />
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="form-actions">
            <button
              type="button"
              @click="handleCancel"
              :disabled="vehiclesStore.loading"
              class="btn btn-outline"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="!isFormValid || vehiclesStore.loading"
              class="btn btn-primary"
            >
              <span v-if="vehiclesStore.loading">Salvando...</span>
              <span v-else>{{ isEdit ? 'Atualizar' : 'Adicionar' }}</span>
            </button>
          </div>
        </form>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton
} from '@ionic/vue'
import { useVehiclesStore, type VehicleType, type FuelType } from '@/stores/vehicles'
import { fipeApi, type FipeVehicleType } from '@/services/fipeApi'
import MSearchableSelectFipe from '@/components/molecules/MSearchableSelectFipe.vue'

const router = useRouter()
const route = useRoute()
const vehiclesStore = useVehiclesStore()

const isEdit = computed(() => !!route.params.id && route.params.id !== 'new')

// FIPE State
const vehicleType = ref<FipeVehicleType>('cars')
const brands = ref<Array<{ code: string; name: string }>>([])
const models = ref<Array<{ code: string; name: string }>>([])
const years = ref<Array<{ code: string; name: string }>>([])

const loadingBrands = ref(false)
const loadingModels = ref(false)
const loadingYears = ref(false)
const uploadError = ref('')

// Form Data
const formData = ref({
  vehicleType: 'car' as VehicleType,
  make: '',
  model: '',
  year: new Date().getFullYear(),
  plate: '',
  color: '',
  mileage: 0,
  fuelType: 'flex' as FuelType,
  imageUrl: '',
  brandCode: '',
  modelCode: '',
  yearCode: '',
  insuranceCompany: '',
  insurancePhone: '',
  insurancePolicyNumber: '',
  insuranceExpiryDate: '',
  insuranceValue: 0
})

const isFormValid = computed(() => {
  return formData.value.make && formData.value.model && formData.value.plate
})

// Load brands
const loadBrands = async () => {
  try {
    loadingBrands.value = true
    brands.value = await fipeApi.getBrandsByType(vehicleType.value)
  } catch (error) {
    console.error('Erro ao carregar marcas:', error)
    brands.value = []
  } finally {
    loadingBrands.value = false
  }
}

// Watch brand selection
watch(() => formData.value.brandCode, async (newBrandCode) => {
  if (!newBrandCode) {
    models.value = []
    years.value = []
    formData.value.modelCode = ''
    formData.value.yearCode = ''
    return
  }

  try {
    loadingModels.value = true
    models.value = await fipeApi.getModelsByBrand(vehicleType.value, newBrandCode)
    years.value = []
    formData.value.yearCode = ''
  } catch (error) {
    console.error('Erro ao carregar modelos:', error)
    models.value = []
  } finally {
    loadingModels.value = false
  }
})

// Watch model selection
watch(() => formData.value.modelCode, async (newModelCode) => {
  if (!newModelCode || !formData.value.brandCode) {
    years.value = []
    formData.value.yearCode = ''
    return
  }

  try {
    loadingYears.value = true
    years.value = await fipeApi.getYearsByModel(
      vehicleType.value,
      formData.value.brandCode,
      newModelCode
    )
  } catch (error) {
    console.error('Erro ao carregar anos:', error)
    years.value = []
  } finally {
    loadingYears.value = false
  }
})

const handleBrandSelect = (option: { code: string; name: string }) => {
  formData.value.make = option.name
}

const handleModelSelect = (option: { code: string; name: string }) => {
  formData.value.model = option.name
}

const handleYearSelect = (option: { code: string; name: string }) => {
  // Extract year from name (ex: "2023 Gasolina" -> 2023)
  const yearMatch = option.name.match(/^\d{4}/)
  if (yearMatch) {
    formData.value.year = parseInt(yearMatch[0])
  }

  // Try to extract fuel type from name
  const nameLower = option.name.toLowerCase()
  if (nameLower.includes('diesel')) {
    formData.value.fuelType = 'diesel'
  } else if (nameLower.includes('elétrico') || nameLower.includes('eletrico')) {
    formData.value.fuelType = 'electric'
  } else if (nameLower.includes('etanol') || nameLower.includes('álcool')) {
    formData.value.fuelType = 'ethanol'
  } else if (nameLower.includes('flex')) {
    formData.value.fuelType = 'flex'
  } else if (nameLower.includes('híbrido') || nameLower.includes('hibrido')) {
    formData.value.fuelType = nameLower.includes('plugin') ? 'hybrid-plugin' : 'hybrid-mild'
  } else if (nameLower.includes('gnv')) {
    formData.value.fuelType = 'gnv'
  } else if (nameLower.includes('gasolina')) {
    formData.value.fuelType = 'gasoline'
  }
}

// Photo handling (Web only)
const handlePhotoUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  // Validate file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    uploadError.value = 'A foto deve ter no máximo 2MB'
    input.value = ''
    return
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    uploadError.value = 'Apenas imagens são permitidas'
    input.value = ''
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    formData.value.imageUrl = e.target?.result as string
    uploadError.value = ''
  }
  reader.onerror = () => {
    uploadError.value = 'Erro ao carregar imagem'
  }
  reader.readAsDataURL(file)
}

const handleSubmit = async () => {
  if (!isFormValid.value) return

  try {
    const vehicleData = {
      vehicleType: formData.value.vehicleType,
      make: formData.value.make,
      model: formData.value.model,
      year: formData.value.year,
      plate: formData.value.plate,
      color: formData.value.color,
      mileage: formData.value.mileage,
      fuelType: formData.value.fuelType,
      ...(formData.value.imageUrl && { imageUrl: formData.value.imageUrl }),
      ...(formData.value.insuranceCompany && { insuranceCompany: formData.value.insuranceCompany }),
      ...(formData.value.insurancePhone && { insurancePhone: formData.value.insurancePhone }),
      ...(formData.value.insurancePolicyNumber && { insurancePolicyNumber: formData.value.insurancePolicyNumber }),
      ...(formData.value.insuranceExpiryDate && { insuranceExpiryDate: formData.value.insuranceExpiryDate }),
      ...(formData.value.insuranceValue && { insuranceValue: formData.value.insuranceValue })
    }

    if (isEdit.value) {
      await vehiclesStore.updateVehicle(route.params.id as string, vehicleData)
    } else {
      await vehiclesStore.addVehicle(vehicleData)
    }

    router.push('/tabs/vehicles')
  } catch (error) {
    console.error('Erro ao salvar veículo:', error)
  }
}

const handleCancel = () => {
  router.back()
}

onMounted(async () => {
  if (isEdit.value) {
    const vehicle = vehiclesStore.getVehicleById(route.params.id as string)
    if (vehicle) {
      formData.value = {
        vehicleType: vehicle.vehicleType,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        plate: vehicle.plate,
        color: vehicle.color || '',
        mileage: vehicle.mileage,
        fuelType: vehicle.fuelType,
        imageUrl: vehicle.imageUrl || '',
        brandCode: '',
        modelCode: '',
        yearCode: '',
        insuranceCompany: vehicle.insuranceCompany || '',
        insurancePhone: vehicle.insurancePhone || '',
        insurancePolicyNumber: vehicle.insurancePolicyNumber || '',
        insuranceExpiryDate: vehicle.insuranceExpiryDate
          ? (vehicle.insuranceExpiryDate instanceof Date
              ? vehicle.insuranceExpiryDate.toISOString().split('T')[0]
              : String(vehicle.insuranceExpiryDate).split('T')[0])
          : '',
        insuranceValue: vehicle.insuranceValue || 0
      }
    }
  } else {
    // Load brands for new vehicle
    await loadBrands()
  }
})
</script>

<style scoped>
/* Page Container */
.form-page {
  min-height: 100%;
  background: #111827; /* gray-900 */
}

.form-content {
  max-width: 896px; /* max-w-4xl */
  margin: 0 auto;
  padding: 2rem 1rem;
}

/* Alerts */
.alert {
  padding: 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1.5rem;
}

.alert-error {
  background: rgba(153, 27, 27, 0.2); /* bg-red-900/20 */
  border: 1px solid rgba(239, 68, 68, 0.3); /* border-red-500/30 */
  color: #f87171; /* text-red-400 */
}

.alert-info {
  background: rgba(37, 99, 235, 0.1); /* bg-blue-900/10 */
  border: 1px solid rgba(59, 130, 246, 0.3); /* border-blue-500/30 */
  color: #93c5fd; /* text-blue-300 */
}

.alert-small {
  padding: 0.75rem;
  margin-top: 0.5rem;
  margin-bottom: 0;
}

.alert-body {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.alert-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

.alert-close {
  margin-left: auto;
  padding: 0;
  background: none;
  border: none;
  color: currentColor;
  cursor: pointer;
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.alert-close:hover {
  opacity: 0.7;
}

.alert-close svg {
  width: 100%;
  height: 100%;
}

/* Fields Grid */
.fields-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem 1.5rem;
  margin-bottom: 1.5rem;
}

@media (min-width: 768px) {
  .fields-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.full-width {
  grid-column: 1 / -1;
}

/* Field Styles */
.field-label {
  display: block;
  font-size: 0.875rem; /* text-sm */
  font-weight: 500; /* font-medium */
  color: #d1d5db; /* text-gray-300 */
  margin-bottom: 0.5rem;
}

.field-input,
.field-select {
  width: 100%;
  padding: 0.5rem 0.75rem; /* py-2 px-3 */
  background-color: #1f2937; /* bg-gray-800 */
  border: 1px solid #4b5563; /* border-gray-600 */
  border-radius: 0.375rem; /* rounded-md */
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.2s;
}

.field-input:focus,
.field-select:focus {
  outline: none;
  ring: 2px;
  ring-color: #3b82f6; /* ring-blue-500 */
  border-color: transparent;
}

.field-input::placeholder {
  color: #6b7280; /* text-gray-500 */
}

.field-input:disabled,
.field-select:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Section Divider */
.section-divider {
  border-top: 1px solid #374151; /* border-gray-700 */
  padding-top: 1.5rem;
  margin-top: 0.5rem;
}

/* Photo Section */
.photo-section {
  background: linear-gradient(to right, rgba(59, 130, 246, 0.1), rgba(168, 85, 247, 0.1)); /* from-blue-500/10 to-purple-500/10 */
  border: 1px solid rgba(59, 130, 246, 0.3); /* border-blue-500/30 */
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.photo-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.photo-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #60a5fa; /* text-blue-400 */
}

.photo-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #93c5fd; /* text-blue-300 */
}

.photo-content {
  margin-top: 1rem;
}

.file-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  background-color: #1f2937;
  border: 1px solid #4b5563;
  border-radius: 0.375rem;
  color: #ffffff;
  font-size: 0.875rem;
  cursor: pointer;
}

.file-input::file-selector-button {
  margin-right: 1rem;
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: #ffffff;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}

.file-input::file-selector-button:hover {
  background-color: #2563eb;
}

.file-input:focus {
  outline: none;
  ring: 2px;
  ring-color: #3b82f6;
}

.photo-hint {
  font-size: 0.75rem; /* text-xs */
  color: #6b7280; /* text-gray-500 */
  margin-top: 0.25rem;
}

.photo-preview-wrapper {
  margin-top: 0.75rem;
  position: relative;
  display: inline-block;
  max-width: 28rem; /* max-w-md */
}

.photo-preview {
  width: 100%;
  height: 12rem; /* h-48 */
  object-fit: cover;
  border-radius: 0.375rem;
  border: 2px solid #3b82f6; /* border-blue-500 */
}

.photo-remove {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: #dc2626; /* bg-red-600 */
  color: #ffffff;
  border: none;
  border-radius: 9999px;
  padding: 0.5rem;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
}

.photo-preview-wrapper:hover .photo-remove {
  opacity: 1;
}

.photo-remove:hover {
  background-color: #b91c1c; /* hover:bg-red-700 */
}

.photo-remove svg {
  width: 1rem;
  height: 1rem;
}

/* Insurance Section */
.insurance-section {
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.125rem; /* text-lg */
  font-weight: 500; /* font-medium */
  color: #ffffff;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}

.section-icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.5rem;
  color: #60a5fa; /* text-blue-400 */
}

.section-subtitle {
  margin-left: 0.5rem;
  font-size: 0.875rem;
  color: #9ca3af; /* text-gray-400 */
  font-weight: 400;
}

/* Form Actions */
.form-actions {
  display: flex;
  flex-direction: column-reverse;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

@media (min-width: 640px) {
  .form-actions {
    flex-direction: row;
    justify-content: flex-end;
  }
}

/* Buttons */
.btn {
  padding: 0.5rem 1.5rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  flex: 1;
}

@media (min-width: 640px) {
  .btn {
    flex: 0 0 auto;
    min-width: 120px;
  }
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #3b82f6; /* bg-blue-500 */
  color: #ffffff;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2563eb; /* hover:bg-blue-600 */
}

.btn-outline {
  background-color: transparent;
  color: #ffffff;
  border: 1px solid #4b5563; /* border-gray-600 */
}

.btn-outline:hover:not(:disabled) {
  background-color: #374151; /* hover:bg-gray-700 */
}
</style>
