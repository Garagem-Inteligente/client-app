<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Encontre Oficinas</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Busque oficinas especializadas na sua região</p>
      </div>

      <!-- Filtros -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cidade
            </label>
            <Input
              v-model="filters.city"
              type="text"
              placeholder="Digite a cidade"
              @input="applyFilters"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Especialidade
            </label>
            <select
              v-model="filters.specialty"
              @change="applyFilters"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Todas</option>
              <option v-for="spec in specialties" :key="spec" :value="spec">
                {{ spec }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Avaliação Mínima
            </label>
            <select
              v-model.number="filters.minRating"
              @change="applyFilters"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option :value="0">Todas</option>
              <option :value="3">3+ estrelas</option>
              <option :value="4">4+ estrelas</option>
              <option :value="4.5">4.5+ estrelas</option>
            </select>
          </div>
        </div>
        <div class="mt-4 flex items-center justify-between">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ filteredWorkshops.length }} oficina(s) encontrada(s)
          </p>
          <Button variant="outline" size="sm" @click="clearFilters">
            Limpar Filtros
          </Button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-400">Carregando oficinas...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredWorkshops.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Nenhuma oficina encontrada</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Tente ajustar os filtros de busca</p>
      </div>

      <!-- Lista de Oficinas -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="workshop in filteredWorkshops"
          :key="workshop.id"
          class="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
          @click="viewWorkshop(workshop.id)"
        >
          <!-- Foto -->
          <div class="h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg relative">
            <img
              v-if="workshop.photos && workshop.photos[0]"
              :src="workshop.photos[0]"
              :alt="workshop.name"
              class="w-full h-full object-cover rounded-t-lg"
            />
            <div class="absolute top-4 right-4">
              <Badge v-if="workshop.verified" variant="success">
                <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                Verificada
              </Badge>
            </div>
          </div>

          <!-- Conteúdo -->
          <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {{ workshop.name }}
            </h3>
            
            <!-- Rating -->
            <div class="flex items-center mb-3">
              <div class="flex items-center">
                <svg
                  v-for="i in 5"
                  :key="i"
                  :class="[
                    'w-5 h-5',
                    i <= (workshop.rating || 0) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                  ]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">
                {{ workshop.rating?.toFixed(1) || '0.0' }} ({{ workshop.totalReviews }} avaliações)
              </span>
            </div>

            <!-- Localização -->
            <div class="flex items-start text-sm text-gray-600 dark:text-gray-400 mb-3">
              <svg class="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{{ workshop.city }}, {{ workshop.state }}</span>
            </div>

            <!-- Especialidades -->
            <div class="flex flex-wrap gap-2 mb-4">
              <Badge
                v-for="specialty in (workshop.specialties || []).slice(0, 3)"
                :key="specialty"
                variant="default"
                class="text-xs"
              >
                {{ specialty }}
              </Badge>
              <Badge
                v-if="(workshop.specialties || []).length > 3"
                variant="default"
                class="text-xs"
              >
                +{{ workshop.specialties!.length - 3 }}
              </Badge>
            </div>

            <!-- Contato -->
            <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div class="text-sm text-gray-600 dark:text-gray-400">
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {{ workshop.phone }}
              </div>
              <Button variant="primary" size="sm" @click.stop="viewWorkshop(workshop.id)">
                Ver Detalhes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useWorkshopsStore } from '@/stores/workshops'
import Input from '@/components/Input.vue'
import Button from '@/components/Button.vue'
import Badge from '@/components/Badge.vue'

const router = useRouter()
const workshopsStore = useWorkshopsStore()

const loading = ref(true)
const filters = ref({
  city: '',
  specialty: '',
  minRating: 0
})

const specialties = [
  'Mecânica Geral',
  'Elétrica',
  'Funilaria',
  'Pintura',
  'Suspensão',
  'Freios',
  'Motor',
  'Cambio',
  'Ar Condicionado',
  'Injeção Eletrônica',
  'Alinhamento',
  'Balanceamento'
]

const filteredWorkshops = computed(() => {
  let results = workshopsStore.workshops

  if (filters.value.city) {
    results = results.filter(w =>
      w.city?.toLowerCase().includes(filters.value.city.toLowerCase())
    )
  }

  if (filters.value.specialty) {
    results = results.filter(w =>
      w.specialties?.includes(filters.value.specialty)
    )
  }

  if (filters.value.minRating > 0) {
    results = results.filter(w =>
      (w.rating || 0) >= filters.value.minRating
    )
  }

  return results
})

const applyFilters = async () => {
  loading.value = true
  await workshopsStore.fetchWorkshops({
    city: filters.value.city || undefined,
    specialty: filters.value.specialty || undefined,
    minRating: filters.value.minRating || undefined
  })
  loading.value = false
}

const clearFilters = () => {
  filters.value = {
    city: '',
    specialty: '',
    minRating: 0
  }
  applyFilters()
}

const viewWorkshop = (id: string) => {
  router.push(`/workshops/${id}`)
}

onMounted(async () => {
  try {
    await workshopsStore.fetchWorkshops()
  } catch (error) {
    console.error('Erro ao carregar oficinas:', error)
  } finally {
    loading.value = false
  }
})
</script>
