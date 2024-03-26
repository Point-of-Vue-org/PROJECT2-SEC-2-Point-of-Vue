<script setup>
import { ref, onBeforeMount, onMounted, computed, watch } from "vue";
import { useRouter, RouterLink, useRoute } from "vue-router";
import { useToastStore } from "@/stores/toast";
import { logout, validateToken } from "../../libs/userManagement";
import Header from "@/components/Header.vue";
import { useUserStore } from "@/stores/user";
import BaseSidebar from "@/components/BaseSidebar.vue";
import BasePlan from "../../classes/plan/BasePlan";
import Icon from "@/components/Icon.vue";
import { DailyTask } from "../../classes/DailyTask";
import { getPlans, createOrUpdatePlan,getPlanBy } from "../../libs/planManagement";
import ListContainer from "@/components/ListContainer.vue";
import { HourlyTask } from "../../classes/HourlyTask";
import { Todo } from "../../classes/Todo";

// const JSON_SERVER_URI = import.meta.env.VITE_SERVER_URI || 'http://localhost:5000'
const router = useRouter();
const route = useRoute();
const toastStore = useToastStore();
const userStore = useUserStore();
const draftPlan = ref(new BasePlan());
const hourlyTask = ref(new HourlyTask())
let newDraftPlan = ref('')
// let {  dailyTasks } = newDraftPlan.value.dailyTask

//handle Auto saving
watch(newDraftPlan, async(newValue) => {
  
  createOrUpdatePlan(newValue, 'draft')
  toastStore.addToast('saved','success')
 
},{deep:true})
// const dailyTasks = ref([new DailyTask()]);
onMounted(async () => {
  let id = route.params.id;
  newDraftPlan.value = await getPlanBy('id',id,'draft')
  console.log(newDraftPlan);

  // let id = await userStore.userData.id

  // let planSaved =  await createOrUpdatePlan(draftPlan.value, 'draft')
  
});
function handleAddDraftPlan() {
  const newDailyTask = new BasePlan();
  newDailyTask.dailyTasks = []; // Initialize dailyTasks as an empty array
  newDraftPlan.value.dailyTasks.push(newDailyTask);
}
function addHourlyTask(index) {
  const newHourlyTask = new HourlyTask();  
  newDraftPlan.value.dailyTasks[index].dailyTasks.push(newHourlyTask);
  

}
function addTodo(dailyIndex, hourlyIndex) {
  const newTodo = new Todo()
  newTodo.id = (Math.random() + 1).toString(36).substring(7);
  const todos = [...newDraftPlan.value.dailyTasks[dailyIndex].dailyTasks[hourlyIndex].todos] 
  todos.push(newTodo)
  newDraftPlan.value.dailyTasks[dailyIndex].dailyTasks[hourlyIndex].todos = todos
}
function handledeleteDailyTask(dailyIndex){
  newDraftPlan.value.dailyTasks.splice(dailyIndex,1)

}
function handleDelteHolyTask(dailyIndex,hourlyIndex){
  newDraftPlan.value.dailyTasks[dailyIndex].dailyTasks.splice(hourlyIndex,1)
}
function handleDeleteTodo(dailyIndex,hourlyIndex,todoId){
 
  const todos = [...newDraftPlan.value.dailyTasks[dailyIndex].dailyTasks[hourlyIndex].todos] 
  
  const index = todos.findIndex(t => t.id === todoId)

  todos.splice(index, 1)
  newDraftPlan.value.dailyTasks[dailyIndex].dailyTasks[hourlyIndex].todos = todos

}

onBeforeMount(async () => {
  const { isTokenValid, userId } = await validateToken();
  if (isTokenValid) userStore.loadUserData(userId);
});

const handleLogout = async () => {
  if (window.confirm("Are you sure you want to logout?") === false) return;
  await logout(userStore.userData.id);
  localStorage.removeItem("todo_token");
  router.replace("/login");
};
</script>

<template>
  <Header>
    <template #menu>
      <li>
        <a class="text-lg"><Icon iconName="person-fill" />Profile</a>
      </li>
      <li>
        <RouterLink to="/account/profile" class="text-lg">
          <Icon iconName="gear-fill" />Account Details</RouterLink
        >
      </li>
      <li>
        <a class="text-lg" @click="handleLogout">
          <Icon iconName="box-arrow-left" />Logout</a
        >
      </li>
    </template>
  </Header>
  <main class="flex">
    <BaseSidebar class="flex-none">
      <template #menu>
        <!-- Sidbar content here -->
      </template>
    </BaseSidebar>
    <section class="flex-auto flex justify-center">
      <div class="w-[85%]">
        <input
          v-model="newDraftPlan.title"
          type="text"
          placeholder="Title here"
          class="text-7xl bg-transparent focus:outline-none w-full p-2 placeholder:opacity-50"
        />
        <textarea
          v-model="newDraftPlan.description"
          placeholder="Description here"
          class="text-2xl bg-transparent focus:outline-none w-full p-2 placeholder:opacity-50"
        ></textarea>
        <div class="flex items-end justify-end flex-col w-full">
          <button class="btn" @click="handleAddDraftPlan">
            Add Daily Task
          </button>
        </div>
        <div
          class="w-full pt-3 justify-center flex flex-col gap-4 items-center"
        >
          <div v-for="(dailyTask, dailyindex) in newDraftPlan.dailyTasks" :key="dailyindex" class="w-full">
          <div alt = "Daily task" class="flex flex-col">
            <div class="flex flex-row gap-3">
              <button class="btn bg-error" @click="handledeleteDailyTask(dailyindex)">Delete</button>
              <p class="w-1/6 flex items-center">Day {{ dailyindex + 1 }}</p>
              
              
              <input type="text" placeholder="Task title" class="input input-bordered w-full" v-model="dailyTask.title"/>
            </div>
            <div>
              <div class="flex justify-end mt-4">
                <button class="btn " @click="addHourlyTask(dailyindex)">Add holytask</button>
              </div>
          <div class="bg-stone-600 p-6 rounded mt-6" alt = "hourly task" v-for="(hourlyTask,hourlyindex) in newDraftPlan.dailyTasks[dailyindex].dailyTasks" :key="hourlyindex">

            
            <div class="flex gap-3 bg-slate-400 rounded p-5 mt-6">
             
              <input type="time" class="rounded p-3 bg-blue-100 text-black" alt="start" v-model="hourlyTask.start" />
              <input
                type="time"
                class="rounded p-3 bg-red-300-100 text-black"
                alt = 'stop'
                v-model="hourlyTask.stop"
                

              />
              <input
                class="input input-bordered w-1/2"
                v-model="hourlyTask.title"
                placeholder="please type your daily task"
              />
              <button class="ml-auto btn  bg-error" alt = "Delete holy task" @click="handleDelteHolyTask(dailyindex,hourlyindex)">
                <!-- <Icon iconName="trash3-fill" class="flex items-center  " /> -->
                Delete
              </button>
             
            </div>
            <div class="mt-5 w-full flex flex-row gap-4">
              <textarea
                class="textarea-bordered rounded w-1/2 max-h-40"
                placeholder="description"
                v-model="hourlyTask.description"
              ></textarea>

              <div class="w-1/2 border-l-2 border-indigo-400 p-4">
                <div class="flex flex-row justify-between">
                  <p>Task</p>
                  <button class="btn bg-info ml-auto" @click = addTodo(dailyindex,hourlyindex)>Add</button>
                </div>
                <div class="flex flex-col pt-2">
                  <div class="flex flex-col gap-3">
                   
                      <div v-for="(todo,todoIndex) in newDraftPlan.dailyTasks[dailyindex].dailyTasks[hourlyindex].todos" :key="todo.id" class="flex flex-row gap-4">
                        <input 
                        type="text"
                        class="input input-bordered w-full"
                        :placeholder= '`subtask ${todoIndex}`'
                        v-model="todo.description"
                       
                       
                      />
                      <button class="btn" @click="handleDeleteTodo(dailyindex,hourlyindex,todo.id)">
                        <Icon iconName="trash3-fill" class="flex items-center" />

                      </button>
                      

                      </div>
                      
                   
                  </div>
                </div>
              </div>
              
            </div>
          </div>
       
          
            
          </div>
        </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>