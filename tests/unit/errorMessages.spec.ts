import { describe, expect, test } from 'vitest'
import {
  translateFirebaseError,
  isPermissionError,
  isNetworkError,
  isValidationError,
  getErrorMessage,
} from '../../src/utils/errorMessages'

describe('errorMessages.ts', () => {
  describe('translateFirebaseError', () => {
    test('deve traduzir erro de auth/email-already-in-use', () => {
      const error = { code: 'auth/email-already-in-use' }
      const result = translateFirebaseError(error)
      expect(result).toBe('Este e-mail já está cadastrado. Faça login ou use outro e-mail.')
    })

    test('deve traduzir erro de auth/user-not-found', () => {
      const error = { code: 'auth/user-not-found' }
      const result = translateFirebaseError(error)
      expect(result).toBe('Não encontramos uma conta com este e-mail. Cadastre-se primeiro.')
    })

    test('deve retornar mensagem padrão para erro desconhecido', () => {
      const error = { code: 'unknown-error' }
      const result = translateFirebaseError(error, 'Erro padrão')
      expect(result).toBe('Erro padrão')
    })

    test('deve traduzir erro de string', () => {
      const error = 'auth/wrong-password'
      const result = translateFirebaseError(error)
      expect(result).toBe('Senha incorreta. Verifique e tente novamente.')
    })

    test('deve traduzir erro de firestore permission-denied', () => {
      const error = { code: 'permission-denied' }
      const result = translateFirebaseError(error)
      expect(result).toBe('Você não tem permissão para realizar esta ação.')
    })
  })

  describe('isPermissionError', () => {
    test('deve identificar erro de permissão', () => {
      const error = { code: 'permission-denied' }
      expect(isPermissionError(error)).toBe(true)
    })

    test('deve identificar erro de não autenticado', () => {
      const error = { code: 'unauthenticated' }
      expect(isPermissionError(error)).toBe(true)
    })

    test('não deve identificar erro de rede como permissão', () => {
      const error = { code: 'network-request-failed' }
      expect(isPermissionError(error)).toBe(false)
    })
  })

  describe('isNetworkError', () => {
    test('deve identificar erro de rede', () => {
      const error = { code: 'network-request-failed' }
      expect(isNetworkError(error)).toBe(true)
    })

    test('deve identificar erro de timeout', () => {
      const error = { code: 'timeout' }
      expect(isNetworkError(error)).toBe(true)
    })

    test('não deve identificar erro de validação como rede', () => {
      const error = { code: 'invalid-argument' }
      expect(isNetworkError(error)).toBe(false)
    })
  })

  describe('isValidationError', () => {
    test('deve identificar erro de validação', () => {
      const error = { code: 'invalid-argument' }
      expect(isValidationError(error)).toBe(true)
    })

    test('deve identificar erro de dados inválidos', () => {
      const error = { code: 'failed-precondition' }
      expect(isValidationError(error)).toBe(true)
    })

    test('não deve identificar erro de permissão como validação', () => {
      const error = { code: 'permission-denied' }
      expect(isValidationError(error)).toBe(false)
    })
  })

  describe('getErrorMessage', () => {
    test('deve extrair mensagem de string', () => {
      const error = 'Mensagem de erro'
      expect(getErrorMessage(error)).toBe('Mensagem de erro')
    })

    test('deve extrair mensagem de Error object', () => {
      const error = new Error('Erro do sistema')
      expect(getErrorMessage(error)).toBe('Erro do sistema')
    })

    test('deve extrair mensagem de objeto com message', () => {
      const error = { message: 'Erro customizado' }
      expect(getErrorMessage(error)).toBe('Erro customizado')
    })

    test('deve retornar mensagem padrão para erro desconhecido', () => {
      const error = null
      expect(getErrorMessage(error)).toBe('Ocorreu um erro inesperado.')
    })
  })
})