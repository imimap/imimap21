export enum NotificationTypes {
  SUCCESS = 'success',
  ERROR = 'danger',
}

export interface Notification {
  id: string;
  text: string;
  type: NotificationTypes;
}
