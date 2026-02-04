<template>
    <section class="py-16 bg-gradient-to-br from-green-100 to-emerald-50 dark:from-emerald-400/0 dark:to-emerald-500/20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Header -->
            <div class="text-center mb-12 max-w-3xl mx-auto">
                <div class="inline-flex items-center gap-3 mb-4 bg-white dark:bg-gray-800 px-4 py-2 rounded-full">
                    <UIcon name="i-lucide-arrow-left-right" class="w-6 h-6 text-green-600 dark:text-green-400" />
                    <span class="text-sm font-semibold text-green-700 dark:text-green-300">Swap Marketplace</span>
                </div>
                <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                    Housing Swap Marketplace
                </h1>
                <p class="text-lg text-gray-600 dark:text-gray-300">
                    Need to relocate? Find verified students across Kenya to swap housing with. Save money, live near
                    campus, and enjoy flexibility.
                </p>
            </div>

            <!-- Stats Grid -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div v-for="feature in features" :key="feature.title"
                    class="p-6 text-center border border-green-200 dark:border-green-900/30 rounded-2xl bg-white dark:bg-gray-900">
                    <UIcon :name="feature.icon" class="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">{{ feature.title }}</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ feature.desc }}</p>
                </div>
            </div>

            <!-- Swap Properties -->
            <div class="relative">
                <!-- Loading -->
                <div v-if="allLoading" class="py-12 text-center">
                    <div
                        class="w-12 h-12 rounded-full border-4 border-green-200 border-t-green-600 animate-spin mx-auto mb-4">
                    </div>
                    <p class="text-gray-600 dark:text-gray-400">Finding swap properties...</p>
                </div>

                <!-- Error -->
                <div v-else-if="allError" class="py-12 text-center">
                    <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Unable to load swaps</h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-6">Please try again</p>
                    <UButton color="green" variant="solid" :loading="refreshing" @click="handleRefresh">
                        Try Again
                    </UButton>
                </div>

                <!-- Empty -->
                <div v-else-if="!swapProperties?.length" class="py-12 text-center">
                    <UIcon name="i-heroicons-swap-horizontal" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No swaps available</h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-6">Check back later for new swap opportunities</p>
                </div>

                <!-- Properties Grid -->
                <div v-else>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <PropertyCard v-for="property in swapProperties" :key="property.id" :rental="property" />
                    </div>
                </div>
            </div>

            <div class="text-center mt-12">
                <UButton to="/swaps" color="success" variant="solid" size="xl" icon="i-lucide-arrow-left-right"
                    label="Explore Swaps" class="px-8" />
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
const features = [
    { icon: "i-lucide-check-circle", title: "Verified Users", desc: "Only verified users can swap" },
    { icon: "i-lucide-map-pin", title: "Campus Proximity", desc: "Live closer to your campus" },
    { icon: "i-lucide-shield", title: "Save Money", desc: "Avoid double rent payments" },
    { icon: "i-lucide-users", title: "Flexible", desc: "Short or long term swaps" }
]

const { get } = useApi()
const endpoints = useEndpoints()

const {
    data: swapProperties,
    pending: allLoading,
    error: allError,
    refresh: refreshAll
} = await useAsyncData(
    'swap-properties',
    async () => {
        try {
            const response = await get(endpoints.rental.list)
            const properties = response?.data || response || []
            return Array.isArray(properties) ? properties.slice(0, 6) : []
        } catch (error) {
            console.error('Error fetching swap properties:', error)
            throw error
        }
    },
    { server: true, lazy: false, default: () => [] }
)

const refreshing = ref(false)
const handleRefresh = async () => {
    refreshing.value = true
    try {
        await refreshAll()
    } finally {
        refreshing.value = false
    }
}
</script>