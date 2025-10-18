import { computed } from 'vue'
import { useRoute } from 'vue-router'

/**
 * Composable para gerenciar navegação hierárquica
 * Define automaticamente o botão de voltar baseado na rota atual
 */
export function useNavigation() {
  const route = useRoute()

  /**
   * Mapa de hierarquia de navegação
   * Define o caminho pai para cada rota
   */
  const navigationHierarchy: Record<string, string> = {
    // Vehicles hierarchy
    '/tabs/vehicle/new': '/tabs/vehicles',
    '/tabs/vehicle/:id': '/tabs/vehicles',
    '/tabs/vehicles': '/tabs/home',

    // Maintenance hierarchy
    '/tabs/maintenance/new': '/tabs/maintenance',
    '/tabs/maintenance/:id/edit': '/tabs/maintenance',
    '/tabs/maintenance/:id': '/tabs/maintenance',
    '/tabs/maintenance': '/tabs/home',

    // Orders hierarchy
    '/tabs/order/:id': '/tabs/orders',
    '/tabs/orders': '/tabs/home',

    // Profile
    '/tabs/profile': '/tabs/home',
  }

  /**
   * Verifica se a rota atual deve mostrar botão de voltar
   */
  const shouldShowBackButton = computed(() => {
    const currentPath = route.path
    
    // Dashboard nunca mostra botão de voltar
    if (currentPath === '/tabs/home') {
      return false
    }

    // Páginas principais das tabs (vehicles, maintenance, orders, profile)
    // mostram botão de voltar para o dashboard
    const mainTabPages = ['/tabs/vehicles', '/tabs/maintenance', '/tabs/orders', '/tabs/profile']
    if (mainTabPages.includes(currentPath)) {
      return true
    }

    // Sub-páginas sempre mostram botão de voltar
    return true
  })

  /**
   * Retorna o caminho de navegação pai baseado na rota atual
   */
  const backPath = computed(() => {
    const currentPath = route.path

    // Tenta encontrar match exato primeiro
    if (navigationHierarchy[currentPath]) {
      return navigationHierarchy[currentPath]
    }

    // Tenta encontrar match com parâmetros dinâmicos
    for (const [pattern, parentPath] of Object.entries(navigationHierarchy)) {
      if (pattern.includes(':id')) {
        const regex = new RegExp('^' + pattern.replace(':id', '[^/]+') + '$')
        if (regex.test(currentPath)) {
          return parentPath
        }
      }
    }

    // Fallback: volta para a página anterior
    return ''
  })

  /**
   * Retorna o título da página pai (para acessibilidade)
   */
  const backLabel = computed(() => {
    const path = backPath.value
    const labels: Record<string, string> = {
      '/tabs/home': 'Dashboard',
      '/tabs/vehicles': 'Veículos',
      '/tabs/maintenance': 'Manutenções',
      '/tabs/orders': 'Pedidos',
      '/tabs/profile': 'Perfil',
    }
    return labels[path] || 'Voltar'
  })

  return {
    shouldShowBackButton,
    backPath,
    backLabel,
  }
}
