<template>
  <section class="min-h-screen p-6 max-w-[1400px] mx-auto">
    <NavigationBreadCrumb />

    <div class="">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-10">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <UIcon name="i-lucide-layout-dashboard" class="w-8 h-8 text-primary-600 dark:text-primary-400" />
            <h1 class="font-bold text-3xl sm:text-4xl text-gray-900 dark:text-white">My Dashboard</h1>
          </div>
          <p class="text-gray-600 dark:text-gray-400 text-base sm:text-lg mt-2">Manage your saved properties, applications, and housing swaps</p>
        </div>

        <div class="flex items-center gap-3 mt-6 lg:mt-0">
          <UButton 
            icon="i-lucide-bell" 
            color="gray" 
            variant="ghost" 
            class="hover:bg-gray-200 dark:hover:bg-gray-800"
            aria-label="Notifications"
          />
          <UButton 
            icon="i-lucide-settings" 
            color="gray" 
            variant="ghost" 
            class="hover:bg-gray-200 dark:hover:bg-gray-800"
            aria-label="Settings"
          />
        </div>
      </div>

    

      <!-- Main Content -->
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Sidebar Navigation -->
        <div class="lg:w-64">
          <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <nav class="p-2">
              <UButton 
                to="/dashboard/saved" 
                color="primary" 
                variant="solid" 
                label="Saved Properties (3)" 
                block 
                class="justify-start mb-2"
                icon="i-lucide-bookmark"
              />
              <UButton 
                to="/dashboard/applications" 
                color="gray" 
                variant="outline" 
                label="Applications (4)" 
                block 
                class="justify-start mb-2"
                icon="i-lucide-file-text"
              />
              <UButton 
                to="/dashboard/swaps" 
                color="gray" 
                variant="outline" 
                label="My Housing Swaps (1)" 
                block 
                class="justify-start mb-2"
                icon="i-lucide-repeat"
              />
              <USeparator />
              <UButton 
                to="/dashboard/messages" 
                color="gray" 
                variant="outline" 
                label="Messages (5)" 
                block 
                class="justify-start mb-2"
                icon="i-lucide-message-square"
                badge="2"
              />
              <UButton 
                to="/dashboard/profile" 
                color="gray" 
                variant="outline" 
                label="Profile" 
                block 
                class="justify-start"
                icon="i-lucide-user"
              />
            </nav>
          </div>

          <!-- Quick Actions -->
          <div class="mt-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-4">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Quick Actions</h3>
            <div class="space-y-2">
              <UButton 
                icon="i-lucide-plus" 
                label="Add Property" 
                color="primary" 
                variant="ghost" 
                block 
                class="justify-start"
              />
              <UButton 
                icon="i-lucide-search" 
                label="Browse Listings" 
                color="gray" 
                variant="ghost" 
                block 
                class="justify-start"
              />
              <UButton 
                icon="i-lucide-share-2" 
                label="Share Profile" 
                color="gray" 
                variant="ghost" 
                block 
                class="justify-start"
              />
            </div>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="flex-1">
          <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
            <!-- Content Header -->
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Recently Saved Properties</h2>
              <UButton 
                icon="i-lucide-arrow-right" 
                label="View All" 
                color="gray" 
                variant="ghost" 
                size="sm"
              />
            </div>

            <!-- Saved Properties Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="i in 3" :key="i" class="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div class="h-40 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-800/10"></div>
                <div class="p-4">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-gray-900 dark:text-white">Modern Apartment</span>
                    <UIcon name="i-lucide-bookmark-check" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">Nairobi • 2 Bedroom</p>
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-gray-900 dark:text-white">KSh 25,000/mo</span>
                    <UButton 
                      icon="i-lucide-eye" 
                      color="gray" 
                      variant="ghost" 
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State (if no properties) -->
            <div v-if="false" class="text-center py-12">
              <UIcon name="i-lucide-home" class="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto" />
              <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">No saved properties yet</h3>
              <p class="mt-2 text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
                Start exploring housing options and save properties you're interested in.
              </p>
              <UButton 
                label="Browse Properties" 
                color="primary" 
                variant="solid" 
                class="mt-4"
                icon="i-lucide-search"
              />
            </div>
          </div>

          <!-- Applications Section -->
          <div class="mt-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Recent Applications</h2>
              <UButton 
                icon="i-lucide-plus" 
                label="New Application" 
                color="primary" 
                variant="solid" 
                size="sm"
              />
            </div>

            <div class="space-y-3">
              <div v-for="i in 2" :key="i" class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-800 rounded-lg">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <UIcon name="i-lucide-file-text" class="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">Studio Apartment Application</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Submitted 2 days ago</p>
                  </div>
                </div>
                <UBadge color="green" variant="subtle">Pending</UBadge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const activeTab = ref('saved')
const stats = {
  saved: 3,
  applications: 4,
  swaps: 1,
  messages: 5
}
</script>

<style>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
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