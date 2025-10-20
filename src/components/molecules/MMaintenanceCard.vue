<template>
  <article @click="$emit('click')" :class="['c-maint-card', statusClass]">
    <div class="c-maint-card__info">
      <div class="c-maint-card__header">
        <slot name="badge" />
        <h3 class="c-maint-card__name">
          <slot name="title" />
        </h3>
      </div>

      <p class="c-maint-card__vehicle">
        <slot name="vehicle" />
      </p>

      <p v-if="$slots.description" class="c-maint-card__description">
        <slot name="description" />
      </p>
    </div>

    <div class="c-maint-card__meta">
      <p class="c-maint-card__date" :class="dateClass">
        <slot name="date" />
      </p>

      <p v-if="$slots['mileage']" class="c-maint-card__mileage">
        <slot name="mileage" />
      </p>

      <p v-if="$slots['cost']" class="c-maint-card__cost">
        <slot name="cost" />
      </p>

      <p v-if="$slots['days']" class="c-maint-card__days">
        <slot name="days" />
      </p>
    </div>
  </article>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  type StatusType = 'default' | 'danger' | 'urgent' | 'soon';

  const props = defineProps<{
    status?: StatusType;
    dateClass?: string;
  }>();

  defineEmits<{
    click: [];
  }>();

  const statusClass = computed(() => {
    if (!props.status || props.status === 'default') return '';
    return `c-maint-card--${props.status}`;
  });
</script>

<style scoped lang="scss">
  .c-maint-card {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem;
    background: rgba(31, 41, 55, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: rgba(55, 65, 81, 0.7);
      border-color: rgba(59, 130, 246, 0.3);
      transform: translateY(-2px);
    }

    &--danger {
      background: rgba(153, 27, 27, 0.2);
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    &--urgent {
      background: rgba(154, 52, 18, 0.2);
      border: 1px solid rgba(249, 115, 22, 0.3);
    }

    &--soon {
      background: rgba(133, 77, 14, 0.2);
      border: 1px solid rgba(234, 179, 8, 0.3);
    }

    &__info {
      flex: 1;
      min-width: 0;
    }

    &__header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.25rem;
      flex-wrap: wrap;
    }

    &__name {
      font-weight: 500;
      color: white;
      margin: 0;
      font-size: 0.9375rem;
    }

    &__vehicle {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.65);
      margin: 0.25rem 0;
    }

    &__description {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.5);
      margin: 0.25rem 0 0 0;
    }

    &__meta {
      text-align: right;
      flex-shrink: 0;
    }

    &__date {
      font-size: 0.875rem;
      font-weight: 500;
      color: white;
      margin: 0 0 0.25rem 0;

      &.danger {
        color: #ef4444;
      }
    }

    &__cost {
      font-size: 0.75rem;
      font-weight: 600;
      color: #4ade80;
      margin: 0.25rem 0;
    }

    &__mileage,
    &__days {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.65);
      margin: 0.25rem 0;
    }
  }

  /* Accessibility */
  @media (prefers-reduced-motion: reduce) {
    .c-maint-card {
      transition: none;
    }
  }
</style>
