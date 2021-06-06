import { createApp } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCog, faQuestionCircle, faSignOutAlt, faUser,
} from '@fortawesome/free-solid-svg-icons';
import 'leaflet/dist/leaflet.css';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import locales from './locales/locales';
import App from './App.vue';
import router from './router';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const leaflet = require('leaflet');

// eslint-disable-next-line no-underscore-dangle
delete leaflet.Icon.Default.prototype._getIconUrl;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const iconRetinaUrl = require('leaflet/dist/images/marker-icon-2x.png');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const iconUrl = require('leaflet/dist/images/marker-icon.png');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const shadowUrl = require('leaflet/dist/images/marker-shadow.png');

leaflet.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

library.add(faQuestionCircle);
library.add(faUser);
library.add(faCog);
library.add(faSignOutAlt);

createApp(App)
  .use(router)
  .use(locales)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app');
