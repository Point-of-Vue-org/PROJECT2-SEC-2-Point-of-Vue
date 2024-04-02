import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useToastStore } from '@/stores/toast'
import { validateToken } from '../../libs/userManagement'
import { useUserStore } from '@/stores/user'
import { createOrUpdatePlan } from '../../libs/planManagement'
import BasePlan from '../../classes/plan/BasePlan'

// const toastStore = useToastStore()

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/account/:category',
      name: 'account',
      component: () => import('../views/AccountView.vue')
    },
    {
      path: '/post/:id',
      name: 'post',
      component: () => import('../views/PostView.vue'),
      beforeEnter: (to, from, next) => {
        if (to.query.edit) {
          next({ name: 'edit-post', params: { id: to.params.id } })
        } else {
          next()
        }
      }
    },
    {
      path: '/plan/edit/:id',
      name: 'edit-post',
      component: () => import('../views/EditDraftPlanView.vue')
    },
    {
      path: '/plan/create',
      name: 'create-post',
      // component: () => import('../views/CreateDraftPlanView.vue'),
      beforeEnter: async (to, from, next) => {
        const userStore = useUserStore()
        const toastStore = useToastStore()
        // if(to.name === 'forgot-password') {
        //   next('/forgot-password')
        // }
        if (!userStore.userData.id) {
          toastStore.addToast('You must be logged in to create a post', 'error')
          next(false)
        } else {
          const draftPlan = new BasePlan()
          draftPlan.userId = userStore.userData.id
          draftPlan.authorId = await userStore.userData.id
          const { id: planId } = await createOrUpdatePlan(draftPlan, 'draft')
          next(`/plan/edit/${planId}`)
        }
      }
    },
    {
      path: '/profile/:id',
      name: 'profile',
      component: () => import('../views/ProfileView.vue')
    },
    {
      path: '/plans',
      name: 'draft plan lists',
      component: () => import('../views/DraftPlanView.vue')
    },
    {
      path: '/active-plans',
      name: 'active plan lists',
      component: () => import('../views/ActivePlanView.vue')
    },
    {
      path: '/active-plans/:id',
      name: 'active plan',
      component: () => import('../views/UseActivePlanView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue')
    },
    {
      path: '/newuser/setup',
      name: 'setup',
      component: () => import('../views/SetupView.vue')
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/ForgotPassword.vue')
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const { isTokenValid, userId } = await validateToken()
  const userStore = useUserStore()
  if (isTokenValid) await userStore.loadUserData(userId)
  console.log(userStore.userData)

  if (to.name !== 'setup' && userStore.userData.hasSetup === false && isTokenValid) { 
    next('/newuser/setup')
  } else next()

  // if(from.name === 'login' && to.name === 'home'){
  //   if(userStore.userData.nickname === ''){
  //     next('/newuser/setup')
  //   } else next()
  // } else next()
  // if(!['login', 'register', 'setup'].includes(to.name)){
  //   if(!userStore.userData.nickname){
  //     next('/newuser/setup')
  //   } else next()
  // } else next()
})

export default router
