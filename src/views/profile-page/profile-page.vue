<template>
  <ion-page>
    <ModernHeader title="Meu Perfil" />
    <ion-content :fullscreen="true" class="custom-content">
      <div class="container">
        <div class="profile-header-card">
          <div class="profile-header-content">
            <div class="avatar-section">
              <div class="avatar-wrapper" @click="showPhotoOptions">
                <div class="avatar-container">
                  <img
                    v-if="currentPhotoUrl && !photoLoadError"
                    :src="currentPhotoUrl"
                    alt="Foto do perfil"
                    class="avatar-image"
                    @error="handlePhotoError"
                    @load="handlePhotoLoad"
                  />
                  <div v-else class="avatar-placeholder">
                    <ion-icon :icon="personOutline" class="placeholder-icon"></ion-icon>
                  </div>
                </div>
                <div class="avatar-overlay">
                  <ion-icon :icon="cameraOutline" class="camera-icon"></ion-icon>
                  <span class="overlay-text">Alterar foto</span>
                </div>
              </div>
              <div class="user-info-section">
                <h1 class="user-name">{{ authStore.userName }}</h1>
                <p class="user-email">{{ authStore.userEmail }}</p>
                <div class="user-badges">
                  <PBadge label="Conta Verificada" :icon="shieldCheckmarkOutline" variant="primary" />
                  <PBadge v-if="hasGoogleProvider" label="Google vinculado" :icon="logoGoogle" variant="success" />
                </div>
              </div>
            </div>
            <PQuickStats>
              <PQuickStatItem label="Veículos" :value="vehiclesStore.vehicleCount" :icon="carOutline" variant="primary" />
              <PQuickStatItem label="Manutenções" :value="totalMaintenanceCount" :icon="constructOutline" variant="success" />
              <PQuickStatItem label="Próximas" :value="upcomingMaintenanceCount" :icon="timeOutline" variant="warning" />
            </PQuickStats>
          </div>
        </div>
        <PSettingsSection title="Configurações da Conta">
          <PSettingItem title="Editar Perfil" description="Alterar nome e informações pessoais" :icon="personCircleOutline" icon-variant="primary" @click="router.push('/tabs/profile/edit')" />
          <PSettingItem title="Conexões de Conta" description="Gerenciar métodos de login" :icon="linkOutline" icon-variant="tertiary" :badge="connectedProvidersText" @click="showConnectionsModal = true" />
          <PSettingItem title="Alterar Senha" description="Atualizar senha de acesso" :icon="keyOutline" icon-variant="warning" @click="showPasswordModal = true" />
        </PSettingsSection>
        <PSettingsSection title="Gerenciamento de Veículos">
          <PSettingItem title="Transferências Pendentes" description="Ver e confirmar transferências" :icon="swapHorizontalOutline" icon-variant="warning" @click="router.push('/tabs/transfer-confirm')" />
          <PSettingItem title="Carros Transferidos" description="Histórico de veículos vendidos" :icon="archiveOutline" icon-variant="tertiary" @click="router.push('/tabs/transferred-vehicles')" />
        </PSettingsSection>
        <PSettingsSection title="Preferências">
          <PSettingItem title="Notificações" description="Gerenciar alertas e lembretes" :icon="notificationsOutline" icon-variant="primary" @click="showNotificationsSettings" />
          <PSettingItem title="Privacidade" description="Controle de dados e privacidade" :icon="shieldOutline" icon-variant="success" @click="showPrivacySettings" />
        </PSettingsSection>
        <PSettingsSection title="Suporte">
          <PSettingItem title="Ajuda" description="Central de ajuda e FAQ" :icon="helpCircleOutline" icon-variant="info" @click="showHelp" />
          <PSettingItem title="Sobre" description="Versão e informações do app" :icon="informationCircleOutline" icon-variant="medium" @click="showAbout" />
        </PSettingsSection>
        <button class="logout-button" @click="handleLogout">
          <ion-icon :icon="logOutOutline"></ion-icon>
          <span>Sair da Conta</span>
        </button>
        <PVersionInfo :versionString="fullVersionString" :buildDate="formattedBuildDate" :shortSha="shortSha" :isProduction="isProduction" />
      </div>
    </ion-content>
    <ion-action-sheet :is-open="showPhotoSheet" header="Foto do Perfil" :buttons="photoActionButtons" @didDismiss="showPhotoSheet = false"></ion-action-sheet>
    <PConnectionsModal v-model:is-open="showConnectionsModal" :userEmail="authStore.userEmail" :hasPassword="hasPasswordProvider" :hasGoogle="hasGoogleProvider" :connectedProvidersCount="connectedProviders.length" :unlinkingGoogle="unlinkingGoogle" @unlink-google="handleUnlinkGoogle" />
    <PPasswordChangeModal v-model:is-open="showPasswordModal" :loading="changingPassword" :error="passwordError" @submit="handlePasswordChange" />
    <PAboutModal v-model:is-open="showAboutModal" :versionString="fullVersionString" :changelog="changelog" />
    <MConfirmModal v-model:is-open="showRemovePhotoModal" title="Remover Foto" message="Tem certeza que deseja remover sua foto de perfil?" variant="warning" confirm-text="Remover" cancel-text="Cancelar" confirm-color="danger" @confirm="confirmRemovePhoto" />
    <MConfirmModal v-model:is-open="showUnlinkGoogleModal" title="Desvincular Google" message="Tem certeza que deseja desvincular sua conta Google? Você ainda poderá fazer login com email e senha." variant="warning" confirm-text="Desvincular" cancel-text="Cancelar" confirm-color="danger" @confirm="confirmUnlinkGoogle" />
    <MConfirmModal v-model:is-open="showDeleteAccountModal" title="Sair da Conta" message="Tem certeza que deseja sair?" variant="danger" confirm-text="Sair" cancel-text="Cancelar" confirm-color="danger" @confirm="confirmLogout" />
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { IonPage, IonContent, IonIcon, IonActionSheet, toastController } from '@ionic/vue'
import { personOutline, cameraOutline, carOutline, constructOutline, timeOutline, notificationsOutline, shieldOutline, shieldCheckmarkOutline, helpCircleOutline, informationCircleOutline, logOutOutline, linkOutline, keyOutline, personCircleOutline, swapHorizontalOutline, archiveOutline, logoGoogle } from 'ionicons/icons'
import { useAuthStore } from '@/stores/auth'
import { useVehiclesStore } from '@/stores/vehicles'
import { useVersion } from '@/composables/useVersion'
import { useChangelog } from '@/composables/useChangelog'
import { useProfilePhoto } from '@/composables/useProfilePhoto'
import ModernHeader from '@/components/organisms/ModernHeader.vue'
import MConfirmModal from '@/components/molecules/MConfirmModal.vue'
import { PBadge, PQuickStatItem, PQuickStats, PSettingItem, PSettingsSection, PVersionInfo, PConnectionsModal, PPasswordChangeModal, PAboutModal } from './components'

const router = useRouter()
const authStore = useAuthStore()
const vehiclesStore = useVehiclesStore()
const { fullVersionString, formattedBuildDate, shortSha, isProduction } = useVersion()
const { changelog } = useChangelog()
const { photoState, photoActionButtons, handlePhotoError, handlePhotoLoad } = useProfilePhoto()

const currentPhotoUrl = computed(() => photoState.value.currentPhotoUrl)
const photoLoadError = computed(() => photoState.value.photoLoadError)
const showPhotoSheet = ref(false)
const showRemovePhotoModal = ref(false)
const showUnlinkGoogleModal = ref(false)
const showDeleteAccountModal = ref(false)
const showConnectionsModal = ref(false)
const showPasswordModal = ref(false)
const showAboutModal = ref(false)
const unlinkingGoogle = ref(false)
const changingPassword = ref(false)
const passwordError = ref('')

const connectedProviders = computed(() => authStore.getUserProviders())
const hasPasswordProvider = computed(() => connectedProviders.value.includes('password'))
const hasGoogleProvider = computed(() => connectedProviders.value.includes('google.com'))
const connectedProvidersText = computed(() =>
  connectedProviders.value.length > 1 ? `${connectedProviders.value.length} conectados` : undefined
)

const upcomingMaintenanceCount = computed(() => {
  return vehiclesStore.maintenanceRecords.filter((record) => {
    if (!record.nextDueDate) return false
    const nextDate = new Date(record.nextDueDate)
    const now = new Date()
    return nextDate > now
  }).length
})

const totalMaintenanceCount = computed(() => {
  return vehiclesStore.maintenanceRecords.length
})

const showPhotoOptions = () => {
  showPhotoSheet.value = true
}

const handleUnlinkGoogle = async () => {
  showUnlinkGoogleModal.value = true
}

const confirmUnlinkGoogle = async () => {
  unlinkingGoogle.value = true

  const success = await authStore.unlinkGoogleAccount()

  if (success) {
    const toast = await toastController.create({
      message: '✅ Conta Google desvinculada com sucesso',
      duration: 3000,
      color: 'success',
      position: 'bottom',
    })
    await toast.present()
  } else {
    const toast = await toastController.create({
      message: authStore.error || '❌ Erro ao desvincular conta Google',
      duration: 3000,
      color: 'danger',
      position: 'bottom',
    })
    await toast.present()
  }

  unlinkingGoogle.value = false
}

const confirmRemovePhoto = async () => {
  const { storage, auth } = await import('@/firebase/config')
  const { ref: storageRef, deleteObject } = await import('firebase/storage')
  const { updateProfile } = await import('firebase/auth')
  const { doc, updateDoc } = await import('firebase/firestore')
  const { db } = await import('@/firebase/config')

  if (!auth.currentUser) return

  const loadingToast = await toastController.create({
    message: 'Removendo foto...',
    duration: 0,
  })
  await loadingToast.present()

  try {
    const photoRef = storageRef(storage, `profilePhotos/${auth.currentUser!.uid}`)
    await deleteObject(photoRef)

    await updateProfile(auth.currentUser!, { photoURL: null })

    await updateDoc(doc(db, 'users', auth.currentUser!.uid), {
      avatar: null,
    })

    photoState.value.currentPhotoUrl = ''
    if (authStore.user) {
      authStore.user.avatar = undefined
    }

    await loadingToast.dismiss()

    const successToast = await toastController.create({
      message: '✅ Foto removida com sucesso!',
      duration: 2000,
      color: 'success',
      position: 'bottom',
    })
    await successToast.present()
  } catch (error) {
    await loadingToast.dismiss()
    console.error('Error removing photo:', error)

    const errorToast = await toastController.create({
      message: '❌ Erro ao remover foto',
      duration: 2000,
      color: 'danger',
      position: 'bottom',
    })
    await errorToast.present()
  }
}

const handlePasswordChange = async (form: {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}) => {
  const { EmailAuthProvider, reauthenticateWithCredential, updatePassword } = await import(
    'firebase/auth'
  )
  const { auth } = await import('@/firebase/config')

  if (form.newPassword !== form.confirmPassword) {
    passwordError.value = 'As senhas não coincidem'
    return
  }

  if (form.newPassword.length < 6) {
    passwordError.value = 'A nova senha deve ter no mínimo 6 caracteres'
    return
  }

  changingPassword.value = true
  passwordError.value = ''

  try {
    if (!auth.currentUser || !authStore.userEmail) {
      throw new Error('Usuário não autenticado')
    }

    const credential = EmailAuthProvider.credential(authStore.userEmail, form.currentPassword)
    await reauthenticateWithCredential(auth.currentUser, credential)
    await updatePassword(auth.currentUser, form.newPassword)

    try {
      const { getFunctions, httpsCallable } = await import('firebase/functions')
      const functions = getFunctions()
      const sendConfirmation = httpsCallable(functions, 'sendPasswordChangeConfirmation')

      await sendConfirmation({
        email: authStore.userEmail,
        userName: authStore.userName,
      })
    } catch (emailError) {
      console.warn('Não foi possível enviar email de confirmação:', emailError)
    }

    const toast = await toastController.create({
      message: '✅ Senha alterada com sucesso!',
      duration: 3000,
      color: 'success',
      position: 'bottom',
    })
    await toast.present()

    showPasswordModal.value = false
  } catch (error: unknown) {
    console.error('Error changing password:', error)

    let errorMessage = 'Erro ao alterar senha'
    if (error instanceof Error) {
      if (error.message.includes('wrong-password') || error.message.includes('invalid-credential')) {
        errorMessage = 'Senha atual incorreta'
      } else if (error.message.includes('weak-password')) {
        errorMessage = 'Senha muito fraca. Use pelo menos 6 caracteres'
      } else if (error.message.includes('requires-recent-login')) {
        errorMessage = 'Por segurança, faça login novamente antes de alterar a senha'
      }
    }

    passwordError.value = errorMessage
  } finally {
    changingPassword.value = false
  }
}

const showNotificationsSettings = async () => {
  const toast = await toastController.create({
    message: 'Em breve: Configurações de notificações',
    duration: 2000,
    color: 'medium',
    position: 'bottom',
  })
  await toast.present()
}

const showPrivacySettings = () => {
  router.push('/privacy-policy')
}

const showHelp = async () => {
  const toast = await toastController.create({
    message: 'Em breve: Central de ajuda',
    duration: 2000,
    color: 'medium',
    position: 'bottom',
  })
  await toast.present()
}

const showAbout = () => {
  showAboutModal.value = true
}

const handleLogout = async () => {
  showDeleteAccountModal.value = true
}

const confirmLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

onMounted(() => {
  if (authStore.user?.avatar) {
    photoState.value.currentPhotoUrl = authStore.user.avatar
  }

  vehiclesStore.fetchVehicles()
})
</script>

<style scoped lang="scss">
@use '@/theme/tokens' as *;

.custom-content {
  position: relative;
  
  &::before,
  &::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
  }

  &::before {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
    z-index: 0;
  }

  &::after {
    background-image: radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.05) 0%, transparent 50%);
    z-index: 0;
  }
}

.container {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.profile-header-card {
  background: linear-gradient(135deg, rgba(31, 41, 55, 0.95) 0%, rgba(17, 24, 39, 0.98) 100%);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 40px 32px;
  margin-bottom: 32px;
  animation: fadeInUp 0.6s ease-out backwards;

  @media (max-width: 480px) {
    padding: 28px 16px;
  }
}

.profile-header-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  animation: fadeInUp 0.6s ease-out 0.1s backwards;
}

.avatar-wrapper {
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
}

.avatar-container {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-icon {
  font-size: 48px;
  color: white;

  @media (max-width: 480px) {
    font-size: 40px;
  }
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity $transition-base;
  gap: 4px;
}

.avatar-wrapper:hover > .avatar-overlay {
  opacity: 1;
}

.camera-icon {
  font-size: 32px;
  color: white;
}

.overlay-text {
  font-size: 12px;
  color: white;
  font-weight: 600;
}

.user-info-section {
  text-align: center;
}

.user-name {
  font-size: 28px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;

  @media (max-width: 480px) {
    font-size: 24px;
  }
}

.user-email {
  font-size: 16px;
  color: #9ca3af;
  margin: 0 0 16px 0;
}

.user-badges {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    gap: 8px;
  }
}

.logout-button {
  width: 100%;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all $transition-base;
  margin-bottom: 24px;

  &:hover {
    background: #dc2626;
    transform: translateY(-1px);
  }

  &:active {
    background: #b91c1c;
    transform: translateY(0);
  }

  ion-icon {
    font-size: 20px;
  }

  @media (max-width: 480px) {
    padding: 14px;
    font-size: 15px;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .profile-header-card {
    padding: 24px 16px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 16px 12px 80px 12px;
  }
}
</style>
