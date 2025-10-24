import { ref, computed } from 'vue'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { ref as storageRef, uploadString, getDownloadURL, deleteObject } from 'firebase/storage'
import { updateProfile } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'
import { auth, storage, db } from '@/firebase/config'
import { useAuthStore } from '@/stores/auth'
import type { PhotoActionButton, ProfilePhotoState } from '@/types'

// Tipos para tratamento de erros
interface FirebaseError {
  code?: string
  message?: string
}

interface CameraError {
  message?: string
}

// Função utilitária para tratamento de erros específicos do Firebase
const getFirebaseErrorMessage = (error: unknown): string => {
  const errorCode = (error as FirebaseError)?.code || ''

  switch (errorCode) {
    case 'storage/unauthorized':
      return 'Você não tem permissão para fazer upload de fotos.'
    case 'storage/canceled':
      return 'Upload cancelado pelo usuário.'
    case 'storage/quota-exceeded':
      return 'Limite de armazenamento excedido. Tente uma foto menor.'
    case 'storage/invalid-format':
      return 'Formato de arquivo inválido. Use apenas imagens JPG ou PNG.'
    case 'storage/object-not-found':
      return 'Foto não encontrada para remoção.'
    case 'permission-denied':
      return 'Permissão negada. Verifique sua conexão e tente novamente.'
    case 'unavailable':
      return 'Serviço temporariamente indisponível. Tente novamente em alguns minutos.'
    case 'network-request-failed':
      return 'Erro de conexão. Verifique sua internet e tente novamente.'
    default:
      return 'Erro inesperado. Tente novamente ou entre em contato com o suporte.'
  }
}

// Função utilitária para tratamento de erros da câmera
const getCameraErrorMessage = (error: unknown): string => {
  const message = (error as CameraError)?.message || ''
  if (message.includes('User cancelled')) {
    return 'Operação cancelada pelo usuário.'
  }
  if (message.includes('Permission denied')) {
    return 'Permissão de câmera negada. Permita o acesso nas configurações do dispositivo.'
  }
  if (message.includes('Camera not available')) {
    return 'Câmera não disponível neste dispositivo.'
  }
  return 'Erro ao acessar câmera. Tente novamente.'
}

export function useProfilePhoto() {
  const authStore = useAuthStore()

  // State
  const photoState = ref<ProfilePhotoState>({
    currentPhotoUrl: '',
    photoLoadError: false
  })

  // Computed
  const photoActionButtons = computed<PhotoActionButton[]>(() => [
    {
      text: 'Tirar Foto',
      icon: 'cameraOutline',
      handler: () => takePhoto('camera'),
    },
    {
      text: 'Escolher da Galeria',
      icon: 'imagesOutline',
      handler: () => takePhoto('gallery'),
    },
  ])

  // Methods
  const handlePhotoError = () => {
    console.error('Erro ao carregar foto do perfil')
    photoState.value.photoLoadError = true
  }

  const handlePhotoLoad = () => {
    photoState.value.photoLoadError = false
  }

  const takePhoto = async (source: 'camera' | 'gallery') => {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: source === 'camera' ? CameraSource.Camera : CameraSource.Photos,
      })

      if (image.dataUrl) {
        await uploadPhoto(image.dataUrl)
      }
    } catch (error) {
      console.error('Erro ao capturar foto:', error)
      const errorMessage = getCameraErrorMessage(error)
      throw new Error(errorMessage)
    }
  }

  const uploadPhoto = async (dataUrl: string) => {
    if (!auth.currentUser) {
      throw new Error('Usuário não autenticado')
    }

    try {
      const userId = auth.currentUser.uid
      const photoRef = storageRef(storage, `profile-photos/${userId}.jpg`)

      // Upload da imagem
      await uploadString(photoRef, dataUrl, 'data_url')

      // Obter URL de download
      const downloadUrl = await getDownloadURL(photoRef)

      // Atualizar perfil no Firebase Auth
      await updateProfile(auth.currentUser, {
        photoURL: downloadUrl,
      })

      // Atualizar no Firestore
      const userDocRef = doc(db, 'users', userId)
      await updateDoc(userDocRef, {
        photoURL: downloadUrl,
        updatedAt: new Date(),
      })

      // Atualizar estado local
      photoState.value.currentPhotoUrl = downloadUrl
      photoState.value.photoLoadError = false

      // Atualizar store
      authStore.updateUserAvatar(downloadUrl)

    } catch (error) {
      console.error('Erro ao fazer upload da foto:', error)
      throw new Error(getFirebaseErrorMessage(error))
    }
  }

  const removePhoto = async () => {
    if (!auth.currentUser) {
      throw new Error('Usuário não autenticado')
    }

    try {
      const userId = auth.currentUser.uid
      const photoRef = storageRef(storage, `profile-photos/${userId}.jpg`)

      // Remover do Storage
      await deleteObject(photoRef)

      // Atualizar perfil no Firebase Auth
      await updateProfile(auth.currentUser, {
        photoURL: null,
      })

      // Atualizar no Firestore
      const userDocRef = doc(db, 'users', userId)
      await updateDoc(userDocRef, {
        photoURL: null,
        updatedAt: new Date(),
      })

      // Limpar estado local
      photoState.value.currentPhotoUrl = ''
      photoState.value.photoLoadError = false

      // Atualizar store
      authStore.updateUserAvatar(null)

    } catch (error) {
      console.error('Erro ao remover foto:', error)
      throw new Error(getFirebaseErrorMessage(error))
    }
  }

  const initializePhoto = () => {
    if (authStore.user?.avatar) {
      photoState.value.currentPhotoUrl = authStore.user.avatar
    }
  }

  return {
    // State
    photoState,

    // Computed
    photoActionButtons,

    // Methods
    handlePhotoError,
    handlePhotoLoad,
    takePhoto,
    uploadPhoto,
    removePhoto,
    initializePhoto,
  }
}