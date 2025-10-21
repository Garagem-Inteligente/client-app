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
import type { MaintenanceRecord, Vehicle } from '@/stores/vehicles'
import { calculateFuelBetweenMaintenances, getEstimatedFuelPrice } from '@/utils/fuelCalculations'

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

interface Props {
  maintenanceHistory: MaintenanceRecord[]
  vehicle: Vehicle
}

const props = defineProps<Props>()

// Processar dados para o gráfico
const chartData = computed(() => {
  if (!props.vehicle.averageFuelConsumption || props.maintenanceHistory.length < 2) {
    return {
      labels: [],
      datasets: []
    }
  }

  // Ordenar por quilometragem
  const sortedRecords = [...props.maintenanceHistory].sort((a, b) => a.mileage - b.mileage)
  
  const fuelPrice = getEstimatedFuelPrice(props.vehicle.fuelType)
  const labels: string[] = []
  const costs: number[] = []
  const liters: number[] = []
  
  // Calcular combustível entre cada par de manutenções
  for (let i = 1; i < sortedRecords.length; i++) {
    const prevRecord = sortedRecords[i - 1]
    const currentRecord = sortedRecords[i]
    
    const fuelData = calculateFuelBetweenMaintenances(
      prevRecord,
      currentRecord,
      props.vehicle,
      fuelPrice
    )
    
    if (fuelData) {
      // Formatar label com data
      const date = currentRecord.date instanceof Date ? currentRecord.date : new Date(currentRecord.date)
      const label = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
      
      labels.push(label)
      costs.push(fuelData.cost)
      liters.push(fuelData.liters)
    }
  }
  
  return {
    labels,
    datasets: [
      {
        label: 'Custo (R$)',
        data: costs,
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: '#8b5cf6',
        pointBorderColor: '#6d28d9',
        pointBorderWidth: 2,
        yAxisID: 'y'
      },
      {
        label: 'Litros',
        data: liters,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: false,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#059669',
        pointBorderWidth: 2,
        yAxisID: 'y1',
        borderDash: [5, 5]
      }
    ]
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
      labels: {
        color: '#fff',
        font: {
          size: 12,
          weight: 500
        },
        padding: 15,
        usePointStyle: true,
        pointStyle: 'circle'
      }
    },
    tooltip: {
      backgroundColor: 'rgba(17, 24, 39, 0.95)',
      titleColor: '#fff',
      bodyColor: '#e5e7eb',
      borderColor: 'rgba(139, 92, 246, 0.3)',
      borderWidth: 1,
      padding: 12,
      displayColors: true,
      callbacks: {
        label: function(context: {dataset: {label?: string}, parsed: {y: number | null}, datasetIndex: number}) {
          let label = context.dataset.label || ''
          if (label) {
            label += ': '
          }
          if (context.parsed.y !== null) {
            if (context.datasetIndex === 0) {
              // Custo em R$
              label += new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(context.parsed.y)
            } else {
              // Litros
              label += context.parsed.y.toFixed(1) + ' L'
            }
          }
          return label
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(255, 255, 255, 0.05)',
        drawBorder: false
      },
      ticks: {
        color: '#9ca3af',
        font: {
          size: 11
        }
      }
    },
    y: {
      type: 'linear' as const,
      display: true,
      position: 'left' as const,
      title: {
        display: true,
        text: 'Custo (R$)',
        color: '#8b5cf6',
        font: {
          size: 12,
          weight: 600
        }
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.05)',
        drawBorder: false
      },
      ticks: {
        color: '#8b5cf6',
        font: {
          size: 11
        },
        callback: function(value: number | string) {
          return 'R$ ' + Number(value).toFixed(0)
        }
      }
    },
    y1: {
      type: 'linear' as const,
      display: true,
      position: 'right' as const,
      title: {
        display: true,
        text: 'Litros',
        color: '#10b981',
        font: {
          size: 12,
          weight: 600
        }
      },
      grid: {
        drawOnChartArea: false,
        drawBorder: false
      },
      ticks: {
        color: '#10b981',
        font: {
          size: 11
        },
        callback: function(value: number | string) {
          return Number(value).toFixed(0) + ' L'
        }
      }
    }
  }
}))
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 300px;
  padding: 16px;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(124, 58, 237, 0.02) 100%);
  border-radius: 16px;
  border: 1px solid rgba(139, 92, 246, 0.1);
}

@media (max-width: 768px) {
  .chart-container {
    height: 250px;
    padding: 12px;
  }
}
</style>
