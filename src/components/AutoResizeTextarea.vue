<script setup>
import { onMounted, ref, watch } from 'vue';


const props = defineProps({
  textareaValue: {
    type: String,
    default: ''
  }
})

const emits = defineEmits(['textareaInput'])

const content = ref(props.textareaValue)
const textareaRef = ref(null)

function textAreaAdjust(element) {
  element.style.height = 'auto'
  element.style.height = (16 + element.scrollHeight) + 'px'
}

onMounted(() => {
  textAreaAdjust(textareaRef.value)
})

watch(content, () => {
  if (content.value.length > 750) {
    content.value = content.value.slice(0, 750)
  }
  emits('textareaInput', content.value)
})

</script>

<template>
  <textarea
    type="text"
    :style="{ height: 'auto' }"
    @input="textAreaAdjust($event.target)"
    @paste="textAreaAdjust($event.target)"
    @cut="textAreaAdjust($event.target)"
    class="scrollbar bg-transparent w-full focus:outline-none placeholder:text-neutral focus:placeholder:opacity-50 resize-none"
    placeholder="Describe what do you wanna do? (optional)"
    v-model="content"
    ref="textareaRef"
  >
  </textarea>
</template>

<style scoped>

</style>