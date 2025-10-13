import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from './config'

/**
 * Faz upload de um arquivo para o Firebase Storage
 * @param file - Arquivo a ser enviado
 * @param path - Caminho no Storage (ex: 'maintenance/user123/file.pdf')
 * @returns URL de download do arquivo
 */
export async function uploadFile(file: File, path: string): Promise<string> {
  try {
    const fileRef = storageRef(storage, path)
    const snapshot = await uploadBytes(fileRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)
    return downloadURL
  } catch (error) {
    console.error('Error uploading file:', error)
    throw new Error('Falha ao fazer upload do arquivo')
  }
}

/**
 * Deleta um arquivo do Firebase Storage
 * @param path - Caminho do arquivo no Storage
 */
export async function deleteFile(path: string): Promise<void> {
  try {
    const fileRef = storageRef(storage, path)
    await deleteObject(fileRef)
  } catch (error) {
    console.error('Error deleting file:', error)
    throw new Error('Falha ao deletar o arquivo')
  }
}

/**
 * Extrai o path do Storage a partir da URL de download
 * @param url - URL de download do Firebase Storage
 * @returns Path do arquivo no Storage
 */
export function getPathFromURL(url: string): string {
  try {
    const baseUrl = 'https://firebasestorage.googleapis.com/v0/b/'
    if (!url.startsWith(baseUrl)) {
      throw new Error('URL inválida')
    }
    
    const parts = url.split('/o/')
    if (parts.length < 2) {
      throw new Error('URL mal formatada')
    }
    
    const pathWithParams = parts[1]
    const path = pathWithParams.split('?')[0]
    return decodeURIComponent(path)
  } catch (error) {
    console.error('Error parsing storage URL:', error)
    throw new Error('Falha ao processar URL do arquivo')
  }
}

/**
 * Valida o tipo e tamanho do arquivo
 * @param file - Arquivo a ser validado
 * @param maxSizeMB - Tamanho máximo em MB (padrão: 5MB)
 * @param allowedTypes - Tipos MIME permitidos
 * @returns true se válido, throw Error se inválido
 */
export function validateFile(
  file: File,
  maxSizeMB: number = 5,
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
): boolean {
  // Validar tamanho
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
