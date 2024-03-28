<script setup>
import { RouterLink } from 'vue-router';
import BaseSidebar from './BaseSidebar.vue';
import Icon from './Icon.vue';

defineProps({
  openState: {
    type: Boolean
  }
})
</script>

<template>
  <BaseSidebar :openState="openState">
    <template #menu>
      <!-- Sidbar content here -->
      
      <RouterLink to="/plan/create" class="btn btn-outline flex-nowrap">
        <Icon iconName="pen-fill" />
        <span class="whitespace-nowrap">Write your plan</span>
      </RouterLink>
      <div class="divider"></div>
      <RouterLink to="/" class="btn justify-start" exact-active-class="btn-accent">
        <Icon iconName="calendar-week-fill" />
        <span class="whitespace-nowrap">Plan feeds</span>
      </RouterLink>
      <RouterLink to="/plans" class="btn justify-start" exact-active-class="btn-accent">
        <Icon iconName="journal-bookmark-fill" />
        <span class="whitespace-nowrap">My Drafts</span>
      </RouterLink>
    </template>
  </BaseSidebar>
</template>

<style scoped>

</style>