<script setup>
import { ref, onMounted } from 'vue'
import { getPlans } from '../../libs/planManagement'
import PlanContainer from '@/components/PlanContainer.vue'
import PlanCard from '@/components/PlanCard.vue'
import PlannetLayout from '@/components/PlannetLayout.vue'

const postPlans = ref([])
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
        <div class="h-24 w-full flex justify-end items-center">
          <!-- <RouterLink to="/plan/create" class="btn btn-outline">Add your plan</RouterLink> -->
        </div>
        <PlanContainer>
          <PlanCard v-for="plan in postPlans" :key="plan.id" :postPlan="plan" />
        </PlanContainer>
      </div>
    </div>
    <div class="h-16"></div>
  </PlannetLayout>
</template>