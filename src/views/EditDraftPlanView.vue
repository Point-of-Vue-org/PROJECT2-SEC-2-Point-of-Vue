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

// const JSON_SERVER_URI = import.meta.env.VITE_SERVER_URI || 'http://localhost:5000'
const router = useRouter();
const route = useRoute();
const toastStore = useToastStore();
const userStore = useUserStore();
const draftPlan = ref(new BasePlan());
const newDraftPlan = ref('')
// const dailyTasks = ref([new DailyTask()]);
onMounted(async () => {
  let id = route.params.id;
  newDraftPlan = await getPlanBy('id',id,'draft')
  console.log(newDraftPlan);

  // let id = await userStore.userData.id

  // let planSaved =  await createOrUpdatePlan(draftPlan.value, 'draft')
  
});
function handleAddDraftPlan() {
  draftPlan.value.dailyTasks.push(new BasePlan());
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
          <div v-for="(dailyTask, index) in draftPlan.dailyTasks" :key="index" class="w-full">
          <div alt = "Daily task" class="flex flex-col">
            <div class="flex flex-row">
              <p class="w-1/6 flex items-center">Day {{ index + 1 }}</p>
              <input type="text" placeholder="Task title" class="input input-bordered w-full" v-model="dailyTask.title"/>
            </div>
          
            
          </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>