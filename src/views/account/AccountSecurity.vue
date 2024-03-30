<script setup>
import { computed, watch } from 'vue';
import { checkOldPassword, checkPassword } from '../../../libs/validationUtils';
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { hash } from '../../../libs/plannetEncrypt';
import { useToastStore } from '@/stores/toast';
import { deleteUser, updateUserData } from '../../../libs/userManagement';
import Icon from '@/components/Icon.vue';
import { useRouter } from 'vue-router';
import { logout } from '../../../libs/userManagement';

const toastStore = useToastStore()
const userStore = useUserStore()
const password = ref('')
const confirmPassword = ref('')
const errorMsg = ref('')
const oldPasswd = ref('')
const email = ref('')
const router = useRouter()

const isPasswdValid = computed(() => {
  return checkPassword(password.value)
})
async function handleSave() {
  let isOldPasswdValid = await checkOldPassword(userStore.userData.id,oldPasswd.value)
  if (!isPasswdValid.value.isPasswordValid) {
    toastStore.addToast('Password is invalid', 'error')
    return
    // userStore.userData.password = encrypt(password.value)
    // user.saveUserData(user.userData)
  }
 
  if(!isOldPasswdValid){
    toastStore.addToast('Old password is invalid', 'error')
    return
  }
   
  if(isOldPasswdValid && isPasswdValid.value.isPasswordValid && password.value === confirmPassword.value){

    await updateUserData(userStore.userData.id, { password: hash(password.value) })
    console.log("save success");
    toastStore.addToast('Save password successfully', 'success')
    await userStore.loadUserData()
  }
}
watch([password, confirmPassword], () => {
  if (password.value !== confirmPassword.value) {
    errorMsg.value = 'Password and Confirm Password must match'
  } else {
    errorMsg.value = ''
  }
})

function handleEmailChange() {
  userStore.userData.email = email.value
  try{
    updateUserData(userStore.userData.id,userStore.userData)
    toastStore.addToast('Save email successfully', 'success')

  }
  catch(e){
    console.log(e)
    toastStore.addToast('Email is invalid', 'error')
  }
}
function handleDeleteAccount(){
  logout(userStore.userData.id)
  deleteUser(userStore.userData.id)
  
  toastStore.addToast('Delete account successfully', 'error')
  router.push('/')
}
  


</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="w-full p-10 flex flex-col gap-4">
      <div class="flex flex-col">
        <div class="text-2xl font-helvetica font-bold">Password Reset</div>
        <div class="divider divider-primary w-[60rem]"></div>
      </div>
      <div class="flex flex-col gap-2 w-fit">
        <div>Your Old password</div>
        <input v-model="oldPasswd" type="password" class="input input-bordered">
        <div>New password</div>
        <input v-model="password" type="password" class="input input-bordered" @input="checkPassword(password)">
        <div>Confirm new password</div>
        <input v-model="confirmPassword" type="password" autocomplete="new-password" title="Confirm password" required
          class="input input-bordered" />
        <div class="text-xs text-orange-400">{{ errorMsg }}</div>
        <ul class="text-xs flex cursor-defaul">
          <div class="flex flex-col gap-2">
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
      <button class="btn btn-primary w-40" @click="handleSave">Change Password</button>
    </div>
    
    <div class="w-full p-10 flex flex-col gap-4">
      <div class="flex flex-col">
        <div class="text-2xl font-helvetica font-bold">Change Account Email</div>
        <div class="divider divider-primary w-[60rem]"></div>
      </div>
      <div class="flex flex-col gap-2 w-1/3">
        <div>Change Email</div>
        <input v-model="email" placeholder="Type your new email" type="email" class="input input-bordered"/>
        <button class="btn bg-primary text-black" @click="handleEmailChange">Confirm Change</button>
      </div>
      <div class="flex flex-col">
        <div class="text-2xl font-helvetica font-bold text-red-600">Danger Zone</div>
        <div class="divider divider-primary w-[60rem]"></div>
        <button class="btn bg-error w-1/2" @click="handleDeleteAccount">Delete Account</button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>