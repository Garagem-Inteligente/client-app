<script setup lang="ts">
import { ref } from 'vue';
import Button from './Button.vue';
import Badge from './Badge.vue';

const emit = defineEmits<{
  navigate: [page: string]
}>();

const appFeatures = [
  { icon: 'transfer', text: 'Registro transferível entre donos' },
  { icon: 'bell', text: 'Alertas de manutenção preventiva' },
  { icon: 'document', text: 'Gerenciamento de documentos' },
  { icon: 'chart', text: 'Histórico completo preservado' }
];

const isAnimated = ref(false);
const mobileMenuOpen = ref(false);

setTimeout(() => {
  isAnimated.value = true;
}, 500);

const handleNavigation = (page: string) => {
  emit('navigate', page);
  mobileMenuOpen.value = false;
};
</script>

<template>
  <div class="w-full min-h-[600px] md:min-h-[700px] lg:min-h-[750px] bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 overflow-hidden">
    <!-- Navbar -->
    <nav class="container mx-auto px-4 sm:px-6 py-4 relative z-20">
      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25" />
          </svg>
          <span class="text-white text-xl font-bold">AutoCare</span>
        </div>
        
        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center space-x-6">
          <button @click="handleNavigation('home')" class="text-gray-300 hover:text-white transition-colors duration-300">Início</button>
          <button @click="handleNavigation('features')" class="text-gray-300 hover:text-white transition-colors duration-300">Recursos</button>
          <button @click="handleNavigation('pricing')" class="text-gray-300 hover:text-white transition-colors duration-300">Preços</button>
          <button @click="handleNavigation('support')" class="text-gray-300 hover:text-white transition-colors duration-300">Suporte</button>
          <router-link to="/select-type?mode=login" class="text-gray-300 hover:text-white transition-colors duration-300">Login</router-link>
          <router-link to="/select-type?mode=register" class="text-gray-300 hover:text-white transition-colors duration-300">Registro</router-link>
          <Button variant="primary" size="sm">Baixar App</Button>
        </div>
        
        <!-- Mobile Menu Button -->
        <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden text-white p-2 hover:bg-purple-900/30 rounded-lg transition-colors">
          <svg v-if="!mobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="md:hidden absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-t border-purple-900/50 shadow-xl">
        <div class="container mx-auto px-4 py-4 space-y-3">
          <button @click="handleNavigation('home')" class="block w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-purple-900/30 rounded-lg transition-colors">Início</button>
          <button @click="handleNavigation('features')" class="block w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-purple-900/30 rounded-lg transition-colors">Recursos</button>
          <button @click="handleNavigation('pricing')" class="block w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-purple-900/30 rounded-lg transition-colors">Preços</button>
          <button @click="handleNavigation('support')" class="block w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-purple-900/30 rounded-lg transition-colors">Suporte</button>
          <router-link to="/select-type?mode=login" class="block px-4 py-3 text-gray-300 hover:text-white hover:bg-purple-900/30 rounded-lg transition-colors">Login</router-link>
          <router-link to="/select-type?mode=register" class="block px-4 py-3 text-gray-300 hover:text-white hover:bg-purple-900/30 rounded-lg transition-colors">Registro</router-link>
          <div class="pt-2">
            <Button variant="primary" class="w-full">Baixar App</Button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <div class="container mx-auto px-4 sm:px-6 py-8 md:py-12 pb-12 md:pb-20 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 relative z-10">
      <!-- Left Content -->
      <div class="w-full lg:w-1/2 flex flex-col items-center lg:items-start space-y-6 text-center lg:text-left">
        <Badge 
          variant="info" 
          size="lg" 
          rounded 
          class="opacity-0 animate-fade-in" 
          :class="{ 'opacity-100': isAnimated }"
        >
          NOVO APP
        </Badge>
        
        <h1 
          class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight transform translate-y-4 opacity-0 transition-all duration-700 delay-100" 
          :class="{ 'translate-y-0 opacity-100': isAnimated }"
        >
          Cuide do seu carro <span class="text-purple-500 block sm:inline">sem complicações</span>
        </h1>
        
        <p 
          class="text-base sm:text-lg text-gray-300 max-w-2xl transform translate-y-4 opacity-0 transition-all duration-700 delay-200" 
          :class="{ 'translate-y-0 opacity-100': isAnimated }"
        >
          Crie um registro digital completo do seu veículo que pode ser transferido para o próximo dono, 
          preservando todo o histórico real de manutenções e cuidados. O futuro da documentação automotiva.
        </p>
        
        <div 
          class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto transform translate-y-4 opacity-0 transition-all duration-700 delay-300 relative z-20" 
          :class="{ 'translate-y-0 opacity-100': isAnimated }"
        >
          <Button variant="primary" size="lg" class="w-full sm:w-auto" @click="handleNavigation('features')">Baixar Agora</Button>
          <Button variant="outline" size="lg" class="w-full sm:w-auto" @click="handleNavigation('features')">Saiba Mais</Button>
        </div>
        
        <div 
          class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-2xl transform translate-y-4 opacity-0 transition-all duration-700 delay-400" 
          :class="{ 'translate-y-0 opacity-100': isAnimated }"
        >
          <div v-for="(feature, index) in appFeatures" :key="index" class="flex items-start space-x-3">
            <div class="flex-shrink-0 bg-purple-900 rounded-full p-1.5 mt-0.5">
              <!-- Transfer Icon -->
              <svg v-if="feature.icon === 'transfer'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <!-- Bell Icon -->
              <svg v-else-if="feature.icon === 'bell'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <!-- Document Icon -->
              <svg v-else-if="feature.icon === 'document'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <!-- Chart Icon -->
              <svg v-else-if="feature.icon === 'chart'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span class="text-xs sm:text-sm text-gray-300 leading-tight">{{ feature.text }}</span>
          </div>
        </div>
      </div>
      
      <!-- Right Content (Phone Mockup) -->
      <div 
        class="w-full lg:w-1/2 relative flex justify-center transform translate-y-8 opacity-0 transition-all duration-1000 delay-500" 
        :class="{ 'translate-y-0 opacity-100': isAnimated }"
      >
        <div class="relative scale-90 sm:scale-100">
          <!-- Phone frame -->
          <div class="w-64 h-[530px] sm:w-72 sm:h-[580px] bg-gray-900 rounded-[40px] p-2 shadow-2xl border-4 border-gray-800 relative z-10">
            <div class="bg-gray-800 w-full h-full rounded-[32px] overflow-hidden">
              <!-- App screenshot -->
              <div class="bg-gradient-to-b from-purple-900 to-gray-900 w-full h-full pt-6 px-3">
                <!-- Status bar -->
                <div class="flex justify-between items-center mb-6 px-2">
                  <div class="text-xs text-white">9:41</div>
                  <div class="flex space-x-1">
                    <div class="w-4 h-2 bg-white rounded-sm"></div>
                    <div class="w-4 h-2 bg-white rounded-sm"></div>
                    <div class="w-4 h-2 bg-white rounded-sm"></div>
                    <div class="w-4 h-2 bg-white rounded-sm"></div>
                  </div>
                </div>
                
                <!-- App content -->
                <div class="text-center mb-6">
                  <div class="flex justify-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25" />
                    </svg>
                  </div>
                  <h3 class="text-white text-lg font-bold">AutoCare</h3>
                </div>
                
                <!-- Car info card -->
                <div class="bg-gray-800 rounded-xl p-3 mb-4 shadow-lg">
                  <div class="flex justify-between items-center mb-2">
                    <h4 class="text-white text-sm font-medium">Meu Veículo</h4>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                  </div>
                  <div class="flex items-center space-x-3">
                    <div class="w-12 h-12 bg-purple-900 rounded-lg flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                      </svg>
                    </div>
                    <div>
                      <h5 class="text-white text-sm font-medium">Honda Civic</h5>
                      <p class="text-gray-400 text-xs">2020 • 45.320 km</p>
                    </div>
                  </div>
                </div>
                
                <!-- Alert card -->
                <div class="bg-purple-900/30 border border-purple-500/30 rounded-xl p-3 mb-4">
                  <div class="flex items-start space-x-3">
                    <div class="flex-shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h5 class="text-white text-xs font-medium">Próxima Manutenção</h5>
                      <p class="text-purple-300 text-xs">Troca de óleo em 15 dias</p>
                    </div>
                  </div>
                </div>
                
                <!-- Menu buttons -->
                <div class="grid grid-cols-3 gap-2">
                  <div class="bg-gray-800 rounded-lg p-2 flex flex-col items-center">
                    <div class="w-8 h-8 bg-purple-900/50 rounded-lg flex items-center justify-center mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <span class="text-white text-xs">Notas</span>
                  </div>
                  <div class="bg-gray-800 rounded-lg p-2 flex flex-col items-center">
                    <div class="w-8 h-8 bg-purple-900/50 rounded-lg flex items-center justify-center mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span class="text-white text-xs">Agenda</span>
                  </div>
                  <div class="bg-gray-800 rounded-lg p-2 flex flex-col items-center">
                    <div class="w-8 h-8 bg-purple-900/50 rounded-lg flex items-center justify-center mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <span class="text-white text-xs">Histórico</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Decorative elements -->
          <div class="hidden md:block absolute top-1/4 -left-10 w-40 h-40 bg-purple-600 rounded-full filter blur-3xl opacity-20"></div>
          <div class="hidden md:block absolute bottom-1/4 -right-10 w-40 h-40 bg-blue-600 rounded-full filter blur-3xl opacity-20"></div>
        </div>
      </div>
    </div>
    
    <!-- Decorative elements -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
      <div class="absolute top-1/4 left-1/4 w-48 h-48 md:w-96 md:h-96 bg-purple-600 rounded-full filter blur-3xl"></div>
      <div class="absolute bottom-1/4 right-1/4 w-48 h-48 md:w-96 md:h-96 bg-blue-600 rounded-full filter blur-3xl"></div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>