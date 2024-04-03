<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { getPlansBy } from '../../libs/planManagement'
import PlanContainer from '@/components/PlanContainer.vue'
import PlanCard from '@/components/PlanCard.vue'
import PlannetLayout from '@/components/PlannetLayout.vue'
import Icon from '@/components/Icon.vue'
import SortMethodSelector from '@/components/SortMethodSelector.vue'
import { sortObject } from '../../libs/utils'

const userStore = useUserStore()
const activePlans = ref([])
const sortBy = ref(['updatedAt', 'desc'])
const sortAbleDraftPlans = computed(() => {
  return sortObject(activePlans.value, sortBy.value[0], sortBy.value[1])
})

onMounted(
  async () => {
    // Fetch posts here
    activePlans.value = await getPlansBy('userId', userStore.userData.id, 'active')
    console.log(activePlans.value)
  }
)
</script>

<template>
  <PlannetLayout>
    <div class="flex flex-col items-center w-full">
      <div class="w-[90%]">
        <div class="h-16"></div>
        <div class="flex items-center gap-2">
          <Icon iconName="globe" scale="2" size="2rem" />
          <div class="text-2xl font-bold">Plannet feeds</div>
        </div>
        <div class="h-16 w-full flex justify-start items-center">
          <!-- <RouterLink to="/plan/create" class="btn btn-outline">Add your plan</RouterLink> -->
          <SortMethodSelector
            :sortOptions="[
              ['Latest update', 'updatedAt', 'desc'],
              ['Oldest update', 'updatedAt', 'asc'],
              ['Latest create', 'createdAt', 'desc'],
              ['Oldest create', 'createdAt', 'asc'],
              ['Name A-Z', 'title', 'asc'],
              ['Name Z-A', 'title', 'desc']
            ]"
            @sortOptionSelect="sortBy = $event"
          />
        </div>
        <PlanContainer>
          <PlanCard v-for="plan in sortAbleDraftPlans" :key="plan.id" :planData="plan" />
        </PlanContainer>
      </div>
    </div>
    <div class="h-16"></div>
  </PlannetLayout>
</template>