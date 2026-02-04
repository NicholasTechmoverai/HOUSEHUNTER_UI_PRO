<template>
    <!-- HERO -->
    <section class="relative w-full h-[60vh] bg-gradient-to-br from-blue-700/90 to-blue-900/80 text-white">
        <div class="mx-auto flex h-full max-w-5xl flex-col justify-center gap-10 px-4">

            <!-- Heading -->
            <div class="space-y-6">
                <h1 class="text-4xl font-bold leading-tight sm:text-6xl lg:text-7xl">
                    {{ headerTitle }}
                </h1>

                <p class="max-w-2xl text-lg text-blue-100 sm:text-2xl">
                    {{ headerDescription }}
                </p>
            </div>

            <!-- Search -->
            <div class="space-y-4">
                <div class="flex h-20 items-center justify-between rounded-2xl bg-white px-4 text-gray-500 shadow-xl">
                    <div class="flex items-center gap-3">
                        <UIcon name="i-lucide-map-pin" class="size-6 text-gray-400" />
                        <span class="text-sm sm:text-base">
                            Search by location…
                        </span>
                    </div>

                    <UButton icon="i-lucide-search" label="Find Housing" size="lg" class="rounded-xl" />
                </div>

                <div class="flex flex-wrap items-center gap-3 text-base text-blue-100/90">
                    <div class="flex items-center gap-2">
                        <UIcon name="i-heroicons-fire" class="size-5 text-orange-300" />
                        <span class="font-medium">Popular near:</span>
                    </div>

                    <div class="flex flex-wrap gap-2">
                        <UButton v-for="popular in populars" :key="popular" :label="popular" variant="subtle"
                            class="rounded-full border border-white/20 bg-white/5 text-blue-100 hover:bg-white/10 hover:border-white/30 transition-all duration-200"
                            :ui="{ rounded: 'rounded-full' }" />
                    </div>
                </div>
            </div>

        </div>
    </section>

    <!-- ADS -->
    <section class="w-full py-16">
        <div class="mx-auto max-w-7xl px-4">

            <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div v-for="ad in topads" :key="ad.name"
                    class="group flex items-start gap-4 rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <!-- Icon / Image -->
                    <div :class="[
                        'flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110',
                        ad.color
                    ]">
                        <img v-if="ad.image" :src="ad.image" :alt="ad.name"
                            class="h-14 w-14 rounded-2xl object-cover ring-2 ring-primary" />
                            
                        <div v-else
                            :class="`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${ad.color}/50 group-hover:scale-110 transition-transform duration-300`">
                            <UIcon :name="ad.icon" class="size-8 text-white" />
                        </div>
                    </div>

                    <!-- Content -->
                    <div class="space-y-1">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-300">
                            {{ ad.name }}
                        </h3>

                        <p class="text-sm text-gray-600 line-clamp-2">
                            {{ ad.desc }}
                        </p>
                    </div>
                </div>
            </div>

        </div>
    </section>

    <USeparator />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const headerTitle = ref('Find your perfect house')

const headerDescription = ref(
    'Verified properties near campus, safe payments, and real student reviews. Moving in made simple.'
)

const populars = ref([
    'MIT Campus',
    'Harvard Square',
    'Boston University',
    'Northeastern',
    'Cambridge',
    'Allston'
])

const topads = ref([
    {
        icon: 'i-heroicons-shield-check',
        name: "Verified Landlords",
        desc: "Every property owner is thoroughly verified and background checked for your safety and peace of mind.",
        color: "from-blue-500 to-blue-600",
        image: ""
    },
    {
        icon: 'i-heroicons-lock-closed',
        name: "Secure Payments",
        desc: "Protected transactions with escrow services and payment guarantees. Your money stays safe until you move in.",
        color: "from-emerald-500 to-emerald-600",
        image: ""
    },
    {
        icon: 'i-heroicons-chat-bubble-left-right',
        name: "Real Reviews",
        desc: "Authentic feedback from verified students. No fake reviews, just honest experiences from your peers.",
        color: "from-amber-500 to-amber-600",
        image: 'data:image/jpeg;base64,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'
    },
])

</script>
