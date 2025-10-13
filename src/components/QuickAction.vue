<script setup lang="ts">
interface Props {
  title: string
  description: string
  icon: string
  iconColor?: 'blue' | 'green' | 'purple' | 'yellow'
  to?: string
}

const props = withDefaults(defineProps<Props>(), {
  iconColor: 'blue'
})

const iconColorClasses = {
  blue: 'text-blue-500 bg-blue-500/10 group-hover:bg-blue-500/20',
  green: 'text-green-500 bg-green-500/10 group-hover:bg-green-500/20',
  purple: 'text-purple-500 bg-purple-500/10 group-hover:bg-purple-500/20',
  yellow: 'text-yellow-500 bg-yellow-500/10 group-hover:bg-yellow-500/20'
}
</script>

<template>
  <router-link
    v-if="to"
    :to="to"
    class="group block p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 hover:shadow-lg transition-all duration-200"
  >
    <div class="flex items-start space-x-4">
      <div 
        class="flex-shrink-0 p-3 rounded-lg transition-colors duration-200"
        :class="iconColorClasses[iconColor]"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="icon" />
        </svg>
      </div>
      
      <div class="flex-1 min-w-0">
        <h3 class="text-base font-semibold text-white group-hover:text-blue-400 transition-colors duration-200">
          {{ title }}
        </h3>
        <p class="text-sm text-gray-400 mt-1">{{ description }}</p>
      </div>
      
      <svg class="w-5 h-5 text-gray-500 group-hover:text-gray-300 transition-colors duration-200 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </router-link>
  
  <div
    v-else
    class="group block p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 hover:shadow-lg transition-all duration-200 cursor-pointer"
  >
    <div class="flex items-start space-x-4">
      <div 
        class="flex-shrink-0 p-3 rounded-lg transition-colors duration-200"
        :class="iconColorClasses[iconColor]"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="icon" />
        </svg>
      </div>
      
      <div class="flex-1 min-w-0">
        <h3 class="text-base font-semibold text-white group-hover:text-blue-400 transition-colors duration-200">
          {{ title }}
        </h3>
        <p class="text-sm text-gray-400 mt-1">{{ description }}</p>
      </div>
      
      <svg class="w-5 h-5 text-gray-500 group-hover:text-gray-300 transition-colors duration-200 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </div>
</template>
