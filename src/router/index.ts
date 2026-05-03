import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { setUnauthorizedHandler } from '@/services/httpService';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/pages/LoginPage.vue'),
      meta: { title: 'Sign in - Content Pipeline', public: true },
    },
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('@/views/pages/DashboardPage.vue'),
      meta: { title: 'Dashboard - Content Pipeline' },
    },
    {
      path: '/content-refreshed',
      name: 'ContentRefreshed',
      component: () => import('@/views/pages/ContentRefreshedPage.vue'),
      meta: { title: 'Content Refreshed Pages - Content Pipeline' },
    },
    {
      path: '/in-progress',
      name: 'InProgress',
      component: () => import('@/views/pages/InProgressPage.vue'),
      meta: { title: 'In Progress - Content Pipeline' },
    },
  ],
});

const { ensureChecked, isAuthenticated, markUnauthenticated } = useAuth();

setUnauthorizedHandler(() => {
  markUnauthenticated();
  if (router.currentRoute.value.name !== 'Login') {
    router.replace({
      name: 'Login',
      query: { redirect: router.currentRoute.value.fullPath },
    });
  }
});

router.beforeEach(async (to) => {
  if (to.meta.public) return true;
  const ok = await ensureChecked();
  if (!ok) {
    return {
      name: 'Login',
      query: to.fullPath !== '/' ? { redirect: to.fullPath } : undefined,
    };
  }
  return true;
});

router.beforeEach((to) => {
  if (to.name === 'Login' && isAuthenticated.value) {
    return { path: '/' };
  }
  return true;
});

router.afterEach((to) => {
  if (to.meta.title) {
    document.title = String(to.meta.title);
  }
});

export default router;
