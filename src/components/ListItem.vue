<script setup>
import { ref } from 'vue'
import Icon from './Icon.vue';

defineProps({
  width: {
    type: String,
    default: '40rem'
  },
  contentHeight: {
    type: String,
    default: '20rem'
  },
  type: {
    type: String,
    default: 'list'
  },
})

const openState = ref(false)

</script>

<template>
  <li
    :style="{ width: width }"
    class="flex flex-col items-center"
  >
    <div
      :class="{
        'h-14': type === 'list',
        'h-10': type === 'sublist'
      }"
      class="w-full"
    >
      <div
        :class="{
          'bg-base-200': type === 'list',
          'bg-base-100': type === 'sublist'
        }"
        class="rounded-2xl w-full h-full text-2xl font-medium flex items-center gap-4 z-[5] relative"
      >
        <div class="w-10 h-14">
          <!-- <div
            v-if="draggable"
            @mouseover="dragUnlock = true"
            @mouseleave="dragUnlock = false"
            class="cursor-grab w-full h-full flex justify-center items-center"
          >
            <Icon iconName="drag" />
          </div> -->
        </div>
        <div
          :class="{
            'text-2xl': type === 'list',
            'text-lg': type === 'sublist'
          }"
          class="w-full"
        >
          <slot name="title">
            <div>Title</div>
          </slot>
        </div>
        <div @click="openState = !openState" class="w-10 h-14 flex justify-center items-center cursor-pointer">
          <Icon iconName="chevron-down" :class="openState ? 'rotate-180' : 'rotate-0'" class="transition-transform" />
        </div>
      </div>
    </div>
    <div
      :style="{ height: openState ? contentHeight : '0' }"
      :class="{
        'bg-neutral': type === 'list',
        'bg-accent shadow-lg text-base-100': type === 'sublist'
      }"
      class="w-[calc(100%-2rem)] overflow-hidden transition-[height] rounded-b-2xl"
    >
      <div
        :class="{
          'p-2': type === 'list',
          'px-4 py-2': type === 'sublist'
        }"
        class="w-full h-full"
      >
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