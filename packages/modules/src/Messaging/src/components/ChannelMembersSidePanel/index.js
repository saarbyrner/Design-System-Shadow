// @flow
import { useState, useMemo } from 'react';
import { withNamespaces } from 'react-i18next';
import _uniqBy from 'lodash/uniqBy';
import classNames from 'classnames';
import {
  AthleteAndStaffSelector,
  AppStatus,
  SlidingPanel,
  TextButton,
} from '@kitman/components';
import type {
  AthletesAndStaffSelectorStaffMemberData,
  AthletesSelectorSquadData,
  AthletesAndStaffSelection,
} from '@kitman/components/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { ChannelMemberRemoverTranslated as ChannelMemberRemover } from '../ChannelMemberRemover';
import type {
  UserRole,
  MessagingMember,
  SearchablePerson,
  RoleNameValue,
} from '../../types';
import { getChatIdentityForUser } from '../../utils';
import type { ChannelMembersUpdateStatus } from './types';

type Props = {
  userRole: UserRole,
  staff: Array<AthletesAndStaffSelectorStaffMemberData>,
  athletes: Array<SearchablePerson>,
  squads: Array<AthletesSelectorSquadData>,
  channelMembers: Array<MessagingMember>,
  onAddOrRemoveChannelMembers: Function,
  updateRequestStatus: ChannelMembersUpdateStatus,
  onClose: Function,
};

const ChannelMembersSidePanel = (props: I18nProps<Props>) => {
  const canStaffMembersCurrentlySend = (): boolean => {
    return props.channelMembers.some(
      (member) =>
        member.memberKind === 'STAFF' && member.channelRole === 'channel user'
    );
  };

  const canAthleteMembersCurrentlySend = (): boolean => {
    return props.channelMembers.some(
      (member) =>
        member.memberKind === 'ATHLETE' && member.channelRole === 'channel user'
    );
  };

  const [activeTab, setActiveTab] = useState<'CURRENT_MEMBERS' | 'ADD_MEMBERS'>(
    'CURRENT_MEMBERS'
  );
  const [staffCanSend, setStaffCanSend] = useState(
    canStaffMembersCurrentlySend()
  );
  const [athletesCanSend, setAthletesCanSend] = useState(
    canAthleteMembersCurrentlySend()
  );
  const [membersPlusAdditions, setMembersPlusAdditions] = useState({
    athletes: props.channelMembers
      .filter((member) => member.memberKind === 'ATHLETE')
      .map((athleteMember) => athleteMember.userId),
    staff: props.channelMembers
      .filter((member) => member.memberKind === 'STAFF')
      .map((staffMember) => staffMember.userId),
  });
  const [memberRemovals, setMemberRemovals] = useState({
    athletes: [],
    staff: [],
  });

  const changeToCurrentMembersView = () => {
    // Note: when changing views only then consolidate the additions and removals lists.
    // So as we are navigating away from the AddMembers view where you do additions we
    // filter the removals list so any user we added is not on it,
    // That way members we marked to add will be visible on the CurrentMembers view
    // and will so be selectable again as possible removals
    const removals = {
      athletes: memberRemovals.athletes.filter(
        (athleteUserId) =>
          !membersPlusAdditions.athletes.includes(athleteUserId)
      ),
      staff: memberRemovals.staff.filter(
        (staffUserId) => !membersPlusAdditions.staff.includes(staffUserId)
      ),
    };
    setMemberRemovals(removals);
    setActiveTab('CURRENT_MEMBERS');
  };

  const changeToAddMembersView = () => {
    // Note: when changing views only then consolidate the additions and removals lists.
    // So as we are navigating away from the CurrentMembers view where you do removals we
    // filter the additions list so any user we removed is not on it,
    // That way users we marked to remove will be visible on the AddMembers view
    // and will so be selectable again as possible additions
    const additions = {
      athletes: membersPlusAdditions.athletes.filter(
        (athleteUserId) => !memberRemovals.athletes.includes(athleteUserId)
      ),
      staff: membersPlusAdditions.staff.filter(
        (staffUserId) => !memberRemovals.staff.includes(staffUserId)
      ),
    };
    setMembersPlusAdditions(additions);
    setActiveTab('ADD_MEMBERS');
  };

  const getStaffMemberFullname = (staffId: string) => {
    const result = props.staff.find((staffMember) => {
      return staffMember.id.toString() === staffId;
    });
    if (result) {
      return `${result.firstname} ${result.lastname}`;
    }
    return undefined;
  };

  const getAthleteFullname = (athleteUserId: string) => {
    const result = props.athletes.find((athlete) => {
      return athlete.user_id.toString() === athleteUserId;
    });
    if (result) {
      return result.display_name;
    }
    return undefined;
  };

  const convertAdditionsIdsToMemberObjects = () => {
    const staffAdditions = membersPlusAdditions.staff.map((staffId: string) => {
      return {
        messagingIdentity: getChatIdentityForUser(
          props.userRole.orgId,
          staffId
        ),
        userId: staffId,
        friendlyName: getStaffMemberFullname(staffId),
        memberKind: 'STAFF',
        channelRole: null,
      };
    });

    const athleteAdditions = membersPlusAdditions.athletes.map(
      // $FlowIgnore - athleteUserId will never be type of object
      (athleteUserId: string) => {
        return {
          messagingIdentity: getChatIdentityForUser(
            props.userRole.orgId,
            athleteUserId
          ),
          userId: athleteUserId,
          friendlyName: getAthleteFullname(athleteUserId),
          memberKind: 'ATHLETE',
          channelRole: null,
        };
      }
    );

    const members = _uniqBy(
      [...props.channelMembers, ...staffAdditions, ...athleteAdditions],
      'messagingIdentity'
    ).sort((a: MessagingMember, b: MessagingMember) => {
      if (a.friendlyName) {
        if (b.friendlyName) {
          return a.friendlyName.localeCompare(b.friendlyName); // Names might have non-ASCII characters,
        }
        return a.friendlyName.localeCompare(b.messagingIdentity);
      }

      if (b.friendlyName) {
        return a.messagingIdentity.localeCompare(b.friendlyName); // Names might have non-ASCII characters,
      }

      return a.messagingIdentity.localeCompare(b.messagingIdentity);
    });

    return members;
  };

  const memoedMemberObjects = useMemo(() => {
    return convertAdditionsIdsToMemberObjects();
  }, [props.channelMembers, membersPlusAdditions]);

  const haveMadeChanges = () => {
    return (
      memberRemovals.staff.length > 0 ||
      memberRemovals.athletes.length > 0 ||
      membersPlusAdditions.staff.length +
        membersPlusAdditions.athletes.length !==
        props.channelMembers.length ||
      staffCanSend !== canStaffMembersCurrentlySend() ||
      athletesCanSend !== canAthleteMembersCurrentlySend()
    );
  };

  const clearAdditionsSelection = () => {
    setMembersPlusAdditions({
      athletes: props.channelMembers
        .filter((member) => member.memberKind === 'ATHLETE')
        .map((athleteMember) => athleteMember.userId),
      staff: props.channelMembers
        .filter((member) => member.memberKind === 'STAFF')
        .map((staffMember) => staffMember.userId),
    });
  };

  const clearRemovalsSelection = () => {
    setMemberRemovals({
      athletes: [],
      staff: [],
    });
  };

  const saveChannelMembers = () => {
    const memberIds = props.channelMembers.map((member: MessagingMember) => {
      return member.userId;
    });

    let filteredRemovals: AthletesAndStaffSelection;
    let filteredAdditions: AthletesAndStaffSelection;

    if (activeTab === 'ADD_MEMBERS') {
      // Only allow removal if is currently a member
      filteredRemovals = {
        athletes: memberRemovals.athletes.filter(
          (athleteUserId) =>
            !membersPlusAdditions.athletes.includes(athleteUserId) &&
            memberIds.includes(athleteUserId)
        ),
        staff: memberRemovals.staff.filter(
          (staffUserId) =>
            !membersPlusAdditions.staff.includes(staffUserId) &&
            memberIds.includes(staffUserId)
        ),
      };
      // Ensure not including an existing member in additions
      // Any updates to members is dealt with separately
      filteredAdditions = {
        // $FlowIgnore - athleteUserId will never be type of object
        athletes: membersPlusAdditions.athletes.filter(
          (athleteUserId) => !memberIds.includes(athleteUserId)
        ),
        staff: membersPlusAdditions.staff.filter(
          (staffUserId) => !memberIds.includes(staffUserId)
        ),
      };
    } else {
      // Ensure not including an existing member in additions
      // Any updates to members is dealt with separately
      filteredAdditions = {
        athletes: membersPlusAdditions.athletes.filter(
          (athleteUserId) =>
            !memberRemovals.athletes.includes(athleteUserId) &&
            !memberIds.includes(athleteUserId)
        ),
        staff: membersPlusAdditions.staff.filter(
          (staffUserId) =>
            !memberRemovals.staff.includes(staffUserId) &&
            !memberIds.includes(staffUserId)
        ),
      };
      // Only allow removal if is currently a member
      filteredRemovals = {
        athletes: memberRemovals.athletes.filter((athleteUserId) =>
          memberIds.includes(athleteUserId)
        ),
        staff: memberRemovals.staff.filter((staffUserId) =>
          memberIds.includes(staffUserId)
        ),
      };
    }

    const athletesForRemovalMemberSids = filteredRemovals.athletes.map(
      (userId) => {
        const sameMember = props.channelMembers.find((member) => {
          return member.userId === userId;
        });
        return sameMember?.channelMemberSid;
      }
    );

    const staffForRemovalMemberSids = filteredRemovals.staff.map((userId) => {
      const sameMember = props.channelMembers.find((member) => {
        return member.userId === userId;
      });
      return sameMember?.channelMemberSid;
    });

    const intendedStaffRole: RoleNameValue = staffCanSend
      ? 'channel user'
      : 'channel user - readonly';
    const intendedAthleteRole: RoleNameValue = athletesCanSend
      ? 'channel user'
      : 'channel user - readonly';

    const staffNeedingUpdate = props.channelMembers
      .filter((member: MessagingMember) => {
        return (
          member.memberKind === 'STAFF' &&
          member.channelRole !== intendedStaffRole &&
          member.channelRole !== 'channel admin' // Avoid changing anyone that has channel admin role
        );
      })
      .map((member: MessagingMember) => {
        return member.userId;
      });
    filteredAdditions.staff.push(...staffNeedingUpdate);

    const athletesNeedingUpdate = props.channelMembers
      .filter((member: MessagingMember) => {
        return (
          member.memberKind === 'ATHLETE' &&
          member.channelRole !== intendedAthleteRole &&
          member.channelRole !== 'channel admin' // Avoid changing anyone that has channel admin role
        );
      })
      .map((member: MessagingMember) => {
        return member.userId;
      });
    filteredAdditions.athletes.push(...athletesNeedingUpdate);

    props.onAddOrRemoveChannelMembers(
      [...athletesForRemovalMemberSids, ...staffForRemovalMemberSids],
      filteredAdditions, // Includes members needing updates
      staffCanSend,
      athletesCanSend
    );
  };

  return (
    <div className="channelMembersSidePanel">
      <SlidingPanel
        cssTop={50}
        width={460}
        isOpen
        title={props.t('Manage Members')}
        togglePanel={() => {
          props.onClose();
        }}
        kitmanDesignSystem
      >
        <div className="slidingPanel__content">
          <div className="slidingPanel__indent">
            <div className="btn-group segmentedControl">
              <button
                type="button"
                className={classNames('btn btn-primary', {
                  active: activeTab === 'CURRENT_MEMBERS',
                })}
                onClick={() => {
                  changeToCurrentMembersView();
                }}
              >
                {props.t('Current members')}
              </button>
              <button
                type="button"
                className={classNames('btn btn-primary', {
                  active: activeTab === 'ADD_MEMBERS',
                })}
                onClick={() => {
                  changeToAddMembersView();
                }}
              >
                {props.t('Add members')}
              </button>
            </div>
          </div>
          {activeTab === 'CURRENT_MEMBERS' && (
            <ChannelMemberRemover
              channelMembers={memoedMemberObjects}
              selection={memberRemovals}
              athletesCanSend={athletesCanSend}
              staffCanSend={staffCanSend}
              onAthletesCanSendChanged={(value: boolean) => {
                setAthletesCanSend(value);
              }}
              onStaffCanSendChanged={(value: boolean) => {
                setStaffCanSend(value);
              }}
              onSelectionChanged={(selection: AthletesAndStaffSelection) => {
                setMemberRemovals(selection);
              }}
              showDropdownButton={false}
            />
          )}
          {activeTab === 'ADD_MEMBERS' && (
            <AthleteAndStaffSelector
              staff={props.staff}
              squads={props.squads}
              useUserIdsForAthletes // Otherwise will be athlete Ids and chat only accepts userIds
              selection={membersPlusAdditions}
              onSelectionChanged={(selection: AthletesAndStaffSelection) => {
                setMembersPlusAdditions(selection);
              }}
              showDropdownButton={false}
              actionElement="PLUS_BUTTON"
              addTransitionOnSelection
            />
          )}
        </div>
        <div className="slidingPanelActions">
          <div className="slidingPanelActions__reset">
            <TextButton
              onClick={() => {
                setStaffCanSend(canStaffMembersCurrentlySend());
                setAthletesCanSend(canAthleteMembersCurrentlySend());
                clearRemovalsSelection();
                clearAdditionsSelection();
              }}
              type="secondary"
              text={props.t('Reset')}
              isDisabled={!haveMadeChanges()}
              kitmanDesignSystem
            />
          </div>
          <div className="slidingPanelActions__next">
            <TextButton
              onClick={() => {
                saveChannelMembers();
              }}
              type="primary"
              text={props.t('Save')}
              isDisabled={!haveMadeChanges()}
              kitmanDesignSystem
            />
          </div>
        </div>
        {props.updateRequestStatus === 'IN_PROGRESS' && (
          <AppStatus status="loading" message="Updating members" isEmbed />
        )}
      </SlidingPanel>
    </div>
  );
};

export default ChannelMembersSidePanel;
export const ChannelMembersSidePanelTranslated = withNamespaces()(
  ChannelMembersSidePanel
);
