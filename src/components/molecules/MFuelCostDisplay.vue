<template>
  <div class="fuel-cost-card">
    <!-- Header -->
    <div class="fuel-header">
      <div class="fuel-icon">⛽</div>
      <div class="fuel-title">
        <h3>{{ title }}</h3>
        <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
      </div>
    </div>

    <!-- Main Stats -->
    <div v-if="!isEmpty" class="fuel-stats">
      <!-- Distance -->
      <div v-if="showDistance && distance > 0" class="stat-item">
        <div class="stat-icon">📍</div>
        <div class="stat-content">
          <span class="stat-label">Distância</span>
          <span class="stat-value">{{ formatNumber(distance) }} km</span>
        </div>
      </div>

      <!-- Liters -->
      <div class="stat-item">
        <div class="stat-icon">🛢️</div>
        <div class="stat-content">
          <span class="stat-label">Combustível</span>
          <span class="stat-value">{{ formatNumber(liters) }} L</span>
        </div>
      </div>

      <!-- Cost -->
      <div class="stat-item highlight">
        <div class="stat-icon">💰</div>
        <div class="stat-content">
          <span class="stat-label">Custo Estimado</span>
          <span class="stat-value primary">{{ formatCurrency(cost) }}</span>
        </div>
      </div>

      <!-- Average consumption -->
      <div v-if="showAverage && averageLitersPerKm" class="stat-item">
        <div class="stat-icon">📊</div>
        <div class="stat-content">
          <span class="stat-label">Consumo Médio</span>
          <span class="stat-value">{{ formatNumber(1 / averageLitersPerKm) }} km/L</span>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="fuel-empty">
      <p>{{ emptyMessage || 'Dados de combustível não disponíveis' }}</p>
    </div>

    <!-- Footer Note -->
    <div v-if="!isEmpty && showNote" class="fuel-note">
      <ion-icon :icon="informationCircleOutline" class="note-icon"></ion-icon>
      <span>Valores estimados com base no consumo médio do veículo</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { IonIcon } from '@ionic/vue';
  import { informationCircleOutline } from 'ionicons/icons';

  interface Props {
    title?: string;
    subtitle?: string;
    distance?: number;
    liters: number;
    cost: number;
    averageLitersPerKm?: number;
    showDistance?: boolean;
    showAverage?: boolean;
    showNote?: boolean;
    emptyMessage?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    title: 'Gastos com Combustível',
    subtitle: '',
    distance: 0,
    liters: 0,
    cost: 0,
    averageLitersPerKm: 0,
    showDistance: true,
    showAverage: false,
    showNote: true,
    emptyMessage: '',
  });

  const isEmpty = computed(() => {
    return props.liters === 0 && props.cost === 0;
  });

  const formatNumber = (value: number) => {
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };
</script>

<style scoped>
  .fuel-cost-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    padding: 20px;
    color: white;
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  }

  .fuel-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }

  .fuel-icon {
    font-size: 32px;
    line-height: 1;
  }

  .fuel-title h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: white;
  }

  .fuel-title .subtitle {
    margin: 4px 0 0 0;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.8);
  }

  .fuel-stats {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    backdrop-filter: blur(10px);
    transition: all 0.2s ease;
  }

  .stat-item:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateX(4px);
  }

  .stat-item.highlight {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  .stat-icon {
    font-size: 24px;
    line-height: 1;
    min-width: 24px;
    text-align: center;
  }

  .stat-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
  }

  .stat-label {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .stat-value {
    font-size: 18px;
    font-weight: 700;
    color: white;
  }

  .stat-value.primary {
    font-size: 22px;
    color: #ffd700;
    text-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
  }

  .fuel-empty {
    padding: 24px;
    text-align: center;
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
  }

  .fuel-note {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.4;
  }

  .note-icon {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.9);
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    .fuel-cost-card {
      padding: 16px;
    }

    .fuel-title h3 {
      font-size: 16px;
    }

    .stat-value {
      font-size: 16px;
    }

    .stat-value.primary {
      font-size: 20px;
    }
  }
</style>
