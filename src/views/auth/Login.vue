<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import Button from '../../components/Button.vue'
import Input from '../../components/Input.vue'
import Card from '../../components/Card.vue'
import Alert from '../../components/Alert.vue'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)

const handleLogin = async () => {
  if (!email.value || !password.value) {
    return
  }
  
  const success = await authStore.login(email.value, password.value)
  if (success) {
    router.push('/dashboard')
  }
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-white">
          Entre na sua conta
        </h2>
        <p class="mt-2 text-center text-sm text-gray-400">
          Ou
          <router-link to="/auth/register" class="font-medium text-blue-400 hover:text-blue-300">
            crie uma nova conta
          </router-link>
        </p>
      </div>
      
      <Card title="Login">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <Alert 
            v-if="authStore.error" 
            type="error" 
            :message="authStore.error"
            @close="authStore.clearError"
          />
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <Input
              id="email"
              v-model="email"
              type="email"
              placeholder="seu@email.com"
              required
              :disabled="authStore.loading"
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
              Senha
            </label>
            <div class="relative">
              <Input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Sua senha"
                required
                :disabled="authStore.loading"
              />
              <button
                type="button"
                @click="togglePassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
              >
                <svg v-if="!showPassword" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              </button>
            </div>
          </div>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700 rounded"
              >
              <label for="remember-me" class="ml-2 block text-sm text-gray-300">
                Lembrar de mim
              </label>
            </div>
            
            <div class="text-sm">
              <a href="#" class="font-medium text-blue-400 hover:text-blue-300">
                Esqueceu a senha?
              </a>
            </div>
          </div>
          
          <Button
            type="submit"
            variant="primary"
            size="lg"
            :loading="authStore.loading"
            :disabled="!email || !password"
            class="w-full"
          >
            {{ authStore.loading ? 'Entrando...' : 'Entrar' }}
          </Button>
        </form>
      </Card>
    </div>
  </div>
</template>