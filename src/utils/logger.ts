/**
 * Sistema de logging com controle de ambiente
 * 
 * Em produção, apenas errors são logados.
 * Em desenvolvimento, todos os logs são exibidos.
 * 
 * Uso:
 * import { logger } from '@/utils/logger'
 * 
 * logger.info('Informação')
 * logger.warn('Aviso')
 * logger.error('Erro crítico', error)
 * logger.debug('Debug detalhado', data)
 */

const isDevelopment = import.meta.env.DEV

export const logger = {
  /**
   * Informações gerais (apenas em dev)
   */
  info: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log(...args)
    }
  },

  /**
   * Avisos (apenas em dev)
   */
  warn: (...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(...args)
    }
  },

  /**
   * Erros críticos (sempre loga, mesmo em prod)
   */
  error: (...args: unknown[]) => {
    console.error(...args)
    
    // Em produção, também pode enviar para serviço de monitoramento
    if (!isDevelopment) {
      // TODO: Integrar com Sentry, LogRocket, etc
      // sendToErrorTracking(args)
    }
  },

  /**
   * Debug detalhado (apenas em dev)
   */
  debug: (...args: unknown[]) => {
    if (isDevelopment) {
      console.debug(...args)
    }
  },

  /**
   * Grupo de logs (apenas em dev)
   */
  group: (label: string) => {
    if (isDevelopment) {
      console.group(label)
    }
  },

  groupEnd: () => {
    if (isDevelopment) {
      console.groupEnd()
    }
  },

  /**
   * Tabela formatada (apenas em dev)
   */
  table: (data: unknown) => {
    if (isDevelopment) {
      console.table(data)
    }
  }
}
