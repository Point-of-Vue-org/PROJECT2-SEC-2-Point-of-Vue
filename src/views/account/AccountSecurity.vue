<script setup>
import { computed, watch } from 'vue'
import { checkOldPassword, checkPassword } from '../../../libs/validationUtils'
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { hash } from '../../../libs/plannetEncrypt'
import { useToastStore } from '@/stores/toast'
import { deleteUser, updateUserData } from '../../../libs/userManagement'
import Icon from '@/components/Icon.vue'
import { useRouter } from 'vue-router'
import { deletePlan, getPlansBy } from '../../../libs/planManagement'
import Modal from '@/components/Modal.vue'
import { User } from '../../../classes/User'

const toastStore = useToastStore()
const userStore = useUserStore()
const password = ref('')
const confirmPassword = ref('')
const errorMsg = ref('')
const oldPasswd = ref('')
const email = ref('')
const router = useRouter()
const confirmDeleteOpenState = ref(false)
const deleteMessage = ref('')
const lockDelete = computed(() => {
  return deleteMessage.value !== 'delete-' + userStore.userData.username
})
const disabledChangeEmail = computed(() => {
  return email.value.length === 0
})
const disabledChangePassword = computed(() => {
  return password.value.length === 0 || confirmPassword.value.length === 0 || oldPasswd.value.length === 0 || errorMsg.value.length > 0
})

const isPasswdValid = computed(() => {
  return checkPassword(password.value)
})

const handleSaveNewPassword = async () => {
  let isOldPasswdValid = await checkOldPassword(userStore.userData.id,oldPasswd.value)
  if (!isPasswdValid.value.isPasswordValid) {
    toastStore.addToast('Password is invalid', 'error')
    return
  }

  if(!isOldPasswdValid){
    toastStore.addToast('Old password is invalid', 'error')
    return
  }

  if(isOldPasswdValid && isPasswdValid.value.isPasswordValid && password.value === confirmPassword.value){
    const updatedUser = await updateUserData(userStore.userData.id, { password: hash(password.value) })

    if (updatedUser) {
      password.value = ''
      confirmPassword.value = ''
      oldPasswd.value = ''
      userStore.userData.password = hash(password.value)
      toastStore.addToast('Save password successfully', 'success')
    } else {
      toastStore.addToast('Save password failed', 'error')
    }
  }
}

watch([password, confirmPassword], () => {
  if (password.value !== confirmPassword.value) {
    errorMsg.value = 'Password and Confirm Password must match'
  } else {
    errorMsg.value = ''
  }
})

const handleSaveNewEmail = async () => {
  userStore.userData.email = email.value
  try{
    const updatedUser = await updateUserData(userStore.userData.id,userStore.userData)
    if (updatedUser) {
      email.value = ''
      toastStore.addToast('Save email successfully', 'success')
    }
  }
  catch(e){
    toastStore.addToast('Email is invalid', 'error')
  }
}

async function handleDeleteAccount(){

  const postPlans = await getPlansBy('authorId', userStore.userData.id, 'post')
  const draftPlans = await getPlansBy('userId', userStore.userData.id, 'draft')
  const activePlans = await getPlansBy('userId', userStore.userData.id, 'active')

  postPlans.forEach(async plan => {
    const res = await deletePlan(plan.id, 'post')
  })

  draftPlans.forEach(async plan => {
    const res = await deletePlan(plan.id, 'draft')
  })

  activePlans.forEach(async plan => {
    const res = await deletePlan(plan.id, 'active')
  })

  localStorage.removeItem('plannet_token')
  await deleteUser(userStore.userData.id)
  userStore.userData = new User()
  
  toastStore.addToast('Delete account successfully', 'error')
  router.push('/')
}

function handleSetOpenDeleteModal(state) {
  confirmDeleteOpenState.value = state
}

</script>

<template>
  <Modal :show="confirmDeleteOpenState" @bgClick="handleSetOpenDeleteModal(false)">
    <div class="flex items-center flex-col w-11/12 max-w-[34rem] h-96 rounded-2xl justify-center bg-base-100 gap-2">
      <div class="text-2xl">Please confirm to <span class="text-primary">delete your account</span></div>
      <!-- <Icon iconName="globe" scale="6" size="8rem" /> -->
      <div class="text-secondary">Once you delete your account, it can't be undone.</div>
      <div class="flex flex-col justify-center gap-5 pt-5 min-w-52 w-[70%]">
        <div class="flex flex-col gap-1">
          <div>Type "<span class="italic">delete-{{ userStore.userData.username }}</span>" to confirm</div>
          <input v-model="deleteMessage" type="text" class="input input-bordered w-full placeholder:italic" :placeholder="`delete-` + userStore.userData.username" />
        </div>
        <div class="flex flex-col gap-2">
          <button class="btn btn-sm btn-error btn-outline border-2 text-[0.9] font-helvetica" @click="handleDeleteAccount" :disabled="lockDelete">Confirm delete</button>
          <button class="btn btn-sm btn-secondary text-[0.9rem] font-helvetica" @click="handleSetOpenDeleteModal(false)">Cancel</button>
        </div>
      </div>
    </div>
  </Modal>
  <div class="flex flex-col gap-4 w-full">
    <div class="w-full p-10 flex flex-col gap-4">
      <div class="flex flex-col">
        <div class="text-2xl font-helvetica font-bold">Change Account Email</div>
        <div class="divider divider-secondary opacity-80 w-full max-w-[40rem] landscape:md:max-w-[50rem]"></div>
      </div>
      <div class="flex flex-col gap-3 max-w-sm">
        <input v-model="email" placeholder="Type your new email" type="email" class="input input-bordered"/>
        <button class="btn btn-primary text-base-100 w-fit" @click="handleSaveNewEmail" :disabled="disabledChangeEmail">Change</button>
      </div>
    </div>
    
    <div class="w-full p-10 flex flex-col gap-4">
      <div class="flex flex-col mt-3">
        <div class="text-2xl font-helvetica font-bold">Password Reset</div>
        <div class="divider divider-secondary opacity-80 w-full max-w-[40rem] landscape:md:max-w-[50rem]"></div>
      </div>
      <div class="flex flex-col gap-2">
        <div>Your old password</div>
        <input v-model="oldPasswd" type="password" class="input input-bordered max-w-sm">
        <div>New password</div>
        <input v-model="password" type="password" class="input input-bordered max-w-sm" @input="checkPassword(password)">
        <div>Confirm new password</div>
        <input v-model="confirmPassword" type="password" autocomplete="new-password" title="Confirm password" required
          class="input input-bordered max-w-sm" />
        <div class="text-xs text-orange-400">{{ errorMsg }}</div>
        <ul class="text-xs flex cursor-default max-w-sm">
          <div class="flex-1 flex flex-col gap-2">
            <li
              :class="isPasswdValid.status.isLengthValid && isPasswdValid.status.isMaxLengthValid ? 'text-green-300' : 'text-red-400'"
              class="flex gap-2 items-center">
              <Icon iconName="check"
                v-show="isPasswdValid.status.isLengthValid && isPasswdValid.status.isMaxLengthValid" />
              <Icon iconName="x" v-show="!isPasswdValid.status.isLengthValid || !isPasswdValid.status.isMaxLengthValid" />
              Must have 8-30 characters
            </li>
            <li :class="isPasswdValid.status.haveLowerCase ? 'text-green-300' : 'text-red-400'" class="flex gap-2 ">
              <Icon iconName="check" v-show="isPasswdValid.status.haveLowerCase" />
              <Icon iconName="x" v-show="!isPasswdValid.status.haveLowerCase" />
              At least one lower case
            </li>
            <li :class="isPasswdValid.status.haveUpperCase ? 'text-green-300' : 'text-red-400'" class="flex gap-2">
              <Icon iconName="check" v-show="isPasswdValid.status.haveUpperCase" />
              <Icon iconName="x" v-show="!isPasswdValid.status.haveUpperCase" />
              At least one upper case
            </li>
          </div>
          <div class="divider divider-horizontal"></div>
          <div class="flex-1 flex flex-col gap-2">
            <li :class="isPasswdValid.status.haveDigit ? 'text-green-300' : 'text-red-400'" class="flex gap-2">
              <Icon iconName="check" v-show="isPasswdValid.status.haveDigit" />
              <Icon iconName="x" v-show="!isPasswdValid.status.haveDigit" />
              At least one digit
            </li>
            <li :class="isPasswdValid.status.haveSymbol ? 'text-green-300' : 'text-red-400'" class="flex gap-2">
              <Icon iconName="check" v-show="isPasswdValid.status.haveSymbol" />
              <Icon iconName="x" v-show="!isPasswdValid.status.haveSymbol" />
              At least one symbol
            </li>
            <li :class="isPasswdValid.status.isCharacterValid ? 'text-green-300' : 'text-red-400'" class="flex gap-2"
              title="Alphabet must have only A-Z and a-z">
              <Icon iconName="check" v-show="isPasswdValid.status.isCharacterValid" />
              <Icon iconName="x" v-show="!isPasswdValid.status.isCharacterValid" />
              Only valid character
            </li>
          </div>
        </ul>
      </div>
      <button class="btn btn-primary w-40" @click="handleSaveNewPassword" :disabled="disabledChangePassword">Change Password</button>
    </div>

    <div class="w-full p-10 flex flex-col gap-4">
      <div class="flex flex-col border border-error rounded-2xl p-8">
        <div class="text-2xl font-helvetica font-bold text-red-600">Danger Zone</div>
        <div class="divider divider-secondary opacity-80 w-full max-w-[20rem] portrait:md:max-w-[40rem] landscape:md:max-w-[50rem]"></div>
        <button class="btn btn-error w-1/2" @click="handleSetOpenDeleteModal(true)">Delete Account</button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>