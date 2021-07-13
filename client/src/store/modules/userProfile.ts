import {
  Module, MutationTree, GetterTree, ActionTree,
} from 'vuex';
import { UserProfileState } from '@/store/types/UserProfileState';
import { RootState } from '@/store/types/RootState';

export const userProfileState: UserProfileState = {
  emailAddress: '',
  firstName: '',
  lastName: '',
  isAdmin: false,
  studentProfile: null,
};

export const getters: GetterTree<UserProfileState, RootState> = {
  getUserProfile(state): UserProfileState {
    return state;
  },
  getUserInternshipId(state): string | null {
    return state.studentProfile != null ? state.studentProfile.internship : null;
  },
};

export const mutations: MutationTree<UserProfileState> = {
  updateUserProfile(state, userProfile: UserProfileState) {
    state.emailAddress = userProfile.emailAddress;
    state.firstName = userProfile.firstName;
    state.lastName = userProfile.lastName;
    state.isAdmin = userProfile.isAdmin;
    state.studentProfile = userProfile.studentProfile;
  },
  resetUserProfile(state) {
    state.emailAddress = '';
    state.firstName = '';
    state.lastName = '';
    state.isAdmin = false;
    state.studentProfile = null;
  },
};

export const actions: ActionTree<UserProfileState, RootState> = {
  setUserProfile({ commit }, userProfile: UserProfileState) {
    commit('updateUserProfile', {
      ...userProfile,
    });
  },
};

const userProfileModule: Module <UserProfileState, RootState> = {
  state: userProfileState,
  getters,
  mutations,
  actions,
};

export default userProfileModule;
