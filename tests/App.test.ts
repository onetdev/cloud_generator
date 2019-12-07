import App from '@/App.vue';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import BootstrapVue from "bootstrap-vue";
import Configurator from "@/components/Configurator.vue";
import Events from "@/vars/Events";

describe('App.vue', () => {
  const localVue = createLocalVue();
  localVue.use(BootstrapVue);

  test('should handle config update', () => {
    const wrapper = shallowMount(App, { localVue });
    wrapper.find(Configurator).vm.$emit(Events.UpdateConfig, {width: 666});
    expect(wrapper.vm.$data.config).toMatchObject({width:666});
  });

  test('should handle color update', () => {
    const wrapper = shallowMount(App, { localVue });
    wrapper.find(Configurator).vm.$emit(Events.UpdateColor, "#eee");
    expect(wrapper.vm.$data.color).toEqual("#eee");
  });
});
