export enum NotificationTypes {
  danger = 'danger',
  success = 'success',
}

export interface Notification {
  id: string;
  text: string;
  type: NotificationTypes;
}
