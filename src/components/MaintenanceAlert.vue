<script setup lang="ts">
import { computed } from 'vue'
import Badge from './Badge.vue'

interface Props {
  vehicleName: string
  maintenanceType: string
  dueDate?: Date
  dueMileage?: number
  currentMileage?: number
  urgency: 'overdue' | 'urgent' | 'upcoming' | 'normal'
}

const props = defineProps<Props>()

const urgencyConfig = {
  overdue: {
    color: 'error' as const,
    icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    label: 'Atrasada',
    textColor: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/50'
  },
  urgent: {
    color: 'warning' as const,
    icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    label: 'Urgente',
    textColor: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/50'
  },
  upcoming: {
    color: 'info' as const,
    icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    label: 'Próxima',
    textColor: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/50'
  },
  normal: {
    color: 'default' as const,
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    label: 'Normal',
    textColor: 'text-gray-400',
    bgColor: 'bg-gray-500/10',
    borderColor: 'border-gray-500/50'
  }
}

const config = computed(() => urgencyConfig[props.urgency])

const daysUntilDue = computed(() => {
  if (!props.dueDate) return null
  const today = new Date()
  const due = new Date(props.dueDate)
  const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return diff
})

const kmUntilDue = computed(() => {
  if (!props.dueMileage || !props.currentMileage) return null
  return props.dueMileage - props.currentMileage
})

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date)
}
</script>

<template>
  <div 
    class="p-4 rounded-lg border transition-all duration-200 hover:shadow-lg"
    :class="[config.bgColor, config.borderColor]"
  >
    <div class="flex items-start space-x-3">
      <!-- Icon -->
      <div class="flex-shrink-0">
        <svg 
          class="w-6 h-6" 
          :class="config.textColor"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="config.icon" />
        </svg>
      </div>
      
      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between mb-2">
          <div>
            <h4 class="text-sm font-semibold text-white">{{ maintenanceType }}</h4>
            <p class="text-xs text-gray-400 mt-0.5">{{ vehicleName }}</p>
          </div>
          <Badge :variant="config.color" size="sm">
            {{ config.label }}
          </Badge>
        </div>
        
        <div class="space-y-1">
          <!-- Date info -->
          <div v-if="dueDate" class="flex items-center text-xs">
            <svg class="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span :class="config.textColor" class="font-medium">{{ formatDate(dueDate) }}</span>
            <span v-if="daysUntilDue !== null" class="text-gray-400 ml-1">
              ({{ daysUntilDue > 0 ? `em ${daysUntilDue} dias` : `${Math.abs(daysUntilDue)} dias atrás` }})
            </span>
          </div>
          
          <!-- Mileage info -->
          <div v-if="dueMileage" class="flex items-center text-xs">
            <svg class="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span :class="config.textColor" class="font-medium">{{ dueMileage.toLocaleString('pt-BR') }} km</span>
            <span v-if="kmUntilDue !== null" class="text-gray-400 ml-1">
              ({{ kmUntilDue > 0 ? `faltam ${kmUntilDue.toLocaleString('pt-BR')} km` : `${Math.abs(kmUntilDue).toLocaleString('pt-BR')} km atrás` }})
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
