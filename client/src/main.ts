import { createApp } from 'vue';
import store from '@/store';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCheckCircle,
  faCircleXmark,
  faCog,
  faDownload,
  faEdit,
  faEye,
  faQuestionCircle,
  faSignOutAlt,
  faTrash,
  faTrashAlt,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import 'leaflet-defaulticon-compatibility';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VueProgressBar from '@aacassandra/vue3-progressbar';
import progressbarOptions from '@/utils/progressbar-options';
import locales from './locales/locales';
import App from './App.vue';
import router from './router';
import 'bootstrap';

library.add(faQuestionCircle);
library.add(faUser);
library.add(faCog);
library.add(faSignOutAlt);
library.add(faEdit);
library.add(faTrashAlt);
library.add(faTrash);
library.add(faDownload);
library.add(faEye);
library.add(faCheckCircle);
library.add(faCircleXmark);

createApp(App)
  .use(VueProgressBar, progressbarOptions)
  .use(router)
  .use(locales)
  .use(store)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app');
