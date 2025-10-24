<template>
  <div class="profile-header-card">
    <div class="profile-header-content">
      <!-- Avatar Section -->
      <div class="avatar-section">
        <div class="avatar-wrapper" @click="$emit('photoClick')">
          <div class="avatar-container">
            <img
              v-if="currentPhotoUrl && !photoLoadError"
              :src="currentPhotoUrl"
              alt="Foto do perfil"
              class="avatar-image"
              @error="$emit('photoError')"
              @load="$emit('photoLoad')"
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
          <h1 class="user-name">{{ userName }}</h1>
          <p class="user-email">{{ userEmail }}</p>
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
            <span class="stat-value">{{ vehiclesCount }}</span>
            <span class="stat-label">Veículos</span>
          </div>
        </div>

        <div class="stat-item">
          <div class="stat-icon stat-success">
            <ion-icon :icon="constructOutline"></ion-icon>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ maintenanceCount }}</span>
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
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import {
  personOutline,
  cameraOutline,
  shieldCheckmarkOutline,
  logoGoogle,
  carOutline,
  constructOutline,
  timeOutline,
} from 'ionicons/icons'

interface Props {
  userName: string
  userEmail: string
  currentPhotoUrl: string
  photoLoadError: boolean
  hasGoogleProvider: boolean
  vehiclesCount: number
  maintenanceCount: number
  upcomingMaintenanceCount: number
}

defineProps<Props>()

defineEmits<{
  photoClick: []
  photoError: []
  photoLoad: []
}>()
</script>

<style scoped lang="scss">
/* ====================================
   PROFILE HEADER CARD - RSCSS
   ==================================== */

.profile-header-card {
  background: var(--bg-card);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid var(--border-card);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* ====================================
   PROFILE HEADER CONTENT
   ==================================== */

.profile-header-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ====================================
   AVATAR SECTION
   ==================================== */

.avatar-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar-wrapper {
  position: relative;
  cursor: pointer;
  border-radius: 50%;
  overflow: hidden;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
}

.avatar-container {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-icon {
  font-size: 32px;
  color: var(--primary-contrast);
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.avatar-wrapper:hover .avatar-overlay {
  opacity: 1;
}

.camera-icon {
  font-size: 20px;
  color: white;
  margin-bottom: 4px;
}

.overlay-text {
  font-size: 10px;
  color: white;
  font-weight: 500;
  text-align: center;
}

/* ====================================
   USER INFO SECTION
   ==================================== */

.user-info-section {
  flex: 1;
}

.user-name {
  font-size: 24px;
  font-weight: 700;
  color: var(--ion-text-color);
  margin: 0 0 4px 0;
}

.user-email {
  font-size: 16px;
  color: var(--text-secondary);
  margin: 0 0 12px 0;
}

/* ====================================
   USER BADGES
   ==================================== */

.user-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;

  ion-icon {
    font-size: 14px;
  }
}

.badge-primary {
  background: rgba(var(--primary-rgb), 0.1);
  color: var(--primary-600);
  border: 1px solid rgba(var(--primary-rgb), 0.2);
}

.badge-success {
  background: rgba(var(--success-rgb), 0.1);
  color: var(--success-600);
  border: 1px solid rgba(var(--success-rgb), 0.2);
}

/* ====================================
   QUICK STATS
   ==================================== */

.quick-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--bg-input);
  border: 1px solid var(--border-input);
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    background: var(--bg-hover);
    transform: translateY(-1px);
  }
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  ion-icon {
    font-size: 20px;
    color: white;
  }
}

.stat-primary {
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
}

.stat-success {
  background: linear-gradient(135deg, var(--success-500), var(--success-600));
}

.stat-warning {
  background: linear-gradient(135deg, var(--warning-500), var(--warning-600));
}

.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-value {
  display: block;
  font-size: 18px;
  font-weight: 700;
  color: var(--ion-text-color);
  line-height: 1;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 2px;
}

/* ====================================
   RESPONSIVE DESIGN
   ==================================== */

@media (max-width: 480px) {
  .profile-header-card {
    padding: 16px;
  }

  .avatar-section {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .user-name {
    font-size: 20px;
  }

  .quick-stats {
    grid-template-columns: 1fr;
  }

  .stat-item {
    justify-content: flex-start;
  }
}
</style>