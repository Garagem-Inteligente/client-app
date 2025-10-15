<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <WorkshopHeader />
    
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Perfil da Oficina</h1>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Gerencie as informações da sua oficina</p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-400">Carregando informações...</p>
      </div>

      <!-- Formulário -->
      <div v-else-if="workshop" class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="p-6">
          <Alert v-if="successMessage" variant="success" class="mb-6">
            {{ successMessage }}
          </Alert>
          
          <Alert v-if="errorMessage" variant="error" class="mb-6">
            {{ errorMessage }}
          </Alert>

          <form @submit.prevent="saveProfile" class="space-y-6">
            <!-- Informações Básicas -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Informações Básicas
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nome da Oficina *
                  </label>
                  <Input
                    v-model="form.name"
                    type="text"
                    required
                    placeholder="Nome da sua oficina"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    CNPJ
                  </label>
                  <Input
                    v-model="form.cnpj"
                    type="text"
                    disabled
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <Input
                    v-model="form.email"
                    type="email"
                    required
                    placeholder="email@oficina.com"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Telefone *
                  </label>
                  <Input
                    v-model="form.phone"
                    type="tel"
                    required
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
            </div>

            <!-- Endereço -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Endereço
              </h3>
              
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Endereço Completo *
                  </label>
                  <Input
                    v-model="form.address"
                    type="text"
                    required
                    placeholder="Rua, número, bairro"
                  />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cidade *
                    </label>
                    <Input
                      v-model="form.city"
                      type="text"
                      required
                      placeholder="Nome da cidade"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Estado *
                    </label>
                    <select
                      v-model="form.state"
                      required
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Selecione</option>
                      <option v-for="state in brazilianStates" :key="state" :value="state">
                        {{ state }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <!-- Especialidades -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Especialidades
              </h3>
              
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                <label
                  v-for="specialty in availableSpecialties"
                  :key="specialty"
                  class="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <input
                    type="checkbox"
                    :value="specialty"
                    v-model="form.specialties"
                    class="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ specialty }}</span>
                </label>
              </div>
            </div>

            <!-- Horário de Funcionamento -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Horário de Funcionamento
              </h3>
              <Input
                v-model="form.workHours"
                type="text"
                placeholder="Ex: Seg-Sex: 08:00-18:00, Sáb: 08:00-12:00"
              />
            </div>

            <!-- Ações -->
            <div class="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button type="button" variant="outline" @click="resetForm">
                Cancelar
              </Button>
              <Button type="submit" variant="primary" :disabled="saving">
                {{ saving ? 'Salvando...' : 'Salvar Alterações' }}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Oficina não encontrada</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Não foi possível carregar as informações da oficina</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useWorkshopsStore } from '@/stores/workshops'
import WorkshopHeader from '@/components/WorkshopHeader.vue'
import Button from '@/components/Button.vue'
import Input from '@/components/Input.vue'
import Alert from '@/components/Alert.vue'

const workshopsStore = useWorkshopsStore()

const loading = ref(true)
const saving = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const brazilianStates = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
]

const availableSpecialties = [
  'Mecânica Geral',
  'Elétrica',
  'Funilaria',
  'Pintura',
  'Suspensão',
  'Freios',
  'Motor',
  'Câmbio',
  'Ar Condicionado',
  'Injeção Eletrônica',
  'Alinhamento',
  'Balanceamento'
]

const workshop = computed(() => workshopsStore.myWorkshops[0])

const form = ref({
  name: '',
  cnpj: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  specialties: [] as string[],
  workHours: ''
})

const resetForm = () => {
  if (workshop.value) {
    form.value = {
      name: workshop.value.name || '',
      cnpj: workshop.value.cnpj || '',
      email: workshop.value.email || '',
      phone: workshop.value.phone || '',
      address: workshop.value.address || '',
      city: workshop.value.city || '',
      state: workshop.value.state || '',
      specialties: [...(workshop.value.specialties || [])],
      workHours: workshop.value.workHours || ''
    }
  }
}

const saveProfile = async () => {
  if (!workshop.value) return

  successMessage.value = ''
  errorMessage.value = ''
  saving.value = true

  try {
    // Validação
    if (form.value.specialties.length === 0) {
      errorMessage.value = 'Selecione pelo menos uma especialidade'
      saving.value = false
      return
    }

    const result = await workshopsStore.updateWorkshop(workshop.value.id!, {
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone,
      address: form.value.address,
      city: form.value.city,
      state: form.value.state,
      specialties: form.value.specialties,
      workHours: form.value.workHours
    })

    if (result.success) {
      successMessage.value = 'Perfil atualizado com sucesso!'
      setTimeout(() => {
        successMessage.value = ''
      }, 3000)
    } else {
      errorMessage.value = result.error || 'Erro ao atualizar perfil'
    }
  } catch (error: any) {
    console.error('Erro ao salvar perfil:', error)
    errorMessage.value = error.message || 'Erro ao atualizar perfil'
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  try {
    await workshopsStore.fetchWorkshops()
    resetForm()
  } catch (error: any) {
    console.error('Erro ao carregar oficina:', error)
    errorMessage.value = 'Erro ao carregar informações da oficina'
  } finally {
    loading.value = false
  }
})
</script>
