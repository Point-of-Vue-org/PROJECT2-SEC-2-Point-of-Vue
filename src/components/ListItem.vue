<script setup>
import { computed, onMounted, reactive, ref, watch, watchEffect } from 'vue'
import Icon from './Icon.vue'

const props = defineProps({
  width: {
    type: String,
    default: '40rem'
  },
  contentHeight: {
    type: String,
    default: 'auto'
  },
  type: {
    type: String,
    default: 'list',
    validator: (value) => ['list', 'sublist'].includes(value)
  },
  extendBy: {
    type: String,
    default: 'fullbar',
    validator: (value) => ['dropdown', 'fullbar'].includes(value)
  }
})

const openState = ref(false)

const handleClickToOpen = (eventSource) => {
  if (props.extendBy === 'dropdown' && eventSource === 'dropdown') {
    openState.value = !openState.value
  } else if (props.extendBy === 'fullbar' && eventSource === 'fullbar') {
    openState.value = !openState.value
  }
}
</script>

<template>
  <li
    :style="{ width: width }"
    class="flex flex-col items-center my-1"
  >
    <div
      :class="{
        'min-h-14': type === 'list',
        'min-h-10': type === 'sublist'
      }"
      class="w-full cursor-pointer h-auto"
      @click="handleClickToOpen('fullbar')"
    >
      <div
        :class="{
          'bg-base-200': type === 'list',
          'bg-base-100': type === 'sublist'
        }"
        class="px-4 rounded-2xl w-full h-full text-2xl font-medium flex items-center gap-4 z-[5] relative"
      >
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
        <div class="w-10 h-14 flex justify-center items-center cursor-pointer">
          <div @click="handleClickToOpen('dropdown')" :class="{ 'rotate-180': openState }" class="transition-transform">
            <Icon iconName="chevron-down" />
          </div>
        </div>
      </div>
    </div>
    <div
      :style="{ height: openState ? contentHeight : '0px' }"
      :class="{
        'bg-neutral': type === 'list',
        'bg-accent shadow-lg text-base-100': type === 'sublist'
      }"
      class="w-[calc(100%-1rem)] overflow-hidden transition-[height] rounded-b-2xl"
    >
      <div
        :class="{
          'p-1': type === 'list',
          'px-4 py-4': type === 'sublist'
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