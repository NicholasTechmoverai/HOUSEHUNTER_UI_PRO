
<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const router = useRouter()
onMounted(() => {
  if (route.query.success === '1' && route.query.data) {
    const decoded = JSON.parse(
      atob(route.query.data as string)
    )

    useAuthStore().setUser(decoded.user, decoded.access_token)

    console.log('Got data::', decoded)

    // Desktop popup
    if (window.opener && !window.opener.closed) {
      // window.opener.postMessage(
      //   { type: 'google-login-success' },
      //   window.location.origin
      // )
      // window.close()
    } else {
      const redirect_route = useAuthStore().popRedirect()
      router.push(redirect_route[0].path?redirect_route.path:'/')
    }
  }
})
</script>

<template>
    <div class="flex h-screen items-center justify-center">
        <p>Signing you in…</p>
    </div>
</template>
