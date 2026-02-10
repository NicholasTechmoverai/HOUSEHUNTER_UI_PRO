<script setup lang="ts">
import { getYear } from 'date-fns'
import { useRouter } from 'vue-router'

const config = useAppConfig()
const router = useRouter()
const year = getYear(new Date())

const goBack = () => {
    router.back()
}
</script>

<template>
    <UApp>
        <header class="flex items-center justify-between px-4 py-0
         border-b border-gray-200 dark:border-gray-800">
            <AppLogo :size="1" />

            <UButton icon="i-heroicons-arrow-left" variant="ghost" color="neutral" size="sm" @click="goBack">
                Back
            </UButton>
        </header>

        <UMain class="min-h-[calc(100vh-340px)] ">
            <NuxtPage />
        </UMain>

        <footer class="mt-auto border-t border-gray-200 dark:border-gray-800">
    <USeparator icon="i-lucide-house-heart" />

            <div class="flex flex-col sm:flex-row items-center justify-between
               gap-3 px-6 py-4 text-sm">
                <div class="flex items-center">
                    <AppLogo :size="1" />
                    <p class="font-medium text-gray-700 dark:text-gray-300">
                        {{ config.site.name }}
                    </p>

                </div>


                <!-- Center Links -->
                <div class="flex items-center gap-4 text-gray-500 dark:text-gray-400">
                    <NuxtLink to="/privacy" class="hover:text-primary-600 dark:hover:text-primary-400">
                        Privacy
                    </NuxtLink>

                    <NuxtLink to="/help" class="hover:text-primary-600 dark:hover:text-primary-400">
                        Help
                    </NuxtLink>
                </div>

                <p class="text-gray-400">
                    © {{ year }}
                </p>
            </div>
        </footer>
    </UApp>
</template>
