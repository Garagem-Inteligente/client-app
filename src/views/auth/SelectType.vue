<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-5xl w-full">
      <!-- Header -->
      <div class="text-center mb-12">
        <router-link to="/" class="inline-flex items-center space-x-2 mb-8">
          <svg class="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span class="text-3xl font-bold text-white">AutoCare</span>
        </router-link>
        <h2 class="text-3xl font-extrabold text-white mb-2">{{ isLogin ? 'Fazer Login' : 'Criar Conta' }}</h2>
        <p class="text-gray-300">Selecione o tipo de conta que deseja {{ isLogin ? 'acessar' : 'criar' }}</p>
      </div>

      <!-- Cards de Seleção -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <!-- Usuário -->
        <div
          @click="selectType('user')"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-blue-500/50 border-4 border-transparent hover:border-blue-500"
        >
          <div class="text-center">
            <div class="mx-auto w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-6">
              <svg class="w-12 h-12 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">Sou Usuário</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6">
              Gerencie seus veículos, agende manutenções e encontre oficinas de confiança
            </p>
            <ul class="text-left space-y-2 mb-6">
              <li class="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Cadastre seus veículos</span>
              </li>
              <li class="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Histórico de manutenções</span>
              </li>
              <li class="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Busque oficinas especializadas</span>
              </li>
              <li class="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Alertas de manutenção preventiva</span>
              </li>
            </ul>
            <Button variant="primary" class="w-full justify-center">
              {{ isLogin ? 'Entrar como Usuário' : 'Criar Conta de Usuário' }}
            </Button>
          </div>
        </div>

        <!-- Oficina -->
        <div
          @click="selectType('workshop')"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-blue-500/50 border-4 border-transparent hover:border-blue-500"
        >
          <div class="text-center">
            <div class="mx-auto w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
              <svg class="w-12 h-12 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">Sou Oficina</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6">
              Gerencie sua oficina, atenda clientes e aumente sua visibilidade
            </p>
            <ul class="text-left space-y-2 mb-6">
              <li class="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Dashboard completo</span>
              </li>
              <li class="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Gerencie ordens de serviço</span>
              </li>
              <li class="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Receba avaliações de clientes</span>
              </li>
              <li class="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Aumente sua visibilidade</span>
              </li>
            </ul>
            <Button variant="primary" class="w-full justify-center">
              {{ isLogin ? 'Entrar como Oficina' : 'Cadastrar Oficina' }}
            </Button>
          </div>
        </div>
      </div>

      <!-- Link alternativo -->
      <div class="text-center">
        <p class="text-gray-300">
          {{ isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?' }}
          <router-link
            :to="isLogin ? '/select-type?mode=register' : '/select-type?mode=login'"
            class="text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            {{ isLogin ? 'Criar conta' : 'Fazer login' }}
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Button from '@/components/Button.vue'

const router = useRouter()
const route = useRoute()

const isLogin = computed(() => route.query.mode !== 'register')

const selectType = (type: 'user' | 'workshop') => {
  if (isLogin.value) {
    // Login
    router.push('/login')
  } else {
    // Registro
    if (type === 'workshop') {
      router.push('/workshop/register')
    } else {
      router.push('/register')
    }
  }
}
</script>
