<script setup lang="ts">
import { ref } from 'vue';
import Badge from './Badge.vue';

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    id: 1,
    question: 'O AutoCare funciona com qualquer tipo de veículo?',
    answer: 'Sim! O AutoCare foi desenvolvido para funcionar com carros, motos, caminhões, vans e qualquer tipo de veículo. Nossa plataforma se adapta às necessidades específicas de cada categoria de veículo.'
  },
  {
    id: 2,
    question: 'Como o app sabe quando meu carro precisa de manutenção?',
    answer: 'O AutoCare utiliza algoritmos inteligentes que consideram a quilometragem, tempo desde a última manutenção, tipo de uso do veículo e recomendações do fabricante para enviar alertas personalizados no momento certo.'
  },
  {
    id: 3,
    question: 'Posso usar o AutoCare sem ter uma oficina parceira na minha cidade?',
    answer: 'Claro! Mesmo sem oficinas parceiras, você pode usar todas as funcionalidades de controle, histórico, alertas e organização de documentos. As oficinas parceiras são um benefício adicional para agendamento facilitado.'
  },
  {
    id: 4,
    question: 'Meus dados ficam seguros no AutoCare?',
    answer: 'Absolutamente. Utilizamos criptografia de ponta e seguimos as melhores práticas de segurança. Seus dados são armazenados em servidores seguros e nunca são compartilhados com terceiros sem sua autorização.'
  },
  {
    id: 5,
    question: 'O AutoCare tem custo? Qual o valor?',
    answer: 'O AutoCare oferece um plano gratuito com funcionalidades básicas e planos premium com recursos avançados. Os valores serão divulgados em breve. Quem se cadastrar na lista de espera terá 50% de desconto no primeiro ano.'
  },
  {
    id: 6,
    question: 'Posso importar o histórico de manutenção do meu veículo?',
    answer: 'Sim! Você pode adicionar manualmente o histórico anterior ou fotografar documentos antigos. Nossa IA ajuda a extrair informações automaticamente de notas fiscais e relatórios de manutenção.'
  },
  {
    id: 7,
    question: 'O app funciona offline?',
    answer: 'Muitas funcionalidades funcionam offline, como consultar histórico e ver próximas manutenções. Para sincronização, alertas em tempo real e agendamentos, é necessária conexão com internet.'
  },
  {
    id: 8,
    question: 'Quando o AutoCare estará disponível?',
    answer: 'Estamos finalizando os últimos testes e parcerias. O lançamento está previsto para o primeiro trimestre de 2024. Quem estiver na lista de espera será notificado primeiro e terá acesso antecipado.'
  }
];

const openItems = ref<number[]>([]);

const toggleFAQ = (id: number) => {
  const index = openItems.value.indexOf(id);
  if (index > -1) {
    openItems.value.splice(index, 1);
  } else {
    openItems.value.push(id);
  }
};

const isOpen = (id: number) => {
  return openItems.value.includes(id);
};
</script>

<template>
  <section class="py-20 bg-gray-900 relative overflow-hidden">
    <!-- Background decorations -->
    <div class="absolute inset-0 overflow-hidden z-0 opacity-30">
      <div class="absolute top-1/4 right-1/4 w-72 h-72 bg-blue-600 rounded-full filter blur-3xl"></div>
      <div class="absolute bottom-1/3 left-1/3 w-96 h-96 bg-green-600 rounded-full filter blur-3xl"></div>
    </div>
    
    <div class="container mx-auto px-6 relative z-10">
      <!-- Section header -->
      <div class="text-center mb-16">
        <Badge variant="info" size="lg" rounded class="mb-4">FAQ</Badge>
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
          Perguntas <span class="text-blue-500">Frequentes</span>
        </h2>
        <p class="text-gray-300 max-w-2xl mx-auto">
          Tire suas dúvidas sobre o AutoCare e descubra como revolucionar o cuidado com seu veículo.
        </p>
      </div>
      
      <!-- FAQ Items -->
      <div class="max-w-4xl mx-auto">
        <div class="space-y-4">
          <div 
            v-for="faq in faqs" 
            :key="faq.id"
            class="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl overflow-hidden transition-all duration-300 hover:bg-gray-800"
          >
            <button 
              :id="`faq-button-${faq.id}`"
              @click="toggleFAQ(faq.id)"
              :aria-expanded="isOpen(faq.id)"
              :aria-controls="`faq-content-${faq.id}`"
              class="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
            >
              <h3 class="text-lg font-semibold text-white pr-4">{{ faq.question }}</h3>
              <div class="flex-shrink-0 transition-transform duration-300" :class="{ 'rotate-180': isOpen(faq.id) }">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            
            <div 
              :id="`faq-content-${faq.id}`"
              role="region"
              :aria-labelledby="`faq-button-${faq.id}`"
              class="overflow-hidden transition-all duration-300"
              :class="isOpen(faq.id) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'"
            >
              <div class="px-6 pb-5">
                <div class="border-t border-gray-700 pt-4">
                  <p class="text-gray-300 leading-relaxed">{{ faq.answer }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Contact CTA -->
      <div class="text-center mt-16">
        <div class="bg-gradient-to-r from-blue-900/50 to-green-900/50 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
          <h3 class="text-2xl font-bold text-white mb-4">Ainda tem dúvidas?</h3>
          <p class="text-gray-300 mb-6">
            Nossa equipe está pronta para ajudar! Entre em contato conosco e tire todas as suas dúvidas sobre o AutoCare.
          </p>
          <div class="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <a 
              href="mailto:contato@autocare.app" 
              class="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Enviar Email
            </a>
            <a 
              href="https://wa.me/5511999999999" 
              target="_blank"
              class="inline-flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>