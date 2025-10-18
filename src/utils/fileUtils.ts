/**
 * Utilitários para manipulação de arquivos com Base64
 * Armazena arquivos diretamente no Firestore como strings Base64
 * Limite: 1MB por arquivo (adequado para notas fiscais/recibos)
 */

/**
 * Converte um File para Base64
 * @param file - Arquivo a ser convertido
 * @returns Promise com string Base64
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

/**
 * Converte Base64 para Blob (para download)
 * @param base64 - String Base64
 * @returns Blob
 */
export function base64ToBlob(base64: string): Blob {
  const parts = base64.split(';base64,')
  const contentType = parts[0].split(':')[1]
  const raw = window.atob(parts[1])
  const rawLength = raw.length
  const uInt8Array = new Uint8Array(rawLength)

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i)
  }

  return new Blob([uInt8Array], { type: contentType })
}

/**
 * Faz download de um arquivo Base64
 * @param base64 - String Base64
 * @param filename - Nome do arquivo para download
 */
export function downloadBase64File(base64: string, filename: string): void {
  const blob = base64ToBlob(base64)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Valida o tipo e tamanho do arquivo
 * @param file - Arquivo a ser validado
 * @param maxSizeMB - Tamanho máximo em MB (padrão: 1MB para Firestore)
 * @param allowedTypes - Tipos MIME permitidos
 * @returns true se válido, throw Error se inválido
 */
export function validateFile(
  file: File,
  maxSizeMB: number = 1,
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
): boolean {
  // Validar tamanho (máximo 1MB para Firestore)
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  if (file.size > maxSizeBytes) {
    throw new Error(`O arquivo deve ter no máximo ${maxSizeMB}MB`)
  }
  
  // Validar tipo
  if (!allowedTypes.includes(file.type)) {
    const types = allowedTypes.map(t => {
      if (t.startsWith('image/')) return t.split('/')[1].toUpperCase()
      if (t === 'application/pdf') return 'PDF'
      return t
    }).join(', ')
    throw new Error(`Tipo de arquivo não permitido. Aceitos: ${types}`)
  }
  
  return true
}

/**
 * Comprime uma imagem se necessário
 * @param file - Arquivo de imagem
 * @param maxWidth - Largura máxima
 * @param maxHeight - Altura máxima
 * @param quality - Qualidade de compressão (0-1)
 * @returns Promise com File comprimido
 */
export async function compressImage(
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1080,
  quality: number = 0.8
): Promise<File> {
  if (!file.type.startsWith('image/')) {
    return file
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e) => {
      const img = new Image()
      img.src = e.target?.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        // Calcular novas dimensões mantendo aspect ratio
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              })
              resolve(compressedFile)
            } else {
              reject(new Error('Falha ao comprimir imagem'))
            }
          },
          file.type,
          quality
        )
      }
      img.onerror = () => reject(new Error('Falha ao carregar imagem'))
    }
    reader.onerror = () => reject(new Error('Falha ao ler arquivo'))
  })
}

/**
 * Formata o tamanho do arquivo
 * @param bytes - Tamanho em bytes
 * @returns String formatada
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Gera um nome único para o arquivo
 * @param originalName - Nome original do arquivo
 * @param prefix - Prefixo opcional
 * @returns Nome único com timestamp
 */
export function generateUniqueFileName(originalName: string, prefix: string = ''): string {
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substring(2, 8)
  const extension = originalName.split('.').pop()
  const nameWithoutExt = originalName.replace(`.${extension}`, '').replace(/[^a-zA-Z0-9]/g, '_')
  
  return `${prefix}${prefix ? '_' : ''}${nameWithoutExt}_${timestamp}_${randomStr}.${extension}`
}

/**
 * Calcula o tamanho de uma string Base64 em bytes
 * @param base64 - String Base64
 * @returns Tamanho em bytes
 */
export function getBase64Size(base64: string): number {
  const padding = (base64.match(/=/g) || []).length
  const base64Length = base64.length - padding
  return (base64Length * 3) / 4
}

