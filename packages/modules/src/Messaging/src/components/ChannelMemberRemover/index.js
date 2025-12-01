// @flow
import { useState, useMemo } from 'react';
import _cloneDeep from 'lodash/cloneDeep';
import { withNamespaces, setI18n } from 'react-i18next';
import classNames from 'classnames';
import i18n from '@kitman/common/src/utils/i18n';
import {
  Accordion,
  DropdownWrapper,
  IconButton,
  Select,
} from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import ChatAvatar from '../ChatAvatar';
import type { MessagingMember, ChannelMemberPermission } from '../../types';
import type { AthletesAndStaffSelection } from './types';

// set the i18n instance
setI18n(i18n);

type Props = {
  channelMembers: Array<MessagingMember>,
  selection: AthletesAndStaffSelection,
  athletesCanSend: boolean,
  staffCanSend: boolean,
  onAthletesCanSendChanged: Function,
  onStaffCanSendChanged: Function,
  onSelectionChanged: Function,
};

function ChannelMemberRemover(props: I18nProps<Props>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [staffExpanded, setStaffExpanded] = useState(true);
  const [athletesExpanded, setAthletesExpanded] = useState(true);

  const athleteMembers = useMemo(
    () =>
      props.channelMembers.filter((member) => member.memberKind === 'ATHLETE'),
    [props.channelMembers] // Will only recalc when props.channelMembers changes
  );

  const staffMembers = useMemo(
    () =>
      props.channelMembers.filter((member) => member.memberKind === 'STAFF'),
    [props.channelMembers] // Will only recalc when props.channelMembers changes
  );

  const privilegeOptions = [
    { value: 'SEND', label: props.t('Send messages') },
    { value: 'VIEW', label: props.t('View only') },
  ];

  const staffHasSearchMatch = (searchValue: string) => {
    if (searchValue === '') {
      return true;
    }

    return staffMembers.some(
      (staffMember) =>
        staffMember.friendlyName &&
        staffMember.friendlyName.toLowerCase().includes(searchValue)
    );
  };

  const athletesHasSearchMatch = (searchValue: string) => {
    if (searchValue === '') {
      return true;
    }

    return athleteMembers.some(
      (athlete) =>
        athlete.friendlyName &&
        athlete.friendlyName.toLowerCase().includes(searchValue)
    );
  };

  const shouldExpandAthletes = (searchValue: string) => {
    if (searchValue === '') {
      return athletesExpanded;
    }
    return athletesHasSearchMatch(searchValue);
  };

  const shouldExpandStaff = (searchValue: string) => {
    if (searchValue === '') {
      return staffExpanded;
    }
    return staffHasSearchMatch(searchValue);
  };

  const onRemoveStaff = (staffMemberId: string) => {
    const updatedSelection = _cloneDeep(props.selection);
    updatedSelection.staff.push(staffMemberId);
    props.onSelectionChanged(updatedSelection);
  };

  const onRemoveAthlete = (athleteId: string) => {
    const updatedSelection = _cloneDeep(props.selection);
    updatedSelection.athletes.push(athleteId);
    props.onSelectionChanged(updatedSelection);
  };

  const memberMatchesSearchTerm = (member: MessagingMember) => {
    if (searchTerm === '') {
      return true;
    }

    return (
      member.friendlyName &&
      member.friendlyName.toLowerCase().includes(searchTerm)
    );
  };

  const getMembers = (
    members: Array<MessagingMember>,
    removeFunction: Function,
    selectedIds: Array<string>
  ) => {
    return members.map((member) => {
      return (
        <li key={`staff_${member.messagingIdentity}`}>
          {memberMatchesSearchTerm(member) && (
            <div
              className={classNames('channelMemberRemover__memberRow', {
                'channelMemberRemover__memberRow--transitionToRemoved':
                  selectedIds.includes(member.userId),
              })}
            >
              <span className="channelMemberRemover__memberDetails">
                <ChatAvatar
                  userIdentity={member.messagingIdentity}
                  friendlyName={member.friendlyName}
                />
                <span className="channelMemberRemover__memberName">
                  {member.friendlyName || member.messagingIdentity}
                </span>
              </span>
              <span className="channelMemberRemover__removeButton">
                <IconButton
                  icon="icon-close"
                  onClick={() => {
                    removeFunction(member.userId);
                  }}
                  isSmall
                  isTransparent
                />
              </span>
            </div>
          )}
        </li>
      );
    });
  };

  const getAthletesBlock = () => {
    return (
      <Accordion
        key="athletes"
        title={
          <>
            <div className="channelMemberRemover__accordionTitle">
              {props.t('Athletes')}
            </div>
            <div
              className="channelMemberRemover__privilegeSelector"
              onClick={(e) => e.stopPropagation()}
            >
              <Select
                value={props.athletesCanSend === true ? 'SEND' : 'VIEW'}
                onChange={(optionId: ChannelMemberPermission) =>
                  props.onAthletesCanSendChanged(optionId === 'SEND')
                }
                options={privilegeOptions}
                onValueClick={(e) => e.stopPropagation()}
              />
            </div>
          </>
        }
        content={
          <>
            {getMembers(
              athleteMembers,
              onRemoveAthlete,
              props.selection.athletes
            )}
          </>
        }
        onChange={() => {
          setAthletesExpanded(!athletesExpanded);
        }}
        isOpen={shouldExpandAthletes(searchTerm)}
      />
    );
  };

  const getStaffBlock = () => {
    return (
      <Accordion
        key="staff"
        title={
          <>
            <div className="channelMemberRemover__accordionTitle">
              {props.t('Staff')}
            </div>
            <div
              className="channelMemberRemover__privilegeSelector"
              onClick={(e) => e.stopPropagation()}
            >
              <Select
                value={props.staffCanSend === true ? 'SEND' : 'VIEW'}
                onChange={(optionId: ChannelMemberPermission) =>
                  props.onStaffCanSendChanged(optionId === 'SEND')
                }
                options={privilegeOptions}
                onValueClick={(e) => e.stopPropagation()}
              />
            </div>
          </>
        }
        content={
          <>{getMembers(staffMembers, onRemoveStaff, props.selection.staff)}</>
        }
        onChange={() => {
          setStaffExpanded(!staffExpanded);
        }}
        isOpen={shouldExpandStaff(searchTerm)}
      />
    );
  };

  return (
    <DropdownWrapper
      hasSearch
      showDropdownButton={false}
      searchTerm={searchTerm}
      dropdownTitle=""
      onTypeSearchTerm={(term) => {
        setSearchTerm(term.toLowerCase());
      }}
    >
      <div className="channelMemberRemover">
        <div className="channelMemberRemover__content">
          {athleteMembers.length > 0 && getAthletesBlock()}
          {staffMembers.length > 0 && (
            <>
              <div className="channelMemberRemover__divider" />
              {getStaffBlock()}
            </>
          )}
        </div>
      </div>
    </DropdownWrapper>
  );
}

export default ChannelMemberRemover;
export const ChannelMemberRemoverTranslated =
  withNamespaces()(ChannelMemberRemover);
