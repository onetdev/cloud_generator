import Vue from "vue";
import App from '@/App.vue';
import { mount, config, shallowMount } from '@vue/test-utils';
import BootstrapVue from "bootstrap-vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Preview from "@/components/Preview.vue";
import { faSync, faDice, faCloudDownloadAlt } from "@fortawesome/free-solid-svg-icons";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import Events from "@/vars/Events";
import { library } from "@fortawesome/fontawesome-svg-core";

describe('Components/Preview.vue', () => {
  Vue.use(BootstrapVue);

  Vue.component("font-awesome-icon", FontAwesomeIcon);
  library.add(faDice);
  library.add(faCloudDownloadAlt);

  let wrapper: any;
  beforeEach(() => {
    wrapper = shallowMount(Preview, {
      propsData: {
        config: {
          width: 11,
          height: 5,
          fluctuation: 3,
          renderRadius: 10,
          holeTreshold: 0,
        },
        color: "#48c7ff"
      }
    });
  });

  test('should not update shape on color change', async () => {
    const path = wrapper.find("#path").attributes().d;
    wrapper.setProps({ color: "#fff" });

    await Vue.nextTick();

    expect(wrapper.find("#path").attributes().d).toEqual(path);
    expect(wrapper.find("#path").attributes().fill).toEqual("#fff");
  });

  test('should update shape config change', async () => {
    const path = wrapper.find("#path").attributes().d;
    wrapper.setProps({
      config: { ...wrapper.vm.config, renderRadius: 20 }
    });

    await Vue.nextTick();

    expect(wrapper.find("#path").attributes().d).not.toEqual(path);
    expect(wrapper.find("#path").attributes().fill).toEqual("#48c7ff");
  });
});
