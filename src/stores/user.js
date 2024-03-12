import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { User } from '../../classes/User'

export const useUserStore = defineStore('user', () => {
  const user = reactive(new User())

  function saveUser(userData) {
    user.id = userData.id
    user.username = userData.username
    user.email = userData.email
    user.password = userData.password
    user.setting.avatarUrl = userData.setting.avatarUrl
    user.setting.bannerUrl = userData.setting.bannerUrl
  }

  return { userData: user, saveUser }
})
