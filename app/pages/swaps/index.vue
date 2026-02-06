<template>
  <div class="py-16 bg-gradient-to-br from-green-100 to-emerald-50 dark:from-emerald-400/0 dark:to-emerald-500/20">
    <section class="p-6 max-w-[1400px] mx-auto">
      <!-- Breadcrumb -->
      <NavigationBreadCrumb />


      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 class="flex items-center gap-2 text-xl font-semibold">
            <UIcon name="i-lucide-arrow-right-left" class="w-5 h-5 text-primary" />
            Housing Swap Marketplace
          </h1>
          <p class="text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
            Connect with verified students across Kenya to seamlessly swap housing near your institution.
          </p>
        </div>

        <div class="flex items-center gap-3 mt-4 lg:mt-0">
          <UButton @click="toggleFilter" icon="i-lucide-filter" size="md"
            :label="showFilter ? 'Hide Filters' : 'Show Filters'" :variant="showFilter ? 'solid' : 'outline'"
            :color="showFilter ? 'primary' : 'neutral'" class="dark:border-gray-600 dark:text-gray-300" />
          <UFieldGroup class="flex">
            <UButton color="neutral" size="md" variant="subtle" icon="i-lucide-grid"
              class="dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700" />
            <UButton to="/map" color="neutral" size="md" variant="outline" icon="i-lucide-map"
              class="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800" />
          </UFieldGroup>
        </div>
      </div>



      <!-- Search -->
      <div class="my-5 m-auto">
        <SearchCard />
      </div>


      <!-- Content -->
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Filters -->
        <Transition name="slide-fade">
          <aside v-if="showFilter" class="lg:w-1/4">
            <FilterCard @apply="applyFilters" />
          </aside>
        </Transition>

        <!-- Listings -->
        <main :class="[
          'transition-all duration-300',
          showFilter ? 'lg:w-3/4' : 'w-full'
        ]">
          <ListProperties :filters="activeFilters" :search_query="route.query.s_query || ''" />
        </main>
      </div>
    </section>
  </div>

</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from '#app'

const route = useRoute()
const router = useRouter()

const showFilter = ref(true)
const activeFilters = ref({})

const toggleFilter = () => {
  showFilter.value = !showFilter.value
}

const applyFilters = (filter: any) => {
  activeFilters.value = {
    minPrice: filter.min,
    maxPrice: filter.max,
    maxDistance: filter.distanceFromTargetInstitution?.val,
    institution: filter.targetInstitution,
    propertyTypes: filter.selectedPropertyTypes,
    institutions: filter.selected_institutions
  }
}

watch(
  () => route.query.s_query,
  () => { },
  { immediate: true }
)

watch(showFilter, (val) => {
  if (val) {
    router.replace({
      query: {
        ...route.query,
        fltr: 'open'
      }
    });
  } else {
    const { fltr, ...rest } = route.query;
    router.replace({ query: rest });
  }
});
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}
</style>
