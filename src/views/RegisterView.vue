<script setup>
import Logo from '@/components/Logo.vue'
import { computed, reactive, ref, watch } from 'vue'
import { useToastStore } from '@/stores/toast'
import { isEmailExist, isUsernameExist, register } from '../../libs/userManagement';
import { useRouter } from 'vue-router'
import { checkPassword } from '../../libs/passwordValidation';
import Icon from '@/components/Icon.vue';

const toastStore = useToastStore()
const router = useRouter()
const errorMsg = ref('')
const isLoading = ref(false)
const result = computed(()=>{
  return checkPassword(password.value)
})
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')



const handleSubmitRegister = async () => {
  if (await isUsernameExist(username.value)) {
    errorMsg.value = 'Username already exists'
    return
  }

  if (await isEmailExist(email.value)) {
    errorMsg.value = 'Email already exists'
    return
  }

  if (password.value !== confirmPassword.value) return

  errorMsg.value = ''
  isLoading.value = true
  const res = await register(username.value, email.value, password.value)
  if (res) {
    isLoading.value = false
    router.replace('/login')
    toastStore.msg = 'Register success'
  }
}

watch([password, confirmPassword], () => {
  if (password.value !== confirmPassword.value) {
    errorMsg.value = 'Password and Confirm Password must match'
  } else {
    errorMsg.value = ''
  }
})


</script>

<template>
  <main class="w-full h-screen grid place-items-center">
    <form @submit.prevent="handleSubmitRegister" class=" w-96 flex flex-col">
      <div>
        <div class="text-primary mb-4">
          <Logo size="4rem" color="currentColor" />
        </div>
        <p class="text-2xl mb-2">Sign up for Plannet</p>
        <p>Welcome to a workspace that's secure, powerful, and totally private.</p>
      </div>
      <div class="flex flex-col gap-3 mt-1  mb-4">
        <div v-show="!result.value?.isPasswordSecure" class="text-error">{{ result.value?.warning }}</div>
        <input v-model="username" type="text" placeholder="Username" autocomplete="username" title="Username" autofocus
          required class="input bg-neutral rounded-xl w-96" />
        <input v-model="email" type="email" placeholder="Email" autocomplete="email" title="Email" required
          class="input bg-neutral rounded-xl w-96">
        <input v-model="password" type="text" placeholder="Password" autocomplete="new-password" title="Password"
          required class="input bg-neutral rounded-xl w-full" />
        <input v-model="confirmPassword" type="password" placeholder="Confirm password" autocomplete="new-password"
          title="Confirm password" required class="input bg-neutral rounded-xl w-full" />
          <ul class="text-sm flex flex-col gap-3">
              <li :class="result.status.isLengthValid && result.status.isMaxLengthValid ? 'text-green-300' : 'text-red-400'" class="flex gap-2 items-center">
                <Icon iconName="check" v-show="result.status.isLengthValid && result.status.isMaxLengthValid" />
                <Icon iconName="x" v-show="!result.status.isLengthValid || !result.status.isMaxLengthValid" />
                Must have 8-30 characters
              </li>
              <li :class="result.status.haveLowerCase ? 'text-green-300' : 'text-red-400'" class="flex gap-2 items-center">
                <Icon iconName="check" v-show="result.status.haveLowerCase" />
                <Icon iconName="x" v-show="!result.status.haveLowerCase" />
                At least one lower case character
              </li>
              <li :class="result.status.haveUpperCase ? 'text-green-300' : 'text-red-400'" class="flex gap-2 items-center">
                <Icon iconName="check" v-show="result.status.haveUpperCase" />
                <Icon iconName="x" v-show="!result.status.haveUpperCase" />
                At least one upper case character
              </li>
              <li :class="result.status.haveDigit ? 'text-green-300' : 'text-red-400'" class="flex gap-2 items-center">
                <Icon iconName="check" v-show="result.status.haveDigit" />
                <Icon iconName="x" v-show="!result.status.haveDigit" />
                At least one digit
              </li>
              <li :class="result.status.haveSymbol ? 'text-green-300' : 'text-red-400'" class="flex gap-2 items-center">
                <Icon iconName="check" v-show="result.status.haveSymbol" />
                <Icon iconName="x" v-show="!result.status.haveSymbol" />
                At least one special character
              </li>
              <!-- <li :class="{'text-green-300' : result.isLengthValid, 'text-red-400' : !result.isLengthValid}">At least 8 characters long</li>
              <li :class="{'text-green-300' : result.isCharacterValid, 'text-red-400' : !result.isCharacterValid}">Contain upper case, lower case, digits and special characters</li>
              <li :class="{'text-green-300' : result.haveLowerCase, 'text-red-400' : !result.haveLowerCase}">At least one lower case character</li>
              <li :class="{'text-green-300' : result.haveUpperCase, 'text-red-400' : !result.haveUpperCase}">At least one upper case character</li>
              <li :class="{'text-green-300' : result.haveDigit, 'text-red-400' : !result.haveDigit}">At least one digit</li>
              <li :class="{'text-green-300' : result.haveSymbol, 'text-red-400' : !result.haveSymbol}">At least one special character</li>
              <li :class="{'text-green-300' : result.isMaxLengthValid, 'text-red-400' : !result.isMaxLengthValid}">Password must be less than 30 characters long</li> -->
            </ul>
          <div class="text-orange-400 text-sm">{{ errorMsg }}</div>
        <button type="submit" class="btn rounded-full btn-accent text-base-100">Sign up</button>
      </div>
      <div>
        <p>Do you have an account? <RouterLink to="/login" class="text-primary">Login</RouterLink>
        </p>
      </div>
    </form>
  </main>
</template>