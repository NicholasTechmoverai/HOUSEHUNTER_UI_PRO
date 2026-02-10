<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { breakpointsTailwind } from '@vueuse/core'
import type { Mail } from '~/types'

const tabItems = [{
    label: 'All',
    value: 'all'
}, {
    label: 'Unread',
    value: 'unread'
}]
const selectedTab = ref('all')

const { data: mails } = await useFetch<Mail[]>('/api/mails', { default: () => [] })

// Filter mails based on the selected tab
const filteredMails = computed(() => {
    if (selectedTab.value === 'unread') {
        return mails.value.filter(mail => !!mail.unread)
    }

    return mails.value
})

const selectedMail = ref<Mail | null>()

const isMailPanelOpen = computed({
    get() {
        return !!selectedMail.value
    },
    set(value: boolean) {
        if (!value) {
            selectedMail.value = null
        }
    }
})

// Reset selected mail if it's not in the filtered mails
watch(filteredMails, () => {
    if (!filteredMails.value.find(mail => mail.id === selectedMail.value?.id)) {
        selectedMail.value = null
    }
})

const breakpoints = useBreakpoints(breakpointsTailwind)
const isMobile = breakpoints.smaller('lg')
</script>

<template>


    <InboxMail v-if="selectedMail" :mail="selectedMail" @close="selectedMail = null" />
    <div v-else>
        <UDashboardNavbar title="Inbox">
            <template #leading>
                <UDashboardSidebarCollapse />
            </template>
            <template #trailing>
                <UBadge :label="filteredMails.length" variant="subtle" />
            </template>

            <template #right>
                <UTabs v-model="selectedTab" :items="tabItems" :content="false" size="xs" />
            </template>
        </UDashboardNavbar>
        <InboxList v-model="selectedMail" :mails="filteredMails" />
    </div>

    <div v-if="mails.length === 0">
        <UEmpty size="xl" icon="i-lucide-bell" title="No notifications"
            description="You're all caught up. New notifications will appear here." :actions="[
                {
                    icon: 'i-lucide-refresh-cw',
                    label: 'Refresh',
                    color: 'neutral',
                    variant: 'subtle'
                }
            ]" />
    </div>


</template>
