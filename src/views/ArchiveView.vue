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

const page = ref('draft')
const userStore = useUserStore()
const draftPlans = ref([])
const sortDraftPlansBy = ref(['updatedAt', 'desc'])
const sortAbleDraftPlans = computed(() => {
  return sortObject(draftPlans.value, sortDraftPlansBy.value[0], sortDraftPlansBy.value[1])
})
const postPlans = ref([])
const sortPostPlansBy = ref(['postDate', 'desc'])
const sortAblePostPlans = computed(() => {
  return sortObject(postPlans.value, sortPostPlansBy.value[0], sortPostPlansBy.value[1])
})

onMounted(
  async () => {
    // Fetch posts here
    draftPlans.value = await getPlansBy('userId', userStore.userData.id, 'draft')
    console.log(draftPlans.value)
    postPlans.value = await getPlansBy('authorId', userStore.userData.id, 'post')
    console.log(postPlans.value)
  }
)
</script>

<template>
  <PlannetLayout>
    <div class="flex flex-col items-center w-full">
      <div class="w-[90%]">
        <div class="h-16"></div>
        <div class="flex items-center gap-2">
          <Icon iconName="archive-fill" scale="2" size="2rem" />
          <div class="text-2xl font-bold">Archive</div>
        </div>
        <div class="flex gap-4 mt-6">
          <button @click="page = 'draft'" :class="{ 'bg-base-200': page === 'draft' }" class="btn">
            <Icon iconName="journal-bookmark-fill" />
            <div>My drafts ({{ draftPlans.length }})</div>
          </button>
          <button @click="page = 'post'" :class="{ 'bg-base-200': page === 'draft' }" class="btn">
            <Icon iconName="journal-bookmark-fill" />
            <div>My post ({{ postPlans.length }})</div>
          </button>
        </div>
        <div class="h-16 w-full flex justify-start items-center">
          <!-- <RouterLink to="/draft-plan/create" class="btn btn-outline">Add your plan</RouterLink> -->
          <SortMethodSelector
            v-show="page === 'draft'"
            :sortOptions="[
              ['Latest update', 'updatedAt', 'desc'],
              ['Oldest update', 'updatedAt', 'asc'],
              ['Latest create', 'createdAt', 'desc'],
              ['Oldest create', 'createdAt', 'asc'],
              ['Name A-Z', 'title', 'asc'],
              ['Name Z-A', 'title', 'desc']
            ]"
            @sortOptionSelect="sortDraftPlansBy = $event"
          />
          <SortMethodSelector
            v-show="page === 'post'"
            :sortOptions="[
              ['Latest post', 'postDate', 'desc'],
              ['Oldest post', 'postDate', 'asc'],
              ['Name A-Z', 'title', 'asc'],
              ['Name Z-A', 'title', 'desc']
            ]"
            @sortOptionSelect="sortPostPlansBy = $event"
          />
        </div>
        <PlanContainer pageName="homeview">
          <PlanCard v-for="plan in page === 'draft' ? sortAbleDraftPlans : sortAblePostPlans" :key="plan.id" :planData="plan" />
        </PlanContainer>
      </div>
    </div>
    <div class="h-16"></div>
  </PlannetLayout>
</template>