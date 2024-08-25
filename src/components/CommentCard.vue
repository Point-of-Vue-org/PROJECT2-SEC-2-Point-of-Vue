<script setup>
import { ref, onMounted } from 'vue'
import { getUserBy } from '../../libs/userManagement'
import Icon from './Icon.vue'
import { Comment } from '../../classes/Comment'
import UserProfilePlaceholder from './UserProfilePlaceholder.vue'
import { formatDate } from '../../libs/utils'
import { useUserStore } from '@/stores/user'
import { toggleUpVoteComment } from '../../libs/commentManagement'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast'

const props = defineProps({
  comment: {
    type: Comment,
    required: true
  }
})

const router = useRouter()
const toastStore = useToastStore()
const userStore = useUserStore()
const author = ref({})
const upVoted = ref(false)

onMounted(async () => {
  if (props.comment.author) {
    author.value = props.comment.author
    return
  }
  const authorObj = await getUserBy('id', props.comment.authorId)
  if (authorObj !== null) {
    author.value = authorObj
  } else {
    author.value = {
      nickname: '[Deleted user]'
    }
  }
  upVoted.value = userStore.userData.upVotedComments?.includes(props.comment.id) || false
})

const handleToggleUpVote = async () => {
  upVoted.value = await toggleUpVoteComment(userStore.userData, props.comment)
}

const handleClickAuthor = () => {
  if (author.value.id === undefined) {
    toastStore.addToast('This user is not available', 'error')
    return
  }
  router.push(`/profile/${author.value.id}`)
}
</script>

<template>
  <div class="rounded-2xl p-4 bg-neutral">
    <div class="flex gap-3 items-center">
      <div class="cursor-pointer" @click="handleClickAuthor">
        <img v-if="author?.setting?.avatarUrl" :src="author?.setting?.avatarUrl" class="rounded-full w-8 h-8 object-cover" />
        <UserProfilePlaceholder v-else size="2rem" color="#f50" bgcolor="white" class="rounded-full" />
      </div>
      <div class="flex flex-col">
        <div class="font-semibold cursor-pointer hover:underline" @click="handleClickAuthor">{{ author.nickname }}</div>
        <div v-show="author?.username" class="text-xs opacity-70 cursor-pointer" @click="handleClickAuthor">{{ '@' + author.username }}</div>
      </div>
    </div>
    <div class="text-xs my-1">{{ formatDate(comment.date) }}</div>
    <div class="my-2">{{ props.comment.content }}</div>
    <div @click="handleToggleUpVote" class="flex items-center gap-2 select-none">
      <Icon v-show="upVoted" iconName="up-vote-fill" color="#5e5" />
      <Icon v-show="!upVoted" iconName="up-vote" />
      <div class="font-bold">{{ comment.upVote || '0' }}</div>
    </div>
  </div>
</template>