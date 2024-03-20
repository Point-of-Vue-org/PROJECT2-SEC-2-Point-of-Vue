<script setup>
import { ref, onBeforeMount, onMounted } from 'vue'
import { useRouter, RouterLink, useRoute } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import { logout, validateToken } from '../../libs/userManagement'
import Header from '@/components/Header.vue'
import { useUserStore } from '@/stores/user';
import BaseSidebar from '@/components/BaseSidebar.vue'
import { Post } from '../../classes/Post'
import { getPostBy } from '../../libs/postManagement'

// const JSON_SERVER_URI = import.meta.env.VITE_SERVER_URI || 'http://localhost:5000'
const router = useRouter()
const route = useRoute()
const toastStore = useToastStore()
const userStore = useUserStore()
const post = ref(new Post())

const existingPostId = route.params.id
const isEditMode = route.query.edit === 'true'

onBeforeMount(
  async () => {
    const { isTokenValid, userId } = await validateToken()
    if (isTokenValid) userStore.loadUserData(userId)
  }
)

onMounted(
  async () => {
    // Fetch posts here
    // post.value = await getPostBy('id', route.params.id)
    if (isEditMode) {
      post.value = await getPostBy('id', existingPostId)
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
    <section class="flex-auto flex justify-center">
      <div class="w-[85%]">
        <input
          v-model="post.title"
          type="text"
          placeholder="Title here"
          class="text-7xl bg-transparent focus:outline-none w-full p-2 placeholder:opacity-50"
        />
        <textarea
          v-model="post.description"
          placeholder="Description here"
          class="text-2xl bg-transparent focus:outline-none w-full p-2 placeholder:opacity-50"
        ></textarea>
      </div>
    </section>
  </main>
</template>