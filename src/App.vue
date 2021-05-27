<template>
  <div id="app">
    <b-container v-if="preset != null" id="main">
      <Preview :config="config" :color="color" />
      <Configurator
        :init-preset="preset"
        v-on:update:config="onUpdateConfig($event)"
        v-on:update:color="onUpdateColor($event)"
      />
    </b-container>
    <b-container class="pt-5">
      <b-row>
        <b-col lg="5" offset-lg="1">
          <h3>
            Get your own cloud
            <small class="text-muted">for free</small>
          </h3>
          <p class="lead">
            Generate your own svg cloud and use it anywhere you want for absolutely free.
            If you have any question of further request, mail me at
            <a href="mailto:contact@onet.dev">contact@onet.dev</a>.
          </p>
        </b-col>
        <b-col lg="5">
          <h3>
            Are you a developer?
          </h3>
          <p class="lead">
            Would love to get your hands on the source code our maybe you want to contribute,
            <a href="https://github.com/orosznyet/cloud_generator">just click here</a>.
          </p>
        </b-col>
      </b-row>
    </b-container>
    <footer class="container" id="footer">
      <b-nav pills small align="center">
        <b-nav-item disabled>Copyright &copy; 2020</b-nav-item>
        <b-nav-item href="https://onet.dev">József Koller</b-nav-item>
        <b-nav-item href="https://github.com/orosznyet">GitHub</b-nav-item>
      </b-nav>
    </footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { CloudGeneratorConfig } from "./generator/CloudGenerator";
import CloudPresets, { CloudPreset } from "./generator/CloudPresets";
import Configurator from "./components/Configurator.vue";
import Preview from "./components/Preview.vue";

@Component({
  components: { Preview, Configurator }
})
class App extends Vue {
  preset: CloudPreset = CloudPresets.regular;
  config: CloudGeneratorConfig = this.preset;
  color: string = this.preset.color;

  onUpdateConfig($event: CloudGeneratorConfig) {
    this.config = $event;
  }

  onUpdateColor($event: string) {
    this.color = $event;
  }
}

export default App;
</script>

<style scoped>
#app {
  min-height: 100vh;
  min-width: 100vw;
}
#main {
  z-index: 2;
  position: relative;
}
#footer {
  padding-top: 4em;
  padding-bottom: 2em;
  z-index: 1;
}
</style>
