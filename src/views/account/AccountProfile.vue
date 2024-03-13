<script setup>
import { ref, watch } from 'vue'
import { upload } from '../../../libs/imageManager';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore()
const file = ref(null)
const image = ref(null)
const type = ref('avatar')

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

  console.log(imageURL)
  
  await userStore.saveUserData({
    setting: type.value === 'avatar'
      ? { avatarUrl: imageURL }
      : { bannerUrl: imageURL }
  })
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
</template>

<style scoped>

</style>