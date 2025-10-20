<template>
  <span :class="['c-badge-maint', `c-badge-maint--${maintenanceType}`]">
    {{ label }}
  </span>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { MAINTENANCE_TYPE_LABELS } from '@/constants/vehicles';

  const props = defineProps<{
    maintenanceType: string;
  }>();

  const label = computed(() => {
    return (
      MAINTENANCE_TYPE_LABELS[props.maintenanceType as keyof typeof MAINTENANCE_TYPE_LABELS] ||
      props.maintenanceType
    );
  });
</script>

<style scoped lang="scss">
  .c-badge-maint {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    font-size: 0.625rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border: 1px solid;
    background: rgba(107, 114, 128, 0.15);
    color: #d1d5db;
    border-color: rgba(107, 114, 128, 0.4);

    @each $type,
      $color
        in (
          'oil_change': #60a5fa,
          'filter_change': #4ade80,
          'tire_rotation': #fbbf24,
          'brake_service': #ef4444,
          'battery': #a78bfa,
          'transmission': #fb923c,
          'suspension': #4ade80,
          'electrical': #c084fc,
          'inspection': #60a5fa,
          'alignment': #facc15
        )
    {
      &--#{$type} {
        color: $color;
        background: rgba($color, 0.15);
        border-color: rgba($color, 0.4);
      }
    }
  }
</style>
