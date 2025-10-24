import { computed } from 'vue'
import { useRouter } from 'vue-router'

export interface QuickAction {
  id: string
  title: string
  subtitle: string
  color: string
  icon: string
  action: () => void
}

export function useQuickActions() {
  const router = useRouter()

  const quickActions = computed<QuickAction[]>(() => [
    {
      id: 'add-vehicle',
      title: 'Adicionar Veículo',
      subtitle: 'Cadastrar novo carro',
      color: 'blue',
      icon: 'add',
      action: () => router.push('/tabs/vehicle/new')
    },
    {
      id: 'add-maintenance',
      title: 'Registrar Manutenção',
      subtitle: 'Adicionar serviço realizado',
      color: 'green',
      icon: 'construct',
      action: () => router.push('/tabs/maintenance/new')
    },
    {
      id: 'view-vehicles',
      title: 'Meus Veículos',
      subtitle: 'Ver todos os carros',
      color: 'purple',
      icon: 'car',
      action: () => router.push('/tabs/vehicles')
    },
    {
      id: 'view-maintenance',
      title: 'Histórico',
      subtitle: 'Ver todas as manutenções',
      color: 'orange',
      icon: 'clipboard',
      action: () => router.push('/tabs/maintenance')
    }
  ])

  const handleAction = (action: QuickAction) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    setTimeout(() => {
      action.action()
    }, 10)
  }

  return {
    quickActions,
    handleAction
  }
}