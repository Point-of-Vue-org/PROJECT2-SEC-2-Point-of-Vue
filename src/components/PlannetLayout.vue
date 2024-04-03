<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { logout } from '../../libs/userManagement'
import Header from '@/components/Header.vue'
import { useUserStore } from '@/stores/user'
import PlannetSidebar from '@/components/PlannetSidebar.vue'
import Icon from '@/components/Icon.vue'
import Modal from './Modal.vue'
import { useToastStore } from '@/stores/toast'
import { User } from '../../classes/User'

const toastStore = useToastStore()
const router = useRouter()
const userStore = useUserStore()
const sidebarOpenState = ref(false)
const logoutModalOpenState = ref(false)

const handleLogout = async () => {
  console.log('logout success')
  // userStore.userData.id = undefined
  localStorage.removeItem('plannet_token')
  toastStore.addToast('Logout success', 'success')
  logoutModalOpenState.value = false
  userStore.userData = new User()
  router.push('/')
}

const handleSubmitSearch = (value) =>{
  sidebarOpenState.value = false
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
  <Modal :show="logoutModalOpenState" @bgClick="setLogoutModalOpenState(false)">
    <div class="flex flex-col gap-6 items-center">
      <div class="text-2xl md:text-4xl font-bold">Are you sure you want to <span class="text-primary font-helvetica">logout</span></div> 
      <div class="flex flex-row gap-5">
        <button @click="handleLogout" class="btn btn-primary w-20">Confirm</button>
        <button @click="setLogoutModalOpenState(false) "class="btn w-20">Cancel</button>
      </div> 
    </div>
  </Modal>
  <div
    :class="{
      'bg-[#0009] lg:bg-[#0000]': sidebarOpenState,
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
    <PlannetSidebar
      @submitSearch="handleSubmitSearch"
      @closeSidebarBtnClick="sidebarOpenState = false"
      :openState="sidebarOpenState"
      class="flex-none"
    >
      <slot name="menu"></slot>
    </PlannetSidebar>
    <section class="flex-auto relative flex justify-center">
      <slot></slot>
    </section>
  </main>
</template>