<script setup>
import { ref, watch, computed } from 'vue'
import { upload } from '../../../libs/imageManagement';
import { useUserStore } from '@/stores/user';
import { useToastStore } from '@/stores/toast';
import { updateUserData } from '../../../libs/userManagement';
import UserProfilePlaceholder from '@/components/UserProfilePlaceholder.vue';
import { validateNickname } from '../../../libs/validationUtils';
import LoadingModal from '@/components/LoadingModal.vue';

const isLoading = ref(false)
const userStore = useUserStore()
const toastStore = useToastStore()
const currentAvatarFile = ref(null)
const currentAvatar = computed(() => {
  return currentAvatarFile.value
    ? URL.createObjectURL(currentAvatarFile.value)
    : userStore.userData.setting?.avatarUrl
})
const currentBannerFile = ref(null)
const currentBanner = computed(() => {
  return currentBannerFile.value
    ? URL.createObjectURL(currentBannerFile.value)
    : userStore.userData.setting?.bannerUrl
})
const username = ref(userStore.userData.username)
const nickname = ref(userStore.userData.nickname)
const bio = ref(userStore.userData.bio)

const disabledSave = computed(() => {
  return (username.value === userStore.userData.username || !username.value)
    && (nickname.value === userStore.userData.nickname || !nickname.value)
    && (bio.value === userStore.userData.bio)
    && currentAvatarFile.value === null
    && currentBannerFile.value === null
})

const handleImageFileChange = (e, imageType) => {
  if (!e.target.files.length) return

  const supportedTypes = ['image/jpeg', 'image/png']

  if (e.target.files[0].size > 1024 * 1024 * 5) {
    toastStore.addToast('Image size must be less than 5MB!', 'error')
    return
  }

  if (!supportedTypes.includes(e.target.files[0].type)) {
    toastStore.addToast('Invalid image type! Only JPEG and PNG are allowed.', 'error')
    return
  }

  if (imageType === 'avatar') currentAvatarFile.value = e.target.files[0]
  else currentBannerFile.value = e.target.files[0]
}

const handleSave = async () => {
  isLoading.value = true
  const updatedData = {
    username: username.value,
    nickname: nickname.value,
    bio: bio.value,
    setting: {
      avatarUrl: userStore.userData.setting?.avatarUrl,
      bannerUrl: userStore.userData.setting?.bannerUrl
    }
  }

  if (username.value === userStore.userData.username || username.value === '') delete updatedData.username

  if (nickname.value === userStore.userData.nickname || nickname.value === '') delete updatedData.nickname

  if (bio.value === userStore.userData.bio) delete updatedData.bio

  const nicknameStatus = validateNickname(nickname.value)
  if (!nicknameStatus.isNicknameValid) {
    isLoading.value = false
    toastStore.addToast(nicknameStatus.warning, 'error')
    return
  }

  if (currentAvatarFile.value) {
    const newAvatarUrl = await upload(currentAvatarFile.value)
    updatedData.setting.avatarUrl = newAvatarUrl
  }

  if (currentBannerFile.value) {
    const newBannerUrl = await upload(currentBannerFile.value)
    updatedData.setting.bannerUrl = newBannerUrl
  }

  const res = await updateUserData(userStore.userData.id, updatedData)
  isLoading.value = false
  if (res) {
    toastStore.addToast('Profile updated successfully!', 'success')
    if (updatedData.username) userStore.userData.username = updatedData.username
    if (updatedData.nickname) userStore.userData.nickname = updatedData.nickname
    userStore.userData.bio = updatedData.bio
    userStore.userData.setting.avatarUrl = updatedData.setting.avatarUrl
    userStore.userData.setting.bannerUrl = updatedData.setting.bannerUrl

    currentAvatarFile.value = null
    currentBannerFile.value = null
  }
  else toastStore.addToast('Failed to update profile!', 'error')
}
</script>

<template>
  <LoadingModal :show="isLoading" text="Saving change..." />
  <input
    id="banner-input"
    type="file"
    @change="handleImageFileChange($event, 'banner')"
    class="hidden"
    accept="image/jpeg, image/png"
    title="Upload cover image"
  />
  <input
    id="avatar-input"
    type="file"
    @change="handleImageFileChange($event, 'avatar')"
    class="hidden"
    accept="image/jpeg, image/png"
    title="Upload avatar image"
  />
  <section class="w-full p-10 flex flex-col gap-4">
    <div class="w-full h-24 mb-2 relative">
      <div class="w-full h-full mb-2 absolute border-4 border-base-100 bg-neutral rounded-2xl overflow-hidden">
        <label
          for="banner-input"
          class="absolute select-none w-full h-full flex justify-center items-center bg-[#0008] opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
        >
          <div>Change Cover</div>
        </label>
        <img
          v-if="currentBanner"
          :src="currentBanner"
          alt="avatar"
          class="w-full h-full object-cover"
        />
      </div>
      <div class="avatar absolute">
        <div class="w-24 rounded-2xl border-4 border-base-100 relative">
          <label
            for="avatar-input"
            class="absolute select-none text-sm w-full h-full flex flex-col justify-center items-center bg-[#0008] opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
          >
            <div>Change</div>
            <div>Avatar</div>
          </label>
          <img
            v-if="currentAvatar"
            :src="currentAvatar"
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
            <input
              type="text"
              id="nickname"
              class="input input-bordered w-full max-w-xs"
              :placeholder="userStore.userData.nickname"
              v-model="nickname"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="username" class="font-semibold text-sm">Username</label>
            <input
              type="text"
              id="username"
              class="input input-bordered w-full max-w-xs"
              :placeholder="userStore.userData.username"
              v-model="username"
            />
          </div>
        </div>
        <div class="flex-auto flex flex-col gap-2 portrait:md:ml-5">
          <label for="bio" class="font-semibold text-sm">Bio</label>
          <textarea
            v-model="bio"
            placeholder="Tell us about yourself..."
            class= "textarea textarea-bordered h-full"
          ></textarea>
        </div>
      </div>
      <button type="submit" class="btn btn-primary w-1/5 ml-auto" :disabled="disabledSave">
        Save Changes
      </button>
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