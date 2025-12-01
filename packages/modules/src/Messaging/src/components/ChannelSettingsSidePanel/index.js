// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import {
  FormValidator,
  InputText,
  SlidingPanel,
  TextButton,
} from '@kitman/components';
import type { Validation } from '@kitman/common/src/types/index';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  type NotificationLevelType,
  NOTIFICATION_LEVEL,
  CHANNEL_CREATION,
} from '@kitman/modules/src/Messaging/src/types';
import { Switch } from '@kitman/playbook/components';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import corePlatformEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/corePlatform';
import type { ChatChannel } from '../../types';
import ChannelAvatar from '../ChannelAvatar';
import type { SettingsSidePanelStatus } from './types';

type Props = {
  allowEdit: boolean,
  status: SettingsSidePanelStatus,
  onClose: Function,
  currentChannel: ChatChannel,
  channelIconUrl: ?string,
  onUpdateChannelDetails: Function,
  onOpenChannelImageUploadModal: Function,
  onUpdateNotificationLevel: (level: NotificationLevelType) => void,
};

const ChannelSettingsSidePanel = (props: I18nProps<Props>) => {
  const [channelName, setChannelName] = useState(
    props.currentChannel.friendlyName
  );
  const [attemptedChannelName, setAttemptedChannelName] = useState('');
  const [invalidChannelName, setInvalidChannelName] = useState(false);
  const [channelDescription, setChannelDescription] = useState(
    props.currentChannel.description
  );
  const [muted, setMuted] = useState(props.currentChannel.isMuted);

  const { trackEvent } = useEventTracking();

  const isNotificationEnabled =
    window.getFlag('cp-messaging-notifications') &&
    window.getFlag('single-page-application');

  const isDirectChannel =
    props.currentChannel.creationType === CHANNEL_CREATION.DIRECT;

  const validateChannelName = (name: string): Validation => {
    if (name.includes('||')) {
      return {
        isValid: false,
        message: props.t('Invalid characters'),
      };
    }
    if (name.trim().length < 1) {
      return {
        isValid: false,
        message: props.t('Required'),
      };
    }
    if (
      attemptedChannelName &&
      props.status === 'FAILURE_NAME_IN_USE' &&
      name === attemptedChannelName
    ) {
      return {
        isValid: false,
        message: `${attemptedChannelName} ${props.t('is in use')}`,
      };
    }
    return { isValid: true };
  };

  return (
    <div className="chatChannelSettings">
      <SlidingPanel
        cssTop={50}
        width={460}
        isOpen
        title={props.t('Channel settings')}
        togglePanel={() => {
          props.onClose();
        }}
        kitmanDesignSystem
      >
        <FormValidator
          successAction={() => {
            setAttemptedChannelName(channelName || '');
            props.onUpdateChannelDetails(
              props.currentChannel.sid,
              channelName,
              channelDescription,
              props.channelIconUrl || props.currentChannel.avatarUrl
            );
            if (
              isNotificationEnabled &&
              muted !== props.currentChannel.isMuted
            ) {
              trackEvent(corePlatformEventNames.switchMuteChannel);
              props.onUpdateNotificationLevel(
                muted ? NOTIFICATION_LEVEL.MUTED : NOTIFICATION_LEVEL.DEFAULT
              );
            }
          }}
          inputNamesToIgnore={['description']}
        >
          <div className="slidingPanel__content">
            <div className="slidingPanel__indent">
              {!isDirectChannel && (
                <>
                  <div className="col-md-7 slidingPanel__row">
                    <InputText
                      key={`${attemptedChannelName}_${props.status}`}
                      isValid={false}
                      name="channel_name"
                      label={props.t('Channel name')}
                      onValidation={(validationObj) => {
                        setChannelName(validationObj?.value);
                        setInvalidChannelName(!validationObj.isValid);
                      }}
                      customValidations={[validateChannelName]}
                      revealError
                      value={channelName || ''}
                      showRemainingChars={false}
                      showCharsLimitReached={false}
                      maxLength={255}
                      disabled={!props.allowEdit || props.status === 'SAVING'}
                      t={props.t}
                    />
                  </div>
                  <br />
                  <div className="col-md-11 slidingPanel__row">
                    <InputText
                      name="description"
                      label={props.t('Description')}
                      onValidation={(validationObj) => {
                        setChannelDescription(validationObj?.value);
                      }}
                      disabled={!props.allowEdit || props.status === 'SAVING'}
                      value={channelDescription || ''}
                      showRemainingChars={false}
                      showCharsLimitReached={false}
                      maxLength={255}
                      t={props.t}
                    />
                  </div>
                  <br />
                  <div className="col-md-11 slidingPanel__row">
                    <label className="km-form-label">Channel avatar</label>
                    <div className="chatChannelSettings__avatarUpload">
                      <ChannelAvatar
                        channelFriendlyName={props.currentChannel.friendlyName}
                        size="LARGE"
                        url={
                          props.channelIconUrl || props.currentChannel.avatarUrl
                        }
                      />
                      <TextButton
                        text={props.t('Upload new avatar')}
                        type="secondary"
                        onClick={() => {
                          props.onOpenChannelImageUploadModal();
                        }}
                        isDisabled={
                          !props.allowEdit ||
                          props.status === 'UPLOADING_IMAGE' ||
                          props.status === 'SAVING'
                        }
                        kitmanDesignSystem
                      />
                    </div>
                  </div>
                </>
              )}
              <div className="chatChannelSettings__sid">
                <span>
                  {props.t('Channel ID:')} {props.currentChannel.sid}
                </span>
              </div>
              {isNotificationEnabled && (
                <>
                  <br />
                  <div className="col-md-11 slidingPanel__row">
                    <label className="km-form-label">
                      {props.t('Mute notifications')}
                    </label>
                    <Switch
                      checked={muted}
                      onChange={(e) => setMuted(e.target.checked)}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="slidingPanelActions">
            <div className="slidingPanelActions__back">
              <TextButton
                onClick={() => {
                  props.onClose();
                }}
                type="secondary"
                text={props.t('Cancel')}
                kitmanDesignSystem
              />
            </div>
            <div className="slidingPanelActions__apply">
              <TextButton
                onClick={() => {}}
                type="primary"
                text={props.t('Save')}
                isDisabled={
                  !(props.allowEdit || isNotificationEnabled) ||
                  props.status === 'SAVING' ||
                  invalidChannelName
                }
                isSubmit
                kitmanDesignSystem
              />
            </div>
          </div>
        </FormValidator>
      </SlidingPanel>
    </div>
  );
};

export default ChannelSettingsSidePanel;
export const ChannelSettingsSidePanelTranslated = withNamespaces()(
  ChannelSettingsSidePanel
);
