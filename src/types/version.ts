/**
 * Tipos para o sistema de notificação de atualização de versão
 * Baseado em: docs/features/prds/APP_UPDATE_NOTIFICATION_PRD.md
 */

/**
 * Configuração de versão do aplicativo
 * Documento Firestore: app-config/version
 */
export interface VersionConfig {
  // Versões (semantic versioning)
  currentVersion: string // "1.0.0" - Versão mínima suportada
  latestVersion: string // "1.0.1" - Versão recomendada/mais recente

  // URLs e Links
  updateUrl: string // Link para Play Store ou App Store

  // Changelog e informações
  changelog?: string[] // ["Correção de bugs", "Nova funcionalidade"]
  releaseDate?: string | null // ISO 8601 timestamp

  // Flags de controle
  isCritical?: boolean // Se é atualização obrigatória (futuro v1.1)

  // Metadados administrativos
  createdAt?: string | null // Timestamp de criação
  updatedAt?: string | null // Timestamp de última atualização
  updatedBy?: string // Email do admin que atualizou
}

/**
 * Estado da verificação de versão (Store)
 * Gerenciado pelo Pinia store
 */
export interface AppVersionState {
  // Versões
  currentVersion: string // Versão local do app
  latestVersion: string | null // Versão mais recente (do Firestore)
  minimumVersion: string | null // Versão mínima suportada (do Firestore)

  // URLs
  updateUrl: string | null // Link para atualização

  // Changelog
  changelog: string[] // Lista de mudanças

  // Estados de carregamento e erro
  loading: boolean // Se está verificando versão
  error: string | null // Mensagem de erro (se houver)

  // Controle de dismissão (localStorage)
  dismissedUntil: number | null // Timestamp até quando banner está dismissido (ms)
  lastCheckTime: number | null // Timestamp da última verificação (ms)

  // Flags de controle
  isCritical: boolean // Se é atualização crítica/obrigatória
  forceCheckFlag: boolean // Flag interna para forçar nova verificação
}

/**
 * Opções de configuração para useAppVersion composable
 */
export interface UseAppVersionOptions {
  checkInterval?: number // Intervalo entre verificações (ms) - padrão: 24h
  dismissalDuration?: number // Tempo de dismissão do banner (ms) - padrão: 12h
}

/**
 * Resposta da verificação de versão
 */
export interface VersionCheckResult {
  hasUpdate: boolean // Se há atualização disponível
  isOutdated: boolean // Se versão local está desatualizada
  currentVersion: string // Versão local
  latestVersion: string // Versão mais recente
  changelog: string[] // O que mudou
  updateUrl: string // Onde atualizar
  isCritical: boolean // Se é crítica
}

/**
 * Resultado da comparação de versões
 */
export interface VersionComparisonResult {
  isOlder: boolean // v1 < v2
  isNewer: boolean // v1 > v2
  isEqual: boolean // v1 === v2
  major: number // Mudança major
  minor: number // Mudança minor
  patch: number // Mudança patch
}

/**
 * Props do componente UpdateBanner
 */
export interface UpdateBannerProps {
  // Pode ser um componente controlado pelo store diretamente
  // ou recebenecessários dados via props
}

/**
 * Emits do componente UpdateBanner
 */
export interface UpdateBannerEmits {
  update: [] // Usuário clicou em "Atualizar Agora"
  dismiss: [] // Usuário clicou em "Depois"
  close: [] // Usuário clicou em close (✕)
}

/**
 * Constantes para versionamento
 */
export const VERSION_CONSTANTS = {
  // Intervalo padrão entre verificações (24 horas em ms)
  CHECK_INTERVAL: 24 * 60 * 60 * 1000,

  // Duração de dismissão do banner (12 horas em ms)
  DISMISSAL_DURATION: 12 * 60 * 60 * 1000,

  // Storage keys
  LAST_CHECK_TIME_KEY: 'app_version_last_check',
  DISMISSED_UNTIL_KEY: 'app_version_dismissed_until',

  // Firestore collection e documento
  FIRESTORE_COLLECTION: 'app-config',
  FIRESTORE_DOC: 'version',

  // Play Store URL base
  PLAY_STORE_BASE_URL: 'https://play.google.com/store/apps/details?id=',
  ANDROID_PACKAGE_ID: 'com.garagem.inteligente',
} as const

/**
 * Utilitários de tipo para validação
 */
export const isVersionConfig = (value: unknown): value is VersionConfig => {
  if (typeof value !== 'object' || value === null) return false

  const config = value as Record<string, unknown>
  return (
    typeof config.currentVersion === 'string' &&
    typeof config.latestVersion === 'string' &&
    typeof config.updateUrl === 'string'
  )
}

export const isVersionCheckResult = (value: unknown): value is VersionCheckResult => {
  if (typeof value !== 'object' || value === null) return false

  const result = value as Record<string, unknown>
  return (
    typeof result.hasUpdate === 'boolean' &&
    typeof result.isOutdated === 'boolean' &&
    typeof result.currentVersion === 'string' &&
    typeof result.latestVersion === 'string' &&
    Array.isArray(result.changelog) &&
    typeof result.updateUrl === 'string'
  )
}
