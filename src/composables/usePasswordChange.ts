import { ref, computed } from 'vue'
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth'
import { auth } from '@/firebase/config'
import { translateFirebaseError } from '@/utils/errorMessages'
import { calculatePasswordStrength, validatePasswordForm } from '@/utils/password'
import type { PasswordChangeForm, PasswordStrength } from '@/types'

export function usePasswordChange() {
  // State
  const passwordForm = ref<PasswordChangeForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const changingPassword = ref(false)
  const passwordError = ref('')

  // Computed
  const passwordStrength = computed<PasswordStrength>(() =>
    calculatePasswordStrength(passwordForm.value.newPassword)
  )

  const isPasswordFormValid = computed(() => {
    const validation = validatePasswordForm(
      passwordForm.value.currentPassword,
      passwordForm.value.newPassword,
      passwordForm.value.confirmPassword
    )
    return validation.isValid
  })

  const passwordErrors = computed(() => {
    return validatePasswordForm(
      passwordForm.value.currentPassword,
      passwordForm.value.newPassword,
      passwordForm.value.confirmPassword
    ).errors
  })

  // Methods
  const changePassword = async (): Promise<boolean> => {
    if (!auth.currentUser?.email) {
      passwordError.value = 'Usuário não autenticado'
      return false
    }

    if (!isPasswordFormValid.value) {
      passwordError.value = 'Preencha todos os campos corretamente'
      return false
    }

    changingPassword.value = true
    passwordError.value = ''

    try {
      // Reautenticar usuário
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        passwordForm.value.currentPassword
      )

      await reauthenticateWithCredential(auth.currentUser, credential)

      // Atualizar senha
      await updatePassword(auth.currentUser, passwordForm.value.newPassword)

      // Limpar formulário
      passwordForm.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }

      return true

    } catch (error) {
      console.error('Erro ao alterar senha:', error)
      passwordError.value = translateFirebaseError(
        error,
        'Erro ao alterar senha. Verifique sua senha atual.'
      )
      return false
    } finally {
      changingPassword.value = false
    }
  }

  const resetForm = () => {
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
    passwordError.value = ''
  }

  return {
    // State
    passwordForm,
    changingPassword,
    passwordError,

    // Computed
    passwordStrength,
    isPasswordFormValid,
    passwordErrors,

    // Methods
    changePassword,
    resetForm,
  }
}