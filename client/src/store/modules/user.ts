import {
  Module, MutationTree, GetterTree, ActionTree,
} from 'vuex';
import { UserState } from '@/store/types/UserState';
import { RootState } from '@/store/types/RootState';

export const userState: UserState = {
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
    state.email = user.email;
    state.firstName = user.firstName;
    state.lastName = user.lastName;
    state.sub = user.sub;
    state.id = user.id;
  },
  resetUser(state) {
    state.email = '';
    state.firstName = '';
    state.lastName = '';
    state.id = '';
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
