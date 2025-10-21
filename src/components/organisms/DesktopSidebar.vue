<template>
  <div class="desktop-sidebar">
    <!-- Logo -->
    <div class="sidebar-header">
      <div class="app-logo">
        <ion-icon :icon="carSportOutline"></ion-icon>
        <span class="app-name">Garagem<br />Inteligente</span>
      </div>
    </div>

    <!-- Navigation Links -->
    <nav class="sidebar-nav">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        active-class="nav-item-active"
      >
        <ion-icon :icon="item.icon"></ion-icon>
        <span>{{ item.label }}</span>
        <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
      </router-link>
    </nav>

    <!-- User Section -->
    <div class="sidebar-footer">
      <div class="user-profile">
        <div class="user-avatar">
          <img
            v-if="authStore.user?.avatar"
            :src="authStore.user.avatar"
            :alt="authStore.userName"
          />
          <ion-icon v-else :icon="personCircleOutline"></ion-icon>
        </div>
        <div class="user-info">
          <p class="user-name">{{ authStore.userName }}</p>
          <p class="user-email">{{ authStore.userEmail }}</p>
        </div>
      </div>
      <button class="logout-btn" @click="handleLogout">
        <ion-icon :icon="logOutOutline"></ion-icon>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/auth';
  import { useVehiclesStore } from '@/stores/vehicles';
  import { IonIcon } from '@ionic/vue';
  import {
    homeOutline,
    carOutline,
    constructOutline,
    personOutline,
    carSportOutline,
    logOutOutline,
    personCircleOutline,
  } from 'ionicons/icons';

  const router = useRouter();
  const authStore = useAuthStore();
  const vehiclesStore = useVehiclesStore();

  const navItems = computed(() => [
    {
      path: '/tabs/home',
      icon: homeOutline,
      label: 'Início',
    },
    {
      path: '/tabs/vehicles',
      icon: carOutline,
      label: 'Veículos',
      badge: vehiclesStore.vehicleCount || null,
    },
    {
      path: '/tabs/maintenance',
      icon: constructOutline,
      label: 'Manutenções',
    },
    {
      path: '/tabs/profile',
      icon: personOutline,
      label: 'Perfil',
    },
  ]);

  const handleLogout = async () => {
    await authStore.logout();
    router.push('/login');
  };
</script>

<style scoped>
  .desktop-sidebar {
    display: none;
  }

  @media (min-width: 1024px) {
    .desktop-sidebar {
      display: flex;
      flex-direction: column;
      position: fixed;
      left: 0;
      top: 0;
      height: 100vh;
      width: 280px;
      background: linear-gradient(180deg, rgba(31, 41, 55, 0.95) 0%, rgba(17, 24, 39, 0.98) 100%);
      backdrop-filter: blur(10px);
      border-right: 1px solid rgba(255, 255, 255, 0.1);
      padding: 24px;
      z-index: 999;
      overflow-y: auto;
    }

    /* Scrollbar */
    .desktop-sidebar::-webkit-scrollbar {
      width: 4px;
    }

    .desktop-sidebar::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 2px;
    }
  }

  /* Header */
  .sidebar-header {
    margin-bottom: 32px;
    padding-bottom: 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .app-logo {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .app-logo ion-icon {
    font-size: 40px;
    color: #3b82f6;
  }

  .app-name {
    font-size: 18px;
    font-weight: 700;
    color: white;
    line-height: 1.2;
  }

  /* Navigation */
  .sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 12px;
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    font-size: 15px;
    font-weight: 500;
    transition: all 0.2s ease;
    position: relative;
  }

  .nav-item ion-icon {
    font-size: 22px;
    flex-shrink: 0;
  }

  .nav-item span {
    flex: 1;
  }

  .nav-badge {
    background: #3b82f6;
    color: white;
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 12px;
    font-weight: 600;
  }

  .nav-item:hover {
    background: rgba(255, 255, 255, 0.05);
    color: white;
  }

  .nav-item-active {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  .nav-item-active ion-icon {
    color: white;
  }

  /* Footer */
  .sidebar-footer {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-top: 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    margin-top: auto;
  }

  .user-profile {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    min-width: 0;
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .user-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .user-avatar ion-icon {
    font-size: 32px;
    color: rgba(255, 255, 255, 0.5);
  }

  .user-info {
    min-width: 0;
    flex: 1;
  }

  .user-name {
    font-size: 14px;
    font-weight: 600;
    color: white;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .user-email {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .logout-btn {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    color: #ef4444;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  .logout-btn ion-icon {
    font-size: 20px;
  }

  .logout-btn:hover {
    background: rgba(239, 68, 68, 0.2);
    transform: translateY(-2px);
  }
</style>
