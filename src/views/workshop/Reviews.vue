<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <WorkshopHeader />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Avaliações</h1>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Veja o que seus clientes estão dizendo</p>
      </div>

      <!-- Estatísticas de Avaliações -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="w-12 h-12 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Avaliação Média</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ averageRating.toFixed(1) }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total de Avaliações</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ reviews.length }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Avaliações 5 ⭐</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ fiveStarCount }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filtrar por Estrelas
            </label>
            <select
              v-model.number="filterRating"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option :value="0">Todas</option>
              <option :value="5">5 Estrelas</option>
              <option :value="4">4 Estrelas</option>
              <option :value="3">3 Estrelas</option>
              <option :value="2">2 Estrelas</option>
              <option :value="1">1 Estrela</option>
            </select>
          </div>
          <div class="flex items-end">
            <Button variant="outline" @click="filterRating = 0">
              Limpar Filtro
            </Button>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-400">Carregando avaliações...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredReviews.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
          {{ filterRating > 0 ? 'Nenhuma avaliação com esse filtro' : 'Nenhuma avaliação ainda' }}
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ filterRating > 0 ? 'Tente ajustar os filtros' : 'Seus clientes ainda não avaliaram seus serviços' }}
        </p>
      </div>

      <!-- Lista de Avaliações -->
      <div v-else class="space-y-4">
        <div
          v-for="review in filteredReviews"
          :key="review.id"
          class="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                  {{ review.userName.charAt(0).toUpperCase() }}
                </div>
              </div>
              <div class="ml-4">
                <p class="font-semibold text-gray-900 dark:text-white">{{ review.userName }}</p>
                <div class="flex items-center mt-1">
                  <div class="flex">
                    <svg
                      v-for="i in 5"
                      :key="i"
                      :class="[
                        'w-5 h-5',
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
            </div>
            <span class="text-sm text-gray-500 dark:text-gray-400">
              {{ formatDate(review.createdAt) }}
            </span>
          </div>
          
          <p v-if="review.comment" class="text-gray-700 dark:text-gray-300 leading-relaxed">
            {{ review.comment }}
          </p>
          <p v-else class="text-gray-500 dark:text-gray-400 italic">
            Sem comentário
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useWorkshopsStore } from '@/stores/workshops'
import WorkshopHeader from '@/components/WorkshopHeader.vue'
import Button from '@/components/Button.vue'

const workshopsStore = useWorkshopsStore()

const loading = ref(true)
const filterRating = ref(0)

const reviews = computed(() => workshopsStore.reviews)

const filteredReviews = computed(() => {
  if (filterRating.value === 0) {
    return reviews.value
  }
  return reviews.value.filter(r => r.rating === filterRating.value)
})

const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0
  const sum = reviews.value.reduce((acc, r) => acc + r.rating, 0)
  return sum / reviews.value.length
})

const fiveStarCount = computed(() => {
  return reviews.value.filter(r => r.rating === 5).length
})

const formatDate = (date: Date) => {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

onMounted(async () => {
  try {
    // Buscar a oficina do usuário
    await workshopsStore.fetchWorkshops()
    const workshopId = workshopsStore.myWorkshops[0]?.id
    
    if (workshopId) {
      await workshopsStore.fetchReviews(workshopId)
    }
  } catch (error: any) {
    console.error('Erro ao carregar avaliações:', error)
  } finally {
    loading.value = false
  }
})
</script>
