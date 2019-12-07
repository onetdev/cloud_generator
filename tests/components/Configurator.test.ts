import { mount, createLocalVue } from '@vue/test-utils';
import BootstrapVue from "bootstrap-vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Configurator from "@/components/Configurator.vue";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import Events from "@/vars/Events";
import { library } from "@fortawesome/fontawesome-svg-core";

describe('Components/Configurator.vue', () => {
  const localVue = createLocalVue();
  localVue.use(BootstrapVue);

  library.add(faQuestionCircle);
  localVue.component("font-awesome-icon", FontAwesomeIcon);

  let wrapper: any;
  beforeAll(() => {
    wrapper = mount(Configurator, {
      localVue,
      propsData: {
        initPreset: {
          width: 11,
          height: 5,
          fluctuation: 3,
          renderRadius: 10,
          holeTreshold: 0,
          color: "#48c7ff"
        }
      }
    });
  });

  test('should emit height change and correct data type correctly', async () => {
    wrapper.find("#config-height").setValue("3");

    await localVue.nextTick();

    // I'm not quite sure why my event is within another array.
    // But this a question for a later time.
    expect(wrapper.emitted()[Events.UpdateConfig][0][0].height).toBe(3);
    expect(wrapper.emitted()[Events.UpdateColor]).toBeUndefined();
  });

  test('should update color on color change', async () => {
    wrapper.find("#config-color").setValue("#ffeecc");

    await localVue.nextTick();

    expect(wrapper.emitted()[Events.UpdateColor][0][0]).toBe("#ffeecc");
  });
});
