<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Serviços</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="showNewOrderModal = true">
            <ion-icon :icon="add"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <!-- Empty State -->
      <ion-card>
        <ion-card-content class="empty-state">
          <ion-icon :icon="documentText" size="large" color="medium"></ion-icon>
          <h2>Nenhum serviço solicitado</h2>
          <p>Solicite seu primeiro serviço para começar</p>
          <ion-button @click="showNewOrderModal = true">
            Solicitar Serviço
          </ion-button>
        </ion-card-content>
      </ion-card>

      <!-- Coming Soon -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>Em Breve</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <p>Esta funcionalidade está em desenvolvimento. Em breve você poderá:</p>
          <ion-list>
            <ion-item>
              <ion-icon :icon="checkmark" color="success" slot="start"></ion-icon>
              <ion-label>Solicitar serviços de manutenção</ion-label>
            </ion-item>
            <ion-item>
              <ion-icon :icon="checkmark" color="success" slot="start"></ion-icon>
              <ion-label>Acompanhar o status dos serviços</ion-label>
            </ion-item>
            <ion-item>
              <ion-icon :icon="checkmark" color="success" slot="start"></ion-icon>
              <ion-label>Receber notificações de atualizações</ion-label>
            </ion-item>
            <ion-item>
              <ion-icon :icon="checkmark" color="success" slot="start"></ion-icon>
              <ion-label>Visualizar histórico de serviços</ion-label>
            </ion-item>
            <ion-item>
              <ion-icon :icon="checkmark" color="success" slot="start"></ion-icon>
              <ion-label>Avaliar oficinas</ion-label>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>
    </ion-content>

    <!-- New Order Modal -->
    <ion-modal :is-open="showNewOrderModal" @did-dismiss="showNewOrderModal = false">
      <ion-header>
        <ion-toolbar>
          <ion-title>Solicitar Serviço</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="showNewOrderModal = false">
              <ion-icon :icon="close"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div class="coming-soon-modal">
          <ion-icon :icon="construct" size="large" color="warning"></ion-icon>
          <h2>Em Desenvolvimento</h2>
          <p>Esta funcionalidade estará disponível em breve. Por enquanto, você pode gerenciar seus veículos.</p>
          <ion-button @click="showNewOrderModal = false">
            Entendi
          </ion-button>
        </div>
      </ion-content>
    </ion-modal>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonButtons,
  IonModal
} from '@ionic/vue'
import {
  add,
  documentText,
  checkmark,
  close,
  construct
} from 'ionicons/icons'

const showNewOrderModal = ref(false)
</script>

<style scoped>
.empty-state {
  text-align: center;
  padding: 2rem 1rem;
}

.empty-state h2 {
  margin: 1rem 0 0.5rem 0;
  color: var(--ion-color-medium);
}

.empty-state p {
  margin: 0 0 1rem 0;
  color: var(--ion-color-medium);
}

.coming-soon-modal {
  text-align: center;
  padding: 2rem 1rem;
}

.coming-soon-modal h2 {
  margin: 1rem 0 0.5rem 0;
  color: var(--ion-color-warning);
}

.coming-soon-modal p {
  margin: 0 0 1rem 0;
  color: var(--ion-color-medium);
}
</style>




