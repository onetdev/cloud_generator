import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createVuetify } from 'vuetify';

export const getVuetifyTestPlugin = () => {
  const vuetify = createVuetify({
    components,
    directives,
  })

  global.ResizeObserver = require('resize-observer-polyfill')
  return vuetify
}
