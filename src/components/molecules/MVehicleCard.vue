<template>
  <article @click="$emit('click')" class="c-vehicle-card">
    <div class="c-vehicle-card__icon-wrapper">
      <slot name="icon" />
    </div>

    <div class="c-vehicle-card__info">
      <h3 class="c-vehicle-card__name">
        <slot name="name" />
      </h3>
      <p class="c-vehicle-card__details">
        <slot name="details" />
      </p>
    </div>

    <div class="c-vehicle-card__meta">
      <p class="c-vehicle-card__mileage">
        <slot name="mileage" />
      </p>
      <span class="c-vehicle-card__badge">
        <slot name="badge" />
      </span>
    </div>

    <svg
      class="c-vehicle-card__chevron"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M9 5l7 7-7 7"
      />
    </svg>
  </article>
</template>

<script setup lang="ts">
defineEmits<{
  click: [];
}>();
</script>

<style scoped lang="scss">
.c-vehicle-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem;
  background: rgba(31, 41, 55, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  flex-wrap: wrap;

  &:hover {
    background: rgba(55, 65, 81, 0.7);
    border-color: rgba(59, 130, 246, 0.5);
    transform: translateX(4px);
  }

  &__icon-wrapper {
    padding: 0.625rem;
    background: rgba(59, 130, 246, 0.1);
    border: 1px solid rgba(59, 130, 246, 0.3);
    border-radius: 0.5rem;
    transition: all 0.2s;
    flex-shrink: 0;

    svg {
      width: 1.25rem;
      height: 1.25rem;
      color: #60a5fa;
    }
  }

  &:hover &__icon-wrapper {
    background: rgba(59, 130, 246, 0.2);
    border-color: rgba(59, 130, 246, 0.5);
  }

  &__info {
    flex: 1;
    min-width: 0;
    overflow: hidden;
  }

  &__name {
    font-weight: 500;
    color: white;
    margin: 0 0 0.25rem 0;
    transition: color 0.2s;
    font-size: 0.9375rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &:hover &__name {
    color: #60a5fa;
  }

  &__details {
    font-size: 0.8125rem;
    color: #9ca3af;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__meta {
    text-align: right;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.25rem;
    flex-shrink: 0;
  }

  &__mileage {
    font-size: 0.8125rem;
    font-weight: 500;
    color: white;
    margin: 0 0 0.25rem 0;
    white-space: nowrap;
  }

  &__badge {
    font-size: 0.625rem;
  }

  &__chevron {
    width: 1.125rem;
    height: 1.125rem;
    color: #6b7280;
    flex-shrink: 0;
    transition: color 0.2s;
    margin-left: auto;
  }

  &:hover &__chevron {
    color: #60a5fa;
  }
}

/* Mobile responsive adjustments */
@media (max-width: 480px) {
  .c-vehicle-card {
    gap: 0.5rem;
    padding: 0.75rem;

    &__icon-wrapper {
      padding: 0.5rem;

      svg {
        width: 1rem;
        height: 1rem;
      }
    }

    &__name {
      font-size: 0.875rem;
    }

    &__details {
      font-size: 0.75rem;
    }

    &__mileage {
      font-size: 0.75rem;
    }

    &__chevron {
      width: 1rem;
      height: 1rem;
    }
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .c-vehicle-card {
    transition: none;

    &__name,
    &__icon-wrapper,
    &__chevron {
      transition: none;
    }
  }
}
</style>
