import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import axios from 'axios'
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
    // Try to validate the session
    const apiUrl = `${BACKEND_BASE_URL}/api/v1/auth/validate-session`;
    const response = await axios.get(apiUrl, { withCredentials: true });

    // If session is valid and trying to access login page, redirect to home
    if (response.status === 200 && ['/login', '/register'].includes(to.path)) {
      console.log('Valid session found, redirecting to home');
      return next('/');
    }

    // Session is valid and going to a protected route, allow navigation
    next();
  } catch (error) {
    // If no valid session and trying to access protected route, go to login
    if (to.meta.requiresAuth !== false) {
      return next('/login');
    }

    // Allow navigation to non-protected routes even without session
    next();
  }
});

export default router
