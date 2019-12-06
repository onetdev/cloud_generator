<template>
  <b-container>
    <b-row class="controllers">
      <b-col sm="6">
        <label for="config-height">
          Height
          <span class="debug">({{ config.height }})</span>
        </label>
        <b-form-input
          id="config-height"
          v-model="config.height"
          type="range"
          min="1"
          max="11"
          step="2"
        ></b-form-input>
      </b-col>
      <b-col sm="6">
        <label for="config-width">
          Width
          <span class="debug">({{ config.width }})</span>
        </label>
        <b-form-input
          id="config-width"
          v-model="config.width"
          type="range"
          min="3"
          max="27"
          step="2"
        ></b-form-input>
      </b-col>
      <b-col sm="6">
        <label for="config-fluctuation">
          Fluctuation
          <span class="debug">({{ config.fluctuation }})</span>
        </label>
        <b-form-input
          id="config-fluctuation"
          v-model="config.fluctuation"
          type="range"
          min="1"
          max="7"
          step="2"
        ></b-form-input>
      </b-col>
      <b-col sm="6">
              <label for="config-holeTreshold">
          Hole size
          <span class="debug">({{ config.holeTreshold }})</span>
        </label>
        <b-form-input
          id="config-holeTreshold"
          v-model="config.holeTreshold"
          type="range"
          min="0"
          max="7"
          step="1"
        ></b-form-input>
      </b-col>
      <b-col sm="12">
      {{ config }}
        <button @click="generate">Generate</button>
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
          <path :d="svgPath" fill="rgba(235, 20, 76, 1)" stroke="none" stroke-width="0" />
        </g>
      </svg>
    </b-row>
    <b-row>
      <b-col sm="2">Debug info:</b-col>
      <b-col sm="10">Bounding box: {{ svgPathMin }}, {{ svgPathMax }}</b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import CloudGenerator, {
  CloudGeneratorConfig
} from "../services/CloudGenerator";

interface Coordinate {
  x: number;
  y: number;
}

@Component({})
class Generator extends Vue {
  @Prop() config!: CloudGeneratorConfig;
  svgPath: string = "";
  svgPathMin: Coordinate = { x: Infinity, y: Infinity };
  svgPathMax: Coordinate = { x: -Infinity, y: -Infinity };

  mounted() {
    this.generate();
  }

  /**
   * If needed, the component will automaticaly generate a random cloud on
   * mount.
   */
  generate() {
    if (this.config == null) {
      return;
    }

    const generator = new CloudGenerator(this.config);
    generator.generatePoints();
    generator.generateCutouts();

    this.svgPath = generator.render();
    this.updateBoundingCoordinates();
  }

  /**
   * This will always generate the proper bounding box for the
   * svg on screen because it will look at each single coordinate in the path.
   */
  updateBoundingCoordinates() {
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
}

export default Generator;
</script>

<style scoped></style>
