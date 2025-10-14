<template>
  <Container>
    <div class="max-w-4xl mx-auto py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold">Notificações</h1>
        <div class="flex gap-2">
          <button
            v-if="unreadCount > 0"
            @click="markAllAsRead"
            class="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            Marcar todas como lidas
          </button>
          <button
            @click="refresh"
            :disabled="loading"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
            title="Atualizar notificações"
          >
            <svg class="w-5 h-5" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Filtros -->
      <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          v-for="filter in filters"
          :key="filter.value"
          @click="activeFilter = filter.value"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
            activeFilter === filter.value
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          ]"
        >
          {{ filter.label }}
          <span v-if="filter.count > 0" class="ml-2 px-2 py-0.5 rounded-full text-xs bg-white/20">
            {{ filter.count }}
          </span>
        </button>
      </div>

      <!-- Lista de Notificações -->
      <div v-if="loading && notifications.length === 0" class="space-y-4">
        <div v-for="i in 3" :key="i" class="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg h-24" />
      </div>

      <div v-else-if="filteredNotifications.length === 0" class="text-center py-12">
        <div class="w-16 h-16 mx-auto mb-4 text-gray-400">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <p class="text-lg font-medium text-gray-900 dark:text-gray-100">Nenhuma notificação</p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {{ activeFilter === 'all' ? 'Você não tem notificações' : 'Nenhuma notificação nesta categoria' }}
        </p>
      </div>

      <div v-else class="space-y-2">
        <TransitionGroup name="list">
          <div
            v-for="notification in filteredNotifications"
            :key="notification.id"
            @click="markAsRead(notification.id)"
            :class="[
              'p-4 rounded-lg border transition-all cursor-pointer',
              notification.read
                ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
            ]"
          >
            <div class="flex items-start gap-4">
              <!-- Ícone -->
              <div
                :class="[
                  'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
                  getNotificationStyle(notification.type).bg
                ]"
              >
                <svg class="w-5 h-5" :class="getNotificationStyle(notification.type).text" fill="currentColor" viewBox="0 0 20 20">
                  <path :d="getNotificationIcon(notification.type)" />
                </svg>
              </div>

              <!-- Conteúdo -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <h3 class="font-semibold text-gray-900 dark:text-gray-100">
                    {{ notification.title }}
                  </h3>
                  <span class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {{ formatDate(notification.createdAt) }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {{ notification.message }}
                </p>
                
                <!-- Badge de tipo -->
                <div class="flex items-center gap-2 mt-2">
                  <span
                    :class="[
                      'text-xs px-2 py-1 rounded-full font-medium',
                      getNotificationStyle(notification.type).badge
                    ]"
                  >
                    {{ getNotificationTypeLabel(notification.type) }}
                  </span>
                  <span v-if="!notification.read" class="w-2 h-2 rounded-full bg-blue-600" />
                </div>

                <!-- Ações (se houver) -->
                <div v-if="notification.actionUrl" class="mt-3">
                  <router-link
                    :to="notification.actionUrl"
                    class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    @click.stop
                  >
                    {{ notification.actionLabel || 'Ver detalhes' }} →
                  </router-link>
                </div>
              </div>

              <!-- Botão de excluir -->
              <button
                @click.stop="deleteNotification(notification.id)"
                class="flex-shrink-0 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Excluir notificação"
              >
                <svg class="w-5 h-5 text-gray-400 hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>
  </Container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useNotificationStore, type NotificationType } from '@/stores/notifications'
import Container from '@/components/Container.vue'

const notificationStore = useNotificationStore()

const activeFilter = ref<'all' | NotificationType>('all')
const loading = ref(false)

const notifications = computed(() => notificationStore.notifications)
const unreadCount = computed(() => notificationStore.unreadCount)

const filteredNotifications = computed(() => {
  if (activeFilter.value === 'all') {
    return notifications.value
  }
  return notifications.value.filter(n => n.type === activeFilter.value)
})

const filters = computed(() => [
  { label: 'Todas', value: 'all' as const, count: notifications.value.length },
  { label: 'Manutenção', value: 'maintenance' as NotificationType, count: notifications.value.filter(n => n.type === 'maintenance').length },
  { label: 'Transferência', value: 'transfer' as NotificationType, count: notifications.value.filter(n => n.type === 'transfer').length },
  { label: 'Seguro', value: 'insurance' as NotificationType, count: notifications.value.filter(n => n.type === 'insurance').length },
  { label: 'Sistema', value: 'system' as NotificationType, count: notifications.value.filter(n => n.type === 'system').length }
])

onMounted(async () => {
  loading.value = true
  try {
    await notificationStore.fetchNotifications()
  } finally {
    loading.value = false
  }
})

const refresh = async () => {
  loading.value = true
  try {
    await notificationStore.fetchNotifications()
  } finally {
    loading.value = false
  }
}

const markAsRead = async (id: string) => {
  await notificationStore.markAsRead(id)
}

const markAllAsRead = async () => {
  await notificationStore.markAllAsRead()
}

const deleteNotification = async (id: string) => {
  if (confirm('Deseja excluir esta notificação?')) {
    await notificationStore.deleteNotification(id)
  }
}

const formatDate = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Agora'
  if (minutes < 60) return `${minutes}m atrás`
  if (hours < 24) return `${hours}h atrás`
  if (days < 7) return `${days}d atrás`

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const getNotificationTypeLabel = (type: NotificationType) => {
  const labels = {
    maintenance: 'Manutenção',
    transfer: 'Transferência',
    insurance: 'Seguro',
    system: 'Sistema'
  }
  return labels[type]
}

const getNotificationStyle = (type: NotificationType) => {
  const styles = {
    maintenance: {
      bg: 'bg-orange-100 dark:bg-orange-900/20',
      text: 'text-orange-600 dark:text-orange-400',
      badge: 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
    },
    transfer: {
      bg: 'bg-blue-100 dark:bg-blue-900/20',
      text: 'text-blue-600 dark:text-blue-400',
      badge: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
    },
    insurance: {
      bg: 'bg-purple-100 dark:bg-purple-900/20',
      text: 'text-purple-600 dark:text-purple-400',
      badge: 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
    },
    system: {
      bg: 'bg-gray-100 dark:bg-gray-800',
      text: 'text-gray-600 dark:text-gray-400',
      badge: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
    }
  }
  return styles[type]
}

const getNotificationIcon = (type: NotificationType) => {
  const icons = {
    maintenance: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 10a3 3 0 11-6 0 3 3 0 016 0z',
    transfer: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
    insurance: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    system: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  }
  return icons[type]
}
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
