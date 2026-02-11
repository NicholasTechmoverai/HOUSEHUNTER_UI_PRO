<script setup lang="ts">
import type { FilterState } from '~/types/listings'

const route = useRoute()
const router = useRouter()
const endpoints = useEndpoints()
const { get } = useApi()
const showFilter = ref(true)
const filters = ref<FilterState | null>(null)
const searchQuery = ref('')

const toggleFilter = () => {
  showFilter.value = !showFilter.value
}

watch(showFilter, (open) => {
  if (open) {
    router.replace({
      query: { ...route.query, fltr: 'open' }
    })
  } else {
    const { fltr, ...rest } = route.query
    router.replace({ query: rest })
  }
})

watch(
  () => route.query.s_query,
  (val) => {
    searchQuery.value = typeof val === 'string' ? val : ''
  },
  { immediate: true }
)

const applyFilters = (value: FilterState) => {
  filters.value = { ...value }
}

const category = computed(() => route.params.category as string)

useSeoMeta({
  title: `Modern rentals`,
  description: 'Browse available rentals and find your next home.',
})

const {
  data: rentals,
  pending: allLoading,
  error: allError,
  refresh: refreshAll,
} = await useAsyncData(
  () => `all-rentals-${category.value}`,
  () => get(endpoints.rental.list, { category: category.value }),
  {
    watch: [category],
  }
)
</script>

<template>
  <section class="mx-auto max-w-[1400px] p-6">
    <NavigationBreadCrumb />

    <!-- Header -->
    <div class="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100">
          Student Housing
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          Find your perfect accommodation near campus
        </p>
      </div>

      <div class="flex items-center gap-3">
        <UButton icon="i-lucide-filter" size="md" :label="showFilter ? 'Hide Filters' : 'Show Filters'"
          :variant="showFilter ? 'solid' : 'outline'" :color="showFilter ? 'primary' : 'neutral'"
          @click="toggleFilter" />

        <UFieldGroup>
          <UButton color="neutral" size="md" variant="subtle" icon="i-lucide-grid" />
          <UButton to="/map" color="neutral" size="md" variant="outline" icon="i-lucide-map" />
        </UFieldGroup>
      </div>
    </div>

    <!-- Search -->
    <div class="my-5">
      <SearchCard />
    </div>

    <!-- Content -->
    <div class="flex flex-col gap-6 lg:flex-row">
      <Transition name="slide-fade">
        <aside v-if="showFilter" class="lg:w-1/4">
          <FilterCard @apply="applyFilters" />
        </aside>
      </Transition>

      <main :class="[
        'transition-all duration-300',
        showFilter ? 'lg:w-3/4' : 'w-full'
      ]">
        <ListProperties :filters="filters" :search_query="searchQuery" />
      </main>
    </div>
  </section>
</template>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}
</style>
