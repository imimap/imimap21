import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '@/views/Home.vue';
import Search from '@/views/Search.vue';
import CompleteInternship from '@/views/InternshipModule.vue';
import Layout from '@/views/Layout.vue';

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
    redirect: 'de',
  },
  {
    path: '/:locale',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Home',
        component: Home,
      },
      {
        path: 'search',
        name: 'Search',
        component: Search,
      },
      {
        path: 'internship-module',
        name: 'InternshipModule',
        component: CompleteInternship,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
