<script setup>
import { useToastStore } from '@/stores/toast';

const toastStore = useToastStore()

</script>

<template>
  <div :class="toastStore.show ? 'toast-in' : 'toast-out'" class="toast toast-end">
    <div :class="`alert alert-${toastStore.type}`">
      <span>{{ toastStore.msg }}</span>
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