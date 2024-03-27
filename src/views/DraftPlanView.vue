<script setup>
import { ref, onBeforeMount, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { logout, validateToken } from '../../libs/userManagement'
import Header from '@/components/Header.vue'
import { useUserStore } from '@/stores/user'
import PlannetSidebar from '@/components/PlannetSidebar.vue'
import { getPlans, getPlansBy } from '../../libs/planManagement'
import Icon from '@/components/Icon.vue'
import PlanContainer from '@/components/PlanContainer.vue'
import PlanCard from '@/components/PlanCard.vue'

const router = useRouter()
const userStore = useUserStore()
const draftPlans = ref([])

onMounted(
  async () => {
    // Fetch posts here
    draftPlans.value = await getPlansBy('userId', userStore.userData.id, 'draft')
    console.log(draftPlans.value)
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
      <li><RouterLink :to="`/profile/${userStore.userData.id}`" class="text-lg"><Icon iconName="person-fill" />Profile</RouterLink></li>
      <li><RouterLink to="/account/profile" class="text-lg"><Icon iconName="gear-fill" />Account Details</RouterLink></li>
      <li><a class="text-lg" @click="handleLogout"><Icon iconName="box-arrow-left" />Logout</a></li>
    </template>
  </Header>
  <main class="flex">
    <PlannetSidebar class="flex-none" />
    
    <section class="flex-auto">
      <div class="flex flex-col items-center">
        <div class="w-fit">
          <div class="h-24 w-full flex justify-end items-center">
            <!-- <RouterLink to="/plan/create" class="btn btn-outline">Add your plan</RouterLink> -->
          </div>
          <PlanContainer>
            <PlanCard v-for="plan in draftPlans" :key="plan.id" :postPlan="plan" />
          </PlanContainer>
        </div>
      </div>
      <div class="h-16"></div>
    </section>
  </main>
</template>