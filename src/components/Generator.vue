<template>
  <div class="container">
    <div class="controllers" v-if="config">
      Height: {{ config.height }} Width: {{ config.width }} Fluctuation:
      {{ config.fluctuation }} Allow holes: {{ config.holeTreshold }}
    </div>
    <div class="image">
      <svg
        v-if="svgPath"
        width="400"
        height="400"
        viewBox="0 0 800 400"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="translate(200, 100)">
          <path
            :d="svgPath"
            fill="rgba(235, 20, 76, 1)"
            stroke="none"
            stroke-width="0"
          />
        </g>
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import CloudGenerator, { CloudGeneratorConfig } from "../services/CloudGenerator";

@Component
class Generator extends Vue {
  @Prop() private config!: CloudGeneratorConfig;
  private svgPath!: string;

  mounted() {
    const generator = new CloudGenerator(this.config);
    generator.generatePoints();
    generator.generateCutouts();

    this.svgPath = generator.render()
  }
}

export default Generator;
</script>

<style scoped></style>
