import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import {
  getAuthUserProfile, getUserInfo, isAdmin, isLoggedIn, logoutUser, storeAuthUser, storeAuthUserProfile,
} from '@/utils/auth';
import Layout from '@/layouts/Layout.vue';
import Home from '@/views/Home.vue';
import Search from '@/views/Search.vue';
import Admin from '@/views/Admin.vue';
import UsersList from '@/components/admin/UsersList.vue';
import CompaniesList from '@/components/admin/companies/CompaniesList.vue';
import * as AdminPostponementsList from '@/components/admin/postponement-requests/PostponementsList.vue';
import Dashboard from '@/components/admin/Dashboard.vue';
import ServerAdmin from '@/components/admin/ServerAdmin.vue';
import InternshipModule from '@/views/InternshipModule.vue';
import CreateInternshipModule from '@/components/internship-module/CreateInternshipModule.vue';
import Login from '@/views/Login.vue';
import Student from '@/views/Student.vue';
import Help from '@/views/Help.vue';
import rootStore from '@/store';
import CreatePostponement from '@/components/postponements/CreatePostponement.vue';
import Postponements from '@/views/Postponements.vue';
import PageNotFound from '@/views/PageNotFound.vue';
import InternshipModuleIndex from '@/components/internship-module/InternshipModuleIndex.vue';
import { availableLocales, defaultLocale } from '@/locales/locales';
import Internship from '@/views/Internship.vue';
import CreateInternship from '@/components/internship/CreateInternship.vue';
import EditInternship from '@/components/internship/EditInternship.vue';

// @TODO: Router auf Modules aufteilen
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
        path: 'internships',
        name: 'Internship',
        component: Internship,
        meta: {
          allowAnonymous: false,
        },
        children: [
          {
            path: 'new',
            name: 'CreateInternship',
            component: CreateInternship,
            meta: {
              allowAnonymous: false,
            },
          },
          {
            path: 'edit/:id',
            name: 'EditInternship',
            component: EditInternship,
            meta: {
              allowAnonymous: false,
            },
          },
        ],
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
      {
        path: 'admin',
        name: 'Admin',
        component: Admin,
        meta: {
          allowAnonymous: false,
        },
        // Todo: Props for direct filtering on users, companies and postponements when navigating
        //  from dashboard
        children: [
          {
            path: 'dashboard',
            name: 'Dashboard',
            component: Dashboard,
          },
          {
            path: 'users',
            name: 'AdminUsersList',
            component: UsersList,
          },
          {
            path: 'companies',
            name: 'AdminCompaniesList',
            component: CompaniesList,
          },
          {
            path: 'postponements',
            name: 'AdminPostponementsList',
            component: AdminPostponementsList.default,
          },
          {
            path: 'serveradmin',
            name: 'ServerAdmin',
            component: ServerAdmin,
          },
        ],
      },
    ],
  },
  { path: '/:pathMatch(.*)*', component: PageNotFound },
];

// @TODO: In Router Middleware auslagern
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const loggedIn = await isLoggedIn();
  if (!to.meta.allowAnonymous && !loggedIn) {
    next({
      name: 'Login',
      params: { locale: to.params.locale },
    });
  } else {
    next();
  }
});

router.beforeEach(async (to, from, next) => {
  if (to.path.includes('admin') && !isAdmin()) {
    next({
      name: 'Home',
      params: { locale: to.params.locale },
    });
  } else {
    next();
  }
});

router.beforeEach(async (to, from, next) => {
  const loggedIn = await isLoggedIn();
  if (to.name === 'Admin' && !to.meta.allowAnonymous && loggedIn) {
    next({
      name: 'Dashboard',
      params: { locale: to.params.locale },
    });
  } else {
    next();
  }
});

router.beforeEach(async (to, from, next) => {
  const loggedIn = await isLoggedIn();
  if (to.meta.allowAnonymous && loggedIn) {
    next({
      name: 'Home',
      params: { locale: to.params.locale },
    });
  } else {
    next();
  }
});

router.beforeEach(async (to, from, next) => {
  const loggedIn = await isLoggedIn();
  if (loggedIn && rootStore.getters.getAuthUser.id === '') {
    let decodedToken;
    try {
      decodedToken = await getUserInfo();
      await storeAuthUser(decodedToken);
      const res = await getAuthUserProfile();
      await storeAuthUserProfile(res.data);
      next();
    } catch (err: any) {
      logoutUser();
      next({
        name: 'Login',
        params: { locale: to.params.locale },
      });
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
