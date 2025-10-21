/**
 * Utilitário para traduzir erros do Firebase para mensagens amigáveis em português
 */

export interface FirebaseErrorMap {
  [key: string]: string
}

// Mapeamento de códigos de erro do Firebase Authentication
const authErrors: FirebaseErrorMap = {
  'auth/email-already-in-use': 'Este e-mail já está cadastrado. Faça login ou use outro e-mail.',
  'auth/invalid-email': 'O e-mail digitado não é válido. Verifique e tente novamente.',
  'auth/operation-not-allowed': 'Esta operação não está habilitada. Entre em contato com o suporte.',
  'auth/weak-password': 'Senha muito fraca. Use pelo menos 6 caracteres com letras e números.',
  'auth/user-disabled': 'Esta conta foi desabilitada. Entre em contato com o suporte.',
  'auth/user-not-found': 'Não encontramos uma conta com este e-mail. Cadastre-se primeiro.',
  'auth/wrong-password': 'Senha incorreta. Verifique e tente novamente.',
  'auth/invalid-credential': 'E-mail ou senha incorretos. Verifique seus dados.',
  'auth/too-many-requests': 'Muitas tentativas de login. Por segurança, aguarde alguns minutos.',
  'auth/network-request-failed': 'Sem conexão com a internet. Verifique sua rede e tente novamente.',
  'auth/popup-closed-by-user': 'Janela de autenticação fechada. Tente fazer login novamente.',
  'auth/requires-recent-login': 'Por segurança, faça login novamente para continuar.',
  'auth/account-exists-with-different-credential': 'Já existe uma conta com este e-mail usando outro método de login.',
  'auth/invalid-verification-code': 'Código de verificação inválido.',
  'auth/invalid-verification-id': 'ID de verificação inválido.',
  'auth/missing-verification-code': 'Código de verificação não fornecido.',
  'auth/credential-already-in-use': 'Esta credencial já está sendo usada por outra conta.',
  'auth/timeout': 'A operação expirou. Tente novamente.',
  'auth/missing-android-pkg-name': 'Configuração do app Android inválida.',
  'auth/missing-continue-uri': 'URL de continuação não fornecida.',
  'auth/missing-ios-bundle-id': 'Configuração do app iOS inválida.',
  'auth/invalid-continue-uri': 'URL de continuação inválida.',
  'auth/unauthorized-continue-uri': 'URL de continuação não autorizada.',
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
  'Network request failed': 'Erro de conexão. Verifique sua internet e tente novamente.',
  'Quota exceeded': 'Limite de uso excedido. Por favor, tente novamente mais tarde.',
  'The caller does not have permission': 'Você não tem permissão para acessar este recurso.',
  'Failed to fetch': 'Não foi possível conectar ao servidor. Verifique sua conexão.',
  'Load failed': 'Falha ao carregar dados. Tente novamente.',
  'timeout': 'A operação demorou muito. Verifique sua conexão e tente novamente.',
  'CORS': 'Erro de segurança no navegador. Recarregue a página e tente novamente.',
}

// Mapeamento de erros da API FIPE
const fipeErrors: FirebaseErrorMap = {
  '404': 'Veículo não encontrado na tabela FIPE. Verifique os dados e tente novamente.',
  '400': 'Dados inválidos para consulta FIPE. Verifique os campos.',
  '500': 'Serviço FIPE temporariamente indisponível. Tente novamente em alguns minutos.',
  '503': 'Serviço FIPE em manutenção. Tente novamente mais tarde.',
  'network_error': 'Não foi possível conectar à API FIPE. Verifique sua internet.',
  'timeout_error': 'Consulta à FIPE demorou muito. Tente novamente.',
  'parse_error': 'Erro ao processar dados da FIPE. Tente novamente.',
}

// Mapeamento de erros de Storage/Upload
const storageErrors: FirebaseErrorMap = {
  'storage/unauthorized': 'Você não tem permissão para fazer upload de arquivos.',
  'storage/canceled': 'Upload cancelado.',
  'storage/unknown': 'Erro desconhecido no upload. Tente novamente.',
  'storage/object-not-found': 'Arquivo não encontrado.',
  'storage/quota-exceeded': 'Espaço de armazenamento excedido.',
  'storage/unauthenticated': 'Faça login para fazer upload de arquivos.',
  'storage/retry-limit-exceeded': 'Muitas tentativas de upload. Aguarde um momento.',
  'storage/invalid-checksum': 'Arquivo corrompido. Tente fazer upload novamente.',
  'storage/canceled-by-user': 'Upload cancelado por você.',
  'file_too_large': 'Arquivo muito grande. O tamanho máximo é 5MB.',
  'invalid_file_type': 'Tipo de arquivo não suportado. Use apenas imagens (JPG, PNG, WebP).',
  'upload_failed': 'Falha no upload. Verifique sua conexão e tente novamente.',
}

/**
 * Extrai o código de erro de diferentes formatos do Firebase e APIs externas
 */
function extractErrorCode(error: unknown): string | null {
  // Mensagem de erro em string
  if (typeof error === 'string') {
    return error
  }

  if (!error || typeof error !== 'object') {
    return null
  }

  const err = error as Record<string, unknown>

  // Erro do Firebase com código
  if (err.code && typeof err.code === 'string') {
    return err.code
  }

  // Erro do Firestore (código sem prefixo)
  if (err.name === 'FirebaseError' && err.code && typeof err.code === 'string') {
    return err.code.replace(/^(auth|firestore)\//, '')
  }

  // Erro com status (APIs externas como FIPE)
  if (err.status && typeof err.status === 'number') {
    return err.status.toString()
  }

  // Objeto Error com mensagem
  if (err.message && typeof err.message === 'string') {
    return err.message
  }

  return null
}

/**
 * Traduz erros do Firebase e APIs externas para mensagens amigáveis em português
 * @param error - Erro do Firebase, FIPE, Storage ou outro (objeto ou string)
 * @param defaultMessage - Mensagem padrão caso não encontre tradução
 * @returns Mensagem de erro traduzida
 */
export function translateFirebaseError(
  error: unknown,
  defaultMessage: string = 'Ocorreu um erro inesperado. Por favor, tente novamente.'
): string {
  const errorCode = extractErrorCode(error)

  if (!errorCode) {
    return defaultMessage
  }

  // Tentar encontrar tradução nos mapeamentos (ordem de prioridade)
  return (
    authErrors[errorCode] ||
    firestoreErrors[errorCode] ||
    storageErrors[errorCode] ||
    fipeErrors[errorCode] ||
    commonErrors[errorCode] ||
    defaultMessage
  )
}

/**
 * Verifica se é um erro de permissão do Firestore
 */
export function isPermissionError(error: unknown): boolean {
  const errorCode = extractErrorCode(error)
  if (!errorCode) return false

  return (
    errorCode.includes('permission') ||
    errorCode.includes('unauthenticated') ||
    errorCode === 'permission-denied' ||
    errorCode === 'missing-permissions' ||
    errorCode.includes('unauthorized')
  )
}

/**
 * Verifica se é um erro de rede
 */
export function isNetworkError(error: unknown): boolean {
  const errorCode = extractErrorCode(error)
  if (!errorCode) return false

  return (
    errorCode.includes('network') ||
    errorCode === 'unavailable' ||
    errorCode === 'deadline-exceeded' ||
    errorCode === 'timeout' ||
    errorCode.includes('Failed to fetch') ||
    errorCode.includes('Load failed')
  )
}

/**
 * Verifica se é um erro de validação de dados
 */
export function isValidationError(error: unknown): boolean {
  const errorCode = extractErrorCode(error)
  if (!errorCode) return false

  return (
    errorCode === 'invalid-argument' ||
    errorCode === 'out-of-range' ||
    errorCode === 'failed-precondition' ||
    errorCode.includes('invalid') ||
    errorCode.includes('Invalid')
  )
}

/**
 * Extrai uma mensagem de erro genérica a partir de um erro desconhecido
 */
export function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error
  }

  if (error instanceof Error) {
    return error.message
  }

  if (error && typeof error === 'object') {
    const err = error as Record<string, unknown>
    if (err.message && typeof err.message === 'string') {
      return err.message
    }
  }

  return 'Ocorreu um erro inesperado.'
}

