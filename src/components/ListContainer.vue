<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <ul class="flex flex-col gap-1 w-full">
    <slot :items="items"></slot>
  </ul>
</template>