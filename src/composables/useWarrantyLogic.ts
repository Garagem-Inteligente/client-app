/**
 * Composable para lógica de validação de garantias
 */

import type { MaintenanceType } from '@/stores/vehicles'
import { MAINTENANCE_TYPE_ICONS, MAINTENANCE_TYPE_LABELS } from '@/constants/vehicles'

export const useWarrantyLogic = () => {
  const isWarrantyValid = (expiryDate: Date | string): boolean => {
    const expiry = typeof expiryDate === 'string' ? new Date(expiryDate) : expiryDate
    return expiry > new Date()
  }

  const getMaintenanceTypeLabel = (type: string): string => {
    return MAINTENANCE_TYPE_LABELS[type as MaintenanceType] || type
  }

  const getMaintenanceIcon = (type: string): string => {
    return MAINTENANCE_TYPE_ICONS[type as MaintenanceType] || '🔧'
  }

  return {
    isWarrantyValid,
    getMaintenanceTypeLabel,
    getMaintenanceIcon,
  }
}
