export enum notificationTypes {
  danger = 'danger',
  success = 'success',
}

export interface Notification {
  id: string;
  text: string;
  type: notificationTypes;
}
