<script setup>
import Icon from './Icon.vue'
import UserProfilePlaceholder from './UserProfilePlaceholder.vue'
import { ref, onMounted } from 'vue'
import { getUserBy, updateUserData } from '../../libs/userManagement'
import { useUserStore } from '@/stores/user';
import { updatePostData } from '../../libs/postManagement';

const props = defineProps({
	postData: {
		type: Object,
		required: true
	}
})

const userStore = useUserStore()
const author = ref({})
const upVoted = ref(false)

onMounted(
	async () => {
		author.value = await getUserBy('id', props.postData.authorId)
		upVoted.value = userStore.userData.upVotedPosts.includes(props.postData.id)
	}
)

function formatPostDate(postDate) {

	const date = new Date(postDate)

	if (date.getDate() === new Date().getDate()) {
		if (date.getHours() === new Date().getHours()) {
			if (date.getMinutes() === new Date().getMinutes()) {
				return 'Just now'
			}

			return new Date().getMinutes() - date.getMinutes()  + ' minutes ago'
		}

		return 'Today at ' + date.toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: 'numeric'
		})
	}

	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric'
	})
}

const toggleUpVote = () => {
	if (userStore.userData.upVotedPosts.includes(props.postData.id)) {
		props.postData.upVote--
		updatePostData(props.postData.id, { upVote: props.postData.upVote })
		userStore.userData.upVotedPosts.splice(userStore.userData.upVotedPosts.indexOf(props.postData.id), 1)
		updateUserData(userStore.userData.id, { upVotedPosts: userStore.userData.upVotedPosts })
		upVoted.value = false
		return
	}
	props.postData.upVote++
	updatePostData(props.postData.id, { upVote: props.postData.upVote })
	userStore.userData.upVotedPosts.push(props.postData.id)
	updateUserData(userStore.userData.id, { upVotedPosts: userStore.userData.upVotedPosts })
	upVoted.value = true
}

</script>

<template>
	<div class="w-64 h-96 bg-neutral rounded-2xl p-4 flex flex-col gap-2 text-accent shadow-postcard">
		<div class="flex-none flex flex-col gap-4">
			<div class="flex gap-4 items-center tracking-wider">
				<div class=" w-10 h-10 bg-black rounded-full overflow-hidden">
					<img 
						v-if="author?.setting?.avatarUrl" 
						:src="author?.setting?.avatarUrl" 
						alt="Author profile image" 
						class="w-full h-full object-cover"
					/>
					<div v-else>
						<UserProfilePlaceholder
							color="white"
							bgcolor="black"
							size="40"
						/>
					</div>
				</div>
				<div class="text-sm">{{ author?.username || 'Username' }}</div>
			</div>
			<RouterLink :to="`/post/${postData.id}`" class="text-xl font-bold hover:underline cursor-pointer">{{ postData.title || 'Title' }}</RouterLink>
			<div class="text-[0.6rem] font-bold">{{ formatPostDate(postData.postDate) }}</div>
		</div>
		<div class="flex-1 w-full h-44 bg-base-100 rounded-[0.6rem] overflow-hidden">
			<img v-if="postData.imageURL" :src="postData.imageURL" alt="Post image" class="w-full h-full object-cover" />
			<div v-else class="w-full h-full grid place-items-center font-bold">
				I am Mock-up image
			</div>
		</div>
		<div class="flex-none mt-2 flex items-center justify-between select-none">
			<div @click="toggleUpVote" class="flex items-center gap-3">
				<Icon v-show="upVoted" iconName="up-vote-fill" color="#5e5" />
				<Icon v-show="!upVoted" iconName="up-vote" />
				<div class="font-bold">{{ postData.upVote || '0' }}</div>
			</div>
			<div class="flex items-center gap-3">
				<Icon iconName="chat-right-dots" />
				<div class="font-bold">{{ postData.comments.length || '0' }}</div>
			</div>
			<Icon iconName="paper-clip" />
		</div>
	</div>
</template>