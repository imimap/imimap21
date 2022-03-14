import Vuex from 'vuex';
import notifications from '@/store/modules/notifications';
import user from '@/store/modules/user';
import userProfile from '@/store/modules/userProfile';
import state from '@/store/state';
import getters from '@/store/getters';
import mutations from '@/store/mutations';
import actions from '@/store/actions';

const rootStore = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules: {
    notifications,
    user,
    userProfile,
  },
});
export default rootStore;
