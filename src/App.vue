<template>
  <div id="app">
    <b-container v-if="config != null">
      <Preview :config="config" />
      <Configurator :config="config" v-on:update:config="onUpdateConfig($event)" />
    </b-container>
    <footer class="container" id="footer">
      <b-nav pills small>
        <b-nav-item disabled>Copyright &copy; 2020</b-nav-item>
        <b-nav-item href="https://onetdev.com">József Koller</b-nav-item>
        <b-nav-item href="https://github.com/orosznyet">GitHub</b-nav-item>
      </b-nav>
    </footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSync, faDice, faCloudDownloadAlt } from "@fortawesome/free-solid-svg-icons";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { CloudGeneratorConfig } from './services/CloudGenerator';
import CloudPresets, { CloudPreset } from "./vars/CloudPresets";
import Configurator from "./components/Configurator.vue";
import Preview from "./components/Preview.vue";

library.add(faQuestionCircle);
library.add(faSync);
library.add(faDice);
library.add(faCloudDownloadAlt);
Vue.component("font-awesome-icon", FontAwesomeIcon);

@Component({
  components: { Preview, Configurator }
})
class App extends Vue {
  config: CloudPreset = CloudPresets.regular;

  mounted() {
    const url = new URL(window.location.href);
    const loadedOptsRaw: string = url.searchParams.get("config") || "";

    let loadedOpts = {};
    try {
      loadedOpts = JSON.parse(atob(loadedOptsRaw));
    } catch (e) {
      // Error
    }

    this.config = Object.assign({}, this.config, loadedOpts);
  }

  onUpdateConfig($event: any) {
    this.config = $event;
  }
}

export default App;
</script>

<style scoped>
#app {
  min-height: 100vh;
  min-width: 100vw;
}
#footer {
  padding-top: 4em;
  padding-bottom: 2em;
}
</style>
