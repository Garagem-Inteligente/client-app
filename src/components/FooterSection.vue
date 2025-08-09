<script setup lang="ts">
import { ref } from 'vue';
import Badge from './Badge.vue';

const emit = defineEmits<{
  navigate: [page: string]
}>();

interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

interface FooterLink {
  name: string;
  url: string;
}

interface FooterLinks {
  product: FooterLink[];
  company: FooterLink[];
  support: FooterLink[];
  legal: FooterLink[];
}

const currentYear = new Date().getFullYear();

const socialLinks: SocialLink[] = [
  {
    name: 'Instagram',
    url: 'https://instagram.com/autocare',
    icon: 'instagram'
  },
  {
    name: 'Facebook',
    url: 'https://facebook.com/autocare',
    icon: 'facebook'
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/autocare',
    icon: 'twitter'
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/company/autocare',
    icon: 'linkedin'
  },
  {
    name: 'YouTube',
    url: 'https://youtube.com/autocare',
    icon: 'youtube'
  }
];

const footerLinks: FooterLinks = {
  product: [
    { name: 'Funcionalidades', url: 'features' },
    { name: 'Preços', url: '#pricing' },
    { name: 'Demonstração', url: '#demo' },
    { name: 'Atualizações', url: '#updates' }
  ],
  company: [
    { name: 'Sobre Nós', url: '#about' },
    { name: 'Blog', url: '#blog' },
    { name: 'Carreiras', url: '#careers' },
    { name: 'Imprensa', url: '#press' }
  ],
  support: [
    { name: 'Central de Ajuda', url: '#help' },
    { name: 'Contato', url: '#contact' },
    { name: 'Status do Sistema', url: '#status' },
    { name: 'Comunidade', url: '#community' }
  ],
  legal: [
    { name: 'Política de Privacidade', url: '#privacy' },
    { name: 'Termos de Uso', url: '#terms' },
    { name: 'Cookies', url: '#cookies' },
    { name: 'LGPD', url: '#lgpd' }
  ]
};

const newsletterEmail = ref<string>('');
const isSubscribing = ref(false);
const subscriptionSuccess = ref(false);

const subscribeNewsletter = async () => {
  if (!newsletterEmail.value) return;
  
  isSubscribing.value = true;
  
  // Simular inscrição
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  isSubscribing.value = false;
  subscriptionSuccess.value = true;
  newsletterEmail.value = '';
  
  setTimeout(() => {
    subscriptionSuccess.value = false;
  }, 3000);
};
</script>

<template>
  <footer class="bg-gray-900 border-t border-gray-800">
    <!-- Main footer content -->
    <div class="container mx-auto px-6 py-16">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <!-- Brand section -->
        <div class="lg:col-span-1">
          <div class="flex items-center space-x-3 mb-6">
            <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <span class="text-2xl font-bold text-white">AutoCare</span>
          </div>
          
          <p class="text-gray-400 mb-6 leading-relaxed">
            Revolucionando o cuidado automotivo com tecnologia inteligente. 
            Mantenha seu veículo sempre em perfeito estado com o AutoCare.
          </p>
          
          <!-- Social links -->
          <div class="flex space-x-4">
            <a 
              v-for="social in socialLinks" 
              :key="social.name"
              :href="social.url" 
              target="_blank"
              class="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors duration-300 group"
              :aria-label="social.name"
            >
              <!-- Instagram -->
              <svg v-if="social.icon === 'instagram'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <!-- Facebook -->
              <svg v-else-if="social.icon === 'facebook'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <!-- Twitter -->
              <svg v-else-if="social.icon === 'twitter'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              <!-- LinkedIn -->
              <svg v-else-if="social.icon === 'linkedin'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <!-- YouTube -->
              <svg v-else-if="social.icon === 'youtube'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>
        
        <!-- Links sections -->
        <div class="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-8">
          <!-- Product -->
          <div>
            <h3 class="text-white font-semibold mb-4">Produto</h3>
            <ul class="space-y-3">
              <li v-for="link in footerLinks.product" :key="link.name">
                <button 
                  v-if="link.url === 'features'"
                  @click="emit('navigate', 'features')"
                  class="text-gray-400 hover:text-white transition-colors duration-300 text-left"
                >
                  {{ link.name }}
                </button>
                <a 
                  v-else
                  :href="link.url" 
                  class="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  {{ link.name }}
                </a>
              </li>
            </ul>
          </div>
          
          <!-- Company -->
          <div>
            <h3 class="text-white font-semibold mb-4">Empresa</h3>
            <ul class="space-y-3">
              <li v-for="link in footerLinks.company" :key="link.name">
                <a :href="link.url" class="text-gray-400 hover:text-white transition-colors duration-300">{{ link.name }}</a>
              </li>
            </ul>
          </div>
          
          <!-- Support -->
          <div>
            <h3 class="text-white font-semibold mb-4">Suporte</h3>
            <ul class="space-y-3">
              <li v-for="link in footerLinks.support" :key="link.name">
                <a :href="link.url" class="text-gray-400 hover:text-white transition-colors duration-300">{{ link.name }}</a>
              </li>
            </ul>
          </div>
          
          <!-- Legal -->
          <div>
            <h3 class="text-white font-semibold mb-4">Legal</h3>
            <ul class="space-y-3">
              <li v-for="link in footerLinks.legal" :key="link.name">
                <a :href="link.url" class="text-gray-400 hover:text-white transition-colors duration-300">{{ link.name }}</a>
              </li>
            </ul>
          </div>
        </div>
        
        <!-- Newsletter -->
        <div class="lg:col-span-1">
          <h3 class="text-white font-semibold mb-4">Newsletter</h3>
          <p class="text-gray-400 mb-4 text-sm">
            Receba atualizações sobre o AutoCare e dicas de manutenção automotiva.
          </p>
          
          <!-- Success message -->
          <div v-if="subscriptionSuccess" class="mb-4 p-3 bg-green-900/50 border border-green-500 rounded-lg">
            <div class="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span class="text-green-400 text-sm font-medium">Inscrição realizada!</span>
            </div>
          </div>
          
          <form @submit.prevent="subscribeNewsletter" class="space-y-3">
            <input 
              v-model="newsletterEmail"
              type="email" 
              placeholder="Seu email"
              required
              class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-sm"
            >
            <button 
              type="submit"
              :disabled="isSubscribing"
              class="w-full px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-300 text-sm"
            >
              {{ isSubscribing ? 'Inscrevendo...' : 'Inscrever-se' }}
            </button>
          </form>
          
          <p class="text-xs text-gray-500 mt-3">
            Ao se inscrever, você concorda em receber emails do AutoCare. 
            Você pode cancelar a qualquer momento.
          </p>
        </div>
      </div>
    </div>
    
    <!-- Bottom bar -->
    <div class="border-t border-gray-800">
      <div class="container mx-auto px-6 py-6">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div class="flex items-center space-x-4">
            <p class="text-gray-400 text-sm">
              © {{ currentYear }} AutoCare. Todos os direitos reservados.
            </p>
            <Badge text="Em Desenvolvimento" color="orange" size="sm" />
          </div>
          
          <div class="flex items-center space-x-6 text-sm">
            <span class="text-gray-400">Feito com ❤️ no Brasil</span>
            <div class="flex items-center space-x-2">
              <span class="text-gray-400">Status:</span>
              <div class="flex items-center space-x-1">
                <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span class="text-green-400 text-sm">Operacional</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>