<template>
    <section class="max-w-7xl mx-auto">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
            <div>
                <p class="text-lg text-gray-600 dark:text-gray-300">
                    Showing {{ sortedRentals.length }} of {{ allRentals?.length || 0 }} properties
                    <span v-if="currentSort" class="ml-2 text-sm text-primary-600 dark:text-primary-400">
                        • {{ getSortLabel(currentSort) }}
                    </span>
                </p>
            </div>
            
            <UPopover :popper="{ placement: 'bottom-end' }">
                <UButton color="neutral" variant="outline" class="min-w-[160px] justify-between">
                    <span class="truncate">{{ getSortLabel(currentSort) }}</span>
                    <UIcon name="i-lucide-chevron-down" class="w-4 h-4 ml-2 flex-shrink-0" />
                </UButton>
                
                <template #content="{ close }">
                    <div class="py-2 w-64">
                        <div class="px-3 py-2">
                            <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Sort Properties
                            </p>
                        </div>
                        <div class="space-y-1">
                            <UButton
                                v-for="sortOption in uiSortTypes"
                                :key="sortOption.code"
                                :label="sortOption.name"
                                color="neutral"
                                variant="ghost"
                                :class="[
                                    'w-full justify-start px-3 py-2.5',
                                    currentSort === sortOption.code
                                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                                ]"
                                @click="() => { sortProperties(sortOption.code); close(); }"
                            >
                                <template #leading>
                                    <UIcon 
                                        :name="getSortIcon(sortOption.code)" 
                                        class="w-4 h-4"
                                        :class="currentSort === sortOption.code ? 'text-primary-600' : 'text-gray-400'"
                                    />
                                </template>
                            </UButton>
                        </div>
                    </div>
                </template>
            </UPopover>
        </div>

        <div class="relative">
            <div v-if="allLoading" class="py-24">
                <div class="flex flex-col items-center justify-center">
                    <div class="relative">
                        <div class="w-20 h-20 rounded-full border-4 border-primary-100 dark:border-primary-900 animate-spin"></div>
                        <div class="absolute inset-0 flex items-center justify-center">
                            <UIcon name="i-heroicons-home-modern-20-solid" class="w-10 h-10 text-primary-500 dark:text-primary-400" />
                        </div>
                    </div>
                    <div class="mt-8 text-center">
                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Finding Properties</h3>
                        <p class="text-gray-600 dark:text-gray-400 max-w-md">
                            Searching near {{ featured_institution }}
                        </p>
                    </div>
                </div>
            </div>

            <div v-else-if="allError" class="py-24">
                <div class="flex flex-col items-center justify-center max-w-md mx-auto text-center">
                    <div class="relative mb-6">
                        <div class="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                            <UIcon name="i-heroicons-exclamation-triangle-20-solid" class="w-10 h-10 text-red-500" />
                        </div>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">Unable to Load</h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-8">
                        Please check your connection and try again.
                    </p>
                    <UButton color="primary" variant="solid" :loading="refreshing" @click="handleRefresh" size="lg" class="px-8">
                        Try Again
                    </UButton>
                </div>
            </div>

            <div v-else-if="!sortedRentals.length" class="py-24">
                <div class="flex flex-col items-center justify-center max-w-md mx-auto text-center">
                    <div class="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                        <UIcon name="i-heroicons-magnifying-glass-20-solid" class="w-12 h-12 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">No Properties Found</h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-8">
                        No properties available near {{ featured_institution }}
                    </p>
                    <UButton color="primary" variant="solid" to="/properties" size="lg">
                        Browse All Properties
                    </UButton>
                </div>
            </div>

            <div v-else>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
                    <PropertyCard 
                        v-for="(rental, index) in sortedRentals" 
                        :key="rental.id || index" 
                        :rental="rental"
                        class="h-full transition-transform duration-300 hover:scale-[1.02]" 
                    />
                </div>

                
        </div>

        <div v-if="sortedRentals.length" class="border-t border-gray-100 dark:border-gray-800 pt-12">
            
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <UButton @click="loadMore" icon="i-heroicons-magnifying-glass-20-solid" color="primary" variant="solid" size="xl" class="px-8">
                        Load more
                    </UButton>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
interface Rental {
    id: string;
    price: number;
    rating?: number;
    distance?: number;
    createdAt?: string;
    title?: string;
    location?: string;
    [key: string]: any;
}

interface SortType {
    name: string;
    code: number;
    icon?: string;
}

const featured_institution = ref('MUT');
const currentSort = ref(5);
const refreshing = ref(false);

const { get } = useApi();
const endpoints = useEndpoints();

const uiSortTypes: SortType[] = [
    { name: "Price: High to Low", code: 1, icon: "i-lucide-arrow-down-wide-narrow" },
    { name: "Price: Low to High", code: 2, icon: "i-lucide-arrow-up-wide-narrow" },
    { name: "Highly Rated", code: 3, icon: "i-lucide-star" },
    { name: "Closest to Campus", code: 4, icon: "i-lucide-navigation" },
    { name: "Newest Listings", code: 5, icon: "i-lucide-calendar-plus" }
];

const getSortIcon = (code: number): string => {
    const sortType = uiSortTypes.find(type => type.code === code);
    return sortType?.icon || "i-lucide-sort-desc";
};

const getSortLabel = (code: number): string => {
    const sortType = uiSortTypes.find(type => type.code === code);
    return sortType ? sortType.name : "Newest Listings";
};

const sortProperties = (code: number): void => {
    currentSort.value = code;
};

const { data: allRentals, pending: allLoading, error: allError, refresh: refreshAll } = await useAsyncData(
    'featured-properties',
    async (): Promise<Rental[]> => {
        try {
            const response = await get(endpoints.rental.list);
            const properties = response?.data || response || [];

            if (Array.isArray(properties)) {
                return properties.map((prop: any, index: number) => ({
                    ...prop,
                    id: prop.id || `prop-${index}`,
                    price: prop.price || Math.floor(Math.random() * 50000) + 5000,
                    rating: prop.rating || parseFloat((Math.random() * 3 + 2).toFixed(1)),
                    distance: prop.distance || parseFloat((Math.random() * 10 + 0.5).toFixed(1)),
                    createdAt: prop.createdAt || new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
                })).slice(0, 6);
            }
            
            return [];
        } catch (error) {
            console.error('Error fetching properties:', error);
            throw error;
        }
    },
    {
        server: true,
        lazy: false,
        default: () => []
    }
);

const sortedRentals = computed<Rental[]>(() => {
    if (!allRentals.value) return [];

    const rentals = [...allRentals.value];

    switch (currentSort.value) {
        case 1:
            return rentals.sort((a, b) => (b.price || 0) - (a.price || 0));
        case 2:
            return rentals.sort((a, b) => (a.price || 0) - (b.price || 0));
        case 3:
            return rentals.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        case 4:
            return rentals.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
        case 5:
            return rentals.sort((a, b) => 
                new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
            );
        default:
            return rentals;
    }
});

const handleRefresh = async (): Promise<void> => {
    refreshing.value = true;
    try {
        await refreshAll();
    } finally {
        refreshing.value = false;
    }
};

const loadMore= ()=>{

}
</script>

<style scoped>
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.animate-spin {
    animation: spin 1s linear infinite;
}

.hover\:scale-\[1\.02\]:hover {
    transform: scale(1.02);
}
</style>