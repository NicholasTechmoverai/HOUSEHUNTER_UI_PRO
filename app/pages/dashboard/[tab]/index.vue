<template>
  <section class="min-h-screen p-4 md:p-6 max-w-[1400px] mx-auto">
    <NavigationBreadCrumb />

    <div>
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <div class="flex items-center gap-3 mb-3">
            <UIcon name="i-lucide-layout-dashboard" class="w-8 h-8 text-primary-600 dark:text-primary-400" />
            <h1 class="font-bold text-3xl sm:text-4xl text-gray-900 dark:text-white">
              Dashboard
            </h1>
          </div>
          <p class="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
            Manage your saved properties, applications, and housing swaps
          </p>
        </div>

        <div class="flex items-center gap-2 mt-6 lg:mt-0">
          <UButton icon="i-lucide-bell" color="gray" variant="ghost"
            class="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-2" aria-label="Notifications"
            :ui="{ rounded: 'rounded-full' }" />
          <UButton icon="i-lucide-settings" color="gray" variant="ghost"
            class="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-2" aria-label="Settings"
            :ui="{ rounded: 'rounded-full' }" />
        </div>
      </div>

      <div class="flex flex-col md:flex-row gap-6">
        <div class="md:w-1/4 space-y-6">
          <div class="rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <nav class="p-3 space-y-1">
              <UButton to="/dashboard/saved" :color="activeTab === 'saved' ? 'primary' : 'gray'"
                :variant="activeTab === 'saved' ? 'solid' : 'ghost'" label="Saved Properties (3)" block
                class="justify-start transition-all duration-200" icon="i-lucide-bookmark"
                :ui="{ rounded: 'rounded-lg' }" />
              <UButton to="/dashboard/applications" :color="activeTab === 'applications' ? 'primary' : 'gray'"
                :variant="activeTab === 'applications' ? 'solid' : 'ghost'" label="Applications (4)" block
                class="justify-start transition-all duration-200" icon="i-lucide-file-text"
                :ui="{ rounded: 'rounded-lg' }" />
              <UButton to="/dashboard/swaps" :color="activeTab === 'swaps' ? 'primary' : 'gray'"
                :variant="activeTab === 'swaps' ? 'solid' : 'ghost'" label="Housing Swaps (1)" block
                class="justify-start transition-all duration-200" icon="i-lucide-repeat"
                :ui="{ rounded: 'rounded-lg' }" />
              <UDivider class="my-2" />
              <UButton to="/dashboard/messages" :color="activeTab === 'messages' ? 'primary' : 'gray'"
                :variant="activeTab === 'messages' ? 'solid' : 'ghost'" label="Messages (5)" block
                class="justify-start transition-all duration-200" icon="i-lucide-message-square"
                :ui="{ rounded: 'rounded-lg' }">
                <template #trailing>
                  <span class="ml-auto bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                    2
                  </span>
                </template>
              </UButton>
              <UButton to="/dashboard/profile" :color="activeTab === 'profile' ? 'primary' : 'gray'"
                :variant="activeTab === 'profile' ? 'solid' : 'ghost'" label="Profile" block
                class="justify-start transition-all duration-200" icon="i-lucide-user"
                :ui="{ rounded: 'rounded-lg' }" />
            </nav>
          </div>

          <div class="rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-5">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <UIcon name="i-lucide-zap" class="w-4 h-4 text-primary-600 dark:text-primary-400" />
              Quick Actions
            </h3>
            <div class="space-y-2">
              <UButton icon="i-lucide-plus" label="Add Property" color="primary" variant="ghost" block
                class="justify-start hover:bg-primary-50 dark:hover:bg-primary-900/20"
                :ui="{ rounded: 'rounded-lg' }" />
              <UButton icon="i-lucide-search" label="Browse Listings" color="gray" variant="ghost" block
                class="justify-start" :ui="{ rounded: 'rounded-lg' }" />
              <UButton icon="i-lucide-share-2" label="Share Profile" color="gray" variant="ghost" block
                class="justify-start" :ui="{ rounded: 'rounded-lg' }" />
            </div>
          </div>
        </div>

        <div class="flex-1">
          <div class="md:rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div class="p-1 lg:p-6">
              <SavedPP v-if="activeTab === 'saved'" />
              <UserProfile v-else-if="activeTab === 'profile'" />
              <MyListings v-else-if="activeTab === 'listings'" />
              <MyApplications v-else-if="activeTab === 'applications'" />
              <MySwaps v-else-if="activeTab === 'swaps'" />
              <MyMessages v-else-if="activeTab === 'messages'" />
              <UBanner v-else title="Tab not found" color="error" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const route = useRoute()
const activeTab = ref<'saved' | 'profile' | 'listings' | 'applications' | 'swaps' | 'messages'>('saved')

watch(
  () => route.params.tab,
  (val) => {
    if (typeof val === 'string') activeTab.value = val as typeof activeTab.value
  },
  { immediate: true }
)
</script>

<style>
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

.dark ::-webkit-scrollbar-track {
  background: #374151;
}

.dark ::-webkit-scrollbar-thumb {
  background: #4b5563;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>