<script setup>
const props = defineProps({
  pageName: {
    type: String,
    default: 'homeview',
    validator: (value, props) => {
      return ['homeview', 'profileview'].includes(value)
    }
  }
})
</script>

<template>
  <div
    :class="{
      'm-4 portrait:md:grid-cols-2 landscape:md:grid-cols-2 landscape:xl:grid-cols-3': pageName === 'profileview',
      'portrait:md:grid-cols-3 landscape:md:grid-cols-3 landscape:xl:grid-cols-4': pageName === 'homeview'
    }"
    class="w-full sm:w-fit place-items-center sm:place-items-start grid grid-cols-1 sm:grid-cols-2 gap-6"
  >
    <slot>
      <!-- <div>Card will be rendered here</div> -->
    </slot>
  </div>
</template>

<style scoped>

</style>