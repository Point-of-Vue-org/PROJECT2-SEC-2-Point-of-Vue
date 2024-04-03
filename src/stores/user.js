import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { getUserBy, updateUserData } from '../../libs/userManagement'
import { User } from '../../classes/User'

export const useUserStore = defineStore('user', () => {
  const user = ref(new User())

  return { userData: user.value }
})
