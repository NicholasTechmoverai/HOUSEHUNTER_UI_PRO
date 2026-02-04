<template>
  <section class="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <div class="inline-flex items-center gap-2 mb-4 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full">
          <UIcon name="i-lucide-rocket" class="w-4 h-4 text-primary-600" />
          <span class="text-sm font-medium text-primary-600">Simple Process</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h1>
        <p class="text-lg text-gray-600 dark:text-gray-300">Find your perfect home in three simple steps</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        <div v-for="(step, i) in steps" :key="i"
            class="text-center p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div class="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <UIcon :name="step.icon" class="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <div class="inline-block text-sm text-white bg-primary-600 px-4 py-1.5 rounded-full font-medium mb-4">
            Step {{ i + 1 }}
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">{{ step.title }}</h3>
          <p class="text-gray-600 dark:text-gray-400">{{ step.desc }}</p>
        </div>
      </div>

      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 mb-4 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-full">
          <UIcon name="i-lucide-heart" class="w-4 h-4 text-green-600" />
          <span class="text-sm font-medium text-green-600">Trusted by Students</span>
        </div>
        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Student Stories</h2>
        <p class="text-lg text-gray-600 dark:text-gray-300">Join thousands of students who found their perfect home</p>
      </div>

      <div class="relative">
        <div v-if="allLoading" class="py-12 text-center">
          <div class="inline-block relative">
            <div class="w-12 h-12 rounded-full border-4 border-green-200 border-t-green-600 animate-spin"></div>
            <UIcon name="i-lucide-message-square" class="w-6 h-6 text-green-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p class="mt-4 text-gray-600 dark:text-gray-400">Loading reviews...</p>
        </div>

        <div v-else-if="allError" class="py-12 text-center">
          <div class="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <UIcon name="i-lucide-alert-circle" class="w-8 h-8 text-red-500" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Unable to load reviews</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">Please check your connection and try again</p>
          <UButton color="green" variant="solid" :loading="refreshing" @click="handleRefresh" class="px-6">
            Try Again
          </UButton>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="(review, index) in displayedReviews" :key="review.id || index"
              class="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow duration-300">
            <div class="flex mb-4">
              <UIcon v-for="n in 5" :key="n" name="i-lucide-star" class="w-5 h-5 mr-1" :class="n <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-700'" />
            </div>
            <p class="text-gray-700 dark:text-gray-300 mb-6 text-base leading-relaxed italic">"{{ review.message }}"</p>
            <div class="flex items-center pt-4 border-t border-gray-100 dark:border-gray-800">
              <img :src="review.user?.profile_picture" :alt="review.user?.name" class="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-gray-800" />
              <div class="ml-4">
                <h4 class="font-semibold text-gray-900 dark:text-white">{{ review.user?.name }}</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ review.user?.location }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!allLoading && !allError && displayedReviews.length === 0" class="py-12 text-center">
          <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <UIcon name="i-lucide-message-square" class="w-8 h-8 text-gray-400" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No reviews yet</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">Be the first to share your experience</p>
          <UButton color="primary" variant="outline" to="/write-review">
            Write a Review
          </UButton>
        </div>
      </div>

      <div class="text-center mt-16 pt-12 border-t border-gray-100 dark:border-gray-800">
        <UButton color="primary" icon="i-lucide-notebook-pen" variant="outline" to="/write-review">
            Write a Review
        </UButton>
        <p class="mt-4 text-gray-500 dark:text-gray-400 text-sm">Let others know what you think about us!</p>
      </div>
    </div>
  </section>

  <section class="bg-gradient-to-br from-blue-700 to-blue-900 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="text-center max-w-3xl mx-auto">
        <h1 class="text-4xl md:text-5xl font-bold mb-6">Ready to Find Your Perfect Home?</h1>
        <p class="text-xl text-blue-100 mb-10">
          Join thousands of Kenyan students who found their ideal housing through HouseHunter
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton to="/properties" color="primary" variant="solid" size="xl" class="px-8">
            <UIcon name="i-lucide-search" class="mr-2" />
            Start Your Search
          </UButton>
          <UButton to="/how-it-works" color="neutral" variant="outline" size="xl" class="px-8">
            Learn More
          </UButton>
        </div>
        <p class="mt-8 text-blue-200 text-sm">
          10,000+ students • 5,000+ verified properties • 98% satisfaction rate
        </p>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
const steps = [
  {
    icon: "i-lucide-search",
    title: "Search & Filter",
    desc: "Browse verified properties with filters for price, distance, and amenities"
  },
  {
    icon: "i-lucide-star",
    title: "Review & Compare",
    desc: "Read authentic student reviews and compare your top choices"
  },
  {
    icon: "i-lucide-shield-check",
    title: "Book Securely",
    desc: "Contact verified landlords and book with payment protection"
  }
]

const unsplashProfiles = [
  'https://images.unsplash.com/photo-1494790108755-2616b786d49d?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507591064344-4c6ce005-128?w=200&h=200&fit=crop&crop=face'
]

const fallback_reviews = [
  {
    rating: 5,
    message: "HouseHunter made finding housing so easy! I found a perfect studio within walking distance of campus.",
    user: { name: "Alex Mwangi", location: "BU, Freshman", profile_picture: unsplashProfiles[0] }
  },
  {
    rating: 5,
    message: "As an international student, this platform connected me with trusted landlords in just 3 days!",
    user: { name: "Sarah Johnson", location: "KU, International Student", profile_picture: unsplashProfiles[1] }
  },
  {
    rating: 5,
    message: "The swap feature saved me so much money when I transferred campuses. Highly recommended!",
    user: { name: "David Omondi", location: "JKUAT, Senior", profile_picture: unsplashProfiles[2] }
  },
  {
    rating: 5,
    message: "Found my dream apartment near university. Smooth process and professional landlord.",
    user: { name: "Grace Wanjiru", location: "UON, Graduate Student", profile_picture: unsplashProfiles[3] }
  },
  {
    rating: 5,
    message: "Verified listings saved me from scams. All properties match their photos exactly.",
    user: { name: "Michael Otieno", location: "Moi University, 3rd Year", profile_picture: unsplashProfiles[4] }
  },
  {
    rating: 5,
    message: "Excellent customer support with quick responses throughout my booking process.",
    user: { name: "Linda Chebet", location: "Egerton University, 2nd Year", profile_picture: unsplashProfiles[5] }
  }
]

const { get } = useApi()
const endpoints = useEndpoints()

const {
  data: ourReviews,
  pending: allLoading,
  error: allError,
  refresh: refreshAll
} = await useAsyncData(
  'our-reviews',
  async () => {
    try {
      const response = await get(endpoints.utilities.our_reviews, { rating: 5 })
      const reviews = response?.data || response || []
      return Array.isArray(reviews)
        ? reviews.map((review, index) => ({
            ...review,
            user: {
              ...review.user,
              profile_picture: review.user?.profile_picture || unsplashProfiles[index % unsplashProfiles.length]
            }
          }))
        : []
    } catch (error) {
      console.error('Error fetching reviews:', error)
      throw error
    }
  },
  { server: true, lazy: false, default: () => [] }
)

const refreshing = ref(false)
const handleRefresh = async () => {
  refreshing.value = true
  try {
    await refreshAll()
  } finally {
    refreshing.value = false
  }
}

const displayedReviews = computed(() => {
  if (ourReviews?.value?.length) return ourReviews.value.slice(0, 6)
  return fallback_reviews.slice(0, 6)
})
</script>