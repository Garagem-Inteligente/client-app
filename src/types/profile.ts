// Profile Types
export interface ProfileEditForm {
  name: string
  email: string
  phone?: string
}

export interface PasswordChangeForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface PasswordStrength {
  score: number
  label: 'Fraca' | 'Média' | 'Forte' | 'Muito Forte'
  class: string
}

export type AuthProvider = 'password' | 'google.com' | 'facebook.com' | 'twitter.com'

export interface PhotoActionButton {
  text: string
  icon?: string
  role?: string
  handler?: () => void
}

export interface ProfileModalState {
  showPhotoSheet: boolean
  showRemovePhotoModal: boolean
  showUnlinkGoogleModal: boolean
  showDeleteAccountModal: boolean
  showEditModal: boolean
  showConnectionsModal: boolean
  showAboutModal: boolean
  showPasswordModal: boolean
}

export interface ProfilePhotoState {
  currentPhotoUrl: string
  photoLoadError: boolean
}

export interface ProfileLoadingState {
  savingProfile: boolean
  unlinkingGoogle: boolean
  changingPassword: boolean
}

export interface ProfileErrorState {
  passwordError: string
}