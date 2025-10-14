<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
    <h3 class="text-lg font-semibold mb-4">Custos Mensais com Combustível</h3>
    <div v-if="hasData" class="h-80">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
    <div v-else class="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
      <div class="text-center">
        <p class="text-lg font-medium">Sem dados de custos</p>
        <p class="text-sm mt-2">Registre abastecimentos para visualizar seus gastos mensais</p>
      </div>
    </div>
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
  Legend,
  type ChartOptions
} from 'chart.js'
import { useFuelStore } from '@/stores/fuel'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface Props {
  vehicleId: string
  months?: number
}

const props = withDefaults(defineProps<Props>(), {
  months: 6
})

const fuelStore = useFuelStore()

const monthlyCosts = computed(() => {
  return fuelStore.getMonthlyCosts(props.vehicleId, props.months)
})

const hasData = computed(() => monthlyCosts.value.length > 0)

const chartData = computed(() => {
  const labels = monthlyCosts.value.map(data => {
    const [year, month] = data.month.split('-')
    return new Intl.DateTimeFormat('pt-BR', {
      month: 'short',
      year: 'numeric'
    }).format(new Date(parseInt(year), parseInt(month) - 1))
  })

  const costs = monthlyCosts.value.map(data => data.cost)

  return {
    labels,
    datasets: [
      {
        label: 'Gasto com Combustível (R$)',
        data: costs,
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false
      }
    ]
  }
})

const chartOptions = computed<ChartOptions<'bar'>>(() => ({
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
          const value = context.parsed.y ?? 0
          return `Gasto: R$ ${value.toFixed(2)}`
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Valor (R$)',
        font: {
          size: 14,
          weight: 'bold'
        }
      },
      ticks: {
        callback: (value) => `R$ ${Number(value).toFixed(0)}`,
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
        text: 'Mês',
        font: {
          size: 14,
          weight: 'bold'
        }
      },
      ticks: {
        font: {
          size: 11
        }
      },
      grid: {
        display: false
      }
    }
  }
}))
</script>
