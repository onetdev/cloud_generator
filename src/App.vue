<template>
  <div id="app" class="container">
    <img alt="Cloud generator" src="./assets/logo.png">
    <Generator :width="config.width" :height="config.height" :fuctuation="config.fluctuation" :allowHoles="config.allowHoles"/>
  </div>
</template>

<script>
import Generator from './components/Generator.vue'

export default {
  name: 'app',
  components: {
    Generator
  },
  data: function() {
    const defaultOpts = {width: 11, height: 5, fluctuation: 3, allowHoles: true};
    const loadedOptsRaw = new URL(window.location.href).searchParams.get("config");
    let loadedOpts = {};
    try {
      loadedOpts = JSON.parse(atob(loadedOptsRaw));
    } catch (e) {
      // Error
    }

    return {
      config:  Object.assign({}, defaultOpts, loadedOpts)
    }
  }
}
</script>
