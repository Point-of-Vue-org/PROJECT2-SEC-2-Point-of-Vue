<script setup>
import { ref, onBeforeMount, onMounted, watch} from 'vue'
import { useRouter, RouterLink, useRoute } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import { getUserBy, logout, validateToken } from '../../libs/userManagement'
import Header from '@/components/Header.vue'
import { useUserStore } from '@/stores/user';
import { getPlanBy } from '../../libs/planManagement.js'
import ListContainer from '@/components/ListContainer.vue'
import Icon from '@/components/Icon.vue'
import PostPlan from '../../classes/plan/PostPlan'
import CommentCard from '@/components/CommentCard.vue'
import ListItem from '@/components/ListItem.vue'
import PlannetSidebar from '@/components/PlannetSidebar.vue'
import { Comment } from '../../classes/Comment'
import { formatDate } from '../../libs/utils'

const isLoading = ref(false)
const router = useRouter()
const route = useRoute()
const toastStore = useToastStore()
const userStore = useUserStore()
const postPlan = ref(new PostPlan())
const author = ref({})

const newComment = ref('')
// const comments = ref([])

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

const handleAddComment = async () => {
  if (newComment.value.length === 0) return
  const comment = new Comment({
    authorId: userStore.userData.id,
    content: newComment.value,
    date: Date.now(),
  })
  console.log(comment);
  const res = await postPlan.value.addComment(comment)
  if (res) {
    toastStore.addToast('Comment added', 'success')
    comment['author'] = userStore.userData
    postPlan.value.comments.unshift(comment)
    newComment.value = ''
  } else {
    toastStore.addToast('Failed to add comment', 'error')
  }
}

const handleLogout = async () => {
  if (window.confirm('Are you sure you want to logout?') === false) return
  await logout(userStore.userData.id)
  localStorage.removeItem('todo_token')
  router.replace('/login')
}

const toggleUpVote = () => {
	if (!userStore.userData.id) {
		toastStore.addToast('You must be logged in to upvote', 'error')
		return
	}
	const isUsedToUpVoted = userStore.userData.upVotedPosts.includes(props.planData.id)

	updatePlanData(props.planData.id, { upVote: props.planData.upVote + (isUsedToUpVoted ? -1 : 1) }, 'post')
	props.planData.upVote += isUsedToUpVoted ? -1 : 1

	if (!isUsedToUpVoted) userStore.userData.upVotedPosts.push(props.planData.id)
	else userStore.userData.upVotedPosts.splice(userStore.userData.upVotedPosts.indexOf(props.planData.id), 1)
	updateUserData(userStore.userData.id, { upVotedPosts: userStore.userData.upVotedPosts })
	upVoted.value = !isUsedToUpVoted
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
    <PlannetSidebar />

    <section class="flex-auto flex justify-center">
      <div class="w-[85%] mt-12">
        <div class="relative overflow-hidden rounded-2xl">
          <div v-if="!isLoading && postPlan.imageUrl">
            <div class="bg-[#0008] absolute w-full h-full"></div>
            <img
              :src="postPlan.imageUrl"
              alt="author image"
              class="w-full h-52 object-cover"
            />
          </div>
          <div v-else-if="!isLoading" class="h-full w-full bg-accent"></div>
          <div v-else class="skeleton h-full w-full"></div>
        </div>
        <div class="text-xs opacity-75 mb-2 mt-4">
          {{ formatDate(postPlan.postDate) }}
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
                      <div class="divider divider-horizontal divider-neutral w-1"></div>
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
        <div class="flex gap-4 my-4">
          <div class="font-semibold">Upvotes</div>
          <div class="flex items-center gap-2">
            <Icon iconName="up-vote" />
            <div class="font-semibold">{{ postPlan.upVote }}</div>
            <Icon iconName="down-vote" />
          </div>
        </div>
        <div class="divider"></div>
        <div class="flex flex-col">
          <div class="font-semibold">Created by</div>
          <div class="flex gap-4 items-center my-4 bg-base">
            <img
              v-if="!isLoading && author?.setting?.avatarUrl"
              :src="author.setting.avatarUrl"
              alt="author image"
              class="w-20 h-20 rounded-full object-cover"
            />
            <div v-else class="skeleton w-10 h-10"></div>
            <div class="flex flex-col gap-0.5">
              <div v-if="!isLoading && author.nickname" class="font-helvetica font-semibold">{{ author.nickname }}</div>
              <div v-else class="skeleton h-6 w-20"></div>
              <div v-if="!isLoading && author.username" class="text-sm font-helvetica opacity-60">{{ '@' + author.username }}</div>
              <div v-else class="skeleton h-4 w-20"></div>
              <div class="text-xs opacity-75 my-2">
                {{ formatDate(postPlan.postDate) }}
              </div>
            </div>
          </div>
        </div>
        <div class="divider"></div>
        <div class="font-semibold  my-4">Comments</div>
        <div class="flex flex-col gap-2 mb-6">
          <textarea
          v-model="newComment"
          class="w-full h-24 p-4 border border-neutral bg-accent text-neutral rounded-2xl placeholder:text-neutral placeholder:opacity-50 focus:outline-none focus:placeholder:opacity-25"
          placeholder="Write a comment..."
          ></textarea>
          <button @click="handleAddComment" class="btn btn-sm btn-primary self-end" :disabled="newComment.length === 0">Add your comment</button>
          <div class="flexgap-2">
            <Icon iconName="comment" />
            <div class="font-semibold">{{ postPlan.comments.length }} Comments</div>
          </div>
        </div>
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