<script setup>
import { ref } from 'vue';
import Icon from './Icon.vue';

const openState = ref(false);
const searchResult = ref([]);

const handleFocusIn = () => {
  openState.value = true;
}

const handleFocusOut = () => {
  // openState.value = false;
  setTimeout(() => {
    console.log('focus out');
    openState.value = false;
  }, 200);
}

const handleClickSearch = (e) => {
  console.log(e);
  e.stopPropagation();
  openState.value = false;
}
</script>

<template>
  <div @focusin="handleFocusIn" @focusout="handleFocusOut" class="form-control relative">
    <Icon iconName="search" class="absolute left-5 top-4 pointer-events-none" />
    <input type="text" placeholder="Search" class="pl-12 input input-bordered min-w-96 md:w-auto rounded-xl" />
    <div v-if="openState" class="absolute top-14 w-full bg-base-100 rounded-box border shadow-lg border-neutral">
      <ul class="p-2">
        <li class="p-2 hover:bg-base-200" @click="handleClickSearch">Search result 1</li>
        <li class="p-2 hover:bg-base-200">Search result 2</li>
        <li class="p-2 hover:bg-base-200">Search result 3</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>

</style>