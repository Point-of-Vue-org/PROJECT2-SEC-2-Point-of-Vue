<script setup>
import { RouterView } from 'vue-router'
import BaseToast from '@/components/BaseToast.vue'
</script>

<template>
  <main class="h-svh sm:h-screen">
    <BaseToast />
    <RouterView />
  </main>
</template>
