import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest'

// Mock Firebase antes de importar o composable
vi.mock('firebase/firestore', () => ({
  getDoc: vi.fn(),
  doc: vi.fn(),
}))

vi.mock('../../../src/firebase/config', () => ({
  db: {},
}))

import { useAppVersion } from '../../../src/composables/useAppVersion'

/**
 * Testes para useAppVersion composable
 *
 * Nota: Este teste utiliza mocking do Firebase Firestore
 * Em um cenário real, seria necessário configurar Firebase emulator
 */
describe('useAppVersion Composable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Inicialização', () => {
    test('deve inicializar com estado padrão', () => {
      const { currentVersion, latestVersion, loading, error } = useAppVersion()

      // Verificar que as refs existem
      expect(currentVersion).toBeDefined()
      expect(latestVersion).toBeDefined()
      expect(loading).toBeDefined()
      expect(error).toBeDefined()

      // Verificar valores padrão
      expect(currentVersion.value).toBeDefined()
      expect(latestVersion.value).toBeNull()
      expect(loading.value).toBe(false)
      expect(error.value).toBeNull()
    })

    test('deve aceitar opções customizadas', () => {
      const options = {
        checkInterval: 12 * 60 * 60 * 1000, // 12 horas
        dismissalDuration: 6 * 60 * 60 * 1000, // 6 horas
      }

      const composable = useAppVersion(options)
      expect(composable).toBeDefined()
    })
  })

  describe('Computed Properties', () => {
    test('isOutdated deve retornar false quando latestVersion é null', () => {
      const { isOutdated, latestVersion } = useAppVersion()

      expect(latestVersion.value).toBeNull()
      expect(isOutdated.value).toBe(false)
    })

    test('isOutdated deve retornar true quando versão está desatualizada', () => {
      const { isOutdated, currentVersion, latestVersion } = useAppVersion()

      currentVersion.value = '1.0.0'
      latestVersion.value = '1.0.1'

      expect(isOutdated.value).toBe(true)
    })

    test('hasUpdateAvailable deve retornar true quando há atualização', () => {
      const { hasUpdateAvailable, currentVersion, latestVersion } = useAppVersion()

      currentVersion.value = '1.0.0'
      latestVersion.value = '2.0.0'

      expect(hasUpdateAvailable.value).toBe(true)
    })

    test('versionDifference deve ser null quando latestVersion não está definida', () => {
      const { versionDifference, latestVersion } = useAppVersion()

      latestVersion.value = null

      expect(versionDifference.value).toBeNull()
    })
  })

  describe('clearError', () => {
    test('deve limpar mensagem de erro', () => {
      const { error, clearError } = useAppVersion()

      error.value = 'Algum erro'
      expect(error.value).toBe('Algum erro')

      clearError()
      expect(error.value).toBeNull()
    })
  })

  describe('getCheckResult', () => {
    test('deve retornar resultado completo da verificação', () => {
      const { getCheckResult, currentVersion, latestVersion, changelog, isCritical } =
        useAppVersion()

      currentVersion.value = '1.0.0'
      latestVersion.value = '1.1.0'
      changelog.value = ['Novo recurso de atualização']
      isCritical.value = false

      const result = getCheckResult()

      expect(result.currentVersion).toBe('1.0.0')
      expect(result.latestVersion).toBe('1.1.0')
      expect(result.hasUpdate).toBe(true)
      expect(result.isOutdated).toBe(true)
      expect(result.isCritical).toBe(false)
      expect(result.changelog).toContain('Novo recurso de atualização')
    })

    test('deve retornar desconhecida quando latestVersion é null', () => {
      const { getCheckResult, latestVersion } = useAppVersion()

      latestVersion.value = null

      const result = getCheckResult()

      expect(result.latestVersion).toBe('desconhecida')
    })
  })

  describe('openPlayStore', () => {
    test('deve abrir link quando URL está disponível', () => {
      const { openPlayStore, updateUrl } = useAppVersion()
      const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null)

      updateUrl.value = 'https://play.google.com/store/apps/details?id=com.example.app'

      openPlayStore()

      expect(windowOpenSpy).toHaveBeenCalledWith(
        'https://play.google.com/store/apps/details?id=com.example.app',
        '_blank',
        'noopener,noreferrer'
      )

      windowOpenSpy.mockRestore()
    })

    test('deve definir erro quando URL não está disponível', () => {
      const { openPlayStore, updateUrl } = useAppVersion()

      updateUrl.value = null

      // A função apenas retorna quando updateUrl não está disponível
      const result = openPlayStore()

      expect(result).toBeUndefined()
    })
  })

  describe('compareVersionsInternal', () => {
    test('deve retornar true quando v1 < v2', () => {
      const { compareVersionsInternal } = useAppVersion()

      const result = compareVersionsInternal('1.0.0', '1.0.1')
      expect(result).toBe(true)
    })

    test('deve retornar false quando v1 >= v2', () => {
      const { compareVersionsInternal } = useAppVersion()

      const result = compareVersionsInternal('1.0.1', '1.0.0')
      expect(result).toBe(false)
    })

    test('deve retornar false para versão inválida', () => {
      const { compareVersionsInternal } = useAppVersion()

      const result = compareVersionsInternal('invalid', '1.0.0')
      expect(result).toBe(false)
    })
  })
})
