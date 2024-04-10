import BootstrapVue from "bootstrap-vue";
import Preview from "@/components/Preview.vue";
import { shallowMount, createLocalVue } from '@vue/test-utils';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faDice, faCloudDownloadAlt } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

describe('Components/Preview.vue', () => {
  const localVue = createLocalVue();
  localVue.use(BootstrapVue);

  library.add(faDice);
  library.add(faCloudDownloadAlt);
  localVue.component("font-awesome-icon", FontAwesomeIcon);

  let wrapper: any;
  beforeEach(() => {
    wrapper = shallowMount(Preview, {
      localVue,
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

    await localVue.nextTick();

    expect(wrapper.find("#path").attributes().d).toEqual(path);
    expect(wrapper.find("#path").attributes().fill).toEqual("#fff");
  });

  test('should update shape on config change', async () => {
    const path = wrapper.find("#path").attributes().d;
    wrapper.setProps({
      config: { ...wrapper.vm.config, renderRadius: 20 }
    });

    await localVue.nextTick();

    expect(wrapper.find("#path").attributes().d).not.toEqual(path);
    expect(wrapper.find("#path").attributes().fill).toEqual("#48c7ff");
  });
});
