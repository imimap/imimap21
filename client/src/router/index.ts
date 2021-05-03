import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '@/views/Home.vue';
import Search from '@/views/Search.vue';

const routes: Array<RouteRecordRaw> = [
  /*
  {
    path: '/internship/:id',
    component: A_View,
    props: true,
  },
   */
  {
    path: '/',
    component: Home,
  },
  {
    path: '/search',
    component: Search,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
