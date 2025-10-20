import { ref, computed } from 'vue'
import versionData from '../version.json'

export interface VersionInfo {
  version: string
  buildNumber: string
  buildDate: string
  gitSha?: string
  gitRef?: string
  platform?: string
  // Aliases para compatibilidade com CI
  gitCommit?: string
  gitBranch?: string
}

const version = ref<VersionInfo>(versionData as VersionInfo)

export function useVersion() {
  const shortVersion = computed(() => {
    // Retorna apenas a parte principal da versão (ex: v2025.10.17)
    return version.value.version.split('-')[0]
  })

  const shortSha = computed(() => {
    // Retorna os primeiros 7 caracteres do SHA (suporta gitSha ou gitCommit)
    const sha = version.value.gitSha || version.value.gitCommit || ''
    return sha.substring(0, 7)
  })

  const formattedBuildDate = computed(() => {
    // Formata a data de build de forma legível
    const date = new Date(version.value.buildDate)
    return date.toLocaleString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  })

  const fullVersionString = computed(() => {
    // Versão completa para exibição (ex: v2025.10.17-a1b2c3d #123)
    return `${version.value.version} #${version.value.buildNumber}`
  })

  const isProduction = computed(() => {
    return version.value.platform !== 'development' && version.value.platform !== 'local'
  })

  const isDevelopment = computed(() => {
    return version.value.platform === 'development' || version.value.platform === 'local'
  })

  return {
    version: version.value,
    shortVersion,
    shortSha,
    formattedBuildDate,
    fullVersionString,
    isProduction,
    isDevelopment,
  }
}

