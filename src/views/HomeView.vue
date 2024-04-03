<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { getPlans } from '../../libs/planManagement'
import PlanContainer from '@/components/PlanContainer.vue'
import PlanCard from '@/components/PlanCard.vue'
import PlannetLayout from '@/components/PlannetLayout.vue'
import SortMethodSelector from '@/components/SortMethodSelector.vue'
import { sortObject } from '../../libs/utils'
import { useRoute, useRouter } from 'vue-router'
import { getUsers } from '../../libs/userManagement'
import Icon from '@/components/Icon.vue'
import UserCard from '@/components/UserCard.vue'
const route = useRoute()
const router = useRouter()
const planDatas = ref([])
const sortBy = ref(['postDate', 'desc'])
const users = ref([])
const sortAblePostPlans = computed(() => {
  return sortObject(planDatas.value, sortBy.value[0], sortBy.value[1])
})

onMounted(
  async () => {
    // Fetch posts here
    planDatas.value = await getPlans('post')
    console.log(planDatas.value)
  }
)

watch(
  () => route.query.search,
  async (value) => {
    if(value){
      if(/^@/.test(value)){
        console.log(value.slice(1))
        const allUsers = await getUsers(true)
        const searchPattern = new RegExp(value.slice(1), 'i')
        users.value = allUsers.filter(user => {
          const temp = searchPattern.test(user.username)
          return temp
        })
        console.log(users.value)
      }
      else{
      console.log("Hi");
      const allPostPlans = await getPlans('post')
      const searchPattern = new RegExp(route.query.search, 'i')
      planDatas.value = allPostPlans.filter(planData => {
      const temp = searchPattern.test(planData.title)
        console.log(temp);
        return temp
      })
      }
      
    } else {
      router.push('/')
      users.value = []
      planDatas.value = await getPlans('post')
    }
  },
  { immediate: true }
)
</script>

<template>
  <PlannetLayout>
    <div class="flex flex-col items-center w-full">
      <div>
        <!-- Search: {{ route.query?.search }} -->
        <div class="h-16"></div>
        <div v-if="route.query.search" class="flex items-center bg-base-200 w-fit py-4 pl-3 pr-10 rounded-2xl">
          <div class="w-14 grid place-items-center">
            <Icon iconName="search" scale="2" />
          </div>
          <div>
            <div class="text-xl">Search keywords: "{{ route.query.search }}"</div>
            <div class="text-secondary">{{ planDatas.length }} plan{{ planDatas.length > 1 ? 's' : '' }} found</div>
          </div>
        </div>
        <div v-else class="flex items-center gap-2">
          <Icon iconName="globe" scale="2" size="2rem" />
          <div class="text-2xl font-bold">Plannet feeds</div>
        </div>
        <div class="h-16 w-full flex justify-start items-center">
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
        <PlanContainer v-if="users.length === 0" pageName="homeview">
          <PlanCard v-for="plan in sortAblePostPlans" :key="plan.id" :planData="plan" />
        </PlanContainer>
        <div v-else class="flex flex-col gap-4">
          <UserCard v-for="user in users" :key="user.id" :userData="user" />
        </div>
      </div>
    </div>
    <div class="h-16"></div>
  </PlannetLayout>
</template>