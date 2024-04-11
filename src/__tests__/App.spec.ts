import App from '@/App.vue';
import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils';
import Events from '@/Events';
import { getVuetifyTestPlugin } from '@/../test_utils';

describe('App.vue', () => {
  it('should handle config update', () => {
    const wrapper = shallowMount(App, {
      global: {
        plugins: [getVuetifyTestPlugin()],
      },
    });
    wrapper.vm.$emit(Events.UpdateConfig, { width: 666 });
    expect(wrapper.emitted(Events.UpdateConfig)?.[0][0]).toMatchObject({ width: 666 });
  });

  it('should handle color update', () => {
    const wrapper = shallowMount(App, {
      global: {
        plugins: [getVuetifyTestPlugin()],
      },
    });
    wrapper.vm.$emit(Events.UpdateColor, "#eee");
    expect(wrapper.emitted(Events.UpdateColor)?.[0][0]).toEqual("#eee");
  });
});
