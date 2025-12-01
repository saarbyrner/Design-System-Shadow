// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { AppStatus, SlidingPanel } from '@kitman/components';
import type {
  AthletesSelectorSquadData,
  AthletesAndStaffSelectorStaffMemberData,
  AthletesAndStaffSelection,
  AthleteSelectorPositionGroup,
} from '@kitman/components/src/types';
import type { Validation } from '@kitman/common/src/types/index';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { CreatableChannelTypes, UserRole } from '../../types';
import type { CreationStatus } from './types';
import { ChatChannelCreationDetailsTranslated as ChatChannelCreationDetails } from './ChatChannelCreationDetails';
import { ChatChannelCreationMembersTranslated as ChatChannelCreationMembers } from './ChatChannelCreationMembers';

type Props = {
  flowStep?: number,
  userRole: UserRole,
  staff: Array<AthletesAndStaffSelectorStaffMemberData>,
  squads: Array<AthletesSelectorSquadData>,
  channelType: CreatableChannelTypes,
  isEditMode: boolean,
  athletesCanSend?: boolean,
  staffCanSend?: boolean,
  channelSid?: string,
  channelName?: string,
  description?: string,
  onCreate: Function,
  onClose: Function,
  onSwitchedChannel: Function,
  onRefreshChannelLists: Function,
};

const ChatChannelCreationSidePanel = (props: I18nProps<Props>) => {
  const [channelCreationStatus, setChannelCreationStatus] =
    useState<CreationStatus>('IDLE');

  const [testedChannelName, setTestedChannelName] = useState(props.channelName);

  const [creationFlowStep, setCreationFlowStep] = useState(
    props.flowStep ? props.flowStep : 0
  );
  const [athletesAndStaffSelection, setAthletesAndStaffSelection] = useState({
    athletes: [],
    staff: [],
  });

  const findAthleteInPositionGroup = (
    athleteUserId: string,
    positionGroup: AthleteSelectorPositionGroup
  ) => {
    for (let i = 0; i < positionGroup.positions.length; i++) {
      const position = positionGroup.positions[i];
      for (let j = 0; j < position.athletes.length; j++) {
        const athlete = position.athletes[j];
        if (athlete.user_id.toString() === athleteUserId) {
          return athlete;
        }
      }
    }
    return undefined;
  };

  const getAthleteFullname = (athleteUserId: string): string => {
    for (let i = 0; i < props.squads.length; i++) {
      const squad = props.squads[i];
      for (let j = 0; j < squad.position_groups.length; j++) {
        const athlete = findAthleteInPositionGroup(
          athleteUserId,
          squad.position_groups[j]
        );
        if (athlete) {
          return athlete.fullname;
        }
      }
    }
    return 'unknown';
  };

  const getDirectMsgTargetFriendlyName = (): ?string => {
    if (athletesAndStaffSelection.staff.length > 0) {
      const staffTarget = props.staff.find((staffMember) => {
        return (
          staffMember.id.toString() ===
          athletesAndStaffSelection.staff[0].toString()
        );
      });
      if (staffTarget) {
        return `${staffTarget.firstname} ${staffTarget.lastname}`;
      }
    }
    if (athletesAndStaffSelection.athletes.length > 0) {
      return getAthleteFullname(
        athletesAndStaffSelection.athletes[0].toString()
      );
    }
    return undefined;
  };

  const createAndSwitchToChannel = (
    channelName: string,
    channelDescription: ?string,
    staffCanSend: boolean,
    athletesCanSend: boolean,
    targetFriendlyName?: string
  ) => {
    // assign promise for tests to run as just spying and not mocking onCreate
    const promiseToCreate = props.onCreate(
      props.channelType,
      channelName,
      channelDescription,
      athletesAndStaffSelection,
      staffCanSend,
      athletesCanSend,
      props.channelSid,
      targetFriendlyName
    );
    if (promiseToCreate) {
      promiseToCreate.then(
        (channelSid: string) => {
          props.onSwitchedChannel(channelSid).then(() => {
            props.onRefreshChannelLists().then(() => {
              props.onClose();
            });
          });
        },
        (rejectionReason: Error) => {
          setTestedChannelName(channelName);
          if (rejectionReason.message === 'FAILURE_NAME_IN_USE') {
            setChannelCreationStatus(rejectionReason.message);
          } else {
            setChannelCreationStatus('FAILURE_GENERAL_ERROR');
          }
        }
      );
    }
  };

  const createChannelWithDetails = (
    channelName: string,
    channelDescription: ?string,
    staffCanSend: boolean,
    athletesCanSend: boolean
  ) => {
    setChannelCreationStatus('CREATING');
    if (props.channelType === 'direct') {
      const targetFriendlyName = getDirectMsgTargetFriendlyName();
      createAndSwitchToChannel(
        channelName,
        channelDescription,
        staffCanSend,
        athletesCanSend,
        targetFriendlyName || 'unknown'
      );
    } else {
      createAndSwitchToChannel(
        channelName,
        channelDescription,
        staffCanSend,
        athletesCanSend
      );
    }
  };

  const validateChannelName = (name: string): Validation => {
    if (name.includes('||')) {
      return {
        isValid: false,
        message: props.t('Invalid characters'),
      };
    }
    if (
      testedChannelName &&
      channelCreationStatus === 'FAILURE_NAME_IN_USE' &&
      name === testedChannelName
    ) {
      return {
        isValid: false,
        message: `${testedChannelName} ${props.t('is in use')}`,
      };
    }
    return { isValid: true };
  };

  const getTitle = () => {
    switch (props.channelType) {
      case 'private':
        return props.isEditMode
          ? props.t('Edit private channel')
          : props.t('New private channel');
      case 'direct': {
        const targetName = getDirectMsgTargetFriendlyName();

        if (props.isEditMode) {
          if (targetName) {
            return `${props.t('Edit direct message with:')} ${targetName}`;
          }
          return props.t('Edit direct message');
        }
        if (targetName) {
          return `${props.t('New direct message with:')} ${targetName}`;
        }
        return props.t('New direct message');
      }
      default:
        return props.isEditMode
          ? props.t('Edit channel')
          : props.t('New channel');
    }
  };

  return (
    <div className="chatChannelCreation">
      <SlidingPanel
        cssTop={50}
        width={460}
        isOpen
        title={getTitle()}
        togglePanel={() => {
          if (
            channelCreationStatus === 'IDLE' ||
            channelCreationStatus === 'FAILURE_NAME_IN_USE'
          ) {
            props.onClose();
          }
        }}
        kitmanDesignSystem
      >
        {creationFlowStep === 0 && (
          <ChatChannelCreationMembers
            staffUserId={props.userRole.staffUserId}
            staff={props.staff}
            squads={props.squads}
            channelType={props.channelType}
            currentSelection={athletesAndStaffSelection}
            onUpdatedSelection={(selection: AthletesAndStaffSelection) => {
              setAthletesAndStaffSelection(selection);
            }}
            nextStepEnabled={
              channelCreationStatus === 'IDLE' ||
              channelCreationStatus === 'FAILURE_NAME_IN_USE'
            }
            onStepNext={() => {
              if (props.channelType !== 'direct') {
                setCreationFlowStep(1); // Move to the next step
              } else {
                createChannelWithDetails('', undefined, true, true); // Direct Message creation has only 1 step
              }
            }}
          />
        )}
        {creationFlowStep === 1 && (
          <ChatChannelCreationDetails
            channelType={props.channelType}
            isEditMode={props.isEditMode}
            athletesCanSend={props.athletesCanSend}
            staffCanSend={props.staffCanSend}
            channelName={testedChannelName}
            description={props.description}
            onCreate={createChannelWithDetails}
            channelCreationStatus={channelCreationStatus}
            onStepBack={() => {
              setCreationFlowStep(0);
            }}
            channelNameValidation={validateChannelName}
          />
        )}
      </SlidingPanel>
      {(channelCreationStatus === 'FAILURE_GENERAL_ERROR' ||
        channelCreationStatus === 'CREATING') && (
        <AppStatus
          status={
            channelCreationStatus === 'FAILURE_GENERAL_ERROR'
              ? 'error'
              : 'loading'
          }
          message=""
        />
      )}
    </div>
  );
};

export default ChatChannelCreationSidePanel;
export const ChatChannelCreationSidePanelTranslated = withNamespaces()(
  ChatChannelCreationSidePanel
);
