<template>
  <div class="version-info">
    <p class="version-text">{{ versionString }}</p>
    <p v-if="isProduction" class="build-info">{{ buildDate }} • {{ shortSha }}</p>
    <p v-else class="build-info">Ambiente de Desenvolvimento</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  versionString: string
  buildDate?: string
  shortSha?: string
  isProduction?: boolean
}

defineProps<Props>()
</script>

<style scoped lang="scss">
@use '@/theme/tokens' as *;

.version-info {
  text-align: center;
  padding: 16px;
  background: rgba(31, 41, 55, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  transition: all $transition-base;

  &:hover {
    background: rgba(31, 41, 55, 0.7);
    border-color: rgba(255, 255, 255, 0.1);
  }
}

.version-text {
  font-size: 14px;
  color: white;
  font-weight: 500;
  margin: 0 0 4px 0;
}

.build-info {
  font-size: 12px;
  color: #9ca3af;
  margin: 0;
}
</style>
