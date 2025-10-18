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

/**
 * Máscara de placa de veículo (Mercosul e antiga)
 * Entrada: "ABC1D23" -> Saída: "ABC-1D23"
 * Entrada: "ABC1234" -> Saída: "ABC-1234"
 */
export function maskPlate(value: string): string {
  if (!value) return ''
  
  // Remove tudo exceto letras e números
  const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
  
  if (cleaned.length <= 3) return cleaned
  
  // Formato: ABC-1234 ou ABC-1D23
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}`
}

/**
 * Aplica máscara de placa enquanto digita
 */
export function applyPlateMask(event: Event): void {
  const input = event.target as HTMLInputElement
  const value = input.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
  
  if (value.length <= 3) {
    input.value = value
  } else {
    input.value = `${value.slice(0, 3)}-${value.slice(3, 7)}`
  }
}

/**
 * Remove máscara de placa
 */
export function unmaskPlate(value: string): string {
  return value.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
}

/**
 * Máscara de telefone brasileiro
 * Entrada: "11987654321" -> Saída: "(11) 98765-4321"
 * Entrada: "1133334444" -> Saída: "(11) 3333-4444"
 */
export function maskPhone(value: string): string {
  if (!value) return ''
  
  const cleaned = value.replace(/\D/g, '')
  
  if (cleaned.length <= 10) {
    // Telefone fixo: (11) 3333-4444
    return cleaned
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
  } else {
    // Celular: (11) 98765-4321
    return cleaned
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
  }
}

/**
 * Aplica máscara de telefone enquanto digita
 */
export function applyPhoneMask(event: Event): void {
  const input = event.target as HTMLInputElement
  const value = input.value.replace(/\D/g, '')
  
  if (value.length <= 10) {
    input.value = value
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
  } else {
    input.value = value
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 15) // Limita a 15 caracteres
  }
}

/**
 * Remove máscara de telefone
 */
export function unmaskPhone(value: string): string {
  return value.replace(/\D/g, '')
}
