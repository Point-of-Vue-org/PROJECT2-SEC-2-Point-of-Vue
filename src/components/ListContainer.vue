<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import ListItem from './ListItem.vue';

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  draggable: {
    type: Boolean,
    default: false
  }
})

const dragItem = ref(null)
const dragOverElement = ref(null)
const dragOverIndex = ref(null)
const sortableItems = ref([...props.items])

console.log(sortableItems.value);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const handleDragStart = (e) => {
  if (e.target.dataset?.itemId === undefined) return
  dragItem.value = sortableItems.value.find((item) => item.id === e.target.dataset.itemId)
}

const handleDragOver = async (e) => {
  await sleep(50)
  e.preventDefault()
  
  dragOverElement.value = e.target.closest('li')
  dragOverIndex.value = sortableItems.value.findIndex((item) => item.id === dragOverElement.value.dataset.itemId)
  
  const draggingIndex = sortableItems.value.indexOf(dragItem.value)
  if (dragOverIndex.value === draggingIndex) return

  console.log(dragOverIndex.value, draggingIndex)
  ; [sortableItems.value[draggingIndex], sortableItems.value[dragOverIndex.value]] = [sortableItems.value[dragOverIndex.value], sortableItems.value[draggingIndex]]
}

const handleDragEnd = async () => {
  await sleep(50)
  dragItem.value = null 
}

const handleDrop = (e) => {
  e.preventDefault()
}

watch(sortableItems, (newVal) => {
  console.log(newVal)
}, { immediate: true })

</script>

<template>
  <ul class="flex flex-col gap-1">
    <ListItem
      v-for="(item, index) in sortableItems"
      :key="index"
      :id="item.id"
      :draggable="draggable"
      :draggingItemId="dragItem?.id"
      width="100%"
      contentHeight="10rem"
      @dragstart="handleDragStart"
      @dragend="handleDragEnd"
      @dragover="handleDragOver"
      @drop="handleDrop"
    >
      <template #title>
        {{ 'Day ' + (index + 1) + ' - ' + item.title}}
      </template>
      <template #content>
        <div v-for="(plan, index) in item.plans" :key="index">
          {{ plan.header }}<br />
          {{ plan.description }}
        </div>
      </template>
    </ListItem>
  </ul>
</template>