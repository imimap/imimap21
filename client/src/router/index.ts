import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
} from 'vue-router';
import {
  getAuthToken, getAuthUserProfile, isLoggedIn, storeAuthUser,
} from '@/utils/auth';
import Layout from '@/layouts/Layout.vue';
import Home from '@/views/Home.vue';
import Search from '@/views/Search.vue';
import InternshipModule from '@/views/InternshipModule.vue';
import CreateInternshipModule from '@/components/internship-module/CreateInternshipModule.vue';
import Login from '@/views/Login.vue';
import Student from '@/views/Student.vue';
import Help from '@/views/Help.vue';
import rootStore from '@/store';
import CreatePostponement from '@/components/postponements/CreatePostponement.vue';
import PostponementsList from '@/components/postponements/PostponementsList.vue';
import Postponements from '@/views/Postponements.vue';
import PageNotFound from '@/views/PageNotFound.vue';
import InternshipModuleIndex from '@/components/internship-module/InternshipModuleIndex.vue';
import { availableLocales, defaultLocale } from '@/locales/locales';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: 'de',
  },
  {
    path: '/:locale',
    name: 'Index',
    component: Layout,
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
        },
      },
      {
        path: 'login',
        name: 'Login',
        component: Login,
        meta: {
          allowAnonymous: true,
        },
      },
      {
        path: 'search',
        name: 'Search',
        component: Search,
        meta: {
          allowAnonymous: false,
        },
      },
      {
        path: 'internship-module',
        name: 'InternshipModule',
        component: InternshipModule,
        meta: {
          allowAnonymous: false,
        },
        children: [
          {
            path: '',
            name: 'InternshipModuleIndex',
            component: InternshipModuleIndex,
            meta: {
              allowAnonymous: false,
            },
          },
          {
            path: 'new',
            name: 'CreateInternshipModule',
            component: CreateInternshipModule,
            meta: {
              allowAnonymous: false,
            },
          },
        ],
      },
      {
        path: 'student',
        name: 'Student',
        component: Student,
        meta: {
          allowAnonymous: false,
        },
      },
      {
        path: 'postponements',
        name: 'Postponements',
        component: Postponements,
        meta: {
          allowAnonymous: false,
        },
        children: [
          {
            path: '',
            name: 'PostponementsIndex',
            component: PostponementsList,
            meta: {
              allowAnonymous: false,
            },
          },
          {
            path: 'new',
            name: 'CreatePostponement',
            component: CreatePostponement,
            meta: {
              allowAnonymous: false,
            },
          },
        ],
      },
      {
        path: 'help',
        name: 'Help',
        component: Help,
        meta: {
          allowAnonymous: false,
        },
      },
    ],
  },
  { path: '/:pathMatch(.*)*', component: PageNotFound },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (!to.meta.allowAnonymous && !isLoggedIn()) {
    next({
      name: 'Login',
      params: { locale: to.params.locale },
    });
  } else {
    next();
  }
});

router.beforeEach(async (to, from, next) => {
  if (to.meta.allowAnonymous && isLoggedIn()) {
    next({
      name: 'Home',
      params: { locale: to.params.locale },
    });
  } else {
    next();
  }
});

router.beforeEach(async (to, from, next) => {
  if (isLoggedIn() && rootStore.getters.getUser.id === '') {
    if (await storeAuthUser(getAuthToken())) {
      await getAuthUserProfile();
      next();
    }
  } else {
    next();
  }
});

router.beforeEach(async (to, from, next) => {
  if (typeof to.params.locale !== 'undefined') {
    if (!availableLocales.includes(to.params.locale.toString())) {
      next({
        name: 'Home',
        params: { locale: defaultLocale },
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
