<template>
  <div class="container">
    <div class="controllers">
      Height: {{ height }}
      Width: {{ width }}
      Fluctuation: {{ fluctuation }}
      Allow holes: {{ allowHoles }}
    </div>
    <div class="image">
      <svg v-if="path" width="400" height="400" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(200, 100)">
          <path :d="path" fill="rgba(235, 20, 76, 1)" stroke="none" stroke-width="0" />
        </g>
      </svg>
    </div>
  </div>
</template>

<script>
import CloudGenerator from '../services/CloudGenerator';

export default {
  name: "Generator",
  props: {
    width: Number,
    height: Number,
    fluctuation: Number,
    allowHoles: Boolean
  },
  data: function () {
    const generator = new CloudGenerator(this.width, this.height, this.fluctuation, 10, 2);
    generator.generatePoints();
    generator.generateCutouts();

    return {
      path: generator.render()
    }
  }
};
</script>

<style scoped>
</style>
