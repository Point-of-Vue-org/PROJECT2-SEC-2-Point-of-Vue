<script setup>
import { computed } from 'vue';
import { checkPassword } from '../../../libs/checkPassword';
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { hash } from '../../../libs/plannetEncrypt';
import { useToastStore } from '@/stores/toast';
import { updateUserData } from '../../../libs/auth';
// const secretKey = import.meta.env.VITE_SECRET_KEY || 'secret'
const userStore = useUserStore()
const password = ref('')
const toast = useToastStore()
const isPasswdValid = computed(()=>{
    console.log(checkPassword(password.value));
    return checkPassword(password.value)
})
function handleSave(){
    if(isPasswdValid.value.isPasswordSecure) {
        // userStore.userData.password = encrypt(password.value)
        // user.saveUserData(user.userData)
        updateUserData(userStore.userData.id, { password: hash(password.value) })
        toast.type = 'success'
        toast.msg = "Save password successfully"
        userStore.loadUserData()
    } else {
        toast.type = "error"
        toast.msg = "Cannot Password not secure"
    }
}


</script>
 
<template>
<div class="flex flex-col pt-5 gap-3 pl-5 w-screen max-w-sm">
    <input type="text" class="input input-bordered w-100" @input="checkPassword(password)" placeholder="Enter new password" v-model="password">
    <p class="text-red-400" v-show=" !isPasswdValid.isPasswordSecure">
    <p v-for ="warn in  isPasswdValid.warning">{{warn}}</p>
    </p>
       

    <button  class="btn btn-primary w-2/4 ml-auto" @click="handleSave">Change Password</button>
</div>
</template>
 
<style scoped>

</style>