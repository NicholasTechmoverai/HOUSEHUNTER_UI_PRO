<template>
        <Transition name="slide-fade">
         <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">Filters</h2>
              <UButton color="gray" variant="ghost" size="sm" icon="i-lucide-x" @click="toggleFilter" class="lg:hidden" />
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
                  <UInputNumber v-model="filter.min" :min="0" :max="filter.max" 
                    class="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" 
                    placeholder="Min" />
                  <span class="text-gray-400 dark:text-gray-500 text-sm">to</span>
                  <UInputNumber v-model="filter.max" :min="filter.min" :max="filter.maxRange"
                    class="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" 
                    placeholder="Max" />
                </div>
                <div class="px-1">
                  <USlider v-model="filter.max" :min="0" :max="filter.maxRange" class="w-full" />
                </div>
              </div>

              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Distance from
                    <UBadge color="neutral" variant="outline" class="ml-2 dark:border-gray-600 dark:text-gray-300">
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
                    :max="filter.distanceFromTargetInstitution.maxRange" 
                    :step="filter.distanceFromTargetInstitution.step"
                    class="w-full" />
                </div>
              </div>
            </div>

            <USeparator class="my-6 dark:bg-gray-700" />

            <div class="mb-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200">Property Type</h3>
                <div class="flex items-center gap-2">
                  <UButton v-if="filter.selectedPropertyTypes.length > 0" color="gray" variant="ghost" size="xs"
                    @click="clearAllPropertyTypes" class="dark:text-gray-400 dark:hover:text-gray-300">
                    Clear
                  </UButton>
                  <UButton color="gray" variant="ghost" size="xs" @click="selectAllPropertyTypes"
                    class="dark:text-gray-400 dark:hover:text-gray-300">
                    Select all
                  </UButton>
                </div>
              </div>

              <div class="space-y-4">
                <UInput v-model="propertyTypeSearch" placeholder="Search property types..." icon="i-lucide-search"
                  class="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" 
                  @input="searchPropertyTypes" />

                <div v-if="filter.selectedPropertyTypes.length > 0"
                  class="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <UBadge v-for="selectedType in filter.selectedPropertyTypes" :key="selectedType" color="primary"
                    variant="subtle" class="dark:bg-primary-900/30 dark:text-primary-300">
                    {{ getPropertyTypeLabel(selectedType) }}
                    <button @click="removePropertyType(selectedType)" class="ml-1.5 hover:opacity-80 transition-opacity">
                      <UIcon name="i-lucide-x" class="w-3 h-3" />
                    </button>
                  </UBadge>
                </div>

                <div class="relative">
                  <div ref="scrollContainer" class="max-h-60 overflow-y-auto pr-2 custom-scrollbar"
                    @scroll="handleScroll">
                    <div :style="{ height: `${totalHeight}px` }" class="relative">
                      <div v-for="propertyType in visiblePropertyTypes" :key="propertyType.value"
                        :style="{ position: 'absolute', top: `${propertyType.top}px`, width: '100%' }">
                        <div :class="[
                          'flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all duration-200 mb-2',
                          filter.selectedPropertyTypes.includes(propertyType.value)
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-700'
                            : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        ]" @click="togglePropertyType(propertyType.value)">
                          <div class="flex items-center gap-3">
                            <UIcon :name="propertyType.icon" class="w-4 h-4 flex-shrink-0" 
                              :class="filter.selectedPropertyTypes.includes(propertyType.value)
                                ? 'text-primary-600 dark:text-primary-400'
                                : 'text-gray-500 dark:text-gray-400'" />
                            <span :class="[
                              'text-sm truncate',
                              filter.selectedPropertyTypes.includes(propertyType.value)
                                ? 'text-primary-700 dark:text-primary-300 font-medium'
                                : 'text-gray-700 dark:text-gray-300'
                            ]">
                              {{ propertyType.label }}
                            </span>
                          </div>
                          <div class="flex items-center gap-2">
                            <span v-if="propertyType.count"
                              class="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                              {{ propertyType.count }}
                            </span>
                            <UIcon v-if="filter.selectedPropertyTypes.includes(propertyType.value)" 
                              name="i-lucide-check" class="w-4 h-4 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="mt-2 text-sm text-gray-500 dark:text-gray-400 flex justify-between">
                    <span>
                      {{ filter.selectedPropertyTypes.length }} of {{ filteredPropertyTypes.length }} selected
                    </span>
                    <span v-if="propertyTypeSearch" class="text-primary-600 dark:text-primary-400">
                      {{ filteredPropertyTypes.length }} matches
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <USeparator class="my-6 dark:bg-gray-700" />

            <div>
              <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">{{ search_places.placeHold }}</h3>
              <div class="space-y-4">
                <USelectMenu v-model="filter.selected_institutions" value-key="code" label-key="name" multiple
                  :items="search_places.suggestions" placeholder="Select institutions..." 
                  class="w-full" 
                  :ui="{
                    wrapper: 'dark:bg-gray-700 dark:border-gray-600',
                    option: {
                      base: 'dark:hover:bg-gray-600',
                      active: 'dark:bg-gray-600',
                      inactive: 'dark:text-gray-300'
                    },
                    placeholder: 'dark:text-gray-400',
                    icon: {
                      base: 'dark:text-gray-400'
                    }
                  }" />

                <div v-if="filter.selected_institutions.length > 0" class="flex flex-wrap gap-2">
                  <UBadge v-for="selectedCode in filter.selected_institutions" :key="selectedCode" color="neutral"
                    variant="outline" class="dark:border-gray-600 dark:text-gray-300">
                    {{ getInstitutionName(selectedCode) }}
                    <button @click="removeInstitution(selectedCode)" class="ml-1.5 hover:opacity-80">
                      <UIcon name="i-lucide-x" class="w-3 h-3" />
                    </button>
                  </UBadge>
                </div>
              </div>
            </div>

            <USeparator class="my-6 dark:bg-gray-700" />

            <div class="flex justify-between">
              <UButton label="Reset All" icon="i-lucide-refresh-ccw" variant="ghost" @click="resetFilter" 
                class="dark:text-gray-400" />
              <UButton label="Apply Filters" icon="i-lucide-check" color="primary" @click="applyFilters" />
            </div>
          </div>
      </Transition>
</template>
<script lang="ts" setup>
interface FilterState {
  targetInstitution: string;
  distanceFromTargetInstitution: {
    val: number;
    unit: string;
    maxRange: number;
    step: number;
  };
  min: number;
  max: number;
  maxRange: number;
  selected_institutions: string[];
  selectedPropertyTypes: string[];
}

interface PropertyType {
  label: string;
  value: string;
  icon: string;
  count: number;
}

const route = useRoute();
const router = useRouter();

const propertyTypes = ref<PropertyType[]>([
  { label: 'Studio Apartment', value: 'studio', icon: 'i-lucide-home', count: 234 },
  { label: 'Bedsitter', value: 'bedsitter', icon: 'i-lucide-bed', count: 567 },
  { label: 'One Bedroom', value: 'onebedroom', icon: 'i-lucide-bed-double', count: 432 },
  { label: 'Two Bedroom', value: 'twobedroom', icon: 'i-lucide-bed-double', count: 321 },
  { label: 'Three Bedroom', value: 'threebedroom', icon: 'i-lucide-bed-double', count: 198 },
  { label: 'Student Hostels', value: 'hostels', icon: 'i-lucide-building', count: 654 },
  { label: 'Apartments', value: 'apartments', icon: 'i-lucide-building-2', count: 345 },
  { label: 'Shared Houses', value: 'shared', icon: 'i-lucide-users', count: 123 },
  { label: 'Airbnb', value: 'airbnb', icon: 'i-lucide-globe', count: 89 },
  { label: 'Boarding House', value: 'boarding', icon: 'i-lucide-house', count: 276 },
  { label: 'Cottage', value: 'cottage', icon: 'i-lucide-tree-pine', count: 45 },
  { label: 'Mansionette', value: 'mansionette', icon: 'i-lucide-castle', count: 23 },
  { label: 'Townhouse', value: 'townhouse', icon: 'i-lucide-building-2', count: 67 },
  { label: 'Penthouse', value: 'penthouse', icon: 'i-lucide-building-2', count: 12 },
  { label: 'Serviced Apartment', value: 'serviced', icon: 'i-lucide-concierge-bell', count: 54 },
  { label: 'Furnished Unit', value: 'furnished', icon: 'i-lucide-sofa', count: 321 },
  { label: 'Unfurnished Unit', value: 'unfurnished', icon: 'i-lucide-box', count: 234 },
  { label: 'Single Room', value: 'singleroom', icon: 'i-lucide-door-closed', count: 456 },
  { label: 'Double Room', value: 'doubleroom', icon: 'i-lucide-door-open', count: 234 },
  { label: 'Ensuite', value: 'ensuite', icon: 'i-lucide-bath', count: 345 },
  { label: 'Self-Contained', value: 'selfcontained', icon: 'i-lucide-home', count: 567 },
  { label: 'Bachelor Pad', value: 'bachelor', icon: 'i-lucide-user', count: 89 },
  { label: 'Student Dorm', value: 'dorm', icon: 'i-lucide-school', count: 678 },
  { label: 'Campus Housing', value: 'campus', icon: 'i-lucide-graduation-cap', count: 123 },
  { label: 'Off-Campus', value: 'offcampus', icon: 'i-lucide-map-pin', count: 456 },
  { label: 'Shared Apartment', value: 'sharedapt', icon: 'i-lucide-users', count: 234 },
  { label: 'Private Hostel', value: 'privatehostel', icon: 'i-lucide-shield', count: 189 },
  { label: 'University Housing', value: 'university', icon: 'i-lucide-university', count: 76 },
  { label: 'Gated Community', value: 'gated', icon: 'i-lucide-shield-check', count: 45 },
  { label: 'Standalone House', value: 'standalone', icon: 'i-lucide-house', count: 67 },
  { label: 'Bungalow', value: 'bungalow', icon: 'i-lucide-home', count: 34 },
  { label: 'Villa', value: 'villa', icon: 'i-lucide-home', count: 23 },
  { label: 'Duplex', value: 'duplex', icon: 'i-lucide-layers', count: 45 },
  { label: 'Triplex', value: 'triplex', icon: 'i-lucide-layers', count: 12 },
  { label: 'Condominium', value: 'condo', icon: 'i-lucide-building', count: 89 },
  { label: 'Co-living Space', value: 'coliving', icon: 'i-lucide-users', count: 56 },
  { label: 'Micro-apartment', value: 'micro', icon: 'i-lucide-minimize', count: 78 },
  { label: 'Loft', value: 'loft', icon: 'i-lucide-arrow-up-right', count: 34 },
  { label: 'Basement Suite', value: 'basement', icon: 'i-lucide-arrow-down-right', count: 23 },
  { label: 'Garden Cottage', value: 'gardencottage', icon: 'i-lucide-flower', count: 45 }
]);

const search_places = ref({
  placeHold: "Nearby Institutions & Landmarks",
  suggestions: [
    { name: "MUT", dist: "2.4km", code: "34523g234t" },
    { name: "TUK", dist: "2.4km", code: "345et23g234t" },
    { name: "Magnus Super Market", dist: "2.4km", code: "market_001" },
    { name: "ACK Njoguini Parish", dist: "2.4km", code: "church_001" },
    { name: "Nairobi School", dist: "2.4km", code: "school_001" },
  ]
});

const initialFilterState: FilterState = {
  targetInstitution: 'MUT',
  distanceFromTargetInstitution: {
    val: 2,
    unit: 'Km',
    maxRange: 6,
    step: 0.2
  },
  min: 5000,
  max: 15000,
  maxRange: 25000,
  selected_institutions: [],
  selectedPropertyTypes: ['bedsitter', 'onebedroom']
};

const filter = ref<FilterState>({ ...initialFilterState });
const activeFilters = ref<Partial<FilterState>>({});

const showFilter = ref<boolean>(true);
const propertyTypeSearch = ref<string>('');
const filteredPropertyTypes = ref<PropertyType[]>([...propertyTypes.value]);

const searchPropertyTypes = () => {
  if (!propertyTypeSearch.value.trim()) {
    filteredPropertyTypes.value = [...propertyTypes.value];
  } else {
    const searchTerm = propertyTypeSearch.value.toLowerCase();
    filteredPropertyTypes.value = propertyTypes.value.filter(type =>
      type.label.toLowerCase().includes(searchTerm) ||
      type.value.toLowerCase().includes(searchTerm)
    );
  }
  updateVisibleTypes();
};

const toggleFilter = () => {
  showFilter.value = !showFilter.value;
};

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

const scrollContainer = ref<HTMLElement>();
const itemHeight = 58;
const buffer = 5;
const visiblePropertyTypes = ref<PropertyType[]>([]);
const totalHeight = computed(() => filteredPropertyTypes.value.length * itemHeight);

const updateVisibleTypes = () => {
  if (!scrollContainer.value) return;

  const scrollTop = scrollContainer.value.scrollTop;
  const containerHeight = scrollContainer.value.clientHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
  const endIndex = Math.min(
    filteredPropertyTypes.value.length,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + buffer
  );

  visiblePropertyTypes.value = filteredPropertyTypes.value
    .slice(startIndex, endIndex)
    .map((type, index) => ({
      ...type,
      top: (startIndex + index) * itemHeight
    }));
};

const handleScroll = () => {
  updateVisibleTypes();
};

onMounted(() => {
  updateVisibleTypes();
});

const getInstitutionName = (code: string): string => {
  const institution = search_places.value.suggestions.find(t => t.code === code);
  return institution ? institution.name : code;
};

const removeInstitution = (code: string) => {
  const index = filter.value.selected_institutions.indexOf(code);
  if (index > -1) {
    filter.value.selected_institutions.splice(index, 1);
  }
};

const getPropertyTypeLabel = (value: string): string => {
  const type = propertyTypes.value.find(t => t.value === value);
  return type ? type.label : value;
};

const togglePropertyType = (typeValue: string) => {
  const index = filter.value.selectedPropertyTypes.indexOf(typeValue);
  if (index > -1) {
    filter.value.selectedPropertyTypes.splice(index, 1);
  } else {
    filter.value.selectedPropertyTypes.push(typeValue);
  }
};

const removePropertyType = (typeValue: string) => {
  const index = filter.value.selectedPropertyTypes.indexOf(typeValue);
  if (index > -1) {
    filter.value.selectedPropertyTypes.splice(index, 1);
  }
};

const selectAllPropertyTypes = () => {
  filter.value.selectedPropertyTypes = filteredPropertyTypes.value.map(type => type.value);
};

const clearAllPropertyTypes = () => {
  filter.value.selectedPropertyTypes = [];
};

const resetFilter = () => {
  filter.value = { ...initialFilterState };
  propertyTypeSearch.value = '';
  searchPropertyTypes();
};

const applyFilters = () => {
  activeFilters.value = {
    minPrice: filter.value.min,
    maxPrice: filter.value.max,
    maxDistance: filter.value.distanceFromTargetInstitution.val,
    institution: filter.value.targetInstitution,
    propertyTypes: filter.value.selectedPropertyTypes,
    institutions: filter.value.selected_institutions
  };
};

watch(() => filter.value, () => {
  applyFilters();
}, { deep: true, immediate: true });
</script>