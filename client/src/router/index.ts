import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Admin from '@/views/Admin.vue';
import Home from '@/views/Home.vue';
import Search from '@/views/Search.vue';
import UsersList from '@/components/admin/UsersList.vue';
import CompaniesList from '@/components/admin/CompaniesList.vue';
import PostponementsList from '@/components/admin/PostponementsList.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/admin',
    component: Admin,
    redirect: '/admin/users',
    children: [
      {
        path: 'users',
        component: UsersList,
      },
      {
        path: 'companies',
        component: CompaniesList,
      },
      {
        path: 'postponements',
        component: PostponementsList,
      },
    ],
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
