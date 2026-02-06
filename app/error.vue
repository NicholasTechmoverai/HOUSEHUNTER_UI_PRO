<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

useSeoMeta({
  title: '404 · Page Not Found',
  description: 'The page you are looking for does not exist or has been moved.'
})

useHead({
  htmlAttrs: { lang: 'en' }
})
</script>

<template>
  <UApp>
    <section
      class="min-h-screen flex items-center justify-center
             bg-gradient-to-br from-gray-50 to-white
             dark:from-gray-950 dark:to-gray-900 px-6"
    >
      <div
        class="max-w-xl w-full text-center
               rounded-3xl border border-gray-200 dark:border-gray-800
               bg-white dark:bg-gray-900 p-10 space-y-6 shadow-sm"
      >
        <div class="flex justify-center">
          <div
            class="flex items-center justify-center w-20 h-20 rounded-full
                   bg-primary/10 text-primary"
          >
          <img src="/f_logo.png" alt="" srcset="">
          </div>
        </div>

        <div class="space-y-2">
          <h1 class="text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            404
          </h1>
          <p class="text-lg font-medium text-gray-700 dark:text-gray-300">
            Page not found
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            The page you’re trying to access doesn’t exist or was moved.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <UButton to="/" color="primary" size="lg" icon="i-lucide-home">
            Back to Home
          </UButton>
          <UButton
            color="neutral"
            variant="outline"
            size="lg"
            icon="i-lucide-arrow-left"
            @click="$router.back()"
          >
            Go Back
          </UButton>
        </div>
      </div>
    </section>
  </UApp>
</template>
