<script setup>
import { ref, watch } from 'vue'
import { upload } from '../../../libs/imageManagement';
import { useUserStore } from '@/stores/user';
import { useToastStore } from '@/stores/toast';
import { updateUserData } from '../../../libs/userManagement';
import UserProfilePlaceholder from '@/components/UserProfilePlaceholder.vue';
import Modal from '@/components/Modal.vue';

const userStore = useUserStore()
const toastStore = useToastStore()
// userStore.loadUserData("2ee4")
const file = ref(null)
const image = ref(null)
const type = ref('avatar')
console.log(userStore.userData.username, userStore.userData.nickname);
const username = ref(userStore.userData.username)
const nickname = ref(userStore.userData.nickname)

const handleSave = async () => {
  const res = await updateUserData(userStore.userData.id, { username: username.value, nickname: nickname.value })
  if (res) {
    toastStore.addToast('Profile updated successfully!', 'success')
    userStore.userData.username = username.value
    userStore.userData.nickname = nickname.value
  }
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
  <Modal :show="true">
    hello
  </Modal>
  <input
    type="file"
    @input="handleFileChange"
    class="hidden"
  />
  <section class="w-full p-10 flex flex-col gap-4">
    <div class="w-full h-24 mb-2 relative">
      <div class="w-full h-full mb-2 absolute border-4 border-base-100 bg-neutral rounded-2xl overflow-hidden">
        <div class="absolute select-none w-full h-full flex justify-center items-center bg-[#0008] opacity-0 hover:opacity-100 transition-opacity">
          <div>Change Cover</div>
        </div>
        <img
          v-if="userStore.userData.setting?.bannerUrl"
          :src="userStore.userData.setting.bannerUrl"
          alt="avatar"
          class="w-full h-full object-cover rounded-2xl"
        />
      </div>
      <div class="avatar absolute">
        <div class="w-24 rounded-2xl border-4 border-base-100 relative">
          <div class="absolute select-none text-sm w-full h-full flex flex-col justify-center items-center bg-[#0008] opacity-0 hover:opacity-100 transition-opacity">
            <div>Change</div>
            <div>Avatar</div>
          </div>
          <img
            v-if="userStore.userData.setting?.avatarUrl"
            :src="userStore.userData.setting.avatarUrl"
            alt="avatar"
            class="w-full h-full object-cover"
          />
          <div v-else>
            <UserProfilePlaceholder
              color="#ff5500"
              bgcolor="#f0f0f0"
              size="100%"
            />
          </div>
        </div>
      </div>
    </div>
    <form @submit.prevent="handleSave" class="flex flex-col gap-10">
      <div class="flex">
        <div class="flex-1 flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <label for="nickname" class="font-semibold text-sm">Display Name</label>
            <input type="text" id="nickname" class="input input-bordered w-full max-w-xs" v-model="nickname">
          </div>
          <div class="flex flex-col gap-2">
            <label for="username" class="font-semibold text-sm">Username</label>
            <input type="text" id="username" class="input input-bordered w-full max-w-xs" v-model="username">
          </div>
        </div>
        <div class="flex-auto flex flex-col gap-2">
          <label for="bio" class="font-semibold text-sm">Bio</label>
          <textarea
            v-model="userStore.userData.bio"
            placeholder="Tell us about yourself..."
            class= "textarea textarea-bordered h-full"
          ></textarea>
        </div>
      </div>
      <input type="submit" value="Save change" class="btn btn-primary w-1/5 ml-auto">
    </form>
    <!-- <input type="radio" id="avatar" name="type" value="avatar" v-model="type" />
    <label for="avatar">Avatar</label>
    <input type="radio" id="banner" name="type" value="banner" v-model="type" />
    <label for="banner">Banner</label> -->
    <!-- <button @click="handleUploadImage" type="button" class="btn btn-warning" :disabled="!file">Upload</button> -->
    <!-- <img v-if="file" :src="image" alt="preview" class="pointer-events-none w-64 h-64 object-contain" /> -->
  </section>

</template>

<style scoped>

</style>