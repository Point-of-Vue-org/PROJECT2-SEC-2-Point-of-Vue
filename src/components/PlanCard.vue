<script setup>
import Icon from './Icon.vue'
import UserProfilePlaceholder from './UserProfilePlaceholder.vue'
import { ref, onMounted } from 'vue'
import { getUserBy, updateUserData } from '../../libs/userManagement'
import { useUserStore } from '@/stores/user';
import { toggleDownVote, toggleUpVote, updatePlanData } from '../../libs/planManagement';
import { useToastStore } from '@/stores/toast';
import BasePlan from '../../classes/plan/BasePlan';
import { formatDate } from '../../libs/utils';
import { useRouter } from 'vue-router';

const props = defineProps({
	postPlan: {
		type: BasePlan,
		required: true
	}
})

const router = useRouter()
const userStore = useUserStore()
const toastStore = useToastStore()
const author = ref({})
const upVoted = ref(false)

onMounted(
	async () => {
		author.value = await getUserBy('id', props.postPlan?.authorId)
		upVoted.value = userStore.userData.upVotedPosts?.includes(props.postPlan?.id) || false
	}
)

const handlePlanClick = () => {
	if (props.postPlan.type === 'post') router.push(`/post/${props.postPlan.id}`)
	else router.push(`/plan/edit/${props.postPlan.id}`)
}

const handleToggleUpVote = async () => {
  if (!userStore.userData.id) {
    toastStore.addToast('You must be logged in to upvote', 'error')
    return
  }
  if (userStore.userData.downVotedPosts.includes(props.postPlan.id)) await toggleDownVote(userStore.userData, props.postPlan)
  upVoted.value = await toggleUpVote(userStore.userData, props.postPlan)
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
			<div @click="handlePlanClick" class="text-xl font-bold hover:underline cursor-pointer">{{ postPlan?.title || 'Untitled plan' }}</div>
			<div class="text-[0.6rem] font-bold">{{ formatDate(postPlan?.postDate) }}</div>
		</div>
		<div @click="handlePlanClick" class="flex-1 w-full h-44 bg-base-100 rounded-[0.6rem] overflow-hidden cursor-pointer">
			<img
				v-if="postPlan?.imageUrl"
				:src="postPlan.imageUrl"
				alt="Post image"
				class="w-full h-full object-cover"
			/>
			<div v-else class="w-full h-full grid place-items-center font-bold">
				I am Mock-up image
			</div>
		</div>
		<div v-if="postPlan?.type === 'post'" class="flex-none mt-2 flex items-center justify-between select-none">
			<div @click="handleToggleUpVote" class="flex items-center gap-3 cursor-pointer">
				<Icon v-show="upVoted" iconName="up-vote-fill" color="#5e5" />
				<Icon v-show="!upVoted" iconName="up-vote" />
				<div class="font-bold">{{ postPlan.upVote || '0' }}</div>
			</div>
			<div @click="handlePlanClick" class="flex items-center gap-3 cursor-pointer">
				<Icon iconName="chat-right-dots" />
				<div class="font-bold">{{ postPlan.comments.length || '0' }}</div>
			</div>
			<!-- <Icon iconName="paper-clip" /> -->
		</div>
	</div>
</template>