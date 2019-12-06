<template>
  <div id="app" class="container">
    <img alt="Cloud generator" src="./assets/logo.png" />
    <Generator :config="generatorConfig" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { CloudGeneratorConfig } from "./services/CloudGenerator";
import Generator from "./components/Generator.vue";

@Component({
  components: { Generator }
})
class App extends Vue {
  generatorConfig: CloudGeneratorConfig = {
    width: 11,
    height: 5,
    fluctuation: 3,
    renderRadius: 10,
    holeTreshold: 2
  };

  mounted() {
    const url = new URL(window.location.href);
    const loadedOptsRaw: string = url.searchParams.get("config") || "";

    let loadedOpts = {};
    try {
      loadedOpts = JSON.parse(atob(loadedOptsRaw));
    } catch (e) {
      // Error
    }

    this.generatorConfig = Object.assign({}, this.generatorConfig, loadedOpts);
  }
}

export default App;
</script>
