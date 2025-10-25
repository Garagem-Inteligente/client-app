<template>
  <div class="timeline">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
// Component para agrupar MTimelineItem components
</script>

<style scoped lang="scss">
@use '@/theme/tokens' as *;

.timeline {
  position: relative;
  padding-left: 2rem;
}
</style>
