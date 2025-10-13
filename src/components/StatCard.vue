<script setup lang="ts">
interface Props {
  title: string
  value: string | number
  subtitle?: string
  icon?: string
  iconColor?: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
  trend?: {
    value: number
    direction: 'up' | 'down'
  }
}

const props = withDefaults(defineProps<Props>(), {
  iconColor: 'blue'
})

const iconColorClasses = {
  blue: 'text-blue-500 bg-blue-500/10',
  green: 'text-green-500 bg-green-500/10',
  yellow: 'text-yellow-500 bg-yellow-500/10',
  red: 'text-red-500 bg-red-500/10',
  purple: 'text-purple-500 bg-purple-500/10'
}

const trendColorClasses = {
  up: 'text-green-400',
  down: 'text-red-400'
}
</script>

<template>
  <div class="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <p class="text-sm font-medium text-gray-400 mb-1">{{ title }}</p>
        <h3 class="text-3xl font-bold text-white mb-1">{{ value }}</h3>
        <p v-if="subtitle" class="text-sm text-gray-400">{{ subtitle }}</p>
        
        <!-- Trend indicator -->
        <div v-if="trend" class="flex items-center mt-2">
          <svg 
            v-if="trend.direction === 'up'" 
            class="w-4 h-4 mr-1" 
            :class="trendColorClasses[trend.direction]"
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
          <svg 
            v-else 
            class="w-4 h-4 mr-1" 
            :class="trendColorClasses[trend.direction]"
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          <span class="text-sm font-medium" :class="trendColorClasses[trend.direction]">
            {{ Math.abs(trend.value) }}%
          </span>
        </div>
      </div>
      
      <!-- Icon -->
      <div 
        v-if="icon" 
        class="p-3 rounded-lg"
        :class="iconColorClasses[iconColor]"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="icon" />
        </svg>
      </div>
    </div>
  </div>
</template>
