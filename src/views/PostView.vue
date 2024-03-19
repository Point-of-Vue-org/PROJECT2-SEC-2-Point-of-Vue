<script setup>
import { ref, onBeforeMount, onMounted, reactive} from 'vue'
import { useRouter, RouterLink, useRoute } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import { getUserBy, logout, validateToken } from '../../libs/userManagement'
import Header from '@/components/Header.vue'
import { useUserStore } from '@/stores/user';
import BaseSidebar from '@/components/BaseSidebar.vue'
import { getPostBy } from '../../libs/postManagement.js'
import ListContainer from '@/components/ListContainer.vue'
import Icon from '@/components/Icon.vue'

// const JSON_SERVER_URI = import.meta.env.VITE_SERVER_URI || 'http://localhost:5000'
const router = useRouter()
const route = useRoute()
const toastStore = useToastStore()
const userStore = useUserStore()
const post = ref({})
const author = ref({})

console.log('from: PostView.vue')

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
    post.value = await getPostBy('id', route.params.id)
    console.log(post.value);
    author.value = await getUserBy('id', post.value.authorId)
    console.log('author: ', author.value);
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
        <!-- Author: {{ author }}
        <br />
        Post: {{ post }} -->
        <div class="w-[85%]">
            <div class="flex gap-4 items-center">
              <img
                :src="author?.setting?.avatarUrl"
                alt="author image"
                class="w-8 h-8 rounded-full object-cover"
              />
              <div class="font-helvetica font-semibold opacity-60">{{ author?.username }}</div>
            </div>
            <div class="text-3xl font-bold font-helvetica">
                {{ post.title }}
            </div>
            <div class="font-helvetica">{{ post?.description }}</div>
            <ListContainer :items="post?.days" />
        </div>
    </section>
  </main>
</template>../../libs/userManagement