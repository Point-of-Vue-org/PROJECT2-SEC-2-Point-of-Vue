<script setup>
import { ref, onBeforeMount, onMounted, watch } from 'vue'
import { useRouter, RouterLink, useRoute } from 'vue-router'
import { getUserBy, logout, validateToken } from '../../libs/userManagement'
import Header from '@/components/Header.vue'
import { useUserStore } from '@/stores/user'
import BaseSidebar from '@/components/BaseSidebar.vue'
import { getPlans, getPlansBy } from '../../libs/planManagement'
import Icon from '@/components/Icon.vue'
import PlanContainer from '@/components/PlanContainer.vue'
import PlanCard from '@/components/PlanCard.vue'
import { User } from '../../classes/User'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const user = ref(new User())
const postPlans = ref([])
const postCount = ref(0)
const upVoteCount = ref(0)
const sortBy = ref('latest')
const sortOpen = ref(false)

// onBeforeMount(
//   async () => {
//     const { isTokenValid, userId } = await validateToken()
//     if (isTokenValid) userStore.loadUserData(userId)
//   }
// )

async function fetchProfile() {
  user.value = await getUserBy('id', route.params.id)
  postPlans.value = await getPlansBy('authorId', user.value.id, 'post')
  console.log(postPlans.value)
  postCount.value = postPlans.value.length
  upVoteCount.value = postPlans.value.reduce((acc, plan) => acc + plan.upVote, 0)
}

onMounted(
  async () => {
    // Fetch posts here
    console.log('%cOn mounted', 'color: #f00')
    fetchProfile()
  }
)

const handleLogout = async () => {
  if (window.confirm('Are you sure you want to logout?') === false) return
  await logout(user.value.id)
  localStorage.removeItem('todo_token')
  router.replace('/login')
}

watch(route, () => {
  fetchProfile()
})

</script>

<template>
  <Header>
    <template #menu>
      <li><RouterLink :to="`/profile/${userStore.userData.id}`" class="text-lg"><Icon iconName="person-fill" />Profile</RouterLink></li>
      <li><RouterLink to="/account/profile" class="text-lg"><Icon iconName="gear-fill" />Account Details</RouterLink></li>
      <li><a class="text-lg" @click="handleLogout"><Icon iconName="box-arrow-left" />Logout</a></li>
    </template>
  </Header>
  <main class="flex">
    <BaseSidebar class="flex-none">
      <template #menu>
        <!-- Sidbar content here -->
      </template>
    </BaseSidebar>
    
    <section class="flex-auto p-10 flex flex-col gap-5">
      <div class="bg-base-200 rounded-2xl border border-neutral w-full h-80 overflow-hidden flex flex-col">
        <img
          :src="user?.setting?.avatarUrl"
          alt="avatar"
          class="absolute rounded-full h-52 w-52 object-cover border-8 border-base-200 translate-x-8 translate-y-24"
        />
        <div class="h-[12rem]">
          <img
            :src="user?.setting?.bannerUrl"
            alt="avatar"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="h-[8rem] bg-base-200 flex flex-col gap-4 mt-4 translate-x-[16rem]">
          <div class="flex flex-col">
            <div class="text-2xl font-bold">{{ user.nickname }}</div>
            <div class=" opacity-50">{{ '@' + user.username }}</div>
          </div>
          <div class="flex gap-2">
            <div class="text-sm"><span class="font-bold">{{ postCount }}</span> Posts</div>
            <div class="text-sm"><span class="font-bold text-primary">{{ upVoteCount }}</span> Upvotes</div>
          </div>
        </div>
      </div>
      <nav class="flex items-center gap-4">
        <button class="btn btn-sm border border-neutral">{{ user.nickname }} 's post</button>
        <div class="select-none">
          <span>Sort by </span>
          <span class="dropdown">
            <div tabindex="0" role="button" @click="sortOpen = !sortOpen" class="flex items-center gap-2 text-primary">{{ sortBy }} <Icon iconName="chevron-down" /></div>
            <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 border border-neutral rounded-box w-52">
              <li @click="sortBy = 'latest'" class="hover:bg-neutral cursor-pointer p-2 rounded-md">latest</li>
              <li @click="sortBy = 'oldest'" class="hover:bg-neutral cursor-pointer p-2 rounded-md">oldest</li>
              <li @click="sortBy = 'most upvotes'" class="hover:bg-neutral cursor-pointer p-2 rounded-md">most upvotes</li>
              <li @click="sortBy = 'most comments'" class="hover:bg-neutral cursor-pointer p-2 rounded-md">most comments</li>
            </ul>
          </span>
        </div>
      </nav>
      <div class="bg-base-200 rounded-2xl border border-neutral w-full min-h-[32rem] h-auto overflow-hidden flex flex-col items-center">
        <div class="h-6"></div>
        <PlanContainer>
          <PlanCard
            v-for="plan in postPlans"
            :key="plan.id"
            :planData="plan"
          />
        </PlanContainer>
      </div>
    </section>
  </main>
</template>