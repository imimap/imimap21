import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
} from 'vue-router';
import {
  getAuthToken, getAuthUserProfile, isAdmin, isLoggedIn, storeAuthUser,
} from '@/utils/auth';
import Layout from '@/layouts/Layout.vue';
import Home from '@/views/Home.vue';
import Search from '@/views/Search.vue';
import Admin from '@/views/Admin.vue';
import UsersList from '@/components/admin/UsersList.vue';
import CompaniesList from '@/components/admin/CompaniesList.vue';
import * as AdminPostponementsList from '@/components/admin/PostponementsList.vue';
import Dashboard from '@/components/admin/Dashboard.vue';
import InternshipModule from '@/views/InternshipModule.vue';
import CreateInternshipModule from '@/components/internship-module/CreateInternshipModule.vue';
import Login from '@/views/Login.vue';
import Student from '@/views/Student.vue';
import Help from '@/views/Help.vue';
import rootStore from '@/store';
import CreatePostponement from '@/components/postponements/CreatePostponement.vue';
import PostponementsList from '@/components/internship-module/PostponementsList.vue';
import Postponements from '@/views/Postponements.vue';
import PageNotFound from '@/views/PageNotFound.vue';
import InternshipModuleIndex from '@/components/internship-module/InternshipModuleIndex.vue';
import { availableLocales, defaultLocale } from '@/locales/locales';
import Internship from '@/views/Internship.vue';
import CreateInternship from '@/components/internship/CreateInternship.vue';
import EditInternship from '@/components/internship/EditInternship.vue';
import AepDashboard from '@/components/admin/AepDashboard.vue';
import QuestionsList from '@/components/question/QuestionsList.vue';
import CreateQuestion from '@/components/question/CreateQuestion.vue';
import EditQuestion from '@/components/question/EditQuestion.vue';
import CreateEvaluation from '@/components/evaluation/CreateEvaluation.vue';
import EvaluationsList from '@/components/evaluation/EvaluationsList.vue';
import EvaluationFormStudent from '@/components/evaluation/EvaluationFormStudent.vue';
import ReviewQuestions from '@/components/question/ReviewQuestions.vue';
import ShowEvaluationsToStudent from '@/views/ShowEvaluationsToStudent.vue';
import FeedbacksList from '@/components/feedback/FeedbacksList.vue';
import CreateFeedback from '@/components/feedback/CreateFeedback.vue';
import EditFeedback from '@/components/feedback/EditFeedback.vue';
import AskForFeedback from '@/views/askForFeedback.vue';
import ShowFreeFeedbacksAdmin from '@/views/ShowFreeFeedbacksAdmin.vue';

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
        path: 'showEvaluationsToStudent/:id',
        name: 'ShowEvaluationsToStudent',
        component: ShowEvaluationsToStudent,
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
          {
            path: 'askForFeedback',
            name: 'AskForFeedback',
            component: AskForFeedback,
            meta: {
              allowAnonymous: false,
            },
          },
          {
            path: 'evaluation/:id',
            name: 'ShowEvaluation',
            component: EvaluationFormStudent,
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
            path: 'aepDashboard',
            name: 'AepDashboard',
            component: AepDashboard,
          },
          {
            path: 'questions',
            name: 'QuestionsList',
            component: QuestionsList,
            meta: {
              allowAnonymous: false,
            },
          },
          {
            path: 'editQuestion/:id',
            name: 'EditQuestion',
            component: EditQuestion,
            meta: {
              allowAnonymous: false,
            },
          },
          {
            path: 'newQuestion',
            name: 'CreateQuestion',
            component: CreateQuestion,
            meta: {
              allowAnonymous: false,
            },
          },
          {
            path: 'evaluations',
            name: 'EvaluationsList',
            component: EvaluationsList,
            meta: {
              allowAnonymous: false,
            },
          },
          {
            path: 'newEvaluation',
            name: 'CreateEvaluation',
            component: CreateEvaluation,
            meta: {
              allowAnonymous: false,
            },
          },
          {
            path: 'reviews',
            name: 'ReviewQuestions',
            component: ReviewQuestions,
            meta: {
              allowAnonymous: false,
            },
          },
          {
            path: 'feedbacks',
            name: 'FeedbacksList',
            component: FeedbacksList,
            meta: {
              allowAnonymous: false,
            },
          },
          {
            path: 'editFeedback/:id',
            name: 'EditFeedback',
            component: EditFeedback,
            meta: {
              allowAnonymous: false,
            },
          },
          {
            path: 'newFeedback',
            name: 'CreateFeedback',
            component: CreateFeedback,
            meta: {
              allowAnonymous: false,
            },
          },
          {
            path: 'showFreeFeedbacksAdmin',
            name: 'ShowFreeFeedbacksAdmin',
            component: ShowFreeFeedbacksAdmin,
            meta: {
              allowAnonymous: false,
            },
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
  if (to.name === 'Admin' && !to.meta.allowAnonymous && isLoggedIn()) {
    next({
      name: 'Dashboard',
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
