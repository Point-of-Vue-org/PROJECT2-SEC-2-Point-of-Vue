<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { logout } from '../../libs/userManagement'
import Header from '@/components/Header.vue'
import { useUserStore } from '@/stores/user'
import PlannetSidebar from '@/components/PlannetSidebar.vue'
import Icon from '@/components/Icon.vue'
import Modal from './Modal.vue'

const router = useRouter()
const userStore = useUserStore()
const sidebarOpenState = ref(false)
const logoutModalOpenState = ref(false)

const handleLogout = async () => {
  await logout(userStore.userData.id)
  localStorage.removeItem('todo_token')
  router.replace('/login')
}

const handleSubmitSearch = (value) =>{
  router.push({
    name:'home',
    query: {
      search: value
    } 
  })
}

const setLogoutModalOpenState = (value) => {
  logoutModalOpenState.value = value
}

</script>

<template>
  <Modal :show="logoutModalOpenState">
    <div class="flex flex-col">
      <div class="text-4xl">Are you sure you want to logout</div>
      <button class="btn btn-primary w-20">Confirm</button>
      <button @click="setLogoutModalOpenState(false) "class="btn w-20">Cancel</button>
    </div>
  </Modal>
  <div
    :class="{
      'bg-[#0009]': sidebarOpenState,
      'pointer-events-auto': sidebarOpenState,
    }"
    @click="sidebarOpenState = false"
    class="pointer-events-none w-full h-screen fixed z-20 transition-colors duration-300"
  ></div>
  <Header @sidebarBtnClick="sidebarOpenState = true" @submitSearch="handleSubmitSearch">
    <template #menu>
      <li><RouterLink :to="`/profile/${userStore.userData.id}`" class="text-lg"><Icon iconName="person-fill" />Profile</RouterLink></li>
      <li><RouterLink to="/account/profile" class="text-lg"><Icon iconName="gear-fill" />Account Details</RouterLink></li>
      <li><a class="text-lg" @click="setLogoutModalOpenState(true)"><Icon iconName="box-arrow-left" />Logout</a></li>
    </template>
  </Header>
  <main class="flex">
    <PlannetSidebar @closeSidebarBtnClick="sidebarOpenState = false" :openState="sidebarOpenState" class="flex-none">
      <slot name="menu"></slot>
    </PlannetSidebar>
    <section class="flex-auto relative flex justify-center">
      <slot></slot>
    </section>
  </main>
</template>