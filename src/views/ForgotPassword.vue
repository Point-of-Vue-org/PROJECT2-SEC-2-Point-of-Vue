<script setup>
import { ref, computed, reactive } from "vue";
import { getUserBy } from "../../libs/userManagement";
import BaseSelectOption from "../components/BaseSelectOption.vue";
import ResetPasswordQuestionList from "@/components/ResetPasswordQuestionList.vue";
import Icon from "@/components/Icon.vue";
import SlidePage from "@/components/slide/SlidePage.vue";
import SlideShow from "@/components/slide/SlideShow.vue";
import Logo from "@/components/Logo.vue";


const page = ref(1);
const email = ref("");
const showError = ref(false);
const securityQuestions = ref({});
const answers = reactive({
  q1: '',
  q2: '',
  q3: ''
})
const disableForgetPasswordNextBtn = computed(()=>{
  return Object.values(answers).some(answer => {
    return answer === '';
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
]);
// const selectedQuestionIndexes = computed(() => [securityQuestions.q1.question, securityQuestions.q2.question, securityQuestions.q3.question])

async function handleNext() {
  const user = await getUserBy("email", email.value);
  console.log(user);
  if (user) {
    showError.value = false;
    securityQuestions.value = user.securityQuestions;
    console.log(securityQuestions.value);
    page.value++;
  } else {
    showError.value = true;
  }
}
function handlePreviousPage() {
  page.value--;
}

function handleCheckAnswers() {
  const isAllCorrect = securityQuestions.value.q1.answer === answers.q1 && securityQuestions.value.q2.answer === answers.q2 && securityQuestions.value.q3.answer === answers.q3;
  if (isAllCorrect) {
    showError.value = false
    page.value++;
  }
  else {
    showError.value = true;
  }
}
</script>
<template>
  <main class="w-full h-screen overflow-hidden relative">
    <SlideShow :pageAmount="3" :currentPage="page">
      <SlidePage :page="1" :currentPage="page" translate="scale">
        <p class="opacity-75">Please enter your Email</p>
        <input
          type="text"
          v-model="email"
          class="input input-bordered w-full max-w-xs"
        />
        <button class="btn bg-primary" @click="handleNext">Next</button>
        <p class="text-red-600" v-show="showError">This email is not existed</p>
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
          <p class="z-50">dfskjadskldsajaskjdkdfsjlkasfjdsklajkldsjkladsfj</p>
        </SlidePage>
    </SlideShow>
  </main>
</template>

<style scoped>
</style>