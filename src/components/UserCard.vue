<script setup>
import { computed, onMounted, ref } from 'vue';
import UserProfilePlaceholder from './UserProfilePlaceholder.vue';
import { getPlansBy } from '../../libs/planManagement';
import { useRouter } from 'vue-router';

const props = defineProps({
  userData: {
    type: Object,
    required: true
  }
})
const router = useRouter()
const posts = ref([])
const postCount = computed(() => posts.value.length)
const upVotes = computed(() => {
  return posts.value.reduce((acc, cur) => {
      return acc += cur.upVote
    }, 0)
})

onMounted(async () => {
  console.log('user', props.userData)
  console.log(props.userData.id)
  posts.value = await getPlansBy('authorId', props.userData.id, 'post')
  console.log(posts)
})

const handleUserClick = () => {
  router.push(`/profile/${props.userData.id}`)
}
</script>

<template>
    <div class="bg-neutral h-20 rounded-2xl flex justify-between items-center px-4">
      <div class="flex gap-4 items-center">
        <div @click="handleUserClick" class="w-16 h-16 rounded-full overflow-hidden  cursor-pointer hover:opacity-75">
          <img
            v-if="userData.setting.avatarUrl"
            :src="userData.setting.avatarUrl"
            alt="user avatar image"
            class="w-full h-full object-cover"
          />
          <UserProfilePlaceholder v-else />
        </div>
        <div class="flex flex-col">
          <div @click="handleUserClick" class="text-lg font-semibold hover:underline cursor-pointer" >{{ userData.nickname }}</div>
          <div @click="handleUserClick" class="text-sm cursor-pointer hover:opacity-75" >{{ '@' + userData.username }}</div>
        </div>
      </div>
      <div class="flex gap-2">
        <div>Posts {{ postCount }}</div>
        <div class="divider divider-horizontal m-0"></div>
        <div>Upvotes <span class="text-primary">{{ upVotes }}</span></div>
      </div>
    </div>
  
</template>

<style scoped>

</style>