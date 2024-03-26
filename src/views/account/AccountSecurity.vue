<script setup>
import { computed } from 'vue';
import { checkPassword } from '../../../libs/validationUtils';
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { hash } from '../../../libs/plannetEncrypt';
import { useToastStore } from '@/stores/toast';
import { updateUserData } from '../../../libs/userManagement';
import Icon from '@/components/Icon.vue';

const toastStore = useToastStore()
const userStore = useUserStore()
const password = ref('')
const confirmPassword = ref('')
const errorMsg = ref('')
const isPasswdValid = computed(()=>{
    return checkPassword(password.value)
})
function handleSave(){
    if(!isPasswdValid.value.isPasswordValid) {
        toastStore.addToast('Password is invalid', 'error')
        return
        // userStore.userData.password = encrypt(password.value)
        // user.saveUserData(user.userData)
    } else {
        updateUserData(userStore.userData.id, { password: hash(password.value) })
        toastStore.addToast('Save password successfully', 'success')
        userStore.loadUserData()
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
<div class="w-full p-10 flex flex-col gap-4">
    <div class="flex flex-col">
        <div class="text-2xl font-helvetica font-bold">Password Reset</div>
        <div class="divider divider-primary w-[60rem]"></div>
    </div>
    <div class="flex flex-col gap-2 w-fit">
        <div>New password</div>
        <input v-model="password" type="password" class="input input-bordered" @input="checkPassword(password)">
        <div>Confirm new password</div>

        <input v-model="confirmPassword" type="password" autocomplete="new-password"
              title="Confirm password" required class="input input-bordered" />
        <div class="text-xs text-orange-400">{{ errorMsg }}</div>
        <ul class="text-xs flex cursor-defaul">
              <div class="flex flex-col gap-2">
                <li :class="isPasswdValid.status.isLengthValid && isPasswdValid.status.isMaxLengthValid ? 'text-green-300' : 'text-red-400'" class="flex gap-2 items-center">
                  <Icon iconName="check" v-show="isPasswdValid.status.isLengthValid && isPasswdValid.status.isMaxLengthValid" />
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
                <li :class="isPasswdValid.status.isCharacterValid ? 'text-green-300' : 'text-red-400'" class="flex gap-2" title="Alphabet must have only A-Z and a-z">
                  <Icon iconName="check" v-show="isPasswdValid.status.isCharacterValid" />
                  <Icon iconName="x" v-show="!isPasswdValid.status.isCharacterValid" />
                  Only valid character
                </li>
              </div>
            </ul>
    </div>
        <button class="btn btn-primary w-40" @click="handleSave">Change Password</button>
</div>
</template>

<style scoped>

</style>