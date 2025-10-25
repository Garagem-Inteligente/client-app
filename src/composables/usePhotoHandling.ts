/**
 * Composable para manipulação de fotos e anexos na página de manutenção
 */

import { documentOutline, documentTextOutline, imageOutline } from 'ionicons/icons'

interface AttachmentFile {
  name: string
  data: string
  type: string
  size: number
}

export const usePhotoHandling = () => {
  const viewPhoto = async (photoUrl: string, type: string): Promise<void> => {
    const overlay = document.createElement('div')
    overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.95);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 20px;
    backdrop-filter: blur(10px);
  `

    const img = document.createElement('img')
    img.src = photoUrl
    img.alt = `Foto ${type} da manutenção`
    img.style.cssText = `
    max-width: 100%;
    max-height: 80vh;
    object-fit: contain;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  `

    const label = document.createElement('div')
    label.textContent = type === 'before' ? '📸 ANTES' : '✅ DEPOIS'
    label.style.cssText = `
    color: white;
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 20px;
    text-transform: uppercase;
    letter-spacing: 2px;
  `

    const closeBtn = document.createElement('button')
    closeBtn.innerHTML = '✕'
    closeBtn.style.cssText = `
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(239, 68, 68, 0.9);
    color: white;
    border: none;
    border-radius: 50%;
    width: 48px;
    height: 48px;
    font-size: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    box-shadow: 0 4px 16px rgba(239, 68, 68, 0.4);
  `

    closeBtn.onmouseover = () => {
      closeBtn.style.background = 'rgba(220, 38, 38, 0.9)'
      closeBtn.style.transform = 'scale(1.1)'
    }

    closeBtn.onmouseout = () => {
      closeBtn.style.background = 'rgba(239, 68, 68, 0.9)'
      closeBtn.style.transform = 'scale(1)'
    }

    const closeOverlay = (): void => {
      overlay.remove()
    }

    closeBtn.onclick = closeOverlay
    overlay.onclick = (e) => {
      if (e.target === overlay) closeOverlay()
    }

    overlay.appendChild(label)
    overlay.appendChild(img)
    overlay.appendChild(closeBtn)
    document.body.appendChild(overlay)
  }

  const downloadPhoto = (photoUrl: string, type: string): void => {
    const link = document.createElement('a')
    link.href = photoUrl
    link.download = `manutencao-${type}-${Date.now()}.jpg`
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const sharePhoto = async (photoUrl: string, type: string): Promise<void> => {
    try {
      if (navigator.share) {
        const response = await fetch(photoUrl)
        const blob = await response.blob()
        const file = new File([blob], `manutencao-${type}.jpg`, { type: 'image/jpeg' })

        await navigator.share({
          title: `Manutenção - Foto ${type}`,
          text: `Foto ${type} da manutenção`,
          files: [file],
        })
      } else {
        await navigator.clipboard.writeText(photoUrl)
        alert('Link da foto copiado para a área de transferência!')
      }
    } catch (error) {
      console.error('Erro ao compartilhar foto:', error)
      downloadPhoto(photoUrl, type)
    }
  }

  const viewAttachment = async (attachment: AttachmentFile): Promise<void> => {
    if (attachment.type.includes('image')) {
      await viewPhoto(attachment.data, attachment.name)
    } else {
      const link = document.createElement('a')
      link.href = attachment.data
      link.download = attachment.name
      document.body.appendChild(link)
      link.click()
      link.remove()
    }
  }

  const getAttachmentIcon = (type: string): typeof imageOutline => {
    if (type.includes('image')) return imageOutline
    if (type.includes('pdf')) return documentOutline
    return documentTextOutline
  }

  return {
    viewPhoto,
    downloadPhoto,
    sharePhoto,
    viewAttachment,
    getAttachmentIcon,
  }
}
