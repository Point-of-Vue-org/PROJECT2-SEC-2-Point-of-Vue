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
import { getPlans, createOrUpdatePlan } from "../../libs/planManagement";
import ListContainer from "@/components/ListContainer.vue";

// const JSON_SERVER_URI = import.meta.env.VITE_SERVER_URI || 'http://localhost:5000'
const router = useRouter();
const route = useRoute();
const toastStore = useToastStore();
const userStore = useUserStore();
const draftPlan = ref(new BasePlan());

// const dailyTasks = ref([new DailyTask()]);
onMounted(async () => {
  // let id = await userStore.userData.id

  // let planSaved =  await createOrUpdatePlan(draftPlan.value, 'draft')
  console.log(route.params.id);
});
function handleAddDraftPlan() {
  draftPlan.value.dailyTasks.push(new DailyTask());
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
          v-model="draftPlan.title"
          type="text"
          placeholder="Title here"
          class="text-7xl bg-transparent focus:outline-none w-full p-2 placeholder:opacity-50"
        />
        <textarea
          v-model="draftPlan.description"
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
          <div v-for="(dailyTask, index) in draftPlan.dailyTasks" :key="index">
            <div class="flex gap-3 bg-slate-400 rounded p-5">
              <input type="time" class="rounded p-3 bg-blue-100 text-black" />
              <input
                type="time"
                class="rounded p-3 bg-red-300-100 text-black"
              />
              <input
                class="input input-bordered w-1/2"
                v-model="dailyTask.title"
                placeholder="please type your daily task"
              />
              <Icon iconName="trash3-fill" class="flex items-center" />
            </div>
            <div class="mt-5 w-full flex flex-row gap-4">
              <textarea
                class="textarea-bordered rounded w-1/2 max-h-40"
                placeholder="description"
              ></textarea>

              <div class="w-1/2 border-l-2 border-indigo-400 p-4">
                <div class="flex flex-row justify-between">
                  <p>Task</p>
                  <button class="btn">Add</button>
                </div>
                <div class="flex flex-col pt-2">
                  <div class="flex flex-col gap-3">
                    <div class="flex flex-row gap-4">
                      <input
                        type="text"
                        class="input input-bordered w-full"
                        placeholder="Subtask"
                      />
                      <Icon iconName="trash3-fill" class="flex items-center" />
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