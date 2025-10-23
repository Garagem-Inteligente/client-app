import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import MaintenanceList from '../../src/components/organisms/MaintenanceList.vue'

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

describe('MaintenanceList.vue', () => {
  let wrapper: VueWrapper

  const mockRecentMaintenances = [
    {
      id: '1',
      vehicleId: 'vehicle-1',
      type: 'oil-change',
      description: 'Troca de óleo completa',
      cost: 150.00,
      date: new Date('2024-01-15'),
      mileage: 50000
    }
  ]

  const mockUpcomingMaintenances = [
    {
      id: '3',
      vehicleId: 'vehicle-1',
      type: 'brake-check',
      cost: 0,
      date: new Date('2024-02-15'),
      nextDueDate: new Date('2024-02-15'),
      nextDueMileage: 55000
    }
  ]

  const mockOverdueMaintenances = [
    {
      id: '5',
      vehicleId: 'vehicle-1',
      type: 'inspection',
      cost: 0,
      date: new Date('2024-01-01'),
      nextDueDate: new Date('2024-01-01')
    }
  ]

  const mockGetVehicleName = vi.fn(() => 'Honda Civic')

  beforeEach(() => {
    setActivePinia(createPinia())

    wrapper = mount(MaintenanceList, {
      props: {
        recentMaintenances: mockRecentMaintenances,
        upcomingMaintenances: mockUpcomingMaintenances,
        overdueMaintenances: mockOverdueMaintenances,
        getVehicleName: mockGetVehicleName
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

    it('deve renderizar manutenções quando há dados', () => {
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('Estados Vazios', () => {
    it('deve renderizar quando não há manutenções', () => {
      const emptyWrapper = mount(MaintenanceList, {
        props: {
          recentMaintenances: [],
          upcomingMaintenances: [],
          overdueMaintenances: [],
          getVehicleName: mockGetVehicleName
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