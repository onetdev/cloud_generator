<template>
  <div>
    <b-row>
      <b-col xs="12" class="text-center">
        <b-dropdown id="load-preset" text="Load presets" variant="warning">
          <b-dropdown-item @click="applyPreset(presets.regular)">Regular cloud</b-dropdown-item>
          <b-dropdown-item @click="applyPreset(presets.foggy)">Foggy</b-dropdown-item>
        </b-dropdown>
      </b-col>
    </b-row>
    <b-row id="configurator" class="pt-4 pb-3 ml-1 mr-1">
      <!-- Height -->
      <b-col sm="6" md="4">
        <label for="config-height">
          <small class="label-text">Height</small>
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

      <!-- Width -->
      <b-col sm="6" md="4">
        <label for="config-width">
          <small class="label-text">Width</small>
          <font-awesome-icon
            :icon="['far', 'question-circle']"
            class="info-tooltip"
            id="width-info"
          />
          <b-tooltip target="width-info" triggers="hover"
            >Width only defines the fluctuation base not the actual cloud width itself.</b-tooltip
          >
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

      <!-- Fluctuation -->
      <b-col sm="6" md="4">
        <label for="config-fluctuation">
          <small class="label-text">Fluctuation</small>
          <font-awesome-icon
            :icon="['far', 'question-circle']"
            class="info-tooltip"
            id="fluctuation-info"
          />
          <b-tooltip target="fluctuation-info" triggers="hover"
            >The columns the left and right side will fluctuate vertically.</b-tooltip
          >
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

      <!-- Hole treshold -->
      <b-col sm="6" md="4">
        <label for="config-holeTreshold">
          <small class="label-text">Hole size</small>
          <font-awesome-icon
            :icon="['far', 'question-circle']"
            class="info-tooltip"
            id="holeTreshold-info"
          />
          <b-tooltip target="holeTreshold-info" triggers="hover"
            >Set the lowest value to turn off. The logic behing finding the right spot can be found
            in the generator source code.</b-tooltip
          >
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

      <!-- Clour color -->
      <b-col sm="6" md="4" align-v="center">
        <label for="config-color">
          <small class="label-text">Color</small>
          <font-awesome-icon
            :icon="['far', 'question-circle']"
            class="info-tooltip"
            id="color-info"
          />
          <b-tooltip target="color-info" triggers="hover"
            >Set the lowest value to turn off. The logic behing finding the right spot can be found
            in the generator source code.</b-tooltip
          >
        </label>
        <b-form-input id="config-color" v-model="color" type="color"></b-form-input>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import Events from '../Events'
import CloudPresets, { type CloudPreset } from '../generator/CloudPresets'
import type { CloudGeneratorConfig } from '../generator/CloudGenerator'

const props = defineProps<{
  initPreset: CloudPreset
}>()
const emit = defineEmits<{
  (e: Events.UpdateConfig, config: CloudGeneratorConfig): void
  (e: Events.UpdateColor, value: string): void
}>()

const config = ref<CloudGeneratorConfig>(props.initPreset)
const color = ref<string>(props.initPreset.color)
const presets = ref(CloudPresets)
const autoSync = ref(true)

/**
 * Applies preset data to the current config
 * @param {CloudPreset} preset
 */
const applyPreset = (preset: CloudPreset) => {
  config.value = Object.assign({}, config.value, preset)
  color.value = preset.color
}

watch(
  () => config.value,
  () => {
    if (autoSync.value !== true) return
    emit(Events.UpdateConfig, config.value)
  },
  { deep: true, immediate: false }
)

watch(
  () => color.value,
  () => {
    if (autoSync.value !== true) return
    emit(Events.UpdateColor, color.value)
  },
  { immediate: false }
)
</script>

<style scoped>
#configurator {
  background: #fffbe9;
  border-radius: 5px;
  border: 1px solid #cec189;
  box-shadow: 10px 20px 20px rgba(144, 134, 89, 0.11);
}
#load-preset {
  margin-bottom: -10px;
}
.label-text {
  text-transform: uppercase;
  color: #737059;
}
.info-tooltip {
  font-size: 0.8em;
  margin-left: 5px;
  opacity: 0.4;
  cursor: pointer;
}
</style>
