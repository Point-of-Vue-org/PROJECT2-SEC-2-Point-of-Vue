<script setup>
import { ref, onMounted } from 'vue'
import { getUserBy, updateUserData } from '../../libs/userManagement';
import Icon from './Icon.vue';
import { Comment } from '../../classes/Comment';
import UserProfilePlaceholder from './UserProfilePlaceholder.vue';
import { formatDate } from '../../libs/utils';
import { useUserStore } from '@/stores/user';
import { toggleUpVoteComment, updateCommentData } from '../../libs/commentManagement';

const props = defineProps({
  comment: {
    type: Comment,
    required: true
  }
})

const userStore = useUserStore()
const author = ref({})
const upVoted = ref(false)

onMounted(async () => {
  if (props.comment.author) {
    author.value = props.comment.author
    return
  }
  author.value = await getUserBy('id', props.comment.authorId)
  upVoted.value = userStore.userData.upVotedComments?.includes(props.comment.id) || false
})

const handleToggleUpVote = async () => {
  upVoted.value = await toggleUpVoteComment(userStore.userData, props.comment)
}

</script>

<template>
  <div class="rounded-2xl p-4 bg-neutral">
    <div class="flex gap-3 items-center">
      <img v-if="author?.setting?.avatarUrl" :src="author?.setting?.avatarUrl" class="rounded-full w-8 h-8 object-cover" />
      <UserProfilePlaceholder v-else size="2rem" color="#f50" bgcolor="white" class="rounded-full" />
      <div class="flex flex-col">
        <div class="font-semibold">{{ author.nickname }}</div>
        <div class="text-xs opacity-70">{{ '@' + author.username }}</div>
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