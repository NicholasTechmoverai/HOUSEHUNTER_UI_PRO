<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import logoimg from '~/assets/images/logo.png'
import logoimg_no_bg from '~/assets/images/f_logo.png'
import logoimg_w_name from '~/assets/images/named_logo.png'

defineProps<{
  collapsed?: boolean
}>()

const teams = ref([
  {
    label: 'Admin',
    avatar: {
      src: logoimg,
      alt: 'admin'
    }
  },
  {
    label: 'User',
    to: '/',
    avatar: {
      src: logoimg_no_bg,
      alt: 'User'
    }
  },
  {
    label: 'Manage',
    to: "/manage",
    avatar: {
      src: logoimg_w_name,
      alt: 'manage'
    }
  }])
const selectedTeam = ref(teams.value[0])

const items = computed<DropdownMenuItem[][]>(() => {
  return [teams.value.map(team => ({
    ...team,
    onSelect() {
      selectedTeam.value = team
    }
  })), [{
    label: 'Create team',
    icon: 'i-lucide-circle-plus'
  }, {
    label: 'Manage teams',
    icon: 'i-lucide-cog'
  }]]
})
</script>

<template>
  <UDropdownMenu :items="items" :content="{ align: 'center', collisionPadding: 12 }"
    :ui="{ content: collapsed ? 'w-40' : 'w-(--reka-dropdown-menu-trigger-width)' }">
    <UButton v-bind="{
      ...selectedTeam,
      label: collapsed ? undefined : selectedTeam?.label,
      trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down'
    }" color="neutral" variant="ghost" block :square="collapsed" class="data-[state=open]:bg-elevated"
      :class="[!collapsed && 'py-2']" :ui="{
        trailingIcon: 'text-dimmed'
      }" />
  </UDropdownMenu>
</template>
