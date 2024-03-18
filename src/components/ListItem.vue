<script setup>
import { ref } from 'vue'
import Icon from './Icon.vue';

defineProps({
  id: {
    type: String,
    required: true
  },
  width: {
    type: String,
    default: '40rem'
  },
  contentHeight: {
    type: String,
    default: '20rem'
  },
  draggingItemId: {
    type: String,
    default: null
  }
})

const dragUnlock = ref(false)
const openState = ref(false)

</script>

<template>
  <li
    :data-item-id="id"
    :draggable="dragUnlock"
    :style="{ width: width }"
    :class="{
      'opacity-50': draggingItemId === id
    }"
    class="flex flex-col items-center"
    @dragstart="$emit('dragstart', $event)"
    @dragover="$emit('dragover', $event)"
    @dragend="$emit('dragend', $event)"
    @drop="$emit('drop', $event)"
  >
    <div class="w-full h-14">
      <div class="bg-base-200 rounded-2xl h-full text-2xl font-medium flex items-center justify-between gap-4 z-10 relative">
        <div
          @mouseover="dragUnlock = true"
          @mouseleave="dragUnlock = false"
          class="cursor-grab w-10 h-14 flex justify-center items-center"
        >
          <Icon iconName="drag" />
        </div>
        <div>
          <slot name="title">
            <div>Title</div>
          </slot>
        </div>
        <div @click="openState = !openState" class="w-10 h-14 flex justify-center items-center cursor-pointer">
          <Icon iconName="chevronDown" :class="openState ? 'rotate-180' : 'rotate-0'" class="transition-transform" />
        </div>
      </div>
    </div>
    <div :style="{ height: openState ? contentHeight : '0' }" class="w-[calc(100%-2rem)] bg-neutral overflow-hidden transition-[height] rounded-b-2xl">
      <div class="p-2">
        <slot name="content">
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur cum, tempore, asperiores eius obcaecati
            voluptates quam exercitationem eum vel officia voluptatibus ad tempora repudiandae vitae architecto nemo quae
            repellendus? Perspiciatis.</p>
        </slot>
      </div>
    </div>
  </li>
</template>

<style scoped>
</style>