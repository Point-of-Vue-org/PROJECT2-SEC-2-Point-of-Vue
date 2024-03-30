<script setup>
import Logo from '@/components/Logo.vue'
import { ref } from 'vue'
import { useToastStore } from '@/stores/toast'
import { useRouter } from 'vue-router'
import { login } from '../../libs/userManagement'
import { encrypt } from '../../libs/plannetEncrypt'

const toastStore = useToastStore()
const router = useRouter()
const errorMsg = ref('')
const usernameOrEmail = ref('')
const password = ref('')

const handleSubmitLogin = async () => {
  const token = await login(usernameOrEmail.value, password.value)
  if (token) {
    router.replace('/')
    toastStore.msg = 'Login success'
    localStorage.setItem('todo_token', encrypt(JSON.stringify(token)))
  } else {
    errorMsg.value = 'Invalid username or password'
  }
}

const handleForgetPassword = () => {
  router.push('/forgot-password')
}

</script>

<template>
  <main class="w-full h-screen grid place-items-center">
    <form @submit.prevent="handleSubmitLogin" class="w-72 xs:w-80 sm:w-96 flex flex-col">
      <div>
        <div class="text-primary mb-4">
          <Logo size="4rem" color="currentColor" />
        </div>
        <p class="text-xl xs:text-2xl mb-2">Login to Plannet</p>
        <p class="text-sm xs:text-base">Welcome to a better way to manage and share your tasks.</p>
      </div>
      <div class="flex flex-col gap-5 mt-6 mb-4">
        <div v-show="errorMsg" class="text-error">{{ errorMsg }}</div>
        <input
          v-model="usernameOrEmail"
          type="text"
          placeholder="Username or Email"
          title="Username or Email"
          autocomplete="username"
          autofocus
          required
          class="input bg-neutral rounded-xl w-full"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          autocomplete="current-password"
          title="Password"
          required
          class="input bg-neutral rounded-xl w-full"
        />
        <button type="submit" class="btn rounded-full btn-accent text-base-100">Login</button>
      </div>
      <div>
        <div @click="handleForgetPassword" class="text-sm xs:text-base text-primary">Forgot password?</div>
        <div class="text-sm xs:text-base">Don't have an account? <RouterLink to="/register" class="text-primary">Sign up</RouterLink></div>
      </div>
    </form>
  </main>
</template>