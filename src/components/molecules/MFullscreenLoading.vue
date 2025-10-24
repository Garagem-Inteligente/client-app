<template>
  <transition name="loading-fade">
    <div v-if="show" class="fullscreen-loading-overlay">
      <!-- Background com blur -->
      <div class="loading-backdrop"></div>

      <!-- Conteúdo centralizado -->
      <div class="loading-content">
        <!-- Ícone animado -->
        <div class="loading-icon-wrapper">
          <div class="loading-icon">
            <svg
              class="loading-spinner"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="spinner-track"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="spinner-path"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>

          <!-- Ícone decorativo (opcional) -->
          <div v-if="icon" class="loading-emoji">{{ icon }}</div>
        </div>

        <!-- Mensagem principal -->
        <div class="loading-text">
          <h2 class="loading-title">{{ title }}</h2>
          <p v-if="description" class="loading-description">{{ description }}</p>
        </div>

        <!-- Barra de progresso (opcional) -->
        <div v-if="showProgress" class="loading-progress-bar">
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
          </div>
          <span class="progress-text">{{ Math.round(progress) }}%</span>
        </div>

        <!-- Dica/hint opcional -->
        <p v-if="hint" class="loading-hint">💡 {{ hint }}</p>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
  interface Props {
    /** Controla a visibilidade do loading */
    show: boolean;
    /** Título principal */
    title: string;
    /** Descrição adicional (opcional) */
    description?: string;
    /** Ícone emoji (opcional) */
    icon?: string;
    /** Mostrar barra de progresso */
    showProgress?: boolean;
    /** Valor do progresso (0-100) */
    progress?: number;
    /** Dica ou informação adicional */
    hint?: string;
  }

  withDefaults(defineProps<Props>(), {
    show: false,
    title: 'Carregando...',
    description: '',
    icon: '',
    showProgress: false,
    progress: 0,
    hint: '',
  });
</script>

<style scoped lang="scss">
  .fullscreen-loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .loading-backdrop {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(20, 23, 35, 0.98) 0%, rgba(30, 34, 50, 0.95) 100%);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }

  .loading-content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    padding: 40px 24px;
    max-width: 400px;
    width: 100%;
  }

  .loading-icon-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .loading-icon {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--ion-color-primary) 0%, var(--ion-color-secondary) 100%);
    border-radius: 50%;
    box-shadow: 0 8px 32px rgba(59, 130, 246, 0.4);
    animation: pulse-glow 2s ease-in-out infinite;

    > .loading-spinner {
      width: 48px;
      height: 48px;
      color: white;
    }
  }

  .loading-spinner {
    animation: spin 1s linear infinite;

    > .spinner-track {
      opacity: 0.2;
    }

    > .spinner-path {
      opacity: 0.9;
    }
  }

  .loading-emoji {
    position: absolute;
    top: -10px;
    right: -10px;
    font-size: 32px;
    animation: bounce 1s ease-in-out infinite;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
  }

  .loading-text {
    text-align: center;
    color: white;
  }

  .loading-title {
    font-size: 24px;
    font-weight: 700;
    margin: 0 0 8px 0;
    background: linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 2s ease-in-out infinite;
  }

  .loading-description {
    font-size: 15px;
    font-weight: 400;
    margin: 0;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.5;
  }

  .loading-progress-bar {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }

  .progress-track {
    width: 100%;
    height: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 999px;
    overflow: hidden;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--ion-color-primary) 0%, var(--ion-color-secondary) 100%);
    border-radius: 999px;
    transition: width 0.3s ease-out;
    box-shadow: 0 0 12px rgba(59, 130, 246, 0.6);
    animation: progress-shimmer 1.5s ease-in-out infinite;
  }

  .progress-text {
    font-size: 13px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.8);
  }

  .loading-hint {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.6);
    text-align: center;
    margin: 0;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    max-width: 320px;
  }

  /* Animações */
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes pulse-glow {
    0%,
    100% {
      transform: scale(1);
      box-shadow: 0 8px 32px rgba(59, 130, 246, 0.4);
    }
    50% {
      transform: scale(1.05);
      box-shadow: 0 12px 40px rgba(59, 130, 246, 0.6);
    }
  }

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-8px);
    }
  }

  @keyframes shimmer {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
  }

  @keyframes progress-shimmer {
    0% {
      background-position: -200px 0;
    }
    100% {
      background-position: 200px 0;
    }
  }

  /* Transições */
  .loading-fade-enter-active,
  .loading-fade-leave-active {
    transition: opacity 0.3s ease;

    > .loading-backdrop {
      transition: opacity 0.3s ease;
    }

    > .loading-content {
      transition:
        opacity 0.3s ease,
        transform 0.3s ease;
    }
  }

  .loading-fade-enter-from,
  .loading-fade-leave-to {
    opacity: 0;

    > .loading-backdrop {
      opacity: 0;
    }

    > .loading-content {
      opacity: 0;
      transform: scale(0.9) translateY(20px);
    }
  }

  /* Responsividade */
  @media (max-width: 768px) {
    .loading-content {
      padding: 32px 20px;
    }

    .loading-icon {
      width: 72px;
      height: 72px;

      > .loading-spinner {
        width: 40px;
        height: 40px;
      }
    }

    .loading-emoji {
      font-size: 28px;
    }

    .loading-title {
      font-size: 20px;
    }

    .loading-description {
      font-size: 14px;
    }
  }
</style>
