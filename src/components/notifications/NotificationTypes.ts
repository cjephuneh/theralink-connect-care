
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning' | 'payment' | 'appointment' | 'message';
  read: boolean;
  createdAt: Date;
  action?: string;
}
