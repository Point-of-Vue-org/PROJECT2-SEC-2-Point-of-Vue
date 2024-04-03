<script setup>
import { ref, onMounted, computed} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import { getUserBy, logout, updateUserData, validateToken } from '../../libs/userManagement'
import { useUserStore } from '@/stores/user';
import { getPlanBy, toggleUpVote, toggleDownVote, createOrUpdatePlan, updatePlanData, deletePlan } from '../../libs/planManagement.js'
import ListContainer from '@/components/ListContainer.vue'
import Icon from '@/components/Icon.vue'
import PostPlan from '../../classes/plan/PostPlan'
import CommentCard from '@/components/CommentCard.vue'
import ListItem from '@/components/ListItem.vue'
import { Comment } from '../../classes/Comment'
import { formatDate, sortObject } from '../../libs/utils'
import PlannetLayout from '@/components/PlannetLayout.vue'
import UserProfilePlaceholder from '@/components/UserProfilePlaceholder.vue';
import Modal from '@/components/Modal.vue';

const isLoading = ref(false)
const router = useRouter()
const route = useRoute()
const toastStore = useToastStore()
const userStore = useUserStore()
const postPlan = ref(new PostPlan())
const author = ref({})

const upVoted = ref(false)
const downVoted = ref(false)
const comments = ref([])
const sortAbleComments = computed(() => {
  return sortObject(comments.value, 'date', 'desc')
})
const newComment = ref('')
const confirmDeleteOpenState = ref(false)
const deleteMessage = ref('')
const lockDelete = computed(() => deleteMessage.value !== 'delete')

async function fetchData() {
  isLoading.value = true
  try {
    postPlan.value = await getPlanBy('id', route.params.id, 'post')
    await postPlan.value.loadComments()
    comments.value = postPlan.value.comments

    author.value = await getUserBy('id', postPlan.value.authorId)

    upVoted.value = userStore.userData.upVotedPlans?.includes(postPlan.value.id) || false
    downVoted.value = userStore.userData.downVotedPlans?.includes(postPlan.value.id) || false
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

  const addedComment = await postPlan.value.addComment(comment)
  if (addedComment) {
    toastStore.addToast('Comment added', 'success')
    addedComment['author'] = userStore.userData
    postPlan.value.comments.push(addedComment)
    newComment.value = ''
  } else {
    toastStore.addToast('Failed to add comment', 'error')
  }
}

const handleToggleUpVote = async () => {
  if (!userStore.userData.id) {
    toastStore.addToast('You must be logged in to upvote', 'error')
    return
  }
  if (downVoted.value) downVoted.value = await toggleDownVote(userStore.userData, postPlan.value)
  upVoted.value = await toggleUpVote(userStore.userData, postPlan.value)
}

const handleToggleDownVote = async () => {
  if (!userStore.userData.id) {
    toastStore.addToast('You must be logged in to downvote', 'error')
    return
  }
  if (upVoted.value) upVoted.value = await toggleUpVote(userStore.userData, postPlan.value)
  downVoted.value = await toggleDownVote(userStore.userData, postPlan.value)
}

const handleSaveToDraft = async (silent = false, titleTail = '') => {
  const draftPlan = postPlan.value.getDraft()
  draftPlan.id = undefined
  draftPlan.title += titleTail
  draftPlan.userId = userStore.userData.id
  draftPlan.updatedAt = Date.now()
  const res = await createOrUpdatePlan(draftPlan, 'draft')
  if(res){
    if (silent) toastStore.addToast('Save draft successfully', 'success')
    return true
  } else {
    if (silent) toastStore.addToast('Error occured, Draft can\'t save', 'error')
    return false
  }
}

const handleSetOpenDeleteModal = (openState) => {
  confirmDeleteOpenState.value = openState
}

const handleDeletePost = async (safeDelete = false) => {
  if (deleteMessage.value !== 'delete') {
    toastStore.addToast('Please type "delete" to confirm', 'error')
    return
  }

  // if (safeDelete) saveStatus = await handleSaveToDraft(true, ' (backup)')
  // if (safeDelete && !saveStatus) {
  //   toastStore.addToast('Error occured, Post can\'t delete', 'error')
  //   return
  // } 
  if (safeDelete) {
    const saveStatus = await handleSaveToDraft(true, ' (backup)')
    if (!saveStatus) {
      toastStore.addToast('Error occured, Post can\'t delete', 'error')
      return
    }

    const res = await deletePlan(postPlan.value.id, 'post')
    if (res) {
      toastStore.addToast('Post deleted and backup to draft', 'success')
      router.push('/')
      return
    }
  }

  if (!safeDelete) {
    const res = await deletePlan(postPlan.value.id, 'post')
    if (res) {
      toastStore.addToast('Post deleted', 'success')
      router.push('/')
      return
    }
  }
}
</script>

<template>
  <Modal v-if="postPlan.authorId === userStore.userData.id" :show="confirmDeleteOpenState" @bgClick="handleSetModelState('post', false)">
    <div class="flex items-center flex-col w-11/12 max-w-[34rem] h-96 rounded-2xl justify-center bg-base-100 gap-2">
      <div class="text-2xl">Do you want to <span class="text-primary">delete</span> this post?</div>
      <!-- <Icon iconName="globe" scale="6" size="8rem" /> -->
      <div>Once you delete this post, it can't be undone.</div>
      <div class="flex flex-col justify-center gap-5 pt-5 min-w-52 w-[70%]">
        <div class="flex flex-col gap-1">
          <div>Type "<span class="italic">delete</span>" to confirm</div>
          <input v-model="deleteMessage" type="text" class="input input-bordered w-full placeholder:italic" placeholder="delete" />
        </div>
        <div class="flex flex-col gap-2">
          <button class="btn btn-sm btn-error btn-outline border-2 text-[0.9] font-helvetica" @click="handleDeletePost(true)" :disabled="lockDelete">Backup to my draft and Delete</button>
          <button class="btn btn-sm btn-error btn-outline border-2 text-[0.9] font-helvetica" @click="handleDeletePost(false)" :disabled="lockDelete">Delete without backup</button>
          <button class="btn btn-sm btn-secondary text-[0.9rem] font-helvetica" @click="handleSetOpenDeleteModal(false)">Cancel</button>
        </div>
      </div>
    </div>
  </Modal>
  <PlannetLayout>
    <div class="w-[85%] mt-12">
      <div class="flex justify-end">
        <div class="dropdown dropdown-bottom dropdown-end portrait:md:flex gap-4">
          <div tabindex="0" role="button" class="btn btn-ghost m-1 right-3 top-3 font-bold">
            <Icon iconName="three-dots" :scale="1.5" />
          </div>
          <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 border-base-300 border mr-4">
            <li @click="handleSaveToDraft">
              <div class="flex justify-start gap-2 btn btn-sm btn-secondary" @click="handleSaveToDraft">
                <Icon iconName="save" />
                <span>Save to my draft</span>
              </div>
            </li>
            <div v-if="postPlan.authorId === userStore.userData.id" class="divider m-0"></div>
            <li v-if="postPlan.authorId === userStore.userData.id" @click="handleSetOpenDeleteModal(true)">
              <div class="flex justify-start gap-2 btn btn-error btn-outline btn-sm">
                <Icon iconName="trash-fill" />
                <div>Delete this post</div>
              </div>
            </li>
          </ul>
      </div>
      </div>
      <div class="relative overflow-hidden rounded-2xl">
        <div v-if="!isLoading && postPlan.imageUrl">
          <div class="bg-[#0008] absolute w-full h-full"></div>
          <img
            v-if="!isLoading && postPlan.imageUrl"
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
      <div class="flex flex-col">
        <div class="font-semibold">Created by</div>
        <div class="flex gap-4 items-center my-4 bg-base">
          <img
            v-if="!isLoading && author?.setting?.avatarUrl"
            :src="author.setting.avatarUrl"
            alt="author image"
            class="w-20 h-20 rounded-full object-cover"
          />
          <div v-else-if="isLoading" class="skeleton w-10 h-10"></div>
          <UserProfilePlaceholder v-else size="5rem" color="#f50" bgcolor="white" class="rounded-full" />
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
      <div class="flex flex-col gap-4 my-4">
        <div class="flex gap-4">
          <div class="font-semibold">{{ postPlan.upVote }} Upvotes</div>
          <div class="font-semibold">{{ postPlan.comments.length }} Comments</div>
        </div>
        <div class="flex gap-4 items-center">
          <div
            :class="{
              'border-neutral': !upVoted && !downVoted,
              'border-green-400': upVoted,
              'border-red-400': downVoted
            }"
            class="flex items-center gap-2 border-2 p-1 w-fit rounded-2xl"
          >
            <button @click="handleToggleUpVote" class="btn btn-square btn-ghost">
              <Icon v-show="!upVoted" iconName="up-vote-lg" size="2rem" />
              <Icon v-show="upVoted" iconName="up-vote-fill-lg" class="text-green-400" size="2rem" />
            </button>
            <button @click="handleToggleDownVote" class="btn btn-square btn-ghost">
              <Icon v-show="!downVoted" iconName="down-vote-lg" size="2rem" />
              <Icon v-show="downVoted" iconName="down-vote-fill-lg" class="text-red-400" size="2rem" />
            </button>
          </div>
          <button class="btn btn-secondary" @click="handleSaveToDraft">
            <Icon iconName="save" />
            <span>Save to my draft</span>
          </button>
        </div>
      </div>
      <!-- <div class="font-semibold  my-4">Comments</div> -->
      <div class="flex gap-2 mb-6 items-center border border-neutral bg-accent rounded-2xl px-4">
        <div class="flex-none w-fit">
          <img
            v-if="userStore.userData.setting.avatarUrl"
            :src="userStore.userData.setting.avatarUrl" class="w-8 h-8 rounded-full"
          />
          <UserProfilePlaceholder v-else size="2rem" color="#f50" bgcolor="white" class="rounded-full" />
        </div>
        <textarea
          v-model="newComment"
          class="flex-1 w-full h-24 p-4 text-neutral rounded-2xl placeholder:text-neutral placeholder:opacity-50 focus:outline-none focus:placeholder:opacity-25 bg-transparent resize-none"
          placeholder="Write a comment..."
        ></textarea>
        <button @click="handleAddComment" class="flex-none btn btn-sm btn-primary text-neutral" :disabled="newComment.length === 0">Comment</button>
      </div>
      <div v-if="!isLoading" class="flex flex-col gap-2 mb-16">
        <CommentCard v-for="comment in sortAbleComments" :key="comment.id" :comment="comment" />
      </div>
      <div v-else class="flex flex-col gap-2 mb-16">
        <div class="skeleton h-16 w-full"></div>
        <div class="skeleton h-16 w-full"></div>
        <div class="skeleton h-16 w-full"></div>
      </div>
    </div>
  </PlannetLayout>
</template>