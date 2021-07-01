import {
  Module, MutationTree, GetterTree, ActionTree,
} from 'vuex';
import { NotificationsState } from '@/store/types/NotificationsState';
import { Notification } from '@/store/types/Notification';
import { RootState } from '@/store/types/RootState';

export const notificationsState: NotificationsState = {
  notifications: [],
};

export const getters: GetterTree<NotificationsState, RootState> = {
  getNotifications(state): Array<Notification> {
    return state.notifications;
  },
};

export const mutations: MutationTree<NotificationsState> = {
  pushNotification(state, notification: Notification) {
    state.notifications.push({
      ...notification,
      id: (Math.random().toString(36) + Date.now().toString(36)).substr(2),
    });
  },
  spliceNotification(state, idToRemove: string) {
    state.notifications = state.notifications.filter(
      (notification) => notification.id !== idToRemove,
    );
  },
};

export const actions: ActionTree<NotificationsState, RootState> = {
  addNotification({ commit }, payload: Notification) {
    commit('pushNotification', { text: payload.text, type: payload.type });
  },
  removeNotification({ commit }, payload: string) {
    commit('spliceNotification', payload);
  },
};

const notificationsModule: Module <NotificationsState, RootState> = {
  state: notificationsState,
  getters,
  mutations,
  actions,
};

export default notificationsModule;
