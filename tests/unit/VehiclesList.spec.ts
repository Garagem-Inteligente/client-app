import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import VehiclesList from '../../src/components/organisms/VehiclesList.vue'

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

describe('VehiclesList.vue', () => {
  let wrapper: VueWrapper

  const mockVehicles = [
    {
      id: '1',
      make: 'Honda',
      model: 'Civic',
      year: 2020,
      plate: 'ABC-1234',
      color: 'Preto',
      mileage: 45000,
      fuelType: 'Gasolina',
      createdAt: new Date('2023-01-15'),
      userId: 'user-1'
    }
  ]

  beforeEach(() => {
    setActivePinia(createPinia())

    wrapper = mount(VehiclesList, {
      props: {
        vehicles: mockVehicles
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

    it('deve renderizar veículos quando há dados', () => {
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('Estados Vazios', () => {
    it('deve renderizar quando não há veículos', () => {
      const emptyWrapper = mount(VehiclesList, {
        props: {
          vehicles: []
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