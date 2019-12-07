<template>
  <div id="app">
    <b-container v-if="preset != null">
      <Preview :config="preset" :color="color" />
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
  color: string = this.preset.color;

  onUpdateConfig($event: any) {
    this.preset = $event;
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
#footer {
  padding-top: 4em;
  padding-bottom: 2em;
}
</style>
