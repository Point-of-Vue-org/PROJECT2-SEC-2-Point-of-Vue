<script setup>
import { ref, watch } from 'vue'
import { upload } from '../../../libs/imageManagement';
import { useUserStore } from '@/stores/user';
import { useToastStore } from '@/stores/toast';
import { updateUserData } from '../../../libs/userManagement';

const userStore = useUserStore()
const toastStore = useToastStore()
// userStore.loadUserData("2ee4")
const file = ref(null)
const image = ref(null)
const type = ref('avatar')

const handleSave = async ({ id, ...updatedData }) => {
  const res = await updateUserData(id, updatedData)
  if (res) toastStore.addToast('Profile updated successfully!', 'success')
  else toastStore.addToast('Failed to update profile!', 'error')
}

const handleFileChange = (e) => {
  file.value = e.target.files[0]
}

const handleUploadImage = async () => {
  if (!file.value) return

  let imageURL = ''
  try {
    imageURL = await upload(file.value)
  } catch (error) {
    console.error(error)
  } finally {
    file.value = null
  }

  const res = await updateUserData(userStore.userData.id, {
    setting: type.value === 'avatar'
      ? { avatarUrl: imageURL }
      : { bannerUrl: imageURL }
  })

  if (res) {
    toastStore.addToast(`Change ${type.value === 'avatar' ? 'avatar' : 'cover'} image successfully!`, 'success')
    userStore.userData.setting[`${type.value}Url`] = imageURL
  }
  else toastStore.addToast(`Failed to change ${type.value === 'avatar' ? 'avatar' : 'cover'} image!`, 'error')

  // await userStore.saveUserData({
  //   setting: type.value === 'avatar'
  //     ? { avatarUrl: imageURL }
  //     : { bannerUrl: imageURL }
  // })
}

watch(file, (newFile) => {
  console.log(newFile)
  if (newFile) {
    const reader = new FileReader()
    reader.onload = (e) => {
      image.value = e.target.result
    }
    reader.readAsDataURL(newFile)
  }

  if (!newFile) {
    image.value = null
  }
})
</script>

<template>
  <section class="w-full">
    <input
      type="file"
      @input="handleFileChange"
      class="file-input file-input-bordered w-full max-w-xs"
    />
    <input type="radio" id="avatar" name="type" value="avatar" v-model="type" />
    <label for="avatar">Avatar</label>
    <input type="radio" id="banner" name="type" value="banner" v-model="type" />
    <label for="banner">Banner</label>
    <button @click="handleUploadImage" type="button" class="btn btn-warning" :disabled="!file">Upload</button>
    <img v-if="file" :src="image" alt="preview" class="pointer-events-none w-64 h-64 object-contain" />
  </section>

  <form class="flex flex-col pt-5 gap-3 pl-5" @submit.prevent="handleSave">
  
  <label for="username">User Name</label>
  <input type="text" id ="username" class="input input-bordered w-full max-w-xs"  v-model="userStore.userData.username">
  <label for="nickname">Nickname</label>
  <input type="text" id ="nickname" class="input input-bordered w-full max-w-xs"  v-model="userStore.userData.nickname">
  <label for="bio">Bio</label>
  <textarea class= "textarea textarea-accent" v-model="userStore.userData.bio"></textarea>
  <input type="submit" value="Save" class="btn btn-primary w-1/5 ml-auto">
 </form>
</template>

<style scoped>

</style>