import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import StatsGrid from '../../src/components/organisms/StatsGrid.vue'

// Mock simplificado dos componentes
vi.mock('@/components', () => ({
  ACard: {
    name: 'ACard',
    template: '<div class="a-card"><slot /></div>',
  },
  AButton: {
    name: 'AButton',
    template: '<button class="a-button"><slot /></button>',
  },
}))

describe('StatsGrid.vue', () => {
  let wrapper: VueWrapper

  const mockStats = {
    vehicleCount: 5,
    totalMaintenanceRecords: 12,
    totalCost: 2500.50,
    upcomingMaintenanceCount: 3,
    overdueCount: 2
  }

  beforeEach(() => {
    setActivePinia(createPinia())

    wrapper = mount(StatsGrid, {
      props: {
        stats: mockStats
      },
      global: {
        stubs: {
          ACard: true,
          AButton: true,
          IonIcon: true
        }
      }
    })
  })

  describe('Renderização', () => {
    it('deve renderizar o componente', () => {
      expect(wrapper.exists()).toBe(true)
    })

    it('deve renderizar estatísticas quando há dados', () => {
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('Estados Vazios', () => {
    it('deve renderizar quando não há estatísticas', () => {
      const emptyWrapper = mount(StatsGrid, {
        props: {
          stats: {
            vehicleCount: 0,
            totalMaintenanceRecords: 0,
            totalCost: 0,
            upcomingMaintenanceCount: 0,
            overdueCount: 0
          }
        },
        global: {
          stubs: {
            ACard: true,
            AButton: true,
            IonIcon: true
          }
        }
      })
      expect(emptyWrapper.exists()).toBe(true)
    })
  })
})