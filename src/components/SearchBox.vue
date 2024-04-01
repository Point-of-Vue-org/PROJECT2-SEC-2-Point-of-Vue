<script setup>
import { ref } from 'vue';
import Icon from './Icon.vue';
import Modal from './Modal.vue';

const emits = defineEmits(['sumbitSearch']);

const openState = ref(false);
const searchTerms = ref('');

const handleOpen = () => {
  openState.value = true;
}

const handleClose = () => {
  openState.value = false;
}

const handleSubmitSearch = () => {
  openState.value = false
  emits('sumbitSearch', searchTerms.value)
}
</script>

<template>
  <Modal @bgClick="handleClose" :show="openState">
    <div class="w-full max-w-[40rem] bg-base-100 p-4 rounded-2xl flex flex-col gap-4 border border-secondary">
      <div class="relative w-full flex gap-2">
        <Icon iconName="search" class="absolute left-5 top-4 pointer-events-none" />
        <input v-model="searchTerms" @keyup.enter="handleSubmitSearch" type="text" placeholder="Type your keywords to search" class="pl-12 input input-bordered w-full rounded-lg" />
        <button @click="handleSubmitSearch" class="btn btn-accent">Search</button>
      </div>
      <div class="text-sm text-secondary">You can type <span class="p-1 bg-accent text-base-100 rounded-lg">@</span> at the beginning of the keyword to search for users. <span class="p-1 bg-accent text-base-100 rounded-lg">e.g. @john</span></div>
    </div>
  </Modal>
  <div @click="handleOpen" class="form-control relative w-full">
    <Icon iconName="search" class="absolute left-5 top-4 pointer-events-none" />
    <input type="text" @mousedown="(e) => e.preventDefault()" placeholder="Search" class="pl-12 input input-bordered w-full max-w-96 md:w-auto rounded-xl" />
    <!-- <div v-if="openState" class="absolute top-14 w-full bg-base-300 rounded border shadow-lg border-neutral z-50">
      <ul class="p-2">
        <li class="p-2 hover:bg-base-200" @click="handleClickSearch">Search result 1</li>
        <li class="p-2 hover:bg-base-200">Search result 2</li>
        <li class="p-2 hover:bg-base-200">Search result 3</li>
      </ul>
    </div> -->
  </div>
</template>

<style scoped>

</style>