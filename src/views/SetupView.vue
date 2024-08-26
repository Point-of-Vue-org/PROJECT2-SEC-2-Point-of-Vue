<script setup>
import { useUserStore } from '@/stores/user'
import { updateUserData } from '../../libs/userManagement'
import { useToastStore } from '@/stores/toast'
import { useRouter } from 'vue-router'
import ResetPasswordQuestionList from '../components/ResetPasswordQuestionList.vue'
import { computed, reactive, ref } from 'vue'
import UserProfilePlaceholder from '@/components/UserProfilePlaceholder.vue'
import SlideShow from '@/components/slide/SlideShow.vue'
import SlidePage from '@/components/slide/SlidePage.vue'
import Logo from '@/components/Logo.vue'
import { validateNickname } from '../../libs/validationUtils'
import Icon from '@/components/Icon.vue'
import { upload } from '../../libs/imageManagement'
import { hash } from '../../libs/plannetEncrypt'
import LoadingModal from '@/components/LoadingModal.vue'

const isLoading = ref(false)
const router = useRouter()
const userStore = useUserStore()
const toastStore = useToastStore()
const page = ref(1)
const DEFAULT_NICKNAME = `Guest_${userStore.userData.id}`
const nickname = ref(DEFAULT_NICKNAME)
const nicknameStatus = computed(() => {
	return validateNickname(nickname.value)
})
const disableNickNameNextBtn = computed(() => {
	return nicknameStatus.value.warning.length > 0
})
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
	if (page.value >= 4) return
	page.value += 1
}

const handlePreviousPage = () => {
	if (page.value <= 1) return
	page.value -= 1
}

const handleProfileFileChange = (e) => {
	const file = e.target.files[0]
	if (!file) return
	profileImageFile.value = file
}

const handleSecurityQuestionSelect = (question, value) => {
	securityQuestions[question].question = value
}

const handleFinish = async () => {
	isLoading.value = true
	let profileUrl = null
	if (profileImageFile.value) {
		try {
			profileUrl = await upload(profileImageFile.value)
		} catch (error) {
			toastStore.addToast('Error occured while uploading profile image', 'error')
			isLoading.value = false
			return
		}
	}

	for (const question of Object.values(securityQuestions)) {
		question.answer = hash(question.answer)
	}
	
	try {
		const res = await updateUserData(userStore.userData.id, {
			hasSetup: true,
			nickname: nickname.value,
			securityQuestions,
			setting: {
				avatarUrl: profileUrl,
				bannerUrl: ''
			}
		})

		if (res) {
			userStore.userData.nickname = res.nickname
			toastStore.addToast('Setup completed', 'success')
			router.push('/')
		}
	}
	catch (error) {
		toastStore.addToast('Error occured', 'error')
	} finally {
		isLoading.value = false
	}
}
</script>

<template>
	<LoadingModal :show="isLoading" text="Setting up your profile..." />
	<main class="w-full h-svh sm:h-screen overflow-hidden relative">
		<SlideShow :pageAmount="4" :currentPage="page">
			<SlidePage :page="1" :currentPage="page" transitionType="scale">
				<div class="flex flex-col items-center justify-center gap-7 bg-base-200 w-full h-full max-w-[45rem] sm:h-auto sm:py-[6rem] rounded-2xl relative">
					<div class="text-primary flex gap-2 items-center absolute top-5 left-5">
						<Logo size="1.5rem" color="currentColor" />
						<div class="text-base-content">Plannet</div>
					</div>
					<div class="text-2xl sm:text-3xl font-helvetica w-fit font-bold">Setup your <span class="text-primary">display name!</span></div>
					<div class="flex flex-col items-center gap-2">
						<div class="text-secondary items-center flex flex-wrap justify-center">
							<div>Choose&nbsp;something&nbsp;that&nbsp;represents&nbsp;you&nbsp;and&emsp;</div>
							<div>makes&nbsp;you&nbsp;easily&nbsp;recognizable!</div>
						</div>
						<div class="flex flex-col items-center gap-5 w-full">
							<div class="text-sm text-error text-center">
								<div v-for="(warning,index) in nicknameStatus.warning" :key="index">{{ warning }}</div>
							</div>
							<input
								v-model="nickname"
								type="text"
								class="input input-bordered text-center rounded-xl w-10/12 max-w-96 font-helvetica"
								placeholder="Type your nickname"
							/>
						</div>
						<div class="text-sm">*You can change display name later in your profile.*</div>
					</div>
					<div class="absolute bottom-6 right-6">
						<button
						:class="{
								'btn-disabled': disableNickNameNextBtn,
								'btn-primary': nickname !== DEFAULT_NICKNAME,
								'btn-neutral btn-outline': nickname === DEFAULT_NICKNAME
							}"
							class="btn"
							@click="handleNextPage"
							:disabled="disableNickNameNextBtn"
							>
							{{ nickname !== DEFAULT_NICKNAME ? 'Next' : 'Skip' }}
						</button>
					</div>
				</div>
			</SlidePage>
			<SlidePage :page="2" :currentPage="page" transitionType="scale">
				<div class="flex flex-col justify-center items-center gap-7 bg-base-200 w-full h-full max-w-[45rem] sm:h-auto sm:py-[6rem] rounded-2xl relative">
					<div class="text-primary flex gap-2 items-center absolute top-5 left-5">
						<Logo size="1.5rem" color="currentColor" />
						<div class="text-base-content">Plannet</div>
					</div>
					<div class="flex flex-col items-center gap-4">
						<div class="text-2xl sm:text-3xl font-helvetica w-fit font-bold">Show me <span class="text-primary">how your look!</span></div>
						<div class="text-secondary flex justify-center flex-wrap">
							<div>Upload&nbsp;your&nbsp;profile&nbsp;image&nbsp;to&emsp;</div>
							<div>make&nbsp;your&nbsp;account&nbsp;more&nbsp;personal</div>
						</div>
					</div>
					<div class="w-48 h-48 rounded-full overflow-hidden">
						<img v-if="profileImagePreview" :src="profileImagePreview" alt="profile image" class="w-full h-full object-cover" />
						<UserProfilePlaceholder v-else color="#ff5500" bgcolor="#f0f0f0" size="100%" />
					</div>
					<input id="profile-image-input" type="file" class="hidden" @change="handleProfileFileChange($event)" />
					<label for="profile-image-input" class="btn btn-secondary">
						<Icon iconName="upload" />
						<div>Upload your profile image</div>
					</label>
					<div class="flex gap-4 absolute bottom-6 justify-between left-6 right-6">
						<button class="btn btn-neutral" @click="handlePreviousPage">Back</button>
						<button
						:class="{
								'btn-primary': profileImagePreview,
								'btn-neutral btn-outline': !profileImagePreview
							}"
							class="btn"
							@click="handleNextPage"
							>
							{{ profileImagePreview ? 'Next' : 'Skip' }}
						</button>
					</div>
				</div>
			</SlidePage>
			<SlidePage :page="3" :currentPage="page" transitionType="scale">
				<div class="flex flex-col gap-5 justify-center items-center bg-base-200 w-full h-full max-w-[45rem] sm:h-auto sm:py-[6rem] relative">
					<div class="text-primary flex gap-2 items-center absolute top-5 left-5">
						<Logo size="1.5rem" color="currentColor" />
						<div class="text-base-content">Plannet</div>
					</div>
					<div class="flex flex-col items-center gap-4 w-full">
						<Icon iconName="key-fill" scale="5" class="mb-4"/>
						<div class="text-2xl sm:text-3xl font-bold">Reset password question</div>
						<div class="flex flex-col items-center gap-1 text-sm w-[95%]">
							<div class="text-center">Please&nbsp;select&nbsp;<span class="text-primary">3&nbsp;security&nbsp;questions</span>&nbsp;and provide&nbsp;the&nbsp;answer</div>
							<div>This will help you to reset your password if you forget it</div>
						</div>
					</div>
					<div class="flex flex-col gap-3">
						<div v-for="i in 3" class="flex flex-col items-center gap-2" :key="i">
							<ResetPasswordQuestionList
							:questionTitle="`Question ${i}`"
							@questionSelect="handleSecurityQuestionSelect('q' + i, $event)"
							:disabledQuestionIndex="selectedQuestionIndexes"
							class="text-sm p-4 rounded-2xl bg-accent text-neutral focus:outline-none w-11/12 max-w-96"
							/>
							<input
							type="text"
							v-model="securityQuestions['q' + i].answer"
							class="input input-bordered rounded-xl font-helvetica text-sm w-11/12 max-w-96"
							placeholder="Type your answer"
							/>
						</div>
					</div>
					<div class="flex gap-4 absolute bottom-6 left-6 right-6 justify-between">
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
			<SlidePage :page="4" :currentPage="page" transitionType="scale">
				<div class="flex flex-col items-center justify-center bg-base-200 w-full h-full max-w-[45rem] sm:h-auto sm:py-[6rem] rounded-2xl relative">
					<div class="text-accent absolute opacity-5">
						<Logo size="20rem" color="currentColor" />
					</div>
					<div class="flex flex-col justify-center items-center gap-5 rounded-2xl z-10">
						<div class="text-4xl font-helvetica w-fit font-bold">Welcome to <span class="text-primary">Plannet!</span></div>
						<div class="flex flex-col items-center">
							<div class="text-2xl">{{ '\"' + nickname + '\"' }}</div>
							<div class="text-base text-secondary">{{ '@' + userStore.userData.username }}</div>
						</div>
						<img v-if="profileImagePreview" :src="profileImagePreview" alt="profile preview" class="w-64 h-64 rounded-full object-cover">
						<UserProfilePlaceholder v-else color="#ff5500" bgcolor="#f0f0f0" size="16rem" class="rounded-full" />
						<div class="text-center">
							<div>You have <span class="text-primary">successfully set up your account</span></div>
							<div>Now you can start managing your plans and</div>
							<div>share them with our community</div>
						</div>
						<div class="flex gap-4 absolute bottom-6 left-6 right-6 justify-between">
							<button class="btn btn-neutral" @click="handlePreviousPage">Back</button>
							<button class="btn btn-primary" @click="handleFinish">Finish</button>
						</div>
					</div>
				</div>
			</SlidePage>
		</SlideShow>
	</main>
</template>