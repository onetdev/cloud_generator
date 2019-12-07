<template>
  <div id="app">
    <div id="background"></div>
    <b-container v-if="preset != null" id="main">
      <Preview :config="config" :color="color" />
      <Configurator
        :init-preset="preset"
        v-on:update:config="onUpdateConfig($event)"
        v-on:update:color="onUpdateColor($event)"
      />
    </b-container>
    <footer class="container" id="footer">
      <b-nav pills small align="center">
        <b-nav-item disabled>Copyright &copy; 2020</b-nav-item>
        <b-nav-item href="https://onetdev.com">József Koller</b-nav-item>
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
#background {
  border-radius: 50%;
    position: absolute;
    width: 200vw;
    height: 200vh;
    top: -110vh;
    left: -50vw;
    box-shadow: 0px 15px 50px #d8d8d8;
    z-index: 1;
}
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
