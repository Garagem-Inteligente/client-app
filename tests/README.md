# 🧪 Testes Unitários - Garagem Inteligente

Este documento explica como configurar e executar testes unitários no projeto Garagem Inteligente.

## 📋 Pré-requisitos

- Node.js (versão compatível com o projeto)
- pnpm instalado
- Todas as dependências instaladas (`pnpm install`)
- **Vitest**: v4.0.1+ (atualizado automaticamente)
- **@vitest/coverage-v8**: v4.0.1+ (para relatórios de cobertura)

## 🚀 Executando Testes

### Comandos Disponíveis

```bash
# Executar todos os testes unitários
pnpm test:unit

# Executar testes em modo watch (re-executa automaticamente)
pnpm test:unit:watch

# Executar testes com relatório de cobertura
pnpm test:unit:coverage

# Executar testes com interface visual (se suportado)
pnpm test:unit:ui
```

### Estrutura de Testes

```
tests/
├── unit/
│   ├── setup.ts              # Configurações globais de teste
│   ├── example.spec.ts       # Teste de exemplo
│   ├── component.spec.ts     # Testes de componentes
│   └── ...                   # Outros testes
└── e2e/                      # Testes end-to-end (Cypress)
```

## 🛠️ Configuração

### Vitest Config (`vitest.config.ts`)

- **Environment**: jsdom (para testes de componentes Vue)
- **Globals**: Habilitado (describe, it, expect disponíveis globalmente)
- **Setup**: Arquivo `tests/unit/setup.ts` executado antes de todos os testes
- **Coverage**: Configurado com V8 provider

### Setup Global (`tests/unit/setup.ts`)

Configurações executadas antes de todos os testes:
- Mocks do console para reduzir ruído
- Configurações adicionais conforme necessário

## 📝 Escrevendo Testes

### Estrutura Básica de Teste

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MyComponent from '@/components/MyComponent.vue'

describe('MyComponent', () => {
  it('should render correctly', () => {
    const wrapper = mount(MyComponent, {
      props: {
        // props necessárias
      }
    })

    expect(wrapper.text()).toContain('Expected text')
  })

  it('should handle user interactions', async () => {
    const wrapper = mount(MyComponent)

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted()).toHaveProperty('click')
  })
})
```

### Testando Componentes com Pinia

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import MyComponent from '@/components/MyComponent.vue'

describe('MyComponent with Pinia', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should work with store', () => {
    const wrapper = mount(MyComponent)
    // Teste com store
  })
})
```

### Testando Composables

```typescript
import { describe, it, expect } from 'vitest'
import { useMyComposable } from '@/composables/useMyComposable'

describe('useMyComposable', () => {
  it('should return expected values', () => {
    const { result } = useMyComposable()

    expect(result.value).toBe('expected value')
  })
})
```

## 🎯 Boas Práticas

### ✅ Faça
- Teste comportamentos, não implementação
- Use nomes descritivos para testes
- Mantenha testes independentes
- Teste casos de erro
- Use `beforeEach` para setup repetitivo

### ❌ Não Faça
- Teste detalhes de implementação
- Criar testes frágeis
- Usar `any` em testes
- Deixar testes sem assertions
- Testar bibliotecas externas

## 📊 Cobertura de Testes

A cobertura é gerada automaticamente com:
- **Provider**: V8 (mais rápido e preciso)
- **Relatórios**: HTML, JSON e texto
- **Thresholds**: 70% mínimo para branches, funções, linhas e statements
- **Exclusões**: Configuradas para arquivos não relevantes

Para visualizar cobertura:
```bash
pnpm test:unit:coverage
# Abre coverage/index.html no navegador
```

### Thresholds de Qualidade
- **Statements**: 70%
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%

Os testes falharão se a cobertura estiver abaixo dos thresholds configurados.

## 🔧 Debugging

### Modo Watch
```bash
pnpm test:unit:watch
# Pressione 'p' para filtrar testes
# Pressione 't' para executar apenas testes falhando
```

### Debug Individual
```typescript
it.only('should debug this test', () => {
  // Apenas este teste será executado
})
```

## 📚 Recursos Adicionais

- [Documentação Vitest](https://vitest.dev/)
- [Vue Test Utils](https://vue-test-utils.vuejs.org/)
- [Testing Library](https://testing-library.com/docs/vue-testing-library/intro/)

## 🤝 Contribuição

Antes de commitar:
1. Execute todos os testes: `pnpm test:unit`
2. Verifique cobertura: `pnpm test:unit:coverage`
3. Certifique-se que não há testes quebrados

Para novas funcionalidades, escreva testes primeiro (TDD)!