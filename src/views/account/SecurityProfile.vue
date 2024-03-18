<script setup>
import { computed } from 'vue';
import { checkPassword } from '../../../libs/checkPassword';
import { ref } from 'vue';
const password = ref('')

const isOk = computed(()=>{
    console.log(checkPassword(password.value));
    return checkPassword(password.value)
})
</script>
 
<template>
<div class="flex flex-col pt-5 gap-3 pl-5 w-screen max-w-sm">
    <input type="text" class="input input-bordered w-100" @input="checkPassword(password)" placeholder="Enter new password" v-model="password">
    <p class="text-red-400" v-show=" !isOk.isPasswordSecure">
    <p v-for ="warn in isOk.warning">{{warn }}</p>
    </p>
       

    <input type="submit" value="Change Password" class="btn btn-primary w-2/4 ml-auto">
</div>
</template>
 
<style scoped>

</style>