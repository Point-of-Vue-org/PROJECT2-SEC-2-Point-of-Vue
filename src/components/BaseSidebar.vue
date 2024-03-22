<script setup>

</script>

<template>
  <aside class="h-[calc(100vh-theme(space.16))] min-w-56 sticky top-16">
    <ul class="menu p-4 min-h-full bg-base-200 text-base-content">
      <slot name="menu">
        <li><a class="text-lg">Menu 1</a></li>
        <li><a class="text-lg">Menu 2</a></li>
        <li><a class="text-lg">Menu 3</a></li>
      </slot>
    </ul>
  </aside>
</template>

<style scoped>

</style>