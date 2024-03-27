<script setup>
import Icon from './Icon.vue'
import UserProfilePlaceholder from './UserProfilePlaceholder.vue'
import { ref, onMounted } from 'vue'
import { getUserBy, updateUserData } from '../../libs/userManagement'
import { useUserStore } from '@/stores/user';
import { updatePlanData } from '../../libs/planManagement';
import { useToastStore } from '@/stores/toast';
import BasePlan from '../../classes/plan/BasePlan';
import { formatDate } from '../../libs/utils';

const props = defineProps({
	planData: {
		type: BasePlan,
		required: true
	}
})

const userStore = useUserStore()
const toastStore = useToastStore()
const author = ref({})
const upVoted = ref(false)

onMounted(
	async () => {
		author.value = await getUserBy('id', props.planData.authorId)
		upVoted.value = userStore.userData.upVotedPosts?.includes(props.planData.id) || false
	}
)

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
				<div>
					<div class="text-sm font-bold">{{ author?.nickname || 'Nickname' }}</div>
					<div class="text-xs opacity-70">{{ '@' + author?.username || 'Username' }}</div>
				</div>
			</div>
			<RouterLink :to="`/post/${planData.id}`" class="text-xl font-bold hover:underline cursor-pointer">{{ planData.title || 'Title' }}</RouterLink>
			<div class="text-[0.6rem] font-bold">{{ formatDate(planData.postDate) }}</div>
		</div>
		<div class="flex-1 w-full h-44 bg-base-100 rounded-[0.6rem] overflow-hidden">
			<img v-if="planData.imageUrl" :src="planData.imageUrl" alt="Post image" class="w-full h-full object-cover" />
			<div v-else class="w-full h-full grid place-items-center font-bold">
				I am Mock-up image
			</div>
		</div>
		<div v-if="planData.type === 'post'" class="flex-none mt-2 flex items-center justify-between select-none">
			<div @click="toggleUpVote" class="flex items-center gap-3">
				<Icon v-show="upVoted" iconName="up-vote-fill" color="#5e5" />
				<Icon v-show="!upVoted" iconName="up-vote" />
				<div class="font-bold">{{ planData.upVote || '0' }}</div>
			</div>
			<div class="flex items-center gap-3">
				<Icon iconName="chat-right-dots" />
				<div class="font-bold">{{ planData.comments.length || '0' }}</div>
			</div>
			<!-- <Icon iconName="paper-clip" /> -->
		</div>
	</div>
</template>