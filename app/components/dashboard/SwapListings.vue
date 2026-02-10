<script setup lang="ts">
const userStore = useUserStore()

const isLoading = ref(false)
const limit = ref(10)
const offset = ref(0)

const listings = ref<any[]>([])

const fetchListings = async () => {
  isLoading.value = true

  try {
    // const res = await userStore.fetchListings({
    //   offset: offset.value,
    //   limit: limit.value
    // })
    const res = await userStore.fetchListings()

    listings.value.push(...res.data.rentals)
  } catch (error) {
    console.error('Failed to fetch listings:', error)
    listings.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchListings)
</script>

<template>
  <div class="space-y-4">
    <div v-if="isLoading">
      Loading listings…
    </div>

    <div v-else-if="!listings.length">
      No listings found.
    </div>

    <div v-else>
      {{ listings }}
    </div>
  </div>
</template>
