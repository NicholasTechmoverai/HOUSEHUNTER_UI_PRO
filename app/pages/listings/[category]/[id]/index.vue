<script setup lang="ts">
const { get } = useApi()
const endpoints = useEndpoints()
const route = useRoute()

const rentalId = route.params.id as string
const category = route.params.category as string

const ID_PREFIXES = ['RNT', 'PRT', 'SWP']

const readableCategory = computed(() =>
  category
    ?.toLowerCase()
    .replaceAll('_', ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
)

const isIdBased = computed(() =>
  ID_PREFIXES.some(prefix => rentalId.startsWith(`${prefix}-`))
)

const { data: rental } = await useAsyncData(
  () => `rental-${rentalId}`,
  () =>
    get(
      isIdBased.value
        ? endpoints.rental.getById(rentalId)
        : endpoints.rental.getBySlug(rentalId)
    ),
  {
    watch: [() => route.params.id]
  }
)

const rentalTitle = computed(() =>
  rental.value?.data?.title ??
  rentalId.charAt(0).toUpperCase() + rentalId.slice(1)
)

watchEffect(() => {
  const title = rental.value?.data?.title ?? rentalTitle.value
  const description =
    rental.value?.data?.description?.slice(0, 120) ??
    `Browse ${readableCategory.value} rentals and find your next home.`

  useSeoMeta({
    title,
    description,
    image: rental.value?.data?.profile_picture,
    ogType: 'website'
  })

  useHead({
    meta: [
      {
        name: 'keywords',
        content: [
          title,
          readableCategory.value,
          'rentals',
          'properties',
          'real estate'
        ]
          .filter(Boolean)
          .join(', ')
      }
    ]
  })
})
</script>

<template>
  <section class="mx-auto max-w-[1400px] p-6">
    <NavigationBreadCrumb />
  </section>
  <div>
    {{ rental.data }}
  </div>
</template>
