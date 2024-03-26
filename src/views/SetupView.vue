<script setup>
import { useUserStore } from '@/stores/user';
import { updateUserData } from '../../libs/userManagement';
import { useToastStore } from '@/stores/toast';
import { useRouter, RouterLink } from 'vue-router';
import { ref } from 'vue';

const router = useRouter()
const userStore = useUserStore() 
const toastStore = useToastStore()
const nickname = ref('')
const handleSubmitNickname = async () => {
    if (nickname.value === '') return 
    try {
        const res = await updateUserData(userStore.userData.id, { hasSetup: true, nickname: nickname.value })
        if(res){
            userStore.userData.nickname = res.nickname
            toastStore.addToast('Successfully', 'success')
            router.push('/')
        }
    } catch (error) {
        toastStore.addToast('Error occured', 'error')
    }
}
const handleSkip = async () => {
    nickname.value = 'Guest'
    await handleSubmitNickname()
}
</script>
 
<template>
<main class="w-full h-screen grid place-items-center">
    <form  @submit.prevent="handleSubmitNickname" class="flex flex-col w-[50rem] items-center gap-7">
        <div class="text-3xl text-primary font-helvetica w-fit">Do you want to show your nickname for everyone ?</div>
        <div class="flex gap-5">
            <input v-model="nickname" type="text" class="input input-bordered rounded-xl w-96 font-helvetica" placeholder="Type your nickname" />
            <button type="submit" class="btn btn-primary text-[1rem] font-bold text-base-100">Save</button>
        </div>
        <button @click="handleSkip" class="text-accent text-[1.2rem] absolute right-24 bottom-24 font-bold hover:text-secondary">Skip</button>
    </form>
</main>
</template>
 
<style scoped>

</style>