import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { getUserBy, updateUserData } from '../../libs/userManagement'
import { User } from '../../classes/User'

export const useUserStore = defineStore('user', () => {
  const user = reactive(new User())

  async function loadUserData(id) {
    const userData = await getUserBy('id', id)
    for (const key in userData) {
      user[key] = userData[key]
    }
  }

  // async function saveUserData(updateData) {
  //   for (const key in updateData) {
  //     if (typeof updateData[key] === 'object') {
  //       user[key] = { ...user[key], ...updateData[key] }
  //       continue
  //     }
  //     user[key] = updateData[key]
  //   }
  //   updateUserData(user.id, user)
  // }

  return { userData: user, loadUserData }
})
