<template>
  <div>
    <b-row id="preview" class="mt-5 mb-5 mx-auto">
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
      <div class="actions">
        <b-button
          v-if="history.length > 0"
          id="history"
          variant="warning"
          class="mr-2 mb-2 px-4"
          @click="historyBack"
          tooltip="Revert last generation"
        >
          <font-awesome-icon icon="history" />
        </b-button>

        <b-button
          id="download"
          variant="info"
          class="mr-2 mb-2 px-4"
          @click="download"
          title="Download"
        >
          <font-awesome-icon icon="cloud-download-alt" />
        </b-button>

        <b-button
          id="generate"
          variant="danger"
          class="mr-2 mb-2 px-4"
          @click="generate"
          title="Generate new"
        >
          <font-awesome-icon icon="dice" />
        </b-button>
      </div>
    </b-row>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
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

  console.log(boundingBox.value, boundingWidth.value, boundingHeight.value)

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

<style scoped lang="scss">
#preview {
  position: relative;
  border: 1px solid #dcdcdc;
  background: #fff;
  border-radius: 10px;
  box-shadow: 5px 5px 10px rgba(223, 223, 223, 0.58);
  max-width: 600px;
}
.actions {
  position: absolute;
  right: 0;
  bottom: 0;
}
#download,
#generate {
  opacity: 0.8;
  transition: ease 200ms opacity;
  &:hover {
    opacity: 0.8;
  }
}
</style>
