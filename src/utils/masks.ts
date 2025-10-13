/**
 * Utilitários para máscaras de input
 */

/**
 * Máscara para valores monetários (R$ 1.234,56)
 */
export function maskCurrency(value: string | number): string {
  if (!value && value !== 0) return ''
  
  // Remove tudo que não é dígito
  const digits = value.toString().replace(/\D/g, '')
  
  if (!digits) return ''
  
  // Converte para número e divide por 100 para ter os centavos
  const number = parseInt(digits) / 100
  
  // Formata como moeda brasileira
  return number.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

/**
 * Remove a máscara de moeda e retorna o valor numérico
 */
export function unmaskCurrency(value: string): number {
  if (!value) return 0
  
  // Remove tudo que não é dígito
  const digits = value.replace(/\D/g, '')
  
  if (!digits) return 0
  
  // Converte para número e divide por 100
  return parseInt(digits) / 100
}

/**
 * Máscara para quilometragem (123.456 km)
 */
export function maskMileage(value: string | number): string {
  if (!value && value !== 0) return ''
  
  // Remove tudo que não é dígito
  const digits = value.toString().replace(/\D/g, '')
  
  if (!digits) return ''
  
  // Formata com pontos de milhar
  const number = parseInt(digits)
  return number.toLocaleString('pt-BR')
}

/**
 * Remove a máscara de quilometragem e retorna o valor numérico
 */
export function unmaskMileage(value: string): number {
  if (!value) return 0
  
  // Remove tudo que não é dígito
  const digits = value.replace(/\D/g, '')
  
  if (!digits) return 0
  
  return parseInt(digits)
}

/**
 * Máscara para placa de veículo (ABC-1234 ou ABC1D23)
 */
export function maskPlate(value: string): string {
  if (!value) return ''
  
  // Remove caracteres especiais e converte para maiúsculo
  let plate = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
  
  // Limita a 7 caracteres
  plate = plate.slice(0, 7)
  
  // Formato antigo: ABC-1234 (3 letras + 4 números)
  // Formato Mercosul: ABC1D23 (3 letras + 1 número + 1 letra + 2 números)
  if (plate.length > 3) {
    const firstPart = plate.slice(0, 3)
    const secondPart = plate.slice(3)
    
    // Verifica se é formato Mercosul (tem letra na posição 4)
    if (secondPart.length >= 2 && /[A-Z]/.test(secondPart[1])) {
      // Formato Mercosul: ABC1D23
      return `${firstPart}${secondPart}`
    } else {
      // Formato antigo: ABC-1234
      return `${firstPart}-${secondPart}`
    }
  }
  
  return plate
}

/**
 * Remove a máscara da placa
 */
export function unmaskPlate(value: string): string {
  if (!value) return ''
  return value.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
}

/**
 * Máscara para data (DD/MM/AAAA)
 */
export function maskDate(value: string): string {
  if (!value) return ''
  
  // Remove tudo que não é dígito
  let digits = value.replace(/\D/g, '')
  
  // Limita a 8 dígitos
  digits = digits.slice(0, 8)
  
  // Aplica a máscara
  if (digits.length >= 5) {
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
  } else if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`
  } else {
    return digits
  }
}

/**
 * Remove a máscara de data e retorna no formato YYYY-MM-DD
 */
export function unmaskDate(value: string): string {
  if (!value) return ''
  
  // Remove tudo que não é dígito
  const digits = value.replace(/\D/g, '')
  
  if (digits.length !== 8) return ''
  
  // Converte DD/MM/YYYY para YYYY-MM-DD
  const day = digits.slice(0, 2)
  const month = digits.slice(2, 4)
  const year = digits.slice(4, 8)
  
  return `${year}-${month}-${day}`
}

/**
 * Valida se a data é válida
 */
export function isValidDate(value: string): boolean {
  const date = unmaskDate(value)
  if (!date) return false
  
  const dateObj = new Date(date)
  return dateObj instanceof Date && !isNaN(dateObj.getTime())
}

/**
 * Máscara para telefone ((11) 98765-4321)
 */
export function maskPhone(value: string): string {
  if (!value) return ''
  
  // Remove tudo que não é dígito
  let digits = value.replace(/\D/g, '')
  
  // Limita a 11 dígitos
  digits = digits.slice(0, 11)
  
  // Aplica a máscara
  if (digits.length >= 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  } else if (digits.length >= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  } else if (digits.length >= 3) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  } else if (digits.length >= 1) {
    return `(${digits}`
  }
  
  return digits
}

/**
 * Remove a máscara de telefone
 */
export function unmaskPhone(value: string): string {
  if (!value) return ''
  return value.replace(/\D/g, '')
}

/**
 * Máscara para ano (YYYY)
 */
export function maskYear(value: string): string {
  if (!value) return ''
  
  // Remove tudo que não é dígito
  let digits = value.replace(/\D/g, '')
  
  // Limita a 4 dígitos
  digits = digits.slice(0, 4)
  
  return digits
}

/**
 * Formata data para exibição (DD/MM/YYYY)
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return ''
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) return ''
  
  const day = dateObj.getDate().toString().padStart(2, '0')
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
  const year = dateObj.getFullYear()
  
  return `${day}/${month}/${year}`
}

/**
 * Converte data formatada (DD/MM/YYYY) para objeto Date
 */
export function parseDate(value: string): Date | null {
  if (!value) return null
  
  const dateString = unmaskDate(value)
  if (!dateString) return null
  
  const date = new Date(dateString)
  return isNaN(date.getTime()) ? null : date
}
