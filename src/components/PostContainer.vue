<script setup>

</script>

<template>
  <div class="flex justify-center">
    <div class="grid grid-cols-4 grid-flow-row gap-8">
      <slot>
        <div>Card will be rendered here</div>
      </slot>
    </div>
  </div>
</template>

<style scoped>

</style>