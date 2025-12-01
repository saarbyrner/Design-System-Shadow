// @flow
import { useEffect, useRef } from 'react';

import { Client } from '@twilio/conversations';
import { useDispatch } from 'react-redux';
import {
  removeConversation,
  setConversationUnread,
} from '@kitman/modules/src/Messaging/src/redux/slices/messagingSlice';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { useGetInitialContextQuery } from '@kitman/modules/src/Messaging/src/redux/services/messaging';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';
import { useTwilioClient } from '@kitman/common/src/contexts/TwilioClientContext';

import {
  handleTokenRefresh,
  populateInitialUnreadMessages,
  handleNotifications,
  updateUnreadMessages,
  isNotificationEnabled,
} from './utils';

export const TwilioInitialiser = () => {
  const dispatch = useDispatch();
  const { permissions } = usePermissions();
  const { data, isSuccess } = useGetInitialContextQuery();
  const { setTwilioClient } = useTwilioClient();

  const canViewMessaging = permissions.messaging.canViewMessaging;
  const currentRouteRef = useRef<string | null>(null);
  const currentRoute = useLocationPathname();

  useEffect(() => {
    currentRouteRef.current = currentRoute;
  }, [currentRoute]);

  useEffect(() => {
    let client;
    if (!canViewMessaging || !isSuccess) return;

    const initTwilio = async () => {
      try {
        const { token, identity } = JSON.parse(data.context);
        client = new Client(token);

        // Success initialisation
        client.on('initialized', () => {
          populateInitialUnreadMessages(client, (payload) => {
            dispatch(setConversationUnread(payload));
          });

          setTwilioClient(client);
        });

        // Failed initialisation
        client.on('initFailed', ({ error }) => {
          console.error(error);
        });

        // Handle token refresh
        client.on('tokenAboutToExpire', () => handleTokenRefresh(client));
        client.on('tokenExpired', () => handleTokenRefresh(client));

        // Event listeners for conversations
        client.on('conversationUpdated', ({ conversation }) => {
          updateUnreadMessages(conversation, (payload) => {
            dispatch(setConversationUnread(payload));
          });
        });

        client.on('conversationLeft', (conversation) => {
          dispatch(removeConversation({ sid: conversation.sid }));
        });

        client.on('messageAdded', (message) => {
          const latestRoute = currentRouteRef.current || '';

          if (isNotificationEnabled(message, identity, latestRoute)) {
            handleNotifications(message, (toastData) => {
              dispatch(add(toastData));
            });
          }
        });
      } catch (error) {
        console.error(error);
      }
    };

    initTwilio();

    // Clean up
    // eslint-disable-next-line consistent-return
    return () => {
      if (client) {
        client.removeAllListeners();
        client.shutdown();
        client = null;
      }
    };
  }, [canViewMessaging, isSuccess]);
  return null;
};

export default TwilioInitialiser;
