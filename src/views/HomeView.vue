<script setup>
import { ref, onMounted, computed } from 'vue'
import { getPlans } from '../../libs/planManagement'
import PlanContainer from '@/components/PlanContainer.vue'
import PlanCard from '@/components/PlanCard.vue'
import PlannetLayout from '@/components/PlannetLayout.vue'
import SortMethodSelector from '@/components/SortMethodSelector.vue'
import { sortObject } from '../../libs/utils'

const postPlans = ref([])
const sortBy = ref(['postDate', 'desc'])
const sortAblePostPlans = computed(() => {
  return sortObject(postPlans.value, sortBy.value[0], sortBy.value[1])
})

onMounted(
  async () => {
    // Fetch posts here
    postPlans.value = await getPlans('post')
    console.log(postPlans.value)
  }
)

</script>

<template>
  <PlannetLayout>
    <div class="flex flex-col items-center">
      <div class="w-fit">
        <div class="h-24 w-full flex justify-start items-center">
          <!-- <RouterLink to="/plan/create" class="btn btn-outline">Add your plan</RouterLink> -->
          <SortMethodSelector
            :sortOptions="[
              ['Latest', 'postDate', 'desc'],
              ['Oldest', 'postDate', 'asc'],
              ['Most upvoted', 'upVote', 'desc'],
              ['Least upvoted', 'upVote', 'asc'],
              ['Name A-Z', 'title', 'asc'],
              ['Name Z-A', 'title', 'desc']
            ]"
            @sortOptionSelect="sortBy = $event"
          />
        </div>
        <PlanContainer>
          <PlanCard v-for="plan in sortAblePostPlans" :key="plan.id" :postPlan="plan" />
        </PlanContainer>
      </div>
    </div>
    <div class="h-16"></div>
  </PlannetLayout>
</template>