<script setup>
const props = defineProps({
  pageAmount: {
    type: Number,
    default: 1,
  },
  currentPage: {
    type: Number,
    default: 1,
  }
})
</script>

<template>
  <div
    :style="{
      transform: `translateX(-${(currentPage - 1) * 100}vw)`,
    }"
    class="flex h-full transition-transform duration-1000 ease-in-out"
  >
    <slot></slot>
  </div>
</template>

<style scoped>

</style>