<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import Badge from '../components/Badge.vue';
import Button from '../components/Button.vue';
import Container from '../components/Container.vue';
import Input from '../components/Input.vue';

const emit = defineEmits<{
  navigate: [page: string]
}>();

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

interface SupportCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

interface ContactMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
  action: string;
  color: string;
}

const isVisible = ref(false);
const activeCategory = ref('all');
const searchQuery = ref('');
const contactForm = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
});

const supportCategories: SupportCategory[] = [
  {
    id: 'getting-started',
    name: 'Primeiros Passos',
    description: 'Como começar a usar o AutoCare',
    icon: 'rocket',
    color: 'blue'
  },
  {
    id: 'features',
    name: 'Funcionalidades',
    description: 'Dúvidas sobre recursos do app',
    icon: 'cog',
    color: 'purple'
  },
  {
    id: 'billing',
    name: 'Faturamento',
    description: 'Questões sobre pagamentos e planos',
    icon: 'credit-card',
    color: 'green'
  },
  {
    id: 'technical',
    name: 'Técnico',
    description: 'Problemas técnicos e bugs',
    icon: 'wrench',
    color: 'orange'
  }
];

const faqs: FAQ[] = [
  {
    id: 1,
    question: 'Como faço para começar a usar o AutoCare?',
    answer: 'Baixe o app, crie sua conta gratuita e adicione seu primeiro veículo. O processo é simples e leva apenas alguns minutos.',
    category: 'getting-started'
  },
  {
    id: 2,
    question: 'Posso usar o AutoCare offline?',
    answer: 'Sim! Muitas funcionalidades funcionam offline. Os dados são sincronizados automaticamente quando você se conecta à internet.',
    category: 'features'
  },
  {
    id: 3,
    question: 'Como cancelo minha assinatura?',
    answer: 'Você pode cancelar a qualquer momento nas configurações da conta. Não há taxas de cancelamento e você mantém acesso até o fim do período pago.',
    category: 'billing'
  },
  {
    id: 4,
    question: 'Meus dados estão seguros?',
    answer: 'Sim! Usamos criptografia de ponta e backup automático na nuvem. Seus dados são protegidos com os mais altos padrões de segurança.',
    category: 'technical'
  },
  {
    id: 5,
    question: 'Posso adicionar múltiplos veículos?',
    answer: 'No plano gratuito você pode adicionar até 2 veículos. Nos planos pagos, você pode adicionar veículos ilimitados.',
    category: 'features'
  },
  {
    id: 6,
    question: 'Como funciona o sistema de lembretes?',
    answer: 'O AutoCare envia notificações automáticas baseadas na quilometragem e tempo. Você pode personalizar todos os alertas.',
    category: 'features'
  },
  {
    id: 7,
    question: 'Existe reembolso?',
    answer: 'Oferecemos 30 dias de garantia. Se não ficar satisfeito, devolvemos 100% do valor pago.',
    category: 'billing'
  },
  {
    id: 8,
    question: 'O app não está funcionando, o que fazer?',
    answer: 'Primeiro, tente reiniciar o app. Se o problema persistir, verifique se tem a versão mais recente instalada ou entre em contato conosco.',
    category: 'technical'
  }
];

const contactMethods: ContactMethod[] = [
  {
    id: 'email',
    name: 'Email',
    description: 'Resposta em até 24 horas',
    icon: 'mail',
    action: 'suporte@autocare.com',
    color: 'blue'
  },
  {
    id: 'chat',
    name: 'Chat ao Vivo',
    description: 'Segunda a sexta, 9h às 18h',
    icon: 'chat',
    action: 'Iniciar Chat',
    color: 'green'
  },
  {
    id: 'phone',
    name: 'Telefone',
    description: 'Suporte prioritário para Premium',
    icon: 'phone',
    action: '(11) 9999-9999',
    color: 'purple'
  }
];

const openFAQs = ref<Set<number>>(new Set());

const toggleFAQ = (id: number) => {
  if (openFAQs.value.has(id)) {
    openFAQs.value.delete(id);
  } else {
    openFAQs.value.add(id);
  }
};

const isOpen = (id: number) => openFAQs.value.has(id);

const filteredFAQs = computed(() => {
  let filtered = faqs;
  
  if (activeCategory.value !== 'all') {
    filtered = filtered.filter(faq => faq.category === activeCategory.value);
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(faq => 
      faq.question.toLowerCase().includes(query) || 
      faq.answer.toLowerCase().includes(query)
    );
  }
  
  return filtered;
});

const submitContactForm = () => {
  // Aqui seria implementada a lógica de envio do formulário
  console.log('Formulário enviado:', contactForm.value);
  // Reset form
  contactForm.value = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };
};

const getCategoryBgClass = (color: string) => {
  const colorMap: Record<string, string> = {
    'blue': 'bg-blue-900/50',
    'green': 'bg-green-900/50',
    'purple': 'bg-purple-900/50',
    'orange': 'bg-orange-900/50'
  };
  return colorMap[color] || 'bg-gray-900/50';
};

const getCategoryTextClass = (color: string) => {
  const colorMap: Record<string, string> = {
    'blue': 'text-blue-400',
    'green': 'text-green-400',
    'purple': 'text-purple-400',
    'orange': 'text-orange-400'
  };
  return colorMap[color] || 'text-gray-400';
};

const getContactBgClass = (color: string) => {
  const colorMap: Record<string, string> = {
    'blue': 'bg-blue-900/50',
    'green': 'bg-green-900/50',
    'purple': 'bg-purple-900/50'
  };
  return colorMap[color] || 'bg-gray-900/50';
};

const getContactTextClass = (color: string) => {
  const colorMap: Record<string, string> = {
    'blue': 'text-blue-400',
    'green': 'text-green-400',
    'purple': 'text-purple-400'
  };
  return colorMap[color] || 'text-gray-400';
};

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true;
  }, 100);
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 relative overflow-hidden">
    <!-- Background Effects -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
      <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div class="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse" style="animation-delay: 2s;"></div>
      <div class="absolute top-3/4 left-1/2 w-32 h-32 bg-green-500 rounded-full filter blur-3xl opacity-20 animate-pulse" style="animation-delay: 4s;"></div>
    </div>

    <!-- Hero Section -->
    <section class="relative z-10 pt-32 pb-20">
      <div class="container mx-auto px-6 text-center">
        <div 
          class="transform translate-y-10 opacity-0 transition-all duration-1000" 
          :class="{ 'translate-y-0 opacity-100': isVisible }"
        >
          <Badge variant="info" size="lg" rounded class="mb-6">SUPORTE</Badge>
          <h1 class="text-4xl md:text-6xl font-bold text-white mb-6">
            Como podemos
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              ajudar você?
            </span>
          </h1>
          <p class="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Encontre respostas rápidas, entre em contato conosco ou explore nossa base de conhecimento.
          </p>
          
          <!-- Search Bar -->
          <div class="max-w-2xl mx-auto">
            <div class="relative">
              <Input 
                v-model="searchQuery" 
                placeholder="Pesquisar na base de conhecimento..." 
                class="w-full pl-12 pr-4 py-4 text-lg"
              />
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Support Categories -->
    <section class="py-20 relative z-10">
      <div class="container mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
            Categorias de <span class="text-blue-400">Ajuda</span>
          </h2>
          <p class="text-gray-300 max-w-2xl mx-auto">
            Navegue pelas categorias para encontrar respostas específicas para suas necessidades.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
          <button 
            v-for="(category, index) in supportCategories" 
            :key="category.id"
            @click="activeCategory = category.id"
            class="transform translate-y-10 opacity-0 transition-all duration-1000 hover:scale-105"
            :class="{ 'translate-y-0 opacity-100': isVisible }"
            :style="{ transitionDelay: `${index * 100}ms` }"
          >
            <Container 
              :class="[
                'h-full text-center cursor-pointer transition-all duration-300',
                activeCategory === category.id ? 'ring-2 ring-blue-500 bg-blue-900/30' : 'hover:bg-gray-800/50'
              ]"
            >
              <div :class="['mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4', getCategoryBgClass(category.color)]">
                <svg v-if="category.icon === 'rocket'" xmlns="http://www.w3.org/2000/svg" :class="['h-8 w-8', getCategoryTextClass(category.color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <svg v-else-if="category.icon === 'cog'" xmlns="http://www.w3.org/2000/svg" :class="['h-8 w-8', getCategoryTextClass(category.color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <svg v-else-if="category.icon === 'credit-card'" xmlns="http://www.w3.org/2000/svg" :class="['h-8 w-8', getCategoryTextClass(category.color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <svg v-else-if="category.icon === 'wrench'" xmlns="http://www.w3.org/2000/svg" :class="['h-8 w-8', getCategoryTextClass(category.color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-white mb-2">{{ category.name }}</h3>
              <p class="text-gray-400 text-sm">{{ category.description }}</p>
            </Container>
          </button>
        </div>
        
        <!-- All Categories Button -->
        <div class="text-center">
          <button 
            @click="activeCategory = 'all'"
            :class="[
              'px-6 py-2 rounded-lg font-medium transition-colors duration-300',
              activeCategory === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            ]"
          >
            Todas as Categorias
          </button>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-20 bg-gray-800 bg-opacity-50 relative z-10">
      <div class="container mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
            Perguntas <span class="text-purple-400">Frequentes</span>
          </h2>
          <p class="text-gray-300 max-w-2xl mx-auto">
            Encontre respostas para as dúvidas mais comuns sobre o AutoCare.
          </p>
        </div>
        
        <div class="max-w-4xl mx-auto">
          <div v-if="filteredFAQs.length === 0" class="text-center py-12">
            <p class="text-gray-400 text-lg">Nenhuma pergunta encontrada para sua pesquisa.</p>
          </div>
          
          <div v-else class="space-y-4">
            <div 
              v-for="(faq, index) in filteredFAQs" 
              :key="faq.id"
              class="transform translate-y-10 opacity-0 transition-all duration-1000"
              :class="{ 'translate-y-0 opacity-100': isVisible }"
              :style="{ transitionDelay: `${index * 100}ms` }"
            >
              <Container class="cursor-pointer hover:bg-gray-800/70 transition-colors duration-300" @click="toggleFAQ(faq.id)">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-white mb-2">{{ faq.question }}</h3>
                    <div 
                      v-if="isOpen(faq.id)" 
                      class="text-gray-300 leading-relaxed transition-all duration-300"
                    >
                      {{ faq.answer }}
                    </div>
                  </div>
                  <div class="flex-shrink-0 ml-4 transition-transform duration-300" :class="{ 'rotate-180': isOpen(faq.id) }">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </Container>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="py-20 relative z-10">
      <div class="container mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
            Entre em <span class="text-green-400">Contato</span>
          </h2>
          <p class="text-gray-300 max-w-2xl mx-auto">
            Não encontrou o que procurava? Nossa equipe está pronta para ajudar você.
          </p>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <!-- Contact Methods -->
          <div>
            <h3 class="text-2xl font-bold text-white mb-8">Canais de Atendimento</h3>
            <div class="space-y-6">
              <div 
                v-for="(method, index) in contactMethods" 
                :key="method.id"
                class="transform translate-x-10 opacity-0 transition-all duration-1000"
                :class="{ 'translate-x-0 opacity-100': isVisible }"
                :style="{ transitionDelay: `${index * 200}ms` }"
              >
                <Container class="hover:bg-gray-800/50 transition-colors duration-300">
                  <div class="flex items-center space-x-4">
                    <div :class="['w-12 h-12 rounded-lg flex items-center justify-center', getContactBgClass(method.color)]">
                      <svg v-if="method.icon === 'mail'" xmlns="http://www.w3.org/2000/svg" :class="['h-6 w-6', getContactTextClass(method.color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <svg v-else-if="method.icon === 'chat'" xmlns="http://www.w3.org/2000/svg" :class="['h-6 w-6', getContactTextClass(method.color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <svg v-else-if="method.icon === 'phone'" xmlns="http://www.w3.org/2000/svg" :class="['h-6 w-6', getContactTextClass(method.color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div class="flex-1">
                      <h4 class="text-lg font-semibold text-white">{{ method.name }}</h4>
                      <p class="text-gray-400 text-sm mb-2">{{ method.description }}</p>
                      <p :class="['font-medium', getContactTextClass(method.color)]">{{ method.action }}</p>
                    </div>
                  </div>
                </Container>
              </div>
            </div>
          </div>
          
          <!-- Contact Form -->
          <div>
            <h3 class="text-2xl font-bold text-white mb-8">Envie uma Mensagem</h3>
            <Container>
              <form @submit.prevent="submitContactForm" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    v-model="contactForm.name" 
                    placeholder="Seu nome" 
                    required 
                  />
                  <Input 
                    v-model="contactForm.email" 
                    type="email" 
                    placeholder="Seu email" 
                    required 
                  />
                </div>
                <Input 
                  v-model="contactForm.subject" 
                  placeholder="Assunto" 
                  required 
                />
                <textarea 
                  v-model="contactForm.message" 
                  placeholder="Descreva sua dúvida ou problema..." 
                  rows="6" 
                  required
                  class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                ></textarea>
                <Button label="Enviar Mensagem" primary class="w-full py-3" type="submit" />
              </form>
            </Container>
          </div>
        </div>
      </div>
    </section>

    <!-- Resources Section -->
    <section class="py-20 bg-gradient-to-r from-blue-900 to-purple-900 relative overflow-hidden z-10">
      <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
      </div>
      
      <div class="container mx-auto px-6 relative z-10 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
          Recursos Adicionais
        </h2>
        <p class="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
          Explore nossa documentação completa e tutoriais para aproveitar ao máximo o AutoCare.
        </p>
        <div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Button label="Documentação" class="px-8 py-4 text-lg bg-white text-gray-900 hover:bg-gray-100" />
          <Button label="Tutoriais em Vídeo" class="px-8 py-4 text-lg border border-white text-white hover:bg-white hover:text-gray-900" />
          <Button label="Comunidade" class="px-8 py-4 text-lg" @click="emit('navigate', 'home')" />
        </div>
      </div>
    </section>
  </div>
</template>