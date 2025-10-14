<template>
  <div class="chart-container">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

interface MaintenanceRecord {
  type: string
  cost: number
}

interface Props {
  maintenanceHistory: MaintenanceRecord[]
}

const props = defineProps<Props>()

const chartData = computed(() => {
  // Agrupar por tipo
  const typeData: Record<string, number> = {}
  
  props.maintenanceHistory.forEach(record => {
    if (!typeData[record.type]) {
      typeData[record.type] = 0
    }
    typeData[record.type] += record.cost
  })
  
  const labels = Object.keys(typeData)
  const data = Object.values(typeData)
  
  // Cores para cada tipo
  const colors = [
    'rgba(59, 130, 246, 0.8)',   // blue
    'rgba(16, 185, 129, 0.8)',   // green
    'rgba(245, 158, 11, 0.8)',   // amber
    'rgba(239, 68, 68, 0.8)',    // red
    'rgba(168, 85, 247, 0.8)',   // purple
    'rgba(236, 72, 153, 0.8)',   // pink
    'rgba(20, 184, 166, 0.8)',   // teal
    'rgba(251, 146, 60, 0.8)'    // orange
  ]
  
  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors.slice(0, labels.length),
        borderColor: '#1f2937',
        borderWidth: 2,
        hoverOffset: 4
      }
    ]
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right' as const,
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
        label: (context: any) => {
          const label = context.label || ''
          const value = context.parsed || 0
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
          const percentage = ((value / total) * 100).toFixed(1)
          return `${label}: R$ ${value.toFixed(2)} (${percentage}%)`
        }
      }
    }
  }
}))
</script>

<style scoped>
.chart-container {
  height: 300px;
}
</style>
