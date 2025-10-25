import { describe, expect, test } from 'vitest'
import {
  parseVersion,
  compareVersions,
  isVersionOlder,
  isVersionNewer,
  isVersionEqual,
  isVersionOlderOrEqual,
  isValidVersion,
  formatVersionDifference,
} from '../../src/utils/versionComparison'

describe('versionComparison.ts', () => {
  describe('parseVersion', () => {
    test('deve fazer parse de versão válida', () => {
      const result = parseVersion('1.2.3')
      expect(result).toEqual([1, 2, 3])
    })

    test('deve fazer parse de versão com dois dígitos', () => {
      const result = parseVersion('2.0.0')
      expect(result).toEqual([2, 0, 0])
    })

    test('deve fazer parse de versão com dígitos altos', () => {
      const result = parseVersion('10.20.30')
      expect(result).toEqual([10, 20, 30])
    })

    test('deve retornar null para versão com menos de 3 partes', () => {
      const result = parseVersion('1.2')
      expect(result).toBeNull()
    })

    test('deve retornar null para versão com mais de 3 partes', () => {
      const result = parseVersion('1.0.0.0')
      expect(result).toBeNull()
    })

    test('deve retornar null para versão com letras', () => {
      const result = parseVersion('1.2.3a')
      expect(result).toBeNull()
    })

    test('deve retornar null para versão vazia', () => {
      const result = parseVersion('')
      expect(result).toBeNull()
    })

  describe('compareVersions', () => {
    test('deve identificar que v1 é mais antiga', () => {
      const result = compareVersions('1.0.0', '1.0.1')
      expect(result.isOlder).toBe(true)
      expect(result.isNewer).toBe(false)
      expect(result.isEqual).toBe(false)
    })

    test('deve identificar que v1 é mais nova', () => {
      const result = compareVersions('1.1.0', '1.0.9')
      expect(result.isOlder).toBe(false)
      expect(result.isNewer).toBe(true)
      expect(result.isEqual).toBe(false)
    })

    test('deve identificar versões iguais', () => {
      const result = compareVersions('1.2.3', '1.2.3')
      expect(result.isOlder).toBe(false)
      expect(result.isNewer).toBe(false)
      expect(result.isEqual).toBe(true)
    })
  })

  describe('isVersionOlder', () => {
    test('deve retornar true quando v1 é mais antiga', () => {
      const result = isVersionOlder('1.0.0', '2.0.0')
      expect(result).toBe(true)
    })

    test('deve retornar false quando v1 é mais nova', () => {
      const result = isVersionOlder('2.0.0', '1.0.0')
      expect(result).toBe(false)
    })

    test('deve retornar false quando versões são iguais', () => {
      const result = isVersionOlder('1.0.0', '1.0.0')
      expect(result).toBe(false)
    })

    test('deve retornar false para versão inválida', () => {
      const result = isVersionOlder('invalid', '2.0.0')
      expect(result).toBe(false)
    })
  })

  describe('isVersionNewer', () => {
    test('deve retornar true quando v1 é mais nova', () => {
      const result = isVersionNewer('2.0.0', '1.0.0')
      expect(result).toBe(true)
    })

    test('deve retornar false quando v1 é mais antiga', () => {
      const result = isVersionNewer('1.0.0', '2.0.0')
      expect(result).toBe(false)
    })

    test('deve retornar false quando versões são iguais', () => {
      const result = isVersionNewer('1.0.0', '1.0.0')
      expect(result).toBe(false)
    })
  })

  describe('isVersionEqual', () => {
    test('deve retornar true quando versões são iguais', () => {
      const result = isVersionEqual('1.0.0', '1.0.0')
      expect(result).toBe(true)
    })

    test('deve retornar false quando versões são diferentes', () => {
      const result = isVersionEqual('1.0.0', '1.0.1')
      expect(result).toBe(false)
    })

    test('deve retornar false para versão inválida', () => {
      const result = isVersionEqual('invalid', '1.0.0')
      expect(result).toBe(false)
    })
  })

  describe('isVersionOlderOrEqual', () => {
    test('deve retornar true quando v1 é mais antiga', () => {
      const result = isVersionOlderOrEqual('1.0.0', '2.0.0')
      expect(result).toBe(true)
    })

    test('deve retornar true quando v1 é igual', () => {
      const result = isVersionOlderOrEqual('1.0.0', '1.0.0')
      expect(result).toBe(true)
    })

    test('deve retornar false quando v1 é mais nova', () => {
      const result = isVersionOlderOrEqual('2.0.0', '1.0.0')
      expect(result).toBe(false)
    })
  })

  describe('isValidVersion', () => {
    test('deve validar versão válida', () => {
      expect(isValidVersion('1.0.0')).toBe(true)
    })

    test('deve validar versão válida com números maiores', () => {
      expect(isValidVersion('10.20.30')).toBe(true)
    })

    test('deve rejeitar versão com menos de 3 partes', () => {
      expect(isValidVersion('1.0')).toBe(false)
    })

    test('deve rejeitar versão com mais de 3 partes', () => {
      expect(isValidVersion('1.0.0.0')).toBe(false)
    })

    test('deve rejeitar versão com letras', () => {
      expect(isValidVersion('1.0.0a')).toBe(false)
    })

    test('deve rejeitar versão vazia', () => {
      expect(isValidVersion('')).toBe(false)
    })
  })

  describe('formatVersionDifference', () => {
    test('deve formatar diferença major', () => {
      const result = formatVersionDifference('1.0.0', '2.0.0')
      expect(result).toContain('major')
    })

    test('deve formatar diferença minor', () => {
      const result = formatVersionDifference('1.0.0', '1.1.0')
      expect(result).toContain('minor')
    })

    test('deve formatar diferença patch', () => {
      const result = formatVersionDifference('1.0.0', '1.0.1')
      expect(result).toContain('corre')
    })

    test('deve formatar versões iguais', () => {
      const result = formatVersionDifference('1.0.0', '1.0.0')
      expect(result).toContain('mesma vers')
    })

    test('deve formatar versão anterior', () => {
      const result = formatVersionDifference('2.0.0', '1.0.0')
      expect(result).toContain('versão anterior')
    })

    test('deve retornar "versão desconhecida" para versão inválida', () => {
      const result = formatVersionDifference('invalid', '1.0.0')
      expect(result).toContain('versão desconhecida')
    })
  })
})
})
