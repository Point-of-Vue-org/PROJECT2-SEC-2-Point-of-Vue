<script setup>
import { ref, onBeforeMount, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { logout, validateToken } from '../../libs/userManagement'
import Header from '@/components/Header.vue'
import { useUserStore } from '@/stores/user'
import BaseSidebar from '@/components/BaseSidebar.vue'
import { getPlans } from '../../libs/planManagement'
import Icon from '@/components/Icon.vue'
import PlanContainer from '@/components/PlanContainer.vue'
import PlanCard from '@/components/PlanCard.vue'

const router = useRouter()
const userStore = useUserStore()
const postPlans = ref([])

onBeforeMount(
  async () => {
    const { isTokenValid, userId } = await validateToken()
    if (isTokenValid) userStore.loadUserData(userId)
  }
)

onMounted(
  async () => {
    // Fetch posts here
    postPlans.value = await getPlans('post')
    console.log(postPlans.value)
  }
)

const handleLogout = async () => {
  if (window.confirm('Are you sure you want to logout?') === false) return
  await logout(userStore.userData.id)
  localStorage.removeItem('todo_token')
  router.replace('/login')
}

</script>

<template>
  <Header>
    <template #menu>
      <li><a class="text-lg"><Icon iconName="person-fill" />Profile</a></li>
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
    
    <section class="flex-auto">
      <div class="flex flex-col items-center">
        <div class="w-fit">
          <div class="h-24 w-full flex justify-end items-center">
            <RouterLink to="/post/create" class="btn btn-outline">Add your plan</RouterLink>
          </div>
          <PlanContainer>
            <PlanCard v-for="plan in postPlans" :planData="plan" />
          </PlanContainer>
        </div>
      </div>
      <div class="h-16"></div>
    </section>
  </main>
</template>