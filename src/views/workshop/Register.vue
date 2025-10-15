<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <router-link to="/" class="inline-flex items-center space-x-2 mb-8">
          <svg class="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span class="text-3xl font-bold text-white">AutoCare</span>
        </router-link>
        <h2 class="text-3xl font-extrabold text-white">Cadastre sua Oficina</h2>
        <p class="mt-2 text-sm text-gray-300">
          Já tem uma conta?
          <router-link to="/login" class="font-medium text-blue-400 hover:text-blue-300">
            Faça login
          </router-link>
        </p>
      </div>

      <!-- Form -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Dados de Acesso -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Dados de Acesso</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome Completo *
                </label>
                <Input
                  v-model="form.ownerName"
                  type="text"
                  placeholder="Seu nome completo"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <Input
                  v-model="form.email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Senha *
                </label>
                <Input
                  v-model="form.password"
                  type="password"
                  placeholder="••••••••"
                  required
                  minlength="6"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirmar Senha *
                </label>
                <Input
                  v-model="form.confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  minlength="6"
                />
              </div>
            </div>
          </div>

          <!-- Dados da Oficina -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Dados da Oficina</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome da Oficina *
                </label>
                <Input
                  v-model="form.workshopName"
                  type="text"
                  placeholder="Nome da sua oficina"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  CNPJ
                </label>
                <Input
                  v-model="form.cnpj"
                  type="text"
                  placeholder="00.000.000/0000-00"
                  @input="formatCNPJ"
                  maxlength="18"
                />
                <p v-if="cnpjError" class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {{ cnpjError }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Telefone *
                </label>
                <Input
                  v-model="form.phone"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  @input="formatPhone"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Horário de Funcionamento
                </label>
                <Input
                  v-model="form.workHours"
                  type="text"
                  placeholder="Seg-Sex: 8h-18h"
                />
              </div>
            </div>
          </div>

          <!-- Endereço -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Endereço</h3>
            <div class="grid grid-cols-1 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Endereço Completo *
                </label>
                <Input
                  v-model="form.address"
                  type="text"
                  placeholder="Rua, número, bairro"
                  required
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
                    placeholder="Cidade"
                    required
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
          <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Especialidades</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <label
                v-for="specialty in availableSpecialties"
                :key="specialty"
                class="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  :value="specialty"
                  v-model="form.specialties"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <span class="text-sm text-gray-700 dark:text-gray-300">{{ specialty }}</span>
              </label>
            </div>
          </div>

          <!-- Alert de erro -->
          <Alert v-if="error" variant="error">
            {{ error }}
          </Alert>

          <!-- Termos e Botão -->
          <div class="space-y-4">
            <label class="flex items-start space-x-2 cursor-pointer">
              <input
                type="checkbox"
                v-model="form.acceptTerms"
                required
                class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span class="text-sm text-gray-600 dark:text-gray-400">
                Aceito os termos de uso e política de privacidade da plataforma AutoCare
              </span>
            </label>

            <Button
              type="submit"
              :loading="loading"
              :disabled="loading || !form.acceptTerms"
              class="w-full justify-center"
            >
              Criar Conta e Cadastrar Oficina
            </Button>
          </div>
        </form>

        <div class="mt-6 text-center space-y-2">
          <p class="text-gray-600 dark:text-gray-400">
            Não é uma oficina?
            <router-link to="/register" class="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
              Cadastrar como usuário comum
            </router-link>
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-500">
            Já tem uma conta?
            <router-link to="/select-type?mode=login" class="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
              Fazer login
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useWorkshopsStore } from '@/stores/workshops'
import Input from '@/components/Input.vue'
import Button from '@/components/Button.vue'
import Alert from '@/components/Alert.vue'

const router = useRouter()
const authStore = useAuthStore()
const workshopsStore = useWorkshopsStore()

const loading = ref(false)
const error = ref<string | null>(null)
const cnpjError = ref<string | null>(null)

const form = ref({
  ownerName: '',
  email: '',
  password: '',
  confirmPassword: '',
  workshopName: '',
  cnpj: '',
  phone: '',
  workHours: '',
  address: '',
  city: '',
  state: '',
  specialties: [] as string[],
  acceptTerms: false
})

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
  'Cambio',
  'Ar Condicionado',
  'Injeção Eletrônica',
  'Alinhamento',
  'Balanceamento'
]

const formatCNPJ = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')
  
  if (value.length <= 14) {
    value = value.replace(/^(\d{2})(\d)/, '$1.$2')
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    value = value.replace(/\.(\d{3})(\d)/, '.$1/$2')
    value = value.replace(/(\d{4})(\d)/, '$1-$2')
    form.value.cnpj = value
    
    // Validar CNPJ se completo
    if (value.replace(/\D/g, '').length === 14) {
      if (!validateCNPJ(value.replace(/\D/g, ''))) {
        cnpjError.value = 'CNPJ inválido'
      } else {
        cnpjError.value = null
      }
    } else {
      cnpjError.value = null
    }
  }
}

const formatPhone = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')
  
  if (value.length <= 11) {
    value = value.replace(/^(\d{2})(\d)/, '($1) $2')
    value = value.replace(/(\d{5})(\d)/, '$1-$2')
    form.value.phone = value
  }
}

const validateCNPJ = (cnpj: string): boolean => {
  if (cnpj.length !== 14) return false
  
  // Eliminar CNPJs inválidos conhecidos
  if (/^(\d)\1+$/.test(cnpj)) return false
  
  // Validar DVs
  let length = cnpj.length - 2
  let numbers = cnpj.substring(0, length)
  const digits = cnpj.substring(length)
  let sum = 0
  let pos = length - 7
  
  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--
    if (pos < 2) pos = 9
  }
  
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== parseInt(digits.charAt(0))) return false
  
  length = length + 1
  numbers = cnpj.substring(0, length)
  sum = 0
  pos = length - 7
  
  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--
    if (pos < 2) pos = 9
  }
  
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== parseInt(digits.charAt(1))) return false
  
  return true
}

const handleSubmit = async () => {
  error.value = null
  
  // Validações
  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'As senhas não coincidem'
    return
  }
  
  if (form.value.password.length < 6) {
    error.value = 'A senha deve ter no mínimo 6 caracteres'
    return
  }
  
  if (form.value.cnpj && cnpjError.value) {
    error.value = 'Por favor, corrija o CNPJ informado'
    return
  }
  
  if (form.value.specialties.length === 0) {
    error.value = 'Selecione pelo menos uma especialidade'
    return
  }
  
  loading.value = true
  
  try {
    // 1. Criar conta de usuário como workshop
    const registered = await authStore.register(
      form.value.email,
      form.value.password,
      form.value.ownerName,
      'workshop'
    )
    
    if (!registered) {
      error.value = authStore.error || 'Erro ao criar conta'
      return
    }
    
    // 2. Criar registro da oficina
    const workshopId = await workshopsStore.createWorkshop({
      name: form.value.workshopName,
      cnpj: form.value.cnpj || undefined,
      email: form.value.email,
      phone: form.value.phone,
      address: form.value.address,
      city: form.value.city,
      state: form.value.state,
      specialties: form.value.specialties,
      workHours: form.value.workHours || undefined,
      ownerId: authStore.user!.id
    })
    
    if (workshopId) {
      // Redirecionar para dashboard da oficina
      router.push('/workshop/dashboard')
    } else {
      error.value = workshopsStore.error || 'Erro ao cadastrar oficina'
    }
  } catch (err: any) {
    error.value = err.message || 'Erro ao criar conta. Tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>
