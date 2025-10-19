import { storage } from '@/firebase/config'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { logger } from './logger'

/**
 * Convert base64 data URL to Blob
 */
export function dataURLtoBlob(dataURL: string): Blob {
  const parts = dataURL.split(',')
  const mimeMatch = parts[0].match(/:(.*?);/)
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg'
  const base64 = parts[1]
  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  
  return new Blob([bytes], { type: mime })
}

/**
 * Upload image to Firebase Storage
 * @param dataURL - Base64 data URL
 * @param path - Storage path (e.g., 'vehicles/userId/vehicleId/image.jpg')
 * @returns Download URL
 */
export async function uploadImage(dataURL: string, path: string): Promise<string> {
  try {
    logger.info('📤 Uploading image to Storage:', path)
    
    // Convert data URL to Blob
    const blob = dataURLtoBlob(dataURL)
    logger.debug('📦 Blob size:', blob.size, 'bytes')
    
    // Upload to Firebase Storage
    const storageRef = ref(storage, path)
    const snapshot = await uploadBytes(storageRef, blob)
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref)
    logger.info('✅ Image uploaded successfully:', downloadURL.substring(0, 100) + '...')
    
    return downloadURL
  } catch (error) {
    logger.error('❌ Error uploading image:', error)
    throw error
  }
}

/**
 * Delete image from Firebase Storage
 * @param url - Download URL or storage path
 */
export async function deleteImage(url: string): Promise<void> {
  try {
    // Se for uma URL, extrair o path
    let path = url
    if (url.includes('firebasestorage.googleapis.com')) {
      const urlObj = new URL(url)
      const pathMatch = urlObj.pathname.match(/\/o\/(.+?)\?/)
      if (pathMatch) {
        path = decodeURIComponent(pathMatch[1])
      }
    }
    
    logger.info('🗑️ Deleting image from Storage:', path)
    
    const storageRef = ref(storage, path)
    await deleteObject(storageRef)
    
    logger.info('✅ Image deleted successfully')
  } catch (error) {
    logger.error('❌ Error deleting image:', error)
    // Não propagar erro se imagem não existir
    const errorCode = (error as { code?: string })?.code
    if (errorCode !== 'storage/object-not-found') {
      throw error
    }
  }
}

/**
 * Upload vehicle image
 * @param userId - User ID
 * @param vehicleId - Vehicle ID
 * @param dataURL - Base64 data URL
 * @returns Download URL
 */
export async function uploadVehicleImage(
  userId: string,
  vehicleId: string,
  dataURL: string
): Promise<string> {
  const timestamp = Date.now()
  const path = `vehicles/${userId}/${vehicleId}/image_${timestamp}.jpg`
  return uploadImage(dataURL, path)
}

/**
 * Upload maintenance photo (before/after)
 * @param userId - User ID
 * @param maintenanceId - Maintenance ID
 * @param dataURL - Base64 data URL
 * @param type - 'before' or 'after'
 * @returns Download URL
 */
export async function uploadMaintenancePhoto(
  userId: string,
  maintenanceId: string,
  dataURL: string,
  type: 'before' | 'after'
): Promise<string> {
  const timestamp = Date.now()
  const path = `maintenance/${userId}/${maintenanceId}/${type}_${timestamp}.jpg`
  return uploadImage(dataURL, path)
}

/**
 * Upload maintenance attachment
 * @param userId - User ID
 * @param maintenanceId - Maintenance ID
 * @param dataURL - Base64 data URL
 * @param fileName - Original file name
 * @returns Download URL
 */
export async function uploadMaintenanceAttachment(
  userId: string,
  maintenanceId: string,
  dataURL: string,
  fileName: string
): Promise<string> {
  const timestamp = Date.now()
  // Sanitize: remove caracteres especiais, múltiplos underscores, normalizar
  const sanitizedName = fileName
    .normalize('NFD') // Decompor acentos
    .replace(/[\u0300-\u036f]/g, '') // Remover marcas diacríticas
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Substituir especiais por _
    .replace(/_+/g, '_') // Múltiplos _ vira um só
    .replace(/^_|_$/g, '') // Remove _ no início/fim
  const path = `maintenance/${userId}/${maintenanceId}/attachments/${timestamp}_${sanitizedName}`
  return uploadImage(dataURL, path)
}

/**
 * Check if a string is a base64 data URL
 */
export function isBase64DataURL(str: string): boolean {
  return str.startsWith('data:') && str.includes('base64')
}

/**
 * Check if a string is a Firebase Storage URL
 */
export function isStorageURL(str: string): boolean {
  return str.includes('firebasestorage.googleapis.com')
}
