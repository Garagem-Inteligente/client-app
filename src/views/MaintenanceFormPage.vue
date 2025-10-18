<template>
  <ion-page>
    <ModernHeader
      :title="`${isEdit ? 'Editar' : 'Registrar'} Manutenção`"
      :show-back-button="true"
      back-path="/tabs/maintenance"
    />

    <ion-content :fullscreen="true" class="app-content">
      <!-- Background layers -->
      <div class="background-gradient"></div>
      <div class="background-pattern"></div>
      
      <div class="page-content-wrapper min-h-screen py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Card Container -->
          <div class="bg-gray-800 rounded-xl p-6 space-y-6 shadow-xl">
            <!-- Error Alert -->
            <AAlert
              v-if="vehiclesStore.error"
              type="error"
              :message="vehiclesStore.error"
              @close="vehiclesStore.clearError"
            />

            <!-- Success Alert -->
            <AAlert
              v-if="successMessage"
              type="success"
              :message="successMessage"
            />

            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Grid de Campos -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Veículo -->
                <div>
                  <label for="vehicleId" class="block text-sm font-medium text-gray-300 mb-2">
                    Veículo *
                  </label>
                  <select
                    id="vehicleId"
                    v-model="formData.vehicleId"
                    class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    :disabled="loading"
                  >
                    <option value="">Selecione um veículo</option>
                    <option 
                      v-for="vehicle in vehiclesStore.vehicles" 
                      :key="vehicle.id" 
                      :value="vehicle.id"
                    >
                      {{ vehicle.make }} {{ vehicle.model }} ({{ vehicle.plate }})
                    </option>
                  </select>
                </div>

                <!-- Tipo de Manutenção -->
                <div>
                  <label for="type" class="block text-sm font-medium text-gray-300 mb-2">
                    Tipo de Manutenção *
                  </label>
                  <select
                    id="type"
                    v-model="formData.type"
                    class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    :disabled="loading"
                  >
                    <optgroup 
                      v-for="group in MAINTENANCE_TYPE_OPTIONS" 
                      :key="group.category" 
                      :label="group.category"
                    >
                      <option 
                        v-for="option in group.options" 
                        :key="option.value" 
                        :value="option.value"
                      >
                        {{ option.emoji }} {{ option.label }}
                      </option>
                    </optgroup>
                  </select>
                </div>

                <!-- Descrição -->
                <div class="md:col-span-2">
                  <label for="description" class="block text-sm font-medium text-gray-300 mb-2">
                    Descrição *
                  </label>
                  <AInput
                    id="description"
                    v-model="formData.description"
                    type="text"
                    placeholder="Descreva o serviço realizado"
                    required
                    :disabled="loading"
                  />
                </div>

                <!-- Custo das Peças -->
                <div>
                  <label for="partsCost" class="block text-sm font-medium text-gray-300 mb-2">
                    💰 Custo das Peças (R$)
                  </label>
                  <input
                    id="partsCost"
                    v-model="displayPartsCost"
                    type="text"
                    inputmode="decimal"
                    placeholder="R$ 0,00"
                    :disabled="loading"
                    @input="handlePartsCostInput"
                    @blur="formatPartsCost"
                    class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p class="text-xs text-gray-500 mt-1">Custo dos materiais e peças utilizados</p>
                </div>

                <!-- Custo da Mão de Obra -->
                <div>
                  <label for="laborCost" class="block text-sm font-medium text-gray-300 mb-2">
                    🔧 Custo da Mão de Obra (R$)
                  </label>
                  <input
                    id="laborCost"
                    v-model="displayLaborCost"
                    type="text"
                    inputmode="decimal"
                    placeholder="R$ 0,00"
                    :disabled="loading"
                    @input="handleLaborCostInput"
                    @blur="formatLaborCost"
                    class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p class="text-xs text-gray-500 mt-1">Custo do serviço profissional</p>
                </div>

                <!-- Display do Total -->
                <div v-if="totalCost > 0" class="md:col-span-2 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-gray-300">💵 Custo Total:</span>
                    <span class="text-2xl font-bold text-blue-400">{{ formatCurrency(totalCost) }}</span>
                  </div>
                </div>

               

                <!-- Data da Manutenção -->
                <div>
                  <label for="date" class="block text-sm font-medium text-gray-300 mb-2">
                    Data da Manutenção *
                  </label>
                  <input
                    id="date"
                    v-model="formData.date"
                    type="date"
                    class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    :disabled="loading"
                    :max="maxDate.split('T')[0]"
                  />
                </div>

                <!-- Próxima Manutenção (Data) -->
                <div>
                  <label for="nextDueDate" class="block text-sm font-medium text-gray-300 mb-2">
                    Próxima Manutenção (Data)
                  </label>
                  <input
                    id="nextDueDate"
                    v-model="formData.nextDueDate"
                    type="date"
                    class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    :disabled="loading"
                    :min="formData.date.split('T')[0]"
                  />
                </div>

                <!-- Quilometragem -->
                <div>
                  <label for="mileage" class="block text-sm font-medium text-gray-300 mb-2">
                    Quilometragem *
                  </label>
                  <input
                    id="mileage"
                    v-model="displayMileage"
                    type="text"
                    inputmode="numeric"
                    placeholder="Ex: 50.000 km"
                    required
                    :disabled="loading"
                    @input="handleMileageInput"
                    @blur="formatMileage"
                    class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <!-- Próxima Manutenção (Km) -->
                <div>
                  <label for="nextDueMileage" class="block text-sm font-medium text-gray-300 mb-2">
                    Próxima Manutenção (Km)
                  </label>
                  <input
                    id="nextDueMileage"
                    v-model="displayNextMileage"
                    type="text"
                    inputmode="numeric"
                    placeholder="Ex: 55.000 km"
                    :disabled="loading"
                    @input="handleNextMileageInput"
                    @blur="formatNextMileage"
                    class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <!-- Prestador de Serviço -->
                <div>
                  <label for="serviceProvider" class="block text-sm font-medium text-gray-300 mb-2">
                    Prestador de Serviço
                  </label>
                  <AInput
                    id="serviceProvider"
                    v-model="formData.serviceProvider"
                    type="text"
                    placeholder="Nome da oficina ou mecânico"
                    :disabled="loading"
                  />
                </div>

                <!-- Observações -->
                <div class="md:col-span-2">
                  <label for="notes" class="block text-sm font-medium text-gray-300 mb-2">
                    Observações
                  </label>
                  <textarea
                    id="notes"
                    v-model="formData.notes"
                    rows="3"
                    class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Observações adicionais sobre a manutenção"
                    :disabled="loading"
                  ></textarea>
                </div>

                <!-- Fotos Antes/Depois -->
                <div class="md:col-span-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-lg p-4">
                  <div class="flex items-center space-x-2 mb-4">
                    <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span class="text-sm font-medium text-purple-300">📸 Fotos Antes/Depois (Opcional)</span>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Before Photo -->
                    <div>
                      <label class="block text-sm font-medium text-gray-300 mb-2">
                        Foto ANTES da Manutenção
                      </label>
                      <div class="flex gap-2">
                        <button
                          type="button"
                          @click="takePicture('before', 'camera')"
                          class="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white hover:bg-gray-700 transition-colors"
                          :disabled="loading"
                        >
                          📷 Câmera
                        </button>
                        <button
                          type="button"
                          @click="takePicture('before', 'gallery')"
                          class="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white hover:bg-gray-700 transition-colors"
                          :disabled="loading"
                        >
                          🖼️ Galeria
                        </button>
                      </div>
                      <p class="text-xs text-gray-500 mt-1">Estado da peça/problema antes do reparo</p>
                      
                      <!-- Preview Before -->
                      <transition name="fade">
                        <div v-if="formData.beforePhoto" class="mt-3 relative group">
                          <div class="relative overflow-hidden rounded-lg border-2 border-red-500 bg-gray-900">
                            <img 
                              :src="formData.beforePhoto" 
                              alt="Preview antes"
                              class="w-full h-48 object-contain"
                            />
                            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                              <p class="text-xs text-white font-medium">📸 Foto ANTES</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            @click="removePhoto('before')"
                            class="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </transition>
                    </div>

                    <!-- After Photo -->
                    <div>
                      <label class="block text-sm font-medium text-gray-300 mb-2">
                        Foto DEPOIS da Manutenção
                      </label>
                      <div class="flex gap-2">
                        <button
                          type="button"
                          @click="takePicture('after', 'camera')"
                          class="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white hover:bg-gray-700 transition-colors"
                          :disabled="loading"
                        >
                          📷 Câmera
                        </button>
                        <button
                          type="button"
                          @click="takePicture('after', 'gallery')"
                          class="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white hover:bg-gray-700 transition-colors"
                          :disabled="loading"
                        >
                          🖼️ Galeria
                        </button>
                      </div>
                      <p class="text-xs text-gray-500 mt-1">Estado da peça após o reparo concluído</p>
                      
                      <!-- Preview After -->
                      <transition name="fade">
                        <div v-if="formData.afterPhoto" class="mt-3 relative group">
                          <div class="relative overflow-hidden rounded-lg border-2 border-green-500 bg-gray-900">
                            <img 
                              :src="formData.afterPhoto" 
                              alt="Preview depois"
                              class="w-full h-48 object-contain"
                            />
                            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                              <p class="text-xs text-white font-medium">✅ Foto DEPOIS</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            @click="removePhoto('after')"
                            class="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </transition>
                    </div>
                  </div>
                </div>

                <!-- Anexos -->
                <div class="md:col-span-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div class="flex items-center space-x-2 mb-4">
                    <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span class="text-sm font-medium text-blue-300">📎 Anexos (Opcional)</span>
                  </div>
                  <p class="text-xs text-gray-400 mb-3">
                    Anexe notas fiscais, comprovantes ou outros documentos relacionados à manutenção.
                    Você pode adicionar até 5 arquivos (imagens ou PDFs de até 5MB cada).
                  </p>
                  <MFileUpload
                    ref="fileUploadRef"
                    :max-files="5"
                    :max-size="5"
                    accept="image/*,application/pdf"
                    @files-selected="handleFilesSelected"
                    @files-changed="handleFilesChanged"
                  />
                </div>
              </div>

              <!-- Botões de Ação -->
              <div class="flex justify-end space-x-4">
                <ion-button 
                  fill="outline" 
                  @click="handleCancel"
                  :disabled="loading"
                >
                  Cancelar
                </ion-button>
                <ion-button 
                  type="submit"
                  :disabled="loading || !isFormValid"
                >
                  <ion-spinner v-if="loading" slot="start" name="crescent"></ion-spinner>
                  {{ isEdit ? 'Atualizar' : 'Registrar' }}
                </ion-button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
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
  IonSpinner,
  toastController
} from '@ionic/vue'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { useVehiclesStore } from '@/stores/vehicles'
import type { MaintenanceType, MaintenanceAttachment } from '@/stores/vehicles'
import { MAINTENANCE_TYPE_OPTIONS } from '@/constants/vehicles'
import { applyCurrencyMask, applyMileageMask, unmaskCurrency, unmaskMileage } from '@/utils/masks'
import ModernHeader from '@/components/organisms/ModernHeader.vue'
import AAlert from '@/components/atoms/AAlert.vue'
import MFileUpload, { type FileUploadItem } from '@/components/molecules/MFileUpload.vue'

const route = useRoute()
const router = useRouter()
const vehiclesStore = useVehiclesStore()

const isEdit = ref(false)
const recordId = ref<string>('')
const loading = ref(false)
const successMessage = ref('')
const uploadedFiles = ref<FileUploadItem[]>([])
const fileUploadRef = ref<InstanceType<typeof MFileUpload>>()

const maxDate = new Date().toISOString()

const formData = ref({
  vehicleId: '',
  type: 'oil_change' as MaintenanceType,
  description: '',
  partsCost: 0 as string | number,
  laborCost: 0 as string | number,
  mileage: 0 as string | number,
  date: new Date().toISOString().split('T')[0],
  nextDueDate: '',
  nextDueMileage: 0 as string | number,
  serviceProvider: '',
  notes: '',
  beforePhoto: '',
  afterPhoto: ''
})

// Display values for masked inputs
const displayPartsCost = ref('')
const displayLaborCost = ref('')
const displayMileage = ref('')
const displayNextMileage = ref('')

const toNumber = (val: string | number): number => {
  if (typeof val === 'string') return parseFloat(val) || 0
  return val || 0
}

// Handlers para máscaras de moeda
const handlePartsCostInput = (event: Event) => {
  applyCurrencyMask(event)
  displayPartsCost.value = (event.target as HTMLInputElement).value
  formData.value.partsCost = unmaskCurrency(displayPartsCost.value)
}

const formatPartsCost = () => {
  const value = unmaskCurrency(displayPartsCost.value)
  if (value > 0) {
    displayPartsCost.value = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }
}

const handleLaborCostInput = (event: Event) => {
  applyCurrencyMask(event)
  displayLaborCost.value = (event.target as HTMLInputElement).value
  formData.value.laborCost = unmaskCurrency(displayLaborCost.value)
}

const formatLaborCost = () => {
  const value = unmaskCurrency(displayLaborCost.value)
  if (value > 0) {
    displayLaborCost.value = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }
}

// Handlers para máscaras de quilometragem
const handleMileageInput = (event: Event) => {
  applyMileageMask(event)
  displayMileage.value = (event.target as HTMLInputElement).value
  formData.value.mileage = unmaskMileage(displayMileage.value)
}

const formatMileage = () => {
  const value = unmaskMileage(displayMileage.value)
  if (value > 0) {
    displayMileage.value = new Intl.NumberFormat('pt-BR').format(value)
  }
}

const handleNextMileageInput = (event: Event) => {
  applyMileageMask(event)
  displayNextMileage.value = (event.target as HTMLInputElement).value
  formData.value.nextDueMileage = unmaskMileage(displayNextMileage.value)
}

const formatNextMileage = () => {
  const value = unmaskMileage(displayNextMileage.value)
  if (value > 0) {
    displayNextMileage.value = new Intl.NumberFormat('pt-BR').format(value)
  }
}

const totalCost = computed(() => {
  return toNumber(formData.value.partsCost) + toNumber(formData.value.laborCost)
})

const isFormValid = computed(() => {
  return (
    formData.value.vehicleId &&
    formData.value.type &&
    formData.value.description &&
    formData.value.date &&
    toNumber(formData.value.mileage) > 0
  )
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const takePicture = async (photoType: 'before' | 'after', sourceType: 'camera' | 'gallery') => {
  try {
    const source = sourceType === 'camera' ? CameraSource.Camera : CameraSource.Photos
    
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: source,
      webUseInput: true, // Para web, usar input file
      promptLabelHeader: sourceType === 'camera' ? 'Tirar Foto' : 'Escolher da Galeria',
      promptLabelCancel: 'Cancelar',
      promptLabelPhoto: 'Galeria',
      promptLabelPicture: 'Câmera'
    })

    if (image.dataUrl) {
      console.log(`📸 Foto ${photoType} capturada, tamanho:`, image.dataUrl.length, 'bytes')
      
      if (photoType === 'before') {
        formData.value.beforePhoto = image.dataUrl
        console.log('✅ beforePhoto atualizado:', formData.value.beforePhoto.substring(0, 50) + '...')
      } else {
        formData.value.afterPhoto = image.dataUrl
        console.log('✅ afterPhoto atualizado:', formData.value.afterPhoto.substring(0, 50) + '...')
      }
      
      // Show success toast
      const toast = await toastController.create({
        message: `✅ Foto ${photoType === 'before' ? 'ANTES' : 'DEPOIS'} adicionada!`,
        duration: 1500,
        position: 'bottom',
        color: 'success'
      })
      await toast.present()
    }
  } catch (error: any) {
    console.error('Error taking/selecting picture:', error)
    
    // Only show error if user didn't cancel
    if (error.message !== 'User cancelled photos app') {
      const toast = await toastController.create({
        message: '❌ Erro ao carregar foto.',
        duration: 2000,
        position: 'bottom',
        color: 'danger'
      })
      await toast.present()
    }
  }
}

const removePhoto = (photoType: 'before' | 'after') => {
  if (photoType === 'before') {
    formData.value.beforePhoto = ''
  } else {
    formData.value.afterPhoto = ''
  }
  
  console.log(`🗑️ Foto ${photoType} removida`)
}

const handleFilesSelected = (files: FileUploadItem[]) => {
  uploadedFiles.value = files
}

const handleFilesChanged = (files: FileUploadItem[]) => {
  uploadedFiles.value = files
}

const handleSubmit = async () => {
  if (!isFormValid.value || loading.value) return

  loading.value = true
  vehiclesStore.clearError()

  try {
    // Process attachments
    const attachments: MaintenanceAttachment[] = []
    if (uploadedFiles.value.length > 0) {
      for (const item of uploadedFiles.value) {
        if (item.base64 && !item.error) {
          attachments.push({
            name: item.file.name,
            data: item.base64,
            uploadedAt: new Date(),
            type: item.file.type,
            size: item.file.size
          })
        }
      }
    }

    const recordData = {
      vehicleId: formData.value.vehicleId,
      type: formData.value.type,
      description: formData.value.description,
      cost: totalCost.value,
      partsCost: toNumber(formData.value.partsCost) || undefined,
      laborCost: toNumber(formData.value.laborCost) || undefined,
      mileage: toNumber(formData.value.mileage),
      date: new Date(formData.value.date),
      nextDueDate: formData.value.nextDueDate ? new Date(formData.value.nextDueDate) : undefined,
      nextDueMileage: toNumber(formData.value.nextDueMileage) || undefined,
      serviceProvider: formData.value.serviceProvider || undefined,
      notes: formData.value.notes || undefined,
      beforePhoto: formData.value.beforePhoto || undefined,
      afterPhoto: formData.value.afterPhoto || undefined,
      attachments: attachments.length > 0 ? attachments : undefined
    }

    const success = await vehiclesStore.addMaintenanceRecord(recordData)

    if (success) {
      successMessage.value = 'Manutenção registrada com sucesso!'
      
      // Show toast
      const toast = await toastController.create({
        message: '✅ Manutenção registrada com sucesso!',
        duration: 2000,
        position: 'top',
        color: 'success'
      })
      await toast.present()

      // Navigate back after a short delay
      setTimeout(() => {
        router.push('/tabs/maintenance')
      }, 1500)
    }
  } catch (error) {
    console.error('Error submitting maintenance:', error)
    
    const toast = await toastController.create({
      message: '❌ Erro ao registrar manutenção',
      duration: 3000,
      position: 'top',
      color: 'danger'
    })
    await toast.present()
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  router.back()
}

onMounted(async () => {
  await vehiclesStore.fetchVehicles()

  // Check if editing
  if (route.params.id) {
    isEdit.value = true
    recordId.value = route.params.id as string
    // TODO: Load existing maintenance data
  }

  // Pre-fill vehicle if provided
  const vehicleId = route.query.vehicleId as string
  if (vehicleId) {
    formData.value.vehicleId = vehicleId
  }
})
</script>

<style scoped>
/* Toolbar Dark Theme */
.toolbar-dark {
  --background: #1f2937;
  --color: white;
  --border-color: #374151;
}

/* Garantir que as classes Tailwind sejam aplicadas */
ion-content {
  --background: #111827;
}

/* Labels - replicar Tailwind */
label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #d1d5db;
  margin-bottom: 0.5rem;
}

/* Select inputs */
select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  background-color: #1f2937;
  border: 1px solid #4b5563;
  border-radius: 0.375rem;
  color: white;
  font-size: 0.875rem;
}

select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Input date */
input[type="date"],
input[type="number"],
input[type="text"] {
  width: 100%;
  padding: 0.5rem 0.75rem;
  background-color: #1f2937;
  border: 1px solid #4b5563;
  border-radius: 0.375rem;
  color: white;
  font-size: 0.875rem;
}

input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Textarea */
textarea {
  width: 100%;
  padding: 0.5rem 0.75rem;
  background-color: #1f2937;
  border: 1px solid #4b5563;
  border-radius: 0.375rem;
  color: white;
  font-size: 0.875rem;
  resize: vertical;
}

textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Buttons */
button[type="button"] {
  cursor: pointer;
  transition: all 0.2s;
}

button[type="button"]:hover:not(:disabled) {
  background-color: #374151;
}

button[type="button"]:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Helper text */
p.text-xs {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.25rem;
}

/* Group hover for photo previews */
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

/* Fade transition for photo previews */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Image preview container */
.group {
  position: relative;
}

.group img {
  display: block;
  width: 100%;
}

/* Remove button on hover */
.group button {
  transition: opacity 0.2s ease;
}
</style>

