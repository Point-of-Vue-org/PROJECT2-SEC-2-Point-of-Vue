<script setup>
import Logo from '@/components/Logo.vue'
import UserProfilePlaceholder from '@/components/UserProfilePlaceholder.vue'
import { useUserStore } from '@/stores/user'
import Icon from './Icon.vue';
import SearchBox from './SearchBox.vue'

const emits = defineEmits(['sidebarBtnClick'])

const userStore = useUserStore()
const userData = userStore.userData

const handleSidebarBtnClick = () => {
  emits('sidebarBtnClick')
}
</script>

<template>
  <header class="navbar justify-between bg-base-200 sticky top-0 z-10 h-16">
    <div class="flex gap-2">
      <div @click="handleSidebarBtnClick()" class="lg:hidden btn btn-ghost text-xl">
        <Icon iconName="list" :scale="2" />
      </div>
      <RouterLink to="/" class="btn btn-ghost text-xl">
        <span class="text-primary">
          <Logo size="2rem" color="currentColor" />
        </span>
        <span class="text-lg font-bold">Plannet</span>
      </RouterLink>
    </div>
    <div class="gap-2 hidden lg:flex justify-center">
      <SearchBox />
    </div>
    <div v-if="userStore.userData.id" class="dropdown dropdown-end">
      <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
        <div class="w-10 h-10 rounded-xl">
          <img
            v-if="userData.setting?.avatarUrl"
            :src="userData.setting.avatarUrl"
            alt="avatar"
            class="w-full h-full object-cover rounded-xl"
          />
          <div v-else>
            <UserProfilePlaceholder
              color="#ff5500"
              bgcolor="#f0f0f0"
              size="100%"
            />
          </div>
        </div>
      </div>
      <ul tabindex="0" class="mt-3 z-20 shadow menu menu-sm p-0 overflow-hidden dropdown-content bg-base-100 border-2 dark:border-neutral rounded-box w-72">
        <div class="w-full h-24 mb-2 relative">
          <div class="w-full h-full mb-2 absolute border-4 border-base-100 bg-neutral rounded-2xl overflow-hidden">
            <img
              v-if="userData.setting?.bannerUrl"
              :src="userData.setting.bannerUrl"
              alt="avatar"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="avatar absolute">
            <div class="w-24 rounded-2xl border-4 border-base-100">
              <img
                v-if="userData.setting?.avatarUrl"
                :src="userData.setting.avatarUrl"
                alt="avatar"
                class="w-full h-full object-cover"
              />
              <div v-else>
                <UserProfilePlaceholder
                  color="#ff5500"
                  bgcolor="#f0f0f0"
                  size="100%"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="mx-2 p-3 border-b-2 border-neutral">
          <div class="font-bold text-xl text-neutral dark:text-white">{{ userData.nickname || "Guest" }}</div>
          <div class="text-sm">@{{ userData.username || "guest" }}</div>
        </div>
        <div class="m-2">
          <slot name="menu">
            <li><a class="text-lg">Menu 1</a></li>
            <li><a class="text-lg">Menu 2</a></li>
            <li><a class="text-lg">Menu 3</a></li>
          </slot>
        </div>
      </ul>
    </div>
    <div v-else>
      <RouterLink to="/login" class="btn btn-ghost">Login</RouterLink>
    </div>
  </header>
</template>