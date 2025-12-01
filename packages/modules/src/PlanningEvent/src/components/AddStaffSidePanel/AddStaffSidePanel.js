// @flow
import { useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import capitalize from 'lodash/capitalize';
import {
  AppStatus,
  SlidingPanel,
  TextButton,
  DelayedLoadingFeedback,
  Checkbox,
  SearchBar,
} from '@kitman/components';
import ConfirmationModal from '@kitman/playbook/components/ConfirmationModal';
import { getNotificationsConfirmationModalTranslatedText } from '@kitman/modules/src/CalendarPage/src/utils/eventUtils';
import {
  getStaffOnly,
  getEventsUsers,
  saveEventsUsers,
} from '@kitman/services/src/services/planning';
import type {
  GetStaffOnlyResponse,
  GetEventsUsersResponse,
} from '@kitman/services/src/services/planning';
import type { Event, EventsUser } from '@kitman/common/src/types/Event';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { Chip } from '@kitman/playbook/components';
import { SUSPENDED } from '@kitman/modules/src/LeagueOperations/shared/consts';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { getHumanReadableEventType } from '@kitman/common/src/utils/events';
import type { PreferenceType } from '@kitman/common/src/contexts/PreferenceContext/types';
import { eventTypePermaIds } from '@kitman/services/src/services/planning/getEventLocations';

import styles from './styles';
import { checkAndSetInitStaffCount, updateStaffCount } from './utils';

type Props = {
  title?: string,
  event: Event,
  useOrgId: boolean,
  maxStaffs?: number | null,
  isOpen?: boolean,
  preferences: PreferenceType,
  onClose: () => void,
  onSaveUsersSuccess: () => void,
};

export type Staff = {
  ...EventsUser,
  checked: boolean,
};

const AddStaffSidePanel = (props: I18nProps<Props>) => {
  const { trackEvent } = useEventTracking();

  const leagueOpsDisciplineFlag = window.getFlag('league-ops-discipline-area');
  const isMatchDayFlow =
    props.event.type === eventTypePermaIds.game.type &&
    props.event.league_setup &&
    props.preferences?.league_game_team;

  const clubPhysicianDMRRequiredRoles =
    props.event.type === eventTypePermaIds.game.type &&
    props.event.competition?.required_designation_roles?.length
      ? props.event.competition?.required_designation_roles
      : [];

  const [staff, setStaff] = useState<Array<Staff>>([]);
  const [staffCount, setStaffCount] = useState<Array<number>>([]);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [displayedStaff, setDisplayedStaff] = useState<Array<Staff>>([]);
  const [initialDataRequestStatus, setInitialDataRequestStatus] =
    useState('LOADING');
  const [savingStatus, setSavingStatus] = useState();
  const [searchQuery, setSearchQuery] = useState<?string>();
  const [shouldShowNotificationModal, setShouldShowNotificationModal] =
    useState(false);

  useEffect(() => {
    let ignore = false;
    const getInitialData = async () => {
      if (!props.isOpen) {
        return;
      }

      setInitialDataRequestStatus('LOADING');
      let allStaff: GetStaffOnlyResponse = [];
      let selectedStaff: GetEventsUsersResponse = [];
      try {
        allStaff = await getStaffOnly({
          orgId: props.useOrgId ? props.event?.squad?.owner_id : null,
          includeDisciplineStatus: leagueOpsDisciplineFlag,
          eventId: props.event.id,
          includeStaffRole: isMatchDayFlow,
        });
        selectedStaff = await getEventsUsers({ eventId: props.event.id });
      } catch {
        setInitialDataRequestStatus('FAILURE');
        return;
      }
      if (!ignore) {
        const newStaff = allStaff
          .sort((a, b) => {
            if (a.fullname < b.fullname) {
              return -1;
            }
            if (a.fullname > b.fullname) {
              return 1;
            }
            return 0;
          })
          .map((staffMember) => ({
            ...staffMember,
            checked: selectedStaff.some(
              ({ user }) => user.id === staffMember.id
            ),
          }));

        setStaff(newStaff);
        setDisplayedStaff(newStaff);
        checkAndSetInitStaffCount(newStaff, setStaffCount);
        setInitialDataRequestStatus('SUCCESS');
      }
    };

    getInitialData();
    return () => {
      ignore = true;
    };
  }, [props.isOpen, props.event.id]);

  useEffect(() => {
    if (searchQuery) {
      setDisplayedStaff(
        staff.filter(({ fullname }) =>
          fullname.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setDisplayedStaff(staff);
    }

    const currentStaffCount = isMatchDayFlow
      ? staffCount.filter((staffId) => {
          const foundStaff = staff.find(
            (staffMember) => staffMember.id === staffId
          );

          return clubPhysicianDMRRequiredRoles.length
            ? !clubPhysicianDMRRequiredRoles.includes(foundStaff?.staff_role)
            : true;
        }).length
      : staffCount.length;

    const maxVettedPhysCheck = isMatchDayFlow
      ? staffCount.filter((staffId) => {
          const foundStaff = staff.find(
            (staffMember) => staffMember.id === staffId
          );

          return clubPhysicianDMRRequiredRoles.length
            ? clubPhysicianDMRRequiredRoles.includes(foundStaff?.staff_role)
            : false;
        }).length > 1
      : false;

    // Prevent submitting more staff if you have more than the max staff selected or more than 1 vetted club phys
    if (
      (props.maxStaffs && currentStaffCount > props.maxStaffs) ||
      maxVettedPhysCheck
    ) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [searchQuery, staff, staffCount]);

  const onClickDone = async (sendNotifications = false) => {
    setSavingStatus('LOADING');
    try {
      await saveEventsUsers({
        eventId: props.event.id,
        userIds: staff.filter(({ checked }) => checked).map(({ id }) => id),
        sendNotifications,
      });
    } catch {
      setInitialDataRequestStatus('FAILURE');
      return;
    }
    props.onSaveUsersSuccess();
    setSavingStatus('SUCCESS');
    setSearchQuery('');

    trackEvent(
      `Calendar — ${getHumanReadableEventType(
        props.event
      )} details — Staff selection — Add/remove staff — Done`
    );
  };

  const updateStaffSelection = (staffId: number) => {
    updateStaffCount(staffId, setStaffCount);
    setStaff((currentStaff) =>
      currentStaff.map((currentStaffMember) => {
        return {
          ...currentStaffMember,
          checked:
            currentStaffMember.id === staffId
              ? !currentStaffMember.checked
              : currentStaffMember.checked,
        };
      })
    );
  };

  const renderStaffRow = (staffMember: Staff) => {
    const isStaffRowDisabled =
      capitalize(staffMember?.discipline_status) === SUSPENDED;
    return (
      <li css={styles.staffListItem} key={staffMember.id}>
        <div
          css={styles.staffCheckboxInfo}
          role="none"
          onClick={() => {
            if (!isStaffRowDisabled) updateStaffSelection(staffMember.id);
          }}
        >
          <Checkbox.New
            id={staffMember.id.toString()}
            onClick={() => {}}
            checked={staffMember.checked}
            disabled={isStaffRowDisabled}
          />
          <div css={styles.staffInfoContainer}>
            <span css={styles.staffNameDisplay}>{staffMember.fullname}</span>
            {staffMember.staff_role && (
              <span css={styles.staffRoleDisplay}>
                {staffMember.staff_role}
              </span>
            )}
          </div>
        </div>
        {staffMember?.discipline_status && (
          <Chip
            color={
              capitalize(staffMember?.discipline_status) === SUSPENDED
                ? 'error'
                : 'success'
            }
            label={capitalize(staffMember?.discipline_status)}
            size="medium"
            sx={{ marginTop: '-5px' }}
          />
        )}
      </li>
    );
  };

  const getPanel = () => {
    switch (initialDataRequestStatus) {
      case 'FAILURE':
        return <AppStatus status="error" isEmbed />;
      case 'LOADING':
        return <DelayedLoadingFeedback />;
      case 'SUCCESS':
        return (
          <>
            <div css={styles.searchBar}>
              <SearchBar
                value={searchQuery ?? ''}
                placeholder={props.t('Search staff')}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <ul css={styles.staffList}>
              {displayedStaff.map((staffMember) => renderStaffRow(staffMember))}
            </ul>
            <div className="slidingPanelActions">
              <TextButton
                onClick={props.onClose}
                text={props.t('Cancel')}
                type="secondary"
                kitmanDesignSystem
              />
              <TextButton
                onClick={() => {
                  if (window.getFlag('event-notifications')) {
                    setShouldShowNotificationModal(true);
                  } else {
                    onClickDone();
                  }
                }}
                text={props.t('Done')}
                type="primary"
                isDisabled={isDisabled}
                kitmanDesignSystem
              />
            </div>
            {savingStatus === 'FAILURE' && <AppStatus status="error" />}
            {savingStatus === 'LOADING' && <AppStatus status="loading" />}
            {window.featureFlags['event-notifications'] && (
              <ConfirmationModal
                isModalOpen={shouldShowNotificationModal}
                isLoading={false}
                onConfirm={() => {
                  // passing sendNotifications: true
                  onClickDone(true);
                  setShouldShowNotificationModal(false);
                }}
                onCancel={() => {
                  // passing sendNotifications: false
                  onClickDone(false);
                  setShouldShowNotificationModal(false);
                }}
                onClose={() => setShouldShowNotificationModal(false)}
                translatedText={getNotificationsConfirmationModalTranslatedText()}
              />
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <SlidingPanel
      isOpen={props.isOpen}
      kitmanDesignSystem
      title={props.title || props.t('Add/remove staff')}
      togglePanel={props.onClose}
    >
      {getPanel()}
    </SlidingPanel>
  );
};

export const AddStaffSidePanelTranslated = withNamespaces()(AddStaffSidePanel);
export default AddStaffSidePanel;
