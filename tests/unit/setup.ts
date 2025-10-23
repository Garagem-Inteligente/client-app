import { beforeAll } from 'vitest'

// Configurações globais para testes
beforeAll(() => {
  // Configurações globais de teste podem ser adicionadas aqui

  // Mock do console.warn/error para reduzir ruído nos testes
  const originalWarn = console.warn
  const originalError = console.error

  console.warn = (...args) => {
    // Filtrar warnings específicos se necessário
    if (args[0]?.includes?.('deprecated')) return
    originalWarn(...args)
  }

  console.error = (...args) => {
    // Filtrar erros específicos se necessário
    if (args[0]?.includes?.('Vue warn')) return
    originalError(...args)
  }
})

// Configurações adicionais podem ser adicionadas conforme necessário:
// - Mocks globais
// - Configurações de Ionic
// - Setup de Firebase mocks
// - etc.