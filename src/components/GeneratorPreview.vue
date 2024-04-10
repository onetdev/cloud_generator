<template>
  <v-card id="preview" rounded="lg" variant="outlined" elevation="4" color="secondary">
    <v-card-title>Live preview</v-card-title>
    <v-card-text>
      <v-row justify="center">
        <svg
          width="400"
          height="400"
          :viewBox="`0 0 ${boundingWidth} ${boundingHeight}`"
          xmlns="http://www.w3.org/2000/svg"
          class="mx-auto"
          id="image"
        >
          <g v-if="boundingBox" :transform="`translate(${boundingBox.a.x * -1}, 0)`">
            <path id="path" :d="svgPath" :fill="color" stroke="none" stroke-width="0" />
          </g>
        </svg>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn
        :disabled="history.length <= 0"
        @click="historyBack"
        id="history"
        prepend-icon="mdi-history"
        size="small"
        tooltip="Revert last generation"
        variant="outlined"
      >
        Revert
      </v-btn>
      <v-btn
        @click="download"
        color="info"
        id="download"
        prepend-icon="mdi-cloud-download"
        size="small"
        variant="outlined"
      >
        Download
      </v-btn>
      <v-btn
        @click="generate"
        color="success"
        id="generate"
        prepend-icon="mdi-dice-5-outline"
        size="small"
        title="Generate next"
        variant="flat"
      >
        Next
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import CloudGenerator, {
  type BoundingBox,
  RenderMapper,
  type CloudGeneratorConfig
} from '../generator/CloudGenerator'

const props = defineProps<{
  config: CloudGeneratorConfig
  color: string
}>()

const svgPath = ref<string>('')
const history = ref<string[]>([])
const boundingBox = ref<BoundingBox>()
const boundingWidth = ref<number>()
const boundingHeight = ref<number>()

const generate = () => {
  const generator = new CloudGenerator(props.config)
  generator.generate()
  setSvgPath(generator.export())
}

const setSvgPath = (path: string, skipHistory: boolean = false) => {
  if (svgPath.value && !skipHistory) {
    history.value.push(svgPath.value)
  }

  svgPath.value = path
  boundingBox.value = RenderMapper.getBoundingCoordinates(svgPath.value)
  boundingWidth.value = boundingBox.value.b.x - boundingBox.value.a.x
  boundingHeight.value = boundingBox.value.b.y - boundingBox.value.a.y
}

const historyBack = () => {
  if (history.value.length === 0) return
  setSvgPath(history.value.pop()!, true)
}

/**
 * Now, we will build our SVG file in memory, clean up the whitespaces, new lines
 * and tabs then start the download on the clients side.
 */
const download = () => {
  if (!boundingBox.value) return

  const content = `<?xml version="1.0" encoding="utf-8"?>
      <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
      <svg
        xmlns='http://www.w3.org/2000/svg'
        xml:space='preserve' version='1.1'
        xmlns:xlink='http://www.w3.org/1999/xlink'
        overflow='visible'
        viewBox='0 0 ${boundingWidth.value} ${boundingHeight.value}'>
        <path
          d="${svgPath.value}"
          transform="translate(${boundingBox.value.a.x * -1}, 0)"
          fill="${props.color}"
          stroke="none"
          stroke-width="0"
          />
      </svg>`.replace(/[\s]+/gi, ' ')

  const blob = new Blob([content], { type: 'image/svg+xml;charset:utf-8' })
  downloadHack(blob, 'cloud_onetdev_com.svg')
}

const downloadHack = (content: Blob, filename?: string) => {
  const url = window.URL.createObjectURL(content)
  const a = document.createElement('a')
  document.body.appendChild(a)
  a.href = url
  a.download = filename || 'unknown_file'
  a.click()
  window.URL.revokeObjectURL(url)
}

watch(
  () => props.config,
  () => generate(),
  { immediate: true }
)
</script>
