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
        <div class="h-[8rem] bg-base-200 flex flex-col mt-4 translate-x-[16rem]">
          <div class="text-2xl font-bold">{{ user.nickname }}</div>
          <div class=" opacity-50">{{ '@' + user.username }}</div>
          <div class="flex gap-4">
            <div class="text-sm">{{ postCount }} Posts</div>
            <div class="text-sm">{{ upVoteCount }} Upvotes</div>
          </div>
        </div>
      </div>
      <div class="bg-base-200 rounded-2xl border border-neutral w-full h-80 overflow-hidden flex flex-col">

      </div>
    </section>
  </main>
</template>