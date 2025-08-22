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

    
    <!-- Main content -->
    <main>
      <router-view @navigate="navigateTo" />
    </main>
  </div>
</template>
