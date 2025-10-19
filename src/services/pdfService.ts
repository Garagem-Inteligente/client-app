import { auth } from '@/firebase/config'
import { logger } from '@/utils/logger'

export interface GeneratePDFRequest {
  vehicleId: string
  userId: string
}

export interface GeneratePDFResponse {
  success: boolean
  pdfUrl?: string
  message: string
}

/**
 * Generate maintenance history PDF for a vehicle
 */
export async function generateMaintenancePDF(
  vehicleId: string,
  userId: string
): Promise<string> {
  try {
    logger.info('📄 Generating maintenance PDF...', { vehicleId, userId })

    // Get auth token
    const user = auth.currentUser
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const token = await user.getIdToken()

    // Call HTTP endpoint directly
    const response = await fetch(
      'https://us-central1-autocare-platform.cloudfunctions.net/generateMaintenancePDF',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            vehicleId,
            userId,
          },
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Erro ao gerar PDF')
    }

    const result: GeneratePDFResponse = await response.json()

    if (!result.success || !result.pdfUrl) {
      throw new Error(result.message || 'Erro ao gerar PDF')
    }

    logger.info('✅ PDF generated successfully:', result.pdfUrl.substring(0, 100))

    return result.pdfUrl
  } catch (error) {
    logger.error('❌ Error generating PDF:', error)
    
    // Extract user-friendly error message
    const errorMessage = error instanceof Error ? error.message : 'Erro ao gerar PDF'
    throw new Error(errorMessage)
  }
}

/**
 * Download PDF file
 */
export function downloadPDF(url: string, fileName: string) {
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  logger.info('📥 PDF download initiated:', fileName)
}
