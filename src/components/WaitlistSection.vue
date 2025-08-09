<script setup lang="ts">
import { ref, reactive } from 'vue';
import Badge from './Badge.vue';
import Button from './Button.vue';

interface WaitlistForm {
  name: string;
  email: string;
  phone: string;
  vehicleType: string;
  interests: string[];
}

interface VehicleType {
  value: string;
  label: string;
}

interface InterestOption {
  value: string;
  label: string;
}

interface Benefit {
  icon: string;
  title: string;
  description: string;
}

const form = reactive<WaitlistForm>({
  name: '',
  email: '',
  phone: '',
  vehicleType: '',
  interests: []
});

const isSubmitting = ref(false);
const isSubmitted = ref(false);
const showSuccess = ref(false);

const vehicleTypes: VehicleType[] = [
  { value: 'car', label: 'Carro' },
  { value: 'motorcycle', label: 'Moto' },
  { value: 'truck', label: 'Caminhão' },
  { value: 'van', label: 'Van/Utilitário' },
  { value: 'other', label: 'Outro' }
];

const interestOptions: InterestOption[] = [
  { value: 'maintenance', label: 'Alertas de Manutenção' },
  { value: 'scheduling', label: 'Agendamento Online' },
  { value: 'history', label: 'Histórico Digital' },
  { value: 'costs', label: 'Controle de Custos' },
  { value: 'documents', label: 'Organização de Documentos' }
];

const benefits: Benefit[] = [
  {
    icon: 'early-access',
    title: 'Acesso Antecipado',
    description: 'Seja um dos primeiros a testar o AutoCare'
  },
  {
    icon: 'discount',
    title: 'Desconto Exclusivo',
    description: '50% de desconto no primeiro ano de assinatura'
  },
  {
    icon: 'priority',
    title: 'Suporte Prioritário',
    description: 'Atendimento preferencial e feedback direto'
  },
  {
    icon: 'updates',
    title: 'Atualizações em Primeira Mão',
    description: 'Receba novidades e melhorias antes de todos'
  }
];

const handleInterestChange = (value: string) => {
  const index = form.interests.indexOf(value);
  if (index > -1) {
    form.interests.splice(index, 1);
  } else {
    form.interests.push(value);
  }
};

const submitForm = async () => {
  if (!form.name || !form.email) {
    alert('Por favor, preencha pelo menos nome e email.');
    return;
  }
  
  isSubmitting.value = true;
  
  // Simular envio do formulário
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  isSubmitting.value = false;
  isSubmitted.value = true;
  showSuccess.value = true;
  
  // Reset form
  Object.assign(form, {
    name: '',
    email: '',
    phone: '',
    vehicleType: '',
    interests: []
  });
  
  setTimeout(() => {
    showSuccess.value = false;
    isSubmitted.value = false;
  }, 5000);
};
</script>

<template>
  <section class="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
    <!-- Background decorations -->
    <div class="absolute inset-0 overflow-hidden z-0">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-green-600 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full filter blur-3xl opacity-20 animate-pulse" style="animation-delay: 1s;"></div>
      <div class="absolute top-3/4 left-3/4 w-64 h-64 bg-purple-600 rounded-full filter blur-3xl opacity-15 animate-pulse" style="animation-delay: 2s;"></div>
    </div>
    
    <div class="container mx-auto px-6 relative z-10">
      <!-- Section header -->
      <div class="text-center mb-16">
        <Badge text="LISTA DE ESPERA" color="blue" size="lg" rounded class="mb-4" />
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
          Seja o primeiro a <span class="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">revolucionar</span> 
          <br>o cuidado com seu veículo
        </h2>
        <p class="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
          O AutoCare está chegando! Cadastre-se na nossa lista de espera e garanta acesso antecipado, 
          desconto exclusivo e muito mais.
        </p>
      </div>
      
      <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <!-- Benefits section -->
        <div class="space-y-8">
          <div>
            <h3 class="text-2xl font-bold text-white mb-6">Vantagens exclusivas para quem se cadastrar:</h3>
            <div class="space-y-6">
              <div v-for="benefit in benefits" :key="benefit.icon" class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <!-- Early Access Icon -->
                  <div v-if="benefit.icon === 'early-access'" class="w-12 h-12 bg-green-900/50 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <!-- Discount Icon -->
                  <div v-else-if="benefit.icon === 'discount'" class="w-12 h-12 bg-blue-900/50 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <!-- Priority Icon -->
                  <div v-else-if="benefit.icon === 'priority'" class="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <!-- Updates Icon -->
                  <div v-else-if="benefit.icon === 'updates'" class="w-12 h-12 bg-orange-900/50 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM4 19h6v-6H4v6zM16 3h5v5h-5V3zM4 3h6v6H4V3z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-white mb-2">{{ benefit.title }}</h4>
                  <p class="text-gray-400">{{ benefit.description }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Stats -->
          <div class="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6">
            <h4 class="text-lg font-semibold text-white mb-4">Junte-se a milhares de pessoas interessadas:</h4>
            <div class="grid grid-cols-3 gap-4 text-center">
              <div>
                <div class="text-2xl font-bold text-green-400">2.847</div>
                <div class="text-sm text-gray-400">Cadastrados</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-blue-400">156</div>
                <div class="text-sm text-gray-400">Oficinas Parceiras</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-purple-400">23</div>
                <div class="text-sm text-gray-400">Cidades</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Form section -->
        <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
          <!-- Success message -->
          <div v-if="showSuccess" class="mb-6 p-4 bg-green-900/50 border border-green-500 rounded-lg">
            <div class="flex items-center space-x-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h4 class="text-green-400 font-semibold">Cadastro realizado com sucesso!</h4>
                <p class="text-green-300 text-sm">Você receberá atualizações em breve no seu email.</p>
              </div>
            </div>
          </div>
          
          <form @submit.prevent="submitForm" class="space-y-6">
            <div>
              <h3 class="text-xl font-bold text-white mb-6">Cadastre-se na Lista de Espera</h3>
            </div>
            
            <!-- Name and Email -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="waitlist-name" class="block text-sm font-medium text-gray-300 mb-2">Nome Completo *</label>
                <input 
                  id="waitlist-name"
                  v-model="form.name"
                  type="text" 
                  required
                  autocomplete="name"
                  aria-describedby="name-help"
                  class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Seu nome completo"
                >
                <div id="name-help" class="sr-only">Digite seu nome completo para cadastro na lista de espera</div>
              </div>
              <div>
                <label for="waitlist-email" class="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                <input 
                  id="waitlist-email"
                  v-model="form.email"
                  type="email" 
                  required
                  autocomplete="email"
                  aria-describedby="email-help"
                  class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="seu@email.com"
                >
                <div id="email-help" class="sr-only">Digite seu email para receber atualizações sobre o AutoCare</div>
              </div>
            </div>
            
            <!-- Phone and Vehicle Type -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="waitlist-phone" class="block text-sm font-medium text-gray-300 mb-2">Telefone (opcional)</label>
                <input 
                  id="waitlist-phone"
                  v-model="form.phone"
                  type="tel" 
                  autocomplete="tel"
                  aria-describedby="phone-help"
                  class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="(11) 99999-9999"
                >
                <div id="phone-help" class="sr-only">Digite seu telefone para contato (opcional)</div>
              </div>
              <div>
                <label for="waitlist-vehicle" class="block text-sm font-medium text-gray-300 mb-2">Tipo de Veículo</label>
                <select 
                  id="waitlist-vehicle"
                  v-model="form.vehicleType"
                  aria-describedby="vehicle-help"
                  class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                >
                  <option value="">Selecione...</option>
                  <option v-for="type in vehicleTypes" :key="type.value" :value="type.value">
                    {{ type.label }}
                  </option>
                </select>
                <div id="vehicle-help" class="sr-only">Selecione o tipo do seu veículo</div>
              </div>
            </div>
            
            <!-- Interests -->
            <fieldset>
              <legend class="block text-sm font-medium text-gray-300 mb-3">Recursos de maior interesse (opcional)</legend>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3" role="group" aria-describedby="interests-help">
                <label 
                  v-for="option in interestOptions" 
                  :key="option.value"
                  :for="`interest-${option.value}`"
                  class="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-700 transition-colors focus-within:ring-2 focus-within:ring-green-500"
                >
                  <input 
                    :id="`interest-${option.value}`"
                    type="checkbox" 
                    :value="option.value"
                    @change="handleInterestChange(option.value)"
                    class="w-4 h-4 text-green-500 bg-gray-700 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                  >
                  <span class="text-gray-300 text-sm">{{ option.label }}</span>
                </label>
              </div>
              <div id="interests-help" class="sr-only">Selecione os recursos que mais te interessam no AutoCare</div>
            </fieldset>
            
            <!-- Submit button -->
            <div class="pt-4">
              <Button 
                :label="isSubmitting ? 'Cadastrando...' : 'Entrar na Lista de Espera'"
                primary 
                :disabled="isSubmitting"
                class="w-full py-4 text-lg font-semibold"
                type="submit"
              />
            </div>
            
            <!-- Privacy note -->
            <p class="text-xs text-gray-400 text-center">
              Ao se cadastrar, você concorda com nossa política de privacidade. 
              Seus dados serão usados apenas para comunicação sobre o AutoCare.
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>