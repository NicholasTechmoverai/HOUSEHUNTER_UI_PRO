<template>
  <section class="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
      <div class="max-w-2xl">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/20 rounded-full mb-4">
          <UIcon name="i-heroicons-star-20-solid" class="w-4 h-4 text-primary-600 dark:text-primary-400" />
          <span class="text-sm font-medium text-primary-700 dark:text-primary-300">Exclusive Selection</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-3">
          Featured Properties
          <span class="block text-3xl md:text-4xl font-semibold text-primary-600 dark:text-primary-400 mt-1">
            Near {{ featured_institution }}
          </span>
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          Hand-picked verified homes with premium amenities and verified landlords
        </p>
      </div>
      <UButton 
        to="/properties" 
        icon="i-heroicons-arrow-right-circle-20-solid" 
        variant="outline" 
        color="primary"
        size="lg" 
        class="whitespace-nowrap"
      >
        View All Properties
      </UButton>
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
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Curating Your Perfect Matches</h3>
            <p class="text-gray-600 dark:text-gray-400 max-w-md">
              We're finding properties that match your preferences near {{ featured_institution }}
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
            <div class="absolute -top-2 -right-2 w-10 h-10 bg-white dark:bg-gray-900 rounded-full border-4 border-white dark:border-gray-900 flex items-center justify-center">
              <div class="w-6 h-6 bg-red-500 rounded-full"></div>
            </div>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">Temporary Connection Issue</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-8">
            We're unable to load properties at the moment. This might be due to network issues or server maintenance.
          </p>
          <div class="flex flex-col sm:flex-row gap-4">
            <UButton color="primary" variant="solid" :loading="refreshing" @click="handleRefresh" size="lg" class="px-8">
              <template #leading>
                <UIcon name="i-heroicons-arrow-path-20-solid" />
              </template>
              Try Again
            </UButton>
            <UButton color="gray" variant="ghost" @click="contactSupport" size="lg">
              Contact Support
            </UButton>
          </div>
        </div>
      </div>

      <div v-else-if="!allRentals?.length" class="py-24">
        <div class="flex flex-col items-center justify-center max-w-md mx-auto text-center">
          <div class="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
            <UIcon name="i-heroicons-magnifying-glass-20-solid" class="w-12 h-12 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">No Featured Properties Available</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-8">
            We couldn't find any featured properties near {{ featured_institution }} at the moment. New listings are added daily.
          </p>
          <div class="flex flex-col sm:flex-row gap-4">
            <UButton color="primary" variant="solid" to="/properties" size="lg">
              Browse All Properties
            </UButton>
            <UButton color="gray" variant="outline" @click="refreshAll" size="lg">
              Check Again
            </UButton>
          </div>
        </div>
      </div>

      <div v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          <PropertyCard v-for="(rental, index) in allRentals" :key="rental.id || index" :rental="rental" class="h-full" />
        </div>

        <div class="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-2xl p-6 mb-12 border border-primary-100 dark:border-primary-800/30">
          <div class="flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center shadow-sm">
                <UIcon name="i-heroicons-shield-check-20-solid" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 dark:text-white">All Properties Verified</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">Every listing is personally inspected and verified</p>
              </div>
            </div>
            <div class="flex items-center gap-6">
              <div class="text-center">
                <div class="text-2xl font-bold text-primary-700 dark:text-primary-300">{{ allRentals.length }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Featured Properties</div>
              </div>
              <div class="hidden md:block h-10 w-px bg-primary-200 dark:bg-primary-700"></div>
              <div class="text-center">
                <div class="text-2xl font-bold text-primary-700 dark:text-primary-300">24/7</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Support Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="allRentals?.length" class="border-t border-gray-100 dark:border-gray-800 pt-12">
      <div class="text-center">
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Didn't find what you're looking for?
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          We have hundreds more properties available. Use our advanced filters to find your perfect match.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton 
            to="/properties" 
            icon="i-heroicons-magnifying-glass-20-solid" 
            color="primary"
            variant="solid" 
            size="xl" 
            class="px-8"
          >
            Explore All Properties
          </UButton>
          <UButton 
            to="/properties/filters" 
            icon="i-heroicons-funnel-20-solid" 
            color="gray" 
            variant="outline"
            size="xl" 
            class="px-8 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            Use Advanced Filters
          </UButton>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
const featured_institution = ref('MUT');

const { get } = useApi();
const endpoints = useEndpoints();

// Fetch properties with improved error handling
const {
    data: allRentals,
    pending: allLoading,
    error: allError,
    refresh: refreshAll
} = await useAsyncData(
    'featured-properties',
    async () => {
        try {
            const response = await get(endpoints.rental.list);

            // Handle different response structures
            const properties = response?.data || response || [];

            return Array.isArray(properties)
                ? properties.slice(0, 3) // Limit to 3 featured properties
                : [];
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

// Track refresh state
const refreshing = ref(false);

// Enhanced refresh function
const handleRefresh = async () => {
    refreshing.value = true;
    try {
        await refreshAll();
    } finally {
        refreshing.value = false;
    }
};

// Contact support function
const contactSupport = () => {
    // Implement contact support logic
    console.log('Contact support clicked');
    // Could open a modal, navigate to contact page, or show a form
};
</script>