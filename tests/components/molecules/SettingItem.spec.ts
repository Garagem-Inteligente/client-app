import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { IonIcon } from '@ionic/vue'
import SettingItem from '../../../src/components/molecules/SettingItem.vue'

describe('SettingItem.vue', () => {
  it('renders title correctly', () => {
    const wrapper = mount(SettingItem, {
      props: {
        title: 'Test Setting'
      },
      global: {
        components: { IonIcon }
      }
    })

    expect(wrapper.text()).toContain('Test Setting')
  })

  it('renders subtitle when provided', () => {
    const wrapper = mount(SettingItem, {
      props: {
        title: 'Test Setting',
        subtitle: 'Test subtitle'
      },
      global: {
        components: { IonIcon }
      }
    })

    expect(wrapper.text()).toContain('Test subtitle')
  })

  it('renders value when provided', () => {
    const wrapper = mount(SettingItem, {
      props: {
        title: 'Test Setting',
        value: 'Test Value'
      },
      global: {
        components: { IonIcon }
      }
    })

    expect(wrapper.text()).toContain('Test Value')
  })

  it('emits click event when clicked', async () => {
    const wrapper = mount(SettingItem, {
      props: {
        title: 'Test Setting'
      },
      global: {
        components: { IonIcon }
      }
    })

    await wrapper.trigger('click')
    expect(wrapper.emitted()).toHaveProperty('click')
  })

  it('applies correct CSS classes', () => {
    const wrapper = mount(SettingItem, {
      props: {
        title: 'Test Setting'
      },
      global: {
        components: { IonIcon }
      }
    })

    expect(wrapper.classes()).toContain('setting-item')
    expect(wrapper.find('.setting-content').exists()).toBe(true)
    expect(wrapper.find('.setting-text').exists()).toBe(true)
    expect(wrapper.find('.setting-actions').exists()).toBe(true)
  })
})