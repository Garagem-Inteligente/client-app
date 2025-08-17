<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Badge from '../components/Badge.vue';
import Button from '../components/Button.vue';

const emit = defineEmits<{
  navigate: [page: string]
}>();

interface Feature {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  benefits: string[];
  image?: string;
}

const features: Feature[] = [
  {
    id: 1,
    title: 'Registro Digital Transferível',
    description: 'Crie um histórico completo do seu veículo que pode ser transferido para o próximo proprietário, mantendo todo o valor e confiabilidade.',
    icon: 'transfer',
    color: 'purple',
    benefits: [
      'Histórico completo preservado',
      'Aumento do valor de revenda',
      'Transparência total para compradores',
      'Redução de fraudes'
    ]
  },
  {
    id: 2,
    title: 'Alertas Inteligentes de Manutenção',
    description: 'Receba notificações automáticas baseadas na quilometragem, tempo e histórico do seu veículo para nunca perder uma manutenção importante.',
    icon: 'bell',
    color: 'blue',
    benefits: [
      'Notificações personalizadas',
      'Prevenção de problemas graves',
      'Economia com manutenção preventiva',
      'Lembretes por WhatsApp e email'
    ]
  },
  {
    id: 3,
    title: 'Gerenciamento de Documentos',
    description: 'Organize todas as notas fiscais, comprovantes de serviços e garantias em um só lugar, acessível a qualquer momento.',
    icon: 'document',
    color: 'green',
    benefits: [
      'Armazenamento seguro na nuvem',
      'Acesso offline aos documentos',
      'Organização automática por data',
      'Backup automático'
    ]
  },
  {
    id: 4,
    title: 'Análise de Custos e Economia',
    description: 'Acompanhe todos os gastos com seu veículo e receba relatórios detalhados sobre economia gerada com manutenção preventiva.',
    icon: 'chart',
    color: 'orange',
    benefits: [
      'Relatórios mensais de gastos',
      'Comparação com outros veículos',
      'Projeção de custos futuros',
      'Identificação de padrões'
    ]
  },
  {
    id: 5,
    title: 'Rede de Oficinas Parceiras',
    description: 'Acesse uma rede qualificada de oficinas e profissionais, com agendamento online e garantia de qualidade.',
    icon: 'network',
    color: 'indigo',
    benefits: [
      'Oficinas pré-qualificadas',
      'Agendamento online',
      'Preços negociados',
      'Garantia de serviços'
    ]
  },
  {
    id: 6,
    title: 'Monitoramento em Tempo Real',
    description: 'Conecte-se com dispositivos OBD-II para monitoramento em tempo real da saúde do seu veículo.',
    icon: 'monitor',
    color: 'red',
    benefits: [
      'Diagnóstico em tempo real',
      'Alertas de problemas',
      'Análise de performance',
      'Economia de combustível'
    ]
  }
];

const isVisible = ref(false);
const activeFeature = ref(features[0]);

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true;
  }, 300);
});

const setActiveFeature = (feature: Feature) => {
  activeFeature.value = feature;
};

const getIconSvg = (icon: string) => {
  const icons: Record<string, string> = {
    transfer: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
    bell: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
    document: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    chart: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    network: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
    monitor: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
  };
  return icons[icon] || icons.document;
};
</script>

<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Navigation -->
    <nav class="container mx-auto px-6 py-4 flex justify-between items-center">
      <div class="flex items-center space-x-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25" />
        </svg>
        <span class="text-white text-xl font-bold">AutoCare</span>
      </div>
      <div class="hidden md:flex items-center space-x-6">
        <button @click="emit('navigate', 'home')" class="text-gray-300 hover:text-white transition-colors duration-300">Início</button>
        <span class="text-purple-400 font-medium">Funcionalidades</span>
        <button @click="emit('navigate', 'pricing')" class="text-gray-300 hover:text-white transition-colors duration-300">Preços</button>
        <a href="#" class="text-gray-300 hover:text-white transition-colors duration-300">Suporte</a>
        <Button label="Baixar App" primary />
      </div>
      <button class="md:hidden text-white">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </nav>

    <!-- Hero Section -->
    <section class="py-20 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
        <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl"></div>
        <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full filter blur-3xl"></div>
      </div>
      
      <div class="container mx-auto px-6 relative z-10">
        <div 
          class="text-center transform translate-y-10 opacity-0 transition-all duration-1000" 
          :class="{ 'translate-y-0 opacity-100': isVisible }"
        >
          <Badge variant="info" size="lg" rounded class="mb-6">FUNCIONALIDADES</Badge>
          <h1 class="text-4xl md:text-6xl font-bold text-white mb-6">
            Tudo que você precisa para
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              cuidar do seu carro
            </span>
          </h1>
          <p class="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Descubra como o AutoCare revoluciona a manutenção automotiva com tecnologia de ponta e simplicidade incomparável.
          </p>
        </div>
      </div>
    </section>

    <!-- Features Grid -->
    <section class="py-20 bg-gray-800 relative">
      <div class="container mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="(feature, index) in features" 
            :key="feature.id"
            class="transform translate-y-10 opacity-0 transition-all duration-1000"
            :class="{ 'translate-y-0 opacity-100': isVisible }"
            :style="{ transitionDelay: `${index * 200}ms` }"
          >
            <div 
              class="bg-gray-900 bg-opacity-50 backdrop-blur-sm rounded-2xl p-8 h-full hover:bg-opacity-70 transition-all duration-300 cursor-pointer border border-gray-700 hover:border-purple-500"
              @click="setActiveFeature(feature)"
            >
              <div class="flex items-center mb-6">
                <div :class="`w-12 h-12 rounded-lg bg-${feature.color}-500 bg-opacity-20 flex items-center justify-center mr-4`">
                  <svg xmlns="http://www.w3.org/2000/svg" :class="`h-6 w-6 text-${feature.color}-400`" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getIconSvg(feature.icon)" />
                  </svg>
                </div>
                <h3 class="text-xl font-bold text-white">{{ feature.title }}</h3>
              </div>
              
              <p class="text-gray-300 mb-6 leading-relaxed">{{ feature.description }}</p>
              
              <div class="space-y-2">
                <h4 class="text-sm font-semibold text-gray-400 uppercase tracking-wide">Benefícios:</h4>
                <ul class="space-y-2">
                  <li v-for="benefit in feature.benefits" :key="benefit" class="flex items-center text-sm text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {{ benefit }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Feature Showcase -->
    <section class="py-20 bg-gray-900 relative overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10">
        <div class="absolute top-1/3 left-1/3 w-96 h-96 bg-green-600 rounded-full filter blur-3xl"></div>
        <div class="absolute bottom-1/3 right-1/3 w-96 h-96 bg-orange-600 rounded-full filter blur-3xl"></div>
      </div>
      
      <div class="container mx-auto px-6 relative z-10">
        <div class="text-center mb-16">
          <Badge variant="success" size="lg" rounded class="mb-4">DESTAQUE</Badge>
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Funcionalidade em Destaque</h2>
          <p class="text-gray-300 max-w-2xl mx-auto">Explore em detalhes como cada funcionalidade pode transformar sua experiência automotiva.</p>
        </div>
        
        <div class="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            <!-- Feature Details -->
            <div class="space-y-6">
              <div class="flex items-center space-x-4">
                <div :class="`w-16 h-16 rounded-xl bg-${activeFeature.color}-500 bg-opacity-20 flex items-center justify-center`">
                  <svg xmlns="http://www.w3.org/2000/svg" :class="`h-8 w-8 text-${activeFeature.color}-400`" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getIconSvg(activeFeature.icon)" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-2xl font-bold text-white">{{ activeFeature.title }}</h3>
                  <p class="text-gray-400">Funcionalidade Premium</p>
                </div>
              </div>
              
              <p class="text-gray-300 text-lg leading-relaxed">{{ activeFeature.description }}</p>
              
              <div class="space-y-4">
                <h4 class="text-lg font-semibold text-white">Principais Benefícios:</h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div v-for="benefit in activeFeature.benefits" :key="benefit" class="flex items-center space-x-3 bg-gray-700 bg-opacity-50 rounded-lg p-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-gray-300 text-sm">{{ benefit }}</span>
                  </div>
                </div>
              </div>
              
              <div class="flex space-x-4 pt-4">
                <Button label="Experimentar Grátis" primary class="px-6 py-3" />
                <Button label="Saiba Mais" class="px-6 py-3" />
              </div>
            </div>
            
            <!-- Feature Visualization -->
            <div class="flex items-center justify-center">
              <div class="w-full max-w-md mx-auto">
                <!-- Phone Mockup -->
                <div class="relative">
                  <div class="bg-gray-800 rounded-3xl p-2 shadow-2xl">
                    <div class="bg-black rounded-2xl overflow-hidden">
                      <!-- Phone Screen -->
                      <div class="bg-gradient-to-br from-gray-900 to-gray-800 h-96 p-4 relative">
                        <!-- Status Bar -->
                        <div class="flex justify-between items-center text-white text-xs mb-4">
                          <span>9:41</span>
                          <div class="flex space-x-1">
                            <div class="w-4 h-2 bg-white rounded-sm"></div>
                            <div class="w-1 h-2 bg-white rounded-sm"></div>
                            <div class="w-6 h-2 bg-white rounded-sm"></div>
                          </div>
                        </div>
                        
                        <!-- App Content -->
                        <div class="space-y-4">
                          <div class="flex items-center space-x-3">
                            <div :class="`w-10 h-10 rounded-lg bg-${activeFeature.color}-500 bg-opacity-20 flex items-center justify-center`">
                              <svg xmlns="http://www.w3.org/2000/svg" :class="`h-5 w-5 text-${activeFeature.color}-400`" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getIconSvg(activeFeature.icon)" />
                              </svg>
                            </div>
                            <div>
                              <h4 class="text-white font-medium text-sm">{{ activeFeature.title }}</h4>
                              <p class="text-gray-400 text-xs">Ativo</p>
                            </div>
                          </div>
                          
                          <div class="space-y-3">
                            <div v-for="(benefit, index) in activeFeature.benefits.slice(0, 3)" :key="benefit" class="bg-gray-700 bg-opacity-50 rounded-lg p-3">
                              <div class="flex items-center space-x-2 mb-1">
                                <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                                <span class="text-white text-xs font-medium">{{ benefit }}</span>
                              </div>
                              <div class="w-full bg-gray-600 rounded-full h-1">
                                <div class="bg-green-400 h-1 rounded-full" :style="{ width: `${85 + index * 5}%` }"></div>
                              </div>
                            </div>
                          </div>
                          
                          <div class="mt-6">
                            <button :class="`w-full bg-${activeFeature.color}-600 text-white py-2 rounded-lg text-sm font-medium`">
                              Ver Detalhes
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-purple-900 to-blue-900 relative overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
      </div>
      
      <div class="container mx-auto px-6 relative z-10 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
          Pronto para revolucionar o cuidado com seu carro?
        </h2>
        <p class="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
          Junte-se a milhares de motoristas que já descobriram uma forma mais inteligente de cuidar de seus veículos.
        </p>
        <div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Button label="Baixar Grátis" primary class="px-8 py-4 text-lg" />
          <Button label="Ver Demonstração" class="px-8 py-4 text-lg bg-white text-gray-900 hover:bg-gray-100" />
        </div>
      </div>
    </section>
  </div>
</template>