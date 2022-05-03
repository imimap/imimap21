import { GetterTree } from 'vuex';
import { RootState } from '@/store/state';
import Language from '@/store/types/Language';

const getters: GetterTree<RootState, RootState> = {
  getLanguages(state): Map<string, Language> {
    return state.languages;
  },
};

export default getters;
