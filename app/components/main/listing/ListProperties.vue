<template>
  <section class="mx-auto max-w-7xl">
    <div class="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      <p class="text-lg text-gray-600 dark:text-gray-300">
        Showing {{ sortedRentals.length }} of {{ rentals?.length || 0 }} properties
        <span
          v-if="currentSort"
          class="ml-2 text-sm text-primary-600 dark:text-primary-400"
        >
          • {{ getSortLabel(currentSort) }}
        </span>
      </p>

      <UPopover :popper="{ placement: 'bottom-end' }">
        <UButton
          color="neutral"
          variant="outline"
          class="min-w-[160px] justify-between"
        >
          <span class="truncate">{{ getSortLabel(currentSort) }}</span>
          <UIcon name="i-lucide-chevron-down" class="ml-2 h-4 w-4" />
        </UButton>

        <template #content="{ close }">
          <div class="w-64 py-2">
            <p
              class="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
            >
              Sort Properties
            </p>

            <UButton
              v-for="option in uiSortTypes"
              :key="option.code"
              color="neutral"
              variant="ghost"
              class="w-full justify-start px-3 py-2.5"
              :class="
                currentSort === option.code
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              "
              @click="() => { sortProperties(option.code); close() }"
            >
              <template #leading>
                <UIcon
                  :name="getSortIcon(option.code)"
                  class="h-4 w-4"
                  :class="
                    currentSort === option.code
                      ? 'text-primary-600'
                      : 'text-gray-400'
                  "
                />
              </template>
              {{ option.name }}
            </UButton>
          </div>
        </template>
      </UPopover>
    </div>

    <div class="relative">
      <div v-if="pending" class="py-24 text-center">
        <div class="mx-auto h-20 w-20 animate-spin rounded-full border-4 border-primary-100 dark:border-primary-900" />
        <p class="mt-6 text-gray-600 dark:text-gray-400">
          Finding properties…
        </p>
      </div>

      <div v-else-if="error" class="py-24 text-center">
        <UIcon
          name="i-heroicons-exclamation-triangle-20-solid"
          class="mx-auto mb-6 h-12 w-12 text-red-500"
        />
        <h3 class="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
          Unable to Load Properties
        </h3>
        <p class="mb-8 text-gray-600 dark:text-gray-400">
          Please try again.
        </p>
        <UButton
          color="primary"
          size="lg"
          :loading="refreshing"
          @click="handleRefresh"
        >
          Retry
        </UButton>
      </div>

      <div v-else-if="!sortedRentals.length" class="py-24 text-center">
        <UIcon
          name="i-heroicons-magnifying-glass-20-solid"
          class="mx-auto mb-6 h-12 w-12 text-gray-400"
        />
        <h3 class="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
          No Properties Found
        </h3>
        <p class="mb-8 text-gray-600 dark:text-gray-400">
          Try adjusting your filters or search.
        </p>
        <UButton color="primary" size="lg" @click="handleRefresh">
          Browse All Properties
        </UButton>
      </div>

      <div v-else>
        <div class="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <PropertyCard
            v-for="rental in sortedRentals"
            :key="rental.id"
            :rental="rental"
            class="transition-transform duration-300 hover:scale-[1.02]"
          />
        </div>

        <div class="border-t border-gray-100 pt-12 dark:border-gray-800">
          <UButton
            color="primary"
            size="xl"
            class="mx-auto block px-8"
            @click="loadMore"
          >
            Load More
          </UButton>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { toast } from '#build/ui'
import type { FilterState } from '~/types/listings'
const toast = useToast()
const router = useRouter()
interface Rental {
  id: string
  price: number
  rating?: number
  distance?: number
  createdAt?: string
  [key: string]: any
}

interface SortType {
  name: string
  code: number
  icon?: string
}

const props = defineProps<{
  filters: FilterState | null
  search_query?: string
}>()

const currentSort = ref(5)
const refreshing = ref(false)

const { get } = useApi()
const endpoints = useEndpoints()

const uiSortTypes: SortType[] = [
  { name: 'Price: High to Low', code: 1, icon: 'i-lucide-arrow-down-wide-narrow' },
  { name: 'Price: Low to High', code: 2, icon: 'i-lucide-arrow-up-wide-narrow' },
  { name: 'Highly Rated', code: 3, icon: 'i-lucide-star' },
  { name: 'Closest to Campus', code: 4, icon: 'i-lucide-navigation' },
  { name: 'Newest Listings', code: 5, icon: 'i-lucide-calendar-plus' }
]

const getSortLabel = (code: number) =>
  uiSortTypes.find(s => s.code === code)?.name ?? 'Newest Listings'

const getSortIcon = (code: number) =>
  uiSortTypes.find(s => s.code === code)?.icon ?? 'i-lucide-sort-desc'

const sortProperties = (code: number) => {
  currentSort.value = code
  search()
}

const mapFilterToBackend = (filter: FilterState | null, query?: string) => {
  const payload: Record<string, any> = {}

  if (query?.trim()) payload.query = query.trim()
  if (filter) {
    if (filter.country) payload.country = filter.country
    if (filter.city) payload.city = filter.city
    if (filter.min != null) payload.price_min = filter.min
    if (filter.max != null) payload.price_max = filter.max
    if (filter.selectedPropertyTypes?.length)
      payload.property_type = filter.selectedPropertyTypes
    if (filter.selected_institutions?.length)
      payload.land_marks = filter.selected_institutions
    if (filter.distanceFromTargetInstitution?.val)
      payload.radius = filter.distanceFromTargetInstitution.val
    if (filter.verifiedOnly) payload.is_verified = true
    if (filter.availableNow) payload.status = ['available']
    if (filter.furnished) payload.amenities = ['furnished']
  }

  // Always include sort if set
  if (currentSort.value === 1) payload.sort_by = 'price_desc'
  else if (currentSort.value === 2) payload.sort_by = 'price_asc'
  else if (currentSort.value === 5) payload.sort_by = 'newest'

  return payload
}


const normalize = (items: any[]): Rental[] =>
  items.map((p, i) => ({
    ...p,
    id: p.id ?? `prop-${i}`,
    price: p.price ?? Math.floor(Math.random() * 50000) + 5000,
    rating: p.rating ?? +(Math.random() * 3 + 2).toFixed(1),
    distance: p.distance ?? +(Math.random() * 10 + 0.5).toFixed(1),
    createdAt:
      p.createdAt ??
      new Date(Date.now() - Math.random() * 30 * 86400000).toISOString()
  }))

const { data: rentals, pending, error, refresh } = useAsyncData<Rental[]>(
  'rentals',
  async () => {
    const hasSearch = props.filters || props.search_query
    const response = hasSearch
      ? await get(endpoints.rental.search, mapFilterToBackend(props.filters!, props.search_query))
      : await get(endpoints.rental.list)
    const items = response?.data || response || []
    return Array.isArray(items) ? normalize(items) : []
  },
  { server: true, default: () => [] }
)

const search = async () => {
  pending.value = true
  try {
    const params = mapFilterToBackend(props.filters!, props.search_query)
    const res = await get(endpoints.rental.search, params)

    if (!res || !res.success) {
      toast.add({
        color: 'error',
        title: 'Error searching properties'
      })
      return
    }

    rentals.value = normalize(res.data?.results ?? res.data ?? [])
  } catch (err) {
    toast.add({
      color: 'error',
      title: 'An unexpected error occurred'
    })
    console.error(err)
  } finally {
    pending.value = false
  }
}

const sortedRentals = computed(() => {
  const list = [...rentals.value]

  return currentSort.value === 1
    ? list.sort((a, b) => b.price - a.price)
    : currentSort.value === 2
    ? list.sort((a, b) => a.price - b.price)
    : currentSort.value === 3
    ? list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    : currentSort.value === 4
    ? list.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity))
    : list.sort(
        (a, b) =>
          new Date(b.createdAt ?? 0).getTime() -
          new Date(a.createdAt ?? 0).getTime()
      )
})

watch(
  () => [props.filters, props.search_query],
  () => search(),
  { deep: true }
)

const handleRefresh = async () => {
  refreshing.value = true
  await router.push('/listings')
  await refresh()
  refreshing.value = false
}

const loadMore = () => {}
</script>

