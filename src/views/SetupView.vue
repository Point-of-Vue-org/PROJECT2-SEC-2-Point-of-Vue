<script setup>
import { useUserStore } from '@/stores/user';
import { updateUserData } from '../../libs/userManagement';
import { useToastStore } from '@/stores/toast';
import { useRouter, RouterLink } from 'vue-router';
import ResetPasswordQuestionList from '../components/ResetPasswordQuestionList.vue'
import { computed, reactive, ref } from 'vue';

const router = useRouter()
const userStore = useUserStore() 
const toastStore = useToastStore()
const page = ref(1)
const nickname = ref(`Guest_${userStore.userData.id}`)
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

const handleNextPage = () =>{
    if(page.value >= 3){
        return
    }
    page.value += 1
    
}
const handlePreviousPage = () =>{
    if(page.value <= 1){
        return
    }
    page.value -= 1
}
const handleSubmitNickname = async () => {
    if (nickname.value === '') return 
    try {
        const res = await updateUserData(userStore.userData.id, { hasSetup: true, nickname: nickname.value })
        if(res){
            userStore.userData.nickname = res.nickname
            toastStore.addToast('Successfully Welcome to plannet', 'success')
            router.push('/')
        }
    } catch (error) {
        toastStore.addToast('Error occured', 'error')
    }
}

const handleSecurityQuestionselect = (question, value) => {
    console.log(question, value)
    securityQuestions[question].question = value
}

const handleSkip = async () => {
    nickname.value = 'Guest'
    await handleSubmitNickname()
}

const handleAnswer = async () => {
    console.log(securityQuestions)
    try {
        const res = await updateUserData(userStore.userData.id, { hasSetup: true, nickname: nickname.value, securityQuestions })
        if(res){
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
        <div
            :class="{
                '-translate-x-[0vw]': page === 1,
                '-translate-x-[100vw]': page === 2,
                '-translate-x-[200vw]': page === 3,
            }"
            class="flex h-full transition-transform duration-1000 ease-in-out"
        >
            <div class="flex-shrink-0 w-screen h-full flex flex-col items-center justify-center">
                <div class="flex flex-col items-center gap-7">
                    <div class="text-3xl font-helvetica w-fit">Setup your  <span class="text-primary">display name!</span></div>
                    <div class="flex flex-col items-center gap-2">
                        <div class="opacity-75">Choose something that represents you and makes you easily recognizable!</div>
                        <div>
                            *You can change display name later in your profile.*
                        </div>
                    </div>
                    <div class="flex gap-5">
                        <input v-model="nickname" type="text" class="input input-bordered rounded-xl w-96 font-helvetica" placeholder="Type your nickname" />
                    </div>
                    <button class="btn btn-primary" @click="handleNextPage">Next &gt;</button>
                </div>
            </div>
            <div class="flex-shrink-0 w-screen h-full flex justify-center items-center">
                <div class="text-3xl">Hello</div>
                <button class="btn btn-primary" @click="handlePreviousPage">&lt; Back</button>
                <button class="btn btn-primary" @click="handleNextPage">Next &gt;</button>
            </div>
            <div class="flex-shrink-0 w-screen h-full flex flex-col justify-center items-center">
                <div class="text-3xl">Reset password question</div> 
                <ResetPasswordQuestionList
                    questionTitle="Question 1"
                    @questionSelect="handleSecurityQuestionselect('q1', $event)"
                    :disabledQuestionIndex="selectedQuestionIndexes"
                />
                <input type="text" v-model="securityQuestions.q1.answer" class="input input-bordered rounded-xl w-96 font-helvetica" placeholder="Type your answer" />
                <ResetPasswordQuestionList
                    questionTitle="Question 2"
                    @questionSelect="handleSecurityQuestionselect('q2', $event)"
                    :disabledQuestionIndex="selectedQuestionIndexes"
                />
                <input type="text" v-model="securityQuestions.q2.answer" class="input input-bordered rounded-xl w-96 font-helvetica" placeholder="Type your answer" />
                <ResetPasswordQuestionList
                    questionTitle="Question 3"
                    @questionSelect="handleSecurityQuestionselect('q3', $event)"
                    :disabledQuestionIndex="selectedQuestionIndexes"
                />
                <input type="text" v-model="securityQuestions.q3.answer" class="input input-bordered rounded-xl w-96 font-helvetica" placeholder="Type your answer" />

                <button class="btn btn-primary" @click="handlePreviousPage">&lt; Back</button>
                <button class="btn btn-primary" @click="handleAnswer">Finish</button>
            </div>
        </div>
    </main>
</template>