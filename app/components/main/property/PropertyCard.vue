<template>
  <NuxtLink :to="`/listings/${rental?.category}/${rental?.slug}`" class="border border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-900">
    <!-- Image -->
    <div class="relative h-68 overflow-hidden">
      <img 
        :src="rental?.profile_picture || rental?.images?.[0]" 
        :alt="rental?.title || 'Property image'"
        class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
      />
      <!-- Badges -->
      <div class="absolute top-3 left-3 flex flex-col gap-2">
        <span v-if="rental?.is_verified" class="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
          Verified
        </span>
        <span v-if="rental?.is_available" class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
          Available
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4">
      <!-- Title -->
      <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-1 line-clamp-1">
        {{ rental?.title }}
      </h3>
      
      <!-- Location -->
      <div class="text-sm text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
        <UIcon name="i-heroicons-map-pin" class="w-3 h-3" />
        <span>{{ rental?.institution || rental?.state}}</span>
        <span>•</span>
        <span>{{ rental?.distance }}</span>
      </div>
      
      <!-- Price -->
      <div class="mb-3">
        <div class="text-xl font-bold text-gray-900 dark:text-white">
          {{ rental?.pricing?.base_price?.currency || 'R' }}{{ rental?.pricing?.base_price?.rent?.toLocaleString() || '0' }}
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-400">
          / {{ rental?.pricing?.base_price?.rent_frequency || 'month' }}
        </div>
      </div>
      
      <!-- Details -->
      <div class="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-3">
        <span class="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
          {{ rental?.category }}
        </span>
        <span>{{ rental?.bedrooms }} bed</span>
        <span>{{ rental?.bathrooms }} bath</span>
      </div>
      
      <!-- Reviews -->
      <div class="text-sm italic text-gray-500 dark:text-gray-400">
        {{ rental?.reviews ? `${rental.reviews} reviews` : 'No reviews yet' }}
      </div>
    </div>
  </NuxtLink>
</template>

<script lang="ts" setup>
defineProps<{ rental: any }>()
</script>