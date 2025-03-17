import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import axios, { AxiosError } from 'axios'
import { BACKEND_BASE_URL } from '@/constants'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { requiresAuth: false },
    },
  ],
})


router.beforeEach(async (to, from, next) => {
  try {
    const apiUrl = `${BACKEND_BASE_URL}/api/v1/auth/validate-session`;
    const response = await axios.get(apiUrl, { withCredentials: true });

    //session valid
    if (response.status === 200 && ['/login', '/register'].includes(to.path)) {
      return next('/');
    }

    next();
  } catch (error:any) {
    if(error.status === 401){ //Unauthorized
     if (to.meta.requiresAuth !== false) {
        return next('/login');
      }
      next();
    }

    //for any other error
    alert('Error while authenticating');
  }
});

export default router
