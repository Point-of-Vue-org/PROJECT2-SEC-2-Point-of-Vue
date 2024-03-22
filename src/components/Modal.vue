<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div v-show="show" class="absolute inset-0 bg-[#0009] z-20 grid place-items-center">
    <slot></slot>
  </div>
</template>