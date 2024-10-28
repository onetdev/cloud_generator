import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createVuetify } from 'vuetify';
import resizeObserverPolyfill from 'resize-observer-polyfill'

export const getVuetifyTestPlugin = () => {
  const vuetify = createVuetify({
    components,
    directives,
  })

  global.ResizeObserver = resizeObserverPolyfill
  return vuetify
}
