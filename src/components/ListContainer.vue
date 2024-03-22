<script setup>
import { ref, watch } from 'vue'
import ListItem from './ListItem.vue';

const props = defineProps({
  items: {
    type: Array,
    required: true
  }
})

const sortableItems = ref([...props.items])

</script>

<template>
  <ul class="flex flex-col gap-1">
    <ListItem
      v-for="(item, index) in sortableItems"
      :key="index"
      width="100%"
      contentHeight="10rem"
    >
      <template #title>
        {{ 'Day ' + (index + 1) + ' - ' + item.title}}
      </template>
      <template #content>
        <div v-for="(plan, index) in item.hourlyTasks" :key="index">
          {{ plan.header }}<br />
          {{ plan.description }}
        </div>
      </template>
    </ListItem>
  </ul>
</template>