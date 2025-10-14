<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
    <h3 class="text-lg font-semibold mb-4">Consumo de Combustível</h3>
    <div v-if="hasData" class="h-80">
      <Line :data="chartData" :options="chartOptions" />
    </div>
    <div v-else class="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
      <div class="text-center">
        <p class="text-lg font-medium">Sem dados de consumo</p>
        <p class="text-sm mt-2">Registre abastecimentos com tanque cheio para calcular a eficiência</p>
      </div>
    </div>
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
  Filler,
  type ChartOptions
} from 'chart.js'
import { useFuelStore } from '@/stores/fuel'

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

interface Props {
  vehicleId: string
}

const props = defineProps<Props>()
const fuelStore = useFuelStore()

const efficiencyData = computed(() => {
  return fuelStore.getEfficiencyTrend(props.vehicleId)
})

const hasData = computed(() => efficiencyData.value.length > 0)

const chartData = computed(() => {
  const labels = efficiencyData.value.map(record => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short'
    }).format(record.date)
  })

  const efficiencies = efficiencyData.value.map(record => record.efficiency)

  return {
    labels,
    datasets: [
      {
        label: 'km/l',
        data: efficiencies,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }
    ]
  }
})

const chartOptions = computed<ChartOptions<'line'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        usePointStyle: true,
        padding: 15,
        font: {
          size: 12,
          weight: 'bold'
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      titleFont: {
        size: 14,
        weight: 'bold'
      },
      bodyFont: {
        size: 13
      },
      callbacks: {
        label: (context) => {
          const record = efficiencyData.value[context.dataIndex]
          const value = context.parsed.y ?? 0
          return [
            `Consumo: ${value.toFixed(2)} km/l`,
            `Quilometragem: ${record.mileage.toLocaleString('pt-BR')} km`
          ]
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: false,
      title: {
        display: true,
        text: 'Consumo (km/l)',
        font: {
          size: 14,
          weight: 'bold'
        }
      },
      ticks: {
        callback: (value) => `${value} km/l`,
        font: {
          size: 11
        }
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      }
    },
    x: {
      title: {
        display: true,
        text: 'Data do Abastecimento',
        font: {
          size: 14,
          weight: 'bold'
        }
      },
      ticks: {
        font: {
          size: 11
        },
        maxRotation: 45,
        minRotation: 45
      },
      grid: {
        display: false
      }
    }
  }
}))
</script>
