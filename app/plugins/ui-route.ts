// plugins/ui-route.client.ts
import { useStateStore } from '~/store/state'
import { watch } from 'vue'
import { useRoute, useRouter } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  const state = useStateStore()
  const route = useRoute()

  // Initial route
  updateUI(route.path)

  // Watch route changes
  watch(
    () => route.path,
    (newPath) => {
      updateUI(newPath)
    }
  )

  function updateUI(path: string) {
    if (path.startsWith('/admin')) {
      state.setNavbar(false)
      state.setFooter(false)
      state.setLayout('admin')
    } else {
      state.setNavbar(true)
      state.setFooter(true)
      state.setLayout('default')
    }
    console.log('Route changed:', path)
  }
})
