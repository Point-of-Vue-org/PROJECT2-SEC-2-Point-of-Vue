<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['bgClick'])

</script>

<template>
  <Teleport to="body">
    <div
      :class="{
        'opacity-100 pointer-events-auto': show,
      }"
      class="fixed inset-0 bg-[#0009] backdrop-blur-sm z-20 grid place-items-center pointer-events-none opacity-0 transition-opacity duration-100"
      @click="handleClick"
    >
      <slot></slot>
    </div>
  </Teleport>
</template>