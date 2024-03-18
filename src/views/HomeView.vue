<script setup>
import { ref, onBeforeMount, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import { logout, validateToken } from '../../libs/auth'
import PersonIcon from '@/assets/icons/personFill.svg?raw'
import GearIcon from '@/assets/icons/gearFill.svg?raw'
import BoxArrowLeftIcon from '@/assets/icons/boxArrowLeft.svg?raw'
import Header from '@/components/Header.vue'
import { useUserStore } from '@/stores/user';
import BaseSidebar from '@/components/BaseSidebar.vue'
import PostCard from '@/components/PostCard.vue'
import PostContainer from '@/components/PostContainer.vue'

const JSON_SERVER_URI = import.meta.env.VITE_SERVER_URI || 'http://localhost:5000'
const router = useRouter()
const toastStore = useToastStore()
const userStore = useUserStore()
const posts = ref([])

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

onMounted(
  async () => {
    // Fetch posts here
    const res = await fetch(`${JSON_SERVER_URI}/posts`)
    posts.value = await res.json()
    console.log(posts.value)
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
    <BaseSidebar class="flex-none">
      <template #menu>
        <!-- Sidbar content here -->
      </template>
    </BaseSidebar>
    <section class="flex-auto">
      <div class="h-16"></div>
      <PostContainer>
        <PostCard v-for="post in posts" :postData="post" />
      </PostContainer>
      <div class="h-16"></div>
    </section>
  </main>
</template>