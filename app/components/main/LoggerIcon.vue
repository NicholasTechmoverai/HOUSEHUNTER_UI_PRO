<template>
  <div v-if="authStore.user" class="cursor-pointer ">
    <UPopover arrow>
      <UAvatar :src="authStore.user.profile_picture" :alt="authStore.user.display_name || 'User avatar'" />

      <template #content>
        <div class="flex flex-col gap-2 p-2 min-w-[200px]">
          <UButton icon="i-lucide-user" variant="outline" to="/dashboard/?tab=profile"
            :label="authStore.user?.display_name" />
          <UButton icon="i-lucide-log-out" color="error" variant="outline" @click="logout" label="Logout" />
        </div>
      </template>
    </UPopover>

  </div>

  <div v-else>
    <UFieldGroup class="cursor-pointer">

      <UButton icon="i-lucide-rocket" color="neutral" variant="outline" :ui="{ leadingIcon: 'text-primary' }"
        label="Login" @click="$router.push('/auth/login')" />

      <UButton @click="login" color="neutral" variant="outline" icon="i-simple-icons-google" class="text-orange-400" />

    </UFieldGroup>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'



const authStore = useAuthStore()
// const authStore = useAuthStore()

const login = async () => {
  authStore.setLastAttemptedRouteToCurrent()
  await authStore.handleGoogleLogin()
}

const logout = () => {
  const res = authStore.logout()
  if (res) {
    useToast().add({
      title: "Signed out!",
      description: "You can log in anytime.",
      icon: "i-lucide-log-out",
      color: 'info'
    })
  }
}
</script>
