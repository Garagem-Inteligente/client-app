<template>
  <ion-page>
    <ModernHeader 
      title="Perfil"
      :show-back-button="true"
      back-path="/tabs/home"
    />

    <ion-content :fullscreen="true" class="ion-padding">
      <!-- Desktop Layout Container -->
      <div class="profile-container">
        <!-- Left Column - User Info & Stats -->
        <div class="profile-left">
          <!-- User Info Card -->
          <ion-card class="user-info-card">
            <ion-card-content class="user-info">
              <div class="avatar-section">
                <div class="avatar-container" @click="showPhotoOptions">
                  <ion-avatar class="profile-avatar">
                    <img v-if="profilePhoto" :src="profilePhoto" alt="Foto do perfil" />
                    <ion-icon v-else :icon="person" size="large"></ion-icon>
                  </ion-avatar>
                  <div class="avatar-overlay">
                    <ion-icon :icon="camera" class="camera-icon"></ion-icon>
                  </div>
                </div>
                <h2>{{ authStore.userName }}</h2>
                <p>{{ authStore.userEmail }}</p>
              </div>
            </ion-card-content>
          </ion-card>

          <!-- Account Stats -->
          <ion-grid class="stats-grid">
            <ion-row>
              <ion-col size="6" size-md="12">
                <ion-card class="stat-card-wrapper">
                  <ion-card-content class="stat-card">
                    <ion-icon :icon="car" color="primary" size="large"></ion-icon>
                    <h3>{{ vehiclesStore.vehicleCount }}</h3>
                    <p>Veículos</p>
                  </ion-card-content>
                </ion-card>
              </ion-col>
              <ion-col size="6" size-md="12">
                <ion-card class="stat-card-wrapper">
                  <ion-card-content class="stat-card">
                    <ion-icon :icon="documentText" color="success" size="large"></ion-icon>
                    <h3>0</h3>
                    <p>Serviços</p>
                  </ion-card-content>
                </ion-card>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>

        <!-- Right Column - Menu & Actions -->
        <div class="profile-right">
          <!-- Menu Options -->
          <ion-list class="menu-list">
            <ion-item button @click="editProfile" class="menu-item">
              <template v-slot:start>
<ion-icon :icon="personCircle"  color="primary"></ion-icon>
</template>
              <ion-label>Editar Perfil</ion-label>
            </ion-item>

            <ion-item button @click="showNotificationsSettings" class="menu-item">
              <template v-slot:start>
<ion-icon :icon="notifications"  color="warning"></ion-icon>
</template>
              <ion-label>Notificações</ion-label>
            </ion-item>

            <ion-item button @click="showPrivacySettings" class="menu-item">
              <template v-slot:start>
<ion-icon :icon="shield"  color="success"></ion-icon>
</template>
              <ion-label>Privacidade</ion-label>
            </ion-item>

            <ion-item button @click="showHelp" class="menu-item">
              <template v-slot:start>
<ion-icon :icon="helpCircle"  color="medium"></ion-icon>
</template>
              <ion-label>Ajuda</ion-label>
            </ion-item>

            <ion-item button @click="showAccountConnections" class="menu-item">
              <template v-slot:start>
<ion-icon :icon="link"  color="tertiary"></ion-icon>
</template>
              <ion-label>Conexões de Conta</ion-label>
              <template v-slot:end>
<ion-badge v-if="connectedProviders.length > 1" color="success">{{ connectedProviders.length }}</ion-badge>
</template>
            </ion-item>

            <ion-item button @click="showAbout" class="menu-item">
              <template v-slot:start>
<ion-icon :icon="informationCircle"  color="medium"></ion-icon>
</template>
              <ion-label>Sobre</ion-label>
            </ion-item>
          </ion-list>

          <!-- Logout Button -->
          <ion-button
            expand="block"
            color="danger"
            fill="outline"
            @click="handleLogout"
            class="logout-button"
          >
            <template v-slot:start>
<ion-icon :icon="logOut" ></ion-icon>
</template>
            Sair da Conta
          </ion-button>

          <!-- Version Info -->
          <div class="version-info">
            <p class="version-text">
              {{ fullVersionString }}
            </p>
            <p class="build-info" v-if="isProduction">
              {{ formattedBuildDate }} • {{ shortSha }}
            </p>
            <p class="build-info" v-else>
              Ambiente de Desenvolvimento
            </p>
          </div>
        </div>
      </div>
    </ion-content>

    <!-- Edit Profile Modal -->
    <ion-modal :is-open="showEditModal" @did-dismiss="showEditModal = false">
      <ion-header>
        <ion-toolbar>
          <ion-title>Editar Perfil</ion-title>
          <template v-slot:end>
<ion-buttons >
            <ion-button @click="showEditModal = false">
              <ion-icon :icon="close"></ion-icon>
            </ion-button>
          </ion-buttons>
</template>
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
          <template v-slot:end>
<ion-buttons >
            <ion-button @click="showNotificationsModal = false">
              <ion-icon :icon="close"></ion-icon>
            </ion-button>
          </ion-buttons>
</template>
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
          <template v-slot:end>
<ion-buttons >
            <ion-button @click="showPrivacyModal = false">
              <ion-icon :icon="close"></ion-icon>
            </ion-button>
          </ion-buttons>
</template>
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
          <template v-slot:end>
<ion-buttons >
            <ion-button @click="showHelpModal = false">
              <ion-icon :icon="close"></ion-icon>
            </ion-button>
          </ion-buttons>
</template>
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
          <template v-slot:end>
<ion-buttons >
            <ion-button @click="showAboutModal = false">
              <ion-icon :icon="close"></ion-icon>
            </ion-button>
          </ion-buttons>
</template>
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

    <!-- Photo Options Modal -->
    <ion-modal :is-open="showPhotoModal" @did-dismiss="showPhotoModal = false">
      <ion-header>
        <ion-toolbar>
          <ion-title>Foto do Perfil</ion-title>
          <template v-slot:end>
<ion-buttons >
            <ion-button @click="showPhotoModal = false">
              <ion-icon :icon="close"></ion-icon>
            </ion-button>
          </ion-buttons>
</template>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div class="photo-options">
          <ion-button 
            expand="block" 
            fill="outline" 
            @click="takePhoto('camera')"
            class="photo-option-button"
          >
            <template v-slot:start>
<ion-icon :icon="camera" ></ion-icon>
</template>
            Tirar Foto
          </ion-button>
          
          <ion-button 
            expand="block" 
            fill="outline" 
            @click="takePhoto('gallery')"
            class="photo-option-button"
          >
            <template v-slot:start>
<ion-icon :icon="images" ></ion-icon>
</template>
            Escolher da Galeria
          </ion-button>
          
          <ion-button 
            expand="block" 
            fill="outline" 
            @click="removePhoto"
            class="photo-option-button"
            color="danger"
            v-if="profilePhoto"
          >
            <template v-slot:start>
<ion-icon :icon="trash" ></ion-icon>
</template>
            Remover Foto
          </ion-button>
        </div>
      </ion-content>
    </ion-modal>

    <!-- Account Connections Modal -->
    <ion-modal :is-open="showConnectionsModal" @did-dismiss="showConnectionsModal = false">
      <ion-header>
        <ion-toolbar>
          <ion-title>Conexões de Conta</ion-title>
          <template v-slot:end>
<ion-buttons >
            <ion-button @click="showConnectionsModal = false">
              <ion-icon :icon="close"></ion-icon>
            </ion-button>
          </ion-buttons>
</template>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div class="connections-content">
          <p class="connections-description">
            Gerencie os métodos de login conectados à sua conta. Você pode vincular ou desvincular provedores de autenticação.
          </p>

          <!-- Providers List -->
          <ion-list class="providers-list">
            <!-- Email/Password -->
            <ion-item class="provider-item">
              <template v-slot:start>
<div class="provider-icon email-provider">
                  <ion-icon :icon="mail"></ion-icon>
                </div>
</template>
              <ion-label>
                <h3>Email e Senha</h3>
                <p>{{ authStore.userEmail }}</p>
              </ion-label>
              <template v-slot:end>
<ion-badge v-if="hasPasswordProvider" color="success">Conectado</ion-badge>
                <ion-badge v-else color="medium">Não configurado</ion-badge>
</template>
            </ion-item>

            <!-- Google -->
            <ion-item class="provider-item">
              <template v-slot:start>
<div class="provider-icon google-provider">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="google-icon-small">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
</template>
              <ion-label>
                <h3>Google</h3>
                <p v-if="hasGoogleProvider">Conectado via Google</p>
                <p v-else>Não conectado</p>
              </ion-label>
              <template v-slot:end>
<div class="provider-actions">
                  <ion-badge v-if="hasGoogleProvider" color="success">Conectado</ion-badge>
                  <ion-button 
                    v-if="hasGoogleProvider && hasPasswordProvider"
                    @click="handleUnlinkGoogle"
                    size="small"
                    fill="outline"
                    color="danger"
                    :disabled="unlinkingGoogle"
                  >
                    <ion-spinner v-if="unlinkingGoogle" name="crescent" style="width: 16px; height: 16px;"></ion-spinner>
                    <span v-else>Desvincular</span>
                  </ion-button>
                </div>
</template>
            </ion-item>
          </ion-list>

          <!-- Warning -->
          <ion-card class="warning-card" v-if="connectedProviders.length === 1">
            <ion-card-content>
              <div class="warning-content">
                <ion-icon :icon="warningOutline" color="warning"></ion-icon>
                <p>
                  Você precisa ter pelo menos um método de login ativo. 
                  {{ !hasPasswordProvider ? 'Configure uma senha antes de desvincular o Google.' : '' }}
                </p>
              </div>
            </ion-card-content>
          </ion-card>

          <!-- Info -->
          <ion-card class="info-card">
            <ion-card-content>
              <div class="info-content">
                <ion-icon :icon="informationCircleOutline" color="primary"></ion-icon>
                <p>
                  Vincular múltiplos métodos de login permite que você acesse sua conta de diferentes formas, aumentando a segurança e conveniência.
                </p>
              </div>
            </ion-card-content>
          </ion-card>
        </div>
      </ion-content>
    </ion-modal>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
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
  IonButtons,
  IonBadge,
  IonSpinner,
  alertController,
  toastController
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
  construct,
  camera,
  images,
  trash,
  link,
  mail,
  warningOutline,
  informationCircleOutline
} from 'ionicons/icons'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { useAuthStore } from '@/stores/auth'
import { useVehiclesStore } from '@/stores/vehicles'
import { useVersion } from '@/composables/useVersion'
import ModernHeader from '@/components/organisms/ModernHeader.vue'

const router = useRouter()
const authStore = useAuthStore()
const vehiclesStore = useVehiclesStore()
const { fullVersionString, formattedBuildDate, shortSha, isProduction } = useVersion()

const showEditModal = ref(false)
const showNotificationsModal = ref(false)
const showPrivacyModal = ref(false)
const showHelpModal = ref(false)
const showAboutModal = ref(false)
const showPhotoModal = ref(false)
const showConnectionsModal = ref(false)
const profilePhoto = ref<string>('')
const unlinkingGoogle = ref(false)

// Computed properties for providers
const connectedProviders = computed(() => authStore.getUserProviders())
const hasPasswordProvider = computed(() => connectedProviders.value.includes('password'))
const hasGoogleProvider = computed(() => connectedProviders.value.includes('google.com'))

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const showAccountConnections = () => {
  showConnectionsModal.value = true
}

const handleUnlinkGoogle = async () => {
  const alert = await alertController.create({
    header: 'Desvincular Google',
    message: 'Tem certeza que deseja desvincular sua conta Google? Você ainda poderá fazer login com email e senha.',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Desvincular',
        role: 'destructive',
        handler: async () => {
          unlinkingGoogle.value = true
          
          const success = await authStore.unlinkGoogleAccount()
          
          if (success) {
            const toast = await toastController.create({
              message: 'Conta Google desvinculada com sucesso',
              duration: 3000,
              color: 'success',
              position: 'bottom'
            })
            await toast.present()
          } else {
            const toast = await toastController.create({
              message: authStore.error || 'Erro ao desvincular conta Google',
              duration: 3000,
              color: 'danger',
              position: 'bottom'
            })
            await toast.present()
          }
          
          unlinkingGoogle.value = false
        }
      }
    ]
  })
  
  await alert.present()
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

const showPhotoOptions = () => {
  showPhotoModal.value = true
}

const takePhoto = async (source: 'camera' | 'gallery') => {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: source === 'camera' ? CameraSource.Camera : CameraSource.Photos
    })

    if (image.dataUrl) {
      profilePhoto.value = image.dataUrl
      // Aqui você pode salvar a foto no store ou fazer upload para o servidor
      // await authStore.updateProfilePhoto(image.dataUrl)
    }
    
    showPhotoModal.value = false
  } catch (error) {
    console.error('Erro ao capturar foto:', error)
  }
}

const removePhoto = () => {
  profilePhoto.value = ''
  showPhotoModal.value = false
  // Aqui você pode remover a foto do store ou servidor
  // await authStore.removeProfilePhoto()
}
</script>

<style scoped>
/* ====================================
   MODERN PROFILE PAGE - 2025 DESIGN
   ==================================== */

/* User Info Card - Premium */
.user-info {
  text-align: center;
  padding: 2.5rem 1.5rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 20px;
  position: relative;
  overflow: hidden;
}

.user-info::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.avatar-container {
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.avatar-container:hover {
  transform: scale(1.05);
}

.profile-avatar {
  width: 100px;
  height: 100px;
  border: 4px solid rgba(102, 126, 234, 0.3);
  box-shadow: 
    0 8px 24px rgba(102, 126, 234, 0.3),
    inset 0 2px 8px rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-avatar ion-icon {
  font-size: 3.5rem;
  color: white;
  opacity: 0.9;
}

.avatar-overlay {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid rgba(31, 41, 55, 0.8);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.avatar-container:hover .avatar-overlay {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
}

.camera-icon {
  font-size: 1rem;
  color: white;
}

.avatar-section h2 {
  margin: 0.5rem 0 0.25rem 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.avatar-section p {
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.938rem;
  font-weight: 500;
}

/* Stats Cards - Modern Grid */
ion-grid {
  padding: 16px 0;
}

ion-col ion-card {
  margin: 0;
  background: rgba(31, 41, 55, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  position: relative;
}

ion-col ion-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

ion-col ion-card:hover {
  transform: translateY(-4px);
  border-color: rgba(102, 126, 234, 0.3);
  box-shadow: 
    0 12px 24px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

ion-col ion-card:hover::before {
  opacity: 1;
}

.stat-card {
  text-align: center;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.stat-card ion-icon {
  font-size: 2.5rem;
  transition: all 0.3s ease;
  filter: drop-shadow(0 4px 8px rgba(102, 126, 234, 0.3));
}

ion-col ion-card:hover .stat-card ion-icon {
  transform: scale(1.1) rotate(5deg);
}

.stat-card h3 {
  margin: 0;
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -1px;
}

.stat-card p {
  margin: 0;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Menu List - Modern Items */
ion-list {
  background: transparent;
  padding: 8px 0;
}

ion-item {
  --background: rgba(31, 41, 55, 0.6);
  --border-color: rgba(255, 255, 255, 0.08);
  --padding-start: 16px;
  --padding-end: 16px;
  --inner-padding-end: 8px;
  --min-height: 64px;
  margin-bottom: 8px;
  border-radius: 16px;
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

ion-item:hover {
  --background: rgba(31, 41, 55, 0.9);
  transform: translateX(4px);
  border-color: rgba(102, 126, 234, 0.3);
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.2),
    -4px 0 0 rgba(102, 126, 234, 0.5);
}

ion-item ion-icon {
  font-size: 1.5rem;
  margin-inline-end: 16px;
  transition: transform 0.3s ease;
}

ion-item:hover ion-icon {
  transform: scale(1.1);
}

ion-item ion-label {
  font-weight: 600;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
}

/* Logout Button - Premium Danger */
ion-button[color="danger"] {
  --background: rgba(239, 68, 68, 0.15);
  --background-hover: rgba(239, 68, 68, 0.25);
  --background-activated: rgba(239, 68, 68, 0.3);
  --border-width: 2px;
  --border-style: solid;
  --border-color: rgba(239, 68, 68, 0.4);
  --border-radius: 16px;
  --box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
  --padding-top: 16px;
  --padding-bottom: 16px;
  font-weight: 700;
  letter-spacing: 0.5px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin: 24px 16px 16px 16px;
}

ion-button[color="danger"]:hover {
  transform: translateY(-2px);
  --box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3);
}

/* Modals - Modern */
.coming-soon-modal,
.about-content {
  text-align: center;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.coming-soon-modal ion-icon,
.about-content ion-icon {
  font-size: 4rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.coming-soon-modal h2,
.about-content h2 {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  letter-spacing: -0.5px;
}

.coming-soon-modal p,
.about-content p {
  margin: 0;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  font-size: 1rem;
  max-width: 400px;
}

.coming-soon-modal ion-button,
.about-content ion-button {
  margin-top: 1rem;
  --border-radius: 12px;
  --padding-start: 32px;
  --padding-end: 32px;
}

/* Version Info - Elegant Footer */
.version-info {
  margin: 2rem 0 1.5rem 0;
  padding: 1.5rem 1rem;
  text-align: center;
  background: rgba(31, 41, 55, 0.4);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
}

.version-text {
  font-size: 0.813rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: color 0.3s ease;
}

.version-info:hover .version-text {
  color: rgba(255, 255, 255, 0.7);
}

.build-info {
  font-size: 0.688rem;
  color: rgba(255, 255, 255, 0.4);
  margin: 0.5rem 0 0 0;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Courier New', monospace;
  letter-spacing: 0.3px;
  transition: color 0.3s ease;
}

.version-info:hover .build-info {
  color: rgba(255, 255, 255, 0.5);
}

/* ====================================
   DESKTOP LAYOUT - RESPONSIVE DESIGN
   ==================================== */

/* Profile Container - Desktop Layout */
.profile-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.profile-left,
.profile-right {
  width: 100%;
}

/* Desktop Enhancements */
@media (min-width: 768px) {
  ion-content {
    --padding-start: 24px;
    --padding-end: 24px;
  }

  /* Desktop Layout - Two Columns */
  .profile-container {
    flex-direction: row;
    gap: 32px;
    align-items: flex-start;
  }

  .profile-left {
    flex: 0 0 400px;
    max-width: 400px;
  }

  .profile-right {
    flex: 1;
    min-width: 0;
  }

  /* User Info Card - Desktop */
  .user-info-card {
    margin-bottom: 24px;
  }

  .user-info {
    padding: 3rem 2rem;
  }

  .avatar-section ion-avatar {
    width: 120px;
    height: 120px;
  }

  .avatar-section h2 {
    font-size: 2rem;
  }

  /* Stats Grid - Desktop */
  .stats-grid {
    padding: 0;
  }

  .stat-card-wrapper {
    margin-bottom: 16px;
  }

  .stat-card {
    padding: 2rem 1.5rem;
  }

  .stat-card h3 {
    font-size: 2.5rem;
  }

  /* Menu List - Desktop */
  .menu-list {
    padding: 0;
  }

  .menu-item {
    --min-height: 72px;
    margin-bottom: 12px;
  }

  /* Logout Button - Desktop */
  .logout-button {
    margin: 24px 0;
  }

  /* Version Info - Desktop */
  .version-info {
    margin: 2rem 0 1.5rem 0;
  }
}

/* Large Desktop */
@media (min-width: 1024px) {
  .profile-container {
    gap: 48px;
  }

  .profile-left {
    flex: 0 0 450px;
    max-width: 450px;
  }

  .user-info {
    padding: 3.5rem 2.5rem;
  }

  .avatar-section ion-avatar {
    width: 140px;
    height: 140px;
  }

  .avatar-section h2 {
    font-size: 2.25rem;
  }

  .stat-card {
    padding: 2.5rem 2rem;
  }

  .stat-card h3 {
    font-size: 3rem;
  }

  .menu-item {
    --min-height: 80px;
    margin-bottom: 16px;
  }
}

/* ====================================
   PHOTO OPTIONS MODAL
   ==================================== */

.photo-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px 0;
}

.photo-option-button {
  --border-radius: 16px;
  --padding-top: 16px;
  --padding-bottom: 16px;
  --padding-start: 24px;
  --padding-end: 24px;
  font-weight: 600;
  letter-spacing: 0.3px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid rgba(102, 126, 234, 0.3);
}

.photo-option-button:hover {
  transform: translateY(-2px);
  --box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.photo-option-button ion-icon {
  font-size: 1.5rem;
  margin-inline-end: 12px;
}

/* Desktop Photo Options */
@media (min-width: 768px) {
  .photo-options {
    padding: 32px 0;
    gap: 20px;
  }

  .photo-option-button {
    --padding-top: 20px;
    --padding-bottom: 20px;
    --padding-start: 32px;
    --padding-end: 32px;
    font-size: 1.1rem;
  }
}

/* Account Connections Modal */
.connections-content {
  max-width: 600px;
  margin: 0 auto;
}

.connections-description {
  font-size: 16px;
  line-height: 1.6;
  color: #64748b;
  margin-bottom: 24px;
}

.providers-list {
  background: transparent;
  margin-bottom: 16px;
}

.provider-item {
  --padding-start: 16px;
  --padding-end: 16px;
  --padding-top: 16px;
  --padding-bottom: 16px;
  --border-radius: 12px;
  --background: rgba(255, 255, 255, 0.05);
  margin-bottom: 12px;
  border: 1px solid rgba(99, 102, 241, 0.1);
}

.provider-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.provider-icon.email-provider {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
}

.provider-icon.google-provider {
  background: white;
  padding: 8px;
}

.google-icon-small {
  width: 100%;
  height: 100%;
}

.provider-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.warning-card,
.info-card {
  margin-top: 16px;
  --background: transparent;
}

.warning-card ion-card-content,
.info-card ion-card-content {
  padding: 16px;
}

.warning-content,
.info-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.warning-content ion-icon,
.info-content ion-icon {
  flex-shrink: 0;
  font-size: 24px;
  margin-top: 2px;
}

.warning-content p,
.info-content p {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: #64748b;
}

.warning-card {
  border: 1px solid rgba(245, 158, 11, 0.2);
  background: rgba(245, 158, 11, 0.05);
}

.info-card {
  border: 1px solid rgba(59, 130, 246, 0.2);
  background: rgba(59, 130, 246, 0.05);
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>




