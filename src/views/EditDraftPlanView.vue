<script setup>
import { ref, onBeforeMount, onMounted, watch, reactive } from "vue";
import { useRoute } from "vue-router";
import { validateToken } from "../../libs/userManagement";
import { useUserStore } from "@/stores/user";
import Icon from "@/components/Icon.vue";
import { DailyTask } from "../../classes/DailyTask";
import { createOrUpdatePlan, getPlanBy } from "../../libs/planManagement";
import { HourlyTask } from "../../classes/HourlyTask";
import { Todo } from "../../classes/Todo";
import BasePlan from "../../classes/plan/BasePlan";
import ListContainer from "@/components/ListContainer.vue";
import ListItem from "@/components/ListItem.vue";
import PlannetLayout from "@/components/PlannetLayout.vue";

const isLoading = ref(false)
const route = useRoute();
const userStore = useUserStore();
const saveState = reactive({
  saving: false,
  saved: false,
  saveFail: false
})
const draftPlan = ref(new BasePlan())

//handle Auto saving
watch(draftPlan, async (newValue) => {
  saveState.saving = true

  try {
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
  console.log(draftPlan);
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

onBeforeMount(async () => {
  const { isTokenValid, userId } = await validateToken();
  if (isTokenValid) userStore.loadUserData(userId);
})
</script>

<template>
  <PlannetLayout>
    <div class="w-[85%] mt-12 flex flex-col gap-4">
      <!-- <div class="flex gap-4 items-center my-4">
        <img
          v-if="!isLoading && author?.setting?.avatarUrl"
          :src="author.setting.avatarUrl"
          alt="author image"
          class="w-10 h-10 rounded-full object-cover"
        />
        <div v-else class="skeleton w-10 h-10"></div>
        <div class="flex flex-col gap-0.5">
          <div v-if="!isLoading && author.nickname" class="font-helvetica font-semibold">{{ author.nickname }}</div>
          <div v-else class="skeleton h-6 w-20"></div>
          <div v-if="!isLoading && author.username" class="text-sm font-helvetica opacity-60">{{ '@' + author.username }}</div>
          <div v-else class="skeleton h-4 w-20"></div>
        </div>
      </div> -->
      <div class="flex flex-col gap-3 mb-10">
        <input
          v-if="!isLoading"
          v-model="draftPlan.title"
          class="text-3xl font-bold font-helvetica bg-transparent outline-none focus:placeholder:opacity-50"
          placeholder="Your plan title here"
          autofocus
        />
        <!-- <div v-else class="skeleton h-10 w-[32rem] max-w-full"></div> -->
        <textarea
          v-if="!isLoading"
          v-model="draftPlan.description"
          class="font-helvetica opacity-70 bg-transparent outline-none focus:placeholder:opacity-50"
          placeholder="Plan description..."
        />
        <!-- <div v-else class="skeleton h-6 w-[20rem] max-w-full"></div> -->
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
                    <!-- <div class="place-self-start">{{ hourlyTask.start }} - {{ hourlyTask.end }}</div> -->
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
    <div class="absolute top-0 right-0">
      <div class="flex gap-3 p-5" v-show="saveState.saving">
        <div class="loading"></div>
        <div class="w-32">Saving</div>
      </div>
      <div class="flex gap-3 p-5" v-show="!saveState.saving && saveState.saved">
        <Icon iconName="cloud-save" class="w-[1.5rem] h-[1.5rem]" />
        <div class="w-32">Saved</div>
      </div>
      <div class="flex gap-3 p-5 items-center" v-show="!saveState.saving && saveState.saveFail">
        <Icon iconName="caution" class="w-10 h-10 flex items-center" />
        <div>Your change not saved !</div>
      </div>
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
</style>