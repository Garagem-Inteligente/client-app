<template>
  <span :class="['c-badge-status', `c-badge-status--${type}`]">
    <slot />
  </span>
</template>

<script setup lang="ts">
type BadgeStatusType = "success" | "error" | "warning" | "default" | "info";

defineProps<{
  type: BadgeStatusType;
}>();
</script>

<style scoped lang="scss">
.c-badge-status {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid;
  transition: all 0.2s ease;

  &--success {
    background: rgba(34, 197, 94, 0.1);
    color: #4ade80;
    border-color: rgba(34, 197, 94, 0.3);
  }

  &--error {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    border-color: rgba(239, 68, 68, 0.3);
  }

  &--warning {
    background: rgba(234, 179, 8, 0.1);
    color: #facc15;
    border-color: rgba(234, 179, 8, 0.3);
  }

  &--default {
    background: rgba(107, 114, 128, 0.15);
    color: #d1d5db;
    border-color: rgba(107, 114, 128, 0.4);
  }

  &--info {
    background: rgba(59, 130, 246, 0.1);
    color: #60a5fa;
    border-color: rgba(59, 130, 246, 0.3);
  }
}
</style>
