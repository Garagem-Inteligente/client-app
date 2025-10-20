<template>
  <span :class="['c-badge-time', `c-badge-time--${urgencyType}`]">
    <slot />
  </span>
</template>

<script setup lang="ts">
  type UrgencyType = 'overdue' | 'urgent' | 'soon' | 'normal';

  defineProps<{
    urgencyType: UrgencyType;
  }>();
</script>

<style scoped lang="scss">
  .c-badge-time {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    font-size: 0.625rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    border: 1px solid;
    transition: all 0.2s ease;

    &--overdue {
      background: rgba(239, 68, 68, 0.15);
      color: #fca5a5;
      border-color: rgba(239, 68, 68, 0.4);
    }

    &--urgent {
      background: rgba(249, 115, 22, 0.15);
      color: #fed7aa;
      border-color: rgba(249, 115, 22, 0.4);
    }

    &--soon {
      background: rgba(234, 179, 8, 0.15);
      color: #fef08a;
      border-color: rgba(234, 179, 8, 0.4);
    }

    &--normal {
      background: rgba(74, 222, 128, 0.15);
      color: #86efac;
      border-color: rgba(74, 222, 128, 0.4);
    }
  }
</style>
