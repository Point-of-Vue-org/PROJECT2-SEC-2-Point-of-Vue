<script setup>
import { ref, onMounted, computed, watch, reactive, h} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import { getUserBy } from '../../libs/userManagement'
import { getPlanBy, createOrUpdatePlan, deletePlan } from '../../libs/planManagement.js'
import ListContainer from '@/components/ListContainer.vue'
import ListItem from '@/components/ListItem.vue'
import { formatDate } from '../../libs/utils'
import PlannetLayout from '@/components/PlannetLayout.vue'
import UserProfilePlaceholder from '@/components/UserProfilePlaceholder.vue'
import ActivePlan from '../../classes/plan/ActivePlan'
import Modal from '@/components/Modal.vue'
import { useUserStore } from '@/stores/user'
import Icon from '@/components/Icon.vue'

const router = useRouter()
const userStore = useUserStore()
const isLoading = ref(false)
const route = useRoute()
const toastStore = useToastStore()
const activePlan = ref(new ActivePlan())
const author = ref({})
const confirmDeleteOpenState = ref(false)

async function fetchData() {
  isLoading.value = true
  try {
    activePlan.value = await getPlanBy('id', route.params.id, 'active')
    author.value = await getUserBy('id', activePlan.value.authorId)
    if (author.value === null) author.value = { nickname: '[Deleted user]' }

  } catch (error) {
    toastStore.type = 'error'
    toastStore.msg = 'An error occurred'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchData)

const saveState = reactive({
  saving: false,
  saved: false,
  saveFail: false
})

async function save() {
  saveState.saved = true
  if (activePlan.value.id === undefined) return
  saveState.saving = true
  try {
    activePlan.value.updatedAt = Date.now()
    const updatedData = await createOrUpdatePlan(activePlan.value, 'active')
    saveState.saving = false
    saveState.saveFail = false
    saveState.saved = true
  } catch (e) {
    saveState.saving = false
    saveState.saved = false
    saveState.saveFail = true
  }
}

const handleCheckTodo = (isChecked, todo, hourlyTask, dailyTask) => {
  todo.isDone = isChecked
  hourlyTask.isDone = hourlyTask.todos.every(todo => todo.isDone)
  dailyTask.isDone = dailyTask.hourlyTasks.every(hourlyTask => hourlyTask.isDone)
  activePlan.value.isDone = activePlan.value.dailyTasks.every(dailyTask => dailyTask.isDone)
  save()
}

const handleSetOpenDeleteModal = (openState) => {
  confirmDeleteOpenState.value = openState
}

const handleDeactivateDraft = async () => {
  const res = await deletePlan(activePlan.value.id, 'active')
  if (res) {
    toastStore.addToast('Plan deactivated', 'success')
    router.push('/active-plan')
    return
  }
}

</script>

<template>
  <Modal :show="confirmDeleteOpenState" @bgClick="handleSetOpenDeleteModal(false)">
    <div class="flex items-center flex-col w-11/12 max-w-[34rem] h-96 rounded-2xl justify-center bg-base-100 gap-2">
      <div class="text-2xl">Do you want to <span class="text-primary">deactivate</span> this plan?</div>
      <div class="flex flex-col justify-center gap-5 pt-5 min-w-52 w-[70%]">
        <div class="flex flex-col gap-2">
          <button class="btn btn-sm btn-error btn-outline border-2 text-[0.9] font-helvetica" @click="handleDeactivateDraft">Confirm deactivate</button>
          <button class="btn btn-sm btn-secondary text-[0.9rem] font-helvetica" @click="handleSetOpenDeleteModal(false)">Cancel</button>
        </div>
      </div>
    </div>
  </Modal>
  <PlannetLayout>
    <div class="w-[85%] mt-12">
      <div class="flex justify-end">
        <div class="dropdown dropdown-bottom dropdown-end portrait:md:flex gap-4">
          <div tabindex="0" role="button" class="btn btn-ghost m-1 right-3 top-3 font-bold">
            <Icon iconName="three-dots" :scale="1.5" />
          </div>
          <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 border-base-300 border mr-4">
            <li v-if="activePlan?.userId === userStore.userData.id" @click="handleSetOpenDeleteModal(true)">
              <div class="flex justify-start gap-2 btn btn-error btn-outline btn-sm">
                <Icon iconName="trash-fill" />
                <div>Deactivate this plan</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="relative overflow-hidden rounded-2xl">
        <div v-if="!isLoading && activePlan?.imageUrl">
          <div class="bg-[#0008] absolute w-full h-full"></div>
          <img
            v-if="!isLoading && activePlan.imageUrl"
            :src="activePlan.imageUrl"
            alt="author image"
            class="w-full h-52 object-cover"
          />
        </div>
        <div v-else-if="!isLoading" class="h-full w-full bg-accent"></div>
        <div v-else class="skeleton h-full w-full"></div>
      </div>
      <div class="text-xs opacity-75 mb-2 mt-4">
        Start at {{ formatDate(activePlan?.startDate) }}
      </div>
      <div class="flex flex-col gap-3 mb-10">
        <div v-if="!isLoading" :class="{ 'line-through': activePlan.isDone }" class="text-3xl font-bold font-helvetica">{{ activePlan?.title }}</div>
        <div v-else class="skeleton h-10 w-[32rem] max-w-full"></div>
        <div v-if="!isLoading" class="font-helvetica opacity-70">{{ activePlan?.description }}</div>
        <div v-else class="skeleton h-6 w-[20rem] max-w-full"></div>
      </div>
      <ListContainer
        v-if="!isLoading && activePlan?.dailyTasks.length > 0"
        :items="activePlan.dailyTasks"
        v-slot="{ items: dailyTasks }"
      >
        <ListItem
          v-for="(dailyTask, index) in dailyTasks"
          :key="index"
          width="100%"
          type="list"
        >
          <template #title>
            <div class="flex items-center gap-4">
              <input type="checkbox" :class="dailyTask.isDone ? 'checkbox-success' : 'checkbox-secondary'" class="checkbox pointer-events-none" :checked="dailyTask.isDone" />
              <div class="text-base">Day {{ index + 1 }}</div>
              <div :class="{'line-through opacity-75': dailyTask.isDone}">{{ dailyTask.title }}</div>
            </div>
          </template>
          <template #content>
            <ListContainer :items="dailyTask.hourlyTasks" v-slot="{ items: hourlyTasks }">
              <ListItem
                v-for="(hourlyTask, index) in hourlyTasks"
                :key="index"
                width="100%"
                type="sublist"
              >
                <template #title>
                  <div class="flex gap-2 w-full">
                    <input type="checkbox" :class="dailyTask.isDone ? 'checkbox-success' : 'checkbox-secondary'" class="checkbox pointer-events-none" :checked="hourlyTask.isDone" />
                    <div class="hidden md:flex gap-2">
                      <div class="w-full">{{ hourlyTask.start }} - {{ hourlyTask.end }}</div>
                    </div>
                    <div class="flex-1 flex flex-col md:flex-row">
                      <div class="sm:hidden flex flex-col text-sm">
                        <span>Start {{ hourlyTask.start }}</span>
                        <span>End {{ hourlyTask.start }}</span>
                      </div>
                      <div :class="{'line-through opacity-75': hourlyTask.isDone}" class="place-self-start">{{ hourlyTask.header }}</div>
                    </div>
                  </div>
                </template>
                <template #content>
                  <div class="flex flex-col h-full">
                    <div class="flex-1">{{ hourlyTask.description }}</div>
                    <div class="divider divider-neutral my-2"></div>
                    <div v-if="hourlyTask.todos.length > 0" class="flex-1 flex flex-col gap-2">
                      <div class="font-bold">To-do</div>
                      <ul class="flex flex-col gap-2">
                        <li v-for="(todo, index) in hourlyTask.todos" :key="index" class="flex items-center gap-2">
                          <input type="checkbox" class="checkbox" @change="handleCheckTodo($event.target.checked, todo, hourlyTask, dailyTask)" :checked="todo.isDone" />
                          <span :class="{'line-through opacity-75': todo.isDone}">{{ todo.description }}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </template>
              </ListItem>
            </ListContainer>
          </template>
        </ListItem>
      </ListContainer>
      <div v-else class="flex flex-col gap-2 mb-16">
        <div class="skeleton h-16 w-full"></div>
        <div class="skeleton h-16 w-full"></div>
        <div class="skeleton h-16 w-full"></div>
      </div>
      <div class="divider"></div>
      <div class="flex flex-col">
        <div class="font-semibold">Created by</div>
        <div class="flex gap-4 items-center my-4 bg-base">
          <img
            v-if="!isLoading && author?.setting?.avatarUrl"
            :src="author.setting.avatarUrl"
            alt="author image"
            class="w-20 h-20 rounded-full object-cover"
          />
          <div v-else-if="isLoading" class="skeleton w-10 h-10"></div>
          <UserProfilePlaceholder v-else size="5rem" color="#f50" bgcolor="white" class="rounded-full" />
          <div class="flex flex-col gap-0.5">
            <div v-if="!isLoading && author.nickname" class="font-helvetica font-semibold">{{ author.nickname }}</div>
            <div v-else class="skeleton h-6 w-20"></div>
            <div v-if="!isLoading && author?.username" class="text-sm font-helvetica opacity-60">{{ '@' + author.username }}</div>
            <div v-else-if="isLoading" class="skeleton h-4 w-20"></div>
          </div>
        </div>
      </div>
      <div class="h-16"></div>
    </div>
  </PlannetLayout>
</template>