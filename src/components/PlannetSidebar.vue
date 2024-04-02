<script setup>
import { RouterLink } from 'vue-router';
import BaseSidebar from './BaseSidebar.vue';
import Icon from './Icon.vue';
import SearchBox from './SearchBox.vue';

defineProps({
  openState: {
    type: Boolean
  }
})

const emits = defineEmits(['submitSearch'])

const handleSubmitSearch = (value) => {
  emits('submitSearch', value)
}

</script>

<template>
  <BaseSidebar :openState="openState">
    <template #menu>
      <!-- Sidbar content here -->
      <slot>
        <div class="block lg:hidden">
          <SearchBox @submitSearch="handleSubmitSearch" />
        </div>
        <div class="divider m-0 lg:hidden"></div>
        <RouterLink to="/plan/create" class="btn btn-outline flex-nowrap">
          <Icon iconName="pen-fill" />
          <span class="whitespace-nowrap">Write your plan</span>
        </RouterLink>
        <div class="divider m-0"></div>
        <RouterLink to="/" class="btn justify-start" exact-active-class="btn-accent text-base-100">
          <Icon iconName="calendar-week-fill" />
          <span class="whitespace-nowrap">Plan feeds</span>
        </RouterLink>
        <RouterLink to="/plans" class="btn justify-start" exact-active-class="btn-accent text-base-100">
          <Icon iconName="journal-bookmark-fill" />
          <span class="whitespace-nowrap">My Drafts</span>
        </RouterLink>
        <RouterLink to="/active-plans" class="btn justify-start" exact-active-class="btn-accent text-base-100">
          <Icon iconName="journal-bookmark-fill" />
          <span class="whitespace-nowrap">My Active Plans</span>
        </RouterLink>
      </slot>
    </template>
  </BaseSidebar>
</template>

<style scoped>

</style>