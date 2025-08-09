<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Badge from './Badge.vue';
import Button from './Button.vue';

const emit = defineEmits<{
  navigate: [page: string]
}>();

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  color: string;
  buttonText: string;
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'basic',
    name: 'Básico',
    price: 'Grátis',
    period: 'para sempre',
    description: 'Perfeito para começar a organizar a manutenção do seu veículo',
    features: [
      'Registro de até 2 veículos',
      'Histórico básico de manutenções',
      'Lembretes simples',
      'Backup na nuvem',
      'Suporte por email'
    ],
    color: 'gray',
    buttonText: 'Começar Grátis'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 'R$ 9,90',
    period: '/mês',
    description: 'Ideal para quem quer o máximo controle sobre seus veículos',
    features: [
      'Veículos ilimitados',
      'Histórico completo e transferível',
      'Alertas inteligentes personalizados',
      'Relatórios detalhados',
      'Integração com oficinas parceiras',
      'Suporte prioritário 24/7',
      'Backup automático',
      'Análise de custos avançada'
    ],
    popular: true,
    color: 'purple',
    buttonText: 'Assinar Premium'
  },
  {
    id: 'family',
    name: 'Família',
    price: 'R$ 19,90',
    period: '/mês',
    description: 'Para famílias com múltiplos veículos e usuários',
    features: [
      'Até 6 usuários',
      'Veículos ilimitados',
      'Todos os recursos Premium',
      'Gestão compartilhada',
      'Relatórios familiares',
      'Controle parental',
      'Dashboard administrativo',
      'Desconto em serviços parceiros'
    ],
    color: 'blue',
    buttonText: 'Assinar Família'
  }
];

const pricingFAQs: FAQ[] = [
  {
    id: 1,
    question: 'Posso cancelar minha assinatura a qualquer momento?',
    answer: 'Sim! Você pode cancelar sua assinatura a qualquer momento sem taxas de cancelamento. Seus dados permanecerão seguros e você continuará tendo acesso aos recursos até o final do período pago.'
  },
  {
    id: 2,
    question: 'O que acontece com meus dados se eu cancelar?',
    answer: 'Seus dados ficam seguros por 12 meses após o cancelamento. Você pode reativar sua conta a qualquer momento neste período e ter acesso completo aos seus históricos.'
  },
  {
    id: 3,
    question: 'Posso mudar de plano depois?',
    answer: 'Claro! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As mudanças são aplicadas imediatamente e o valor é ajustado proporcionalmente.'
  },
  {
    id: 4,
    question: 'Há desconto para pagamento anual?',
    answer: 'Sim! Oferecemos 20% de desconto para assinaturas anuais. O plano Premium fica R$ 95,04/ano e o Família R$ 191,04/ano.'
  },
  {
    id: 5,
    question: 'O plano Família permite quantos veículos?',
    answer: 'O plano Família permite veículos ilimitados para até 6 usuários. Cada usuário pode gerenciar seus próprios veículos e compartilhar informações com a família.'
  }
];

const isVisible = ref(false);
const openFAQs = ref<Set<number>>(new Set());

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true;
  }, 300);
});

const toggleFAQ = (id: number) => {
  if (openFAQs.value.has(id)) {
    openFAQs.value.delete(id);
  } else {
    openFAQs.value.add(id);
  }
};

const isOpen = (id: number) => openFAQs.value.has(id);

const getPlanColorClasses = (color: string, popular = false) => {
  const baseClasses = 'bg-gray-800 bg-opacity-50 backdrop-blur-sm border';
  
  if (popular) {
    return `${baseClasses} border-purple-500 ring-2 ring-purple-500 ring-opacity-50`;
  }
  
  switch (color) {
    case 'purple':
      return `${baseClasses} border-purple-600 hover:border-purple-500`;
    case 'blue':
      return `${baseClasses} border-blue-600 hover:border-blue-500`;
    default:
      return `${baseClasses} border-gray-600 hover:border-gray-500`;
  }
};

const getButtonClasses = (color: string) => {
  switch (color) {
    case 'purple':
      return 'bg-purple-600 hover:bg-purple-700 text-white';
    case 'blue':
      return 'bg-blue-600 hover:bg-blue-700 text-white';
    default:
      return 'bg-gray-600 hover:bg-gray-700 text-white';
  }
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
    <!-- Background decorations -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full filter blur-3xl"></div>
      <div class="absolute top-3/4 left-3/4 w-72 h-72 bg-green-600 rounded-full filter blur-3xl"></div>
    </div>

    <!-- Navbar -->
    <nav class="container mx-auto px-6 py-4 flex justify-between items-center relative z-20">
      <div class="flex items-center space-x-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25" />
        </svg>
        <span class="text-white text-xl font-bold">AutoCare</span>
      </div>
      <div class="hidden md:flex items-center space-x-6">
        <button @click="emit('navigate', 'home')" class="text-gray-300 hover:text-white transition-colors duration-300">Início</button>
        <button @click="emit('navigate', 'features')" class="text-gray-300 hover:text-white transition-colors duration-300">Funcionalidades</button>
        <span class="text-purple-400 font-medium">Preços</span>
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
    <section class="py-20 relative z-10">
      <div class="container mx-auto px-6">
        <div 
          class="text-center transform translate-y-10 opacity-0 transition-all duration-1000" 
          :class="{ 'translate-y-0 opacity-100': isVisible }"
        >
          <Badge text="PREÇOS" color="purple" size="lg" rounded class="mb-6" />
          <h1 class="text-4xl md:text-6xl font-bold text-white mb-6">
            Escolha o plano ideal
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              para você
            </span>
          </h1>
          <p class="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Comece gratuitamente e evolua conforme suas necessidades. Todos os planos incluem backup seguro e suporte dedicado.
          </p>
        </div>
      </div>
    </section>

    <!-- Pricing Plans -->
    <section class="py-20 relative z-10">
      <div class="container mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div 
            v-for="(plan, index) in pricingPlans" 
            :key="plan.id"
            class="relative transform translate-y-10 opacity-0 transition-all duration-1000"
            :class="{ 'translate-y-0 opacity-100': isVisible }"
            :style="{ transitionDelay: `${index * 200}ms` }"
          >
            <!-- Popular badge -->
            <div v-if="plan.popular" class="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
              <Badge text="MAIS POPULAR" color="purple" size="sm" rounded />
            </div>
            
            <div :class="[getPlanColorClasses(plan.color, plan.popular), 'rounded-2xl p-8 h-full relative']">
              <div class="text-center mb-8">
                <h3 class="text-2xl font-bold text-white mb-2">{{ plan.name }}</h3>
                <div class="mb-4">
                  <span class="text-4xl font-bold text-white">{{ plan.price }}</span>
                  <span class="text-gray-400 ml-1">{{ plan.period }}</span>
                </div>
                <p class="text-gray-300 text-sm">{{ plan.description }}</p>
              </div>
              
              <ul class="space-y-4 mb-8">
                <li v-for="feature in plan.features" :key="feature" class="flex items-start space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="text-gray-300 text-sm">{{ feature }}</span>
                </li>
              </ul>
              
              <button 
                :class="[
                  getButtonClasses(plan.color),
                  'w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800',
                  plan.color === 'purple' ? 'focus:ring-purple-500' : plan.color === 'blue' ? 'focus:ring-blue-500' : 'focus:ring-gray-500'
                ]"
              >
                {{ plan.buttonText }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Comparison -->
    <section class="py-20 bg-gray-800 bg-opacity-50 relative z-10">
      <div class="container mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
            Compare os <span class="text-purple-400">recursos</span>
          </h2>
          <p class="text-gray-300 max-w-2xl mx-auto">
            Veja em detalhes o que cada plano oferece para escolher a melhor opção para suas necessidades.
          </p>
        </div>
        
        <div class="max-w-5xl mx-auto">
          <div class="bg-gray-900 bg-opacity-50 backdrop-blur-sm rounded-2xl overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-gray-700">
                    <th class="text-left p-6 text-white font-semibold">Recursos</th>
                    <th class="text-center p-6 text-white font-semibold">Básico</th>
                    <th class="text-center p-6 text-white font-semibold">Premium</th>
                    <th class="text-center p-6 text-white font-semibold">Família</th>
                  </tr>
                </thead>
                <tbody class="text-sm">
                  <tr class="border-b border-gray-700">
                    <td class="p-4 text-gray-300">Número de veículos</td>
                    <td class="p-4 text-center text-gray-400">2</td>
                    <td class="p-4 text-center text-green-400">Ilimitado</td>
                    <td class="p-4 text-center text-green-400">Ilimitado</td>
                  </tr>
                  <tr class="border-b border-gray-700">
                    <td class="p-4 text-gray-300">Usuários</td>
                    <td class="p-4 text-center text-gray-400">1</td>
                    <td class="p-4 text-center text-gray-400">1</td>
                    <td class="p-4 text-center text-green-400">6</td>
                  </tr>
                  <tr class="border-b border-gray-700">
                    <td class="p-4 text-gray-300">Histórico transferível</td>
                    <td class="p-4 text-center text-red-400">✗</td>
                    <td class="p-4 text-center text-green-400">✓</td>
                    <td class="p-4 text-center text-green-400">✓</td>
                  </tr>
                  <tr class="border-b border-gray-700">
                    <td class="p-4 text-gray-300">Alertas inteligentes</td>
                    <td class="p-4 text-center text-yellow-400">Básico</td>
                    <td class="p-4 text-center text-green-400">Avançado</td>
                    <td class="p-4 text-center text-green-400">Avançado</td>
                  </tr>
                  <tr class="border-b border-gray-700">
                    <td class="p-4 text-gray-300">Relatórios detalhados</td>
                    <td class="p-4 text-center text-red-400">✗</td>
                    <td class="p-4 text-center text-green-400">✓</td>
                    <td class="p-4 text-center text-green-400">✓</td>
                  </tr>
                  <tr class="border-b border-gray-700">
                    <td class="p-4 text-gray-300">Suporte</td>
                    <td class="p-4 text-center text-gray-400">Email</td>
                    <td class="p-4 text-center text-green-400">24/7</td>
                    <td class="p-4 text-center text-green-400">24/7 Priority</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-20 relative z-10">
      <div class="container mx-auto px-6">
        <div class="text-center mb-16">
          <Badge text="FAQ" color="blue" size="lg" rounded class="mb-4" />
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
            Dúvidas sobre <span class="text-blue-500">preços</span>?
          </h2>
          <p class="text-gray-300 max-w-2xl mx-auto">
            Esclarecemos as principais questões sobre nossos planos e assinaturas.
          </p>
        </div>
        
        <div class="max-w-4xl mx-auto">
          <div class="space-y-4">
            <div 
              v-for="faq in pricingFAQs" 
              :key="faq.id"
              class="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl overflow-hidden transition-all duration-300 hover:bg-gray-800"
            >
              <button 
                @click="toggleFAQ(faq.id)"
                class="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
              >
                <div class="flex justify-between items-center">
                  <h3 class="text-lg font-semibold text-white pr-4">{{ faq.question }}</h3>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    class="h-5 w-5 text-gray-400 transform transition-transform duration-200" 
                    :class="{ 'rotate-180': isOpen(faq.id) }"
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              <div 
                v-if="isOpen(faq.id)"
                class="px-6 pb-6 text-gray-300 leading-relaxed"
              >
                {{ faq.answer }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-purple-900 to-blue-900 relative overflow-hidden z-10">
      <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
      </div>
      
      <div class="container mx-auto px-6 relative z-10 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
          Pronto para começar sua jornada?
        </h2>
        <p class="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
          Experimente gratuitamente e descubra como o AutoCare pode transformar o cuidado com seus veículos.
        </p>
        <div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Button label="Começar Grátis" primary class="px-8 py-4 text-lg" />
          <Button label="Falar com Vendas" class="px-8 py-4 text-lg bg-white text-gray-900 hover:bg-gray-100" />
        </div>
      </div>
    </section>
  </div>
</template>