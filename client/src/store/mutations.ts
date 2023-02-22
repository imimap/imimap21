import { MutationTree } from 'vuex';
import { RootState } from '@/store/state';
import Language from '@/store/types/Language';
import Student from '@/models/Student';

export const SET_LANGUAGES = 'setLanguages';
export const ADD_USER = 'addUser';

const mutations: MutationTree<RootState> = {
  [SET_LANGUAGES](state, languages: Map<string, Language>) {
    state.languages = languages;
  },
  [ADD_USER](state, { id, promise }: { id: string; promise: Promise<Student | undefined> }) {
    state.users.set(id, promise);
  },
};

export default mutations;
