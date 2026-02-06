<template>
  <section class="p-6 max-w-[1400px] mx-auto">
    <NavigationBreadCrumb />

    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
      <div>
        <h1 class="font-bold text-4xl text-gray-900 dark:text-gray-100">Student Housing</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">Find your perfect accommodation near campus</p>
      </div>

      <div class="flex items-center gap-3 mt-4 lg:mt-0">
        <UButton @click="toggleFilter" icon="i-lucide-filter" size="md" :label="showFilter ? 'Hide Filters' : 'Show Filters'" 
          :variant="showFilter ? 'solid' : 'outline'" 
          :color="showFilter ? 'primary' : 'neutral'"
          class="dark:border-gray-600 dark:text-gray-300" />
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

    <div class="flex flex-col lg:flex-row gap-6">
      <Transition name="slide-fade">
        <div v-if="showFilter" class="lg:w-1/4">
        <FilterCard />
        </div>
      </Transition>

      <div :class="['transition-all duration-300', showFilter ? 'lg:w-3/4' : 'w-full']">
        <ListProperties :filters="activeFilters" />
      </div>
    </div>
  </section>
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

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #d1d5db transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}


</style>