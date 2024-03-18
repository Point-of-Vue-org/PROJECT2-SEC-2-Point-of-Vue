<script setup>

import { ref, onMounted } from 'vue'

const props = defineProps({
  iconName: {
    type: String,
    required: true
  }
})

const icon = ref('')

onMounted(async () => {
  icon.value = (await import(`@/assets/icons/${props.iconName}.svg?raw`)).default
})

</script>

<template>
  <div v-html="icon"></div>
</template>