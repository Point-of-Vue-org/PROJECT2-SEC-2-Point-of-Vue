<script setup>
import { ref, onBeforeMount, onMounted, watch} from 'vue'
import { useRouter, RouterLink, useRoute } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import { getUserBy, logout, validateToken } from '../../libs/userManagement'
import Header from '@/components/Header.vue'
import { useUserStore } from '@/stores/user';
import BaseSidebar from '@/components/BaseSidebar.vue'
import { getPlanBy } from '../../libs/planManagement.js'
import ListContainer from '@/components/ListContainer.vue'
import Icon from '@/components/Icon.vue'
import PostPlan from '../../classes/plan/PostPlan'
import CommentCard from '@/components/CommentCard.vue'
import ListItem from '@/components/ListItem.vue'

const isLoading = ref(false)
const router = useRouter()
const route = useRoute()
const toastStore = useToastStore()
const userStore = useUserStore()
const postPlan = ref(new PostPlan())
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
    postPlan.value = await getPlanBy('id', route.params.id, 'post')
    console.log(postPlan.value);
    author.value = await getUserBy('id', postPlan.value.authorId)
    // comments.value = await postPlan.value.getComments()
    // comments.value.push(
    //   ...postPlan.value.comments.map(
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

watch(() => postPlan.value, (newVal, oldVal) => {
  console.log('newVal', newVal)
  console.log('oldVal', oldVal)
})

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
            <div v-if="!isLoading" class="text-3xl font-bold font-helvetica">{{ postPlan.title }}</div>
            <div v-else class="skeleton h-10 w-[32rem] max-w-full"></div>
            <div v-if="!isLoading" class="font-helvetica opacity-70">{{ postPlan?.description }}</div>
            <div v-else class="skeleton h-6 w-[20rem] max-w-full"></div>
          </div>
          <ListContainer
            v-if="!isLoading && postPlan.getDailyTasks().length > 0"
            :items="postPlan.getDailyTasks()"
            v-slot="{ items }"
          >
            <ListItem
              v-for="(item, index) in items" 
              :key="index"
              width="100%"
              contentHeight="auto"
              type="list"
            >
              <template #title>
                <div class="flex items-center gap-4">
                  <input type="checkbox" class="checkbox" disabled />
                  <div class="text-base">Day {{ index + 1 }}</div>
                  <div>{{ item.title }}</div>
                </div>
              </template>
              <template #content>
                <ListContainer :items="item.getHourlyTasks()" v-slot="{ items }">
                  <ListItem
                    v-for="(hourlyTask, index) in items"
                    :key="index"
                    width="100%"
                    contentHeight="10rem"
                    type="sublist"
                  >
                    <template #title>
                      <div class="grid grid-cols-[1fr_2fr_14fr] w-full place-items-center">
                        <input type="checkbox" class="checkbox" disabled />
                        <div class="place-self-start">{{ hourlyTask.start }} - {{ hourlyTask.end }}</div>
                        <div class="place-self-start">{{ hourlyTask.header }}</div>
                      </div>
                    </template>
                    <template #content>
                      <div class="flex h-full">
                        <div class="flex-1">{{ hourlyTask.description }}</div>
                        <div class="divider divider-horizontal divider-neutral"></div>
                        <div v-if="hourlyTask.todos.length > 0" class="flex-1 flex flex-col gap-2">
                          <div class="font-bold">To-do</div>
                          <ul class="flex flex-col gap-2">
                            <li v-for="(todo, index) in hourlyTask.todos" :key="index" class="flex items-center gap-2">
                              <input type="checkbox" class="checkbox" disabled />
                              <span>{{ todo.description }}</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </template>
                  </ListItem>
                </ListContainer>
              </template>
            </ListItem>
          </ListContainer>
          <div v-else class="flex flex-col gap-2 mb-16">
            <div class="skeleton h-16 w-full"></div>
            <div class="skeleton h-16 w-full"></div>
            <div class="skeleton h-16 w-full"></div>
          </div>
          <div class="divider"></div>
          <div class="my-4">Comments</div>
          <div v-if="!isLoading" class="flex flex-col gap-2 mb-16">
            <CommentCard v-for="(comment, index) in postPlan.comments" :key="index" :comment="comment" />
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