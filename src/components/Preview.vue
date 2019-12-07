<template>
  <div>
    <b-row id="preview" class="mt-5 mb-5 mx-auto">
      <svg
        width="400"
        height="400"
        viewBox="0 0 800 400"
        xmlns="http://www.w3.org/2000/svg"
        class="mx-auto"
        id="image"
      >
        <g transform="translate(200, 100)">
          <path :d="svgPath" :fill="localConfig.color" stroke="none" stroke-width="0" />
        </g>
      </svg>
      <div class="actions">
        <b-button id="download" variant="info" class="mr-2 mb-2" @click="download">
          <font-awesome-icon icon="cloud-download-alt" />
        </b-button>

        <b-button id="generate" variant="danger" class="mr-2 mb-2" @click="generate">
          <font-awesome-icon icon="dice" />
        </b-button>
      </div>
    </b-row>
  </div>
</template>

<script lang="ts">
import _ from "lodash";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { CloudPreset } from "../generator/CloudPresets";
import CloudGenerator, { BoundingBox, RenderMapper } from "../generator/CloudGenerator";

interface Coordinate {
  x: number;
  y: number;
}

@Component({})
class Preview extends Vue {
  @Prop() config!: CloudPreset;
  localConfig: CloudPreset = this.config;
  svgPath: string = "";
  boundingBox?: BoundingBox;

  /**
   * Since we don't have path loader we just generate a new cloud
   * as soon as possible.
   */
  mounted() {
    this.generate();
  }

  /**
   * If needed, the component will automaticaly generate a random cloud on
   * mount.
   */
  generate(): void {
    const generator = new CloudGenerator(this.localConfig);
    generator.generate();

    this.svgPath = generator.export();
    this.boundingBox = RenderMapper.getBoundingCoordinates(this.svgPath);
  }

  /**
   * We should only redraw if we got the same config (means rerandom) or there was a change
   * other than to the color.
   */
  @Watch("config", { immediate: true, deep: true })
  onConfigUpdated(val: CloudPreset, oldVal: CloudPreset) {
    const hasColorChanged = oldVal ? val.color != oldVal.color : true;
    const hasSeedsChanged = oldVal
      ? _.isEqual(_.omit(val, "color"), _.omit(oldVal, "color"))
      : true;
    this.localConfig = this.config;

    if (hasSeedsChanged || !hasColorChanged) {
      this.generate();
    }
  }

  /**
   * Here comes a little magic, We are going to create
   */
  download() {
    // TODO: https://stackoverflow.com/questions/3665115/how-to-create-a-file-in-memory-for-user-to-download-but-not-through-server
  }
}

export default Preview;
</script>

<style scoped lang="scss">
#preview {
  position: relative;
  border: 1px solid #dcdcdc;
  background: #fff;
  border-radius: 10px;
  box-shadow: 5px 5px 10px rgba(223, 223, 223, 0.58);
  max-width: 600px;
}
#image {
}
.actions {
  position: absolute;
  right: 0;
  bottom: 0;
}
#download, #generate {
  opacity: .8;
  transition: ease 200ms opacity;
  &:hover {
    opacity: 0.8;
  }
}
</style>
