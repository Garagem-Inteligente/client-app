/**
 * Validation utilities for forms
 */

export interface ValidationResult {
  isValid: boolean
  message?: string
}

/**
 * Validate email format
 */
export function validateEmail(email: string): ValidationResult {
  if (!email.trim()) {
    return { isValid: false, message: 'Email é obrigatório' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Email inválido' }
  }

  return { isValid: true }
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): ValidationResult {
  if (!password.trim()) {
    return { isValid: false, message: 'Senha é obrigatória' }
  }

  if (password.length < 6) {
    return { isValid: false, message: 'Senha deve ter pelo menos 6 caracteres' }
  }

  if (password.length > 128) {
    return { isValid: false, message: 'Senha deve ter no máximo 128 caracteres' }
  }

  return { isValid: true }
}

/**
 * Validate password confirmation
 */
export function validatePasswordConfirmation(password: string, confirmPassword: string): ValidationResult {
  if (password !== confirmPassword) {
    return { isValid: false, message: 'Senhas não coincidem' }
  }

  return { isValid: true }
}

/**
 * Validate name field
 */
export function validateName(name: string): ValidationResult {
  if (!name.trim()) {
    return { isValid: false, message: 'Nome é obrigatório' }
  }

  if (name.trim().length < 2) {
    return { isValid: false, message: 'Nome deve ter pelo menos 2 caracteres' }
  }

  if (name.trim().length > 100) {
    return { isValid: false, message: 'Nome deve ter no máximo 100 caracteres' }
  }

  return { isValid: true }
}

/**
 * Validate login form
 */
export function validateLoginForm(email: string, password: string): ValidationResult {
  const emailValidation = validateEmail(email)
  if (!emailValidation.isValid) {
    return emailValidation
  }

  const passwordValidation = validatePassword(password)
  if (!passwordValidation.isValid) {
    return passwordValidation
  }

  return { isValid: true }
}

/**
 * Validate register form
 */
export function validateRegisterForm(
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): ValidationResult {
  const nameValidation = validateName(name)
  if (!nameValidation.isValid) {
    return nameValidation
  }

  const emailValidation = validateEmail(email)
  if (!emailValidation.isValid) {
    return emailValidation
  }

  const passwordValidation = validatePassword(password)
  if (!passwordValidation.isValid) {
    return passwordValidation
  }

  const confirmValidation = validatePasswordConfirmation(password, confirmPassword)
  if (!confirmValidation.isValid) {
    return confirmValidation
  }

  return { isValid: true }
}

/**
 * Get error message from validation result
 */
export function getValidationError(result: ValidationResult): string {
  return result.message || ''
}

/**
 * Check if form field has error
 */
export function hasValidationError(result: ValidationResult): boolean {
  return !result.isValid
}