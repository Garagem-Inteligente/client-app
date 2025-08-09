<script setup lang="ts">
type AlertType = 'info' | 'success' | 'warning' | 'error';

interface Props {
  message: string;
  type?: AlertType;
  dismissible?: boolean;
}

interface Emits {
  close: [];
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  dismissible: false
});

const emit = defineEmits<Emits>();

const handleClose = () => {
  emit('close');
};

const alertClasses: Record<AlertType, string> = {
  info: 'bg-blue-100 border-blue-500 text-blue-800',
  success: 'bg-green-100 border-green-500 text-green-800',
  warning: 'bg-yellow-100 border-yellow-500 text-yellow-800',
  error: 'bg-red-100 border-red-500 text-red-800'
};

const iconClasses: Record<AlertType, string> = {
  info: 'text-blue-500',
  success: 'text-green-500',
  warning: 'text-yellow-500',
  error: 'text-red-500'
};
</script>

<template>
  <div 
    class="border-l-4 p-4 mb-4 rounded-r-md flex items-start justify-between transition-colors duration-300"
    :class="alertClasses[props.type]"
  >
    <div class="flex items-start">
      <!-- Ícones para cada tipo de alerta -->
      <div class="mr-3" :class="iconClasses[props.type]">
        <!-- Ícone de informação -->
        <svg v-if="props.type === 'info'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <!-- Ícone de sucesso -->
        <svg v-else-if="props.type === 'success'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <!-- Ícone de aviso -->
        <svg v-else-if="props.type === 'warning'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <!-- Ícone de erro -->
        <svg v-else-if="props.type === 'error'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div>
        <p class="font-medium">{{ props.message }}</p>
      </div>
    </div>
    
    <!-- Botão de fechar (se dismissible for true) -->
    <button 
      v-if="props.dismissible" 
      @click="handleClose"
      class="ml-auto -mr-1 -mt-1 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
      :class="iconClasses[props.type]"
      aria-label="Fechar"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>