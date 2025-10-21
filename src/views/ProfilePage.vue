<template>
  <ion-page>
    <ModernHeader title="Meu Perfil" />

    <ion-content :fullscreen="true" class="custom-content">
      <!-- Background layers -->
      <div class="background-gradient"></div>
      <div class="background-pattern"></div>

      <div class="container">
        <!-- Profile Header Card -->
        <div class="profile-header-card">
          <div class="profile-header-content">
            <!-- Avatar Section -->
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

              <!-- User Info -->
              <div class="user-info-section">
                <h1 class="user-name">{{ authStore.userName }}</h1>
                <p class="user-email">{{ authStore.userEmail }}</p>
                <div class="user-badges">
                  <div class="badge badge-primary">
                    <ion-icon :icon="shieldCheckmarkOutline"></ion-icon>
                    <span>Conta Verificada</span>
                  </div>
                  <div v-if="hasGoogleProvider" class="badge badge-success">
                    <ion-icon :icon="logoGoogle"></ion-icon>
                    <span>Google vinculado</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Stats -->
            <div class="quick-stats">
              <div class="stat-item">
                <div class="stat-icon stat-primary">
                  <ion-icon :icon="carOutline"></ion-icon>
                </div>
                <div class="stat-content">
                  <span class="stat-value">{{ vehiclesStore.vehicleCount }}</span>
                  <span class="stat-label">Veículos</span>
                </div>
              </div>

              <div class="stat-item">
                <div class="stat-icon stat-success">
                  <ion-icon :icon="constructOutline"></ion-icon>
                </div>
                <div class="stat-content">
                  <span class="stat-value">{{ totalMaintenanceCount }}</span>
                  <span class="stat-label">Manutenções</span>
                </div>
              </div>

              <div class="stat-item">
                <div class="stat-icon stat-warning">
                  <ion-icon :icon="timeOutline"></ion-icon>
                </div>
                <div class="stat-content">
                  <span class="stat-value">{{ upcomingMaintenanceCount }}</span>
                  <span class="stat-label">Próximas</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Account Settings -->
        <div class="settings-section">
          <h2 class="section-title">Configurações da Conta</h2>

          <div class="settings-card">
            <button class="setting-item" @click="editProfile">
              <div class="setting-icon-wrapper icon-primary">
                <ion-icon :icon="personCircleOutline"></ion-icon>
              </div>
              <div class="setting-content">
                <span class="setting-title">Editar Perfil</span>
                <span class="setting-description">Alterar nome e informações pessoais</span>
              </div>
              <ion-icon :icon="chevronForwardOutline" class="setting-arrow"></ion-icon>
            </button>

            <button class="setting-item" @click="showAccountConnections">
              <div class="setting-icon-wrapper icon-tertiary">
                <ion-icon :icon="linkOutline"></ion-icon>
              </div>
              <div class="setting-content">
                <span class="setting-title">Conexões de Conta</span>
                <span class="setting-description">Gerenciar métodos de login</span>
              </div>
              <div class="setting-end">
                <span v-if="connectedProviders.length > 1" class="connection-badge">
                  {{ connectedProviders.length }} conectados
                </span>
                <ion-icon :icon="chevronForwardOutline" class="setting-arrow"></ion-icon>
              </div>
            </button>

            <button class="setting-item" @click="changePassword">
              <div class="setting-icon-wrapper icon-warning">
                <ion-icon :icon="keyOutline"></ion-icon>
              </div>
              <div class="setting-content">
                <span class="setting-title">Alterar Senha</span>
                <span class="setting-description">Atualizar senha de acesso</span>
              </div>
              <ion-icon :icon="chevronForwardOutline" class="setting-arrow"></ion-icon>
            </button>
          </div>
        </div>

        <!-- Vehicle Management -->
        <div class="settings-section">
          <h2 class="section-title">Gerenciamento de Veículos</h2>

          <div class="settings-card">
            <button class="setting-item" @click="router.push('/tabs/transfer-confirm')">
              <div class="setting-icon-wrapper icon-warning">
                <ion-icon :icon="swapHorizontalOutline"></ion-icon>
              </div>
              <div class="setting-content">
                <span class="setting-title">Transferências Pendentes</span>
                <span class="setting-description">Ver e confirmar transferências</span>
              </div>
              <ion-icon :icon="chevronForwardOutline" class="setting-arrow"></ion-icon>
            </button>

            <button class="setting-item" @click="router.push('/tabs/transferred-vehicles')">
              <div class="setting-icon-wrapper icon-medium">
                <ion-icon :icon="archiveOutline"></ion-icon>
              </div>
              <div class="setting-content">
                <span class="setting-title">Carros Transferidos</span>
                <span class="setting-description">Histórico de veículos vendidos</span>
              </div>
              <ion-icon :icon="chevronForwardOutline" class="setting-arrow"></ion-icon>
            </button>
          </div>
        </div>

        <!-- Preferences -->
        <div class="settings-section">
          <h2 class="section-title">Preferências</h2>

          <div class="settings-card">
            <button class="setting-item" @click="showNotificationsSettings">
              <div class="setting-icon-wrapper icon-success">
                <ion-icon :icon="notificationsOutline"></ion-icon>
              </div>
              <div class="setting-content">
                <span class="setting-title">Notificações</span>
                <span class="setting-description">Gerenciar alertas e lembretes</span>
              </div>
              <ion-icon :icon="chevronForwardOutline" class="setting-arrow"></ion-icon>
            </button>

            <button class="setting-item" @click="showPrivacySettings">
              <div class="setting-icon-wrapper icon-medium">
                <ion-icon :icon="shieldOutline"></ion-icon>
              </div>
              <div class="setting-content">
                <span class="setting-title">Privacidade</span>
                <span class="setting-description">Controle de dados e privacidade</span>
              </div>
              <ion-icon :icon="chevronForwardOutline" class="setting-arrow"></ion-icon>
            </button>
          </div>
        </div>

        <!-- Support -->
        <div class="settings-section">
          <h2 class="section-title">Suporte</h2>

          <div class="settings-card">
            <button class="setting-item" @click="showHelp">
              <div class="setting-icon-wrapper icon-info">
                <ion-icon :icon="helpCircleOutline"></ion-icon>
              </div>
              <div class="setting-content">
                <span class="setting-title">Ajuda</span>
                <span class="setting-description">Central de ajuda e FAQ</span>
              </div>
              <ion-icon :icon="chevronForwardOutline" class="setting-arrow"></ion-icon>
            </button>

            <button class="setting-item" @click="showAbout">
              <div class="setting-icon-wrapper icon-medium">
                <ion-icon :icon="informationCircleOutline"></ion-icon>
              </div>
              <div class="setting-content">
                <span class="setting-title">Sobre</span>
                <span class="setting-description">Versão e informações do app</span>
              </div>
              <ion-icon :icon="chevronForwardOutline" class="setting-arrow"></ion-icon>
            </button>
          </div>
        </div>

        <!-- Logout Button -->
        <button class="logout-button" @click="handleLogout">
          <ion-icon :icon="logOutOutline"></ion-icon>
          <span>Sair da Conta</span>
        </button>

        <!-- Version Info -->
        <div class="version-info">
          <p class="version-text">{{ fullVersionString }}</p>
          <p class="build-info" v-if="isProduction">{{ formattedBuildDate }} • {{ shortSha }}</p>
          <p class="build-info" v-else>Ambiente de Desenvolvimento</p>
        </div>
      </div>
    </ion-content>

    <!-- Photo Options Action Sheet -->
    <ion-action-sheet
      :is-open="showPhotoSheet"
      header="Foto do Perfil"
      :buttons="photoActionButtons"
      @didDismiss="showPhotoSheet = false"
    >
    </ion-action-sheet>

    <!-- Edit Profile Modal -->
    <ion-modal :is-open="showEditModal" @didDismiss="closeEditModal">
      <ion-header>
        <ion-toolbar>
          <ion-title>Editar Perfil</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="closeEditModal">
              <ion-icon :icon="closeOutline"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="modal-content">
        <div class="edit-form">
          <div class="form-group">
            <label for="editName">Nome completo</label>
            <input
              id="editName"
              v-model="editForm.name"
              type="text"
              placeholder="Seu nome"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="editEmail">Email</label>
            <input
              id="editEmail"
              v-model="editForm.email"
              type="email"
              placeholder="seu@email.com"
              class="form-input"
              disabled
            />
            <p class="form-helper">O email não pode ser alterado</p>
          </div>

          <div class="form-actions">
            <button class="btn-secondary" @click="closeEditModal">Cancelar</button>
            <button class="btn-primary" @click="saveProfile" :disabled="savingProfile">
              <ion-spinner v-if="savingProfile" name="crescent"></ion-spinner>
              <span v-else>Salvar alterações</span>
            </button>
          </div>
        </div>
      </ion-content>
    </ion-modal>

    <!-- Account Connections Modal -->
    <ion-modal :is-open="showConnectionsModal" @didDismiss="showConnectionsModal = false">
      <ion-header>
        <ion-toolbar>
          <ion-title>Conexões de Conta</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="showConnectionsModal = false">
              <ion-icon :icon="closeOutline"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="modal-content">
        <div class="connections-content">
          <p class="connections-description">
            Gerencie os métodos de login conectados à sua conta.
          </p>

          <!-- Providers List -->
          <div class="providers-list">
            <!-- Email/Password -->
            <div class="provider-card">
              <div class="provider-header">
                <div class="provider-icon icon-primary">
                  <ion-icon :icon="mailOutline"></ion-icon>
                </div>
                <div class="provider-info">
                  <h3>Email e Senha</h3>
                  <p>{{ authStore.userEmail }}</p>
                </div>
                <span v-if="hasPasswordProvider" class="provider-status status-connected">
                  Conectado
                </span>
                <span v-else class="provider-status status-inactive"> Não configurado </span>
              </div>
            </div>

            <!-- Google -->
            <div class="provider-card">
              <div class="provider-header">
                <div class="provider-icon icon-google">
                  <ion-icon :icon="logoGoogle"></ion-icon>
                </div>
                <div class="provider-info">
                  <h3>Google</h3>
                  <p v-if="hasGoogleProvider">Conectado via Google</p>
                  <p v-else>Não conectado</p>
                </div>
                <span v-if="hasGoogleProvider" class="provider-status status-connected">
                  Conectado
                </span>
              </div>

              <button
                v-if="hasGoogleProvider && hasPasswordProvider"
                @click="handleUnlinkGoogle"
                class="provider-action-btn btn-danger"
                :disabled="unlinkingGoogle"
              >
                <ion-spinner v-if="unlinkingGoogle" name="crescent"></ion-spinner>
                <span v-else>Desvincular</span>
              </button>
            </div>
          </div>

          <!-- Warning -->
          <div v-if="connectedProviders.length === 1" class="alert alert-warning">
            <ion-icon :icon="warningOutline"></ion-icon>
            <p>
              Você precisa ter pelo menos um método de login ativo.
              {{ !hasPasswordProvider ? 'Configure uma senha antes de desvincular o Google.' : '' }}
            </p>
          </div>

          <!-- Info -->
          <div class="alert alert-info">
            <ion-icon :icon="informationCircleOutline"></ion-icon>
            <p>
              Vincular múltiplos métodos de login aumenta a segurança e conveniência da sua conta.
            </p>
          </div>
        </div>
      </ion-content>
    </ion-modal>

    <!-- About Modal -->
    <ion-modal :is-open="showAboutModal" @didDismiss="showAboutModal = false">
      <ion-header>
        <ion-toolbar>
          <ion-title>Sobre</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="showAboutModal = false">
              <ion-icon :icon="closeOutline"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
        <ion-toolbar>
          <ion-segment v-model="aboutTab" mode="md">
            <ion-segment-button value="info">
              <ion-label>Info</ion-label>
            </ion-segment-button>
            <ion-segment-button value="changelog">
              <ion-label>Novidades</ion-label>
            </ion-segment-button>
          </ion-segment>
        </ion-toolbar>
      </ion-header>
      <ion-content class="modal-content">
        <!-- Info Tab -->
        <div v-show="aboutTab === 'info'" class="about-content">
          <div class="about-logo">
            <ion-icon :icon="carSportOutline"></ion-icon>
          </div>
          <h2>Garagem Inteligente</h2>
          <p class="about-version">{{ fullVersionString }}</p>
          <p class="about-description">
            Gerencie seus veículos de forma inteligente e eficiente. Acompanhe manutenções, custos e
            mantenha tudo organizado em um só lugar.
          </p>
          <div class="about-features">
            <div class="feature-item">
              <ion-icon :icon="checkmarkCircleOutline" color="success"></ion-icon>
              <span>Controle completo de veículos</span>
            </div>
            <div class="feature-item">
              <ion-icon :icon="checkmarkCircleOutline" color="success"></ion-icon>
              <span>Histórico de manutenções</span>
            </div>
            <div class="feature-item">
              <ion-icon :icon="checkmarkCircleOutline" color="success"></ion-icon>
              <span>Lembretes automáticos</span>
            </div>
            <div class="feature-item">
              <ion-icon :icon="checkmarkCircleOutline" color="success"></ion-icon>
              <span>Análise de custos</span>
            </div>
          </div>
          <p class="about-footer">Desenvolvido com ❤️ para facilitar sua vida</p>
        </div>

        <!-- Changelog Tab -->
        <div v-show="aboutTab === 'changelog'" class="changelog-content">
          <div v-for="entry in changelog" :key="entry.version" class="changelog-entry">
            <div class="changelog-header">
              <div class="version-badge">
                <ion-icon :icon="gitBranchOutline"></ion-icon>
                <span>{{ entry.version }}</span>
              </div>
              <div class="changelog-date">
                {{ formatChangelogDate(entry.date) }}
              </div>
            </div>

            <div class="changelog-changes">
              <div v-for="(change, index) in entry.changes" :key="index" class="changelog-item">
                <ion-badge :color="getChangeTypeColor(change.type)" class="change-badge">
                  {{ getChangeTypeLabel(change.type) }}
                </ion-badge>
                <span class="change-message">{{ change.message }}</span>
              </div>
            </div>
          </div>

          <div v-if="changelog.length === 0" class="empty-changelog">
            <ion-icon :icon="documentTextOutline"></ion-icon>
            <p>Nenhuma atualização disponível</p>
          </div>
        </div>
      </ion-content>
    </ion-modal>

    <!-- Change Password Modal -->
    <ion-modal :is-open="showPasswordModal" @didDismiss="closePasswordModal">
      <ion-header>
        <ion-toolbar>
          <ion-title>Alterar Senha</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="closePasswordModal">
              <ion-icon :icon="closeOutline"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="modal-content">
        <div class="password-change-content">
          <!-- Info Alert -->
          <div class="alert alert-info">
            <ion-icon :icon="informationCircleOutline"></ion-icon>
            <p>Por segurança, você precisará reautenticar antes de alterar sua senha.</p>
          </div>

          <form @submit.prevent="handlePasswordChange" class="edit-form">
            <div class="form-group">
              <label for="currentPassword">Senha Atual *</label>
              <input
                id="currentPassword"
                v-model="passwordForm.currentPassword"
                type="password"
                placeholder="Digite sua senha atual"
                class="form-input"
                required
              />
            </div>

            <div class="form-group">
              <label for="newPassword">Nova Senha *</label>
              <input
                id="newPassword"
                v-model="passwordForm.newPassword"
                type="password"
                placeholder="Mínimo 6 caracteres"
                class="form-input"
                minlength="6"
                required
              />
              <p class="form-helper">A senha deve ter no mínimo 6 caracteres</p>
            </div>

            <div class="form-group">
              <label for="confirmPassword">Confirmar Nova Senha *</label>
              <input
                id="confirmPassword"
                v-model="passwordForm.confirmPassword"
                type="password"
                placeholder="Digite a senha novamente"
                class="form-input"
                required
              />
            </div>

            <!-- Password Strength Indicator -->
            <div v-if="passwordForm.newPassword" class="password-strength">
              <div class="strength-bar">
                <div
                  class="strength-fill"
                  :class="passwordStrengthClass"
                  :style="{ width: passwordStrength + '%' }"
                ></div>
              </div>
              <p class="strength-label" :class="passwordStrengthClass">
                {{ passwordStrengthLabel }}
              </p>
            </div>

            <!-- Error Message -->
            <div v-if="passwordError" class="alert alert-warning">
              <ion-icon :icon="warningOutline"></ion-icon>
              <p>{{ passwordError }}</p>
            </div>

            <div class="form-actions">
              <button type="button" class="btn-secondary" @click="closePasswordModal">
                Cancelar
              </button>
              <button
                type="submit"
                class="btn-primary"
                :disabled="changingPassword || !isPasswordFormValid"
              >
                <ion-spinner v-if="changingPassword" name="crescent"></ion-spinner>
                <span v-else>Alterar Senha</span>
              </button>
            </div>
          </form>

          <!-- Security Tips -->
          <div class="security-tips-box">
            <h3>🛡️ Dicas para uma senha segura:</h3>
            <ul>
              <li>Use pelo menos 8 caracteres</li>
              <li>Combine letras maiúsculas e minúsculas</li>
              <li>Inclua números e símbolos</li>
              <li>Evite informações pessoais óbvias</li>
              <li>Não reutilize senhas de outros serviços</li>
            </ul>
          </div>
        </div>
      </ion-content>
    </ion-modal>

    <!-- Confirm Modals -->
    <MConfirmModal
      v-model:is-open="showRemovePhotoModal"
      title="Remover Foto"
      message="Tem certeza que deseja remover sua foto de perfil?"
      variant="warning"
      confirm-text="Remover"
      cancel-text="Cancelar"
      confirm-color="danger"
      @confirm="confirmRemovePhoto"
    />

    <MConfirmModal
      v-model:is-open="showUnlinkGoogleModal"
      title="Desvincular Google"
      message="Tem certeza que deseja desvincular sua conta Google? Você ainda poderá fazer login com email e senha."
      variant="warning"
      confirm-text="Desvincular"
      cancel-text="Cancelar"
      confirm-color="danger"
      @confirm="confirmUnlinkGoogle"
    />

    <MConfirmModal
      v-model:is-open="showDeleteAccountModal"
      title="Sair da Conta"
      message="Tem certeza que deseja sair?"
      variant="danger"
      confirm-text="Sair"
      cancel-text="Cancelar"
      confirm-color="danger"
      @confirm="confirmLogout"
    />
  </ion-page>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import {
    IonPage,
    IonContent,
    IonIcon,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonSpinner,
    IonActionSheet,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonBadge,
    toastController,
  } from '@ionic/vue';
  import {
    personOutline,
    personCircleOutline,
    cameraOutline,
    carOutline,
    constructOutline,
    timeOutline,
    notificationsOutline,
    shieldOutline,
    shieldCheckmarkOutline,
    helpCircleOutline,
    informationCircleOutline,
    logOutOutline,
    linkOutline,
    keyOutline,
    chevronForwardOutline,
    closeOutline,
    mailOutline,
    logoGoogle,
    warningOutline,
    carSportOutline,
    checkmarkCircleOutline,
    trashOutline,
    imagesOutline,
    swapHorizontalOutline,
    archiveOutline,
    gitBranchOutline,
    documentTextOutline,
  } from 'ionicons/icons';
  import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
  import { ref as storageRef, uploadString, getDownloadURL, deleteObject } from 'firebase/storage';
  import {
    updateProfile,
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword,
  } from 'firebase/auth';
  import { doc, updateDoc } from 'firebase/firestore';
  import { auth, storage, db } from '@/firebase/config';
  import { useAuthStore } from '@/stores/auth';
  import { useVehiclesStore } from '@/stores/vehicles';
  import { useVersion } from '@/composables/useVersion';
  import { useChangelog } from '@/composables/useChangelog';
  import { getChangeTypeLabel, getChangeTypeColor } from '@/constants/changelog';
  import ModernHeader from '@/components/organisms/ModernHeader.vue';
  import MConfirmModal from '@/components/molecules/MConfirmModal.vue';

  const router = useRouter();
  const authStore = useAuthStore();
  const vehiclesStore = useVehiclesStore();
  const { fullVersionString, formattedBuildDate, shortSha, isProduction } = useVersion();
  const { changelog } = useChangelog();

  // State
  const aboutTab = ref<'info' | 'changelog'>('info');
  const showPhotoSheet = ref(false);
  const showRemovePhotoModal = ref(false);
  const showUnlinkGoogleModal = ref(false);
  const showDeleteAccountModal = ref(false);
  const showEditModal = ref(false);
  const showConnectionsModal = ref(false);
  const showAboutModal = ref(false);
  const showPasswordModal = ref(false);
  const currentPhotoUrl = ref<string>('');
  const photoLoadError = ref(false);
  const savingProfile = ref(false);
  const unlinkingGoogle = ref(false);
  const changingPassword = ref(false);
  const passwordError = ref('');

  // Handlers para carregamento de foto
  const handlePhotoError = () => {
    console.error('Erro ao carregar foto do perfil');
    photoLoadError.value = true;
  };

  const handlePhotoLoad = () => {
    photoLoadError.value = false;
  };

  // Edit form
  const editForm = ref({
    name: '',
    email: '',
  });

  // Password form
  const passwordForm = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Computed
  const connectedProviders = computed(() => authStore.getUserProviders());
  const hasPasswordProvider = computed(() => connectedProviders.value.includes('password'));
  const hasGoogleProvider = computed(() => connectedProviders.value.includes('google.com'));

  const upcomingMaintenanceCount = computed(() => {
    return vehiclesStore.maintenanceRecords.filter((record) => {
      if (!record.nextDueDate) return false;
      const nextDate = new Date(record.nextDueDate);
      const now = new Date();
      return nextDate > now;
    }).length;
  });

  const totalMaintenanceCount = computed(() => {
    return vehiclesStore.maintenanceRecords.length;
  });

  // Password strength calculator
  const passwordStrength = computed(() => {
    const password = passwordForm.value.newPassword;
    if (!password) return 0;

    let strength = 0;
    if (password.length >= 6) strength += 20;
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 10;
    if (/[a-z]/.test(password)) strength += 10;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/\d/.test(password)) strength += 15;
    if (/[^a-zA-Z\d]/.test(password)) strength += 10;

    return Math.min(strength, 100);
  });

  const passwordStrengthLabel = computed(() => {
    const strength = passwordStrength.value;
    if (strength < 40) return 'Fraca';
    if (strength < 70) return 'Média';
    if (strength < 90) return 'Forte';
    return 'Muito Forte';
  });

  const passwordStrengthClass = computed(() => {
    const strength = passwordStrength.value;
    if (strength < 40) return 'strength-weak';
    if (strength < 70) return 'strength-medium';
    if (strength < 90) return 'strength-strong';
    return 'strength-very-strong';
  });

  const isPasswordFormValid = computed(() => {
    return (
      passwordForm.value.currentPassword.length >= 6 &&
      passwordForm.value.newPassword.length >= 6 &&
      passwordForm.value.confirmPassword === passwordForm.value.newPassword
    );
  });

  // Photo action buttons
  const photoActionButtons = computed(() => {
    const buttons: Array<{
      text: string;
      icon?: string;
      role?: string;
      handler?: () => void;
    }> = [
      {
        text: 'Tirar Foto',
        icon: cameraOutline,
        handler: () => takePhoto('camera'),
      },
      {
        text: 'Escolher da Galeria',
        icon: imagesOutline,
        handler: () => takePhoto('gallery'),
      },
    ];

    if (currentPhotoUrl.value && !currentPhotoUrl.value.includes('googleusercontent.com')) {
      buttons.push({
        text: 'Remover Foto',
        icon: trashOutline,
        role: 'destructive',
        handler: () => removePhoto(),
      });
    }

    buttons.push({
      text: 'Cancelar',
      role: 'cancel',
    });

    return buttons;
  });

  // Methods
  const showPhotoOptions = () => {
    showPhotoSheet.value = true;
  };

  const takePhoto = async (source: 'camera' | 'gallery') => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: source === 'camera' ? CameraSource.Camera : CameraSource.Photos,
        webUseInput: true,
        promptLabelHeader: source === 'camera' ? 'Tirar Foto' : 'Escolher da Galeria',
        promptLabelCancel: 'Cancelar',
        promptLabelPhoto: 'Galeria',
        promptLabelPicture: 'Câmera',
      });

      if (image.dataUrl && auth.currentUser) {
        const loadingToast = await toastController.create({
          message: 'Enviando foto...',
          duration: 0,
        });
        await loadingToast.present();

        try {
          // Upload to Firebase Storage
          const photoRef = storageRef(storage, `profilePhotos/${auth.currentUser.uid}`);
          await uploadString(photoRef, image.dataUrl, 'data_url');

          // Get download URL
          const photoURL = await getDownloadURL(photoRef);

          // Update Firebase Auth profile
          await updateProfile(auth.currentUser, { photoURL });

          // Update Firestore
          await updateDoc(doc(db, 'users', auth.currentUser.uid), {
            avatar: photoURL,
          });

          // Update local state
          currentPhotoUrl.value = photoURL;
          if (authStore.user) {
            authStore.user.avatar = photoURL;
          }

          await loadingToast.dismiss();

          const successToast = await toastController.create({
            message: '✅ Foto atualizada com sucesso!',
            duration: 2000,
            color: 'success',
            position: 'bottom',
          });
          await successToast.present();
        } catch (error) {
          await loadingToast.dismiss();
          console.error('Error uploading photo:', error);

          const errorToast = await toastController.create({
            message: '❌ Erro ao atualizar foto',
            duration: 2000,
            color: 'danger',
            position: 'bottom',
          });
          await errorToast.present();
        }
      }
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  };

  const removePhoto = async () => {
    if (!auth.currentUser) return;
    showRemovePhotoModal.value = true;
  };

  const confirmRemovePhoto = async () => {
    if (!auth.currentUser) return;

    const loadingToast = await toastController.create({
      message: 'Removendo foto...',
      duration: 0,
    });
    await loadingToast.present();

    try {
      // Delete from Storage
      const photoRef = storageRef(storage, `profilePhotos/${auth.currentUser!.uid}`);
      await deleteObject(photoRef);

      // Update Firebase Auth profile
      await updateProfile(auth.currentUser!, { photoURL: null });

      // Update Firestore
      await updateDoc(doc(db, 'users', auth.currentUser!.uid), {
        avatar: null,
      });

      // Update local state
      currentPhotoUrl.value = '';
      if (authStore.user) {
        authStore.user.avatar = undefined;
      }

      await loadingToast.dismiss();

      const successToast = await toastController.create({
        message: '✅ Foto removida com sucesso!',
        duration: 2000,
        color: 'success',
        position: 'bottom',
      });
      await successToast.present();
    } catch (error) {
      await loadingToast.dismiss();
      console.error('Error removing photo:', error);

      const errorToast = await toastController.create({
        message: '❌ Erro ao remover foto',
        duration: 2000,
        color: 'danger',
        position: 'bottom',
      });
      await errorToast.present();
    }
  };

  const editProfile = () => {
    editForm.value.name = authStore.userName;
    editForm.value.email = authStore.userEmail;
    showEditModal.value = true;
  };

  const closeEditModal = () => {
    showEditModal.value = false;
  };

  const saveProfile = async () => {
    if (!auth.currentUser) return;

    savingProfile.value = true;

    try {
      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, {
        displayName: editForm.value.name,
      });

      // Update Firestore
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        name: editForm.value.name,
      });

      // Update local state
      if (authStore.user) {
        authStore.user.name = editForm.value.name;
      }

      const toast = await toastController.create({
        message: '✅ Perfil atualizado com sucesso!',
        duration: 2000,
        color: 'success',
        position: 'bottom',
      });
      await toast.present();

      showEditModal.value = false;
    } catch (error) {
      console.error('Error updating profile:', error);

      const toast = await toastController.create({
        message: '❌ Erro ao atualizar perfil',
        duration: 2000,
        color: 'danger',
        position: 'bottom',
      });
      await toast.present();
    } finally {
      savingProfile.value = false;
    }
  };

  const showAccountConnections = () => {
    showConnectionsModal.value = true;
  };

  const handleUnlinkGoogle = async () => {
    showUnlinkGoogleModal.value = true;
  };

  const confirmUnlinkGoogle = async () => {
    unlinkingGoogle.value = true;

    const success = await authStore.unlinkGoogleAccount();

    if (success) {
      const toast = await toastController.create({
        message: '✅ Conta Google desvinculada com sucesso',
        duration: 3000,
        color: 'success',
        position: 'bottom',
      });
      await toast.present();
    } else {
      const toast = await toastController.create({
        message: authStore.error || '❌ Erro ao desvincular conta Google',
        duration: 3000,
        color: 'danger',
        position: 'bottom',
      });
      await toast.present();
    }

    unlinkingGoogle.value = false;
  };

  const changePassword = () => {
    showPasswordModal.value = true;
    passwordError.value = '';
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
  };

  const closePasswordModal = () => {
    showPasswordModal.value = false;
    passwordError.value = '';
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
  };

  const handlePasswordChange = async () => {
    // Validar formulário
    if (!isPasswordFormValid.value) {
      passwordError.value = 'Por favor, preencha todos os campos corretamente';
      return;
    }

    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
      passwordError.value = 'As senhas não coincidem';
      return;
    }

    if (passwordForm.value.newPassword.length < 6) {
      passwordError.value = 'A nova senha deve ter no mínimo 6 caracteres';
      return;
    }

    changingPassword.value = true;
    passwordError.value = '';

    try {
      if (!auth.currentUser || !authStore.userEmail) {
        throw new Error('Usuário não autenticado');
      }

      // Reautenticar usuário
      const credential = EmailAuthProvider.credential(
        authStore.userEmail,
        passwordForm.value.currentPassword,
      );

      await reauthenticateWithCredential(auth.currentUser, credential);

      // Atualizar senha
      await updatePassword(auth.currentUser, passwordForm.value.newPassword);

      // Enviar email de confirmação (opcional - via function)
      try {
        const { getFunctions, httpsCallable } = await import('firebase/functions');
        const functions = getFunctions();
        const sendConfirmation = httpsCallable(functions, 'sendPasswordChangeConfirmation');

        await sendConfirmation({
          email: authStore.userEmail,
          userName: authStore.userName,
        });
      } catch (emailError) {
        console.warn('Não foi possível enviar email de confirmação:', emailError);
        // Não falhar a operação se o email não for enviado
      }

      const toast = await toastController.create({
        message: '✅ Senha alterada com sucesso!',
        duration: 3000,
        color: 'success',
        position: 'bottom',
      });
      await toast.present();

      closePasswordModal();
    } catch (error: unknown) {
      console.error('Error changing password:', error);

      let errorMessage = 'Erro ao alterar senha';
      if (error instanceof Error) {
        if (
          error.message.includes('wrong-password') ||
          error.message.includes('invalid-credential')
        ) {
          errorMessage = 'Senha atual incorreta';
        } else if (error.message.includes('weak-password')) {
          errorMessage = 'Senha muito fraca. Use pelo menos 6 caracteres';
        } else if (error.message.includes('requires-recent-login')) {
          errorMessage = 'Por segurança, faça login novamente antes de alterar a senha';
        }
      }

      passwordError.value = errorMessage;
    } finally {
      changingPassword.value = false;
    }
  };

  const showNotificationsSettings = async () => {
    const toast = await toastController.create({
      message: 'Em breve: Configurações de notificações',
      duration: 2000,
      color: 'medium',
      position: 'bottom',
    });
    await toast.present();
  };

  const showPrivacySettings = () => {
    router.push('/privacy-policy');
  };

  const showHelp = async () => {
    const toast = await toastController.create({
      message: 'Em breve: Central de ajuda',
      duration: 2000,
      color: 'medium',
      position: 'bottom',
    });
    await toast.present();
  };

  const showAbout = () => {
    aboutTab.value = 'info';
    showAboutModal.value = true;
  };

  const formatChangelogDate = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleLogout = async () => {
    showDeleteAccountModal.value = true;
  };

  const confirmLogout = async () => {
    await authStore.logout();
    router.push('/login');
  };

  // Initialize
  onMounted(() => {
    // Load current photo from auth or Google
    if (authStore.user?.avatar) {
      currentPhotoUrl.value = authStore.user.avatar;
    }

    // Fetch vehicles data
    vehiclesStore.fetchVehicles();
  });
</script>

<style scoped>
  /* Background layers - sem interferir na interação */
  .background-gradient,
  .background-pattern {
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
  }

  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 24px 16px;
    position: relative;
    z-index: 1;
  }

  /* Profile Header Card */
  .profile-header-card {
    background: linear-gradient(135deg, rgba(31, 41, 55, 0.95) 0%, rgba(17, 24, 39, 0.98) 100%);
    backdrop-filter: blur(10px);
    border-radius: 24px;
    padding: 32px;
    margin-bottom: 24px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    animation: fadeInDown 0.6s ease-out;
  }

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .profile-header-content {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  /* Avatar Section */
  .avatar-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .avatar-wrapper {
    position: relative;
    cursor: pointer;
  }

  .avatar-container {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    border: 4px solid rgba(59, 130, 246, 0.3);
    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.2);
    transition: all 0.3s ease;
  }

  .avatar-wrapper:hover .avatar-container {
    border-color: rgba(59, 130, 246, 0.6);
    transform: scale(1.05);
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
    transition: opacity 0.3s ease;
    gap: 4px;
  }

  .avatar-wrapper:hover .avatar-overlay {
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
  }

  .badge {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 600;
  }

  .badge-primary {
    background: rgba(59, 130, 246, 0.15);
    color: #3b82f6;
    border: 1px solid rgba(59, 130, 246, 0.3);
  }

  .badge-success {
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
    border: 1px solid rgba(16, 185, 129, 0.3);
  }

  .badge ion-icon {
    font-size: 16px;
  }

  /* Quick Stats */
  .quick-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    transition: all 0.3s ease;
    animation: fadeInUp 0.6s ease-out backwards;
  }

  .stat-item:nth-child(1) {
    animation-delay: 0.2s;
  }
  .stat-item:nth-child(2) {
    animation-delay: 0.25s;
  }
  .stat-item:nth-child(3) {
    animation-delay: 0.3s;
  }

  .stat-item:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
  }

  .stat-primary {
    background: rgba(59, 130, 246, 0.15);
    color: #3b82f6;
  }

  .stat-success {
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
  }

  .stat-warning {
    background: rgba(251, 191, 36, 0.15);
    color: #fbbf24;
  }

  .stat-content {
    display: flex;
    flex-direction: column;
  }

  .stat-value {
    font-size: 24px;
    font-weight: 700;
    color: white;
    line-height: 1;
  }

  .stat-label {
    font-size: 13px;
    color: #9ca3af;
    margin-top: 4px;
  }

  /* Settings Section */
  .settings-section {
    margin-bottom: 24px;
  }

  .section-title {
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #9ca3af;
    margin: 0 0 12px 8px;
  }

  .settings-card {
    background: linear-gradient(135deg, rgba(31, 41, 55, 0.95) 0%, rgba(17, 24, 39, 0.98) 100%);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    overflow: hidden;
    animation: fadeInUp 0.6s ease-out 0.35s backwards;
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

  .setting-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background: transparent;
    border: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
    text-align: left;
  }

  .setting-item:last-child {
    border-bottom: none;
  }

  .setting-item:hover {
    background: rgba(255, 255, 255, 0.03);
  }

  .setting-item:active {
    background: rgba(255, 255, 255, 0.05);
  }

  .setting-icon-wrapper {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
  }

  .icon-primary {
    background: rgba(59, 130, 246, 0.15);
    color: #3b82f6;
  }

  .icon-tertiary {
    background: rgba(168, 85, 247, 0.15);
    color: #a855f7;
  }

  .icon-warning {
    background: rgba(251, 191, 36, 0.15);
    color: #fbbf24;
  }

  .icon-success {
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
  }

  .icon-medium {
    background: rgba(156, 163, 175, 0.15);
    color: #9ca3af;
  }

  .icon-info {
    background: rgba(99, 102, 241, 0.15);
    color: #6366f1;
  }

  .icon-google {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }

  .setting-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .setting-title {
    font-size: 16px;
    font-weight: 600;
    color: white;
  }

  .setting-description {
    font-size: 13px;
    color: #9ca3af;
  }

  .setting-end {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .connection-badge {
    font-size: 12px;
    font-weight: 600;
    color: #10b981;
    background: rgba(16, 185, 129, 0.15);
    padding: 4px 8px;
    border-radius: 8px;
  }

  .setting-arrow {
    font-size: 20px;
    color: #6b7280;
  }

  /* Logout Button */
  .logout-button {
    width: 100%;
    padding: 16px;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 16px;
    color: #ef4444;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 24px;
  }

  .logout-button:hover {
    background: rgba(239, 68, 68, 0.15);
    border-color: rgba(239, 68, 68, 0.5);
  }

  .logout-button ion-icon {
    font-size: 20px;
  }

  /* Version Info */
  .version-info {
    text-align: center;
    padding: 16px;
  }

  .version-text {
    font-size: 14px;
    color: #9ca3af;
    margin: 0 0 4px 0;
  }

  .build-info {
    font-size: 12px;
    color: #6b7280;
    margin: 0;
  }

  /* Modal Content */
  .modal-content {
    --background: #111827;
  }

  .edit-form {
    padding: 24px;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-group label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #d1d5db;
    margin-bottom: 8px;
  }

  .form-input {
    width: 100%;
    padding: 12px;
    background: rgba(31, 41, 55, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    color: white;
    font-size: 16px;
    transition: all 0.2s ease;
  }

  .form-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .form-input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .form-helper {
    font-size: 12px;
    color: #9ca3af;
    margin-top: 4px;
  }

  .form-actions {
    display: flex;
    gap: 12px;
    margin-top: 24px;
  }

  .btn-secondary,
  .btn-primary {
    flex: 1;
    padding: 12px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .btn-secondary {
    background: rgba(255, 255, 255, 0.05);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .btn-primary {
    background: #3b82f6;
    color: white;
  }

  .btn-primary:hover {
    background: #2563eb;
  }

  .btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Connections Content */
  .connections-content {
    padding: 24px;
  }

  .connections-description {
    color: #d1d5db;
    margin-bottom: 24px;
    line-height: 1.6;
  }

  .providers-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 24px;
  }

  .provider-card {
    background: rgba(31, 41, 55, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 16px;
  }

  .provider-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }

  .provider-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
  }

  .provider-info {
    flex: 1;
  }

  .provider-info h3 {
    font-size: 16px;
    font-weight: 600;
    color: white;
    margin: 0 0 4px 0;
  }

  .provider-info p {
    font-size: 13px;
    color: #9ca3af;
    margin: 0;
  }

  .provider-status {
    font-size: 12px;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 8px;
  }

  .status-connected {
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
  }

  .status-inactive {
    background: rgba(156, 163, 175, 0.15);
    color: #9ca3af;
  }

  .provider-action-btn {
    width: 100%;
    padding: 10px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .btn-danger {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.3);
  }

  .btn-danger:hover {
    background: rgba(239, 68, 68, 0.15);
  }

  .btn-danger:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Alerts */
  .alert {
    padding: 16px;
    border-radius: 12px;
    display: flex;
    gap: 12px;
    align-items: start;
    margin-bottom: 16px;
  }

  .alert ion-icon {
    font-size: 20px;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .alert p {
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
  }

  .alert-warning {
    background: rgba(251, 191, 36, 0.1);
    border: 1px solid rgba(251, 191, 36, 0.3);
    color: #fbbf24;
  }

  .alert-info {
    background: rgba(59, 130, 246, 0.1);
    border: 1px solid rgba(59, 130, 246, 0.3);
    color: #3b82f6;
  }

  /* About Content */
  .about-content {
    padding: 24px;
    text-align: center;
  }

  .about-logo {
    width: 80px;
    height: 80px;
    margin: 0 auto 24px;
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .about-logo ion-icon {
    font-size: 40px;
    color: white;
  }

  .about-content h2 {
    font-size: 28px;
    font-weight: 700;
    color: white;
    margin: 0 0 8px 0;
  }

  .about-version {
    font-size: 14px;
    color: #9ca3af;
    margin: 0 0 24px 0;
  }

  .about-description {
    font-size: 16px;
    color: #d1d5db;
    line-height: 1.6;
    margin: 0 0 32px 0;
  }

  .about-features {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 32px;
  }

  .feature-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: rgba(31, 41, 55, 0.5);
    border-radius: 12px;
    text-align: left;
  }

  .feature-item ion-icon {
    font-size: 24px;
    flex-shrink: 0;
  }

  .feature-item span {
    font-size: 14px;
    color: #d1d5db;
  }

  .about-footer {
    font-size: 14px;
    color: #9ca3af;
    margin: 0;
  }

  /* Changelog Content */
  .changelog-content {
    padding: 16px;
  }

  .changelog-entry {
    background: rgba(31, 41, 55, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 16px;
  }

  .changelog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .version-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    color: white;
  }

  .version-badge ion-icon {
    font-size: 18px;
  }

  .changelog-date {
    font-size: 13px;
    color: #9ca3af;
  }

  .changelog-changes {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .changelog-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 8px 0;
  }

  .change-badge {
    flex-shrink: 0;
    font-size: 11px;
    padding: 4px 8px;
    border-radius: 8px;
    font-weight: 600;
    text-transform: none;
  }

  .change-message {
    flex: 1;
    font-size: 14px;
    color: #e5e7eb;
    line-height: 1.5;
  }

  .empty-changelog {
    text-align: center;
    padding: 60px 24px;
    color: #9ca3af;
  }

  .empty-changelog ion-icon {
    font-size: 64px;
    color: rgba(255, 255, 255, 0.1);
    margin-bottom: 16px;
  }

  .empty-changelog p {
    font-size: 16px;
    margin: 0;
  }

  /* Password Change Modal */
  .password-change-content {
    padding: 24px;
  }

  .password-strength {
    margin: 16px 0 24px;
  }

  .strength-bar {
    width: 100%;
    height: 8px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 8px;
  }

  .strength-fill {
    height: 100%;
    transition: all 0.3s ease;
    border-radius: 4px;
  }

  .strength-weak {
    background: #ef4444;
    color: #ef4444;
  }

  .strength-medium {
    background: #f59e0b;
    color: #f59e0b;
  }

  .strength-strong {
    background: #3b82f6;
    color: #3b82f6;
  }

  .strength-very-strong {
    background: #10b981;
    color: #10b981;
  }

  .strength-label {
    font-size: 13px;
    font-weight: 600;
    text-align: center;
  }

  .security-tips-box {
    background: rgba(31, 41, 55, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 20px;
    margin-top: 24px;
  }

  .security-tips-box h3 {
    margin: 0 0 12px 0;
    font-size: 15px;
    font-weight: 600;
    color: #3b82f6;
  }

  .security-tips-box ul {
    margin: 0;
    padding-left: 20px;
    color: #9ca3af;
    font-size: 13px;
    line-height: 1.8;
  }

  .security-tips-box li {
    margin-bottom: 6px;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .quick-stats {
      grid-template-columns: 1fr;
    }

    .stat-item {
      justify-content: flex-start;
    }

    .profile-header-card {
      padding: 24px 16px;
    }
  }
</style>
