import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Admin from '@/views/Admin.vue';

const routes: Array<RouteRecordRaw> = [
  /*
  {
    path: '/internship/:id',
    component: A_View,
    props: true,
  },
   */
  {
    path: '/admin',
    component: Admin,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
