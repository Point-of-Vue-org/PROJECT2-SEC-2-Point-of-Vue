<script setup>
import { ref, watch } from 'vue'

const emits = defineEmits(['changeImage', 'submitUpload'])

const file = ref(null)
const image = ref(null)
const type = ref('avatar')

const handleFileChange = (e) => {
  file.value = e.target.files[0]
  emits('changeImage', file.value)
}

const handleSubmit = (type) => {
  emits('submitUpload', type)
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
  <div>
    <input
      type="file"
      @input="handleFileChange"
      class="file-input file-input-bordered w-full max-w-xs"
    />
    <input type="radio" id="avatar" name="type" value="avatar" v-model="type" />
    <label for="avatar">Avatar</label>
    <input type="radio" id="banner" name="type" value="banner" v-model="type" />
    <label for="banner">Banner</label>
    <button @click="handleSubmit(type)" type="button" class="btn btn-warning" :disabled="!file">Upload</button>
    <img v-if="file" :src="image" alt="preview" class="pointer-events-none w-64 h-64 object-contain" />
  </div>
</template>

<style scoped>

</style>