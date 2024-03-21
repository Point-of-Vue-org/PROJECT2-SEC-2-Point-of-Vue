<script setup>
import { ref, onBeforeMount, onMounted, watch} from 'vue'
import { useRouter, RouterLink, useRoute } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import { getUserBy, logout, validateToken } from '../../libs/userManagement'
import Header from '@/components/Header.vue'
import { useUserStore } from '@/stores/user';
import BaseSidebar from '@/components/BaseSidebar.vue'
import { getPostBy } from '../../libs/postManagement.js'
import ListContainer from '@/components/ListContainer.vue'
import Icon from '@/components/Icon.vue'
import { Post } from '../../classes/Post'
import CommentCard from '@/components/CommentCard.vue'

const isLoading = ref(false)
const router = useRouter()
const route = useRoute()
const toastStore = useToastStore()
const userStore = useUserStore()
const post = ref(new Post())
const author = ref({})
// const comments = ref([])

onBeforeMount(
  async () => {
    isLoading.value = true
    try {
      const { isTokenValid, userId } = await validateToken()
      if (isTokenValid) userStore.loadUserData(userId)

    } catch (error) {
      console.error('error', error)
      toastStore.type = 'error'
      toastStore.msg = 'An error occured'
    } finally {
      isLoading.value = false
    }
  }
)

async function fetchData() {
  isLoading.value = true
  try {
    post.value = await getPostBy('id', route.params.id)
    author.value = await getUserBy('id', post.value.authorId)
    // comments.value.push(
    //   ...post.value.comments.map(
    //     async (comment) => {
    //       const user = await getUserBy('id', comment.userId)
    //       console.log(user)
    //       return {
    //         ...comment,
    //         user
    //       }
    //     }
    //   )
    // )
  } catch (error) {
    console.error('error', error)
    toastStore.type = 'error'
    toastStore.msg = 'An error occured'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchData)

const handleLogout = async () => {
  if (window.confirm('Are you sure you want to logout?') === false) return
  await logout(userStore.userData.id)
  localStorage.removeItem('todo_token')
  router.replace('/login')
}

watch(() => post.value, (newVal, oldVal) => {
  console.log('newVal', newVal)
  console.log('oldVal', oldVal)
})

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
        <div class="w-[85%] mt-12">
          <div class="flex gap-4 items-center my-4">
            <img
              v-if="!isLoading && author?.setting?.avatarUrl"
              :src="author.setting.avatarUrl"
              alt="author image"
              class="w-10 h-10 rounded-full object-cover"
            />
            <div v-else class="skeleton w-10 h-10"></div>
            <div class="flex flex-col gap-0.5">
              <div v-if="!isLoading && author.nickname" class="font-helvetica font-semibold">{{ author.nickname }}</div>
              <div v-else class="skeleton h-6 w-20"></div>
              <div v-if="!isLoading && author.username" class="text-sm font-helvetica opacity-60">{{ '@' + author.username }}</div>
              <div v-else class="skeleton h-4 w-20"></div>
            </div>
          </div>
          <div class="flex flex-col gap-3 mb-10">
            <div v-if="!isLoading" class="text-3xl font-bold font-helvetica">{{ post.title }}</div>
            <div v-else class="skeleton h-10 w-[32rem] max-w-full"></div>
            <div v-if="!isLoading" class="font-helvetica opacity-70">{{ post?.description }}</div>
            <div v-else class="skeleton h-6 w-[20rem] max-w-full"></div>
          </div>
          <ListContainer v-if="!isLoading && post.days.length > 0" :items="post.getDailyPlan()" />
          <div v-else class="flex flex-col gap-2 mb-16">
            <div class="skeleton h-16 w-full"></div>
            <div class="skeleton h-16 w-full"></div>
            <div class="skeleton h-16 w-full"></div>
          </div>
          <div class="divider"></div>
          <div class="my-4">Comments</div>
          <div v-if="!isLoading" class="flex flex-col gap-2 mb-16">
            <CommentCard v-for="(comment, index) in post.getComments()" :key="index" :comment="comment" />
          </div>
          <div v-else class="flex flex-col gap-2 mb-16">
            <div class="skeleton h-16 w-full"></div>
            <div class="skeleton h-16 w-full"></div>
            <div class="skeleton h-16 w-full"></div>
          </div>
        </div>
    </section>
  </main>
</template>