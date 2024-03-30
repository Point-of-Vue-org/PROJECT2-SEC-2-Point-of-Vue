<script setup>
import Icon from './Icon.vue';

defineProps({
  openState: Boolean
})

const emits = defineEmits(['closeSidebarBtnClick'])

const handleCloseSidebarBtnClick = () => {
  emits('closeSidebarBtnClick')
}
</script>

<template>
  <aside
    :class="openState ? 'w-56' : 'w-0'"
    class="h-screen lg:h-[calc(100vh-theme(space.16))] transition-[width] duration-500 fixed top-0 lg:w-56 lg:min-w-56 lg:sticky lg:top-16 overflow-hidden z-20"
  >
  <ul class="menu p-4 min-h-full bg-base-200 text-base-content flex flex-col gap-2">
      <div class="flex lg:hidden justify-end">
        <button class="btn btn-ghost" @click="handleCloseSidebarBtnClick">
          <Icon iconName="x" />
        </button>
      </div>
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