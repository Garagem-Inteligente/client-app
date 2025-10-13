<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Badge from './Badge.vue';
import Button from './Button.vue';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
  carModel: string;
}

interface Stat {
  id: number;
  value: string;
  label: string;
  icon: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Carlos Silva',
    role: 'Motorista de App',
    avatar: '/avatar-1.png',
    content: 'O AutoCare mudou completamente como cuido do meu carro. Economizo tempo e dinheiro com as manutenções preventivas e nunca mais tive problemas inesperados durante o trabalho.',
    rating: 5,
    carModel: 'Honda Civic 2019'
  },
  {
    id: 2,
    name: 'Mariana Costa',
    role: 'Empresária',
    avatar: '/avatar-2.png',
    content: 'Como empresária, não tenho tempo para me preocupar com a manutenção do carro. O AutoCare me lembra de tudo que preciso fazer e ainda me ajuda a encontrar as melhores oficinas.',
    rating: 5,
    carModel: 'Toyota Corolla 2020'
  },
  {
    id: 3,
    name: 'Roberto Almeida',
    role: 'Engenheiro',
    avatar: '/avatar-3.png',
    content: 'Excelente aplicativo! O histórico completo me ajuda a manter o valor de revenda do meu carro, e os alertas são precisos. Recomendo para qualquer proprietário de veículo.',
    rating: 4,
    carModel: 'Jeep Compass 2021'
  },
  {
    id: 4,
    name: 'Juliana Mendes',
    role: 'Médica',
    avatar: '/avatar-4.png',
    content: 'Minha rotina é corrida e o AutoCare simplificou muito o cuidado com meu carro. O agendamento direto com as oficinas parceiras é um diferencial incrível!',
    rating: 5,
    carModel: 'Hyundai HB20 2022'
  }
];

const stats: Stat[] = [
  { id: 1, value: '45K+', label: 'Usuários Ativos', icon: 'users' },
  { id: 2, value: '98%', label: 'Satisfação', icon: 'star' },
  { id: 3, value: '30%', label: 'Economia Média', icon: 'money' },
  { id: 4, value: '24/7', label: 'Suporte', icon: 'support' }
];

const activeTestimonialIndex = ref(0);
const isVisible = ref(false);
const autoplayInterval = ref<number | null>(null);

const setActiveTestimonial = (index: number) => {
  activeTestimonialIndex.value = index;
  resetAutoplay();
};

const nextTestimonial = () => {
  activeTestimonialIndex.value = (activeTestimonialIndex.value + 1) % testimonials.length;
};

const prevTestimonial = () => {
  activeTestimonialIndex.value = (activeTestimonialIndex.value - 1 + testimonials.length) % testimonials.length;
};

const startAutoplay = () => {
  autoplayInterval.value = setInterval(() => {
    nextTestimonial();
  }, 5000);
};

const resetAutoplay = () => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value);
    startAutoplay();
  }
};

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true;
  }, 500);
  
  startAutoplay();
});
</script>

<template>
  <section class="py-12 sm:py-16 md:py-20 bg-gray-900 relative overflow-hidden">
    <!-- Background decorations -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
      <div class="absolute top-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-blue-600 rounded-full filter blur-3xl"></div>
      <div class="absolute bottom-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-purple-600 rounded-full filter blur-3xl"></div>
    </div>
    
    <div class="container mx-auto px-4 sm:px-6 relative z-10">
      <!-- Section header -->
      <div 
        class="text-center mb-12 sm:mb-16 transform translate-y-10 opacity-0 transition-all duration-1000" 
        :class="{ 'translate-y-0 opacity-100': isVisible }"
      >
        <Badge variant="info" size="lg" rounded class="mb-4">DEPOIMENTOS</Badge>
        <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 px-4">O que nossos <span class="text-blue-500">usuários dizem</span></h2>
        <p class="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto px-4">Milhares de motoristas já transformaram a forma como cuidam de seus veículos com o AutoCare. Confira algumas histórias reais.</p>
      </div>
      
      <!-- Testimonials carousel -->
      <div 
        class="max-w-4xl mx-auto mb-12 sm:mb-16 md:mb-20 transform translate-y-10 opacity-0 transition-all duration-1000 delay-300" 
        :class="{ 'translate-y-0 opacity-100': isVisible }"
      >
        <div class="relative bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl">
          <!-- Quote icon -->
          <div class="absolute -top-4 sm:-top-6 left-4 sm:left-10 text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 sm:h-12 sm:w-12 opacity-50" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </div>
          
          <!-- Testimonial content -->
          <div class="relative overflow-hidden" style="min-height: 250px;">
            <div 
              v-for="(testimonial, index) in testimonials" 
              :key="testimonial.id"
              class="absolute top-0 left-0 w-full transition-all duration-500 ease-in-out"
              :class="{
                'translate-x-0 opacity-100 z-10': index === activeTestimonialIndex,
                'translate-x-full opacity-0 z-0': index > activeTestimonialIndex,
                '-translate-x-full opacity-0 z-0': index < activeTestimonialIndex
              }"
            >
              <div class="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6">
                <!-- Avatar -->
                <div class="flex-shrink-0">
                  <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-1">
                    <div class="w-full h-full rounded-full bg-gray-700 flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                      {{ testimonial.name.charAt(0) }}
                    </div>
                  </div>
                </div>
                
                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <p class="text-gray-300 text-sm sm:text-base md:text-lg italic mb-4 sm:mb-6">"{{ testimonial.content }}"</p>
                  
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                    <div class="min-w-0">
                      <h4 class="text-white font-medium text-base sm:text-lg break-words">{{ testimonial.name }}</h4>
                      <div class="flex items-center mt-1 flex-wrap">
                        <span class="text-gray-400 text-xs sm:text-sm">{{ testimonial.role }}</span>
                        <span class="mx-2 text-gray-600">•</span>
                        <span class="text-gray-400 text-xs sm:text-sm break-words">{{ testimonial.carModel }}</span>
                      </div>
                    </div>
                    
                    <!-- Rating -->
                    <div class="flex mt-2 sm:mt-0">
                      <div v-for="star in 5" :key="star" class="text-yellow-500">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" :class="star <= testimonial.rating ? 'text-yellow-500' : 'text-gray-600'" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Navigation controls -->
          <div class="flex justify-between items-center mt-8">
            <!-- Dots -->
            <div class="flex space-x-2">
              <button 
                v-for="(_, index) in testimonials" 
                :key="index"
                @click="setActiveTestimonial(index)"
                class="w-2.5 h-2.5 rounded-full transition-all duration-300"
                :class="index === activeTestimonialIndex ? 'bg-blue-500 scale-125' : 'bg-gray-600 hover:bg-gray-500'"
                aria-label="Go to testimonial"
              ></button>
            </div>
            
            <!-- Arrows -->
            <div class="flex space-x-3">
              <button 
                @click="prevTestimonial"
                class="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                aria-label="Previous testimonial"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                @click="nextTestimonial"
                class="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                aria-label="Next testimonial"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Stats section -->
      <div 
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 transform translate-y-10 opacity-0 transition-all duration-1000 delay-500" 
        :class="{ 'translate-y-0 opacity-100': isVisible }"
      >
        <div 
          v-for="stat in stats" 
          :key="stat.id"
          class="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-4 sm:p-6 text-center hover:bg-gray-700 transition-colors duration-300"
        >
          <!-- Icon -->
          <div class="mx-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-900/50 flex items-center justify-center mb-3 sm:mb-4">
            <svg v-if="stat.icon === 'users'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <!-- Star Icon -->
            <svg v-else-if="stat.icon === 'star'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <!-- Money Icon -->
            <svg v-else-if="stat.icon === 'money'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <!-- Support Icon -->
            <svg v-else-if="stat.icon === 'support'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          
          <h3 class="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">{{ stat.value }}</h3>
          <p class="text-sm sm:text-base text-gray-400">{{ stat.label }}</p>
        </div>
      </div>
      
      <!-- CTA Section -->
      <div 
        class="mt-20 text-center transform translate-y-10 opacity-0 transition-all duration-1000 delay-700" 
        :class="{ 'translate-y-0 opacity-100': isVisible }"
      >
        <h3 class="text-2xl md:text-3xl font-bold text-white mb-6">Junte-se a milhares de motoristas satisfeitos</h3>
        <div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button label="Baixar Grátis" primary class="px-8 py-3 text-lg" />
          <Button label="Ver Planos Premium" class="px-8 py-3 text-lg" />
        </div>
      </div>
    </div>
  </section>
</template>