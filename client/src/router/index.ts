import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import isLoggedIn from '@/utils/auth';
import Layout from '@/layouts/Layout.vue';
import LayoutFullscreen from '@/layouts/LayoutFullscreen.vue';
import Home from '@/views/Home.vue';
import Search from '@/views/Search.vue';
import InternshipModule from '@/views/InternshipModule.vue';
import CreateInternshipModule from '@/views/CreateInternshipModule.vue';
import Login from '@/views/Login.vue';
import Student from '@/views/Student.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: 'de',
  },
  {
    path: '/:locale',
    component: isLoggedIn() ? Layout : LayoutFullscreen,
    meta: {
      allowAnonymous: true,
    },
    children: [
      {
        path: '',
        name: 'Home',
        component: Home,
        meta: {
          allowAnonymous: false,
          allowLoggedin: true,
        },
      },
      {
        path: 'login',
        name: 'Login',
        component: Login,
        meta: {
          allowAnonymous: true,
          allowLoggedin: false,
        },
      },
      {
        path: 'search',
        name: 'Search',
        component: Search,
        meta: {
          allowAnonymous: false,
          allowLoggedin: true,
        },
      },
      {
        path: 'internship-module',
        name: 'InternshipModule',
        component: InternshipModule,
        meta: {
          allowAnonymous: false,
          allowLoggedin: true,
        },
      },
      {
        path: 'internship-module/new',
        name: 'CreateInternshipModule',
        component: CreateInternshipModule,
        meta: {
          allowAnonymous: false,
          allowLoggedin: true,
        },
      },
      {
        path: 'students/:studentID',
        name: 'Student',
        component: Student,
        meta: {
          allowAnonymous: false,
          allowLoggedin: true,
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (!to.meta.allowAnonymous && !isLoggedIn()) {
    next({
      name: 'Login',
      params: { locale: to.params.locale },
    });
  } else {
    next();
  }
});

router.beforeEach((to, from, next) => {
  if (!to.meta.allowLoggedin && isLoggedIn()) {
    next({
      name: 'Home',
      params: { locale: to.params.locale },
    });
  } else {
    next();
  }
});

export default router;
