<template>
  <div id="app" class="container">
    <img alt="Cloud generator" src="./assets/logo.png" />
    <Generator v-if="generatorConfig" :config="generatorConfig" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSync, faDice } from '@fortawesome/free-solid-svg-icons';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import CloudPresets, { CloudPreset } from "./vars/CloudPresets";
import Generator from "./components/Generator.vue";

library.add(faQuestionCircle);
library.add(faSync);
library.add(faDice);
Vue.component('font-awesome-icon', FontAwesomeIcon);

@Component({
  components: { Generator }
})
class App extends Vue {
  generatorConfig: CloudPreset = CloudPresets.regular;

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
