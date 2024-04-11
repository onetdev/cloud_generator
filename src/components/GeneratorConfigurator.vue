<template>
  <v-sheet elevation="3" rounded="lg" variant="outlined" class="d-flex flex-wrap my-3 py-3">
    <div class="v-col-12 d-flex justify-space-between align-center flex-wrap">
      <h5 class="text-h5 d-inline">Configurator</h5>
      <v-btn color="primary" id="load-preset" size="small" prepend-icon="mdi-shape-outline">
        Load presets

        <v-menu activator="parent">
          <v-list>
            <v-list-item
              v-for="(item, index) in presets"
              :key="index"
              :value="index"
              @click="() => applyPreset(item)"
            >
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
    </div>
    <div class="v-col-12 v-col-md-6 v-col-lg-4">
      <label for="config-height" class="px-2">Height</label>
      <v-slider
        hide-details
        id="config-height"
        max="11"
        min="1"
        show-ticks="always"
        step="2"
        thumb-label
        v-model="config.height"
      />
    </div>

    <div class="v-col-12 v-col-md-6 v-col-lg-4">
      <label for="config-width" class="px-2">Width</label>
      <v-slider
        hide-details
        id="config-width"
        max="27"
        min="3"
        show-ticks="always"
        step="2"
        thumb-label
        v-model="config.width"
      />
    </div>

    <div class="v-col-12 v-col-md-6 v-col-lg-4">
      <label for="config-width" class="px-2">Randomness</label>
      <v-slider
        hint="Amplification strenght of randomness for the left and right sides of the cloud."
        id="config-randomness"
        max="7"
        min="1"
        persistent-hint
        show-ticks="always"
        step="2"
        thumb-label
        v-model="config.randomness"
      />
    </div>

    <div class="v-col-12 v-col-md-6 v-col-lg-4">
      <label for="config-width" class="px-2">Hole size</label>
      <v-slider
        hint="Set the lowest value to turn off. The logic behing finding the right spot can be found in the generator source code."
        id="config-hole-treshold"
        max="7"
        min="0"
        persistent-hint
        show-ticks="always"
        step="1"
        thumb-label
        type="range"
        v-model="config.holeTreshold"
      />
    </div>

    <div class="v-col-12 v-col-md-6 v-col-lg-4">
      <label for="config-color" class="px-2">Color</label>
      <v-text-field
        class="px-2"
        density="compact"
        hint="Set the lowest value to turn off. The logic behing finding the right spot can be found in the generator source code."
        id="config-color"
        persistent-hint
        type="color"
        v-model="color"
        variant="plain"
      />
    </div>
  </v-sheet>
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
const autoSync = ref(true)
const presets = ref(CloudPresets)

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
    if (autoSync.value !== true) {
      return
    }

    emit(Events.UpdateColor, color.value)
  },
  { deep: false, immediate: false }
)
</script>
