<template>
  <div class="attachments-list">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
// Component para agrupar MAttachmentItem components
</script>

<style scoped lang="scss">
@use '@/theme/tokens' as *;

.attachments-list {
  @include flex-gap(0.75rem);
  flex-direction: column;
}
</style>
