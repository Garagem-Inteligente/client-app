<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Detalhes do Serviço</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <ion-card>
        <ion-card-content class="coming-soon-content">
          <ion-icon :icon="construct" size="large" color="warning"></ion-icon>
          <h2>Em Desenvolvimento</h2>
          <p>Esta funcionalidade estará disponível em breve.</p>
          <p>Em breve você poderá visualizar todos os detalhes dos seus serviços solicitados.</p>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonBackButton,
  IonButtons,
  IonIcon
} from '@ionic/vue'
import { construct } from 'ionicons/icons'
</script>

<style scoped>
.coming-soon-content {
  text-align: center;
  padding: 3rem 1rem;
}

.coming-soon-content h2 {
  margin: 1rem 0 0.5rem 0;
  color: var(--ion-color-warning);
}

.coming-soon-content p {
  margin: 0.5rem 0;
  color: var(--ion-color-medium);
}
</style>




