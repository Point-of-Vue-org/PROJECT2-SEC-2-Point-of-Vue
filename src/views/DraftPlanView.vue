<script setup>
import { ref, onBeforeMount, onMounted, watch, reactive, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getUserBy, getUsers, updateUserData, validateToken } from "../../libs/userManagement";
import { useUserStore } from "@/stores/user";
import Icon from "@/components/Icon.vue";
import { DailyTask } from "../../classes/DailyTask";
import { createOrUpdatePlan, getPlanBy, isPlanExist, deletePlan, updatePlanData } from "../../libs/planManagement";
import { HourlyTask } from "../../classes/HourlyTask";
import { Todo } from "../../classes/Todo";
import BasePlan from "../../classes/plan/BasePlan";
import ListContainer from "@/components/ListContainer.vue";
import ListItem from "@/components/ListItem.vue";
import PlannetLayout from "@/components/PlannetLayout.vue";
import PostPlan from "../../classes/plan/PostPlan";
import { useToastStore } from "@/stores/toast";
import Modal from "@/components/Modal.vue";
import { upload } from "../../libs/imageManagement";
import LoadingModal from "@/components/LoadingModal.vue";
import { validatePlanToPostOrActive } from "../../libs/validationUtils";
import AutoResizeTextarea from "@/components/AutoResizeTextarea.vue";
import ActivePlan from "../../classes/plan/ActivePlan";

const isLoading = ref(false)
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const toastStore = useToastStore()
const saveState = ref({
  saving: false,
  saved: true,
  saveFail: false
})
const draftPlan = ref(new BasePlan())
const confirmPostOpenState = ref(false)
const confirmActiveOpenState = ref(false)
const confirmDeleteOpenState = ref(false)
const deleteMessage = ref('')
const lockDelete = computed(() => deleteMessage.value !== 'delete')

let saveLock = false
let saveTimeout = null
watch(draftPlan, async (newValue, oldValue) => {
  if (oldValue.id === undefined) return
  if (saveLock) return
  saveState.value.saving = true
  saveState.value.saved = false
  saveState.value.saveFail = false
  saveLock = true
  clearTimeout(saveTimeout)
  saveTimeout = setTimeout(async () => {
    try {
      newValue.updatedAt = Date.now()
      await createOrUpdatePlan(newValue, 'draft')
      saveState.value.saving = false
      saveState.value.saved = true
      saveState.value.saveFail = false
    } catch (error) {
      saveState.value.saving = false
      saveState.value.saved = false
      saveState.value.saveFail = true
    } finally {
      saveLock = false
    }
  }, 1000)
}, { deep: true })

onMounted(async () => {
  let id = route.params.id;
  draftPlan.value = await getPlanBy('id', id, 'draft')
})

const handleAddDailyTask = () => {
  const newDailyTask = new DailyTask();
  newDailyTask.hourlyTasks = []; // Initialize dailyTasks as an empty array
  draftPlan.value.dailyTasks.push(newDailyTask);
}

const handleAddHourlyTask = (index) => {
  const newHourlyTask = new HourlyTask();
  draftPlan.value.dailyTasks[index].hourlyTasks.push(newHourlyTask);
}

/**
 * 
 * @param {*} descLength 
 * @param {Object} hourlyTask
 * @param {String} hourlyTask.description
 * @param {InputEvent} e 
 */
const handleHourlyTaskDescriptionInput = (hourlyTask, value) => {
  hourlyTask.description = value
  if (hourlyTask.description.length > 750) {
    hourlyTask.description = hourlyTask.description.slice(0, 750)
  }
}

const handleAddTodo = (dailyIndex, hourlyIndex) => {
  const newTodo = new Todo()
  newTodo.id = (Math.random() + 1).toString(36).substring(7);
  const todos = [...draftPlan.value.dailyTasks[dailyIndex].hourlyTasks[hourlyIndex].todos]
  todos.push(newTodo)
  draftPlan.value.dailyTasks[dailyIndex].hourlyTasks[hourlyIndex].todos = todos
}

const handleDeleteDailyTask = (dailyIndex) => {
  let dailyTasks = [...draftPlan.value.dailyTasks]
  dailyTasks.splice(dailyIndex, 1)
  draftPlan.value.dailyTasks = dailyTasks
}

const handleDeleteHourlyTask = (dailyIndex, hourlyIndex) => {
  draftPlan.value.dailyTasks[dailyIndex].hourlyTasks.splice(hourlyIndex, 1)
}

const handleDeleteTodo = (dailyIndex, hourlyIndex, todoId) => {
  const todos = [...draftPlan.value.dailyTasks[dailyIndex].hourlyTasks[hourlyIndex].todos]
  const index = todos.findIndex(todo => todo.id === todoId)

  todos.splice(index, 1)
  draftPlan.value.dailyTasks[dailyIndex].hourlyTasks[hourlyIndex].todos = todos
}

const handleSetModelState = (name, openState) => {
  if (name === 'active') confirmActiveOpenState.value = openState
  else if (name === 'post') confirmPostOpenState.value = openState
}

const handlePublish = async () => {
  const errorMsg = validatePlanToPostOrActive(draftPlan.value)

  if (errorMsg) {
    toastStore.addToast(errorMsg, 'error')
    return
  }
  
  const newPostPlan = new PostPlan(draftPlan.value)
  newPostPlan.id = undefined
  newPostPlan.published = true
  newPostPlan.postDate = Date.now()
  const createdPlan = await createOrUpdatePlan(newPostPlan, 'post')
  if(createdPlan){
    toastStore.addToast(`Plan ${createdPlan.title}#${createdPlan.id} published successfully`,'success')
  }else{
    toastStore.addToast(`Failed to publish plan ${createdPlan.title}#${createdPlan.id}`, 'error')
  }
  confirmPostOpenState.value = false
}

const handleActive = async () => {
  const errorMsg = validatePlanToPostOrActive(draftPlan.value)

  if (errorMsg) {
    toastStore.addToast(errorMsg, 'error')
    return
  }

  const newActivePlan = new ActivePlan(draftPlan.value)
  newActivePlan.id = undefined
  newActivePlan.startDate = Date.now()
  const createdActivePlan = await createOrUpdatePlan(newActivePlan, 'active')
  if(createdActivePlan){
    toastStore.addToast(`Plan ${createdActivePlan.title}#${createdActivePlan.id} activated successfully`,'success')
  }else{
    toastStore.addToast(`Failed to activate this plan`, 'error')
  }
  
  confirmActiveOpenState.value = false
}


const handlePostImageFileChange = async (e) => {
  const file = e.target.files[0]
  if (file) {
    let imageUrl = null
    try {
      isLoading.value = true
      imageUrl = await upload(file)
    } catch (error) {
      toastStore.addToast(error.message, 'error')
    } finally {
      isLoading.value = false
    }
    
    if (imageUrl) {
      draftPlan.value.imageUrl = imageUrl
    }
  }
}

const handleDeletePostImage = async () => {
  const res = await updatePlanData(draftPlan.value.id, { imageUrl: '' }, 'draft')
  if(res){
    draftPlan.value.imageUrl = ''
  } else {
    toastStore.addToast('Failed to delete post image', 'error')
  }
}

const handleDeleteDraftPlan = async () => {
  const planName = draftPlan.value.title + '#' + draftPlan.value.id
  if(window.confirm('Do you want to delete this draft ?')){
    const res = await deletePlan(draftPlan.value.id, 'draft')
    if(res){
      toastStore.addToast(`Delete draft plan (${planName})`, 'success')
      router.replace('/archive')
    } else { 
      toastStore.addToast(`Error occured, Can't delete draft plan (${planName})`, 'error')
    }
  }
}

const handleSetOpenDeleteModal = (openState) => {
  confirmDeleteOpenState.value = openState
}

const handleDeleteDraft = async () => {
  if (deleteMessage.value !== 'delete') {
    toastStore.addToast('Please type "delete" to confirm', 'error')
    return
  }

  const res = await deletePlan(draftPlan.value.id, 'draft')
  if (res) {
    toastStore.addToast('Draft deleted', 'success')
    router.push('/archive')
    return
  }
}

</script>

<template>
  <input
    id="post-image-file"
    type="file"
    class="hidden"
    @change="handlePostImageFileChange"
    accept="image/jpeg, image/png"
    title="Upload post image"
  />
  <Modal :show="confirmDeleteOpenState" @bgClick="handleSetOpenDeleteModal(false)">
    <div class="flex items-center flex-col w-11/12 max-w-[34rem] h-96 rounded-2xl justify-center bg-base-100 gap-2">
      <div class="text-2xl">Do you want to <span class="text-primary">delete</span> this draft?</div>
      <!-- <Icon iconName="globe" scale="6" size="8rem" /> -->
      <div>Once you delete this post, it can't be undone.</div>
      <div class="flex flex-col justify-center gap-5 pt-5 min-w-52 w-[70%]">
        <div class="flex flex-col gap-1">
          <div>Type "<span class="italic">delete</span>" to confirm</div>
          <input v-model="deleteMessage" type="text" class="input input-bordered w-full placeholder:italic" placeholder="delete" />
        </div>
        <div class="flex flex-col gap-2">
          <button class="btn btn-sm btn-error btn-outline border-2 text-[0.9] font-helvetica" @click="handleDeleteDraft" :disabled="lockDelete">Confirm delete</button>
          <button class="btn btn-sm btn-secondary text-[0.9rem] font-helvetica" @click="handleSetOpenDeleteModal(false)">Cancel</button>
        </div>
      </div>
    </div>
  </Modal>
  <LoadingModal :show="isLoading" text="Uploading image..." />
  <Modal :show="confirmActiveOpenState" @bgClick="handleSetModelState('active', false)">
    <div class="flex items-center flex-col w-11/12 max-w-[34rem] h-80 rounded-2xl justify-center bg-base-100">
      <div class="text-2xl">Do you want to <span class="text-primary">active</span> this plan now?</div>
      <Icon iconName="check2-square" scale="6" size="8rem" />
      <div>if you active this plan, it will be shown in your <span class="text-primary">My Active Plans</span> page</div>
      <div>and you can use it as your planner</div>
      <div class="flex gap-3 pt-5">
        <button class="btn border-2 text-base-200 font-bold bg-primary w-40 text-[0.9] font-helvetica hover:bg-orange-800" @click="handleActive">Active Now</button>
        <button class="btn text-accent font-bold text-[0.9rem] font-helvetica" @click="handleSetModelState('active', false)">Cancel</button>
      </div>
    </div>
  </Modal>
  <Modal :show="confirmPostOpenState" @bgClick="handleSetModelState('post', false)">
    <div class="flex items-center flex-col w-11/12 max-w-[34rem] h-96 rounded-2xl justify-center bg-base-100">
      <div class="text-2xl font-bold">Do you want to <span class="text-primary">post</span> this plan now?</div>
      <Icon iconName="globe" scale="6" size="8rem" />
      <div class="flex flex-col gap-4 items-center">
        <div class="flex flex-col items-center">
          <div>if you post this plan, it will be shown in <span class="text-primary">Plannet feeds</span> page</div>
          <div>and you can <span class="text-primary">share</span> it with other users</div>
        </div>
        <div class="text-sm text-warning">*Note: you can't edit this plan after post*</div>
      </div>
      <div class="flex gap-3 pt-5">
        <button class="btn border-2 text-base-200 font-bold bg-primary w-40 text-[0.9] font-helvetica hover:bg-orange-800" @click="handlePublish">Publish Now</button>
        <button class="btn text-accent font-bold text-[0.9rem] font-helvetica" @click="handleSetModelState('post', false)">Cancel</button>
      </div>
    </div>
  </Modal>
  <PlannetLayout>
    <div class="w-[90%] md:w-[80%] mt-12 flex flex-col gap-4 relative">
      <div class="flex items-center justify-between">
        <div>
          <div class="flex gap-3" v-show="saveState.saving">
            <div class="loading"></div>
            <div>Saving</div>
          </div>
          <div class="flex gap-3" v-show="!saveState.saving && saveState.saved">
            <Icon iconName="cloud-save" class="w-[1.5rem] h-[1.5rem]" />
            <div>Saved</div>
          </div>
          <div class="flex gap-3 items-center" v-show="!saveState.saving && saveState.saveFail">
            <Icon iconName="caution" class="w-10 h-10 flex items-center" />
            <div>Your change not saved !</div>
          </div>
        </div>
        <div class="gap-2 hidden landscape:lg:flex">
          <button class="btn btn-sm btn-success" @click="handleSetModelState('active', true)">
            <Icon iconName="check2-square" />
            <div>Active this plan</div>
          </button>
          <button class="btn btn-sm btn-neutral" @click="handleSetModelState('post', true)" :disabled="userStore.userData.id !== draftPlan.authorId"><Icon iconName="globe" />Publish as post</button>
          <button class="btn btn-sm btn-error btn-outline" @click="handleSetOpenDeleteModal(true)"><Icon iconName="trash-fill" />Delete this draft</button>
        </div>
        <div class="dropdown dropdown-bottom dropdown-end portrait:md:flex gap-4 absolute right-0 landscape:lg:hidden">
          <div tabindex="0" role="button" class="btn btn-ghost m-1 right-3 top-3 font-bold">
            <Icon iconName="three-dots" :scale="1.5" />
          </div>
          <ul tabindex="0" class="dropdown-content gap-2 z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 border-base-200 border mr-4">
            <li @click="handleSetModelState('active', true)" :disabled="userStore.userData.id !== draftPlan.authorId">
              <button class="flex justify-start gap-2 btn btn-success">
                <Icon iconName="check2-square" />
                <div>Active this plan</div>
              </button>
            </li>
            <li @click="handleSetModelState('post', true)" :disabled="userStore.userData.id !== draftPlan.authorId">
              <button class="flex justify-start gap-2 btn btn-secondary">
                <Icon iconName="globe" />
                <div>Publish as post</div>
              </button>
            </li>
            <div class="divider my-0 mx-2"></div>
            <li @click="handleSetOpenDeleteModal(true)">
              <div class="flex justify-start gap-2 btn btn-error btn-outline btn-sm">
                <Icon iconName="trash-fill" />
                <div>Delete this draft</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="flex flex-col gap-3 mb-10">
        <label for="post-image-file" class="h-52 relative rounded-2xl overflow-hidden cursor-pointer">
          <div v-if="draftPlan.imageUrl" class="w-full h-52 relative">
            <div v-show="draftPlan.imageUrl" class="bg-[#0008] absolute w-full h-full"></div>
            <button @click="handleDeletePostImage" class="absolute btn btn-error rounded-[1rem_0_1rem_0]">
              <Icon iconName="trash-fill" />
              <div>Delete cover image</div>
            </button>
            <img
              :src="draftPlan.imageUrl"
              alt="author image"
              class="w-full h-full object-cover"
            />
          </div>
          <div
            v-else
            class="w-full h-52 flex flex-col items-center justify-center bg-neutral"
          >
            <div class="flex items-center pointer-events-none">
              <Icon iconName="upload" scale="2" size="3rem" />
              <div class="text-2xl">Upload post image</div>
            </div>
            <div class="pointer-events-none">WIP: right now we recommend you to upload image that has 1:1 ratio (square) or close to it</div>
          </div>
        </label>
        <input
          v-model="draftPlan.title"
          class="text-3xl font-bold font-helvetica bg-transparent outline-none focus:placeholder:opacity-50"
          placeholder="Your plan title here"
          autofocus
        />
        <textarea
          v-model="draftPlan.description"
          class="font-helvetica opacity-70 bg-transparent outline-none focus:placeholder:opacity-50"
          placeholder="Plan description..."
        />
      </div>
      <div class="flex justify-end">
        <button class="btn" @click="handleAddDailyTask">
          <Icon iconName="plus-lg" /> Add Daily Task
        </button>
      </div>
      <ListContainer
        v-if="draftPlan?.dailyTasks?.length > 0"
        :items="draftPlan.dailyTasks"
        v-slot="{ items: dailyTasks }"
      >
        <ListItem
          v-for="(dailyTask, dailyTaskIndex) in dailyTasks" 
          :key="dailyTaskIndex"
          width="100%"
          type="list"
          extendBy="dropdown"
        >
          <template #title>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4 w-full">
                <input type="checkbox" class="checkbox" disabled />
                <div class="text-xs text-nowrap md:text-base w-12">Day {{ dailyTaskIndex + 1 }}</div>
                <input
                  type="text"
                  v-model="dailyTask.title"
                  class="text-sm md:text-base w-full bg-transparent outline-none focus:placeholder:opacity-50"
                  placeholder="Daily task title"
                />
              </div>
              <button @click="handleDeleteDailyTask(dailyTaskIndex)">
                <Icon iconName="trash-fill" color="salmon"/>
              </button>
            </div>
          </template>
          <template #content>
            <div class="flex justify-end my-2">
              <button class="btn btn-sm" @click="handleAddHourlyTask(dailyTaskIndex)">
                <Icon iconName="plus" /> Add Hourly Task
              </button>
            </div>
            <ListContainer
              v-if="dailyTask?.hourlyTasks?.length > 0"
              :items="dailyTask.hourlyTasks"
              v-slot="{ items: hourlyTasks }"
            >
              <ListItem
                v-for="(hourlyTask, hourlyTaskIndex) in hourlyTasks"
                :key="hourlyTaskIndex"
                width="100%"
                type="sublist"
                extendBy="dropdown"
              >
                <template #title>
                  <div class="flex gap-2 w-full">
                    <input type="checkbox" class="checkbox" disabled />
                    <div class="hidden md:flex gap-2">
                      <input type="time" v-model="hourlyTask.start" class="bg-transparent focus:outline-none" /> to <input type="time" v-model="hourlyTask.end" class="bg-transparent focus:outline-none" />
                    </div>
                    <div class="flex-1 flex flex-col md:flex-row">
                      <div class="sm:hidden flex flex-col text-sm">
                        <span>Start<input type="time" v-model="hourlyTask.start" class="bg-transparent focus:outline-none" /></span>
                        <span>End&nbsp;<input type="time" v-model="hourlyTask.end" class="bg-transparent focus:outline-none" /></span>
                      </div>
                      <div class="w-full">
                        <input
                          type="text"
                          v-model="hourlyTask.header"
                          class="w-full bg-transparent focus:outline-none focus:placeholder:opacity-50"
                          placeholder="Hourly task title"
                        />
                      </div>
                    </div>
                    <button @click="handleDeleteHourlyTask(dailyTaskIndex, hourlyTaskIndex)">
                      <Icon iconName="trash-fill" color="salmon" />
                    </button>
                  </div>
                </template>
                <template #content>
                  <div class="flex flex-col h-full">
                    <div class="flex-1 flex flex-col">
                      <AutoResizeTextarea :textareaValue="hourlyTask.description" @textareaInput="handleHourlyTaskDescriptionInput(hourlyTask, $event)" />
                      <div class="text-end">{{ hourlyTask.description.length }}/750</div>
                    </div>
                    <div class="divider divider-neutral my-2"></div>
                    <div class="flex-1 flex flex-col gap-2">
                      <div class="flex gap-2">
                        <div class="font-bold">To-do</div>
                        <button class="btn btn-square btn-xs" @click="handleAddTodo(dailyTaskIndex, hourlyTaskIndex)">
                          <Icon iconName="plus" />
                        </button>
                      </div>
                      <ul class="flex flex-col gap-2 overflow-auto scrollbar">
                        <li v-for="(todo, todoIndex) in hourlyTask.todos" :key="todoIndex" class="flex pb-1 items-center justify-between border-b-2 border-b-base-100 w-full">
                          <div class="flex items-center gap-2 w-full">
                            <input type="checkbox" class="checkbox" disabled />
                            <input
                              type="text"
                              v-model="todo.description"
                              class="w-full bg-transparent placeholder:text-neutral focus:outline-none focus:placeholder:opacity-50"
                              :placeholder="`To-do ${todoIndex + 1}`"
                            />
                          </div>
                          <button @click="handleDeleteTodo(dailyTaskIndex, hourlyTaskIndex, todo.id)" class="w-6 h-6">
                            <Icon iconName="trash-fill" />
                          </button>
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
      <div class="h-16"></div>
    </div>
  </PlannetLayout>
</template>

<style scoped>
.scrollbar::-webkit-scrollbar {
  @apply w-2;
}
.scrollbar::-webkit-scrollbar-thumb {
  @apply bg-base-100 rounded-full;
}
.scrollbar::-webkit-scrollbar-track {
  @apply bg-neutral-content rounded-full;
}
.scrollbar::-webkit-scrollbar-thumb:hover {
  @apply bg-neutral cursor-default;
}

/* Hide the arrow icon in Chrome and Safari */
input[type="time"]::-webkit-calendar-picker-indicator {
  display: none;
}
/* Hide the arrow icon in Firefox */
input[type="time"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="time"]::-webkit-clear-button {
  display: none;
}
input[type="time"]::-moz-clear {
  display: none;
}
input[type="time"]::-moz-calendar-picker-indicator {
  display: none;
}
</style>