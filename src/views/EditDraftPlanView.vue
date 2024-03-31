<script setup>
import { ref, onBeforeMount, onMounted, watch, reactive, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { validateToken } from "../../libs/userManagement";
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

const isLoading = ref(false)
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const toastStore = useToastStore()
const saveState = reactive({
  saving: false,
  saved: false,
  saveFail: false
})
const draftPlan = ref(new BasePlan())
const isConfirmShow = ref(false)

watch(draftPlan, async (newValue, oldValue) => {
  saveState.saved = true
  if (oldValue.id === undefined) return
  saveState.saving = true
  console.log(newValue);
  try {
    newValue.updatedAt = Date.now()
    await createOrUpdatePlan(newValue, 'draft')
    saveState.saving = false
    saveState.saveFail = false
    saveState.saved = true
  }
  catch (e) {
    saveState.saving = false
    saveState.saved = false
    saveState.saveFail = true
  }
}, { deep: true })

onMounted(async () => {
  let id = route.params.id;
  draftPlan.value = await getPlanBy('id', id, 'draft')
})

function handleAddDailyTask() {
  const newDailyTask = new DailyTask();
  newDailyTask.hourlyTasks = []; // Initialize dailyTasks as an empty array
  draftPlan.value.dailyTasks.push(newDailyTask);
}

function handleAddHourlyTask(index) {
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
const handleHourlyTaskDescriptionInput = (hourlyTask, e) => {
  hourlyTask.description = e.target.value

  if (hourlyTask.description.length > 750) {
    hourlyTask.description = hourlyTask.description.slice(0, 750)
  }
}

function addTodo(dailyIndex, hourlyIndex) {
  const newTodo = new Todo()
  newTodo.id = (Math.random() + 1).toString(36).substring(7);
  const todos = [...draftPlan.value.dailyTasks[dailyIndex].hourlyTasks[hourlyIndex].todos]
  todos.push(newTodo)
  draftPlan.value.dailyTasks[dailyIndex].hourlyTasks[hourlyIndex].todos = todos
}

function handleDeleteDailyTask(dailyIndex) {
  let dailyTasks = [...draftPlan.value.dailyTasks]
  dailyTasks.splice(dailyIndex, 1)
  draftPlan.value.dailyTasks = dailyTasks
}

function handleDeleteHourlyTask(dailyIndex, hourlyIndex) {
  draftPlan.value.dailyTasks[dailyIndex].hourlyTasks.splice(hourlyIndex, 1)
}

function handleDeleteTodo(dailyIndex, hourlyIndex, todoId) {
  const todos = [...draftPlan.value.dailyTasks[dailyIndex].hourlyTasks[hourlyIndex].todos]
  const index = todos.findIndex(t => t.id === todoId)

  todos.splice(index, 1)
  draftPlan.value.dailyTasks[dailyIndex].hourlyTasks[hourlyIndex].todos = todos
}

function handlePopUpPublish(){
  isConfirmShow.value = !isConfirmShow.value
}

async function handlePublishNow(){
  if(draftPlan.value.title.length < 1){
    toastStore.addToast('Please enter title', 'error')
    return 
  }
  if(draftPlan.value.description.length < 1){
    toastStore.addToast('Please enter description', 'error')
    return
  }
  if(draftPlan.value.dailyTasks.length < 1){
    toastStore.addToast('Please add daily tasks', 'error')
    return
  }
  for(let dailyTask of draftPlan.value.dailyTasks){
    if(dailyTask.title.length < 1){
      toastStore.addToast('Please enter daily task title', 'error')
      return
    }
    if(dailyTask.hourlyTasks.length < 1){
      toastStore.addToast('Please add hourly tasks', 'error')
      return
    }
    for(let hourlyTask of dailyTask.hourlyTasks){
      if(hourlyTask.header.length < 1){
        toastStore.addToast('Please enter hourly task header', 'error')
        return
      }
      if (hourlyTask.start === '' || hourlyTask.end === '') {
        toastStore.addToast('Please enter start and end time', 'error')
        return
      }
      if(hourlyTask.description.length < 1 && hourlyTask.todos.length < 1){
        toastStore.addToast('Please enter hourly task description or add todos', 'error')
        return
      }
    }
  }
  // draftPlan.value.type = 'post'
  const isPostPlanExist = await isPlanExist(draftPlan.value.id, 'post')
  if(isPostPlanExist){
    if(window.confirm('This plan is already published. Do you want to override it?') === false) return
  }
  const newPostPlan = new PostPlan(draftPlan.value)
  newPostPlan.published = true
  newPostPlan.postDate = Date.now()
  const res = await createOrUpdatePlan(newPostPlan, 'post')
  if(res){
    toastStore.addToast(`Plan ${newPostPlan.title}#${newPostPlan.id} published successfully`,'success')
  }else{
    toastStore.addToast(`Failed to publish plan ${newPostPlan.title}#${newPostPlan.id}`, 'error')
  }
  
}

onBeforeMount(async () => {
  const { isTokenValid, userId } = await validateToken();
  if (isTokenValid) userStore.loadUserData(userId);
})

const handleDeleteDraftPlan = async () => {
  const planName = draftPlan.value.title + '#' + draftPlan.value.id
  if(window.confirm('Do you want to delete this draft ?')){
    const res = await deletePlan(draftPlan.value.id, 'draft')
    if(res){
      toastStore.addToast(`Delete draft plan (${planName})`, 'success')
      router.replace('/plans')
    } else { 
      toastStore.addToast(`Error occured, Can't delete draft plan (${planName})`, 'error')
    }
  }
}

const handlePostImageFileChange = async (e) => {
  const file = e.target.files[0]
  if (file) {
    const imageUrl = await upload(file)
    draftPlan.value.imageUrl = imageUrl
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

</script>

<template>
  <input id="post-image-file" type="file" class="hidden" @change="handlePostImageFileChange" />
  <PlannetLayout>
    <div class="w-[85%] mt-12 flex flex-col gap-4 relative">
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
          <button class="btn btn-sm btn-neutral" @click="handlePopUpPublish" :disabled="userStore.userData.id !== draftPlan.authorId"><Icon iconName="journal-bookmark-fill" /> Publish as post</button>
          <button class="btn btn-sm btn-error btn-outline" @click="handleDeleteDraftPlan"><Icon iconName="trash-fill" /> Delete this draft</button>
        </div>
        <div class="dropdown dropdown-bottom dropdown-end portrait:md:flex gap-4 absolute right-0 landscape:lg:hidden">
          <div tabindex="0" role="button" class="btn btn-ghost m-1 right-3 top-3 font-bold">
            <Icon iconName="three-dots" :scale="1.5" />
          </div>
          <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 border-accent border mr-4">
            <li @click="handlePopUpPublish" :disabled="userStore.userData.id !== draftPlan.authorId">
              <button class="flex justify-start gap-2 btn btn-ghost">
                <Icon iconName="journal-bookmark-fill" />
                <div>Publish as post</div>
              </button>
            </li>
            <div class="divider my-0 mx-2"></div>
            <li @click="handleDeleteDraftPlan">
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
              <Icon iconName="upload" scale="2" class="w-16 h-12 grid place-items-center" />
              <div class="text-2xl">Upload post image</div>
            </div>
            <div class="pointer-events-none">WIP: right now we recommend you to upload image that has 1:1 ratio (square) or close to it</div>
          </div>
        </label>
        <input
          v-if="!isLoading"
          v-model="draftPlan.title"
          class="text-3xl font-bold font-helvetica bg-transparent outline-none focus:placeholder:opacity-50"
          placeholder="Your plan title here"
          autofocus
        />
        <textarea
          v-if="!isLoading"
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
          contentHeight="auto"
          type="list"
        >
          <template #title>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4 w-full">
                <input type="checkbox" class="checkbox" disabled />
                <div class="text-base w-12">Day {{ dailyTaskIndex + 1 }}</div>
                <input
                  type="text"
                  v-model="dailyTask.title"
                  class="w-full bg-transparent outline-none focus:placeholder:opacity-50"
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
                contentHeight="10rem"
                type="sublist"
              >
                <template #title>
                  <div class="grid grid-cols-[1fr_2fr_13fr_1fr] gap-2 w-full place-items-center">
                    <input type="checkbox" class="checkbox" disabled />
                    <div class="place-self-start flex gap-2">
                      <input type="time" v-model="hourlyTask.start" class="bg-transparent focus:outline-none" /> to <input type="time" v-model="hourlyTask.end" class="bg-transparent focus:outline-none" />
                    </div>
                    <div class="place-self-start w-full">
                      <input
                        type="text"
                        v-model="hourlyTask.header"
                        class="w-full bg-transparent focus:outline-none focus:placeholder:opacity-50"
                        placeholder="Hourly task title"
                      />
                    </div>
                    <button @click="handleDeleteHourlyTask(dailyTaskIndex, hourlyTaskIndex)">
                      <Icon iconName="trash-fill" color="salmon" />
                    </button>
                  </div>
                </template>
                <template #content>
                  <div class="flex h-full">
                    <div class="flex-1 flex flex-col">
                      <textarea
                        type="text"
                        @paste="handleHourlyTaskDescriptionInput(hourlyTask, $event)"
                        @input="handleHourlyTaskDescriptionInput(hourlyTask, $event)"
                        class="scrollbar bg-transparent h-full w-full focus:outline-none placeholder:text-neutral focus:placeholder:opacity-50 resize-none"
                        placeholder="What do you wanna do?"
                        :value="hourlyTask.description"
                      >
                      </textarea>
                      <div class="text-end">{{ hourlyTask.description.length }}/750</div>
                    </div>
                    <div class="divider divider-horizontal divider-neutral w-1"></div>
                    <div class="flex-1 flex flex-col gap-2">
                      <div class="flex gap-2">
                        <div class="font-bold">To-do</div>
                        <button class="btn btn-square btn-xs" @click="addTodo(dailyTaskIndex, hourlyTaskIndex)">
                          <Icon iconName="plus" />
                        </button>
                      </div>
                      <ul class="flex flex-col gap-2 overflow-auto scrollbar">
                        <li v-for="(todo, todoIndex) in hourlyTask.todos" :key="todoIndex" class="flex pb-1 items-center justify-between border-b-2 border-b-neutral w-full">
                          <div class="flex items-center gap-2 w-full">
                            <input type="checkbox" class="checkbox" disabled />
                            <input
                              type="text"
                              v-model="todo.description"
                              class="w-full bg-transparent placeholder:text-neutral focus:outline-none focus:placeholder:opacity-50"
                              :placeholder="`Subtask ${todoIndex + 1}`"
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
      <!-- <div v-else class="flex flex-col gap-2 mb-16">
        <div class="skeleton h-16 w-full"></div>
        <div class="skeleton h-16 w-full"></div>
        <div class="skeleton h-16 w-full"></div>
      </div> -->
    </div>
    
    <Modal :show="isConfirmShow">
      <div class="flex items-center flex-col  h-1/2 w-full pt-10 justify-center">
        <!-- <img src="https://sv1.img.in.th/ayTIgP.png" width="80px" height="80px" class="rounded"/> -->
        <div class="text-2xl">Do you want to <span class="text-primary">publish</span> this draft now ?</div>
        <div class="flex gap-3 pt-5">
          <button class="btn border-2 text-base-200 font-bold bg-primary w-40 text-[0.9] font-helvetica hover:bg-orange-800" @click="handlePublishNow">Publish Now</button>
          <button class="btn text-accent font-bold text-[0.9rem] font-helvetica" @click="handlePopUpPublish">Cancel</button>
        </div>
      </div>
    </Modal>
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
</style>