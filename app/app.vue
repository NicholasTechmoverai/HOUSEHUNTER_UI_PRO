<script setup lang="ts">
import { useStateStore } from './stores/state'

const colorMode = useColorMode()
const stateStore = useStateStore()

const color = computed(() => colorMode.value === 'dark' ? '#1b1718' : 'white')

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const config = useAppConfig()



useSeoMeta({
  title :config.site.name,
  description:config.site.description,
  ogTitle: config.site.name,
  ogDescription: config.site.description,
  ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/dashboard-light.png',
  twitterImage: 'https://ui.nuxt.com/assets/templates/nuxt/dashboard-light.png',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator />
    <!-- <p>{{ stateStore }}</p> -->
    <NuxtLayout :name="stateStore.layout">
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
