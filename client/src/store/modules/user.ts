import {
  Module, MutationTree, GetterTree, ActionTree,
} from 'vuex';
import { UserState } from '@/store/types/UserState';
import { RootState } from '@/store/types/RootState';

export const userState: UserState = {
  displayName: '',
  email: '',
  firstName: '',
  id: '',
  lastName: '',
  sub: '',
};

export const getters: GetterTree<UserState, RootState> = {
  getUser(state): UserState {
    return state;
  },
};

export const mutations: MutationTree<UserState> = {
  updateUser(state, user: UserState) {
    state.displayName = user.displayName;
    state.email = user.email;
    state.firstName = user.firstName;
    state.id = user.id;
    state.lastName = user.lastName;
    state.sub = user.sub;
  },
  resetUser(state) {
    state.displayName = '';
    state.email = '';
    state.firstName = '';
    state.id = '';
    state.lastName = '';
    state.sub = '';
  },
};

export const actions: ActionTree<UserState, RootState> = {
  setUser({ commit }, user: UserState) {
    commit('updateUser', {
      ...user,
    });
  },
};

const userModule: Module <UserState, RootState> = {
  state: userState,
  getters,
  mutations,
  actions,
};

export default userModule;
