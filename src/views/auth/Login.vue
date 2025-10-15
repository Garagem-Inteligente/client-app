<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Button from '@/components/Button.vue'
import Input from '@/components/Input.vue'
import Card from '@/components/Card.vue'
import Alert from '@/components/Alert.vue'

const router = useRouter()
const authStore = useAuthStore()

// Form data
const form = ref({
  email: '',
  password: ''
})

// Forgot password
const showForgotPassword = ref(false)
const forgotPasswordEmail = ref('')
const forgotPasswordMessage = ref('')

// Handle login
const handleLogin = async () => {
  authStore.clearError()
  
  const success = await authStore.login(form.value.email, form.value.password)
  
  if (success) {
    // Redirect to dashboard or intended route
    const redirect = router.currentRoute.value.query.redirect as string
    router.push(redirect || '/dashboard')
  }
}

// Handle forgot password
const handleForgotPassword = async () => {
  authStore.clearError()
  forgotPasswordMessage.value = ''
  
  const success = await authStore.resetPassword(forgotPasswordEmail.value)
  
  if (success) {
    forgotPasswordMessage.value = 'Email de recuperação enviado! Verifique sua caixa de entrada.'
    setTimeout(() => {
      showForgotPassword.value = false
      forgotPasswordMessage.value = ''
      forgotPasswordEmail.value = ''
    }, 3000)
  }
}

// Redirect if already authenticated
onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/dashboard')
  }
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center px-4">
    <!-- Background effects -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div class="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
    </div>

    <div class="relative z-10 w-full max-w-md">
      <!-- Logo/Brand -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">AutoCare</h1>
        <p class="text-gray-300">Faça login em sua conta</p>
      </div>

      <!-- Login Form -->
      <Card title="Login" class="backdrop-blur-sm bg-white/10 border-white/20">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-200 mb-2">
              Email
            </label>
            <Input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="seu@email.com"
              :disabled="authStore.loading"
              class="bg-white/10 border-white/20 text-white placeholder-gray-400"
              required
            />
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-200 mb-2">
              Senha
            </label>
            <Input
              id="password"
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              :disabled="authStore.loading"
              class="bg-white/10 border-white/20 text-white placeholder-gray-400"
              required
            />
          </div>

          <!-- Forgot Password Link -->
          <div class="flex justify-end">
            <button
              type="button"
              @click="showForgotPassword = true"
              class="text-sm text-purple-400 hover:text-purple-300 transition-colors"
              :disabled="authStore.loading"
            >
              Esqueceu sua senha?
            </button>
          </div>

          <!-- Error Message -->
          <Alert v-if="authStore.error" :message="authStore.error" type="error" class="bg-red-500/20 border-red-500/50" />

          <!-- Login Button -->
          <Button
            type="submit"
            variant="primary"
            size="lg"
            :loading="authStore.loading"
            :disabled="!form.email || !form.password"
            class="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            Entrar
          </Button>

          <!-- Register Link -->
          <div class="text-center">
            <p class="text-gray-300">
              Não tem uma conta?
              <router-link
                to="/select-type?mode=register"
                class="text-purple-400 hover:text-purple-300 font-medium transition-colors"
              >
                Criar conta
              </router-link>
            </p>
          </div>
        </form>
      </Card>

      <!-- Forgot Password Modal -->
      <div
        v-if="showForgotPassword"
        class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        @click="showForgotPassword = false"
      >
        <Card
          title="Recuperar Senha"
          class="w-full max-w-md backdrop-blur-sm bg-white/10 border-white/20"
          @click.stop
        >
          <div class="p-6">
            <h3 class="text-xl font-semibold text-white mb-4">Recuperar Senha</h3>
            <p class="text-gray-300 mb-4">
              Digite seu email para receber um link de recuperação de senha.
            </p>
            
            <form @submit.prevent="handleForgotPassword" class="space-y-4">
              <Input
                v-model="forgotPasswordEmail"
                type="email"
                placeholder="seu@email.com"
                :disabled="authStore.loading"
                class="bg-white/10 border-white/20 text-white placeholder-gray-400"
                required
              />
              
              <Alert v-if="forgotPasswordMessage" :message="forgotPasswordMessage" type="success" class="bg-green-500/20 border-green-500/50" />
              
              <Alert v-if="authStore.error" :message="authStore.error" type="error" class="bg-red-500/20 border-red-500/50" />
              
              <div class="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  @click="showForgotPassword = false"
                  :disabled="authStore.loading"
                  class="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  :loading="authStore.loading"
                  :disabled="!forgotPasswordEmail"
                  class="flex-1"
                >
                  Enviar
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>