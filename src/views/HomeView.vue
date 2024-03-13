<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import { fetchTokenById, fetchUserBy, logout } from '../../libs/auth'
import PersonIcon from '@/assets/icons/personFill.svg?raw'
import GearIcon from '@/assets/icons/gearFill.svg?raw'
import BoxArrowLeftIcon from '@/assets/icons/boxArrowLeft.svg?raw'
import SearchIcon from '@/assets/icons/search.svg?raw'
import { decrypt } from '../../libs/plannetEncrypt'
import Logo from '@/components/Logo.vue'
import UserProfilePlaceholder from '@/components/UserProfilePlaceholder.vue'
import Card from '../components/Card.vue'

const router = useRouter()
const toastStore = useToastStore()
const secretKey = import.meta.env.VITE_SECRET_KEY || 'secret'
const user = ref(null)

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
    user.value = await fetchUserBy('id', actualToken.id)
    delete user.value.password
  } else {
    console.log('Token is invalid')
    router.replace('/login')
    return
  }
}

validateToken()

const handleLogout = async () => {
  if (window.confirm('Are you sure you want to logout?') === false) return
  await logout(user.value.id)
  localStorage.removeItem('todo_token')
  router.replace('/login')
}

</script>

<template>
  <main class="w-full h-screen">
    <div class="navbar bg-base-200">
      <div class="flex-none">
        <a class="btn btn-ghost text-xl">
          <span class="text-primary">
            <Logo size="2rem" color="currentColor" />
          </span>
          <span class="text-lg font-bold">Plannet</span>
        </a>
      </div>
      <div class="flex-1 gap-2 flex justify-center">
        <div class="form-control">
          <div v-html="SearchIcon" class="w-4 h-4 absolute translate-x-5 translate-y-4 pointer-events-none"></div>
          <input type="text" placeholder="Search" class="pl-12 input input-bordered min-w-96 md:w-auto rounded-xl" />
        </div>
      </div>
      <div class="flex-none dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
          <div class="w-10 rounded-xl">
            <UserProfilePlaceholder
              color="#ff5500"
              bgcolor="#f0f0f0"
              size="100%"
            />
          </div>
        </div>
        <ul tabindex="0" class="mt-3 z-[1] shadow menu menu-sm p-0 overflow-hidden dropdown-content bg-base-100 border-2 dark:border-neutral rounded-box w-72">
          <div class="w-full h-24 mb-2 relative">
            <div class="w-full h-full mb-2 absolute border-4 border-base-100 bg-neutral rounded-2xl">
              <!-- <img
                alt="Tailwind CSS Navbar component"
                src="https://images.unsplash.com/photo-1682687980961-78fa83781450?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                class="w-full h-full object-cover"
              /> -->
            </div>
            <div class="avatar absolute">
              <div class="w-24 rounded-2xl border-4 border-base-100">
                <UserProfilePlaceholder
                  color="#ff5500"
                  bgcolor="#f0f0f0"
                  size="100%"
                />
              </div>
            </div>
          </div>
          <div class="mx-2 p-3 border-b-2 border-neutral">
            <div class="font-bold text-xl text-neutral dark:text-white">{{ user?.username }}</div>
            <div class="text-sm">@{{ user?.username }}</div>
          </div>
          <div class="m-2">
            <li><a class="text-lg"><div v-html="PersonIcon" class="w-4 h-4"></div>Profile</a></li>
            <li><a class="text-lg"><div v-html="GearIcon" class="w-4 h-4"></div>Settings</a></li>
            <li><a class="text-lg" @click="handleLogout"><div v-html="BoxArrowLeftIcon" class="w-4 h-4"></div>Logout</a></li>
          </div>
        </ul>
      </div>
    </div>
    <Card/>
  </main>
</template>
