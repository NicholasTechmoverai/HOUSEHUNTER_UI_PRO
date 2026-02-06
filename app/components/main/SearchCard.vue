<template>
    <UPopover v-model:open="openSuggestionModal" :dismissible="false"
        :ui="{ content: 'w-(--reka-popper-anchor-width) p-4' }">
        <template #anchor>
            <div class="mx-4">
                <div class="flex items-center gap-2 p-2 rounded-2xl border
              dark:bg-gray-900/30
             border-gray-200 dark:border-gray-700
             focus-within:ring-2 focus-within:ring-primary/30
             transition">
                    <!-- Search Input -->
                    <UInput v-model="searchQuery" icon="i-lucide-search"
                        placeholder="Search by institution, location, or housing type" variant="none" color="neutral"
                        class="flex-1" :loading="loading" @keydown.enter.prevent="commitSearch" @focus="openSuggestionModal = true" @blur="openSuggestionModal = false"/>

                    <!-- Clear Button -->
                    <UButton v-if="searchQuery" icon="i-lucide-x" color="neutral" variant="ghost" size="sm"
                        aria-label="Clear search" @click="clearSearch" />

                    <!-- Search Button -->
                    <UButton color="primary" size="sm" icon="i-lucide-search" label="Search" @click="commitSearch" />
                </div>

                <!-- Helper Text -->
                <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Tip: Press <kbd class="px-1 rounded bg-gray-100 dark:bg-gray-800">Enter</kbd> to search faster
                </p>
            </div>
        </template>

        <template #content>
            <Placeholder class="w-full aspect-square" />
            .........................
        </template>
    </UPopover>



</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from '#app'
const openSuggestionModal = ref(false)

const route = useRoute()
const router = useRouter()

const searchQuery = ref<string>('')
const loading = ref(false)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

/* Sync input from URL */
watch(
    () => route.query.s_query,
    (val) => {
        if (typeof val === 'string') {
            searchQuery.value = val
        } else {
            searchQuery.value = ''
        }
    },
    { immediate: true }
)


const updateRoute = async (value: string) => {
    loading.value = true

    if (value.trim()) {
        await router.replace({
            query: { ...route.query, s_query: value.trim() }
        })
    } else {
        const { s_query, ...rest } = route.query
        await router.replace({ query: rest })
    }

    loading.value = false
}

/* Manual commit (button / enter) */
const commitSearch = () => {
    if (debounceTimer) clearTimeout(debounceTimer)
    updateRoute(searchQuery.value)
}

const clearSearch = () => {
    searchQuery.value = ''
}
</script>
