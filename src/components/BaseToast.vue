<script setup>
import { useToastStore } from '@/stores/toast';

const toastStore = useToastStore()

</script>

<template>
  <div v-for="(toast, index) in toastStore.toasts" :key="index">
    <div v-if="toast !== null" :class="toast.show ? 'toast-in' : 'toast-out'" class="toast toast-end z-50">
      <div :class="`alert alert-${toast.type}`" class="border-neutral border">
        <span>{{ toast.message }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.toast-in {
  @apply transform translate-x-[0%] duration-500;
}

.toast-out {
  @apply transform translate-x-[100%] duration-500;
}

</style>