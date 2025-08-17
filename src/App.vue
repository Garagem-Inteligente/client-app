<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const navigateTo = (page: string) => {
  router.push(`/${page === 'home' ? '' : page}`)
  // Scroll para o topo quando navegar para uma nova página
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Navigation Header -->
    <nav class="bg-gray-800 border-b border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link to="/" class="text-xl font-bold text-white">
              AutoCare
            </router-link>
          </div>
          
          <div class="flex items-center space-x-4">
            <router-link 
              to="/" 
              class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              active-class="text-white bg-gray-900"
            >
              Home
            </router-link>
            <router-link 
              to="/features" 
              class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              active-class="text-white bg-gray-900"
            >
              Features
            </router-link>
            <router-link 
              to="/pricing" 
              class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              active-class="text-white bg-gray-900"
            >
              Pricing
            </router-link>
            <router-link 
              to="/support" 
              class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              active-class="text-white bg-gray-900"
            >
              Support
            </router-link>
            
            <!-- Auth buttons -->
            <div v-if="!authStore.isAuthenticated" class="flex items-center space-x-2">
              <router-link 
                to="/auth/login" 
                class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </router-link>
              <router-link 
                to="/auth/register" 
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Register
              </router-link>
            </div>
            
            <!-- User menu -->
            <div v-else class="flex items-center space-x-4">
              <router-link 
                to="/dashboard" 
                class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                active-class="text-white bg-gray-900"
              >
                Dashboard
              </router-link>
              <button 
                @click="authStore.logout" 
                class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
    
    <!-- Main content -->
    <main>
      <router-view @navigate="navigateTo" />
    </main>
  </div>
</template>
