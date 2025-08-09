<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Badge from './Badge.vue';
import Button from './Button.vue';

interface Feature {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  image: string;
}

const features: Feature[] = [
  {
    id: 1,
    title: 'Registro Transferível',
    description: 'Crie um registro digital completo que pode ser transferido para o próximo dono, mantendo todo o histórico real do veículo de dono para dono.',
    icon: 'transfer',
    color: 'purple',
    image: '/vehicle-transfer.png'
  },
  {
    id: 2,
    title: 'Alertas de Manutenção',
    description: 'Receba notificações inteligentes sobre manutenções preventivas baseadas no histórico e quilometragem do seu veículo.',
    icon: 'bell',
    color: 'blue',
    image: '/maintenance-alert.png'
  },
  {
    id: 3,
    title: 'Gerenciamento de Documentos',
    description: 'Organize notas fiscais, comprovantes e garantias em um só lugar. Acesse quando precisar, sem papelada.',
    icon: 'document',
    color: 'green',
    image: '/document-management.png'
  },
  {
    id: 4,
    title: 'Histórico Preservado',
    description: 'Visualize todo o histórico de manutenções, peças trocadas e serviços realizados que permanece mesmo após a venda.',
    icon: 'chart',
    color: 'orange',
    image: '/vehicle-history.png'
  }
];

const activeFeature = ref(features[0]);
const isVisible = ref(false);

const setActiveFeature = (feature: Feature) => {
  activeFeature.value = feature;
};

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true;
  }, 500);
});
</script>

<template>
  <section class="py-20 bg-gray-900 relative overflow-hidden">
    <!-- Background decorations -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
      <div class="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl"></div>
      <div class="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-600 rounded-full filter blur-3xl"></div>
    </div>
    
    <div class="container mx-auto px-6 relative z-10">
      <!-- Section header -->
      <div 
        class="text-center mb-16 transform translate-y-10 opacity-0 transition-all duration-1000" 
        :class="{ 'translate-y-0 opacity-100': isVisible }"
      >
        <Badge text="RECURSOS" color="purple" size="lg" rounded class="mb-4" />
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Tudo que você precisa para <span class="text-purple-500">cuidar do seu carro</span></h2>
        <p class="text-gray-300 max-w-2xl mx-auto">O AutoCare reúne todas as ferramentas necessárias para simplificar a manutenção do seu veículo, economizar tempo e dinheiro, e evitar problemas inesperados.</p>
      </div>
      
      <!-- Features tabs and content -->
      <div class="flex flex-col lg:flex-row gap-12 items-start lg:items-start">
        <!-- Feature tabs (left side on desktop) -->
        <div 
          class="lg:w-1/2 space-y-4 transform translate-x-10 opacity-0 transition-all duration-1000 delay-300 w-full" 
          :class="{ 'translate-x-0 opacity-100': isVisible }"
        >
          <div 
            v-for="feature in features" 
            :key="feature.id"
            @click="setActiveFeature(feature)"
            class="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-4 cursor-pointer transition-all duration-300 hover:bg-gray-700"
            :class="{ 'border-l-4': activeFeature.id === feature.id }"
            :style="{ borderColor: activeFeature.id === feature.id ? `var(--color-${feature.color}-500)` : 'transparent' }"
          >
            <div class="flex items-start space-x-4">
              <!-- Bell Icon -->
              <div class="flex-shrink-0 mt-1 p-2 rounded-lg" :class="`bg-${feature.color}-900`">
                <!-- Transfer Icon -->
                <svg v-if="feature.icon === 'transfer'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" :class="`text-${feature.color}-400`" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <!-- Bell Icon -->
                <svg v-else-if="feature.icon === 'bell'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" :class="`text-${feature.color}-400`" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <!-- Document Icon -->
                <svg v-else-if="feature.icon === 'document'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" :class="`text-${feature.color}-400`" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <!-- Chart Icon -->
                <svg v-else-if="feature.icon === 'chart'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" :class="`text-${feature.color}-400`" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <!-- Calendar Icon -->
                <svg v-else-if="feature.icon === 'calendar'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" :class="`text-${feature.color}-400`" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 class="text-white font-medium text-lg">{{ feature.title }}</h3>
                <p class="text-gray-400 text-sm mt-1">{{ feature.description }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Feature showcase (right side on desktop) -->
        <div 
          class="lg:w-1/2 transform translate-x-10 opacity-0 transition-all duration-1000 delay-500 w-full flex justify-center" 
          :class="{ 'translate-x-0 opacity-100': isVisible }"
        >
          <div class="relative">
            <!-- Phone frame -->
            <div class="w-72 h-[580px] bg-gray-900 rounded-[40px] p-2 shadow-2xl border-4 border-gray-800 relative z-10">
              <div class="bg-gray-800 w-full h-full rounded-[32px] overflow-hidden">
                <!-- App screenshot based on active feature -->
                <div class="bg-gradient-to-b from-gray-900 to-gray-800 w-full h-full pt-6 px-3 relative">
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
                  
                  <!-- App header -->
                  <div class="flex justify-between items-center mb-6 px-2">
                    <div class="flex items-center space-x-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25" />
                      </svg>
                      <span class="text-white font-medium">AutoCare</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </div>
                  
                  <!-- Feature specific content -->
                  <div class="px-2">
                    <!-- Transfer Feature -->
                    <div v-if="activeFeature.id === 1" class="space-y-4">
                      <h3 class="text-white font-medium">Registro do Veículo</h3>
                      
                      <!-- Vehicle info card -->
                      <div class="bg-purple-900/30 border border-purple-500/50 rounded-xl p-4 mb-3">
                        <div class="flex items-center justify-between mb-3">
                          <h5 class="text-white text-sm font-medium">Honda Civic 2020</h5>
                          <span class="text-xs bg-purple-500 text-white px-2 py-1 rounded-full">Transferível</span>
                        </div>
                        <div class="space-y-2">
                          <div class="flex justify-between text-xs">
                            <span class="text-gray-400">Proprietário</span>
                            <span class="text-white">João Silva</span>
                          </div>
                          <div class="flex justify-between text-xs">
                            <span class="text-gray-400">Quilometragem</span>
                            <span class="text-white">45.230 km</span>
                          </div>
                          <div class="flex justify-between text-xs">
                            <span class="text-gray-400">Última revisão</span>
                            <span class="text-white">15/12/2024</span>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Transfer button -->
                      <div class="bg-gray-800/50 border border-gray-600 rounded-xl p-3 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        <p class="text-white text-xs font-medium">Transferir Registro</p>
                        <p class="text-gray-400 text-xs mt-1">Mantenha o histórico completo</p>
                      </div>
                      
                      <!-- History preview -->
                      <div class="space-y-2">
                        <h6 class="text-white text-xs font-medium">Histórico Preservado</h6>
                        <div class="bg-gray-800/30 rounded-lg p-2">
                          <div class="flex items-center space-x-2 mb-1">
                            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span class="text-xs text-gray-300">23 manutenções registradas</span>
                          </div>
                          <div class="flex items-center space-x-2 mb-1">
                            <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span class="text-xs text-gray-300">15 documentos anexados</span>
                          </div>
                          <div class="flex items-center space-x-2">
                            <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span class="text-xs text-gray-300">2 proprietários anteriores</span>
                          </div>
                        </div>
                      </div>
                      
                      <div class="mt-6">
                        <button class="w-full bg-purple-600 text-white py-2 rounded-lg text-sm font-medium">Ver Todas as Manutenções</button>
                      </div>
                    </div>
                    
                    <!-- Documents Feature -->
                    <div v-if="activeFeature.id === 2" class="space-y-4">
                      <h3 class="text-white font-medium">Documentos do Veículo</h3>
                      
                      <!-- Document items -->
                      <div class="bg-gray-800 rounded-xl p-3 mb-3">
                        <div class="flex items-center justify-between">
                          <div class="flex items-center space-x-3">
                            <div class="flex-shrink-0 p-2 bg-blue-900/50 rounded-lg">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div>
                              <h5 class="text-white text-xs font-medium">Nota Fiscal - Troca de Óleo</h5>
                              <p class="text-gray-400 text-xs">15/03/2023 • PDF</p>
                            </div>
                          </div>
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </div>
                      </div>
                      
                      <div class="bg-gray-800 rounded-xl p-3 mb-3">
                        <div class="flex items-center justify-between">
                          <div class="flex items-center space-x-3">
                            <div class="flex-shrink-0 p-2 bg-blue-900/50 rounded-lg">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div>
                              <h5 class="text-white text-xs font-medium">Garantia - Bateria Nova</h5>
                              <p class="text-gray-400 text-xs">02/02/2023 • PDF</p>
                            </div>
                          </div>
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </div>
                      </div>
                      
                      <div class="bg-gray-800 rounded-xl p-3 mb-3">
                        <div class="flex items-center justify-between">
                          <div class="flex items-center space-x-3">
                            <div class="flex-shrink-0 p-2 bg-blue-900/50 rounded-lg">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div>
                              <h5 class="text-white text-xs font-medium">CRLV Digital</h5>
                              <p class="text-gray-400 text-xs">10/01/2023 • PDF</p>
                            </div>
                          </div>
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </div>
                      </div>
                      
                      <div class="mt-6 flex space-x-2">
                        <button class="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium">Adicionar</button>
                        <button class="flex-1 bg-gray-700 text-white py-2 rounded-lg text-sm font-medium">Ver Todos</button>
                      </div>
                    </div>
                    
                    <!-- History Feature -->
                    <div v-if="activeFeature.id === 3" class="space-y-4">
                      <h3 class="text-white font-medium">Histórico do Veículo</h3>
                      
                      <!-- Chart -->
                      <div class="bg-gray-800 rounded-xl p-3 mb-3">
                        <h5 class="text-white text-xs font-medium mb-2">Gastos com Manutenção</h5>
                        <div class="h-32 flex items-end space-x-2">
                          <div class="flex-1 flex flex-col items-center">
                            <div class="w-full bg-green-500/20 hover:bg-green-500/40 transition-colors rounded-t-sm" style="height: 40%"></div>
                            <span class="text-gray-400 text-xs mt-1">Jan</span>
                          </div>
                          <div class="flex-1 flex flex-col items-center">
                            <div class="w-full bg-green-500/20 hover:bg-green-500/40 transition-colors rounded-t-sm" style="height: 25%"></div>
                            <span class="text-gray-400 text-xs mt-1">Fev</span>
                          </div>
                          <div class="flex-1 flex flex-col items-center">
                            <div class="w-full bg-green-500/20 hover:bg-green-500/40 transition-colors rounded-t-sm" style="height: 65%"></div>
                            <span class="text-gray-400 text-xs mt-1">Mar</span>
                          </div>
                          <div class="flex-1 flex flex-col items-center">
                            <div class="w-full bg-green-500/20 hover:bg-green-500/40 transition-colors rounded-t-sm" style="height: 20%"></div>
                            <span class="text-gray-400 text-xs mt-1">Abr</span>
                          </div>
                          <div class="flex-1 flex flex-col items-center">
                            <div class="w-full bg-green-500/20 hover:bg-green-500/40 transition-colors rounded-t-sm" style="height: 15%"></div>
                            <span class="text-gray-400 text-xs mt-1">Mai</span>
                          </div>
                          <div class="flex-1 flex flex-col items-center">
                            <div class="w-full bg-green-500 rounded-t-sm" style="height: 80%"></div>
                            <span class="text-gray-400 text-xs mt-1">Jun</span>
                          </div>
                        </div>
                      </div>
                      
                      <!-- History items -->
                      <div class="space-y-3">
                        <h5 class="text-white text-xs font-medium">Últimas Manutenções</h5>
                        
                        <div class="bg-gray-800 rounded-xl p-3">
                          <div class="flex items-start space-x-3">
                            <div class="flex-shrink-0 p-2 bg-green-900/50 rounded-lg">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <div>
                              <h5 class="text-white text-xs font-medium">Troca de Óleo e Filtros</h5>
                              <p class="text-gray-400 text-xs">15/06/2023 • R$ 350,00</p>
                              <p class="text-gray-500 text-xs mt-1">Realizado em: Oficina Central</p>
                            </div>
                          </div>
                        </div>
                        
                        <div class="bg-gray-800 rounded-xl p-3">
                          <div class="flex items-start space-x-3">
                            <div class="flex-shrink-0 p-2 bg-green-900/50 rounded-lg">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <div>
                              <h5 class="text-white text-xs font-medium">Substituição da Bateria</h5>
                              <p class="text-gray-400 text-xs">02/02/2023 • R$ 450,00</p>
                              <p class="text-gray-500 text-xs mt-1">Realizado em: AutoElétrica Silva</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div class="mt-4">
                        <button class="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-medium">Ver Histórico Completo</button>
                      </div>
                    </div>
                    
                    <!-- Scheduling Feature -->
                    <div v-if="activeFeature.id === 4" class="space-y-4">
                      <h3 class="text-white font-medium">Agendamento de Serviços</h3>
                      
                      <!-- Calendar view -->
                      <div class="bg-gray-800 rounded-xl p-3 mb-3">
                        <div class="flex justify-between items-center mb-2">
                          <h5 class="text-white text-xs font-medium">Junho 2023</h5>
                          <div class="flex space-x-2">
                            <button class="text-gray-400 hover:text-white">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                            <button class="text-gray-400 hover:text-white">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        
                        <!-- Calendar grid -->
                        <div class="grid grid-cols-7 gap-1 text-center">
                          <span class="text-gray-500 text-xs">D</span>
                          <span class="text-gray-500 text-xs">S</span>
                          <span class="text-gray-500 text-xs">T</span>
                          <span class="text-gray-500 text-xs">Q</span>
                          <span class="text-gray-500 text-xs">Q</span>
                          <span class="text-gray-500 text-xs">S</span>
                          <span class="text-gray-500 text-xs">S</span>
                          
                          <!-- Days -->
                          <span class="text-gray-500 text-xs py-1">28</span>
                          <span class="text-gray-500 text-xs py-1">29</span>
                          <span class="text-gray-500 text-xs py-1">30</span>
                          <span class="text-gray-500 text-xs py-1">31</span>
                          <span class="text-gray-400 text-xs py-1">1</span>
                          <span class="text-gray-400 text-xs py-1">2</span>
                          <span class="text-gray-400 text-xs py-1">3</span>
                          
                          <span class="text-gray-400 text-xs py-1">4</span>
                          <span class="text-gray-400 text-xs py-1">5</span>
                          <span class="text-gray-400 text-xs py-1">6</span>
                          <span class="text-gray-400 text-xs py-1">7</span>
                          <span class="text-gray-400 text-xs py-1">8</span>
                          <span class="text-gray-400 text-xs py-1">9</span>
                          <span class="text-gray-400 text-xs py-1">10</span>
                          
                          <span class="text-gray-400 text-xs py-1">11</span>
                          <span class="text-gray-400 text-xs py-1">12</span>
                          <span class="text-gray-400 text-xs py-1">13</span>
                          <span class="text-gray-400 text-xs py-1">14</span>
                          <span class="text-gray-400 text-xs py-1">15</span>
                          <span class="text-white text-xs py-1 bg-orange-500 rounded-full">16</span>
                          <span class="text-gray-400 text-xs py-1">17</span>
                          
                          <span class="text-gray-400 text-xs py-1">18</span>
                          <span class="text-gray-400 text-xs py-1">19</span>
                          <span class="text-gray-400 text-xs py-1">20</span>
                          <span class="text-white text-xs py-1 bg-orange-500 rounded-full">21</span>
                          <span class="text-gray-400 text-xs py-1">22</span>
                          <span class="text-gray-400 text-xs py-1">23</span>
                          <span class="text-gray-400 text-xs py-1">24</span>
                        </div>
                      </div>
                      
                      <!-- Scheduled services -->
                      <div class="space-y-3">
                        <h5 class="text-white text-xs font-medium">Serviços Agendados</h5>
                        
                        <div class="bg-orange-900/30 border border-orange-500/30 rounded-xl p-3">
                          <div class="flex items-start space-x-3">
                            <div class="flex-shrink-0 mt-1">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div>
                              <h5 class="text-white text-xs font-medium">Revisão Completa</h5>
                              <p class="text-orange-300 text-xs">16/06 • 14:30</p>
                              <p class="text-gray-400 text-xs mt-1">Oficina Central • 2h estimadas</p>
                            </div>
                          </div>
                        </div>
                        
                        <div class="bg-orange-900/30 border border-orange-500/30 rounded-xl p-3">
                          <div class="flex items-start space-x-3">
                            <div class="flex-shrink-0 mt-1">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div>
                              <h5 class="text-white text-xs font-medium">Alinhamento e Balanceamento</h5>
                              <p class="text-orange-300 text-xs">21/06 • 10:00</p>
                              <p class="text-gray-400 text-xs mt-1">Pneus & Cia • 1h estimada</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div class="mt-4">
                        <button class="w-full bg-orange-600 text-white py-2 rounded-lg text-sm font-medium">Agendar Novo Serviço</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Decorative elements -->
            <div class="absolute top-1/4 -left-10 w-40 h-40 bg-purple-600 rounded-full filter blur-3xl opacity-20"></div>
            <div class="absolute bottom-1/4 -right-10 w-40 h-40 bg-blue-600 rounded-full filter blur-3xl opacity-20"></div>
          </div>
        </div>
      </div>
      
      <!-- CTA Section -->
      <div 
        class="mt-20 text-center transform translate-y-10 opacity-0 transition-all duration-1000 delay-700" 
        :class="{ 'translate-y-0 opacity-100': isVisible }"
      >
        <h3 class="text-2xl md:text-3xl font-bold text-white mb-6">Pronto para simplificar a manutenção do seu carro?</h3>
        <div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button label="Baixar Agora" primary class="px-8 py-3 text-lg" />
          <Button label="Saiba Mais" class="px-8 py-3 text-lg" />
        </div>
      </div>
    </div>
  </section>
</template>