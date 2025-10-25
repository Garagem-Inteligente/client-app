<template>
  <div class="about-content">
    <div class="about-logo">
      <ion-icon :icon="carSportOutline"></ion-icon>
    </div>
    <h2>Garagem Inteligente</h2>
    <p class="about-version">{{ versionString }}</p>
    <p class="about-description">
      Gerencie seus veículos de forma inteligente e eficiente. Acompanhe manutenções, custos e
      mantenha tudo organizado em um só lugar.
    </p>
    <div class="about-features">
      <slot></slot>
    </div>
    <p class="about-footer">Desenvolvido com ❤️ para facilitar sua vida</p>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import { carSportOutline } from 'ionicons/icons'

interface Props {
  versionString: string
}

defineProps<Props>()
</script>

<style scoped lang="scss">
@use '@/theme/tokens' as *;

.about-content {
  text-align: center;
  padding: 24px;

  @media (max-width: 480px) {
    padding: 16px;
  }
}

.about-logo {
  margin-bottom: 24px;

  ion-icon {
    font-size: 64px;
    color: #3b82f6;

    @media (max-width: 480px) {
      font-size: 56px;
    }
  }
}

.about-content > h2 {
  font-size: 28px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;

  @media (max-width: 480px) {
    font-size: 24px;
  }
}

.about-version {
  font-size: 14px;
  color: #9ca3af;
  margin: 0 0 24px 0;
}

.about-description {
  font-size: 16px;
  color: #9ca3af;
  line-height: 1.6;
  margin: 0 0 32px 0;
}

.about-features {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;
}

.about-footer {
  font-size: 14px;
  color: #9ca3af;
  margin: 0;
}
</style>
