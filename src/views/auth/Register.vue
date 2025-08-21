<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
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
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const acceptTerms = ref(false)

// Validation
const passwordsMatch = computed(() => {
  if (!form.value.password || !form.value.confirmPassword) return true
  return form.value.password === form.value.confirmPassword
})

const passwordStrength = computed(() => {
  const password = form.value.password
  if (!password) return { score: 0, text: '', color: '' }
  
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  
  const levels = [
    { text: 'Muito fraca', color: 'text-red-400' },
    { text: 'Fraca', color: 'text-orange-400' },
    { text: 'Regular', color: 'text-yellow-400' },
    { text: 'Boa', color: 'text-blue-400' },
    { text: 'Forte', color: 'text-green-400' }
  ]
  
  return { score, ...levels[score] }
})

const isFormValid = computed(() => {
  return form.value.name &&
         form.value.email &&
         form.value.password &&
         form.value.confirmPassword &&
         passwordsMatch.value &&
         form.value.password.length >= 6 &&
         acceptTerms.value
})

// Handle registration
const handleRegister = async () => {
  authStore.clearError()
  
  if (!isFormValid.value) return
  
  const success = await authStore.register(form.value.email, form.value.password, form.value.name)
  
  if (success) {
    router.push('/dashboard')
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
        <p class="text-gray-300">Crie sua conta</p>
      </div>

      <!-- Register Form -->
      <Card title="Criar Conta" class="backdrop-blur-sm bg-white/10 border-white/20">
        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Name Field -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-200 mb-2">
              Nome completo
            </label>
            <Input
              id="name"
              v-model="form.name"
              type="text"
              placeholder="Seu nome completo"
              :disabled="authStore.loading"
              class="bg-white/10 border-white/20 text-white placeholder-gray-400"
              required
            />
          </div>

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
              placeholder="Mínimo 6 caracteres"
              :disabled="authStore.loading"
              class="bg-white/10 border-white/20 text-white placeholder-gray-400"
              required
            />
            
            <!-- Password Strength Indicator -->
            <div v-if="form.password" class="mt-2">
              <div class="flex items-center space-x-2">
                <div class="flex-1 bg-gray-700 rounded-full h-2">
                  <div 
                    class="h-2 rounded-full transition-all duration-300"
                    :class="{
                      'bg-red-500': passwordStrength.score <= 1,
                      'bg-orange-500': passwordStrength.score === 2,
                      'bg-yellow-500': passwordStrength.score === 3,
                      'bg-blue-500': passwordStrength.score === 4,
                      'bg-green-500': passwordStrength.score === 5
                    }"
                    :style="{ width: `${(passwordStrength.score / 5) * 100}%` }"
                  ></div>
                </div>
                <span class="text-xs" :class="passwordStrength.color">
                  {{ passwordStrength.text }}
                </span>
              </div>
            </div>
          </div>

          <!-- Confirm Password Field -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-200 mb-2">
              Confirmar senha
            </label>
            <Input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              placeholder="Digite a senha novamente"
              :disabled="authStore.loading"
              class="bg-white/10 border-white/20 text-white placeholder-gray-400"
              :class="{
                'border-red-500': form.confirmPassword && !passwordsMatch,
                'border-green-500': form.confirmPassword && passwordsMatch
              }"
              required
            />
            
            <!-- Password Match Indicator -->
            <div v-if="form.confirmPassword" class="mt-1">
              <p v-if="!passwordsMatch" class="text-red-400 text-xs">
                As senhas não coincidem
              </p>
              <p v-else class="text-green-400 text-xs">
                ✓ Senhas coincidem
              </p>
            </div>
          </div>

          <!-- Terms and Conditions -->
           <div class="flex items-start space-x-3">
             <input
               id="accept-terms"
               v-model="acceptTerms"
               type="checkbox"
               class="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-white/20 bg-white/10 rounded"
               required
             >
             <label for="accept-terms" class="text-sm text-gray-300">
               Eu aceito os 
               <a href="#" class="text-purple-400 hover:text-purple-300 font-medium transition-colors">Termos de Uso</a>
               e a 
               <a href="#" class="text-purple-400 hover:text-purple-300 font-medium transition-colors">Política de Privacidade</a>
             </label>
           </div>

           <!-- Error Message -->
           <Alert v-if="authStore.error" :message="authStore.error" type="error" class="bg-red-500/20 border-red-500/50" />

           <!-- Register Button -->
           <Button
             type="submit"
             variant="primary"
             size="lg"
             :loading="authStore.loading"
             :disabled="!isFormValid"
             class="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
           >
             Criar conta
           </Button>

           <!-- Login Link -->
           <div class="text-center">
             <p class="text-gray-300">
               Já tem uma conta?
               <router-link
                 to="/login"
                 class="text-purple-400 hover:text-purple-300 font-medium transition-colors"
               >
                 Fazer login
               </router-link>
             </p>
           </div>
         </form>
       </Card>
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