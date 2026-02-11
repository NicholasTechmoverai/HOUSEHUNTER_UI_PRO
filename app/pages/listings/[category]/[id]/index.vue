<script setup lang="ts">
const { get } = useApi()
const endpoints = useEndpoints()
const route = useRoute()
const openFullGallery = ref(false)
const activeImageIndex = ref(0)
const rentalId = route.params.id as string
const category = route.params.category as string

const ID_PREFIXES = ['RNT', 'PRT', 'SWP']
const isIdBased = computed(() => ID_PREFIXES.some(prefix => rentalId.startsWith(`${prefix}-`)))

const { data: rental, pending } = await useAsyncData(
  `rental-${rentalId}`,
  () => get(isIdBased.value ? endpoints.rental.getById(rentalId) : endpoints.rental.getBySlug(rentalId)),
  { watch: [() => route.params.id] }
)

const property = computed(() => rental.value?.data ?? {})
const allImages = computed(() => [
  property.value.profile_picture,
  ...(property.value.gallery?.map((img: any) => img.url) ?? [])
].filter(Boolean))

const formatCurrency = (value: number | null, currency = 'KES') =>
  value ? new Intl.NumberFormat('en-KE', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value) : '—'

const formatDate = (date: string) =>
  date ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'

watchEffect(() => {
  const title = property.value?.title ?? rentalId
  const description = property.value?.description?.slice(0, 120) ?? `Browse ${category} rentals`
  useSeoMeta({ title, description, image: property.value?.profile_picture, ogType: 'website' })
})
</script>
<template>
  <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <NavigationBreadCrumb class="mb-6" />

    <div v-if="pending" class="flex flex-col items-center justify-center py-32">
      <div class="relative">
        <div class="w-20 h-20 border-4 border-primary-100 dark:border-primary-900/30 rounded-full animate-spin border-t-primary-600"></div>
        <UIcon name="i-lucide-home" class="w-8 h-8 text-primary-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      </div>
      <p class="text-gray-500 dark:text-gray-400 mt-6">Finding your perfect space...</p>
    </div>

    <div v-else-if="property?.id" class="space-y-12">
      <section class="space-y-4">
        <div class="flex items-start justify-between">
          <div class="space-y-2">
            <h1 class="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
              {{ property?.title }}
            </h1>
            <div class="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <div class="flex items-center gap-1.5">
                <UIcon name="i-lucide-map-pin" class="w-4 h-4" />
                <span>{{ property?.city || 'Location' }}{{ property?.state ? `, ${property.state}` : '' }}</span>
              </div>
              <span class="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
              <span class="capitalize">{{ property?.category?.replace('_', ' ') || 'Property' }}</span>
            </div>
          </div>
          <UBadge 
            :color="property?.is_available ? 'success' : 'error'" 
            variant="soft" 
            size="lg"
            class="px-4 py-1.5"
          >
            {{ property?.is_available ? '● Available' : '○ Occupied' }}
          </UBadge>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div 
            @click="openFullGallery = true; activeImageIndex = 0"
            class="lg:col-span-7 relative aspect-[4/3] lg:aspect-auto lg:h-[450px] rounded-l-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer group"
          >
            <img 
              :src="property.profile_picture || allImages?.[0]" 
              :alt="property?.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div class="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full">
              <UIcon name="i-lucide-maximize-2" class="w-4 h-4" />
              <span class="text-sm font-medium">View gallery</span>
            </div>
          </div>

          <div class="lg:col-span-5 grid grid-cols-2 gap-1 h-[450px] rounded-r-2xl overflow-hidden">
            <div 
              v-for="(img, index) in allImages?.slice(1, 6) ?? []" 
              :key="img"
              @click="openFullGallery = true; activeImageIndex = index + 1"
              class="relative overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer group"
              :class="index === 0 ? 'col-span-2 row-span-2' : 'col-span-1'"
            >
              <img :src="img" :alt="`${property?.title} - ${index + 2}`" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div v-if="index === 4 && allImages?.length > 5" class="absolute inset-0 bg-gray-900/80 flex items-center justify-center text-center text-white">
                <span class="text-3xl font-bold">+{{ allImages.length - 6 }}</span>
                <p class="text-sm mt-1">more photos</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-10">
          <div class="flex flex-wrap gap-3">
            <div class="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-sm">
              <UIcon name="i-lucide-ruler" class="w-4 h-4 text-primary-600" />
              <span>{{ property?.size_sqft || '—' }} sqft</span>
            </div>
            <div class="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-sm">
              <UIcon name="i-lucide-bed-double" class="w-4 h-4 text-primary-600" />
              <span>{{ property?.bedrooms || '—' }} beds</span>
            </div>
            <div class="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-sm">
              <UIcon name="i-lucide-bath" class="w-4 h-4 text-primary-600" />
              <span>{{ property?.bathrooms || '—' }} baths</span>
            </div>
            <div class="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-sm">
              <UIcon name="i-lucide-car" class="w-4 h-4 text-primary-600" />
              <span>{{ property?.parking_spots || '—' }} parking</span>
            </div>
          </div>

          <section class="space-y-3">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <UIcon name="i-lucide-file-text" class="w-5 h-5 text-primary-600" />
              Overview
            </h3>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
              {{ property?.description || 'No description provided.' }}
            </p>
            <UButton color="primary" variant="ghost" size="sm" class="!p-0">
              Read more <UIcon name="i-lucide-chevron-right" class="w-4 h-4" />
            </UButton>
          </section>

          <section v-if="property?.amenities?.length" class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <UIcon name="i-lucide-sparkles" class="w-5 h-5 text-primary-600" />
                Amenities
              </h3>
              <span class="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">{{ property?.amenities.length }} included</span>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div v-for="amenity in property?.amenities.slice(0, 6)" :key="amenity?.id" 
                class="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div class="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <UIcon :name="amenity?.icon || 'i-lucide-check'" class="w-3 h-3 text-primary-600 dark:text-primary-400" />
                </div>
                <span class="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{{ amenity?.name }}</span>
              </div>
            </div>
            <UButton v-if="property?.amenities.length > 6" color="neutral" variant="ghost" size="xs">
              +{{ property.amenities.length - 6 }} more amenities
            </UButton>
          </section>

          <section class="flex items-center justify-between p-4 bg-gradient-to-r from-primary-50 to-transparent dark:from-primary-900/10 rounded-xl">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <UIcon name="i-lucide-map" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p class="font-medium text-gray-900 dark:text-white">{{ property?.city || 'Location' }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ property?.address || 'Address available upon request' }}</p>
              </div>
            </div>
            <UButton color="primary" variant="soft" size="sm" icon="i-lucide-navigation">Map</UButton>
          </section>
        </div>

        <div class="lg:col-span-1 space-y-6">
          <div class="sticky top-6">
            <UCard class="border-0 shadow-xl bg-white dark:bg-gray-900 relative overflow-hidden">
              <div class="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full -translate-y-16 translate-x-16 blur-3xl"></div>
              <div class="relative z-10 space-y-6">
                <div>
                  <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">Monthly rent</div>
                  <div class="flex items-baseline gap-2">
                    <span class="text-4xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(property?.pricing?.base_price?.rent) }}</span>
                    <span class="text-gray-500 dark:text-gray-400 text-sm">/{{ property?.pricing?.base_price?.rent_frequency || 'mo' }}</span>
                  </div>
                  <div v-if="property?.pricing?.base_price?.deposit_amount" class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <span class="font-medium">Deposit:</span> {{ formatCurrency(property?.pricing.base_price.deposit_amount) }}
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-3 py-4 border-y border-gray-200 dark:border-gray-800">
                  <div class="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p class="text-xs text-gray-500 dark:text-gray-400">Lease</p>
                    <p class="font-semibold text-gray-900 dark:text-white">{{ property?.pricing?.base_price?.minimum_lease_months || '—' }} months</p>
                  </div>
                  <div class="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p class="text-xs text-gray-500 dark:text-gray-400">Available</p>
                    <p class="font-semibold" :class="property?.is_available ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                      {{ property?.is_available ? 'Now' : 'No' }}
                    </p>
                  </div>
                </div>

                <div class="space-y-2">
                  <UButton block size="lg" color="primary" icon="i-lucide-calendar-check" label="Schedule Tour" />
                  <UButton block size="lg" color="neutral" variant="outline" icon="i-lucide-heart" label="Save" />
                </div>
              </div>
            </UCard>

            <UCard v-if="property?.publisher" class="mt-4 border border-gray-200 dark:border-gray-800">
              <div class="flex items-center gap-3">
                <UAvatar :src="property.publisher.profile_picture" :alt="property.publisher.display_name" size="md" />
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-1">
                    <h4 class="font-semibold text-gray-900 dark:text-white truncate">{{ property.publisher.display_name }}</h4>
                    <UIcon v-if="property?.is_verified" name="i-lucide-shield-check" class="w-3 h-3 text-blue-500" />
                  </div>
                  <div class="flex items-center gap-3 mt-1">
                    <div class="flex items-center gap-1 text-xs">
                      <UIcon name="i-lucide-clock" class="w-3 h-3 text-gray-400" />
                      <span class="text-gray-600 dark:text-gray-400">&lt;5min</span>
                    </div>
                    <div class="flex items-center gap-1 text-xs">
                      <UIcon name="i-lucide-message-circle" class="w-3 h-3 text-gray-400" />
                      <span class="text-gray-600 dark:text-gray-400">95%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <UButton variant="outline" color="neutral" size="sm" icon="i-heroicons-phone" block>Call</UButton>
                <UButton variant="solid" color="primary" size="sm" icon="i-heroicons-chat-bubble-left-right" block>Chat</UButton>
              </div>
            </UCard>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center py-32 text-center">
      <div class="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
        <UIcon name="i-lucide-home" class="w-12 h-12 text-gray-400 dark:text-gray-500" />
      </div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Looking for something else?</h2>
      <p class="text-gray-500 dark:text-gray-400 mb-8 max-w-md">This property is no longer available, but we have many other great options for you.</p>
      <UButton color="primary" to="/listings" size="lg" icon="i-lucide-search">Explore Properties</UButton>
    </div>
  </section>
      <UModal v-model:open="openFullGallery" fullscreen>
            <template #content>

        <div class="h-screen bg-gray-950 flex flex-col">
          <div class="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-6 bg-gradient-to-b from-gray-950/90 to-transparent">
            <div class="flex items-center gap-2 text-white/80">
              <UIcon name="i-lucide-camera" class="w-5 h-5" />
              <span class="text-sm">{{ activeImageIndex + 1 }} / {{ allImages?.length }}</span>
            </div>
            <UButton color="white" variant="ghost" icon="i-lucide-x" size="lg" @click="openFullGallery = false" />
          </div>
          <div class="flex-1 flex items-center justify-center relative">
            <UButton 
              v-if="activeImageIndex > 0"
              color="white" 
              variant="soft" 
              icon="i-lucide-chevron-left" 
              size="xl"
              class="absolute left-6 z-50 bg-white/10 backdrop-blur-md hover:bg-white/20"
              @click="activeImageIndex--"
            />
            <img :src="allImages?.[activeImageIndex]" :alt="`${property?.title} - ${activeImageIndex + 1}`" class="max-w-full max-h-full object-contain" />
            <UButton 
              v-if="activeImageIndex < allImages?.length - 1"
              color="white" 
              variant="soft" 
              icon="i-lucide-chevron-right" 
              size="xl"
              class="absolute right-6 z-50 bg-white/10 backdrop-blur-md hover:bg-white/20"
              @click="activeImageIndex++"
            />
          </div>
          <div class="h-24 border-t border-gray-800 bg-gray-900/95 backdrop-blur-sm">
            <div class="flex items-center gap-2 h-full px-6 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700">
              <button
                v-for="(img, idx) in allImages ?? []"
                :key="idx"
                @click="activeImageIndex = idx"
                class="flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all"
                :class="activeImageIndex === idx ? 'border-primary-500 scale-110' : 'border-transparent opacity-60 hover:opacity-100'"
              >
                <img :src="img" :alt="`Thumbnail ${idx + 1}`" class="w-full h-full object-cover" />
              </button>
            </div>
          </div>
        </div>
        </template>
      </UModal>
</template>
