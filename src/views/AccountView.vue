<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import { useUserStore } from '@/stores/user'
import AccountProfile from './account/AccountProfile.vue'
import AccountSecurity from './account/AccountSecurity.vue'
import PlannetLayout from '@/components/PlannetLayout.vue'
import Icon from '@/components/Icon.vue'

const router = useRouter()
const route = useRoute()
const toastStore = useToastStore()
const userStore = useUserStore()

</script>

<template>
  <PlannetLayout>
    <template #menu>
      <RouterLink to="/account/profile" class="btn flex justify-between" exact-active-class="btn-accent">
        <div class="flex gap-2">
          <Icon iconName="person-fill" />
          <div>Profile</div>
        </div>
        <Icon iconName="chevron-right" />
      </RouterLink>
      <div class="divider m-0"></div>
      <RouterLink to="/account/security" class="btn flex justify-between" exact-active-class="btn-accent">
        <div class="flex gap-2">
          <Icon iconName="lock-fill" />
          <div>Security</div>
        </div>
        <Icon iconName="chevron-right" />
      </RouterLink>
    </template>
    <AccountProfile v-if="route.params.category === 'profile'" />
    <AccountSecurity v-else-if="route.params.category === 'security'"/>
  </PlannetLayout>
</template>