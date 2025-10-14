<template>
  <div class="chart-container">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface MaintenanceRecord {
  date: string | Date
  cost: number
}

interface Props {
  maintenanceHistory: MaintenanceRecord[]
}

const props = defineProps<Props>()

// Processar dados para o gráfico
const chartData = computed(() => {
  // Agrupar por mês
  const monthlyData: Record<string, number> = {}
  
  props.maintenanceHistory.forEach(record => {
    const date = typeof record.date === 'string' ? new Date(record.date) : record.date
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = 0
    }
    monthlyData[monthKey] += record.cost
  })
  
  // Últimos 6 meses
  const months: string[] = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    months.push(key)
  }
  
  // Labels formatados
  const labels = months.map(key => {
    const [year, month] = key.split('-')
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    return `${monthNames[parseInt(month) - 1]} ${year}`
  })
  
  // Valores
  const data = months.map(key => monthlyData[key] || 0)
  
  return {
    labels,
    datasets: [
      {
        label: 'Custos Mensais',
        data,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#1e40af',
        pointBorderWidth: 2
      }
    ]
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(17, 24, 39, 0.9)',
      titleColor: '#f3f4f6',
      bodyColor: '#f3f4f6',
      borderColor: '#374151',
      borderWidth: 1,
      padding: 12,
      displayColors: false,
      callbacks: {
        label: (context: any) => {
          return `R$ ${context.parsed.y.toFixed(2)}`
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(75, 85, 99, 0.2)',
        display: true
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
        color: '#9ca3af',
        callback: (value: any) => `R$ ${value}`
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
