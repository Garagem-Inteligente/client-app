<template>
  <div class="min-h-screen bg-gray-900">
    <Navbar />
    
    <div class="max-w-4xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">👤 Meu Perfil</h1>
        <p class="text-gray-400">Gerencie suas informações pessoais e configurações de conta</p>
      </div>

      <!-- Photo Section -->
      <Card title="📸 Foto de Perfil" class="mb-6">
        <div class="flex items-center gap-6">
          <div class="relative">
            <div v-if="photoURL" class="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-700">
              <img :src="photoURL" alt="Foto de perfil" class="w-full h-full object-cover" />
            </div>
            <div v-else class="w-24 h-24 rounded-full bg-gray-700 border-4 border-gray-600 flex items-center justify-center">
              <span class="text-3xl text-gray-400">👤</span>
            </div>
            
            <!-- Badge de upload -->
            <label 
              for="photo-upload" 
              class="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 rounded-full p-2 cursor-pointer transition-colors"
              :class="{ 'opacity-50 cursor-not-allowed': uploadingPhoto }"
            >
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </label>
            <input
              type="file"
              id="photo-upload"
              accept="image/*"
              @change="handlePhotoUpload"
              class="hidden"
              :disabled="uploadingPhoto"
            />
          </div>
          
          <div class="flex-1">
            <h3 class="text-white font-semibold mb-1">Alterar Foto</h3>
            <p class="text-sm text-gray-400 mb-3">
              JPG, PNG ou GIF • Máximo 2MB
            </p>
            <Button 
              v-if="photoURL"
              variant="outline" 
              size="sm"
              @click="removePhoto"
              :disabled="uploadingPhoto"
              class="!text-red-400 !border-red-400/30 hover:!bg-red-400/10"
            >
              Remover Foto
            </Button>
          </div>
        </div>
      </Card>

      <!-- Personal Info -->
      <Card title="ℹ️ Informações Pessoais" class="mb-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Nome Completo</label>
            <Input v-model="displayName" placeholder="Seu nome" :disabled="savingProfile" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">E-mail</label>
            <Input 
              :model-value="currentUser?.email || ''" 
              disabled 
              class="!bg-gray-800/50 !cursor-not-allowed"
            />
            <p class="text-xs text-gray-500 mt-1">
              O e-mail não pode ser alterado por questões de segurança
            </p>
          </div>

          <div class="flex justify-end">
            <Button 
              @click="saveProfile"
              :disabled="savingProfile || !displayName.trim()"
              :loading="savingProfile"
            >
              {{ savingProfile ? 'Salvando...' : 'Salvar Alterações' }}
            </Button>
          </div>
        </div>
      </Card>

      <!-- Password Change -->
      <Card title="🔒 Alterar Senha" class="mb-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Senha Atual</label>
            <Input 
              v-model="currentPassword" 
              type="password" 
              placeholder="Digite sua senha atual"
              :disabled="changingPassword"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Nova Senha</label>
            <Input 
              v-model="newPassword" 
              type="password" 
              placeholder="Digite a nova senha (mínimo 6 caracteres)"
              :disabled="changingPassword"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Confirmar Nova Senha</label>
            <Input 
              v-model="confirmPassword" 
              type="password" 
              placeholder="Confirme a nova senha"
              :disabled="changingPassword"
            />
          </div>

          <div class="flex justify-end">
            <Button 
              @click="changePassword"
              :disabled="changingPassword || !currentPassword || !newPassword || !confirmPassword"
              :loading="changingPassword"
            >
              {{ changingPassword ? 'Alterando...' : 'Alterar Senha' }}
            </Button>
          </div>
        </div>
      </Card>

      <!-- Danger Zone -->
      <Card title="⚠️ Zona de Perigo" class="mb-6 !border-red-500/30">
        <div class="space-y-4">
          <div class="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <h4 class="font-semibold text-red-400 mb-2">Excluir Conta</h4>
            <p class="text-sm text-gray-400 mb-4">
              Esta ação é <strong>irreversível</strong>. Todos os seus dados, incluindo veículos e histórico de manutenções, serão permanentemente excluídos.
            </p>
            <Button 
              variant="outline"
              @click="confirmDeleteAccount"
              class="!text-red-400 !border-red-400 hover:!bg-red-400/10"
            >
              Excluir Minha Conta
            </Button>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { auth } from '../firebase/config'
import { 
  updateProfile, 
  updatePassword, 
  EmailAuthProvider, 
  reauthenticateWithCredential,
  deleteUser 
} from 'firebase/auth'
import Card from '../components/Card.vue'
import Button from '../components/Button.vue'
import Input from '../components/Input.vue'
import Navbar from '../components/Navbar.vue'

const router = useRouter()
const authStore = useAuthStore()

const currentUser = computed(() => auth.currentUser)

// Photo state
const photoURL = ref(currentUser.value?.photoURL || '')
const uploadingPhoto = ref(false)

// Profile state
const displayName = ref(currentUser.value?.displayName || '')
const savingProfile = ref(false)

// Password state
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const changingPassword = ref(false)

// Photo upload
const handlePhotoUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  
  if (!file) return
  
  // Validar tamanho (2MB max)
  if (file.size > 2 * 1024 * 1024) {
    alert('Arquivo muito grande. Máximo: 2MB')
    return
  }
  
  uploadingPhoto.value = true
  
  try {
    const reader = new window.FileReader()
    
    reader.onload = async (evt: ProgressEvent<FileReader>) => {
      try {
        const base64 = evt.target?.result as string
        
        if (!currentUser.value) return
        
        await updateProfile(currentUser.value, {
          photoURL: base64
        })
        
        photoURL.value = base64
        alert('Foto atualizada com sucesso!')
      } catch (error) {
        console.error('Erro ao atualizar foto:', error)
        alert('Erro ao atualizar foto. Tente novamente.')
      } finally {
        uploadingPhoto.value = false
      }
    }
    
    reader.onerror = () => {
      alert('Erro ao ler o arquivo.')
      uploadingPhoto.value = false
    }
    
    reader.readAsDataURL(file)
  } catch (error) {
    console.error('Erro ao processar foto:', error)
    alert('Erro ao processar foto.')
    uploadingPhoto.value = false
  }
}

const removePhoto = async () => {
  if (!confirm('Tem certeza que deseja remover sua foto de perfil?')) return
  
  uploadingPhoto.value = true
  
  try {
    if (!currentUser.value) return
    
    await updateProfile(currentUser.value, {
      photoURL: null
    })
    
    photoURL.value = ''
    alert('Foto removida com sucesso!')
  } catch (error) {
    console.error('Erro ao remover foto:', error)
    alert('Erro ao remover foto. Tente novamente.')
  } finally {
    uploadingPhoto.value = false
  }
}

// Save profile
const saveProfile = async () => {
  if (!displayName.value.trim()) {
    alert('Por favor, preencha seu nome.')
    return
  }
  
  savingProfile.value = true
  
  try {
    if (!currentUser.value) return
    
    await updateProfile(currentUser.value, {
      displayName: displayName.value.trim()
    })
    
    alert('Perfil atualizado com sucesso!')
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error)
    alert('Erro ao atualizar perfil. Tente novamente.')
  } finally {
    savingProfile.value = false
  }
}

// Change password
const changePassword = async () => {
  if (newPassword.value.length < 6) {
    alert('A nova senha deve ter no mínimo 6 caracteres.')
    return
  }
  
  if (newPassword.value !== confirmPassword.value) {
    alert('As senhas não coincidem.')
    return
  }
  
  changingPassword.value = true
  
  try {
    if (!currentUser.value || !currentUser.value.email) return
    
    // Reautenticar
    const credential = EmailAuthProvider.credential(
      currentUser.value.email,
      currentPassword.value
    )
    
    await reauthenticateWithCredential(currentUser.value, credential)
    
    // Alterar senha
    await updatePassword(currentUser.value, newPassword.value)
    
    // Limpar campos
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    
    alert('Senha alterada com sucesso!')
  } catch (error: any) {
    console.error('Erro ao alterar senha:', error)
    
    if (error.code === 'auth/wrong-password') {
      alert('Senha atual incorreta.')
    } else {
      alert('Erro ao alterar senha. Tente novamente.')
    }
  } finally {
    changingPassword.value = false
  }
}

// Delete account
const confirmDeleteAccount = async () => {
  const confirmation1 = confirm(
    '⚠️ ATENÇÃO: Esta ação é IRREVERSÍVEL!\n\n' +
    'Todos os seus dados serão permanentemente excluídos:\n' +
    '• Veículos cadastrados\n' +
    '• Histórico de manutenções\n' +
    '• Documentos e fotos\n' +
    '• Configurações de conta\n\n' +
    'Deseja realmente continuar?'
  )
  
  if (!confirmation1) return
  
  const confirmation2 = confirm(
    'ÚLTIMA CONFIRMAÇÃO\n\n' +
    'Tem ABSOLUTA CERTEZA que deseja excluir sua conta?\n\n' +
    'Esta ação NÃO PODE ser desfeita!'
  )
  
  if (!confirmation2) return
  
  // Solicitar senha para reautenticação
  const password = prompt('Digite sua senha para confirmar a exclusão:')
  
  if (!password) {
    alert('Exclusão cancelada.')
    return
  }
  
  try {
    if (!currentUser.value || !currentUser.value.email) return
    
    // Reautenticar
    const credential = EmailAuthProvider.credential(
      currentUser.value.email,
      password
    )
    
    await reauthenticateWithCredential(currentUser.value, credential)
    
    // Excluir conta
    await deleteUser(currentUser.value)
    
    // Deslogar e redirecionar
    await authStore.logout()
    router.push('/')
    
    alert('Conta excluída com sucesso. Sentiremos sua falta! 😢')
  } catch (error: any) {
    console.error('Erro ao excluir conta:', error)
    
    if (error.code === 'auth/wrong-password') {
      alert('Senha incorreta. Exclusão cancelada.')
    } else {
      alert('Erro ao excluir conta. Tente novamente.')
    }
  }
}
</script>
