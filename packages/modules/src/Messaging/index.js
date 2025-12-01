// @flow
import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { I18nextProvider } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { DelayedLoadingFeedback, ErrorBoundary } from '@kitman/components';
import { setupReduxDevTools } from '@kitman/common/src/utils';
import { getPermissions } from '@kitman/services';
import { useGetInitialDataQuery } from '@kitman/modules/src/Messaging/src/redux/services/messaging';
import { globalApi } from '@kitman/common/src/redux/global/services/globalApi';
import App from './src/containers/App';
import MessagingMembersModal from './src/containers/MessagingMembersModal';
import ChannelMembersSidePanel from './src/containers/ChannelMembersSidePanel';
import ChannelSettingsSidePanel from './src/containers/ChannelSettingsSidePanel';
import AppStatus from './src/containers/AppStatus';
import Toasts from './src/containers/Toasts';
import MessageInfoSidePanel from './src/containers/MessageInfoSidePanel';
import ImageUploadModal from './src/containers/ImageUploadModal';
import athleteChat from './src/redux/reducers/athleteChat';
import channelMembersSidePanel from './src/redux/reducers/channelMembersSidePanel';
import messagingSidePanel from './src/redux/reducers/messagingSidePanel';
import channelSettingsSidePanel from './src/redux/reducers/channelSettingsSidePanel';
import appStatus from './src/redux/reducers/appStatus';
import toasts from './src/redux/reducers/toasts';

// setup Redux dev tools
const middlewares = [thunkMiddleware];
const composeEnhancers = setupReduxDevTools(compose);

const StateTree = combineReducers({
  globalApi: globalApi.reducer,
  athleteChat,
  messagingSidePanel,
  channelMembersSidePanel,
  channelSettingsSidePanel,
  appStatus,
  toasts,
});

const getStore = (data) =>
  createStore(
    StateTree,
    {
      athleteChat: {
        username: null,
        userFriendlyName: null,
        userRole: {
          permissions: data.permissions,
          identity: data.context?.identity,
          orgId: data.context?.identity.split('||')[0],
          staffUserId: data.staff_user_id || null,
        },
        userChannels: [],
        directChannels: [],
        messages: [],
        selectedMessageIndex: null,
        selectedMessageMediaChangedTime: null,
        currentChannel: null,
        currentChannelExtraData: {
          hasUnretrievedNewerMessages: false, // Until the messages are retrieved we won't know so false is safest
          hasUnretrievedOlderMessages: false, // Until the messages are retrieved we won't know so false is safest
          fetchMessagesStatus: 'NOT_REQUESTED_YET',
          memberRole: undefined,
          members: undefined,
        },
        channelMembersModal: {
          isOpen: false,
          modalType: 'VIEW',
        },
        imageUploadModal: {
          isOpen: false,
        },
        generalStatus: 'CONNECTING',
        inProgressMedia: [],
        searchableItemGroups: {
          staff: data.searchable_staff || [],
          athletes: data.searchable_athletes || [],
          userChannels: [],
          directChannels: [],
        },
      },
      messagingSidePanel: {
        activeSidePanel: null,
      },
      channelMembersSidePanel: {
        updateRequestStatus: 'IDLE',
      },
      channelSettingsSidePanel: {
        channelIconUrl: null,
        status: 'IDLE',
      },
      appStatus: {
        status: null,
        message: null,
      },
      toasts: {
        toastItems: [],
      },
    },
    composeEnhancers(applyMiddleware(...middlewares, globalApi.middleware))
  );

const MessagingApp = () => {
  const [data, setData] = useState({});
  const [requestStatus, setRequestStatus] = useState('PENDING');
  const { data: initialData, isSuccess } = useGetInitialDataQuery();

  useEffect(() => {
    if (isSuccess) {
      getPermissions().then(
        (permissions) => {
          setData({
            context: JSON.parse(initialData.context),
            staff: initialData.staff,
            squads: initialData.squads,
            staff_user_id: initialData.staff_user_id,
            searchable_staff: initialData.searchable_staff,
            searchable_athletes: initialData.searchable_athletes,
            permissions: {
              canViewMessaging:
                permissions.messaging?.includes('view-messaging'),
              canCreatePrivateChannel: permissions.messaging?.includes(
                'create-private-channel'
              ),
              canCreatePublicChannel: permissions.messaging?.includes(
                'create-public-channel'
              ),
              canCreateDirectChannel: permissions.messaging?.includes(
                'create-direct-message'
              ),
              canAdministrateChannel:
                permissions.messaging?.includes('messaging-admin'),
            },
          });
          setRequestStatus('SUCCESS');
        },
        () => setRequestStatus('FAILURE')
      );
    }
  }, [isSuccess]);

  switch (requestStatus) {
    case 'FAILURE':
      return <AppStatus status="error" isEmbed />;
    case 'PENDING':
      return <DelayedLoadingFeedback />;
    case 'SUCCESS':
      return (
        <Provider store={getStore(data)}>
          <I18nextProvider i18n={i18n}>
            <ErrorBoundary>
              <div className="km-page km-page--chat">
                <div className="km-page-content km-page-content--chat">
                  <App
                    staff={data.staff || []}
                    squads={data.squads || []}
                    chatContext={data.context}
                  />
                  <MessageInfoSidePanel />
                  <ChannelSettingsSidePanel />
                  <ChannelMembersSidePanel
                    staff={data.staff || []}
                    squads={data.squads || []}
                  />
                  <MessagingMembersModal />
                  <ImageUploadModal />
                  <AppStatus />
                  <Toasts />
                </div>
              </div>
            </ErrorBoundary>
          </I18nextProvider>
        </Provider>
      );
    default:
      return null;
  }
};

export default MessagingApp;
