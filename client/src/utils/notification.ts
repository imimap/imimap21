import store from '@/store';
import { notificationTypes } from '@/store/types/Notification';

export async function showErrorNotification(message: string) {
  await store.dispatch('addNotification', { text: message, type: notificationTypes.danger });
}

export async function showSuccessNotification(message: string) {
  await store.dispatch('addNotification', { text: message, type: notificationTypes.success });
}
