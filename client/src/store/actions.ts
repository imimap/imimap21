import { ActionTree } from 'vuex';
import { RootState } from '@/store/state';
import http from '@/utils/http-common';
import { SET_LANGUAGES } from '@/store/mutations';
import { NotificationTypes } from '@/store/types/Notification';
import Language from '@/store/types/Language';

export const LOAD_LANGUAGES = 'loadLanguages';

const actions: ActionTree<RootState, RootState> = {
  async [LOAD_LANGUAGES](ctx) {
    try {
      const res = await http.get('/info/languages');
      const languages = Object.entries(res.data).reduce((map, language) => {
        map.set(language[0], Language.parseFromAPIResponseData(...language));
        return map;
      }, new Map<string, Language>());
      ctx.commit(SET_LANGUAGES, languages);
    } catch (err: any) {
      if (err.response?.data?.error?.message) err.message = err.response.data.error.message;
      await ctx.dispatch('addNotification', {
        text: `Fehler beim Laden der Sprachen-Liste [ERROR: ${err.message}]`,
        type: NotificationTypes.ERROR,
      });
    }
  },
};

export default actions;
