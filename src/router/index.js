import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useToastStore } from '@/stores/toast'
import { getUserBy, isUserIdExist, isUsernameExist, validateToken } from '../../libs/userManagement'
import { useUserStore } from '@/stores/user'
import { createOrUpdatePlan, getPlanBy, isPlanExist } from '../../libs/planManagement'
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
      path: '/home',
      redirect: { name: 'home' }
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
      path: '/post-plan/:id',
      name: 'post',
      component: () => import('../views/PostPlanView.vue'),
      beforeEnter: (to, from, next) => {
        if (to.query.edit) {
          next({ name: 'edit-draft-plan', params: { id: to.params.id } })
        } else {
          next()
        }
      }
    },
    {
      path: '/draft-plan/edit/:id',
      name: 'edit-draft-plan',
      component: () => import('../views/DraftPlanView.vue'),
      beforeEnter: async (to, from, next) => {
        const userStore = useUserStore()
        const toastStore = useToastStore()
        if (!userStore.userData.id) {
          toastStore.addToast('You must be logged in to edit a post', 'error')
          next('/')
        } else {
          if (from.name === 'create-draft') next()
          const { userId } = await getPlanBy('id', to.params.id, 'draft')
          if (userStore.userData.id === userId) {
            next()
          } else {
            next({ name: 'not-found' })
          }
        }
      }
    },
    {
      path: '/draft-plan/create',
      name: 'create-draft',
      beforeEnter: async (to, from, next) => {
        const userStore = useUserStore()
        const toastStore = useToastStore()
        if (!userStore.userData.id) {
          toastStore.addToast('You must be logged in to create a post', 'error')
          next(false)
        } else {
          const draftPlan = new BasePlan()
          draftPlan.userId = userStore.userData.id
          draftPlan.authorId = await userStore.userData.id
          const { id: planId } = await createOrUpdatePlan(draftPlan, 'draft')
          next(`/draft-plan/edit/${planId}`)
        }
      }
    },
    {
      path: '/profile/:id',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      beforeEnter: async (to, from, next) => {
        if (to.params.id) {
          if (await isUserIdExist(to.params.id)) {
            next()
          } else {
            next({ name: 'not-found' })
          }
        } else {
          next({ name: 'not-found' })
        }
      }
    },
    {
      path: '/archive',
      name: 'draft-plan-lists',
      component: () => import('../views/ArchiveView.vue'),
      beforeEnter: async (to, from, next) => {
        const userStore = useUserStore()
        const toastStore = useToastStore()
        if (userStore.userData.id) {
          next()
        } else {
          toastStore.addToast('You must be logged in to use archive feature', 'error')
          next(false)
        }
      }
    },
    {
      path: '/active-plan',
      name: 'active-plan-lists',
      component: () => import('../views/MyActivePlansView.vue'),
      beforeEnter: async (to, from, next) => {
        const userStore = useUserStore()
        const toastStore = useToastStore()
        if (userStore.userData.id) {
          next()
        } else {
          toastStore.addToast('You must be logged in to use active plan feature', 'error')
          next(false)
        }
      }
    },
    {
      path: '/active-plan/:id',
      name: 'active-plan',
      component: () => import('../views/ActivePlanView.vue'),
      beforeEnter: async (to, from, next) => {
        const userStore = useUserStore()
        const { userId } = await getPlanBy('id', to.params.id, 'active')
        if (userId === userStore.userData.id) {
          next()
        } else {
          next({ name: 'not-found' })
        }
      }
    },
    {
      path: '/new-user/setup',
      name: 'setup',
      component: () => import('../views/SetupView.vue')
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/ForgotPasswordView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue')
    },
  ]
})

router.beforeEach(async (to, from, next) => {
  const { isTokenValid, userId } = await validateToken()
  const userStore = useUserStore()
  console.log(isTokenValid, userId);
  if (isTokenValid) {
    const userData = await getUserBy('id', userId)
    userStore.userData = userData
  }
  console.log(userStore.userData)

  if (to.name !== 'setup' && userStore.userData.hasSetup === false && isTokenValid) { 
    next('/new-user/setup')
  } else next()
})

export default router
