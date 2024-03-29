<script setup>
import { ref ,computed} from "vue";
import { getUserBy } from "../../libs/userManagement";
import BaseSelectOption from "../components/BaseSelectOption.vue"
const page = ref(1)
const email = ref('')
const showError = ref(false)
const securityQuestions = ref({})
// const selectedQuestionIndexes = computed(() => [securityQuestions.q1.question, securityQuestions.q2.question, securityQuestions.q3.question])

async function handleNext(){
const user = await getUserBy('email', email.value)
console.log(user);
if(user){
    showError.value = false
    securityQuestions.value = user.securityQuestions
    console.log(securityQuestions.value);
    page.value++
    
}
else{
    
    showError.value = true
}
}
</script>
<template>
  <div v-if="page === 1" class="flex flex-col items-center justify-center h-screen gap-3">
    <p class="opacity-75">Please enter your Email</p>
    <input type="text" v-model="email" class="input input-bordered w-full max-w-xs">
    <button class="btn bg-primary" @click="handleNext" >Next</button>
    <p class="text-red-600" v-show="showError" >This email is not existed</p>
  </div>
  <div v-if="page === 2" class="flex flex-col items-center justify-center h-screen gap-3">
    <div v-for="i in 3" :key="i">
        <ResetPasswordQuestionList
		:questionTitle="`Question ${i}`"
		@questionSelect="handleSecurityQuestionSelect('q' + i, $event)"
		:disabledQuestionIndex="selectedQuestionIndexes"
		class="text-sm p-4 rounded-2xl bg-accent text-neutral focus:outline-none"/>
		<input type="text" v-model="securityQuestions['q' + i].answer" class="input input-bordered rounded-xl w-full font-helvetica text-sm" placeholder="Type your answer"/>

    </div>

  </div>
</template>

<style scoped>

</style>