<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import { validateToken } from '../../libs/userManagement'
import { useUserStore } from '@/stores/user';
import { onBeforeMount } from 'vue'
import AccountProfile from './account/AccountProfile.vue'
import AccountSecurity from './account/AccountSecurity.vue';
import PlannetLayout from '@/components/PlannetLayout.vue';

const router = useRouter()
const route = useRoute()
const toastStore = useToastStore()
const userStore = useUserStore()

onBeforeMount(
  async () => {
    const { isTokenValid, userId } = await validateToken()
    if (!isTokenValid) {
      router.replace('/login')
      toastStore.type = 'error'
      toastStore.msg = 'You need to login first'
    } else {
      userStore.loadUserData(userId)
    }
  }
)
</script>

<template>
  <PlannetLayout>
    <AccountProfile v-if="route.params.category === 'profile'" />
    <AccountSecurity v-else-if="route.params.category === 'security'"/>
  </PlannetLayout>
</template>