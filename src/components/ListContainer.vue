<script setup>
import { ref } from 'vue'
import ListItem from './ListItem.vue';

const props = defineProps({
  items: {
    type: Array,
    required: true
  }
})

// const dragging = ref(false)
const dragItem = ref(null)
const dragOverElement = ref(null)
const dragOverIndex = ref(null)
const sortableItems = ref(props.items)

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const handleDragStart = (e) => {
  if (e.target.dataset?.itemId === undefined) return
  // dragging.value = true
  dragItem.value = sortableItems.value.find((item) => item.id === e.target.dataset.itemId)
}

const handleDragOver = async (e) => {
  await sleep(50)
  // if (dragging.value === false) return
  e.preventDefault()

  dragOverElement.value = e.target.closest('li')
  dragOverIndex.value = sortableItems.value.findIndex((item) => item.id === dragOverElement.value.dataset.itemId)
  
  if (dragOverIndex.value === sortableItems.value.indexOf(dragItem.value)) return
  ; [sortableItems.value[sortableItems.value.indexOf(dragItem.value)], sortableItems.value[dragOverIndex.value]] = [sortableItems.value[dragOverIndex.value], sortableItems.value[sortableItems.value.indexOf(dragItem.value)]]
}

const handleDragEnd = async () => {
  // if (dragging.value === false) return
  await sleep(50)
  
  // dragging.value = false
  dragItem.value = null 
}

const handleDrop = (e) => {
  e.preventDefault()
}

</script>

<template>
  <ul class="flex flex-col gap-1">
    <ListItem
      v-for="(item, index) in sortableItems"
      :key="index"
      :id="item.id"
      :draggingItemId="dragItem?.id"
      width="40rem"
      contentHeight="10rem"
      @dragstart="handleDragStart"
      @dragend="handleDragEnd"
      @dragover="handleDragOver"
      @drop="handleDrop"
    >
      <template #title>
        {{ item.header }}
      </template>
      <template #content>
        {{ item.content }}
      </template>
    </ListItem>
  </ul>
</template>

<style scoped>

</style>