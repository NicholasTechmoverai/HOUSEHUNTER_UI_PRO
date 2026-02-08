// import { createPinia } from 'pinia'
// import { createPersistedState } from 'pinia-plugin-persistedstate'

// const pinia = createPinia()

// pinia.use(createPersistedState({
//   storage: sessionStorage,
// }))

import { defineNuxtPlugin } from '#app'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.$pinia.use(piniaPluginPersistedstate)
})