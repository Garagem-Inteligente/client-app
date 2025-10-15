<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <Navbar />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-400">Carregando informações...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error || !workshop" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Oficina não encontrada</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ error }}</p>
        <Button class="mt-4" @click="router.push('/workshops')">Voltar para Oficinas</Button>
      </div>

      <!-- Conteúdo -->
      <div v-else>
        <!-- Header com Galeria -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 overflow-hidden">
          <!-- Galeria de Fotos -->
          <div class="h-96 bg-gradient-to-br from-blue-500 to-purple-600 relative">
            <img
              v-if="workshop.photos && workshop.photos.length > 0"
              :src="workshop.photos[currentPhotoIndex]"
              :alt="workshop.name"
              class="w-full h-full object-cover"
            />
            <!-- Navegação de fotos -->
            <div v-if="workshop.photos && workshop.photos.length > 1" class="absolute inset-0 flex items-center justify-between px-4">
              <button
                @click="previousPhoto"
                class="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                @click="nextPhoto"
                class="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <!-- Badge Verificado -->
            <div class="absolute top-4 right-4">
              <Badge v-if="workshop.verified" variant="success">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                Oficina Verificada
              </Badge>
            </div>
          </div>

          <!-- Informações Principais -->
          <div class="p-6">
            <div class="flex flex-col md:flex-row md:items-start md:justify-between">
              <div class="flex-1">
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {{ workshop.name }}
                </h1>
                
                <!-- Rating -->
                <div class="flex items-center mb-4">
                  <div class="flex items-center">
                    <svg
                      v-for="i in 5"
                      :key="i"
                      :class="[
                        'w-6 h-6',
                        i <= (workshop.rating || 0) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                      ]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span class="ml-2 text-lg font-medium text-gray-900 dark:text-white">
                    {{ workshop.rating?.toFixed(1) || '0.0' }}
                  </span>
                  <span class="ml-2 text-gray-600 dark:text-gray-400">
                    ({{ workshop.totalReviews }} avaliações)
                  </span>
                </div>

                <!-- Especialidades -->
                <div class="flex flex-wrap gap-2 mb-4">
                  <Badge
                    v-for="specialty in workshop.specialties"
                    :key="specialty"
                    variant="default"
                  >
                    {{ specialty }}
                  </Badge>
                </div>
              </div>

              <!-- CTA -->
              <div class="mt-4 md:mt-0 md:ml-6">
                <Button variant="primary" size="lg" @click="showJobOrderModal = true">
                  Solicitar Orçamento
                </Button>
              </div>
            </div>
          </div>
        </div>

        <!-- Grid de Informações -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <!-- Coluna Principal -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Sobre -->
            <Card title="Sobre a Oficina">
              <p class="text-gray-700 dark:text-gray-300">
                Oficina especializada em diversos serviços automotivos, com equipe qualificada e equipamentos modernos.
              </p>
            </Card>

            <!-- Avaliações -->
            <Card title="Avaliações">
              <div v-if="loadingReviews" class="text-center py-4">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
              <div v-else-if="reviews.length === 0" class="text-center py-8">
                <p class="text-gray-500 dark:text-gray-400">Nenhuma avaliação ainda</p>
              </div>
              <div v-else class="space-y-4">
                <div
                  v-for="review in reviews"
                  :key="review.id"
                  class="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0"
                >
                  <div class="flex items-start justify-between mb-2">
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">
                        {{ review.userName }}
                      </p>
                      <div class="flex items-center mt-1">
                        <div class="flex">
                          <svg
                            v-for="i in 5"
                            :key="i"
                            :class="[
                              'w-4 h-4',
                              i <= review.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                            ]"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <span class="text-sm text-gray-500 dark:text-gray-400">
                      {{ formatReviewDate(review.createdAt) }}
                    </span>
                  </div>
                  <p class="text-gray-700 dark:text-gray-300">{{ review.comment }}</p>
                </div>
              </div>
            </Card>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Contato -->
            <Card title="Contato">
              <div class="space-y-3">
                <div class="flex items-start">
                  <svg class="w-5 h-5 text-gray-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">Telefone</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ workshop.phone }}</p>
                  </div>
                </div>

                <div class="flex items-start">
                  <svg class="w-5 h-5 text-gray-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">Email</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ workshop.email }}</p>
                  </div>
                </div>

                <div class="flex items-start">
                  <svg class="w-5 h-5 text-gray-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">Endereço</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {{ workshop.address }}<br>
                      {{ workshop.city }}, {{ workshop.state }}
                    </p>
                  </div>
                </div>

                <div v-if="workshop.cnpj" class="flex items-start">
                  <svg class="w-5 h-5 text-gray-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">CNPJ</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ workshop.cnpj }}</p>
                  </div>
                </div>
              </div>
            </Card>

            <!-- Horário de Funcionamento -->
            <Card title="Horário de Funcionamento">
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Segunda - Sexta</span>
                  <span class="font-medium text-gray-900 dark:text-white">08:00 - 18:00</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Sábado</span>
                  <span class="font-medium text-gray-900 dark:text-white">08:00 - 12:00</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Domingo</span>
                  <span class="font-medium text-gray-900 dark:text-white">Fechado</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Ordem de Serviço -->
    <div
      v-if="showJobOrderModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      @click.self="showJobOrderModal = false"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Solicitar Orçamento</h2>
            <button
              @click="showJobOrderModal = false"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <Alert v-if="formError" variant="error" class="mb-4">
            {{ formError }}
          </Alert>

          <form @submit.prevent="submitJobOrder" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Selecione o Veículo
              </label>
              <select
                v-model="jobOrderForm.vehicleId"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Selecione um veículo</option>
                <option v-for="vehicle in vehicles" :key="vehicle.id" :value="vehicle.id">
                  {{ vehicle.make }} {{ vehicle.model }} ({{ vehicle.plate }})
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descrição do Problema
              </label>
              <textarea
                v-model="jobOrderForm.description"
                required
                rows="4"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Descreva o problema ou serviço que precisa..."
              ></textarea>
            </div>

            <div class="flex gap-3 justify-end">
              <Button type="button" variant="outline" @click="showJobOrderModal = false">
                Cancelar
              </Button>
              <Button type="submit" variant="primary" :disabled="submittingJobOrder">
                {{ submittingJobOrder ? 'Enviando...' : 'Solicitar Orçamento' }}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWorkshopsStore } from '@/stores/workshops'
import { useVehiclesStore } from '@/stores/vehicles'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/Navbar.vue'
import Button from '@/components/Button.vue'
import Badge from '@/components/Badge.vue'
import Card from '@/components/Card.vue'
import Alert from '@/components/Alert.vue'

const route = useRoute()
const router = useRouter()
const workshopsStore = useWorkshopsStore()
const vehiclesStore = useVehiclesStore()
const authStore = useAuthStore()

const loading = ref(true)
const loadingReviews = ref(true)
const error = ref('')
const currentPhotoIndex = ref(0)
const showJobOrderModal = ref(false)
const submittingJobOrder = ref(false)
const formError = ref('')

const jobOrderForm = ref({
  vehicleId: '',
  description: ''
})

const workshop = computed(() => {
  const id = route.params.id as string
  return workshopsStore.workshopById(id)
})

const reviews = computed(() => workshopsStore.reviews)
const vehicles = computed(() => vehiclesStore.vehicles)

const previousPhoto = () => {
  if (workshop.value?.photos) {
    currentPhotoIndex.value = (currentPhotoIndex.value - 1 + workshop.value.photos.length) % workshop.value.photos.length
  }
}

const nextPhoto = () => {
  if (workshop.value?.photos) {
    currentPhotoIndex.value = (currentPhotoIndex.value + 1) % workshop.value.photos.length
  }
}

const formatReviewDate = (date: Date) => {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

const submitJobOrder = async () => {
  if (!workshop.value || !authStore.user) return

  formError.value = ''
  submittingJobOrder.value = true

  try {
    await workshopsStore.createJobOrder(workshop.value.id!, {
      workshopId: workshop.value.id!,
      customerId: authStore.user.id,
      customerEmail: authStore.user.email!,
      vehicleId: jobOrderForm.value.vehicleId,
      notes: jobOrderForm.value.description,
      services: [],
      totalLabor: 0,
      totalParts: 0,
      totalCost: 0,
      status: 'open'
    })

    showJobOrderModal.value = false
    jobOrderForm.value = { vehicleId: '', description: '' }
    
    // Redirecionar para página de ordens
    router.push('/my-job-orders')
  } catch (err: any) {
    console.error('Erro ao criar ordem de serviço:', err)
    formError.value = err.message || 'Erro ao solicitar orçamento'
  } finally {
    submittingJobOrder.value = false
  }
}

onMounted(async () => {
  try {
    const id = route.params.id as string
    
    // Carregar oficina
    await workshopsStore.fetchWorkshopById(id)
    
    if (!workshop.value) {
      error.value = 'Oficina não encontrada'
      loading.value = false
      return
    }

    // Carregar avaliações e veículos em paralelo
    await Promise.all([
      workshopsStore.fetchReviews(id),
      vehiclesStore.fetchVehicles()
    ])
    
    loadingReviews.value = false
  } catch (err: any) {
    console.error('Erro ao carregar oficina:', err)
    error.value = err.message || 'Erro ao carregar informações da oficina'
  } finally {
    loading.value = false
  }
})
</script>
