<script setup>
import { ref, onMounted } from 'vue'
import { getUserBy } from '../../libs/userManagement';
import Icon from './Icon.vue';

const props = defineProps({
  comment: {
    type: Object,
    required: true
  }
})

const author = ref({})
const upVoted = ref(false)

onMounted(async () => {
  author.value = await getUserBy('id', props.comment.userId)
  // console.log(author.value)
})

const toggleUpVote = () => {
	// if (userStore.userData.upVotedComments.includes(props.postData.id)) {
	// 	props.postData.upVote--
	// 	updatePostData(props.postData.id, { upVote: props.postData.upVote })
	// 	userStore.userData.upVotedPosts.splice(userStore.userData.upVotedPosts.indexOf(props.postData.id), 1)
	// 	updateUserData(userStore.userData.id, { upVotedPosts: userStore.userData.upVotedPosts })
	// 	upVoted.value = false
	// 	return
	// }
	// props.postData.upVote++
	// updatePostData(props.postData.id, { upVote: props.postData.upVote })
	// userStore.userData.upVotedPosts.push(props.postData.id)
	// updateUserData(userStore.userData.id, { upVotedPosts: userStore.userData.upVotedPosts })
	// upVoted.value = true
}


</script>

<template>
  <div class="rounded-2xl p-4 bg-neutral">
    <div class="flex gap-3 items-center">
      <img :src="author?.setting?.avatarUrl" class="rounded-full w-8 h-8 object-cover" />
      <div class="flex flex-col">
        <div class="font-semibold">{{ author.nickname }}</div>
        <div class="text-xs opacity-70">{{ '@' + author.username }}</div>
      </div>
    </div>
    <div class="my-2">{{ props.comment.content }}</div>
    <div @click="toggleUpVote" class="flex items-center gap-2 select-none">
      <Icon v-show="upVoted" iconName="up-vote-fill" color="#5e5" />
      <Icon v-show="!upVoted" iconName="up-vote" />
      <div class="font-bold">{{ props.comment.upVote || '0' }}</div>
    </div>
  </div>
</template>