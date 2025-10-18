/**
 * Utilitários de máscaras para inputs
 */

/**
 * Máscara de moeda brasileira (R$)
 * Entrada: "1234.56" -> Saída: "R$ 1.234,56"
 */
export function maskCurrency(value: string | number): string {
  if (!value && value !== 0) return ''
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(numValue)
}

/**
 * Desmascara moeda para número
 * Entrada: "R$ 1.234,56" -> Saída: 1234.56
 */
export function unmaskCurrency(value: string): number {
  if (!value) return 0
  
  // Remove tudo exceto números e vírgula
  const cleaned = value.replace(/[^\d,]/g, '')
  // Substitui vírgula por ponto
  const normalized = cleaned.replace(',', '.')
  
  return parseFloat(normalized) || 0
}

/**
 * Máscara de quilometragem
 * Entrada: "50000" -> Saída: "50.000 km"
 */
export function maskMileage(value: string | number): string {
  if (!value && value !== 0) return ''
  
  const numValue = typeof value === 'string' ? parseInt(value) : value
  
  return new Intl.NumberFormat('pt-BR').format(numValue) + ' km'
}

/**
 * Desmascara quilometragem para número
 * Entrada: "50.000 km" -> Saída: 50000
 */
export function unmaskMileage(value: string): number {
  if (!value) return 0
  
  // Remove tudo exceto números
  const cleaned = value.replace(/\D/g, '')
  
  return parseInt(cleaned) || 0
}

/**
 * Aplica máscara de moeda enquanto digita
 * Para uso em @input
 */
export function applyCurrencyMask(event: Event): void {
  const input = event.target as HTMLInputElement
  const value = input.value.replace(/\D/g, '') // Remove tudo exceto dígitos
  
  if (!value) {
    input.value = ''
    return
  }
  
  // Converte para centavos
  const cents = parseInt(value)
  const reais = cents / 100
  
  // Formata
  input.value = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(reais)
}

/**
 * Aplica máscara de quilometragem enquanto digita
 * Para uso em @input
 */
export function applyMileageMask(event: Event): void {
  const input = event.target as HTMLInputElement
  const value = input.value.replace(/\D/g, '') // Remove tudo exceto dígitos
  
  if (!value) {
    input.value = ''
    return
  }
  
  const num = parseInt(value)
  input.value = new Intl.NumberFormat('pt-BR').format(num)
}

/**
 * Formata data para exibição
 * Entrada: "2025-10-17" -> Saída: "17/10/2025"
 */
export function formatDate(date: string | Date): string {
  if (!date) return ''
  
  const d = typeof date === 'string' ? new Date(date) : date
  
  return new Intl.DateTimeFormat('pt-BR').format(d)
}

/**
 * Converte data DD/MM/YYYY para YYYY-MM-DD
 */
export function parseDateBR(date: string): string {
  if (!date) return ''
  
  const parts = date.split('/')
  if (parts.length !== 3) return date
  
  const [day, month, year] = parts
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}
