/**
 * Composable para formatação de dados na página de detalhes da manutenção
 */

export const useMaintenanceFormatters = () => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(dateObj)
  }

  const formatFullDate = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(dateObj)
  }

  const formatDateTime = (date: Date): string => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const getTimeUntil = (futureDate: Date | string): string => {
    const future = typeof futureDate === 'string' ? new Date(futureDate) : futureDate
    const now = new Date()
    const diffTime = future.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return `Atrasada há ${Math.abs(diffDays)} dias`
    }
    if (diffDays === 0) {
      return 'Vence hoje'
    }
    if (diffDays === 1) {
      return 'Vence amanhã'
    }
    if (diffDays <= 7) {
      return `Vence em ${diffDays} dias`
    }
    if (diffDays <= 30) {
      const weeks = Math.floor(diffDays / 7)
      return `Vence em ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`
    }
    const months = Math.floor(diffDays / 30)
    return `Vence em ${months} ${months === 1 ? 'mês' : 'meses'}`
  }

  const getKmUntil = (targetKm: number, currentKm: number): string => {
    const diff = targetKm - currentKm
    if (diff < 0) {
      return `${Math.abs(diff).toLocaleString('pt-BR')} km acima`
    }
    return `Faltam ${diff.toLocaleString('pt-BR')} km`
  }

  return {
    formatCurrency,
    formatDate,
    formatFullDate,
    formatDateTime,
    formatFileSize,
    getTimeUntil,
    getKmUntil,
  }
}
