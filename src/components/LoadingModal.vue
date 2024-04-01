<script setup>
import Modal from './Modal.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: true
  },
  text: {
    type: String,
    default: 'Loading...'
  }
})

const emits = defineEmits(['bgClick'])

</script>

<template>
  <Modal @bgClick="$emit('bgClick')" :show="show">
    <div class="flex flex-col items-center gap-4">
      <div>{{ text }}</div>
      <div class="loading loading-lg loading-spinner"></div>
    </div>
  </Modal>
</template>

<style scoped>

</style>