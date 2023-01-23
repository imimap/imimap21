import { ActionTree } from 'vuex';
import { RootState } from '@/store/state';
import http from '@/utils/http-common';
import { ADD_USER, SET_LANGUAGES } from '@/store/mutations';
import { NotificationTypes } from '@/store/types/Notification';
import Language from '@/store/types/Language';
import Student from '@/models/Student';

export const LOAD_LANGUAGES = 'loadLanguages';
export const LOAD_USER = 'loadUser';

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
  async [LOAD_USER](ctx, { id }): Promise<Student | undefined> {
    // Check if user was already requested from the server (promise may be either pending or fulfilled)
    const u = ctx.getters.getUser(id);
    if (u) return u;

    // User was not requested yet, start new API request
    const userPromise = (async () => {
      try {
        const res = await http.get(`/students/${id}`);
        return Student.parseFromAPIResponseData(res.data);
      } catch (err: any) {
        if (err.response?.data?.error?.message) err.message = err.response.data.error.message;
        await ctx.dispatch('addNotification', {
          text: `Fehler beim Laden von Student:in ${id} [ERROR: ${err.message}]`,
          type: NotificationTypes.ERROR,
        });
        return undefined;
      }
    })();

    // Store pending API request so that future requests point to it
    ctx.commit(ADD_USER, { id, promise: userPromise });
    console.log('loading user...');
    return userPromise;
  },
};

export default actions;
