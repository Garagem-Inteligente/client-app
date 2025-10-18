/**
 * Utilitário para traduzir erros do Firebase para mensagens amigáveis em português
 */

export interface FirebaseErrorMap {
  [key: string]: string
}

// Mapeamento de códigos de erro do Firebase Authentication
const authErrors: FirebaseErrorMap = {
  'auth/email-already-in-use': 'Este e-mail já está em uso.',
  'auth/invalid-email': 'E-mail inválido.',
  'auth/operation-not-allowed': 'Operação não permitida.',
  'auth/weak-password': 'Senha muito fraca. Use pelo menos 6 caracteres.',
  'auth/user-disabled': 'Esta conta foi desabilitada.',
  'auth/user-not-found': 'Usuário não encontrado.',
  'auth/wrong-password': 'Senha incorreta.',
  'auth/invalid-credential': 'Credenciais inválidas.',
  'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
  'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
  'auth/popup-closed-by-user': 'Pop-up fechado antes de concluir a autenticação.',
  'auth/requires-recent-login': 'Esta operação requer login recente.',
}

// Mapeamento de códigos de erro do Firestore
const firestoreErrors: FirebaseErrorMap = {
  'permission-denied': 'Você não tem permissão para realizar esta ação.',
  'missing-permissions': 'Permissões insuficientes para realizar esta operação.',
  'unauthenticated': 'Você precisa estar logado para fazer isso.',
  'not-found': 'Registro não encontrado.',
  'already-exists': 'Este registro já existe.',
  'resource-exhausted': 'Limite de recursos excedido. Tente novamente mais tarde.',
  'failed-precondition': 'Operação não pode ser executada no estado atual.',
  'aborted': 'Operação abortada devido a conflito.',
  'out-of-range': 'Operação fora do intervalo válido.',
  'unimplemented': 'Operação não implementada.',
  'internal': 'Erro interno do servidor.',
  'unavailable': 'Serviço temporariamente indisponível. Tente novamente.',
  'data-loss': 'Perda de dados detectada.',
  'deadline-exceeded': 'Operação demorou muito para ser concluída.',
  'invalid-argument': 'Dados inválidos fornecidos.',
  'cancelled': 'Operação cancelada.',
  'unknown': 'Erro desconhecido. Tente novamente.',
}

// Mapeamento de mensagens de erro comuns (em inglês)
const commonErrors: FirebaseErrorMap = {
  'Missing or insufficient permissions': 'Você não tem permissão para realizar esta ação.',
  'Network request failed': 'Erro de conexão. Verifique sua internet.',
  'Quota exceeded': 'Limite de uso excedido. Tente novamente mais tarde.',
  'The caller does not have permission': 'Você não tem permissão para acessar este recurso.',
}

/**
 * Extrai o código de erro de diferentes formatos do Firebase
 */
function extractErrorCode(error: any): string | null {
  // Erro do Firebase com código
  if (error?.code) {
    return error.code
  }

  // Erro do Firestore (código sem prefixo)
  if (error?.name === 'FirebaseError' && error?.code) {
    return error.code.replace(/^(auth|firestore)\//, '')
  }

  // Mensagem de erro em string
  if (typeof error === 'string') {
    return error
  }

  // Objeto Error com mensagem
  if (error?.message) {
    return error.message
  }

  return null
}

/**
 * Traduz erros do Firebase para mensagens amigáveis em português
 * @param error - Erro do Firebase (objeto ou string)
 * @param defaultMessage - Mensagem padrão caso não encontre tradução
 * @returns Mensagem de erro traduzida
 */
export function translateFirebaseError(
  error: any,
  defaultMessage: string = 'Ocorreu um erro. Tente novamente.'
): string {
  const errorCode = extractErrorCode(error)

  if (!errorCode) {
    return defaultMessage
  }

  // Tentar encontrar tradução nos mapeamentos
  return (
    authErrors[errorCode] ||
    firestoreErrors[errorCode] ||
    commonErrors[errorCode] ||
    defaultMessage
  )
}

/**
 * Verifica se é um erro de permissão do Firestore
 */
export function isPermissionError(error: any): boolean {
  const errorCode = extractErrorCode(error)
  if (!errorCode) return false

  return (
    errorCode.includes('permission') ||
    errorCode.includes('unauthenticated') ||
    errorCode === 'permission-denied' ||
    errorCode === 'missing-permissions'
  )
}

/**
 * Verifica se é um erro de rede
 */
export function isNetworkError(error: any): boolean {
  const errorCode = extractErrorCode(error)
  if (!errorCode) return false

  return (
    errorCode.includes('network') ||
    errorCode === 'unavailable' ||
    errorCode === 'deadline-exceeded'
  )
}

/**
 * Verifica se é um erro de validação de dados
 */
export function isValidationError(error: any): boolean {
  const errorCode = extractErrorCode(error)
  if (!errorCode) return false

  return (
    errorCode === 'invalid-argument' ||
    errorCode === 'out-of-range' ||
    errorCode === 'failed-precondition'
  )
}

