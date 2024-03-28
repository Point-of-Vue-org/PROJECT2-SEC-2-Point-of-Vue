<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div
    :class="{
      'opacity-100 pointer-events-auto': show,
    }"
    class="fixed inset-0 bg-[#0009] z-20 grid place-items-center pointer-events-none opacity-0 transition-opacity duration-100"
  >
    <slot></slot>
  </div>
</template>