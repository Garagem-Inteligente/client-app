<template>
  <div :class="['info-box', { 'info-box-full-width': fullWidth }]">
    <div v-if="$slots.header" class="info-box-header">
      <slot name="header"></slot>
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  fullWidth?: boolean
}

withDefaults(defineProps<Props>(), {
  fullWidth: false,
})
</script>

<style scoped lang="scss">
.info-box {
  background: linear-gradient(135deg, rgba(31, 41, 55, 0.6) 0%, rgba(17, 24, 39, 0.8) 100%);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(59, 130, 246, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }

  &-full-width {
    grid-column: 1 / -1;
  }
}

.info-box-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
</style>
