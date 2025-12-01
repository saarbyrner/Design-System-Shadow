// @flow
import { useSelector, useDispatch } from 'react-redux';
import { useTwilioClient } from '@kitman/common/src/contexts/TwilioClientContext';
import { type NotificationLevelType } from '@kitman/modules/src/Messaging/src/types';
import { updateNotificationLevel } from '@kitman/modules/src/Messaging/src/utils';
import { ChannelSettingsSidePanelTranslated as ChannelSettingsSidePanel } from '../components/ChannelSettingsSidePanel';
import {
  closeChannelSettingsSidePanel,
  channelSettingsUpdateFailed,
} from '../components/ChannelSettingsSidePanel/actions';
import { openChannelImageUploadModal, updateChannelDetails } from '../actions';

export default () => {
  const dispatch = useDispatch();
  const { twilioClient } = useTwilioClient();

  const activeSidePanel = useSelector(
    (state) => state.messagingSidePanel.activeSidePanel
  );
  const isOpen = activeSidePanel === 'ChannelSettings';
  const currentChannel = useSelector(
    (state) => state.athleteChat.currentChannel
  );
  const channelIconUrl = useSelector(
    (state) => state.channelSettingsSidePanel.channelIconUrl
  );
  const sidePanelStatus = useSelector(
    (state) => state.channelSettingsSidePanel.status
  );
  const currentChannelExtraData = useSelector(
    (state) => state.athleteChat.currentChannelExtraData
  );
  const userRolePermissions = useSelector(
    (state) => state.athleteChat.userRole.permissions
  );

  const allowEdit =
    currentChannelExtraData.memberRole === 'channel admin' ||
    userRolePermissions.canAdministrateChannel;

  const setNotificationLevel = (level: NotificationLevelType) => {
    if (twilioClient && currentChannel) {
      updateNotificationLevel({
        client: twilioClient,
        sid: currentChannel.sid,
        level,
        onError: () => {
          dispatch(channelSettingsUpdateFailed('FAILURE_MUTE_NOTIFICATIONS'));
        },
      });
    }
  };

  return (
    isOpen && (
      <ChannelSettingsSidePanel
        allowEdit={allowEdit}
        status={sidePanelStatus}
        currentChannel={currentChannel}
        channelIconUrl={channelIconUrl}
        onUpdateChannelDetails={(
          channelSid,
          channelName,
          channelDescription,
          channelAvatarUrl
        ) => {
          dispatch(
            updateChannelDetails(
              channelSid,
              channelName,
              channelDescription,
              channelAvatarUrl
            )
          ).catch(() => {
            // TODO: Show Error AppStatus in sidebar
          });
        }}
        onOpenChannelImageUploadModal={() => {
          dispatch(openChannelImageUploadModal());
        }}
        onClose={() => {
          dispatch(closeChannelSettingsSidePanel());
        }}
        onUpdateNotificationLevel={(level) => {
          setNotificationLevel(level);
        }}
      />
    )
  );
};
