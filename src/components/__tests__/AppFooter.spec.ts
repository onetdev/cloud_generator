import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import AppFooter from '../AppFooter.vue'
import { getVuetifyTestPlugin } from '@/test_utils'

describe('components/AppFooter.vue', () => {
  it('renders properly', () => {
    const wrapper = mount({
      template: '<v-layout><AppFooter /></v-layout>',
    }, {
      components: { AppFooter },
      global: {
        plugins: [getVuetifyTestPlugin()],
      },
    })
    expect(wrapper.text()).toContain('Konrad Koller')
  })
})
