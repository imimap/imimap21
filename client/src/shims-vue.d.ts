import { Route, Router } from 'vue-router';

declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// Expansion
declare module 'vue/types/vue' {
  interface Vue {
    $router: Router;
    $route: Route;
  }
}
