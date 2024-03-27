<script setup>
import { RouterLink } from 'vue-router';
import BaseSidebar from './BaseSidebar.vue';
import Icon from './Icon.vue';
</script>

<template>
  <BaseSidebar>
    <template #menu>
      <!-- Sidbar content here -->
      <RouterLink to="/plan/create" class="btn btn-outline">
        <Icon iconName="pen-fill" />
        <span>Write your plan</span>
      </RouterLink>
      <div class="divider"></div>
      <RouterLink to="/" class="btn justify-start" exact-active-class="btn-accent">
        <Icon iconName="calendar-week-fill" />
        <span>Plan feeds</span>
      </RouterLink>
      <RouterLink to="/plans" class="btn justify-start" exact-active-class="btn-accent">
        <Icon iconName="calendar-week-fill" />
        <span>My Drafts</span>
      </RouterLink>
    </template>
  </BaseSidebar>
</template>

<style scoped>

</style>