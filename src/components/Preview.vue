<template>
  <div>
    <b-row id="preview" class="mt-5 mb-5 mx-auto">
      <svg
        width="400"
        height="400"
        :viewBox="`0 0 ${boundingWidth} ${boundingHeight}`"
        xmlns="http://www.w3.org/2000/svg"
        class="mx-auto"
        id="image"
      >
        <g :transform="`translate(${boundingBox.a.x * -1}, 0)`">
          <path id="path" :d="svgPath" :fill="color" stroke="none" stroke-width="0" />
        </g>
      </svg>
      <div class="actions">
        <b-button
          v-if="history.length > 0"
          id="history"
          variant="warning"
          class="mr-2 mb-2 px-4"
          @click="historyBack"
          tooltip="Revert last generation"
        >
          <font-awesome-icon icon="history" />
        </b-button>

        <b-button
          id="download"
          variant="info"
          class="mr-2 mb-2 px-4"
          @click="download"
          title="Download"
        >
          <font-awesome-icon icon="cloud-download-alt" />
        </b-button>

        <b-button
          id="generate"
          variant="danger"
          class="mr-2 mb-2 px-4"
          @click="generate"
          title="Generate new"
        >
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
import CloudGenerator, {
  BoundingBox,
  RenderMapper
} from "../generator/CloudGenerator";

interface Coordinate {
  x: number;
  y: number;
}

@Component({})
class Preview extends Vue {
  @Prop() config!: CloudPreset;
  @Prop() color!: string;
  svgPath: string = "";
  history: string[] = [];
  boundingBox?: BoundingBox;
  boundingWidth?: number;
  boundingHeight?: number;

  /**
   * Since we don't have path loader we just generate a new cloud
   * as soon as possible.
   */
  mounted() {
    this.generate();
  }

  generate(): void {
    const generator = new CloudGenerator(this.config);
    generator.generate();
    this.setSvgPath(generator.export());
  }

  setSvgPath(path: string, skipHistory: boolean = false) {
    if (this.svgPath && !skipHistory) {
      this.history.push(this.svgPath);
    }

    this.svgPath = path;
    this.boundingBox = RenderMapper.getBoundingCoordinates(this.svgPath);
    this.boundingWidth = this.boundingBox.b.x - this.boundingBox.a.x;
    this.boundingHeight = this.boundingBox.b.y - this.boundingBox.a.y;
  }

  @Watch("config", { immediate: true, deep: true })
  onConfigUpdated(val: CloudPreset, oldVal: CloudPreset) {
    this.generate();
  }

  historyBack() {
    if (!this.history.length) return;
    this.setSvgPath(this.history.pop()!, true);
  }

  /**
   * Now, we will build our SVG file in memory, clean up the whitespaces, new lines
   * and tabs then start the download on the clients side.
   */
  download() {
    if (!this.boundingBox) return;

    (console as any).log(
      this.boundingBox,
      this.boundingWidth,
      this.boundingHeight
    );

    const content = `<?xml version="1.0" encoding="utf-8"?>
      <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
      <svg
        xmlns='http://www.w3.org/2000/svg'
        xml:space='preserve' version='1.1'
        xmlns:xlink='http://www.w3.org/1999/xlink'
        overflow='visible'
        viewBox='0 0 ${this.boundingWidth} ${this.boundingHeight}'>
        <path
          d="${this.svgPath}"
          transform="translate(${this.boundingBox.a.x * -1}, 0)"
          fill="${this.color}"
          stroke="none"
          stroke-width="0"
          />
      </svg>`.replace(/[\s]+/gi, " ");

    const blob = new Blob([content], { type: "image/svg+xml;charset:utf-8" });
    this.downloadHack(blob, "cloud_onetdev_com.svg");
  }

  downloadHack(content: Blob, filename?: string) {
    const url = window.URL.createObjectURL(content);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.href = url;
    a.download = filename || "unknown_file";
    a.click();
    window.URL.revokeObjectURL(url);
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
.actions {
  position: absolute;
  right: 0;
  bottom: 0;
}
#download,
#generate {
  opacity: 0.8;
  transition: ease 200ms opacity;
  &:hover {
    opacity: 0.8;
  }
}
</style>
