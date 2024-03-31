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
const commentsCount = ref(0)

onMounted(
	async () => {
		author.value = await getUserBy('id', props.postPlan?.authorId)
		upVoted.value = userStore.userData.upVotedPosts?.includes(props.postPlan?.id) || false
		await props.postPlan?.loadComments()
		commentsCount.value = props.postPlan?.comments?.length || 0
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
	<div class="text-[1.25rem] sm:text-[1rem]">
		<div class="w-[16em] h-[24em] bg-neutral rounded-2xl p-[1em] flex flex-col gap-[0.5em] text-accent shadow-postcard">
			<div class="flex-none flex flex-col gap-[1em]">
				<div class="flex gap-[1em] items-center tracking-wider">
					<div class=" w-[2.5em] h-[2.5em] bg-black rounded-full overflow-hidden">
						<img
							v-if="author?.setting?.avatarUrl"
							:src="author?.setting?.avatarUrl"
							alt="Author profile image"
							class="w-full h-full object-cover"
						/>
						<div v-else>
							<UserProfilePlaceholder
								color="#f50"
								bgcolor="white"
								size="100%"
							/>
						</div>
					</div>
					<div>
						<div class="text-[0.875em] font-bold">{{ author?.nickname || 'Display name' }}</div>
						<div class="text-[0.75em] opacity-70">{{ '@' + author?.username || 'Username' }}</div>
					</div>
				</div>
				<div @click="handlePlanClick" class="text-[1.25em] font-bold hover:underline cursor-pointer">{{ postPlan?.title || 'Untitled plan' }}</div>
				<div class="text-[0.6em] font-bold">{{ formatDate(postPlan?.postDate) }}</div>
			</div>
			<div @click="handlePlanClick" class="flex-1 w-full h-[11em] bg-base-100 rounded-[0.6em] overflow-hidden cursor-pointer">
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
			<div v-if="postPlan?.type === 'post'" class="flex-none mt-[0.5em] flex items-center justify-between select-none">
				<div @click="handleToggleUpVote" class="flex items-center gap-3 cursor-pointer">
					<Icon v-show="upVoted" iconName="up-vote-fill" color="#5e5" />
					<Icon v-show="!upVoted" iconName="up-vote" />
					<div class="font-bold">{{ postPlan.upVote || '0' }}</div>
				</div>
				<div @click="handlePlanClick" class="flex items-center gap-3 cursor-pointer">
					<Icon iconName="chat-right-dots" />
					<div class="font-bold">{{ commentsCount || '0' }}</div>
				</div>
				<!-- <Icon iconName="paper-clip" /> -->
			</div>
		</div>
	</div>
</template>