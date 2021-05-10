import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Admin from '@/views/Admin.vue';
import Home from '@/views/Home.vue';
import Search from '@/views/Search.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/admin',
    component: Admin,
  },
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
