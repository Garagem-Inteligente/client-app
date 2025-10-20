<template>
  <button :class="['c-btn', 'c-btn--outline', { 'c-btn--full-width': fullWidth }]" v-bind="$attrs">
    <slot />
  </button>
</template>

<script setup lang="ts">
  defineProps<{
    fullWidth?: boolean;
    disabled?: boolean;
  }>();
</script>

<style scoped lang="scss">
  .c-btn {
    font-family: inherit;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 0.75rem;
    padding: 0.625rem 1.25rem;
    font-weight: 500;
    font-size: 0.8125rem;
    color: white;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    cursor: pointer;
    transition: all 0.3s ease;
    outline: none;

    &--outline {
      &:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.3);
        transform: translateY(-1px);
      }

      &:active:not(:disabled) {
        transform: translateY(0);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    &--full-width {
      width: 100%;
      margin-top: 0.75rem;
    }
  }
</style>
