import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
  ],
});

router.afterEach((to) => {
  if (to.meta.title) {
    document.title = String(to.meta.title);
  }
});

export default router;
