<template>
  <ion-page>
    <ModernHeader 
      title="Perfil"
      :show-back-button="true"
      back-path="/tabs/home"
    />

    <ion-content :fullscreen="true" class="ion-padding">
      <!-- User Info Card -->
      <ion-card>
        <ion-card-content class="user-info">
          <div class="avatar-section">
            <ion-avatar>
              <ion-icon :icon="person" size="large"></ion-icon>
            </ion-avatar>
            <h2>{{ authStore.userName }}</h2>
            <p>{{ authStore.userEmail }}</p>
          </div>
        </ion-card-content>
      </ion-card>

      <!-- Account Stats -->
      <ion-grid>
        <ion-row>
          <ion-col size="6">
            <ion-card>
              <ion-card-content class="stat-card">
                <ion-icon :icon="car" color="primary" size="large"></ion-icon>
                <h3>{{ vehiclesStore.vehicleCount }}</h3>
                <p>Veículos</p>
              </ion-card-content>
            </ion-card>
          </ion-col>
          <ion-col size="6">
            <ion-card>
              <ion-card-content class="stat-card">
                <ion-icon :icon="documentText" color="success" size="large"></ion-icon>
                <h3>0</h3>
                <p>Serviços</p>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>

      <!-- Menu Options -->
      <ion-list>
        <ion-item button @click="editProfile">
          <ion-icon :icon="personCircle" slot="start" color="primary"></ion-icon>
          <ion-label>Editar Perfil</ion-label>
        </ion-item>

        <ion-item button @click="showNotificationsSettings">
          <ion-icon :icon="notifications" slot="start" color="warning"></ion-icon>
          <ion-label>Notificações</ion-label>
        </ion-item>

        <ion-item button @click="showPrivacySettings">
          <ion-icon :icon="shield" slot="start" color="success"></ion-icon>
          <ion-label>Privacidade</ion-label>
        </ion-item>

        <ion-item button @click="showHelp">
          <ion-icon :icon="helpCircle" slot="start" color="medium"></ion-icon>
          <ion-label>Ajuda</ion-label>
        </ion-item>

        <ion-item button @click="showAbout">
          <ion-icon :icon="informationCircle" slot="start" color="medium"></ion-icon>
          <ion-label>Sobre</ion-label>
        </ion-item>
      </ion-list>

      <!-- Logout Button -->
      <ion-button
        expand="block"
        color="danger"
        fill="outline"
        @click="handleLogout"
        class="ion-margin-top"
      >
        <ion-icon :icon="logOut" slot="start"></ion-icon>
        Sair da Conta
      </ion-button>
    </ion-content>

    <!-- Edit Profile Modal -->
    <ion-modal :is-open="showEditModal" @did-dismiss="showEditModal = false">
      <ion-header>
        <ion-toolbar>
          <ion-title>Editar Perfil</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="showEditModal = false">
              <ion-icon :icon="close"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div class="coming-soon-modal">
          <ion-icon :icon="construct" size="large" color="warning"></ion-icon>
          <h2>Em Desenvolvimento</h2>
          <p>Esta funcionalidade estará disponível em breve.</p>
          <ion-button @click="showEditModal = false">
            Entendi
          </ion-button>
        </div>
      </ion-content>
    </ion-modal>

    <!-- Notifications Settings Modal -->
    <ion-modal :is-open="showNotificationsModal" @did-dismiss="showNotificationsModal = false">
      <ion-header>
        <ion-toolbar>
          <ion-title>Notificações</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="showNotificationsModal = false">
              <ion-icon :icon="close"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div class="coming-soon-modal">
          <ion-icon :icon="construct" size="large" color="warning"></ion-icon>
          <h2>Em Desenvolvimento</h2>
          <p>Esta funcionalidade estará disponível em breve.</p>
          <ion-button @click="showNotificationsModal = false">
            Entendi
          </ion-button>
        </div>
      </ion-content>
    </ion-modal>

    <!-- Privacy Settings Modal -->
    <ion-modal :is-open="showPrivacyModal" @did-dismiss="showPrivacyModal = false">
      <ion-header>
        <ion-toolbar>
          <ion-title>Privacidade</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="showPrivacyModal = false">
              <ion-icon :icon="close"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div class="coming-soon-modal">
          <ion-icon :icon="construct" size="large" color="warning"></ion-icon>
          <h2>Em Desenvolvimento</h2>
          <p>Esta funcionalidade estará disponível em breve.</p>
          <ion-button @click="showPrivacyModal = false">
            Entendi
          </ion-button>
        </div>
      </ion-content>
    </ion-modal>

    <!-- Help Modal -->
    <ion-modal :is-open="showHelpModal" @did-dismiss="showHelpModal = false">
      <ion-header>
        <ion-toolbar>
          <ion-title>Ajuda</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="showHelpModal = false">
              <ion-icon :icon="close"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div class="coming-soon-modal">
          <ion-icon :icon="construct" size="large" color="warning"></ion-icon>
          <h2>Em Desenvolvimento</h2>
          <p>Esta funcionalidade estará disponível em breve.</p>
          <ion-button @click="showHelpModal = false">
            Entendi
          </ion-button>
        </div>
      </ion-content>
    </ion-modal>

    <!-- About Modal -->
    <ion-modal :is-open="showAboutModal" @did-dismiss="showAboutModal = false">
      <ion-header>
        <ion-toolbar>
          <ion-title>Sobre</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="showAboutModal = false">
              <ion-icon :icon="close"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <ion-card>
          <ion-card-content>
            <div class="about-content">
              <ion-icon :icon="car" size="large" color="primary"></ion-icon>
              <h2>Garagem Inteligente</h2>
              <p>Versão 1.0.0</p>
              <p>Gerencie seus veículos de forma inteligente e eficiente.</p>
              <p>Desenvolvido com ❤️ para facilitar sua vida.</p>
            </div>
          </ion-card-content>
        </ion-card>
      </ion-content>
    </ion-modal>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonLabel,
  IonAvatar,
  IonModal,
  IonButtons
} from '@ionic/vue'
import {
  person,
  car,
  documentText,
  personCircle,
  notifications,
  shield,
  helpCircle,
  informationCircle,
  logOut,
  close,
  construct
} from 'ionicons/icons'
import { useAuthStore } from '@/stores/auth'
import { useVehiclesStore } from '@/stores/vehicles'
import ModernHeader from '@/components/organisms/ModernHeader.vue'

const router = useRouter()
const authStore = useAuthStore()
const vehiclesStore = useVehiclesStore()

const showEditModal = ref(false)
const showNotificationsModal = ref(false)
const showPrivacyModal = ref(false)
const showHelpModal = ref(false)
const showAboutModal = ref(false)

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const editProfile = () => {
  showEditModal.value = true
}

const showNotificationsSettings = () => {
  showNotificationsModal.value = true
}

const showPrivacySettings = () => {
  showPrivacyModal.value = true
}

const showHelp = () => {
  showHelpModal.value = true
}

const showAbout = () => {
  showAboutModal.value = true
}
</script>

<style scoped>
.user-info {
  text-align: center;
  padding: 2rem 1rem;
}

.avatar-section h2 {
  margin: 1rem 0 0.5rem 0;
  color: var(--ion-color-primary);
}

.avatar-section p {
  margin: 0;
  color: var(--ion-color-medium);
}

.stat-card {
  text-align: center;
  padding: 1rem;
}

.stat-card h3 {
  margin: 0.5rem 0 0.25rem 0;
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--ion-color-primary);
}

.stat-card p {
  margin: 0;
  color: var(--ion-color-medium);
  font-size: 0.9rem;
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

.about-content {
  text-align: center;
  padding: 1rem;
}

.about-content h2 {
  margin: 1rem 0 0.5rem 0;
  color: var(--ion-color-primary);
}

.about-content p {
  margin: 0.5rem 0;
  color: var(--ion-color-medium);
}
</style>




