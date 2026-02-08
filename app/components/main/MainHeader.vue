<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import AppLogo from '../general/AppLogo.vue'
import LoggerIcon from './LoggerIcon.vue'
import { useStateStore } from '~/stores/state'

const route = useRoute()
const screen = useScreenSize()
const stateStore = useStateStore()

const navigationItems = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Home',
    to: '/',
    active: route.path === '/'
  },
  {
    label: 'Listings',
    to: '/listings',
    active: route.path.startsWith('/apartments')
  },
  {
    label: 'Swaps',
    to: '/swaps',
    badge: 'New',
    active: route.path.startsWith('/swaps')
  },
  {
    label: 'Map',
    to: '/map',
    variant: 'primary' as const,
    active: route.path.startsWith('/create')
  },
  {
    label: 'Dashboard',
    to: '/dashboard',
    active: route.path.startsWith('/about')
  }
])

const mobileTabItems = ref([
  {
    icon: 'i-lucide-home',
    label: 'Home',
    to: '/',
    active: route.path === '/'
  },
  {
    icon: 'i-lucide-search',
    label: 'Search',
    to: '/listings',
    active: route.path.startsWith('/apartments')
  },
  {
    icon: 'i-lucide-repeat',
    label: 'Swaps',
    to: '/swaps',
    badge: 'New',
    active: route.path.startsWith('/swaps')
  },
  {
    icon: 'i-lucide-map',
    label: 'Map',
    to: '/map',
    active: route.path.startsWith('/create')
  },
  {
    icon: 'i-lucide-layout-dashboard',
    label: 'Dashboard',
    to: '/dashboard',
    active: route.path.startsWith('/about')
  }
])

// Watch for route changes to update active states
watch(route, () => {
  mobileTabItems.value = mobileTabItems.value.map(item => ({
    ...item,
    active: route.path.startsWith(item.to) || (item.to === '/' && route.path === '/')
  }))
})
</script>

<template>
  <!-- Desktop Navigation -->
  <UHeader v-show="screen.isDesktop" :toggle="false">
    <template #title>
      <NuxtLink to="/" class="flex items-center">
        <AppLogo class="w-auto h-8 shrink-0" />
      </NuxtLink>
    </template>

    <UNavigationMenu :items="navigationItems" />

    <template #right>
      <UColorModeButton />
      <UButton icon="i-lucide-plus" label="Create" to="/create" variant="soft"/>
      <UTooltip text="More on profile" :kbds="['meta', 'P']">
        <LoggerIcon />
      </UTooltip>
    </template>

    <template #body>
      <UNavigationMenu 
        :items="navigationItems" 
        orientation="vertical" 
        class="-mx-2.5"
      />
    </template>
  </UHeader>
  <!-- Mobile Navigation -->
  <div 
  v-if="!screen.isDesktop.value"
   :class="[
    'fixed  left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
    stateStore.MobileNavBarPosition === 'bottom' ? 'bottom-0' : 'top-16'
  ]"
  >
      <USeparator v-if="stateStore.MobileNavBarPosition === 'bottom'" />

    <div class="flex items-center justify-around px-2 py-2">
      <NuxtLink
        v-for="item in mobileTabItems"
        :key="item.label"
        :to="item.to"
        class="flex flex-col items-center justify-center gap-1 p-1 px-3 rounded-lg transition-all duration-200"
        :class="[
          item.active 
            ? 'text-primary bg-primary/10' 
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
        ]"
      >
        <UIcon 
          :name="item.icon" 
          class="h-5 w-5"
          :class="item.active ? 'text-primary' : 'text-muted-foreground'"
        />
        <span class="text-xs font-medium">{{ item.label }}</span>
        
      </NuxtLink>
    </div>
    <!-- Optional safety area for iOS -->
    <div class="h-safe-bottom" />
    <USeparator v-if="stateStore.MobileNavBarPosition === 'top'" />
  </div>
</template>

<style scoped>
/* Safe area for iOS devices */
.h-safe-bottom {
  height: env(safe-area-inset-bottom);
}
</style>