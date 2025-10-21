<template>
  <div class="file-upload-container">
    <div 
      class="upload-area"
      :class="{ 'dragging': isDragging }"
      @click="triggerFileInput"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <input
        ref="fileInputRef"
        type="file"
        :multiple="maxFiles > 1"
        :accept="accept"
        @change="handleFileSelect"
        style="display: none"
      />
      
      <div class="upload-content">
        <ion-icon :icon="cloudUploadOutline" class="upload-icon"></ion-icon>
        <p class="upload-text">Clique ou arraste arquivos aqui</p>
        <p class="upload-hint">
          Máximo {{ maxFiles }} arquivo(s) - {{ maxSize }}MB cada
        </p>
      </div>
    </div>

    <!-- Files List -->
    <div v-if="files.length > 0" class="files-list">
      <div
        v-for="(file, index) in files"
        :key="index"
        class="file-item"
        :class="{ 'uploading': file.uploading, 'error': file.error }"
      >
        <div class="file-info">
          <ion-icon 
            :icon="getFileIcon(file.file.type)" 
            class="file-icon"
            :class="{ 'error-icon': file.error }"
          ></ion-icon>
          <div class="file-details">
            <p class="file-name">{{ file.file.name }}</p>
            <p class="file-size" :class="{ 'error-text-small': file.error }">
              {{ file.error || formatFileSize(file.file.size) }}
            </p>
          </div>
        </div>

        <div class="file-actions">
          <!-- Progress -->
          <div v-if="file.uploading" class="progress-container">
            <ion-progress-bar :value="file.progress / 100"></ion-progress-bar>
            <span class="progress-text">{{ file.progress }}%</span>
          </div>

          <!-- Error - Show remove button prominently -->
          <div v-else-if="file.error" class="action-buttons">
            <ion-button 
              fill="solid" 
              size="small" 
              color="danger"
              @click="removeFile(index)"
            >
              <template v-slot:start>
<ion-icon  :icon="trashOutline"></ion-icon>
</template>
              Remover
            </ion-button>
          </div>

          <!-- Success & Remove -->
          <div v-else class="action-buttons">
            <ion-icon :icon="checkmarkCircleOutline" class="success-icon"></ion-icon>
            <ion-button 
              fill="clear" 
              size="small" 
              color="danger"
              @click="removeFile(index)"
            >
              <ion-icon slot="icon-only" :icon="trashOutline"></ion-icon>
            </ion-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <AAlert 
      v-if="uploadError" 
      type="error" 
      :message="uploadError"
      @close="uploadError = null"
      class="mt-4"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  IonIcon, 
  IonProgressBar, 
  IonButton 
} from '@ionic/vue'
import {
  cloudUploadOutline,
  documentTextOutline,
  imageOutline,
  videocamOutline,
  musicalNotesOutline,
  archiveOutline,
  checkmarkCircleOutline,
  trashOutline
} from 'ionicons/icons'
import AAlert from '@/components/atoms/AAlert.vue'

export interface FileUploadItem {
  file: File
  base64?: string
  uploading: boolean
  progress: number
  error?: string
}

interface Props {
  maxFiles?: number
  maxSize?: number // MB
  accept?: string
}

const props = withDefaults(defineProps<Props>(), {
  maxFiles: 5,
  maxSize: 5,
  accept: '*/*'
})

const emit = defineEmits<{
  filesSelected: [files: FileUploadItem[]]
  filesChanged: [files: FileUploadItem[]]
}>()

const fileInputRef = ref<HTMLInputElement>()
const files = ref<FileUploadItem[]>([])
const isDragging = ref(false)
const uploadError = ref<string | null>(null)

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const validateFile = (file: File): string | null => {
  // Check max files
  if (files.value.length >= props.maxFiles) {
    return `Máximo de ${props.maxFiles} arquivo(s)`
  }

  // Check file size
  const fileSizeMB = file.size / (1024 * 1024)
  const maxSizeMB = props.maxSize
  
  if (file.size > maxSizeMB * 1024 * 1024) {
    return `Arquivo muito grande: ${fileSizeMB.toFixed(1)}MB (máx ${maxSizeMB}MB)`
  }

  // Warn for large files (between 5-10MB)
  if (fileSizeMB > 5 && fileSizeMB <= maxSizeMB) {
    console.warn(`⚠️ Arquivo grande detectado: ${file.name} (${fileSizeMB.toFixed(1)}MB)`)
  }

  return null
}

const processFile = async (file: File): Promise<FileUploadItem> => {
  const item: FileUploadItem = {
    file,
    uploading: true,
    progress: 0
  }

  // Validate
  const error = validateFile(file)
  if (error) {
    item.error = error
    item.uploading = false
    return item
  }

  // Convert to Base64
  try {
    item.progress = 30
    const base64 = await fileToBase64(file)
    item.base64 = base64
    item.progress = 100
    item.uploading = false
  } catch (err) {
    item.error = 'Erro ao processar arquivo'
    item.uploading = false
  }

  return item
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const handleFileSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files) return

  await processFiles(Array.from(input.files))
  input.value = '' // Reset input
}

const handleDrop = async (event: DragEvent) => {
  isDragging.value = false
  if (!event.dataTransfer?.files) return

  await processFiles(Array.from(event.dataTransfer.files))
}

const processFiles = async (filesList: File[]) => {
  uploadError.value = null
  
  // Check if adding these files would exceed the limit
  const totalFiles = files.value.length + filesList.length
  if (totalFiles > props.maxFiles) {
    uploadError.value = `⚠️ Você selecionou ${filesList.length} arquivo(s), mas só é possível adicionar mais ${props.maxFiles - files.value.length}. Remova arquivos existentes ou selecione menos arquivos.`
  }

  // Check for oversized files before processing
  const oversizedFiles = filesList.filter(f => f.size > props.maxSize * 1024 * 1024)
  if (oversizedFiles.length > 0) {
    const fileDetails = oversizedFiles.map(f => 
      `• ${f.name}: ${(f.size / (1024 * 1024)).toFixed(1)}MB`
    ).join('\n')
    
    uploadError.value = `❌ Arquivo(s) muito grande(s) (máx ${props.maxSize}MB):\n${fileDetails}\n\n💡 Dica: Comprima o PDF antes de anexar ou use uma resolução menor para imagens.`
  }

  for (const file of filesList) {
    const item = await processFile(file)
    files.value.push(item)
    
    // If there's an error and it's about max files, show a more helpful message
    if (item.error && item.error.includes('Máximo de')) {
      uploadError.value = `⚠️ Limite de ${props.maxFiles} arquivo(s) atingido! Remova alguns arquivos antes de adicionar novos.`
    }
  }

  emit('filesSelected', files.value)
  emit('filesChanged', files.value)
}

const removeFile = (index: number) => {
  files.value.splice(index, 1)
  emit('filesChanged', files.value)
}

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return imageOutline
  if (mimeType.startsWith('video/')) return videocamOutline
  if (mimeType.startsWith('audio/')) return musicalNotesOutline
  if (mimeType.includes('pdf') || mimeType.includes('document')) return documentTextOutline
  if (mimeType.includes('zip') || mimeType.includes('compressed')) return archiveOutline
  return documentTextOutline
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// Expose files for parent component
defineExpose({
  files,
  clear: () => { files.value = [] }
})
</script>

<style scoped>
.file-upload-container {
  width: 100%;
}

.upload-area {
  border: 2px dashed #4b5563; /* border-gray-600 */
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: #1f2937; /* bg-gray-800 */
}

.upload-area:hover,
.upload-area.dragging {
  border-color: #3b82f6; /* border-blue-500 */
  background: rgba(59, 130, 246, 0.05);
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.upload-icon {
  font-size: 3rem;
  color: #9ca3af; /* text-gray-400 */
}

.upload-area:hover .upload-icon {
  color: #3b82f6; /* text-blue-500 */
}

.upload-text {
  color: white;
  font-weight: 500;
}

.upload-hint {
  font-size: 0.875rem;
  color: #9ca3af; /* text-gray-400 */
}

/* Files List */
.files-list {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: #1f2937; /* bg-gray-800 */
  border: 1px solid #374151; /* border-gray-700 */
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.file-item.uploading {
  border-color: #3b82f6; /* border-blue-500 */
}

.file-item.error {
  border-color: #ef4444; /* border-red-500 */
  background: rgba(239, 68, 68, 0.05);
}

.file-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  min-width: 0;
}

.file-icon {
  font-size: 2rem;
  color: #3b82f6; /* text-blue-500 */
  flex-shrink: 0;
}

.file-icon.error-icon {
  color: #ef4444; /* text-red-500 */
}

.file-details {
  min-width: 0;
  flex: 1;
}

.file-name {
  color: white;
  font-weight: 500;
  font-size: 0.875rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  color: #9ca3af; /* text-gray-400 */
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.file-size.error-text-small {
  color: #ef4444; /* text-red-500 */
  font-weight: 500;
}

.file-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.progress-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
  min-width: 120px;
}

.progress-text {
  font-size: 0.75rem;
  color: #3b82f6; /* text-blue-500 */
  font-weight: 600;
}

.error-text {
  font-size: 0.75rem;
  color: #ef4444; /* text-red-500 */
  font-weight: 500;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-buttons ion-button {
  --color: #ef4444; /* red-500 */
}

.action-buttons ion-button ion-icon {
  color: #ef4444; /* red-500 */
  font-size: 1.25rem;
}

.success-icon {
  font-size: 1.5rem;
  color: #10b981; /* text-green-500 */
}

ion-progress-bar {
  width: 100px;
}
</style>
