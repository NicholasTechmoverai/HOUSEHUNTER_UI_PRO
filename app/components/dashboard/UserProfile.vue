<template>
  <section>
    <div>
      <UUser name="John Doe" description="Software Engineer" :avatar="{
        src: 'https://i.pravatar.cc/150?u=john-doe'
      }" chip size="xl" />
    </div>
    <USeparator />
    <div>
      {{ user }}
    </div>
  </section>
</template>

<script lang="ts" setup>

const userStore = useUserStore()
const user = ref({} as any)
const allowed_genders = ref([] as any)
const listing_loading = ref<boolean>(false)

const limit = ref(10)
const userRentalProperties = ref([] as any)
watch(
  () => userStore.profile,
  (val) => {
    user.value = val ? { ...toRaw(val) } : null
  },
  { immediate: true }
)

onMounted(async () => {
  userStore.fetchProfile()
  fetchlistings({offset:0,limit:10})

  const gendersRes = await load_genders()
  allowed_genders.value = gendersRes?.data || []
})

const fetchlistings = async ({ offset, limit }) => {
  listing_loading.value = true
  // const res = await userStore.fetch_user_listings({ offset, limit })
  try {
    const res = await userStore.fetchListings()
    userRentalProperties.value.push(...res.data.rentals)
  } catch (err) {
    console.error(err)
    userRentalProperties.value = []
  } finally {
    listing_loading.value = false
  }
}

</script>

<style></style>