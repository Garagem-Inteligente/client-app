import { storage } from '@/firebase/config'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { logger } from './logger'

/**
 * Compress and remove EXIF metadata from image
 * @param dataURL - Base64 data URL
 * @param maxWidth - Maximum width (default: 1920)
 * @param maxHeight - Maximum height (default: 1920)
 * @param quality - JPEG quality 0-1 (default: 0.8)
 * @returns Compressed data URL without EXIF
 */
export async function compressImage(
  dataURL: string,
  maxWidth = 1920,
  maxHeight = 1920,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    
    img.onload = () => {
      // Calculate new dimensions maintaining aspect ratio
      let width = img.width
      let height = img.height
      
      if (width > maxWidth || height > maxHeight) {
        const aspectRatio = width / height
        
        if (width > height) {
          width = maxWidth
          height = width / aspectRatio
        } else {
          height = maxHeight
          width = height * aspectRatio
        }
      }
      
      // Create canvas and draw image (this removes EXIF data)
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Failed to get canvas context'))
        return
      }
      
      // Fill with white background (for transparent PNGs)
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, width, height)
      
      // Draw image (this strips EXIF metadata automatically)
      ctx.drawImage(img, 0, 0, width, height)
      
      // Convert to JPEG with compression
      const compressedDataURL = canvas.toDataURL('image/jpeg', quality)
      
      logger.info('🗜️ Image compressed:', {
        original: `${img.width}x${img.height}`,
        compressed: `${width}x${height}`,
        originalSize: `${Math.round(dataURL.length / 1024)}KB`,
        compressedSize: `${Math.round(compressedDataURL.length / 1024)}KB`,
        reduction: `${Math.round((1 - compressedDataURL.length / dataURL.length) * 100)}%`
      })
      
      resolve(compressedDataURL)
    }
    
    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }
    
    img.src = dataURL
  })
}

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
 * Upload image to Firebase Storage with smart compression
 * @param dataURL - Base64 data URL
 * @param path - Storage path (e.g., 'vehicles/userId/vehicleId/image.jpg')
 * @param compress - Whether to compress (default: true)
 * @returns Download URL
 */
export async function uploadImage(
  dataURL: string, 
  path: string,
  compress = true
): Promise<string> {
  try {
    logger.info('📤 Uploading image to Storage:', path)
    
    let finalDataURL = dataURL
    
    // Smart compression: only compress if it's worth it
    if (compress && dataURL.startsWith('data:image/')) {
      const originalSizeKB = Math.round(dataURL.length / 1024)
      
      // Skip compression for small files (< 200KB)
      if (originalSizeKB < 200) {
        logger.info(`⏭️ Skipping compression (file already small: ${originalSizeKB}KB)`)
      } else {
        try {
          logger.info('🗜️ Compressing image...')
          const compressedDataURL = await compressImage(dataURL)
          const compressedSizeKB = Math.round(compressedDataURL.length / 1024)
          
          // Only use compressed version if it's actually smaller
          if (compressedSizeKB < originalSizeKB) {
            finalDataURL = compressedDataURL
            logger.info(`✅ Compression successful: ${originalSizeKB}KB → ${compressedSizeKB}KB`)
          } else {
            logger.info(`⚠️ Compressed file is larger (${compressedSizeKB}KB vs ${originalSizeKB}KB), using original`)
          }
        } catch (compressError) {
          logger.warn('⚠️ Compression failed, using original:', compressError)
        }
      }
    }
    
    // Convert data URL to Blob
    const blob = dataURLtoBlob(finalDataURL)
    logger.debug('📦 Final blob size:', blob.size, 'bytes', `(${Math.round(blob.size / 1024)}KB)`)
    
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
