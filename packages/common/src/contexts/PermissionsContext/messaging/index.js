// @flow
import type { MessagingPermissions } from './types';

export const defaultMessagingPermissions: MessagingPermissions = {
  canViewMessaging: false,
  canCreatePrivateChannel: false,
  canCreatePublicChannel: false,
  canCreateDirectChannel: false,
  isMessagingAdmin: false,
};

export const setMessagingPermissions = (
  permissions: Array<string>
): MessagingPermissions => {
  return {
    canViewMessaging: permissions.includes('view-messaging'),
    canCreatePrivateChannel: permissions.includes('create-private-channel'),
    canCreatePublicChannel: permissions.includes('create-public-channel'),
    canCreateDirectChannel: permissions.includes('create-direct-message'),
    isMessagingAdmin: permissions.includes('messaging-admin'),
  };
};
