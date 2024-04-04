<script setup>
import Logo from '@/components/Logo.vue'
import { compute, ref, watch } from 'vue'
import { useToastStore } from '@/stores/toast'
import { isEmailExist, isUsernameExist, register } from '../../libs/userManagement';
import { useRouter } from 'vue-router'
import { checkPassword } from '../../libs/validationUtils';
import Icon from '@/components/Icon.vue';
import { validateUsername } from '../../libs/validationUtils';

const toastStore = useToastStore()
const router = useRouter()
const errorMsg = ref('')
const isLoading = ref(false)
const username = ref('')
const usernameStatus = computed(() => {
  return validateUsername(username.value)
})
const email = ref('')
const password = ref('')
const passwordStatus = computed(()=>{
  return checkPassword(password.value)
})
const confirmPassword = ref('')

const handleSubmitRegister = async () => {
  if (await isUsernameExist(username.value)) {
    errorMsg.value = 'Username already exists'
    return
  }

  if (usernameStatus.value.warning.length > 0) {
    return
  }

  if (await isEmailExist(email.value)) {
    errorMsg.value = 'Email already exists'
    return
  }

  if(!passwordStatus.value.isPasswordValid){
    toastStore.addToast('Password is invalid', 'error')
    return
  }

  if (password.value !== confirmPassword.value) return

  errorMsg.value = ''
  isLoading.value = true
  const res = await register(username.value, email.value, password.value)
  if (res) {
    isLoading.value = false
    router.replace('/login')
    toastStore.addToast('Register success', 'success')
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
  <main class="w-full h-svh sm:h-screen grid place-items-center">
    <form @submit.prevent="handleSubmitRegister" class="w-72 xs:w-80 sm:w-96 flex flex-col">
      <div>
        <div class="text-primary mb-4">
          <Logo size="4rem" color="currentColor" />
        </div>
        <p class="text-xl xs:text-2xl mb-2">Sign up for Plannet</p>
        <p class="text-sm xs:text-base">Welcome to a better way to manage and share your tasks.</p>
      </div>
      <div class="flex flex-col gap-3 mt-1 mb-4">
        <div v-show="!passwordStatus.value?.isPasswordSecure" class="text-error">{{ passwordStatus.value?.warning }}</div>
        <input v-model="username" type="text" placeholder="Username" autocomplete="username" title="Username" autofocus
          required class="input bg-neutral rounded-xl w-full" />
        <input v-model="email" type="email" placeholder="Email" autocomplete="email" title="Email" required
          class="input bg-neutral rounded-xl w-full">
        <input v-model="password" type="password" placeholder="Password" autocomplete="new-password" title="Password"
          required class="input bg-neutral rounded-xl w-full" />
        <input v-model="confirmPassword" type="password" placeholder="Confirm password" autocomplete="new-password"
          title="Confirm password" required class="input bg-neutral rounded-xl w-full" />
        <div class="text-orange-400 text-xs">{{ errorMsg }}</div>
        <div v-for="waring in usernameStatus.warning" class="text-orange-400 text-xs">{{ waring }}</div>
        <ul class="text-[0.6rem] sm:text-[0.7rem] md:text-xs flex cursor-default">
          <div class="flex-1 flex flex-col gap-1 sm:gap-2">
            <li :class="passwordStatus.status.isLengthValid && passwordStatus.status.isMaxLengthValid ? 'text-green-300' : 'text-red-400'" class="flex gap-2 items-center">
              <Icon iconName="check" v-show="passwordStatus.status.isLengthValid && passwordStatus.status.isMaxLengthValid" />
              <Icon iconName="x" v-show="!passwordStatus.status.isLengthValid || !passwordStatus.status.isMaxLengthValid" />
              Must have 8-30 characters
            </li>
            <li :class="passwordStatus.status.haveLowerCase ? 'text-green-300' : 'text-red-400'" class="flex gap-2 items-center">
              <Icon iconName="check" v-show="passwordStatus.status.haveLowerCase" />
              <Icon iconName="x" v-show="!passwordStatus.status.haveLowerCase" />
              At least one lower case
            </li>
            <li :class="passwordStatus.status.haveUpperCase ? 'text-green-300' : 'text-red-400'" class="flex gap-2 items-center">
              <Icon iconName="check" v-show="passwordStatus.status.haveUpperCase" />
              <Icon iconName="x" v-show="!passwordStatus.status.haveUpperCase" />
              At least one upper case
            </li>
          </div>
          <div class="w-1 xs:w-4 divider divider-horizontal"></div>
          <div class="flex-1 flex flex-col gap-2">
            <li :class="passwordStatus.status.haveDigit ? 'text-green-300' : 'text-red-400'" class="flex gap-2 items-center">
              <Icon iconName="check" v-show="passwordStatus.status.haveDigit" />
              <Icon iconName="x" v-show="!passwordStatus.status.haveDigit" />
              At least one digit
            </li>
            <li :class="passwordStatus.status.haveSymbol ? 'text-green-300' : 'text-red-400'" class="flex gap-2 items-center">
              <Icon iconName="check" v-show="passwordStatus.status.haveSymbol" />
              <Icon iconName="x" v-show="!passwordStatus.status.haveSymbol" />
              At least one symbol
            </li>
            <li :class="passwordStatus.status.isCharacterValid ? 'text-green-300' : 'text-red-400'" class="flex gap-2 items-center" title="Alphabet must have only A-Z and a-z">
              <Icon iconName="check" v-show="passwordStatus.status.isCharacterValid" />
              <Icon iconName="x" v-show="!passwordStatus.status.isCharacterValid" />
              Only valid character
            </li>
          </div>
        </ul>
        <button type="submit" class="btn rounded-full btn-accent text-base-100">Sign up</button>
      </div>
      <div>
        <p class="text-sm xs:text-base">Do you have an account? <RouterLink to="/login" class="text-primary">Login</RouterLink>
        </p>
      </div>
    </form>
  </main>
</template>