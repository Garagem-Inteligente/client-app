<template>
  <button @click="$emit('click')" class="c-quick-action">
    <div :class="['c-quick-action__icon', colorClass]">
      <slot name="icon" />
    </div>

    <div class="c-quick-action__text">
      <p class="c-quick-action__title">
        <slot name="title" />
      </p>
      <p class="c-quick-action__subtitle">
        <slot name="subtitle" />
      </p>
    </div>
  </button>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  type ColorType = 'blue' | 'green' | 'purple' | 'orange';

  const props = defineProps<{
    color: ColorType;
  }>();

  defineEmits<{
    click: [];
  }>();

  const colorClass = computed(() => `c-quick-action__icon--${props.color}`);
</script>

<style scoped lang="scss">
  .c-quick-action {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: rgba(31, 41, 55, 0.75);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 16px;
    padding: 0.875rem;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.08);
    font-family: inherit;

    &:hover {
      background: rgba(31, 41, 55, 0.9);
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15);
    }

    &__icon {
      padding: 0.625rem;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all 0.3s ease;
      width: 2.5rem;
      height: 2.5rem;

      svg {
        width: 1.25rem;
        height: 1.25rem;
        stroke-width: 1.5;
      }

      &--blue {
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(96, 165, 250, 0.15));
        color: #60a5fa;
        border: 1px solid rgba(96, 165, 250, 0.3);
      }

      &--green {
        background: linear-gradient(135deg, rgba(34, 197, 94, 0.25), rgba(74, 222, 128, 0.15));
        color: #4ade80;
        border: 1px solid rgba(74, 222, 128, 0.3);
      }

      &--purple {
        background: linear-gradient(135deg, rgba(168, 85, 247, 0.25), rgba(192, 132, 250, 0.15));
        color: #c084fc;
        border: 1px solid rgba(192, 132, 250, 0.3);
      }

      &--orange {
        background: linear-gradient(135deg, rgba(249, 115, 22, 0.25), rgba(251, 146, 60, 0.15));
        color: #fb923c;
        border: 1px solid rgba(251, 146, 60, 0.3);
      }
    }

    &:hover &__icon {
      transform: scale(1.05);
    }

    &__text {
      flex: 1;
      text-align: left;
    }

    &__title {
      font-size: 0.8125rem;
      font-weight: 600;
      color: white;
      margin: 0 0 0.125rem 0;
      letter-spacing: 0.01em;
      transition: color 0.2s;
    }

    &:hover &__title {
      color: #60a5fa;
    }

    &__subtitle {
      font-size: 0.6875rem;
      color: rgba(255, 255, 255, 0.65);
      margin: 0;
      letter-spacing: 0.01em;
    }
  }

  /* Accessibility */
  @media (prefers-reduced-motion: reduce) {
    .c-quick-action {
      transition: none;

      &__icon {
        transition: none;
      }

      &__title {
        transition: none;
      }
    }
  }
</style>
