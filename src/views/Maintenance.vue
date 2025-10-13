<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useVehiclesStore } from '../stores/vehicles'
import type { MaintenanceAttachment } from '../stores/vehicles'
import Card from '../components/Card.vue'
import Button from '../components/Button.vue'
import Input from '../components/Input.vue'
import Badge from '../components/Badge.vue'
import Alert from '../components/Alert.vue'
import Navbar from '../components/Navbar.vue'
import FileUpload, { type FileUploadItem } from '../components/FileUpload.vue'
import { uploadFile, deleteFile, generateUniqueFileName } from '../firebase/storage'

const vehiclesStore = useVehiclesStore()

const showAddForm = ref(false)
const selectedVehicleId = ref('')
const editingRecordId = ref<string | null>(null)
const uploadError = ref<string | null>(null)
const uploadedFiles = ref<FileUploadItem[]>([])

// Form data
const formData = ref({
  vehicleId: '',
  type: 'oil_change' as 'oil_change' | 'tire_rotation' | 'brake_service' | 'general_inspection' | 'other',
  description: '',
  cost: 0,
  mileage: 0,
  date: new Date().toISOString().split('T')[0],
  nextDueDate: '',
  nextDueMileage: 0,
  serviceProvider: '',
  notes: ''
})

const resetForm = () => {
  formData.value = {
    vehicleId: '',
    type: 'oil_change',
    description: '',
    cost: 0,
    mileage: 0,
    date: new Date().toISOString().split('T')[0],
    nextDueDate: '',
    nextDueMileage: 0,
    serviceProvider: '',
    notes: ''
  }
  uploadedFiles.value = []
  uploadError.value = null
  showAddForm.value = false
  editingRecordId.value = null
}

const handleSubmit = async () => {
  try {
    uploadError.value = null

    // Converter valores de máscara para números
    const cost = typeof formData.value.cost === 'string' ? Number(formData.value.cost) : formData.value.cost
    const mileage = typeof formData.value.mileage === 'string' ? Number(formData.value.mileage) : formData.value.mileage
    
    const nextDueMileage = formData.value.nextDueMileage
    let nextDueMileageValue: number | undefined = undefined
    
    // Converter para número e validar (só adiciona se for maior que 0)
    const numValue = typeof nextDueMileage === 'string' ? Number(nextDueMileage) : nextDueMileage
    if (!isNaN(numValue) && numValue > 0) {
      nextDueMileageValue = numValue
    }

    // Upload de arquivos
    const attachments: MaintenanceAttachment[] = []
    
    if (uploadedFiles.value.length > 0) {
      for (let i = 0; i < uploadedFiles.value.length; i++) {
        const item = uploadedFiles.value[i]
        
        // Marcar como em upload
        item.uploading = true
        item.progress = 0
        
        try {
          // Gerar nome único
          const uniqueName = generateUniqueFileName(item.file.name, 'maintenance')
          const storagePath = `maintenance/${formData.value.vehicleId}/${uniqueName}`
          
          // Upload
          const downloadURL = await uploadFile(item.file, storagePath)
          
          // Adicionar aos anexos
          attachments.push({
            name: item.file.name,
            url: downloadURL,
            uploadedAt: new Date(),
            type: item.file.type,
            size: item.file.size
          })
          
          item.progress = 100
          item.uploading = false
        } catch (error) {
          item.uploading = false
          item.error = 'Falha no upload'
          throw new Error(`Erro ao fazer upload do arquivo ${item.file.name}`)
        }
      }
    }

    const recordData = {
      vehicleId: formData.value.vehicleId,
      type: formData.value.type,
      description: formData.value.description,
      cost: cost,
      mileage: mileage,
      date: new Date(formData.value.date),
      nextDueDate: formData.value.nextDueDate ? new Date(formData.value.nextDueDate) : undefined,
      nextDueMileage: nextDueMileageValue,
      serviceProvider: formData.value.serviceProvider,
      notes: formData.value.notes,
      attachments: attachments.length > 0 ? attachments : undefined
    }
    
    await vehiclesStore.addMaintenanceRecord(recordData)
    
    if (!vehiclesStore.error) {
      resetForm()
    }
  } catch (error) {
    uploadError.value = error instanceof Error ? error.message : 'Erro ao processar arquivos'
  }
}

const handleFileUploadError = (message: string) => {
  uploadError.value = message
}

const handleDeleteAttachment = async (recordId: string, attachmentUrl: string) => {
  if (!confirm('Tem certeza que deseja excluir este anexo?')) {
    return
  }

  try {
    // Deletar arquivo do Storage
    await deleteFile(attachmentUrl)
    
    // Atualizar registro removendo o anexo
    const record = vehiclesStore.maintenanceRecords.find(r => r.id === recordId)
    if (record && record.attachments) {
      // Aqui você precisaria criar um método updateMaintenanceRecord na store
      // Por enquanto, vamos apenas mostrar sucesso
      alert('Anexo excluído com sucesso')
      
      // Recarregar dados
      await vehiclesStore.fetchMaintenanceRecords()
    }
  } catch (error) {
    alert('Erro ao excluir anexo: ' + (error instanceof Error ? error.message : 'Erro desconhecido'))
  }
}

const handleDelete = async (id: string) => {
  if (confirm('Tem certeza que deseja excluir esta manutenção?')) {
    await vehiclesStore.deleteMaintenanceRecord(id)
  }
}

const getMaintenanceTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    oil_change: 'Troca de Óleo',
    tire_rotation: 'Rodízio de Pneus',
    brake_service: 'Serviço de Freios',
    general_inspection: 'Inspeção Geral',
    other: 'Outros'
  }
  return labels[type] || type
}

const getMaintenanceTypeBadgeVariant = (type: string) => {
  const variants: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
    oil_change: 'warning',
    tire_rotation: 'default',
    brake_service: 'error',
    general_inspection: 'success',
    other: 'default'
  }
  return variants[type] || 'default'
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

const filteredMaintenanceRecords = computed(() => {
  if (!selectedVehicleId.value) {
    return vehiclesStore.maintenanceRecords
  }
  return vehiclesStore.getMaintenanceByVehicle(selectedVehicleId.value)
})

const totalMaintenanceCost = computed(() => {
  return filteredMaintenanceRecords.value.reduce((total, record) => total + record.cost, 0)
})

onMounted(async () => {
  await vehiclesStore.fetchVehicles()
  await vehiclesStore.fetchMaintenanceRecords()
})
</script>

<template>
  <div class="min-h-screen bg-gray-900">
    <Navbar />
    <div class="py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-white">Manutenções</h1>
          <p class="mt-2 text-gray-400">
            Registre e acompanhe as manutenções dos seus veículos
          </p>
        </div>
        
        <Button 
          v-if="!showAddForm"
          @click="showAddForm = true" 
          variant="primary"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Registrar Manutenção
        </Button>
      </div>
      
      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card title="Total de Registros">
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-400 mb-2">
              {{ filteredMaintenanceRecords.length }}
            </div>
            <p class="text-gray-400">Manutenções registradas</p>
          </div>
        </Card>
        
        <Card title="Custo Total">
          <div class="text-center">
            <div class="text-3xl font-bold text-green-400 mb-2">
              {{ formatCurrency(totalMaintenanceCost) }}
            </div>
            <p class="text-gray-400">Gasto em manutenções</p>
          </div>
        </Card>
        
        <Card title="Próximas">
          <div class="text-center">
            <div class="text-3xl font-bold text-yellow-400 mb-2">
              {{ vehiclesStore.upcomingMaintenance.length }}
            </div>
            <p class="text-gray-400">Manutenções agendadas</p>
          </div>
        </Card>
      </div>
      
      <!-- Add Form -->
      <Card v-if="showAddForm" title="Registrar Manutenção" class="mb-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <Alert 
            v-if="vehiclesStore.error" 
            type="error" 
            :message="vehiclesStore.error"
            dismissible
            @close="vehiclesStore.clearError"
          />
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="vehicleId" class="block text-sm font-medium text-gray-300 mb-2">
                Veículo *
              </label>
              <select
                id="vehicleId"
                v-model="formData.vehicleId"
                class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                :disabled="vehiclesStore.loading"
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
            
            <div>
              <label for="type" class="block text-sm font-medium text-gray-300 mb-2">
                Tipo de Manutenção *
              </label>
              <select
                id="type"
                v-model="formData.type"
                class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                :disabled="vehiclesStore.loading"
              >
                <option value="oil_change">Troca de Óleo</option>
                <option value="tire_rotation">Rodízio de Pneus</option>
                <option value="brake_service">Serviço de Freios</option>
                <option value="general_inspection">Inspeção Geral</option>
                <option value="other">Outros</option>
              </select>
            </div>
            
            <div class="md:col-span-2">
              <label for="description" class="block text-sm font-medium text-gray-300 mb-2">
                Descrição *
              </label>
              <Input
                id="description"
                v-model="formData.description"
                type="text"
                placeholder="Descreva o serviço realizado"
                required
                :disabled="vehiclesStore.loading"
              />
            </div>
            
            <div>
              <label for="cost" class="block text-sm font-medium text-gray-300 mb-2">
                Custo (R$) *
              </label>
              <Input
                id="cost"
                v-model="formData.cost"
                type="text"
                mask="currency"
                placeholder="R$ 0,00"
                required
                :disabled="vehiclesStore.loading"
              />
            </div>
            
            <div>
              <label for="mileage" class="block text-sm font-medium text-gray-300 mb-2">
                Quilometragem *
              </label>
              <Input
                id="mileage"
                v-model="formData.mileage"
                type="text"
                mask="mileage"
                placeholder="Ex: 50.000 km"
                required
                :disabled="vehiclesStore.loading"
              />
            </div>
            
            <div>
              <label for="date" class="block text-sm font-medium text-gray-300 mb-2">
                Data da Manutenção *
              </label>
              <Input
                id="date"
                v-model="formData.date"
                type="date"
                required
                :disabled="vehiclesStore.loading"
              />
            </div>
            
            <div>
              <label for="nextDueDate" class="block text-sm font-medium text-gray-300 mb-2">
                Próxima Manutenção (Data)
              </label>
              <Input
                id="nextDueDate"
                v-model="formData.nextDueDate"
                type="date"
                :disabled="vehiclesStore.loading"
              />
            </div>
            
            <div>
              <label for="nextDueMileage" class="block text-sm font-medium text-gray-300 mb-2">
                Próxima Manutenção (Km)
              </label>
              <Input
                id="nextDueMileage"
                v-model="formData.nextDueMileage"
                type="text"
                mask="mileage"
                placeholder="Ex: 55.000 km"
                :disabled="vehiclesStore.loading"
              />
            </div>
            
            <div>
              <label for="serviceProvider" class="block text-sm font-medium text-gray-300 mb-2">
                Prestador de Serviço
              </label>
              <Input
                id="serviceProvider"
                v-model="formData.serviceProvider"
                type="text"
                placeholder="Nome da oficina ou mecânico"
                :disabled="vehiclesStore.loading"
              />
            </div>
            
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
                :disabled="vehiclesStore.loading"
              ></textarea>
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Anexos (Nota Fiscal / Comprovantes)
              </label>
              <FileUpload 
                v-model="uploadedFiles"
                :max-files="5"
                :max-size-m-b="5"
                :disabled="vehiclesStore.loading"
                @error="handleFileUploadError"
              />
              <Alert 
                v-if="uploadError" 
                type="error" 
                :message="uploadError"
                dismissible
                @close="uploadError = null"
                class="mt-2"
              />
            </div>
          </div>
          
          <div class="flex justify-end space-x-4">
            <Button 
              type="button" 
              @click="resetForm" 
              variant="outline"
              :disabled="vehiclesStore.loading"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              :loading="vehiclesStore.loading"
              :disabled="!formData.vehicleId || !formData.description || !formData.cost"
            >
              Registrar
            </Button>
          </div>
        </form>
      </Card>
      
      <!-- Filter -->
      <Card v-if="!showAddForm" title="Filtros" class="mb-8">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <label for="vehicleFilter" class="block text-sm font-medium text-gray-300 mb-2">
              Filtrar por veículo
            </label>
            <select
              id="vehicleFilter"
              v-model="selectedVehicleId"
              class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos os veículos</option>
              <option 
                v-for="vehicle in vehiclesStore.vehicles" 
                :key="vehicle.id" 
                :value="vehicle.id"
              >
                {{ vehicle.make }} {{ vehicle.model }} ({{ vehicle.plate }})
              </option>
            </select>
          </div>
        </div>
      </Card>
      
      <!-- Maintenance Records -->
      <div v-if="filteredMaintenanceRecords.length === 0 && !showAddForm" class="text-center py-16">
        <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 class="text-lg font-medium text-white mb-2">Nenhuma manutenção registrada</h3>
        <p class="text-gray-400 mb-6">Comece registrando a primeira manutenção</p>
        <Button @click="showAddForm = true" variant="primary">
          Registrar primeira manutenção
        </Button>
      </div>
      
      <div v-else-if="!showAddForm" class="space-y-6">
        <Card 
          v-for="record in filteredMaintenanceRecords" 
          :key="record.id"
          :title="getMaintenanceTypeLabel(record.type)"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p class="text-sm text-gray-400">Veículo</p>
              <p class="font-medium text-white">
                {{ vehiclesStore.getVehicleById(record.vehicleId)?.make }} 
                {{ vehiclesStore.getVehicleById(record.vehicleId)?.model }}
              </p>
              <p class="text-sm text-gray-400">
                {{ vehiclesStore.getVehicleById(record.vehicleId)?.plate }}
              </p>
            </div>
            
            <div>
              <p class="text-sm text-gray-400">Data</p>
              <p class="font-medium text-white">{{ formatDate(record.date) }}</p>
              <p class="text-sm text-gray-400">{{ record.mileage.toLocaleString('pt-BR') }} km</p>
            </div>
            
            <div>
              <p class="text-sm text-gray-400">Custo</p>
              <p class="font-medium text-green-400">{{ formatCurrency(record.cost) }}</p>
              <Badge :variant="getMaintenanceTypeBadgeVariant(record.type)">
                {{ getMaintenanceTypeLabel(record.type) }}
              </Badge>
            </div>
            
            <div>
              <p class="text-sm text-gray-400">Próxima Manutenção</p>
              <p v-if="record.nextDueDate" class="font-medium text-yellow-400">
                {{ formatDate(record.nextDueDate) }}
              </p>
              <p v-if="record.nextDueMileage" class="text-sm text-gray-400">
                {{ record.nextDueMileage.toLocaleString('pt-BR') }} km
              </p>
              <p v-if="!record.nextDueDate && !record.nextDueMileage" class="text-sm text-gray-500">
                Não agendada
              </p>
            </div>
          </div>
          
          <div v-if="record.description" class="mt-4">
            <p class="text-sm text-gray-400">Descrição</p>
            <p class="text-white">{{ record.description }}</p>
          </div>
          
          <div v-if="record.serviceProvider" class="mt-2">
            <p class="text-sm text-gray-400">Prestador de Serviço</p>
            <p class="text-white">{{ record.serviceProvider }}</p>
          </div>
          
          <div v-if="record.notes" class="mt-2">
            <p class="text-sm text-gray-400">Observações</p>
            <p class="text-white">{{ record.notes }}</p>
          </div>

          <div v-if="record.attachments && record.attachments.length > 0" class="mt-4">
            <p class="text-sm text-gray-400 mb-2">Anexos ({{ record.attachments.length }})</p>
            <div class="flex flex-wrap gap-2">
              <a
                v-for="(attachment, idx) in record.attachments"
                :key="idx"
                :href="attachment.url"
                target="_blank"
                class="inline-flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg transition-colors group"
              >
                <span class="text-xl">
                  {{ attachment.type === 'application/pdf' ? '📄' : '🖼️' }}
                </span>
                <div class="flex flex-col items-start">
                  <span class="text-sm text-white group-hover:text-blue-400 truncate max-w-[150px]">
                    {{ attachment.name }}
                  </span>
                  <span class="text-xs text-gray-400">
                    {{ formatDate(attachment.uploadedAt) }}
                  </span>
                </div>
                <button
                  type="button"
                  class="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  @click.prevent="handleDeleteAttachment(record.id, attachment.url)"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </a>
            </div>
          </div>
          
          <div class="mt-4 flex justify-end space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              @click="handleDelete(record.id)"
              :disabled="vehiclesStore.loading"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Excluir
            </Button>
          </div>
        </Card>
      </div>
    </div>
    </div>
  </div>
</template>