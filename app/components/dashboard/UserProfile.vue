<script setup lang="ts">
const userStore = useUserStore()
import { useClipboard } from '@vueuse/core'

const user = computed(() => userStore.profile)
const isListingsLoading = ref(false)

const limit = ref(10)
const offset = ref(0)
const userRentalProperties = ref<any[]>([])

// Clipboard for different values
const { copy: copyUsername, copied: usernameCopied } = useClipboard()
const { copy: copyPublicId, copied: publicIdCopied } = useClipboard()
const { copy: copyEmail, copied: emailCopied } = useClipboard()
const { copy: copyPhone, copied: phoneCopied } = useClipboard()

onMounted(async () => {
  await userStore.fetchProfile()
  fetchListings()
})

const fetchListings = async () => {
  isListingsLoading.value = true
  try {
    const res = await userStore.fetchListings()
    userRentalProperties.value.push(...res.data.rentals)
  } catch (error) {
    console.error('Failed to fetch listings:', error)
    userRentalProperties.value = []
  } finally {
    isListingsLoading.value = false
  }
}

const joinedDate = computed(() =>
  user.value?.created_at
    ? new Date(user.value.created_at).toLocaleDateString()
    : '—'
)

// Helper function to check if field has value
const hasValue = (value: any) => {
  return value !== undefined && value !== null && value !== '' && value !== '—'
}
</script>

<template>
  <div class="min-h-screen py-2">
    <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
      <!-- Profile Header Card -->
      <UCard class="mb-6 shadow-lg">
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <!-- Avatar Section -->
          <div class="relative">
              <UChip v-if="user?.status === 'ACTIVE' "  :color="user.status === 'ACTIVE' ? 'success' : 'neutral'" :variant="user.status === 'ACTIVE' ? 'solid' : 'ghost'" position="bottom-left">

            <UAvatar :src="user?.profile_picture" :alt="user?.display_name || 'User'" size="3xl"
              class="ring-4 ring-white dark:ring-gray-900 shadow-lg" />
              </UChip>
        
          </div>

          <!-- User Info -->
          <div class="flex-1">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {{ user?.display_name || '—' }}
                </h1>
                <p class="text-gray-600 dark:text-gray-300 mt-1 flex items-center gap-2">
                  <UIcon name="i-heroicons-briefcase" class="w-4 h-4" />
                  {{ user?.occupation || 'No occupation specified' }}
                </p>
                <p class="text-gray-500 dark:text-gray-400 text-sm mt-2 flex items-center gap-2">
                  <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
                  Member since {{ joinedDate }}
                </p>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-2">
                <UButton v-if="user?.email?.email" icon="i-heroicons-envelope" color="neutral" variant="soft"
                  :label="user.email.email" @click="copyEmail(user?.email?.email || '')" />
                <UButton icon="i-heroicons-pencil-square" label="Edit Profile" variant="solid" color="primary" />
              </div>
            </div>

            <!-- Tags / Identifiers -->
            <div class="mt-4 flex flex-wrap gap-2 ">
              <UBadge v-if="user?.public_id" :label="`Public ID: ${user.public_id}`" :color="usernameCopied?'success':'primary'" variant="subtle"
                size="sm" :trailing-icon="usernameCopied ? 'i-heroicons-check' : 'i-heroicons-clipboard'"
                @click="copyUsername(user.username)" class="hover:bg-transparent cursor-pointer" />
              <UBadge v-if="user?.username" :label="`@${user.username}`" :color="publicIdCopied?'success':'primary'" variant="subtle" size="sm"
                :trailing-icon="publicIdCopied ? 'i-heroicons-check' : 'i-heroicons-clipboard'"
                @click="copyPublicId(user.public_id)" class="hover:bg-transparent cursor-pointer" />
            </div>

         
          </div>
        </div>
      </UCard>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column - Personal Information -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Contact Information Card -->
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <UIcon name="i-heroicons-phone" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  Contact Information
                </h3>
                <UBadge v-if="user?.email?.email_verified || user?.phone_number?.phone_verified"
                  :label="'Verified Account'" color="success" variant="subtle" size="sm" />
              </div>
            </template>

            <div class="space-y-4">
              <!-- Email -->
              <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div class="flex items-center gap-3">
                  <UIcon name="i-heroicons-envelope" class="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-gray-100">Email Address</p>
                    <p class="text-sm text-gray-600 dark:text-gray-300">{{ user?.email?.email || '—' }}</p>
                  </div>
                </div>
                <UBadge v-if="user?.email?.email_verified" :label="'Verified'" color="success" variant="subtle"
                  size="sm" />
              </div>

              <!-- Phone -->
              <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div class="flex items-center gap-3">
                  <UIcon name="i-heroicons-phone" class="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-gray-100">Phone Number</p>
                    <p class="text-sm text-gray-600 dark:text-gray-300">
                      {{ user?.phone_number?.country_code || '' }}
                      {{ user?.phone_number?.number || '—' }}
                    </p>
                  </div>
                </div>
                <UBadge v-if="user?.phone_number?.phone_verified" :label="'Verified'" color="success" variant="subtle"
                  size="sm" />
              </div>

              <!-- Website -->
              <div v-if="hasValue(user?.website)" class="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <UIcon name="i-heroicons-globe-alt" class="w-5 h-5 text-gray-400 dark:text-gray-500" />
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900 dark:text-gray-100">Website</p>
                  <a :href="user.website" target="_blank"
                    class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 hover:underline">
                    {{ user.website }}
                  </a>
                </div>
              </div>
            </div>
          </UCard>

          <!-- Profile Details Card -->
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <UIcon name="i-heroicons-user-circle" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
                Profile Details
              </h3>
            </template>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UCard v-if="hasValue(user?.bio)"
                class="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Bio</p>
                <p class="text-sm text-gray-600 dark:text-gray-300">{{ user.bio }}</p>
              </UCard>

              <UCard v-if="hasValue(user?.tagline)"
                class="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Tagline</p>
                <p class="text-sm text-gray-600 dark:text-gray-300 italic">"{{ user.tagline }}"</p>
              </UCard>

              <div v-for="(item, index) in [
                { label: 'Industry', value: user?.industry },
                { label: 'Company', value: user?.company },
                { label: 'Job Title', value: user?.job_title },
                { label: 'Date of Birth', value: user?.date_of_birth },
                { label: 'Gender', value: user?.gender },
                { label: 'Locale', value: user?.locale },
                { label: 'Currency', value: user?.currency },
              ].filter(item => hasValue(item.value))" :key="index"
                class="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ item.label }}</span>
                <span class="text-sm text-gray-900 dark:text-gray-100 font-medium">{{ item.value }}</span>
              </div>
            </div>
          </UCard>

          <!-- Location Card -->
          <UCard v-if="hasValue(user?.location)">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <UIcon name="i-heroicons-map-pin" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
                Location
              </h3>
            </template>

            <div class="space-y-4">
              <!-- Address -->
              <div v-if="hasValue(user.location.address)" class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Address</p>
                <p class="text-sm text-gray-600 dark:text-gray-300">{{ user.location.address }}</p>
              </div>

              <!-- Location Details -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div v-for="(item, index) in [
                  { label: 'City', value: user.location.city },
                  { label: 'County', value: user.location.county },
                  { label: 'Country', value: user.location.country },
                ].filter(item => hasValue(item.value))" :key="index"
                  class="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">{{ item.label }}</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ item.value }}</p>
                </div>
              </div>

              <!-- Coordinates -->
              <div v-if="user.location.coordinates"
                class="flex items-center justify-between p-3 bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 rounded-lg">
                <div class="flex items-center gap-3">
                  <UIcon name="i-heroicons-map" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-gray-100">Coordinates</p>
                    <p class="text-xs text-gray-600 dark:text-gray-400">
                      Lat: {{ user.location.coordinates.lat }},
                      Long: {{ user.location.coordinates.long }}
                    </p>
                  </div>
                </div>
                <UButton icon="i-heroicons-arrow-top-right-on-square" color="primary" variant="soft" size="sm"
                  label="View on Map" />
              </div>
            </div>
          </UCard>
        </div>

        <!-- Right Column - Sidebar Info -->
        <div class="space-y-6">
          <!-- Account Status Card -->
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <UIcon name="i-heroicons-shield-check" class="w-5 h-5 text-success-600 dark:text-success-400" />
                Account Status
              </h3>
            </template>

            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Current Account</span>
                <UBadge :label="user?.account?.currentAccount || '—'"
                  :color="user?.account?.currentAccount === 'premium' ? 'primary' : 'neutral'" variant="soft" />
              </div>

              <div class="space-y-2">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Available Accounts</p>
                <div class="flex flex-wrap gap-2">
                  <UBadge v-for="account in user?.account?.availableAccounts || []" :key="account" :label="account"
                    color="neutral" variant="outline" size="sm" />
                </div>
              </div>

              <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Last Active</span>
                  <span class="text-sm text-gray-900 dark:text-gray-100 font-medium">
                    {{ user?.last_active || '—' }}
                  </span>
                </div>
              </div>
            </div>
          </UCard>

          <!-- Quick Stats Card -->
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <UIcon name="i-heroicons-chart-bar" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
                Quick Stats
              </h3>
            </template>

            <div class="grid grid-cols-2 gap-4">
              <div class="text-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <p class="text-2xl font-bold text-primary-700 dark:text-primary-400">
                  {{ userRentalProperties.length }}
                </p>
                <p class="text-xs text-primary-600 dark:text-primary-300 mt-1">Listings</p>
              </div>
              <div class="text-center p-4 bg-success-50 dark:bg-success-900/20 rounded-lg">
                <p class="text-2xl font-bold text-success-700 dark:text-success-400">
                  {{ user?.status === 'active' ? 'Active' : '—' }}
                </p>
                <p class="text-xs text-success-600 dark:text-success-300 mt-1">Status</p>
              </div>
            </div>
          </UCard>

          <!-- Action Card -->
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Actions</h3>
            </template>

            <div class="space-y-3">
              <UButton block icon="i-heroicons-eye" variant="soft" color="primary" label="View Public Profile" />
              <UButton block icon="i-heroicons-chat-bubble-left-right" variant="soft" color="primary"
                label="Send Message" />
              <UButton block icon="i-heroicons-flag" variant="soft" color="error" label="Report User" />
            </div>
          </UCard>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isListingsLoading" class="mt-8 text-center">
        <div class="flex justify-center">
          <UProgress animation="carousel" />
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">Loading user data...</p>
      </div>
    </div>
  </div>
</template>