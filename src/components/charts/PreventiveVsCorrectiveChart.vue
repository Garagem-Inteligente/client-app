<template>
  <div class="chart-container">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import type { TooltipItem } from 'chart.js'
import type { MaintenanceRecord } from '@/stores/vehicles'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface Props {
  maintenanceHistory: MaintenanceRecord[]
}

const props = defineProps<Props>()

const chartData = computed(() => {
  // Tipos preventivos
  const preventiveTypes = [
    'oil_change',
    'oil_filter',
    'air_filter',
    'fuel_filter',
    'cabin_filter',
    'tire_rotation',
    'general_inspection',
    'wheel_alignment',
    'wheel_balancing'
  ]
  
  let preventiveCost = 0
  let preventiveCount = 0
  let correctiveCost = 0
  let correctiveCount = 0
  
  props.maintenanceHistory.forEach(record => {
    if (preventiveTypes.includes(record.type)) {
      preventiveCost += record.cost
      preventiveCount++
    } else {
      correctiveCost += record.cost
      correctiveCount++
    }
  })
  
  return {
    labels: ['Preventiva', 'Corretiva'],
    datasets: [
      {
        label: 'Custo Total (R$)',
        data: [preventiveCost, correctiveCost],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',  // green para preventiva
          'rgba(239, 68, 68, 0.8)'    // red para corretiva
        ],
        borderColor: ['#10b981', '#ef4444'],
        borderWidth: 2,
        borderRadius: 6
      },
      {
        label: 'Quantidade',
        data: [preventiveCount, correctiveCount],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',  // blue
          'rgba(245, 158, 11, 0.8)'   // amber
        ],
        borderColor: ['#3b82f6', '#f59e0b'],
        borderWidth: 2,
        borderRadius: 6
      }
    ]
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
      labels: {
        color: '#9ca3af',
        padding: 12,
        font: {
          size: 12
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(17, 24, 39, 0.9)',
      titleColor: '#f3f4f6',
      bodyColor: '#f3f4f6',
      borderColor: '#374151',
      borderWidth: 1,
      padding: 12,
      callbacks: {
        label: (context: TooltipItem<'bar'>) => {
          const label = context.dataset.label || ''
          const value = context.parsed.y ?? 0
          if (label === 'Custo Total (R$)') {
            return `${label}: R$ ${value.toFixed(2)}`
          }
          return `${label}: ${value}`
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(75, 85, 99, 0.2)',
        display: false
      },
      ticks: {
        color: '#9ca3af'
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(75, 85, 99, 0.2)',
        display: true
      },
      ticks: {
        color: '#9ca3af'
      }
    }
  }
}))
</script>

<style scoped>
.chart-container {
  height: 300px;
  width: 100%;
}
</style>

