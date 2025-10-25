<template>
  <div class="connections-content">
    <p class="connections-description">
      Gerencie os métodos de login conectados à sua conta.
    </p>

    <div class="providers-list">
      <slot></slot>
    </div>

    <slot name="warnings"></slot>
    <slot name="info"></slot>
  </div>
</template>

<script setup lang="ts">
// Componente container para connections
</script>

<style scoped lang="scss">
@use '@/theme/tokens' as *;

.connections-content {
  padding: 24px;

  @media (max-width: 480px) {
    padding: 16px;
  }
}

.connections-description {
  font-size: 16px;
  color: #9ca3af;
  margin-bottom: 24px;
  line-height: 1.5;
}

.providers-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}
</style>
