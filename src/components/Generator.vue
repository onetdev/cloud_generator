<template>
  <b-container>
    <b-row class="controllers">
      <!-- Height -->
      <b-col sm="6">
        <label for="config-height">Height</label>
        <b-form-input
          id="config-height"
          v-model="localConfig.height"
          type="range"
          min="1"
          max="11"
          step="2"
        ></b-form-input>
      </b-col>

      <!-- Width -->
      <b-col sm="6">
        <label for="config-width">
          Width
          <font-awesome-icon :icon="['far', 'question-circle']" id="width-info" />
          <b-tooltip
            target="width-info"
            triggers="hover"
          >Width only defines the fluctuation base not the actual cloud width itself.</b-tooltip>
        </label>
        <b-form-input
          id="config-width"
          v-model="localConfig.width"
          type="range"
          min="3"
          max="27"
          step="2"
        ></b-form-input>
      </b-col>

      <!-- Fluctuation -->
      <b-col sm="6">
        <label for="config-fluctuation">
          Fluctuation
          <font-awesome-icon :icon="['far', 'question-circle']" id="fluctuation-info" />
          <b-tooltip
            target="fluctuation-info"
            triggers="hover"
          >The columns the left and right side will fluctuate vertically.</b-tooltip>
        </label>
        <b-form-input
          id="config-fluctuation"
          v-model="localConfig.fluctuation"
          type="range"
          min="1"
          max="7"
          step="2"
        ></b-form-input>
      </b-col>

      <!-- Hole treshold -->
      <b-col sm="6">
        <label for="config-holeTreshold">
          Hole size
          <font-awesome-icon :icon="['far', 'question-circle']" id="holeTreshold-info" />
          <b-tooltip
            target="holeTreshold-info"
            triggers="hover"
          >Set the lowest value to turn off. The logic behing finding the right spot can be found in the generator source code.</b-tooltip>
        </label>
        <b-form-input
          id="config-holeTreshold"
          v-model="localConfig.holeTreshold"
          type="range"
          min="0"
          max="7"
          step="1"
        ></b-form-input>
      </b-col>

      <!-- Cloud color -->
      <b-col sm="6">
        <label for="config-color">
          Color
          <font-awesome-icon :icon="['far', 'question-circle']" id="color-info" />
          <b-tooltip
            target="color-info"
            triggers="hover"
          >Set the lowest value to turn off. The logic behing finding the right spot can be found in the generator source code.</b-tooltip>
        </label>
        <b-form-input id="config-color" v-model="localConfig.color" type="color"></b-form-input>
      </b-col>
      <b-col sm="6">
        <b-dropdown id="load-preset" text="Load presets" class="m-md-2">
          <b-dropdown-item @click="applyPreset(presets.regular)">Regular cloud</b-dropdown-item>
          <b-dropdown-item @click="applyPreset(presets.foggy)">Foggy</b-dropdown-item>
        </b-dropdown>
      </b-col>

      <b-col sm="12">
        <b-form-checkbox v-model="autoSync" value="1">
          <font-awesome-icon icon="sync" />
        </b-form-checkbox>
        <b-button variant="outline-primary" @click="generate">Generate</b-button>
      </b-col>
    </b-row>
    <b-row class="image">
      <svg
        v-if="svgPath!= null"
        width="400"
        height="400"
        viewBox="0 0 800 400"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="translate(200, 100)">
          <path :d="svgPath" :fill="localConfig.color" stroke="none" stroke-width="0" />
        </g>
      </svg>
    </b-row>
    <b-row>
      <b-col sm="2">Debug info:</b-col>
      <b-col sm="10">Bounding box: {{ svgPathMin }}, {{ svgPathMax }}</b-col>
      <b-col sm="12">Config: {{ localConfig }}</b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import CloudPresets, { CloudPreset } from '../vars/CloudPresets';
import CloudGenerator from "../services/CloudGenerator";

interface Coordinate {
  x: number;
  y: number;
}

@Component({})
class Generator extends Vue {
  @Prop() config!: CloudPreset;
  localConfig: CloudPreset = this.config;
  presets: CloudPresets = CloudPresets;
  svgPath: string = "";
  svgPathMin: Coordinate = { x: Infinity, y: Infinity };
  svgPathMax: Coordinate = { x: -Infinity, y: -Infinity };
  autoSync: boolean = true;

  mounted() {
    this.generate();
  }

  /**
   * If needed, the component will automaticaly generate a random cloud on
   * mount.
   */
  generate(): void {
    if (this.localConfig == null) {
      return;
    }

    (console as any).log(this.localConfig);
    const generator = new CloudGenerator(this.localConfig);
    generator.generatePoints();
    generator.generateCutouts();

    this.svgPath = generator.render();
    this.updateBoundingCoordinates();
  }

  /**
   * This will always generate the proper bounding box for the
   * svg on screen because it will look at each single coordinate in the path.
   */
  updateBoundingCoordinates(): void {
    const ex = RegExp("([-0-9]+) ([-0-9]+)", "ig");
    let match;
    while ((match = ex.exec(this.svgPath)) !== null) {
      this.svgPathMin = {
        x: Math.min(this.svgPathMin.x, parseInt(match[1])),
        y: Math.min(this.svgPathMin.y, parseInt(match[2]))
      };

      this.svgPathMax = {
        x: Math.max(this.svgPathMax.x, parseInt(match[1])),
        y: Math.max(this.svgPathMax.y, parseInt(match[2]))
      };
    }
  }

  /**
   * Applies preset data to the current config
   * @param {CloudPreset} preset
   */
  applyPreset(preset: CloudPreset) {
    this.localConfig = Object.assign({}, this.localConfig, preset);
  }

  @Watch("localConfig", { immediate: true, deep: true })
  onChildChanged(val: string, oldVal: string) {
    if (this.autoSync == false) {
      return;
    }
    this.generate();
  }
}

export default Generator;
</script>

<style scoped></style>
