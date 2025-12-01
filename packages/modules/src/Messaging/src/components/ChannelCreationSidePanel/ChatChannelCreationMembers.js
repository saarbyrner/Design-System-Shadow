// @flow
import { Fragment } from 'react';
import { withNamespaces } from 'react-i18next';
import { AthleteAndStaffSelector, TextButton } from '@kitman/components';
import type {
  AthletesSelectorSquadData,
  AthletesAndStaffSelectorStaffMemberData,
  AthletesAndStaffSelection,
} from '@kitman/components/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { CreatableChannelTypes } from '../../types';

type Props = {
  staffUserId: string,
  staff: Array<AthletesAndStaffSelectorStaffMemberData>,
  squads: Array<AthletesSelectorSquadData>,
  channelType: CreatableChannelTypes,
  currentSelection: AthletesAndStaffSelection,
  onUpdatedSelection: Function,
  nextStepEnabled: boolean,
  onStepNext: Function,
};

const ChatChannelCreationMembers = (props: I18nProps<Props>) => {
  const hasValidSelection = () => {
    // The creator user will automatically be added to the channel
    // Deciding that non public channels need at least 1 other member
    return (
      props.channelType === 'private' ||
      props.currentSelection.athletes.length > 0 ||
      props.currentSelection.staff.length > 0
    );
  };

  const clearAthletesAndStaffSelection = () => {
    props.onUpdatedSelection({
      athletes: [],
      staff: [],
    });
  };

  const getAddMembers = () => {
    return (
      <Fragment>
        <div className="slidingPanel__header">{props.t('Channel members')}</div>
        <div className="slidingPanel__content">
          <AthleteAndStaffSelector
            staff={props.staff}
            squads={props.squads}
            excludeId={props.staffUserId}
            useUserIdsForAthletes // Otherwise will be athlete Ids and chat only accepts userIds
            selection={props.currentSelection}
            onSelectionChanged={(selection: AthletesAndStaffSelection) => {
              props.onUpdatedSelection(selection);
            }}
            showDropdownButton={false}
            singleSelection={props.channelType === 'direct'}
          />
        </div>
        <div className="slidingPanelActions">
          <div className="slidingPanelActions__reset">
            <TextButton
              onClick={() => {
                clearAthletesAndStaffSelection();
              }}
              type="secondary"
              text={props.t('Reset')}
              kitmanDesignSystem
            />
          </div>
          <div className="slidingPanelActions__next">
            <TextButton
              onClick={() => {
                props.onStepNext();
              }}
              type="primary"
              text={
                props.channelType !== 'direct'
                  ? props.t('Next')
                  : props.t('Message')
              }
              icon={
                props.channelType !== 'direct'
                  ? 'icon-next-right float-right'
                  : undefined
              }
              isDisabled={!props.nextStepEnabled || !hasValidSelection()}
              kitmanDesignSystem
            />
          </div>
        </div>
      </Fragment>
    );
  };

  return getAddMembers();
};

export default ChatChannelCreationMembers;
export const ChatChannelCreationMembersTranslated = withNamespaces()(
  ChatChannelCreationMembers
);
