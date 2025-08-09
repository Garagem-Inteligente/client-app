<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Badge from './Badge.vue';
import Button from './Button.vue';

interface Feature {
  id: number;
  title: string;
  autocare: boolean;
  traditional: boolean;
  description: string;
}

interface Benefit {
  id: number;
  icon: string;
  title: string;
  description: string;
  color: string;
}

const features: Feature[] = [
  {
    id: 1,
    title: 'Alertas Inteligentes',
    autocare: true,
    traditional: false,
    description: 'Notificações automáticas baseadas em quilometragem e tempo'
  },
  {
    id: 2,
    title: 'Histórico Digital',
    autocare: true,
    traditional: false,
    description: 'Registro completo e acessível de todas as manutenções'
  },
  {
    id: 3,
    title: 'Agendamento Online',
    autocare: true,
    traditional: false,
    description: 'Marcação de serviços direto pelo app com oficinas parceiras'
  },
  {
    id: 4,
    title: 'Documentos Organizados',
    autocare: true,
    traditional: false,
    description: 'Notas fiscais e garantias sempre à mão, sem papelada'
  },
  {
    id: 5,
    title: 'Análise de Custos',
    autocare: true,
    traditional: false,
    description: 'Relatórios detalhados de gastos e economia gerada'
  },
  {
    id: 6,
    title: 'Lembretes Manuais',
    autocare: false,
    traditional: true,
    description: 'Dependência de anotações pessoais e memória'
  },
  {
    id: 7,
    title: 'Papelada Física',
    autocare: false,
    traditional: true,
    description: 'Documentos em papel que podem ser perdidos'
  },
  {
    id: 8,
    title: 'Ligações Telefônicas',
    autocare: false,
    traditional: true,
    description: 'Necessidade de ligar para agendar serviços'
  }
];

const benefits: Benefit[] = [
  {
    id: 1,
    icon: 'clock',
    title: 'Economia de Tempo',
    description: 'Até 70% menos tempo gasto com organização e agendamentos',
    color: 'green'
  },
  {
    id: 2,
    icon: 'money',
    title: 'Redução de Custos',
    description: 'Economia média de 30% com manutenções preventivas',
    color: 'blue'
  },
  {
    id: 3,
    icon: 'shield',
    title: 'Maior Segurança',
    description: 'Redução de 85% em problemas inesperados no veículo',
    color: 'purple'
  },
  {
    id: 4,
    icon: 'chart',
    title: 'Valorização do Veículo',
    description: 'Histórico completo aumenta valor de revenda em até 15%',
    color: 'orange'
  }
];

const isVisible = ref(false);

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true;
  }, 500);
});
</script>

<template>
  <section class="py-20 bg-gray-800 relative overflow-hidden">
    <!-- Background decorations -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
      <div class="absolute top-1/3 left-1/3 w-96 h-96 bg-green-600 rounded-full filter blur-3xl"></div>
      <div class="absolute bottom-1/3 right-1/3 w-96 h-96 bg-orange-600 rounded-full filter blur-3xl"></div>
    </div>
    
    <div class="container mx-auto px-6 relative z-10">
      <!-- Section header -->
      <div 
        class="text-center mb-16 transform translate-y-10 opacity-0 transition-all duration-1000" 
        :class="{ 'translate-y-0 opacity-100': isVisible }"
      >
        <Badge text="COMPARATIVO" color="green" size="lg" rounded class="mb-4" />
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Por que escolher o <span class="text-green-500">AutoCare</span>?</h2>
        <p class="text-gray-300 max-w-2xl mx-auto">Veja como o AutoCare revoluciona o cuidado com seu veículo em comparação aos métodos tradicionais.</p>
      </div>
      
      <!-- Comparison table -->
      <div 
        class="max-w-5xl mx-auto mb-20 transform translate-y-10 opacity-0 transition-all duration-1000 delay-300" 
        :class="{ 'translate-y-0 opacity-100': isVisible }"
      >
        <div class="bg-gray-900 bg-opacity-50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl">
          <!-- Table header -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 md:p-6 border-b border-gray-700">
            <div class="text-center order-1 md:order-1">
              <h3 class="text-base md:text-lg font-medium text-gray-400">Recursos</h3>
            </div>
            <div class="text-center order-2 md:order-2">
              <div class="inline-flex items-center space-x-2 bg-green-900/50 px-3 md:px-4 py-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 md:h-5 md:w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <h3 class="text-base md:text-lg font-bold text-green-400">AutoCare</h3>
              </div>
            </div>
            <div class="text-center order-3 md:order-3">
              <h3 class="text-base md:text-lg font-medium text-gray-400">Método Tradicional</h3>
            </div>
          </div>
          
          <!-- Table rows -->
          <div class="divide-y divide-gray-700">
            <div v-for="feature in features.slice(0, 5)" :key="feature.id" class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 hover:bg-gray-800/50 transition-colors">
              <div class="flex items-center justify-center md:justify-start order-1 md:order-1">
                <h4 class="text-white font-medium text-center md:text-left">{{ feature.title }}</h4>
              </div>
              <div class="flex justify-center items-center order-2 md:order-2">
                <div v-if="feature.autocare" class="flex items-center space-x-2 text-green-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="text-sm font-medium">Incluído</span>
                </div>
                <div v-else class="flex items-center space-x-2 text-red-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span class="text-sm font-medium">Não disponível</span>
                </div>
              </div>
              <div class="flex justify-center items-center order-3 md:order-3">
                <div v-if="feature.traditional" class="flex items-center space-x-2 text-yellow-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span class="text-sm font-medium">Limitado</span>
                </div>
                <div v-else class="flex items-center space-x-2 text-red-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span class="text-sm font-medium">Não disponível</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Benefits grid -->
      <div 
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 transform translate-y-10 opacity-0 transition-all duration-1000 delay-500" 
        :class="{ 'translate-y-0 opacity-100': isVisible }"
      >
        <div 
          v-for="benefit in benefits" 
          :key="benefit.id"
          class="bg-gray-900 bg-opacity-50 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-gray-800 transition-colors duration-300"
        >
          <!-- Clock Icon -->
          <div class="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4" :class="`bg-${benefit.color}-900/50`">
            <svg v-if="benefit.icon === 'clock'" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" :class="`text-${benefit.color}-400`" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <!-- Money Icon -->
            <svg v-else-if="benefit.icon === 'money'" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" :class="`text-${benefit.color}-400`" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <!-- Shield Icon -->
            <svg v-else-if="benefit.icon === 'shield'" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" :class="`text-${benefit.color}-400`" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <!-- Chart Icon -->
            <svg v-else-if="benefit.icon === 'chart'" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" :class="`text-${benefit.color}-400`" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          
          <h3 class="text-xl font-bold text-white mb-3">{{ benefit.title }}</h3>
          <p class="text-gray-400 text-sm">{{ benefit.description }}</p>
        </div>
      </div>
      
      <!-- CTA Section -->
      <div 
        class="text-center transform translate-y-10 opacity-0 transition-all duration-1000 delay-700" 
        :class="{ 'translate-y-0 opacity-100': isVisible }"
      >
        <h3 class="text-2xl md:text-3xl font-bold text-white mb-6">Faça parte da revolução na manutenção automotiva</h3>
        <div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button label="Começar Agora" primary class="px-8 py-3 text-lg" />
          <Button label="Ver Demonstração" class="px-8 py-3 text-lg" />
        </div>
      </div>
    </div>
  </section>
</template>