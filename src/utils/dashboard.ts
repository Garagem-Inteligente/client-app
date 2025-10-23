/**
 * Utilitários para o dashboard da aplicação
 */

import { MAINTENANCE_TYPE_LABELS } from '@/constants/vehicles'

/**
 * Formata um valor numérico para moeda brasileira (BRL)
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

/**
 * Formata uma data para o padrão brasileiro
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

/**
 * Calcula quantos dias faltam até uma data
 */
export const daysUntilNext = (date: Date): number => {
  const now = new Date()
  const diff = date.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

/**
 * Determina o status de manutenção baseado na data
 */
export const getMaintenanceStatus = (date: Date): 'overdue' | 'urgent' | 'soon' | 'normal' => {
  const days = daysUntilNext(date)
  if (days < 0) return 'overdue'
  if (days <= 7) return 'urgent'
  if (days <= 30) return 'soon'
  return 'normal'
}

/**
 * Retorna a classe CSS para o badge de manutenção
 */
export const getMaintenanceBadgeClass = (date: Date): string => {
  const status = getMaintenanceStatus(date)
  if (status === 'urgent') return 'badge-error'
  if (status === 'soon') return 'badge-warning'
  return 'badge-default'
}

/**
 * Retorna a classe CSS para o item de manutenção
 */
export const getMaintenanceItemClass = (date: Date): string => {
  const status = getMaintenanceStatus(date)
  if (status === 'urgent') return 'urgent'
  if (status === 'soon') return 'soon'
  return ''
}

/**
 * Retorna o rótulo do tipo de manutenção
 */
export const getMaintenanceTypeLabel = (type: string): string => {
  return MAINTENANCE_TYPE_LABELS[type as keyof typeof MAINTENANCE_TYPE_LABELS] || type
}

/**
 * Retorna o rótulo do tipo de combustível
 */
export const getFuelLabel = (fuelType: string): string => {
  const labels: Record<string, string> = {
    'gasoline': 'Gasolina',
    'diesel': 'Diesel',
    'electric': 'Elétrico',
    'flex': 'Flex'
  }
  return labels[fuelType] || fuelType
}

/**
 * Retorna a classe CSS para o badge de combustível
 */
export const getFuelBadgeClass = (fuelType: string): string => {
  if (fuelType === 'electric') return 'badge-success'
  return 'badge-default'
}