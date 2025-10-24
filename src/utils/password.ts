import type { PasswordStrength } from '@/types'

export function calculatePasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return {
      score: 0,
      label: 'Fraca',
      class: 'strength-weak'
    }
  }

  let strength = 0

  // Comprimento
  if (password.length >= 6) strength += 20
  if (password.length >= 8) strength += 20
  if (password.length >= 12) strength += 10

  // Caracteres especiais
  if (/[a-z]/.test(password)) strength += 10
  if (/[A-Z]/.test(password)) strength += 15
  if (/\d/.test(password)) strength += 15
  if (/[^a-zA-Z\d]/.test(password)) strength += 10

  const score = Math.min(strength, 100)

  let label: PasswordStrength['label']
  let className: string

  if (score < 40) {
    label = 'Fraca'
    className = 'strength-weak'
  } else if (score < 70) {
    label = 'Média'
    className = 'strength-medium'
  } else if (score < 90) {
    label = 'Forte'
    className = 'strength-strong'
  } else {
    label = 'Muito Forte'
    className = 'strength-very-strong'
  }

  return {
    score,
    label,
    class: className
  }
}

export function validatePasswordForm(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (currentPassword.length < 6) {
    errors.push('Senha atual deve ter pelo menos 6 caracteres')
  }

  if (newPassword.length < 6) {
    errors.push('Nova senha deve ter pelo menos 6 caracteres')
  }

  if (confirmPassword !== newPassword) {
    errors.push('Confirmação de senha não coincide')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}