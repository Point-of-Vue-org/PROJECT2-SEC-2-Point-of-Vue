<script setup>
import { RouterLink } from 'vue-router';
import BaseSidebar from './BaseSidebar.vue';
import Icon from './Icon.vue';
import SearchBox from './SearchBox.vue';
import { getPlansBy } from '../../libs/planManagement';
import { useUserStore } from '@/stores/user';
import { onMounted, ref } from 'vue';

defineProps({
  openState: {
    type: Boolean
  }
})

const emits = defineEmits(['submitSearch'])

const userStore = useUserStore()
let activePlanCount = ref(0)

onMounted(async () => {
  const activePlans = await getPlansBy('userId', userStore.userData.id, 'active')
  activePlanCount.value = activePlans.length
})

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
        <RouterLink to="/draft-plan/create" class="btn btn-outline flex-nowrap">
          <Icon iconName="pen-fill" />
          <span class="whitespace-nowrap">Write your plan</span>
        </RouterLink>
        <div class="divider m-0"></div>
        <RouterLink to="/" class="btn justify-start flex-nowrap" exact-active-class="btn-accent text-base-100">
          <Icon iconName="globe" />
          <span class="whitespace-nowrap">Plannet feed</span>
        </RouterLink>
        <RouterLink to="/active-plan" class="btn justify-start flex-nowrap" exact-active-class="btn-accent text-base-100">
          <Icon iconName="check2-square" />
          <span class="whitespace-nowrap">My Active Plans ({{ activePlanCount }})</span>
        </RouterLink>
        <div class="divider m-0"></div>
        <RouterLink to="/archive" class="btn justify-start" exact-active-class="btn-accent text-base-100">
          <Icon iconName="archive-fill" />
          <span class="whitespace-nowrap">Archive</span>
        </RouterLink>
      </slot>
    </template>
  </BaseSidebar>
</template>

<style scoped>

</style>