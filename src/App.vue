<template>
  <ion-app>
    <ion-router-outlet :animated="true" />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue'
import { onMounted } from 'vue'

// Configure Ionic animations to be simple slide
onMounted(() => {
  // Ionic will use default slide transitions
  // CSS in style.css handles removing element animations
})
</script>
