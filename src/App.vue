<template>
  <ion-app>
    <ion-router-outlet :animated="false" />
  </ion-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { IonApp, IonRouterOutlet } from '@ionic/vue'
import { useAppVersionStore } from '@/stores/appVersion'

const versionStore = useAppVersionStore()

/**
 * Inicializa verificação de versão ao montar o app
 */
onMounted(async () => {
  // Pequeno delay para garantir que Firebase está pronto
  setTimeout(async () => {
    await versionStore.initVersionCheck()
  }, 500)
})
</script>
