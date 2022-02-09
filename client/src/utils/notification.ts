import store from '@/store';
import { NotificationTypes } from '@/store/types/Notification';

export async function showErrorNotification(message: string) {
  await store.dispatch('addNotification', { text: message, type: NotificationTypes.danger });
}

export async function showSuccessNotification(message: string) {
  await store.dispatch('addNotification', { text: message, type: NotificationTypes.success });
}
