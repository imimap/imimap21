import { Route, Router } from 'vue-router';
import axios from 'axios';
import VueAxios from 'vue-axios';
import type { DefineComponent } from 'vue';

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
