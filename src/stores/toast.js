import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', () => {
  const msg = ref('')
  const type = ref('success')
  const show = ref(false)

  watch(
    () => msg.value,
    () => {
      if (msg.value) {
        show.value = true
        setTimeout(() => {
          show.value = false
          setTimeout(() => {
            type.value = 'success'
            msg.value = ''
          }, 1000)
        }, 4000)
      }
    }
  )

  return { msg, type, show }
})
