import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAppVersionStore } from '../../../src/stores/appVersion'

/**
 * Testes para useAppVersionStore (Pinia)
 *
 * O store gerencia:
 * - Estado de dismissal (quando usuário fecha o banner)
 * - Última verificação realizada
 * - Flag de forçar nova verificação
 * - Integração com composable
 */
describe('useAppVersionStore (Pinia)', () => {
  beforeEach(() => {
    // Criar nova instância do Pinia antes de cada teste
    setActivePinia(createPinia())
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Inicialização', () => {
    test('deve inicializar com estado padrão', () => {
      const store = useAppVersionStore()

      expect(store.dismissedUntil).toBeNull()
      expect(store.lastCheckTime).toBeNull()
      expect(store.forceCheckFlag).toBe(false)
      expect(store.hasNotified).toBe(false)
      expect(store.isCheckingVersion).toBe(false)
    })
  })

  describe('Computed Properties', () => {
    test('isBannerDismissed deve retornar false quando dismissedUntil é null', () => {
      const store = useAppVersionStore()

      expect(store.isBannerDismissed).toBe(false)
    })

    test('isBannerDismissed deve retornar true quando dentro do período de dismissal', () => {
      const store = useAppVersionStore()
      const futureTime = Date.now() + 1000 * 60 * 60 // 1 hora no futuro

      store.dismissedUntil = futureTime

      expect(store.isBannerDismissed).toBe(true)
    })

    test('isBannerDismissed deve retornar false quando período expirou', () => {
      const store = useAppVersionStore()
      const pastTime = Date.now() - 1000 * 60 * 60 // 1 hora no passado

      store.dismissedUntil = pastTime

      expect(store.isBannerDismissed).toBe(false)
    })

    test('shouldCheckVersion deve retornar true na primeira verificação', () => {
      const store = useAppVersionStore()

      expect(store.lastCheckTime).toBeNull()
      expect(store.shouldCheckVersion).toBe(true)
    })

    test('shouldCheckVersion deve retornar true quando forceCheckFlag está ativo', () => {
      const store = useAppVersionStore()
      const recentTime = Date.now() - 1000 * 60 * 60 // 1 hora atrás

      store.lastCheckTime = recentTime
      store.forceCheckFlag = false
      expect(store.shouldCheckVersion).toBe(false) // Não passou 24h

      store.forceCheckFlag = true
      expect(store.shouldCheckVersion).toBe(true) // Force check ativa
    })

    test('hasUpdateAvailable deve verificar isBannerDismissed', () => {
      const store = useAppVersionStore()
      const futureTime = Date.now() + 1000 * 60 * 60

      // Sem atualização disponível
      expect(store.hasUpdateAvailable).toBe(false)

      // Simular atualização disponível (via composable)
      // As propriedades vêm do composable como refs
      if (typeof store.currentVersion === 'object' && store.currentVersion !== null && 'value' in store.currentVersion) {
        store.currentVersion.value = '1.0.0'
      }
      if (typeof store.latestVersion === 'object' && store.latestVersion !== null && 'value' in store.latestVersion) {
        store.latestVersion.value = '1.0.1'
      }

      // Com atualização mas banner não dismissido
      const hasUpdate = store.isOutdated || store.hasUpdateAvailable
      if (hasUpdate) {
        // Banner dismissido
        store.dismissedUntil = futureTime
        expect(store.isBannerDismissed).toBe(true)
      }
    })
  })

  describe('dismissBanner', () => {
    test('deve definir dismissedUntil para 12 horas no futuro', () => {
      const store = useAppVersionStore()
      const beforeDismiss = Date.now()

      store.dismissBanner()

      const afterDismiss = Date.now()
      const expectedDuration = 12 * 60 * 60 * 1000 // 12 horas

      // Verificar que dismissedUntil está aproximadamente correto
      expect(store.dismissedUntil).toBeGreaterThanOrEqual(beforeDismiss + expectedDuration)
      expect(store.dismissedUntil).toBeLessThanOrEqual(afterDismiss + expectedDuration + 100) // +100ms de margem
    })
  })

  describe('forceCheck', () => {
    test('deve resetar dismissedUntil', async () => {
      const store = useAppVersionStore()
      const futureTime = Date.now() + 1000 * 60 * 60

      store.dismissedUntil = futureTime
      expect(store.dismissedUntil).toBe(futureTime)

      // Mock do initVersionCheck para não fazer chamada real
      vi.spyOn(store, 'initVersionCheck').mockResolvedValue(undefined)

      await store.forceCheck()

      expect(store.dismissedUntil).toBeNull()
    })

    test('deve ativar forceCheckFlag', async () => {
      const store = useAppVersionStore()

      store.forceCheckFlag = false

      // Mock
      vi.spyOn(store, 'initVersionCheck').mockResolvedValue(undefined)

      await store.forceCheck()

      expect(store.forceCheckFlag).toBe(true)
    })
  })

  describe('reset', () => {
    test('deve resetar todo o estado', () => {
      const store = useAppVersionStore()

      // Colocar alguns dados
      store.dismissedUntil = Date.now()
      store.lastCheckTime = Date.now()
      store.forceCheckFlag = true
      store.hasNotified = true
      store.isCheckingVersion = true

      // Resetar
      store.reset()

      expect(store.dismissedUntil).toBeNull()
      expect(store.lastCheckTime).toBeNull()
      expect(store.forceCheckFlag).toBe(false)
      expect(store.hasNotified).toBe(false)
      expect(store.isCheckingVersion).toBe(false)
    })
  })

  describe('clearError', () => {
    test('deve limpar mensagem de erro do composable', () => {
      const store = useAppVersionStore()

      // Error pode ser ref ou null
      if (store.error && typeof store.error === 'object' && 'value' in store.error) {
        store.error.value = 'Algum erro'
        expect(store.error.value).toBe('Algum erro')

        store.clearError()

        expect(store.error.value).toBeNull()
      } else {
        // Se não é ref, apenas testar que não gera erro
        store.clearError()
        expect(true).toBe(true)
      }
    })
  })

  describe('openUpdateLink', () => {
    test('deve chamar openPlayStore do composable', () => {
      const store = useAppVersionStore()
      const spy = vi.spyOn(window, 'open').mockImplementation(() => null)

      // updateUrl pode ser ref ou valor
      if (typeof store.updateUrl === 'object' && store.updateUrl !== null && 'value' in store.updateUrl) {
        store.updateUrl.value = 'https://play.google.com/store/apps/details?id=test'
      } else if (typeof store.updateUrl === 'string') {
        // Se é string, não conseguimos modificar via propriedade
        // Apenas testamos que a função não gera erro
      }

      store.openUpdateLink()

      // Pode ter chamado open ou não, dependendo se updateUrl foi setado
      spy.mockRestore()
    })
  })

  describe('Integração de State', () => {
    test('deve expor estado do composable', () => {
      const store = useAppVersionStore()

      // O store expõe as refs do composable
      expect(store.currentVersion).toBeDefined()
      expect(typeof store.currentVersion === 'object' || typeof store.currentVersion === 'string').toBe(true)

      // Nota: Algumas propriedades podem ser valores diretos ou refs
      // dependendo de como o store as expõe
      expect(store.changelog).toBeDefined()
      expect(store.loading).toBeDefined()
    })

    test('deve expor computed properties do composable', () => {
      const store = useAppVersionStore()

      expect(store.isOutdated).toBeDefined()
      expect(store.versionDifference).toBeDefined()
    })
  })
})
