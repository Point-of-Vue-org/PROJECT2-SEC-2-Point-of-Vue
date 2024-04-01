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
import Logo from './Logo.vue';

const props = defineProps({
	planData: {
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
		author.value = await getUserBy('id', props.planData?.authorId)
		upVoted.value = props.planData?.upVotedUserIds?.includes(userStore.userData.id) || false
		if (props.planData?.type === 'post') {
			await props.planData?.loadComments()
			commentsCount.value = props.planData?.comments?.length || 0
		}
	}
)

const handlePlanClick = () => {
	if (props.planData.type === 'post') router.push(`/post/${props.planData.id}`)
	else router.push(`/plan/edit/${props.planData.id}`)
}

const handleToggleUpVote = async () => {
  if (!userStore.userData.id) {
    toastStore.addToast('You must be logged in to upvote', 'error')
    return
  }
  if (userStore.userData.downVotedPlans.includes(props.planData.id)) await toggleDownVote(userStore.userData, props.planData)
  upVoted.value = await toggleUpVote(userStore.userData, props.planData)
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
				<div @click="handlePlanClick" class="text-[1.25em] font-bold hover:underline cursor-pointer">{{ planData?.title || 'Untitled plan' }}</div>
				<div>
					<div v-show="planData?.type === 'draft'" class="text-[0.7em]">Last updated at {{ formatDate(planData?.updatedAt) }}</div>
					<div class="text-[0.6em]" :class="{ 'font-bold': planData?.type === 'post' }">{{ (planData?.type === 'draft' ? 'Create at ' : '') + formatDate(planData?.type === 'post' ? planData?.postDate : planData?.createdAt ) }}</div>
				</div>
			</div>
			<div @click="handlePlanClick" class="flex-1 w-full h-[11em] bg-base-100 rounded-[0.6em] overflow-hidden cursor-pointer">
				<img
					v-if="planData?.imageUrl"
					:src="planData.imageUrl"
					alt="Post image"
					class="w-full h-full object-cover"
				/>
				<div v-else class="w-full h-full grid place-items-center font-bold">
					<Logo size="4rem" />
				</div>
			</div>
			<div v-if="planData?.type === 'post'" class="flex-none mt-[0.5em] flex items-center justify-between select-none">
				<div @click="handleToggleUpVote" class="flex items-center gap-3 cursor-pointer">
					<Icon v-show="upVoted" iconName="up-vote-fill" color="#5e5" />
					<Icon v-show="!upVoted" iconName="up-vote" />
					<div class="font-bold">{{ planData.upVote || '0' }}</div>
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