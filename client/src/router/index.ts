import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '@/views/Home.vue';
import Search from '@/views/Search.vue';
import InternshipModule from '@/views/InternshipModule.vue';
import Layout from '@/views/Layout.vue';
import CreateInternshipModule from '@/views/CreateInternshipModule.vue';

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
        component: InternshipModule,
      },
      {
        path: 'internship-module/new',
        name: 'CreateInternshipModule',
        component: CreateInternshipModule,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
