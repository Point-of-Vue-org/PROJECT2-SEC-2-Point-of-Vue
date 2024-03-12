<script setup>
import { useRouter, RouterLink, useRoute } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import { fetchTokenById, fetchUserBy, logout } from '../../libs/auth'
import { decrypt } from '../../libs/plannetEncrypt'
import PersonIcon from '@/assets/icons/personFill.svg?raw'
import GearIcon from '@/assets/icons/gearFill.svg?raw'
import BoxArrowLeftIcon from '@/assets/icons/boxArrowLeft.svg?raw'
import Navigation from '@/components/Navigation.vue'
import { useUserStore } from '@/stores/user';

const router = useRouter()
const route = useRoute()
const toastStore = useToastStore()
const userStore = useUserStore()
const secretKey = import.meta.env.VITE_SECRET_KEY || 'secret'

async function validateToken(){
  const decryptedLocalToken = JSON.parse(decrypt(localStorage.getItem('todo_token'), secretKey))
  const actualToken = await fetchTokenById(decryptedLocalToken?.id)

  console.log('localToken', decryptedLocalToken)
  console.log('actualToken', actualToken)

  if (!decryptedLocalToken || !actualToken) {
    console.log('Token not found')
    router.replace('/login')
    toastStore.type = 'error'
    toastStore.msg = 'You need to login first'
    return
  }

  if (actualToken.token === decryptedLocalToken.token) {
    if(actualToken.expired_at - Date.now() < 0) {
      console.log('Token is expired')
      router.replace('/login')
      return
    }
    console.log('Token is valid')
    userStore.saveUser(await fetchUserBy('id', actualToken.id))
  } else {
    console.log('Token is invalid')
    router.replace('/login')
    return
  }
}

validateToken()

const handleLogout = async () => {
  if (window.confirm('Are you sure you want to logout?') === false) return
  await logout(userStore.userData.id)
  localStorage.removeItem('todo_token')
  router.replace('/login')
}

</script>

<template>
  <main class="w-full h-screen">
    <Navigation>
      <template #menu>
        <li><a class="text-lg"><div v-html="PersonIcon" class="w-4 h-4"></div>Profile</a></li>
        <li><RouterLink to="/account/profile" class="text-lg"><div v-html="GearIcon" class="w-4 h-4"></div>Account Details</RouterLink></li>
        <li><a class="text-lg" @click="handleLogout"><div v-html="BoxArrowLeftIcon" class="w-4 h-4"></div>Logout</a></li>
      </template>
    </Navigation>
    <div class="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
      <div class="drawer-content flex flex-col items-center justify-center">
        <!-- Page content here -->
        <label for="my-drawer-2" class="btn btn-primary drawer-button lg:hidden">Open drawer</label>
        
        <div v-if="route.params.category === 'profile'">
          profile
        </div>
        <div v-else-if="route.params.category === 'security'">
          security
        </div>
      </div> 
      <div class="drawer-side">
        <label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay"></label> 
        <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          <!-- Sidebar content here -->
          <li><RouterLink to="/account/profile">Profile</RouterLink></li>
          <li><RouterLink to="/account/security">Security</RouterLink></li>
        </ul>
      
      </div>
    </div>
  </main>
</template>
