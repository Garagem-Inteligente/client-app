/**
 * Pinia Store para gerenciar estado de versão do app
 *
 * Responsabilidades:
 * - Manter estado de dismissal (quando usuário dismissar o banner)
 * - Rastrear última vez que foi verificado
 * - Controlar se deve forçar nova verificação
 * - Integrar com composable useAppVersion
 *
 * Baseado em: docs/features/prds/APP_UPDATE_NOTIFICATION_PRD.md
 */

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useAppVersion } from '@/composables/useAppVersion'
import { VERSION_CONSTANTS } from '@/types/version'

export const useAppVersionStore = defineStore('appVersion', () => {
  // Instância do composable
  const versionComposable = useAppVersion()

  // Estado reativo
  const dismissedUntil = ref<number | null>(null) // Timestamp até quando dismissar
  const lastCheckTime = ref<number | null>(null) // Última vez que verificou
  const forceCheckFlag = ref(false) // Flag para forçar nova verificação
  const hasNotified = ref(false) // Se já notificou o usuário nesta sessão
  const isCheckingVersion = ref(false) // Se está verificando agora

  /**
   * Computed property: O banner deve estar dismissido?
   * Retorna true se:
   * - Usuário dismissiu E
   * - O tempo de dismissal ainda não expirou
   */
  const isBannerDismissed = computed(() => {
    if (!dismissedUntil.value) return false
    const now = Date.now()
    return now < dismissedUntil.value
  })

  /**
   * Computed property: Devemos verificar versão?
   * Retorna true se:
   * - Primeira verificação (lastCheckTime é null) OU
   * - Passou 24h desde última verificação OU
   * - Flag de forçar foi ativada
   */
  const shouldCheckVersion = computed(() => {
    if (forceCheckFlag.value) return true
    if (!lastCheckTime.value) return true

    const now = Date.now()
    const timeSinceLastCheck = now - lastCheckTime.value
    return timeSinceLastCheck >= VERSION_CONSTANTS.CHECK_INTERVAL
  })

  /**
   * Computed property: Há uma atualização disponível?
   */
  const hasUpdateAvailable = computed(() => {
    return versionComposable.hasUpdateAvailable.value && !isBannerDismissed.value
  })

  /**
   * Inicializa verificação de versão
   * Deve ser chamado ao iniciar a app (em App.vue onMounted)
   */
  const initVersionCheck = async (): Promise<void> => {
    // Se já está verificando, não faz nada
    if (isCheckingVersion.value) return

    // Se não precisa verificar e já notificou, não faz nada
    if (!shouldCheckVersion.value && hasNotified.value) {
      return
    }

    try {
      isCheckingVersion.value = true

      // Buscar configuração do Firestore
      const success = await versionComposable.fetchVersionConfig()

      if (!success) {
        console.warn('⚠️ Falha ao verificar versão')
        return
      }

      // Atualizar último tempo de verificação
      lastCheckTime.value = Date.now()

      // Se há atualização e é crítica, mostrar banner
      if (versionComposable.isOutdated.value) {
        hasNotified.value = true
        console.log('📦 Atualização disponível:', {
          current: versionComposable.currentVersion.value,
          latest: versionComposable.latestVersion.value,
          critical: versionComposable.isCritical.value,
        })
      }

      // Resetar flag de forçar verificação
      forceCheckFlag.value = false
    } finally {
      isCheckingVersion.value = false
    }
  }

  /**
   * Dismissar banner por período definido
   * Usuário pode ver novamente após VERSION_CONSTANTS.DISMISSAL_DURATION
   */
  const dismissBanner = (): void => {
    const now = Date.now()
    dismissedUntil.value = now + VERSION_CONSTANTS.DISMISSAL_DURATION

    console.log('✋ Banner dismissido até:', new Date(dismissedUntil.value))
  }

  /**
   * Forçar nova verificação
   * Ignora o tempo desde última verificação
   */
  const forceCheck = async (): Promise<void> => {
    forceCheckFlag.value = true
    dismissedUntil.value = null // Remove dismissal
    await initVersionCheck()
  }

  /**
   * Abrir Play Store para atualizar
   */
  const openUpdateLink = (): void => {
    versionComposable.openPlayStore()
  }

  /**
   * Resetar estado (útil para testes)
   */
  const reset = (): void => {
    dismissedUntil.value = null
    lastCheckTime.value = null
    forceCheckFlag.value = false
    hasNotified.value = false
    isCheckingVersion.value = false
    versionComposable.clearError()
  }

  /**
   * Limpar error
   */
  const clearError = (): void => {
    versionComposable.clearError()
  }

  return {
    // State (via composable)
    currentVersion: versionComposable.currentVersion,
    latestVersion: versionComposable.latestVersion,
    updateUrl: versionComposable.updateUrl,
    changelog: versionComposable.changelog,
    loading: versionComposable.loading,
    error: versionComposable.error,
    isCritical: versionComposable.isCritical,
    releaseDate: versionComposable.releaseDate,

    // Store-specific state
    dismissedUntil,
    lastCheckTime,
    forceCheckFlag,
    hasNotified,
    isCheckingVersion,

    // Computed
    isBannerDismissed,
    shouldCheckVersion,
    hasUpdateAvailable,
    isOutdated: versionComposable.isOutdated,
    versionDifference: versionComposable.versionDifference,

    // Methods
    initVersionCheck,
    dismissBanner,
    forceCheck,
    openUpdateLink,
    reset,
    clearError,
  }
})
