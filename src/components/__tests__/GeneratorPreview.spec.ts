import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import GeneratorPreview from '../GeneratorPreview.vue'
import { nextTick } from 'vue'
import { getVuetifyTestPlugin } from '@/../test_utils'

describe('components/GeneratorPreview.vue', () => {
  const getTestProps = () => ({
    config: {
      width: 11,
      height: 5,
      randomness: 3,
      renderRadius: 10,
      holeTreshold: 0,
    },
    color: "#48c7ff"
  });

  const getWrapper = () => {
    return mount(GeneratorPreview, {
      props: getTestProps(),
      global: {
        plugins: [getVuetifyTestPlugin()],
      },
    });
  }

  it('renders properly', () => {
    const wrapper = getWrapper()
    expect(wrapper.text()).toContain('Live preview')
  })

  it('should not update shape on color change', async () => {
    const wrapper = getWrapper()
    const path = wrapper.find("#path").attributes().d;
    wrapper.setProps({ color: "#fff" });

    await nextTick()

    expect(wrapper.find("#path").attributes().d).toEqual(path);
    expect(wrapper.find("#path").attributes().fill).toEqual("#fff");
  })

  it('should update shape on config change', async () => {
    const wrapper = getWrapper()
    const path = wrapper.find("#path").attributes().d;
    wrapper.setProps({
      config: { ...wrapper.vm.config, renderRadius: 20 }
    });

    await nextTick()

    expect(wrapper.find("#path").attributes().d).not.toEqual(path);
    expect(wrapper.find("#path").attributes().fill).toEqual("#48c7ff");
  })
})
