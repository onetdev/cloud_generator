<template>
  <v-layout id="layout">
    <v-app-bar app color="default" dark>
      <v-toolbar-title>Cloud Generator</v-toolbar-title>
      <template v-slot:append>
        <v-icon icon="mdi-moon-waning-crescent" :color="toggleIsDark ? 'primary' : 'secondary'" />
        <v-switch inset v-model="toggleIsDark" hide-details class="mr-2" />
        <v-icon icon="mdi-white-balance-sunny" :color="toggleIsDark ? 'secondary' : 'primary'" />
      </template>
    </v-app-bar>
    <v-main>
      <v-container class="d-flex flex-column justify-center" id="layout-main">
        <ContributionCallout />
        <GeneratorPreview :config="config" :color="color" class="mb-5" />
        <GeneratorConfigurator
          :init-preset="preset"
          @updateColor="onUpdateColor"
          @updateConfig="onUpdateConfig"
        />
      </v-container>

      <AppFooter />
    </v-main>
  </v-layout>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { type CloudGeneratorConfig } from './generator/CloudGenerator'
import CloudPresets, { type CloudPreset } from './generator/CloudPresets'
import GeneratorConfigurator from './components/GeneratorConfigurator.vue'
import GeneratorPreview from './components/GeneratorPreview.vue'
import AppFooter from './components/AppFooter.vue'
import ContributionCallout from './components/ContributionCallout.vue'
import { useTheme } from 'vuetify'

const theme = useTheme()

const preset = ref<CloudPreset>(CloudPresets.find((item) => item.id === 'regular')!)
const config = ref<CloudGeneratorConfig>(preset.value)
const color = ref<string>(preset.value.color)
const toggleIsDark = ref(theme.global.current.value.dark)

const onUpdateConfig = (payload: CloudGeneratorConfig) => {
  if (!payload) {
    return
  }
  config.value = { ...payload }
}

const onUpdateColor = (payload: string) => {
  if (!payload) {
    return
  }
  color.value = payload
}

watch(
  () => toggleIsDark.value,
  () => {
    theme.global.name.value = toggleIsDark.value ? 'dark' : 'light'
  }
)
</script>

<style scoped>
#layout-main {
  min-height: calc(100vh - 120px);
}
</style>
