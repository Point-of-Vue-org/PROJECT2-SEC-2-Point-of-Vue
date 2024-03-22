import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useToastStore } from '@/stores/toast'
import { validateToken } from '../../libs/userManagement'
import { useUserStore } from '@/stores/user'

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
      path: '/post/edit/:id',
      name: 'edit-post',
      component: () => import('../views/AddOrEditPostView.vue')
    },
    {
      path: '/post/create',
      name: 'create-post',
      component: () => import('../views/AddOrEditPostView.vue'),
      beforeEnter: (to, from, next) => {
        if (!localStorage.getItem('token')) {
          const toastStore = useToastStore()
          toastStore.addToast('You must be logged in to create a post', 'error')
          next(false)
        } else {
          next()
        }
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue')
    }
  ]
})

router.beforeEach(async (to, from) => {
  const { isTokenValid, userId } = await validateToken()
  const userStore = useUserStore()
  if (isTokenValid) userStore.loadUserData(userId)
})

export default router
