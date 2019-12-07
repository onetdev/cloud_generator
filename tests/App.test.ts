import Vue from "vue";
import App from '@/App.vue';
import { mount, shallowMount } from '@vue/test-utils';
import BootstrapVue from "bootstrap-vue";
import Configurator from "@/components/Configurator.vue";
import Preview from "@/components/Preview.vue";
import Events from "@/vars/Events";

describe('App.vue', () => {
  Vue.use(BootstrapVue);

  test('should handle config update', () => {
    const wrapper = shallowMount(App);
    wrapper.find(Configurator).vm.$emit(Events.UpdateConfig, {width: 666});
    expect(wrapper.vm.$data.config).toMatchObject({width:666});
  });

  test('should handle color update', () => {
    const wrapper = shallowMount(App);
    wrapper.find(Configurator).vm.$emit(Events.UpdateColor, "#eee");
    expect(wrapper.vm.$data.color).toEqual("#eee");
  });
});
