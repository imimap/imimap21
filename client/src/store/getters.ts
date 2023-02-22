import { GetterTree } from 'vuex';
import { RootState } from '@/store/state';
import Language from '@/store/types/Language';
import Student from '@/models/Student';

const getters: GetterTree<RootState, RootState> = {
  getLanguages(state): Map<string, Language> {
    return state.languages;
  },
  prettyPrintLanguage(state, otherGetters): (string) => string {
    return (language: string) => {
      const lang = otherGetters.getLanguages.get(language);
      return lang.prettyPrint();
    };
  },
  getUser(state): (id: string) => Promise<Student | undefined> | undefined {
    return (id: string) => state.users.get(id);
  },
};

export default getters;
