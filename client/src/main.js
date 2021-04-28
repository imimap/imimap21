import { createApp } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCog, faQuestionCircle, faSignOutAlt, faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import App from './App.vue';
import router from './router/index';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

library.add(faQuestionCircle);
library.add(faUser);
library.add(faCog);
library.add(faSignOutAlt);

createApp(App).use(router).component('font-awesome-icon', FontAwesomeIcon).mount('#app');
