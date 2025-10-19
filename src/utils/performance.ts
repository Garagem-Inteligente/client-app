/**
 * Performance Configuration
 * Disables heavy animations for better performance on low-end devices
 */

// Desabilita animações pesadas em CSS
export const disableHeavyAnimations = () => {
  const style = document.createElement('style')
  style.id = 'performance-mode'
  style.textContent = `
    /* Desabilita animações de entrada pesadas */
    [class*="fadeIn"],
    [class*="slideIn"],
    [class*="bounce"],
    [class*="float"],
    [class*="pulse"] {
      animation: none !important;
    }
    
    /* Remove delays de animação */
    [style*="animation-delay"] {
      animation-delay: 0s !important;
    }
    
    /* Garante que elementos não se movam individualmente */
    .vehicle-card,
    .maintenance-card,
    ion-card,
    [class*="card"] {
      animation: none !important;
      transform: none !important;
    }
  `
  document.head.appendChild(style)
}

// Auto-detect low-end device
export const isLowEndDevice = (): boolean => {
  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 0
  
  // Check device memory (if available)
  const memory = (navigator as { deviceMemory?: number }).deviceMemory || 0
  
  // Consider low-end if less than 4 cores or less than 2GB RAM
  return cores < 4 || (memory > 0 && memory < 2)
}

// Apply performance mode automatically
export const applyPerformanceMode = () => {
  if (isLowEndDevice()) {
    console.log('🚀 Performance mode enabled (low-end device detected)')
    disableHeavyAnimations()
  }
}
