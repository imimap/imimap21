const { createRouter, createWebHashHistory } = require('vue-router');
// import A_View from '../views/a_view.vue';

const routes = [
  /*
  {
    path: '/internship/:id',
    component: A_View,
    props: true,
  },
   */
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
