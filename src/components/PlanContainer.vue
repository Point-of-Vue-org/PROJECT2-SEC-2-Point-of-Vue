<script setup>
const props = defineProps({
  pageName:{
    validator(value, props){
      return ['homeview', 'profileview'].includes(value)
    }
  }
})
</script>

<template>
  <div
    :class="{
      'portrait:md:grid-cols-2 landscape:md:grid-cols-2 landscape:xl:grid-cols-3': pageName === 'profileview',
      'portrait:md:grid-cols-3 landscape:md:grid-cols-3 landscape:xl:grid-cols-4': pageName === 'homeview'
    }"
    class="w-fit grid grid-cols-1 sm:grid-cols-2 grid-flow-row place-items-center gap-6"
  >
    <slot>
      <!-- <div>Card will be rendered here</div> -->
    </slot>
  </div>
</template>

<style scoped>

</style>