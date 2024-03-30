<script setup>
import { ref } from 'vue';
import Icon from './Icon.vue';

const props = defineProps({
  sortOptions: {
    type: Array,
    required: true
  }
})

const emits = defineEmits(['sortOptionSelect'])

const openState = ref(false)
const sortBy = ref(props.sortOptions[0][0])

const handleSelect = (option) => {
  openState.value = false
  sortBy.value = option[0]
  emits('sortOptionSelect', [option[1], option[2]])
}

</script>

<template>
  <span>
    <span>Sort by </span>
    <span class="dropdown">
      <div tabindex="0" role="button" @click="openState = !openState" class="flex items-center gap-2 text-primary">{{ sortBy }} <Icon iconName="chevron-down" /></div>
      <ul tabindex="0" :class="{ 'hidden': !openState }" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 border border-neutral rounded-box w-52">
        <li
          v-for="(option, index) in sortOptions"
          :key="index"
          @click="handleSelect(option)"
          class="hover:bg-neutral cursor-pointer p-2 rounded-md"
        >
          {{ option[0] }}
        </li>
      </ul>
    </span>
  </span>
</template>

<style scoped>

</style>