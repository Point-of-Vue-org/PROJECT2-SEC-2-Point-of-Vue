import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([])
  let clearIndexTimer
  // const msg = ref('')
  // const type = ref('success')
  // const show = ref(false)

  function addToast(message, type) {
    toasts.value.push({ message, type, show: false })
  }

  watch(
    () => toasts.value.length,
    () => {
      // if (msg.value) {
      //   show.value = true
      //   setTimeout(() => {
      //     show.value = false
      //     setTimeout(() => {
      //       type.value = 'success'
      //       msg.value = ''
      //     }, 1000)
      //   }, 4000)
      // }
      if (toasts.value.length > 0) {
        const toast = toasts.value[toasts.value.length - 1]
        toast.show = true
        setTimeout(() => {
          toast.show = false
          setTimeout(() => {
            toasts.value[toasts.value.indexOf(toast)] = null
          }, 1000)
          if (clearIndexTimer) clearTimeout(clearIndexTimer)
          clearIndexTimer = setTimeout(() => {
            toasts.value = toasts.value.filter((toast) => toast !== null)
            clearTimeout(clearIndexTimer)
          }, 2000)
        }, 4000)
      }
      console.log(toasts.value)
    }
  )

  return { addToast, toasts }
})
