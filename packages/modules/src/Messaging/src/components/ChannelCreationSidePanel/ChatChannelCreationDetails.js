// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import {
  FormValidator,
  InputText,
  TextButton,
  ToggleSwitch,
} from '@kitman/components';
import type { Validation } from '@kitman/common/src/types/index';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { CreatableChannelTypes } from '../../types';
import type { CreationStatus } from './types';

type ValidationCallback = (input: string) => Validation;

type Props = {
  channelType: CreatableChannelTypes,
  isEditMode: boolean,
  athletesCanSend?: boolean,
  staffCanSend?: boolean,
  channelName?: string,
  description?: string,
  onCreate: Function,
  channelCreationStatus: CreationStatus,
  onStepBack: Function,
  channelNameValidation: ValidationCallback,
};

const ChatChannelCreationDetails = (props: I18nProps<Props>) => {
  const [channelName, setChannelName] = useState(props.channelName);
  const [invalidChannelName, setInvalidChannelName] = useState(false);
  const [channelDescription, setChannelDescription] = useState(
    props.description
  );
  const [athletesCanSendMessages, setAthletesCanSendMessages] = useState(
    props.athletesCanSend === undefined ? true : props.athletesCanSend
  );
  const [staffCanSendMessages, setStaffCanSendMessages] = useState(
    props.staffCanSend === undefined ? true : props.staffCanSend
  );

  const getPrivacyDescription = () => {
    switch (props.channelType) {
      case 'private':
        return (
          <div>
            {props.t(
              'A private channel is only visible to the users invited to the channel'
            )}
          </div>
        );
      default:
        return undefined;
    }
  };

  const shouldDisableInput = props.channelCreationStatus === 'CREATING';

  const getChannelDetails = () => {
    return (
      <FormValidator
        successAction={() => {
          props.onCreate(
            channelName,
            channelDescription,
            staffCanSendMessages,
            athletesCanSendMessages
          );
        }}
        inputNamesToIgnore={['description']}
      >
        <div className="slidingPanel__header">{props.t('Channel details')}</div>
        <div className="slidingPanel__content">
          <div className="slidingPanel__indent">
            <div className="col-md-7 slidingPanel__row">
              <InputText
                key={props.channelCreationStatus}
                isValid={false}
                name="channel_name"
                label={props.t('Channel name')}
                onValidation={(validationObj) => {
                  // NOTE: Set the state ChannelName even if invalid so state matches visual input
                  // When the user changes the text:
                  // props.channelNameValidation will see the text differs from any previously tested channel name for uniqueness
                  // And so that will allow it to be valid here again so submit button gets enabled ( which then looks for uniqueness again)
                  setChannelName(validationObj?.value);
                  setInvalidChannelName(!validationObj.isValid);
                }}
                customValidations={[props.channelNameValidation]}
                revealError
                value={channelName || ''}
                showRemainingChars={false}
                showCharsLimitReached={false}
                maxLength={255}
                disabled={shouldDisableInput}
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
                value={channelDescription || ''}
                showRemainingChars={false}
                showCharsLimitReached={false}
                maxLength={255}
                disabled={shouldDisableInput}
                t={props.t}
              />
            </div>

            <div className="text_header">{props.t('Privacy')}</div>
            {getPrivacyDescription()}

            <div className="text_header">{props.t('Permissions')}</div>
            <ToggleSwitch
              isDisabled={shouldDisableInput}
              isSwitchedOn={athletesCanSendMessages}
              label={props.t('Athletes can send messages')}
              toggle={() => {
                setAthletesCanSendMessages(!athletesCanSendMessages);
              }}
            />
            <ToggleSwitch
              isDisabled={shouldDisableInput}
              isSwitchedOn={staffCanSendMessages}
              label={props.t('Staff can send messages')}
              toggle={() => {
                setStaffCanSendMessages(!staffCanSendMessages);
              }}
            />
          </div>
        </div>
        <div className="slidingPanelActions">
          <div className="slidingPanelActions__back">
            <TextButton
              onClick={() => {
                props.onStepBack();
              }}
              type="secondary"
              text={props.t('Back')}
              iconBefore="icon-next-left float-left"
              isDisabled={shouldDisableInput}
              kitmanDesignSystem
            />
          </div>
          <div className="slidingPanelActions__apply">
            <TextButton
              onClick={() => {}}
              type="primary"
              text={
                props.isEditMode
                  ? props.t('Save Channel')
                  : props.t('Create Channel')
              }
              isDisabled={invalidChannelName || shouldDisableInput}
              isSubmit
              kitmanDesignSystem
            />
          </div>
        </div>
      </FormValidator>
    );
  };

  return getChannelDetails();
};

export default ChatChannelCreationDetails;
export const ChatChannelCreationDetailsTranslated = withNamespaces()(
  ChatChannelCreationDetails
);
