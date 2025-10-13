<script setup lang="ts">
import { ref, computed } from 'vue'
import { validateFile, fileToBase64, compressImage } from '@/utils/fileUtils'

export interface FileUploadItem {
  file: File
  preview?: string
  base64?: string
  uploading: boolean
  progress: number
  error?: string
}

interface Props {
  modelValue: FileUploadItem[]
  maxFiles?: number
  maxSizeMB?: number
  allowedTypes?: string[]
  disabled?: boolean
  autoCompress?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  maxFiles: 5,
  maxSizeMB: 1, // Reduzido para 1MB (limite Firestore)
  allowedTypes: () => ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
  disabled: false,
  autoCompress: true
})

const emit = defineEmits<{
  'update:modelValue': [files: FileUploadItem[]]
  'error': [message: string]
}>()

const fileInput = ref<HTMLInputElement>()
const isDragging = ref(false)

const files = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const canAddMore = computed(() => files.value.length < props.maxFiles)

const allowedTypesText = computed(() => {
  const types = props.allowedTypes.map(type => {
    if (type === 'application/pdf') return 'PDF'
    if (type.startsWith('image/')) return type.split('/')[1].toUpperCase()
    return type
  })
  return types.join(', ')
})

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files) {
    addFiles(Array.from(target.files))
    target.value = '' // Reset input
  }
}

function handleDrop(event: DragEvent) {
  isDragging.value = false
  if (event.dataTransfer?.files) {
    addFiles(Array.from(event.dataTransfer.files))
  }
}

async function addFiles(newFiles: File[]) {
  if (!canAddMore.value) {
    emit('error', `Máximo de ${props.maxFiles} arquivos permitido`)
    return
  }

  const remainingSlots = props.maxFiles - files.value.length
  const filesToAdd = newFiles.slice(0, remainingSlots)

  for (let file of filesToAdd) {
    try {
      // Validar arquivo
      validateFile(file, props.maxSizeMB, props.allowedTypes)

      // Comprimir imagem se habilitado e necessário
      if (props.autoCompress && file.type.startsWith('image/')) {
        if (file.size > props.maxSizeMB * 1024 * 1024) {
          emit('error', `Comprimindo ${file.name}...`)
          file = await compressImage(file, 1920, 1080, 0.7)
        }
      }

      // Converter para Base64
      const base64 = await fileToBase64(file)

      // Criar preview se for imagem
      let preview: string | undefined
      if (file.type.startsWith('image/')) {
        preview = base64 // Usar o próprio Base64 como preview
      }

      files.value = [
        ...files.value,
        {
          file,
          preview,
          base64,
          uploading: false,
          progress: 0
        }
      ]
    } catch (error) {
      emit('error', error instanceof Error ? error.message : `Erro ao processar ${file.name}`)
    }
  }
}

function removeFile(index: number) {
  const fileToRemove = files.value[index]
  
  // Limpar preview URL se existir
  if (fileToRemove.preview) {
    URL.revokeObjectURL(fileToRemove.preview)
  }

  files.value = files.value.filter((_, i) => i !== index)
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

function getFileIcon(type: string): string {
  if (type === 'application/pdf') return '📄'
  if (type.startsWith('image/')) return '🖼️'
  return '📎'
}
</script>

<template>
  <div class="space-y-4">
    <!-- Drop Zone -->
    <div
      v-if="canAddMore && !disabled"
      class="relative border-2 border-dashed rounded-lg transition-colors"
      :class="{
        'border-blue-500 bg-blue-500/10': isDragging,
        'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500': !isDragging
      }"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <input
        ref="fileInput"
        type="file"
        :multiple="maxFiles > 1"
        :accept="allowedTypes.join(',')"
        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        @change="handleFileSelect"
      />
      
      <div class="p-8 text-center">
        <div class="text-4xl mb-2">📎</div>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
          Arraste arquivos ou clique para selecionar
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-500">
          {{ allowedTypesText }} • Máx {{ maxSizeMB }}MB • Até {{ maxFiles }} arquivos
        </p>
      </div>
    </div>

    <!-- File List -->
    <div v-if="files.length > 0" class="space-y-2">
      <div
        v-for="(item, index) in files"
        :key="index"
        class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <!-- Preview/Icon -->
        <div class="flex-shrink-0 w-12 h-12 rounded overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <img
            v-if="item.preview"
            :src="item.preview"
            :alt="item.file.name"
            class="w-full h-full object-cover"
          />
          <span v-else class="text-2xl">
            {{ getFileIcon(item.file.type) }}
          </span>
        </div>

        <!-- File Info -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
            {{ item.file.name }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ formatFileSize(item.file.size) }}
          </p>

          <!-- Progress Bar -->
          <div
            v-if="item.uploading"
            class="mt-2 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
          >
            <div
              class="h-full bg-blue-500 transition-all duration-300"
              :style="{ width: `${item.progress}%` }"
            />
          </div>

          <!-- Error -->
          <p v-if="item.error" class="mt-1 text-xs text-red-500">
            {{ item.error }}
          </p>
        </div>

        <!-- Remove Button -->
        <button
          v-if="!item.uploading && !disabled"
          type="button"
          class="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 transition-colors"
          @click="removeFile(index)"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Uploading Spinner -->
        <div v-if="item.uploading" class="flex-shrink-0">
          <svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>
