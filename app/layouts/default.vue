<script setup lang="ts">
import MainHeader from '~/components/main/MainHeader.vue';
const { isDesktop } = useScreenSize()

</script>


<template>
  <UApp>
    <MainHeader />
    <UMain :class="{'mt-20':!isDesktop}">
      <NuxtPage />
    </UMain>
  </UApp>
</template>
