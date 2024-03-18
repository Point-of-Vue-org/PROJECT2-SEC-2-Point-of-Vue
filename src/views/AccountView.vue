<script setup>
import { useRouter, RouterLink, useRoute } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import { logout, validateToken } from '../../libs/auth'
import PersonIcon from '@/assets/icons/personFill.svg?raw'
import GearIcon from '@/assets/icons/gearFill.svg?raw'
import BoxArrowLeftIcon from '@/assets/icons/boxArrowLeft.svg?raw'
import Header from '@/components/Header.vue'
import { useUserStore } from '@/stores/user';
import { onBeforeMount } from 'vue'
import AccountProfile from './account/AccountProfile.vue'
import BaseSidebar from '@/components/BaseSidebar.vue'
import SecurityProfile from './account/SecurityProfile.vue'

const router = useRouter()
const route = useRoute()
const toastStore = useToastStore()
const userStore = useUserStore()

onBeforeMount(
  async () => {
    const { isTokenValid, userId } = await validateToken()
    if (!isTokenValid) {
      router.replace('/login')
      toastStore.type = 'error'
      toastStore.msg = 'You need to login first'
    } else {
      userStore.loadUserData(userId)
    }
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
      <li><a class="text-lg"><div v-html="PersonIcon" class="w-4 h-4"></div>Profile</a></li>
      <li><RouterLink to="/account/profile" class="text-lg"><div v-html="GearIcon" class="w-4 h-4"></div>Account Details</RouterLink></li>
      <li><a class="text-lg" @click="handleLogout"><div v-html="BoxArrowLeftIcon" class="w-4 h-4"></div>Logout</a></li>
    </template>
  </Header>
  <main class="flex">
    <BaseSidebar>
      <template #menu>
        <li><RouterLink to="/account/profile">Profile</RouterLink></li>
        <li><RouterLink to="/account/security">Security</RouterLink></li>
      </template>
    </BaseSidebar>
    <section>
      <div v-if="route.params.category === 'profile'">
        profile
        <AccountProfile />
      </div>
      <div v-else-if="route.params.category === 'security'">
        security
        <SecurityProfile/>
      </div>
    </section>
  </main>
</template>
