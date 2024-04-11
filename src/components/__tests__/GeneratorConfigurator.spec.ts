import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import GeneratorConfigurator from '../GeneratorConfigurator.vue';
import { getVuetifyTestPlugin } from '@/../test_utils';

describe('components/GeneratorConfigurator.vue', () => {
  const getProps = () => ({
    initPreset: {
      id: "cloud",
      name: "Cloud",
      width: 11,
      height: 5,
      randomness: 3,
      renderRadius: 10,
      holeTreshold: 0,
      color: "#48c7ff"
    },
  });

  const getWrapper = () => {
    return mount(GeneratorConfigurator, {
      props: getProps(),
      global: {
        plugins: [getVuetifyTestPlugin()],
      },
    });
  }

  it('should emit height change and correct data type correctly', async () => {
    const wrapper = getWrapper();
    const input = wrapper.get("#config-height")
    expect(input.element).to.exist;

    input.setValue("7");
    expect(wrapper.emitted()).not.empty;
    // TODO: We should be testing if Events.UpdateConfig has been emitted
    //   For some reason it's only visible but inaccessible 🤔
    //   Using `wrapper.emitted(Events.UpdateConfig)` returns absolutely nothing
  });

  it('should update color on color change', async () => {
    const wrapper = getWrapper();
    const input = wrapper.get("#config-color");
    expect(input.element).to.exist;

    input.setValue("#ff0000");
    expect(wrapper.emitted()).not.empty;
    // TODO: We should be testing if Events.UpdateColor has been emitted
    //   For some reason it's only visible but inaccessible 🤔
    //   Using `wrapper.emitted(Events.UpdateColor)` returns absolutely nothing
  });
});
