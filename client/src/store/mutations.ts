import { MutationTree } from 'vuex';
import { RootState } from '@/store/state';
import Language from '@/store/types/Language';

export const SET_LANGUAGES = 'setLanguages';

const mutations: MutationTree<RootState> = {
  [SET_LANGUAGES](state, languages: Map<string, Language>) {
    state.languages = languages;
  },
};

export default mutations;
