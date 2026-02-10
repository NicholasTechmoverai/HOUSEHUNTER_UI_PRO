<script setup lang="ts">
import type { TabsItem } from '#ui/types'

const tabs: TabsItem[] = [
  {
    label: 'My Listings',
    icon: 'i-lucide-list',
    slot: 'listings'
  },
  {
    label: 'Swap Requests',
    icon: 'i-lucide-arrow-right-left',
    slot: 'requests',
    badge: 2
  },
  {
    label: 'Messages',
    icon: 'i-lucide-message-square',
    slot: 'messages',
    badge : 0
  }
]
</script>

<template>
  <UTabs
    :items="tabs"
    variant="link"
    :ui="{ trigger: 'grow' }"
    class="w-full gap-4"
  >
    <template #listings>
      <div class="space-y-4">
        <SwapListings  />
        
      </div>
    </template>

    <template #requests>
      <div class="space-y-4">
        <!-- Swap Requests content -->
      </div>
    </template>

    <template #messages>
      <div class="space-y-4">
        <MyMessages />
      </div>
    </template>
  </UTabs>
</template>
