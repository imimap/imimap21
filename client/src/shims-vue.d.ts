import { Route, Router } from 'vue-router';
import type { DefineComponent } from 'vue';
import { Store } from 'vuex';
import VueProgressBar from '@aacassandra/vue3-progressbar';

declare module '*.vue' {
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

declare module '@vue-leaflet/vue-leaflet' {
  export const LMap: DefineComponent;
  export const LIcon: DefineComponent;
  export const LTileLayer: DefineComponent;
  export const LMarker: DefineComponent;
  export const LControlLayers: DefineComponent;
  export const LTooltip: DefineComponent;
  export const LPopup: DefineComponent;
  export const LPolyline: DefineComponent;
  export const LPolygon: DefineComponent;
  export const LRectangle: DefineComponent;
}

declare module '@vue/runtime-core' {
  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>;
    $Progress: VueProgressBar<VueProgressBar>;
  }
}
