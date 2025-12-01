// @flow
import type { NotificationsPermissions } from './types';

export const defaultNotificationsPermissions: NotificationsPermissions = {
  canViewEmails: false,
  canManageEmails: false,
  canViewNotifications: false,
};

export const setNotificationsPermissions = (
  notificationsPermissions: Array<string>
): NotificationsPermissions => {
  return {
    canViewEmails:
      notificationsPermissions?.includes('notifications-view-emails') || false,
    canManageEmails:
      notificationsPermissions?.includes('notifications-manage-emails') ||
      false,
    canViewNotifications:
      notificationsPermissions?.includes('notifications-view-notifications') ||
      false,
  };
};
