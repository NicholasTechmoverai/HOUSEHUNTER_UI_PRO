<template>
  <Transition name="slide-fade">
    <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">Filters</h2>
        <UButton color="neutral" variant="ghost" size="sm" icon="i-lucide-x" @click="toggleFilter" class="lg:hidden" />
      </div>

      <div class="space-y-8">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Monthly Rent</span>
            <span class="text-sm text-gray-600 dark:text-gray-400">
              KES {{ filter.min.toLocaleString() }} - {{ filter.max.toLocaleString() }}
            </span>
          </div>
          <div class="flex items-center gap-3 mb-4">
            <UInputNumber v-model="filter.min" :min="0" :max="filter.max" class="w-full" placeholder="Min" />
            <span class="text-gray-400 dark:text-gray-500 text-sm">to</span>
            <UInputNumber v-model="filter.max" :min="filter.min" :max="filter.maxRange" class="w-full"
              placeholder="Max" />
          </div>
          <div class="px-1">
            <URange v-model="priceRange" :min="0" :max="filter.maxRange" class="w-full" />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Distance from
              <UBadge color="neutral" variant="outline" class="ml-2">
                {{ filter.targetInstitution }}
              </UBadge>
            </span>
            <span class="text-sm text-gray-600 dark:text-gray-400">
              Within {{ filter.distanceFromTargetInstitution.val }}
              {{ filter.distanceFromTargetInstitution.unit }}
            </span>
          </div>
          <div class="px-1">
            <USlider v-model="filter.distanceFromTargetInstitution.val" :min="0"
              :max="filter.distanceFromTargetInstitution.maxRange" :step="filter.distanceFromTargetInstitution.step"
              class="w-full" />
          </div>
        </div>
      </div>

      <USeparator class="my-6" />

      <div class="space-y-6">
        <div>
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</h3>
          <USelectMenu v-model="filter.country" :items="countries" label-key="name" value-key="code"
            placeholder="Select country" class="w-full mb-2" searchable searchable-placeholder="Search countries..."
            by="code" disabled>
            <template #label>
              <div class="flex items-center gap-2">
                <UIcon v-if="selectedCountry" :name="selectedCountry.flag" class="w-4 h-4" />
                <span>{{ selectedCountry ? selectedCountry.name : 'Select country' }}</span>
              </div>
            </template>

            <template #option="{ option }">
              <div class="flex items-center gap-3">
                <UIcon :name="option.flag" class="w-4 h-4 flex-shrink-0" />
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ option.name }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">{{ option.continent }}</div>
                </div>
              </div>
            </template>
          </USelectMenu>

          <USelectMenu v-model="filter.city" :items="counties" label-key="name" value-key="code" multiple
            placeholder="Select counties..." class="w-full" searchable searchable-placeholder="Search counties...">
            <template #label>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-map-pin" class="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span v-if="filter.city.length === 0">Select counties...</span>
                <span v-else class="text-primary-600 dark:text-primary-400">{{ filter.city.length }} selected</span>
              </div>
            </template>

            <template #option="{ option }">
              <div class="flex items-center justify-between w-full">
                <span>{{ option.name }}</span>
                <span class="text-xs text-gray-500 dark:text-gray-400">{{ option.dist || '' }}</span>
              </div>
            </template>
          </USelectMenu>
        </div>

        <div>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200">Property Type</h3>
            <div class="flex items-center gap-2">
              <UButton v-if="filter.selectedPropertyTypes.length > 0" color="neutral" variant="soft" size="xs"
                @click="clearAllPropertyTypes">
                Clear
              </UButton>
              <UButton color="neutral" variant="soft" size="xs" @click="selectAllPropertyTypes"
                :disabled="filteredPropertyTypes.length === 0">
                Select all
              </UButton>
            </div>
          </div>

          <div class="space-y-4">
            <UInput v-model="propertyTypeSearch" placeholder="Search property types..." icon="i-lucide-search"
              class="w-full" />

            <div v-if="filter.selectedPropertyTypes.length > 0"
              class="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <UBadge v-for="selectedType in filter.selectedPropertyTypes.slice(0, 3)" :key="selectedType"
                color="primary" variant="subtle" class="flex items-center gap-1">
                {{ getPropertyTypeLabel(selectedType) }}
                <button @click="removePropertyType(selectedType)" class="ml-1 hover:opacity-80">
                  <UIcon name="i-lucide-x" class="w-3 h-3" />
                </button>
              </UBadge>
              <UBadge v-if="filter.selectedPropertyTypes.length > 3" color="neutral" variant="outline">
                +{{ filter.selectedPropertyTypes.length - 3 }} more
              </UBadge>
            </div>

            <div class="space-y-2 max-h-80 overflow-y-auto pr-2">
              <div v-for="propertyType in filteredPropertyTypes" :key="propertyType.value" :class="[
                'flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all duration-200',
                filter.selectedPropertyTypes.includes(propertyType.value)
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-700'
                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              ]" @click="togglePropertyType(propertyType.value)">
                <div class="flex items-center gap-3 flex-1 min-w-0">
                  <UIcon :name="propertyType.icon" class="w-4 h-4 flex-shrink-0" :class="filter.selectedPropertyTypes.includes(propertyType.value)
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-500 dark:text-gray-400'" />
                  <div class="flex-1 min-w-0">
                    <span :class="[
                      'text-sm truncate block',
                      filter.selectedPropertyTypes.includes(propertyType.value)
                        ? 'text-primary-700 dark:text-primary-300 font-medium'
                        : 'text-gray-700 dark:text-gray-300'
                    ]">
                      {{ propertyType.label }}
                    </span>
                    <p v-if="propertyType.description" class="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {{ propertyType.description }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-2 flex-shrink-0">
                  <span v-if="propertyType.count"
                    class="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                    {{ propertyType.count }}
                  </span>
                  <UIcon v-if="filter.selectedPropertyTypes.includes(propertyType.value)" name="i-lucide-check"
                    class="w-4 h-4 text-primary-600 dark:text-primary-400" />
                </div>
              </div>

              <div v-if="filteredPropertyTypes.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
                No property types found
              </div>
            </div>

            <div class="text-sm text-gray-500 dark:text-gray-400 flex justify-between pt-2">
              <span>
                {{ filter.selectedPropertyTypes.length }} of {{ propertyTypes.length }} selected
              </span>
              <span v-if="propertyTypeSearch" class="text-primary-600 dark:text-primary-400">
                {{ filteredPropertyTypes.length }} matches
              </span>
            </div>
          </div>
        </div>
      </div>

      <USeparator class="my-6" />

      <div>
        <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Nearby Institutions & Landmarks</h3>
        <div class="space-y-4">
          <USelectMenu v-model="filter.selected_institutions" :items="institutions" label-key="name" value-key="code"
            multiple placeholder="Select institutions..." class="w-full" searchable
            searchable-placeholder="Search institutions..." :searchable-attributes="['name', 'type']">
            <template #label>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-building" class="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span v-if="filter.selected_institutions.length === 0">Select institutions...</span>
                <span v-else class="text-primary-600 dark:text-primary-400">{{ filter.selected_institutions.length }}
                  selected</span>
              </div>
            </template>

            <template #option="{ option }">
              <div class="flex items-center justify-between w-full">
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ option.name }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">{{ option.type }}</div>
                </div>
                <span class="text-xs text-gray-500 dark:text-gray-400 ml-2">{{ option.dist }}</span>
              </div>
            </template>
          </USelectMenu>

          <div v-if="filter.selected_institutions.length > 0" class="flex flex-wrap gap-2">
            <UBadge v-for="selectedCode in filter.selected_institutions" :key="selectedCode" color="primary"
              variant="subtle" class="flex items-center gap-1">
              {{ getInstitutionName(selectedCode) }}
              <button @click="removeInstitution(selectedCode)" class="ml-1 hover:opacity-80">
                <UIcon name="i-lucide-x" class="w-3 h-3" />
              </button>
            </UBadge>
          </div>
        </div>
      </div>

      <div class="mt-8 space-y-4">
        <UCheckbox v-model="filter.verifiedOnly" label="Verified listings only" name="verified" />
        <UCheckbox v-model="filter.furnished" label="Furnished properties" name="furnished" />
        <UCheckbox v-model="filter.availableNow" label="Available now" name="available" />
      </div>

      <div class="mt-8 flex gap-3 sticky bottom-0 backdrop-blur-2xl">
        <UButton label="Reset All" icon="i-lucide-refresh-ccw" variant="ghost" @click="resetFilter" class="flex-1" />
        <UButton label="Apply Filters" icon="i-lucide-check" color="primary" @click="applyFilters" class="flex-1" />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { FilterStateridium } from '~/types/listings'

interface PropertyType {
  label: string
  value: number
  icon: string
  count: number
  description?: string
}

interface Country {
  code: string
  name: string
  flag: string
  continent: string
}

interface Institution {
  name: string
  code: string
  dist: string
  type: string
  icon?: string
}

const route = useRoute()
const router = useRouter()
const toast = useToast()

const countries: Country[] = [
  { code: 'KE', name: 'Kenya', flag: 'i-circle-flag', continent: 'Africa' },
  { code: 'UG', name: 'Uganda', flag: 'i-circle-flag', continent: 'Africa' },
  { code: 'TZ', name: 'Tanzania', flag: 'i-circle-flag', continent: 'Africa' },
  { code: 'RW', name: 'Rwanda', flag: 'i-circle-flag', continent: 'Africa' },
  { code: 'ET', name: 'Ethiopia', flag: 'i-circle-flag', continent: 'Africa' },
  { code: 'ZA', name: 'South Africa', flag: 'i-circle-flag', continent: 'Africa' },
  { code: 'NG', name: 'Nigeria', flag: 'i-circle-flag', continent: 'Africa' },
  { code: 'GH', name: 'Ghana', flag: 'i-circle-flag', continent: 'Africa' },
  { code: 'EG', name: 'Egypt', flag: 'i-circle-flag', continent: 'Africa' },
]

const propertyTypes = ref<PropertyType[]>([])
const counties = ref<any[]>([])
const institutions = ref<Institution[]>([
  { name: 'MUT', code: '34523g234t', dist: '2.4km', type: 'University' },
  { name: 'TUK', code: '345et23g234t', dist: '2.4km', type: 'University' },
  { name: 'Magnus Super Market', code: 'market_001', dist: '2.4km', type: 'Shopping' },
  { name: 'ACK Njoguini Parish', code: 'church_001', dist: '2.4km', type: 'Church' },
  { name: 'Nairobi School', code: 'school_001', dist: '2.4km', type: 'School' },
])

const initialFilterState: FilterState = {
  targetInstitution: 'MUT',
  distanceFromTargetInstitution: {
    val: 2,
    unit: 'Km',
    maxRange: 6,
    step: 0.2,
  },
  min: 5000,
  max: 15000,
  maxRange: 25000,
  selected_institutions: [],
  selectedPropertyTypes: [],
  country: 'KE',
  city: [],
  verifiedOnly: false,
  furnished: false,
  availableNow: false,
}

const emit = defineEmits<{
  reset: []
  apply: [filters: Partial<FilterState>]
}>()

const filter = ref<FilterState>({ ...initialFilterState })
const showFilter = ref<boolean>(true)
const propertyTypeSearch = ref<string>('')
const filteredPropertyTypes = ref<PropertyType[]>([])

const priceRange = computed({
  get: () => [filter.value.min, filter.value.max],
  set: (val: [number, number]) => {
    filter.value.min = val[0]
    filter.value.max = val[1]
  },
})

const selectedCountry = computed(() =>
  countries.find(c => c.code === filter.value.country)
)

const activeFiltersCount = computed(() => {
  let count = 0
  if (filter.value.min !== initialFilterState.min || filter.value.max !== initialFilterState.max) count++
  if (filter.value.distanceFromTargetInstitution.val !== initialFilterState.distanceFromTargetInstitution.val) count++
  if (filter.value.selectedPropertyTypes.length > 0) count++
  if (filter.value.selected_institutions.length > 0) count++
  if (filter.value.country !== initialFilterState.country) count++
  if (filter.value.city.length > 0) count++
  if (filter.value.verifiedOnly) count++
  if (filter.value.furnished) count++
  if (filter.value.availableNow) count++
  return count
})

const searchPropertyTypes = () => {
  const term = propertyTypeSearch.value.trim().toLowerCase()
  filteredPropertyTypes.value = term
    ? propertyTypes.value.filter(item =>
      item.label?.toLowerCase().includes(term) ||
      item.description?.toLowerCase().includes(term)
    )
    : [...propertyTypes.value]
}

watch(propertyTypeSearch, searchPropertyTypes, { immediate: true })

watch(() => filter.value.country, async (newCountry) => {
  if (newCountry) {
    const res =  await load_counties_by_country(newCountry)
    if (!res?.success) {
      toast.add({
        color: 'error',
        title: res?.message || 'Failed to load property categories',
      })
      return
    }
    counties.value = res.data
  }
}, { immediate: true })

const loadPropertyTypes = async () => {
  const res = await load_property_categories()

  if (!res?.success) {
    toast.add({
      color: 'error',
      title: res?.message || 'Failed to load property categories',
    })
    return
  }

  propertyTypes.value = res.data ?? []
  filteredPropertyTypes.value = [...propertyTypes.value]
}

onMounted(async () => {
  await loadPropertyTypes()
})

const toggleFilter = () => {
  showFilter.value = !showFilter.value
}

watch(showFilter, (val) => {
  if (val) {
    router.replace({
      query: {
        ...route.query,
        fltr: 'open',
      },
    })
  } else {
    const { fltr, ...rest } = route.query
    router.replace({ query: rest })
  }
})

const getInstitutionName = (code: string): string => {
  const institution = institutions.value.find(t => t.code === code)
  return institution ? institution.name : code
}

const removeInstitution = (code: string) => {
  const index = filter.value.selected_institutions.indexOf(code)
  if (index > -1) {
    filter.value.selected_institutions.splice(index, 1)
  }
}

const getPropertyTypeLabel = (value: number): string => {
  const type = propertyTypes.value.find(t => t.value === value)
  return type ? type.label : value.toString()
}

const togglePropertyType = (typeValue: number) => {
  const index = filter.value.selectedPropertyTypes.indexOf(typeValue)
  if (index > -1) {
    filter.value.selectedPropertyTypes.splice(index, 1)
  } else {
    filter.value.selectedPropertyTypes.push(typeValue)
  }
}

const removePropertyType = (typeValue: number) => {
  const index = filter.value.selectedPropertyTypes.indexOf(typeValue)
  if (index > -1) {
    filter.value.selectedPropertyTypes.splice(index, 1)
  }
}

const selectAllPropertyTypes = () => {
  filter.value.selectedPropertyTypes = filteredPropertyTypes.value.map(type => type.value)
}

const clearAllPropertyTypes = () => {
  filter.value.selectedPropertyTypes = []
}

const resetFilter = () => {
  filter.value = { ...initialFilterState }
  propertyTypeSearch.value = ''
  emit('reset')
}

const applyFilters = () => {
  emit('apply', filter.value)
}
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-10px);
  opacity: 0;
}
</style>