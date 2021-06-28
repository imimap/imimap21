import Vuex from 'vuex';
import notifications from '@/store/modules/notifications';
import user from '@/store/modules/user';

const rootStore = new Vuex.Store({
  state: {
    version: '1.0.0',
  },
  modules: {
    notifications,
    user,
  },
});
export default rootStore;
