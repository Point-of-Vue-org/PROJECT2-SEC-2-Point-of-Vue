<script setup>
import { ref, onBeforeMount, onMounted } from 'vue'
import { useRouter, RouterLink, useRoute } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import { logout, validateToken } from '../../libs/auth'
import PersonIcon from '@/assets/icons/personFill.svg?raw'
import GearIcon from '@/assets/icons/gearFill.svg?raw'
import BoxArrowLeftIcon from '@/assets/icons/boxArrowLeft.svg?raw'
import Header from '@/components/Header.vue'
import { useUserStore } from '@/stores/user';
import BaseSidebar from '@/components/BaseSidebar.vue'
import { Post } from '../../classes/Post'
import { getPostBy } from '../../libs/postManagement'

const JSON_SERVER_URI = import.meta.env.VITE_SERVER_URI || 'http://localhost:5000'
const router = useRouter()
const route = useRoute()
const toastStore = useToastStore()
const userStore = useUserStore()
const post = ref(new Post())

const existingPostId = route.params.id
const isEditMode = route.query.edit === 'true'

console.log('from: AddOrEditPostView.vue')

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
    // post.value = await getPostBy('id', route.params.id)
    if (isEditMode) {
      console.log('Edit mode yayyy!')
      post.value = await getPostBy('id', existingPostId)
      console.log(post.value.authorId, userStore.userData.id)
      // if (post.value.authorId !== userStore.userData.id) router.replace('/')
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
    <BaseSidebar class="flex-none">
      <template #menu>
        <!-- Sidbar content here -->
      </template>
    </BaseSidebar>
    <section class="flex-auto flex justify-center">
        <!-- Author: {{ author }}
        <br />
        Post: {{ post }} -->
        
    </section>
  </main>
</template>