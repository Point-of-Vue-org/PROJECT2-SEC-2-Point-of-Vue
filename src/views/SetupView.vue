<script setup>
import { useUserStore } from '@/stores/user';
import { updateUserData } from '../../libs/userManagement';
import { useToastStore } from '@/stores/toast';
import { useRouter } from 'vue-router';
import ResetPasswordQuestionList from '../components/ResetPasswordQuestionList.vue'
import { computed, reactive, ref } from 'vue';
import UserProfilePlaceholder from '@/components/UserProfilePlaceholder.vue';
import SlideShow from '@/components/slide/SlideShow.vue';
import SlidePage from '@/components/slide/SlidePage.vue';

const router = useRouter()
const userStore = useUserStore()
const toastStore = useToastStore()
const page = ref(1)
const nickname = ref(`Guest_${userStore.userData.id}`)
const profileImageFile = ref(null)
const profileImagePreview = computed(() => profileImageFile.value ? URL.createObjectURL(profileImageFile.value) : null)
const securityQuestions = reactive({
	q1: {
		question: -1,
		answer: ''
	},
	q2: {
		question: -1,
		answer: ''
	},
	q3: {
		question: -1,
		answer: ''
	},
})
const selectedQuestionIndexes = computed(() => [securityQuestions.q1.question, securityQuestions.q2.question, securityQuestions.q3.question])
const disableForgetPasswordNextBtn = computed(() => {
	return selectedQuestionIndexes.value.includes(-1) || Object.values(securityQuestions).some(q => q.answer === '')
})

const handleNextPage = () => {
	if (page.value >= 4) {
		return
	}
	page.value += 1

}
const handlePreviousPage = () => {
	if (page.value <= 1) {
		return
	}
	page.value -= 1
}
// const handleSubmitNickname = async () => {
//     if (nickname.value === '') return 
//     try {
//         const res = await updateUserData(userStore.userData.id, { hasSetup: true, nickname: nickname.value })
//         if(res){
//             userStore.userData.nickname = res.nickname
//             toastStore.addToast('Successfully Welcome to plannet', 'success')
//             router.push('/')
//         }
//     } catch (error) {
//         toastStore.addToast('Error occured', 'error')
//     }
// }


const handleProfileFileChange = (e) => {
	const file = e.target.files[0]
	if (!file) return
	profileImageFile.value = file
}

const handleSecurityQuestionSelect = (question, value) => {
	console.log(question, value)
	securityQuestions[question].question = value
}

// const handleSkip = async () => {
//     nickname.value = 'Guest'
//     await handleSubmitNickname()
// }

const handleAnswer = async () => {
	console.log(securityQuestions)
	try {
		const res = await updateUserData(userStore.userData.id, { hasSetup: true, nickname: nickname.value, securityQuestions })
		if (res) {
			userStore.userData.nickname = res.nickname
			toastStore.addToast('Successfully', 'success')
			router.push('/')
		}
	}
	catch (error) {
		toastStore.addToast('Error occured', 'error')
	}
}
</script>

<template>
	<main class="w-full h-screen overflow-hidden">
		<SlideShow :pageAmount="4" :currentPage="page">
			<SlidePage>
				<div class="flex flex-col items-center justify-center gap-7 bg-base-200 w-[45rem] h-[30rem] rounded-2xl">
					<div class="text-3xl font-helvetica w-fit">Setup your <span class="text-primary">display name!</span></div>
					<div class="flex flex-col items-center gap-2">
						<div class="opacity-75 my-4">Choose something that represents you and makes you easily recognizable!</div>
						<div class="flex gap-5">
							<input v-model="nickname" type="text" class="input input-bordered rounded-xl w-96 font-helvetica" placeholder="Type your nickname" />
						</div>
						<div>
							*You can change display name later in your profile.*
						</div>
					</div>
					<button class="btn btn-primary btn-sm" @click="handleNextPage">Next</button>
				</div>
			</SlidePage>
			<SlidePage>
				<div class="flex flex-col justify-center items-center gap-7 bg-base-200 w-[45rem] h-[30rem] rounded-2xl">
					<div class="text-3xl font-helvetica w-fit">Show me <span class="text-primary">how your look!</span></div>
					<div class="w-48 h-48 rounded-full overflow-hidden">
						<img v-if="profileImagePreview" :src="profileImagePreview" alt="profile image" class="w-full h-full object-cover" />
						<UserProfilePlaceholder v-else color="#ff5500" bgcolor="#f0f0f0" size="100%" />
					</div>
					<input id="profile-image-input" type="file" class="hidden" @change="handleProfileFileChange($event)" />
					<label for="profile-image-input" class="btn btn-secondary">Upload your profile image</label>
					<div class="flex gap-4">
						<button class="btn btn-sm btn-neutral" @click="handlePreviousPage">Back</button>
						<button
							:class="{
								'btn-primary': profileImagePreview,
								'btn-neutral btn-outline': !profileImagePreview
							}"
							class="btn btn-sm" @click="handleNextPage"
						>
							{{ profileImagePreview ? 'Next' : 'Skip' }}
						</button>
					</div>
				</div>
			</SlidePage>
			<SlidePage>
				<div class="flex flex-col justify-center items-center gap-3 bg-base-200 w-[40rem] h-[45rem] rounded-2xl">
					<div class="flex flex-col items-center gap-4">
						<div class="text-3xl">Reset password question</div>
						<div class="flex flex-col items-center gap-1 text-sm">
							<div>Please select <span class="text-primary">3 security questions</span> and provide the answer</div>
							<div>This will help you to reset your password if you forget it</div>
						</div>
					</div>
					<div v-for="i in 3" class="flex flex-col items-center gap-4" :key="i">
						<ResetPasswordQuestionList
							:questionTitle="`Question ${i}`"
							@questionSelect="handleSecurityQuestionSelect('q' + i, $event)"
							:disabledQuestionIndex="selectedQuestionIndexes"
							class="text-sm p-4 rounded-2xl bg-accent text-neutral focus:outline-none"
						/>
						<input
							type="text"
							v-model="securityQuestions['q' + i].answer"
							class="input input-bordered rounded-xl w-full font-helvetica text-sm"
							placeholder="Type your answer"
						/>
					</div>
					<div class="flex gap-4">
						<button type="btn" class="btn btn-neutral" @click="handlePreviousPage">Back</button>
						<button
							type="submit"
							:class="{
								'btn-disabled': disableForgetPasswordNextBtn
							}"
							class="btn btn-primary"
							@click="handleNextPage"
							:disabled="disableForgetPasswordNextBtn"
						>
							Next
						</button>
					</div>
				</div>
			</SlidePage>
		</SlideShow>
	</main>
</template>