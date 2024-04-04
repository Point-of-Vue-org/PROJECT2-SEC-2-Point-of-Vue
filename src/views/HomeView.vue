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
const postPlans = ref([])
const sortPostBy = ref(['postDate', 'desc'])
const sortAblePostPlans = computed(() => {
  return sortObject(postPlans.value, sortPostBy.value[0], sortPostBy.value[1])
})
const users = ref([])
const sortUserBy = ref(['upVotes', 'desc'])
const sortAbleUsers = computed(() => {
  return sortObject(users.value, sortUserBy.value[0], sortUserBy.value[1])
})

const searchTerms = computed(() => route.query.search)
const searchMode = computed(() => /^@/.test(searchTerms.value) ? 'user' : 'post')

onMounted(
  async () => {
    postPlans.value = await getPlans('post')
  }
)

watch(
  searchTerms,
  async (value) => {
    if(value){
      if(searchMode.value === 'user'){
        const allUsers = await getUsers()
        for (const foundedUser of allUsers){
          await foundedUser.computeDerivedData()
        }
        const searchPattern = new RegExp(value.slice(1), 'i')
        users.value = allUsers.filter(user => searchPattern.test(user.username))
      } else if (searchMode.value === 'post'){
        const allPostPlans = await getPlans('post')
        const searchPattern = new RegExp(route.query.search, 'i')
        postPlans.value = allPostPlans.filter(planData => {
        const temp = searchPattern.test(planData.title)
          return temp
        })
      }
    } else {
      router.push('/')
      users.value = []
      postPlans.value = await getPlans('post')
    }
  },
  { immediate: true }
)
</script>

<template>
  <PlannetLayout>
    <div class="flex flex-col items-center w-full">
      <div class="w-[90%]">
        <!-- Search: {{ route.query?.search }} -->
        <div class="h-16"></div>
        <div v-if="route.query.search" class="flex items-center bg-base-200 w-fit py-4 pl-3 pr-10 rounded-2xl">
          <div class="w-14 grid place-items-center">
            <Icon iconName="search" scale="2" />
          </div>
          <div>
            <div class="text-xl">Search <span class="text-primary">{{ searchMode }}</span> by keywords: "{{ route.query.search }}"</div>
            <div v-show="searchMode === 'post'" class="text-secondary">{{ postPlans.length }} plan{{ postPlans.length > 1 ? 's' : '' }} found</div>
            <div v-show="searchMode === 'user'" class="text-secondary">{{ users.length }} user{{ users.length > 1 ? 's' : '' }} found</div>
          </div>
        </div>
        <div v-else class="flex items-center gap-2">
          <Icon iconName="globe" scale="2" size="2rem" />
          <div class="text-2xl font-bold">Plannet feeds</div>
        </div>
        <div class="h-16 w-full flex justify-start items-center">
          <!-- <RouterLink to="/draft-plan/create" class="btn btn-outline">Add your plan</RouterLink> -->
          <SortMethodSelector
            v-if="searchMode === 'post' && postPlans.length > 0"
            :sortOptions="[
              ['Latest', 'postDate', 'desc'],
              ['Oldest', 'postDate', 'asc'],
              ['Most upvoted', 'upVote', 'desc'],
              ['Least upvoted', 'upVote', 'asc'],
              ['Name A-Z', 'title', 'asc'],
              ['Name Z-A', 'title', 'desc']
            ]"
            @sortOptionSelect="sortPostBy = $event"
          />
          <SortMethodSelector
            v-if="searchMode === 'user' && users.length > 0"
            :sortOptions="[
              ['Most upvoted', 'upVotes', 'desc'],
              ['Least upvoted', 'upVotes', 'asc'],
              ['Username A-Z', 'username', 'asc'],
              ['Username Z-A', 'username', 'desc'],
              ['Display name A-Z', 'nickname', 'asc'],
              ['Display name Z-A', 'nickname', 'desc']
            ]"
            @sortOptionSelect="sortUserBy = $event"
          />
        </div>
        <PlanContainer v-if="searchMode === 'post' && postPlans.length > 0">
          <PlanCard v-for="plan in sortAblePostPlans" :key="plan.id" :planData="plan" />
        </PlanContainer>
        <div v-else-if="searchMode=== 'user' && users.length > 0" class="flex flex-col w-full gap-4">
          <UserCard v-for="user in sortAbleUsers" :key="user.id" :userData="user" />
        </div>
        <div v-else class="flex flex-col items-center gap-4">
          <div class="text-2xl font-bold">No <span class="text-primary">{{ searchMode }}</span> found</div>
          <div class="text-secondary">Try another keyword</div>
        </div>
      </div>
      <div class="h-16"></div>
    </div>
  </PlannetLayout>
</template>