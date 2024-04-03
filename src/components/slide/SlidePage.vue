<script setup>
const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  page: {
    type: Number,
    required: true,
  },
  transitionType: {
    type: String,
    default: 'slide',
  }
})
</script>

<template>
  <div
    :class="{
      'scale-0': currentPage !== page && transitionType === 'scale',
      'scale-100': currentPage === page && transitionType === 'scale',
    }"
    class="flex-shrink-0 w-screen h-full flex flex-col item-start sm:items-center justify-start sm:justify-center transform transition-all duration-1000"
  >
    <slot></slot>
  </div>
</template>

<style scoped>

</style>