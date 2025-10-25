/**
 * Composable para gerenciar versão do aplicativo
 * Integra com Firebase Firestore para buscar configuração de versão
 *
 * Baseado em: docs/features/prds/APP_UPDATE_NOTIFICATION_PRD.md
 */

import { ref, computed } from 'vue'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '@/firebase/config'
import type {
  VersionConfig,
  UseAppVersionOptions,
  VersionCheckResult,
} from '@/types/version'
import { VERSION_CONSTANTS } from '@/types/version'
import {
  isVersionOlder,
  isValidVersion,
  compareVersions,
  parseVersion,
} from '@/utils/versionComparison'

/**
 * Composable para gerenciar versão do app
 *
 * @param options Opções de configuração
 * @returns Métodos e estado reativo para verificação de versão
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * const { currentVersion, latestVersion, isOutdated, fetchVersionConfig } = useAppVersion()
 *
 * onMounted(() => {
 *   fetchVersionConfig()
 * })
 * </script>
 * ```
 */
export const useAppVersion = (options: UseAppVersionOptions = {}) => {
  // Opções com valores padrão (será usado para controle de cache/polls futuros)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  options.checkInterval ?? VERSION_CONSTANTS.CHECK_INTERVAL
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  options.dismissalDuration ?? VERSION_CONSTANTS.DISMISSAL_DURATION

  // Estado reativo
  const currentVersion = ref<string>(import.meta.env.VITE_APP_VERSION || '1.0.0')
  const latestVersion = ref<string | null>(null)
  const minimumVersion = ref<string | null>(null)
  const updateUrl = ref<string | null>(null)
  const changelog = ref<string[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const isCritical = ref(false)
  const releaseDate = ref<string | null>(null)

  // Computed properties
  const isOutdated = computed(() => {
    if (!latestVersion.value) return false
    if (!isValidVersion(currentVersion.value) || !isValidVersion(latestVersion.value)) {
      return false
    }
    return isVersionOlder(currentVersion.value, latestVersion.value)
  })

  const hasUpdateAvailable = computed(() => {
    if (!latestVersion.value) return false
    return isOutdated.value
  })

  const versionDifference = computed(() => {
    if (!latestVersion.value) return null
    return compareVersions(currentVersion.value, latestVersion.value)
  })

  /**
   * Busca configuração de versão do Firestore
   * Retorna objeto com currentVersion, latestVersion, updateUrl, etc
   */
  const fetchVersionConfig = async (): Promise<boolean> => {
    try {
      loading.value = true
      error.value = null

      // Referência para documento no Firestore
      const versionDocRef = doc(
        db,
        VERSION_CONSTANTS.FIRESTORE_COLLECTION,
        VERSION_CONSTANTS.FIRESTORE_DOC
      )

      // Buscar documento
      const docSnap = await getDoc(versionDocRef)

      if (!docSnap.exists()) {
        console.warn('⚠️ Documento app-config/version não encontrado no Firestore')
        error.value = 'Configuração de versão não disponível'
        return false
      }

      // Extrair dados
      const data = docSnap.data() as VersionConfig
      latestVersion.value = data.latestVersion
      minimumVersion.value = data.currentVersion
      updateUrl.value = data.updateUrl
      changelog.value = data.changelog || []
      isCritical.value = data.isCritical || false
      releaseDate.value = data.releaseDate || null

      console.log('✅ Versão obtida do Firestore:', {
        current: minimumVersion.value,
        latest: latestVersion.value,
        outdated: isOutdated.value,
      })

      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido'
      console.error('❌ Erro ao buscar versão:', message)
      error.value = message
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Comparação de versões semânticas (v1 < v2)
   * Usado internamente para verificar se há atualização
   */
  const compareVersionsInternal = (v1: string, v2: string): boolean => {
    if (!isValidVersion(v1) || !isValidVersion(v2)) {
      return false
    }

    const parsed1 = parseVersion(v1)
    const parsed2 = parseVersion(v2)

    if (!parsed1 || !parsed2) return false

    const [maj1, min1, pat1] = parsed1
    const [maj2, min2, pat2] = parsed2

    if (maj1 !== maj2) return maj1 < maj2
    if (min1 !== min2) return min1 < min2
    return pat1 < pat2
  }

  /**
   * Abre link do Play Store para atualizar
   * Redireciona para Google Play Store ou abre link em nova aba
   */
  const openPlayStore = (): void => {
    if (!updateUrl.value) {
      console.warn('⚠️ URL de atualização não disponível')
      return
    }

    try {
      // Tenta abrir em nova aba (web)
      if (typeof window !== 'undefined') {
        window.open(updateUrl.value, '_blank', 'noopener,noreferrer')
      }

      // Em Capacitor/Android, pode tentar abrir via plugin
      // TODO: Integrar com plugin Capacitor Browser quando necessário
    } catch (err) {
      console.error('❌ Erro ao abrir Play Store:', err)
      error.value = 'Não foi possível abrir Play Store'
    }
  }

  /**
   * Obtém resultado completo da verificação de versão
   */
  const getCheckResult = (): VersionCheckResult => {
    return {
      hasUpdate: hasUpdateAvailable.value,
      isOutdated: isOutdated.value,
      currentVersion: currentVersion.value,
      latestVersion: latestVersion.value || 'desconhecida',
      changelog: changelog.value,
      updateUrl: updateUrl.value || '',
      isCritical: isCritical.value,
    }
  }

  /**
   * Reseta estado de erro
   */
  const clearError = (): void => {
    error.value = null
  }

  /**
   * Força nova verificação (ignora cache)
   */
  const forceCheck = async (): Promise<boolean> => {
    clearError()
    return fetchVersionConfig()
  }

  return {
    // State
    currentVersion,
    latestVersion,
    minimumVersion,
    updateUrl,
    changelog,
    loading,
    error,
    isCritical,
    releaseDate,

    // Computed
    isOutdated,
    hasUpdateAvailable,
    versionDifference,

    // Methods
    fetchVersionConfig,
    compareVersionsInternal,
    openPlayStore,
    getCheckResult,
    clearError,
    forceCheck,
  }
}
