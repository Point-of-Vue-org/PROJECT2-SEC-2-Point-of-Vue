<script setup>
import { ref, computed, reactive,watch } from "vue"
import { getUserBy, updateUserData } from "../../libs/userManagement"
import { checkPassword } from "../../libs/validationUtils"
import Icon from "@/components/Icon.vue"
import SlidePage from "@/components/slide/SlidePage.vue"
import SlideShow from "@/components/slide/SlideShow.vue"
import Logo from "@/components/Logo.vue"
import { useToastStore } from "@/stores/toast"
import { hash } from "../../libs/plannetEncrypt"
import { useRouter } from "vue-router"

const router = useRouter()
const toastStore = useToastStore()
const page = ref(1)
const email = ref('')
const showError = ref(false)
const errorMsg = ref('')
const securityQuestions = ref({})
const confirmPassword = ref('')
const password = ref('')
const userId = ref('')
const passwordStatus = computed(() => {
  return checkPassword(password.value)
})
watch([password, confirmPassword], () => {
  if (password.value !== confirmPassword.value) {
    errorMsg.value = 'Password and Confirm Password must match'
  } else {
    errorMsg.value = ''
  }
})
const answers = reactive({
  q1: '',
  q2: '',
  q3: ''
})
const disableForgetPasswordNextBtn = computed(()=>{
  return Object.values(answers).some(answer => {
    return answer === ''
  })
})
const presetQuestion = ref([
  "What is the name of your first pet?",
  "In which city were you born?",
  "What is the maiden name of your mother?",
  "What was the name of your elementary school?",
  "What is your favorite book?",
  "What is the name of your favorite childhood friend?",
  "What is the make and model of your first car?",
  "What is your favorite movie?",
  "What is the name of the street you grew up on?",
  "What is your favorite food?",
  "What is the name of your favorite teacher?",
  "What is the name of the first company you worked for?",
])
// const selectedQuestionIndexes = computed(() => [securityQuestions.q1.question, securityQuestions.q2.question, securityQuestions.q3.question])

async function handleNext() {
  const user = await getUserBy("email", email.value)
  console.log(user)
  if (user) {
    showError.value = false
    securityQuestions.value = user.securityQuestions
    console.log(securityQuestions.value)
    page.value++
  } else {
    showError.value = true
  }
}
function handlePreviousPage() {
  page.value--
}

const handleConfirmEmail = async () => {
  if (email.value === '') {
    errorMsg.value = 'Please enter email'
    return
  }
  const user = await getUserBy("email", email.value)
  if(user){
    securityQuestions.value = user.securityQuestions
    userId.value = user.id
    page.value++
  }else{
    errorMsg.value = 'Email does not exist'
  }
}

function handleCheckAnswers() {
  const isAllCorrect = securityQuestions.value.q1.answer === hash(answers.q1) && securityQuestions.value.q2.answer === hash(answers.q2) && securityQuestions.value.q3.answer === hash(answers.q3)
  if (isAllCorrect) {
    showError.value = false
    page.value++
  } else {
    showError.value = true
  }
}

const handleSubmitNewPassword = async() => {
  if (password.value === '') {
    errorMsg.value = 'Please enter password'
    return
  }
  if(!passwordStatus.value.isPasswordValid){
    errorMsg.value = 'Password is invalid'
    return
  }
  if (confirmPassword.value === '') {
    errorMsg.value = 'Please enter confirm password'
    return
  }
  if (password.value !== confirmPassword.value) {
    errorMsg.value = 'Password and Confirm Password must match'
    return
  }
  errorMsg.value = ''
  try {
    const res = await updateUserData(userId.value, { password: hash(password.value) })
    if(res){
      toastStore.addToast('Update password success, Please login','success')
      router.push('/login')
    }
  } catch (error) {
      console.error(error)
      toastStore.addToast('Error occured', 'error')
  }
}
</script>
<template>
  <main class="w-full h-screen overflow-hidden relative">
    <SlideShow :pageAmount="3" :currentPage="page">
      <SlidePage :page="1" :currentPage="page" translate="scale">
        <p class="opacity-75">Please enter your Email</p>
        <div class="text-error">{{ errorMsg }}</div>
        <input
          type="email"
          v-model="email"
          class="input input-bordered w-full max-w-xs"
        />
        <button class="btn bg-primary" @click="handleConfirmEmail">Confirm</button>
      </SlidePage>
        <SlidePage :page="2" :currentPage="page" translate="scale">
          <div
            class="flex flex-col gap-5 justify-center items-center bg-base-200 w-[90%] max-w-[45rem] py-[6rem] rounded-2xl relative"
          >
            <div class="text-primary flex gap-2 items-center absolute top-5 left-5">
              <Logo size="1.5rem" color="currentColor" />
              <div class="text-base-content">Plannet</div>
            </div>
            <div class="flex flex-col items-center gap-4">
              <Icon iconName="key-fill" scale="5" class="mb-4" />
              <div class="text-3xl font-bold">Security Questions</div>
              <div class="flex flex-col items-center gap-1 text-sm">
                <div>
                  Please answer
                  <span class="text-primary">3 security questions</span> and provide
                  the answer
                </div>
                <div>
                  This will help you to reset your password if you forget it
                </div>
              </div>
            </div>
            <div class="flex flex-col gap-3">
              <div>
                <div class="flex flex-col gap-2">
                  <p class="font-bold tracking-wider text-secondary">Question 1</p>
                  <p>{{ presetQuestion[securityQuestions?.q1?.question] }}</p>
                  <input
                    type="text"
                    class="input input-bordered rounded-xl w-full font-helvetica text-sm"
                    placeholder="Type your answer"
                    v-model="answers.q1"
                  />
                </div>
              </div>
              <div>
                <div class="flex flex-col gap-2">
                  <p class="font-bold tracking-wider text-secondary">Question 2</p>
                  <p>{{ presetQuestion[securityQuestions?.q2?.question] }}</p>
                  <input
                    type="text"
                    class="input input-bordered rounded-xl w-full font-helvetica text-sm"
                    placeholder="Type your answer"
                    v-model="answers.q2"
                  />
                </div>
              </div>
              <div>
                <div class="flex flex-col gap-2">
                  <p class="font-bold tracking-wider text-secondary">Question 3</p>
                  <p>{{ presetQuestion[securityQuestions?.q3?.question] }}</p>
                  <input
                    type="text"
                    class="input input-bordered rounded-xl w-full font-helvetica text-sm"
                    placeholder="Type your answer"
                    v-model="answers.q3"
                  />
                </div>
                <p class="text-red-500 pt-3 text-xs" v-show="showError">Something went wrong try again later</p>
              </div>
            </div>
            <div
              class="flex gap-4 absolute bottom-6 left-6 right-6 justify-between"
            >
              <button
                type="btn"
                class="btn btn-neutral"
                @click="handlePreviousPage"
              >
                Back
              </button>
              <button
                type="submit"
                :class="{
                  'btn-disabled': disableForgetPasswordNextBtn,
                }"
                class="btn btn-primary"
                @click="handleCheckAnswers"
                :disabled="disableForgetPasswordNextBtn"
              >
                Next
              </button>
            </div>
          </div>
        </SlidePage>
        <SlidePage :page="3" :currentPage="page" translate="scale">
          <div class="flex flex-col justify-center items-center gap-7 bg-base-200 w-[90%] max-w-[45rem] py-[6rem] rounded-2xl relative">
            <div class="text-primary flex gap-2 items-center absolute top-5 left-5">
              <Logo size="1.5rem" color="currentColor" />
              <div class="text-base-content">Plannet</div>
            </div>
            <div>New password</div>
            <input v-model="password" type="password" class="input input-bordered" @input="checkPassword(password)">
            <div>Confirm new password</div>
            <input v-model="confirmPassword" type="password" autocomplete="new-password" title="Confirm password" required class="input input-bordered" />
            <div class="text-xs text-orange-400">{{ errorMsg }}</div>
            <ul class="text-xs flex cursor-defaul">
              <div class="flex flex-col gap-2">
                <li :class="passwordStatus.status.isLengthValid && passwordStatus.status.isMaxLengthValid ? 'text-green-300' : 'text-red-400'"
                  class="flex gap-2 items-center">
                  <Icon iconName="check"
                    v-show="passwordStatus.status.isLengthValid && passwordStatus.status.isMaxLengthValid" />
                  <Icon iconName="x" v-show="!passwordStatus.status.isLengthValid || !passwordStatus.status.isMaxLengthValid" />
                  Must have 8-30 characters
                </li>
                <li :class="passwordStatus.status.haveLowerCase ? 'text-green-300' : 'text-red-400'" class="flex gap-2 ">
                  <Icon iconName="check" v-show="passwordStatus.status.haveLowerCase" />
                  <Icon iconName="x" v-show="!passwordStatus.status.haveLowerCase" />
                  At least one lower case
                </li>
                <li :class="passwordStatus.status.haveUpperCase ? 'text-green-300' : 'text-red-400'" class="flex gap-2">
                  <Icon iconName="check" v-show="passwordStatus.status.haveUpperCase" />
                  <Icon iconName="x" v-show="!passwordStatus.status.haveUpperCase" />
                  At least one upper case
                </li>
              </div>
              <div class="divider divider-horizontal"></div>
              <div class="flex-1 flex flex-col gap-2">
                <li :class="passwordStatus.status.haveDigit ? 'text-green-300' : 'text-red-400'" class="flex gap-2">
                  <Icon iconName="check" v-show="passwordStatus.status.haveDigit" />
                  <Icon iconName="x" v-show="!passwordStatus.status.haveDigit" />
                  At least one digit
                </li>
                <li :class="passwordStatus.status.haveSymbol ? 'text-green-300' : 'text-red-400'" class="flex gap-2">
                  <Icon iconName="check" v-show="passwordStatus.status.haveSymbol" />
                  <Icon iconName="x" v-show="!passwordStatus.status.haveSymbol" />
                  At least one symbol
                </li>
                <li :class="passwordStatus.status.isCharacterValid ? 'text-green-300' : 'text-red-400'" class="flex gap-2" title="Alphabet must have only A-Z and a-z">
                  <Icon iconName="check" v-show="passwordStatus.status.isCharacterValid" />
                  <Icon iconName="x" v-show="!passwordStatus.status.isCharacterValid" />
                  Only valid character
                </li>
              </div>
            </ul>
            <button @click="handleSubmitNewPassword" :class="{ 'btn-disabled': passwordStatus.warning.length > 0 || password !== confirmPassword }" class="btn btn-primary">Submit</button>
          </div>
        </SlidePage>
    </SlideShow>
  </main>
</template>

<style scoped>
</style>