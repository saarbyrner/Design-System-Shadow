// @flow
import { GridCellParams } from '@mui/x-data-grid';
import KitMatrixCard from '@kitman/modules/src/PlanningHub/src/components/EventsScheduleGrid/KitMatrixCard';
import { GridActionsCellItem, Stack } from '@kitman/playbook/components';
import LimitedChips from '@kitman/modules/src/LeagueOperations/shared/components/LimitedChips';

import type { Game } from '@kitman/common/src/types/Event';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import Countdown from '@kitman/modules/src/MatchDay/components/Countdown';
import i18n from '@kitman/common/src/utils/i18n';
import useExternalAccess from '@kitman/modules/src/LeagueFixtures/src/shared/ExternalAccessPanel/hooks/useExternalAccess';
import { TextButton, TooltipMenu } from '@kitman/components';
import { APPROVED_STATUS_COLORS } from './constants';
import MatchDayStatusInfo from '../../MatchDayStatusInfo';
import { ScoutRequestAccessButtonTranslated as ScoutRequestAccessButton } from '../ScoutAccessRequestButton';
import { menuButtonTypes } from '../helpers';
import { getReportTextType } from '../utils';

export const ScoutAccessActionsMenuCell = (props: {
  event?: Game,
  isVisible: boolean,
  doesHaveExternalAccessActions: boolean,
  handleMenuButtonAction: () => void,
}) => {
  const { menuItem } = useExternalAccess(props.event);

  let menuItems = [];

  if (!props.isVisible) return null;

  if (props.doesHaveExternalAccessActions) menuItems = [menuItem];
  else {
    menuItems = [
      {
        description: i18n.t('Withdraw request'),
        onClick: props.handleMenuButtonAction,
      },
    ];
  }

  return (
    <TooltipMenu
      placement="bottom-end"
      menuItems={menuItems}
      tooltipTriggerElement={
        <TextButton
          iconAfter="icon-more"
          type="secondary"
          testId="scout-access-actions-menu-button"
          kitmanDesignSystem
        />
      }
      kitmanDesignSystem
    />
  );
};

export const renderKitMatrixCardCell = (params: GridCellParams) => {
  return (
    <KitMatrixCard
      backgroundColor={params.value?.data?.kit_matrix?.primary_color}
      type={params.field}
      isDisabled={params.value?.isDisabled}
    />
  );
};

export const renderCountdownCell = (params: GridCellParams) => {
  return (
    <Stack direction="row" spacing={1}>
      <Countdown targetDate={params.value.startDate} />
      <KitmanIcon
        name={KITMAN_ICON_NAMES.Lock}
        style={{
          opacity: params.value?.isDmrLocked ? 100 : 0,
          fontSize: 20,
        }}
      />
    </Stack>
  );
};

export const renderMatchDayStatusCell = (params: GridCellParams) => (
  <MatchDayStatusInfo
    homeStatus={params.value.home}
    awayStatus={params.value.away}
    skipAutomaticGameTeamEmail={params.row.skipAutomaticGameTeamEmail}
  />
);

export const getLeagueFixturesActionCell = (
  params: GridCellParams
): Array<React$Node> => {
  const { row } = params;
  const { actions, id } = row || {};
  const {
    canViewMatchRoster,
    canViewMatchReport,
    canViewMatchRequests,
    canManageMatchReport,
    canViewMatchMonitorReport,
    canEditFixture,
    reportSubmitted,
    isMatchMonitor,
    viewActionRedirect,
    handleMenuButtonAction,
    onClickEditEvent,
  } = actions || {};

  const canViewReport = isMatchMonitor
    ? canViewMatchMonitorReport
    : canViewMatchReport;
  const canManageReport = isMatchMonitor
    ? canViewMatchMonitorReport
    : canManageMatchReport;
  const actionText = getReportTextType(isMatchMonitor);
  const items: Array<React$Node> = [];

  if (canEditFixture) {
    items.push(
      <GridActionsCellItem
        key="edit_fixture"
        label={i18n.t('Edit fixture')}
        onClick={(event) => onClickEditEvent?.(event)}
        showInMenu
      />
    );
  }

  if (canViewMatchRoster) {
    items.push(
      <GridActionsCellItem
        key="view_roster"
        label={i18n.t('View match roster')}
        onClick={() => viewActionRedirect?.(id, 'ROSTER')}
        showInMenu
      />
    );
  }

  if (canViewMatchRequests) {
    items.push(
      <GridActionsCellItem
        key="view_requests"
        label={i18n.t('View scout requests')}
        onClick={() => viewActionRedirect?.(id, 'REQUESTS')}
        showInMenu
      />
    );
  }

  if (canViewReport) {
    items.push(
      <GridActionsCellItem
        key="view_report"
        label={i18n.t('View {{actionText}} report', { actionText })}
        onClick={() => viewActionRedirect?.(id)}
        showInMenu
      />
    );
  }

  if (reportSubmitted && canManageReport) {
    items.push(
      <GridActionsCellItem
        key="unlock_report"
        label={i18n.t('Unlock {{actionText}} report', { actionText })}
        onClick={() => handleMenuButtonAction?.(menuButtonTypes.unlock)}
        showInMenu
      />
    );
  }

  if (canManageReport) {
    items.push(
      <GridActionsCellItem
        key="reset_report"
        label={i18n.t('Reset {{actionText}} report', { actionText })}
        onClick={() => handleMenuButtonAction?.(menuButtonTypes.reset)}
        showInMenu
      />
    );
  }

  return items;
};

export const getMatchDayActionsCell = (
  params: GridCellParams
): Array<React$Node> => {
  const { row } = params;
  const { actions, id } = row || {};
  const { openEdit, canEditFixture, unlockDmr, isDmrUnlocked } = actions || {};

  const menuItems = [];

  if (canEditFixture) {
    menuItems.push(
      <GridActionsCellItem
        label={i18n.t('Edit')}
        onClick={() => openEdit()}
        showInMenu
        key="edit_fixture"
      />
    );
  }

  menuItems.push(
    <GridActionsCellItem
      label={`${i18n.t('Unlock')} DMR`}
      onClick={() => unlockDmr(id, true)}
      showInMenu
      key="unlock_dmr"
      disabled={!!isDmrUnlocked}
    />
  );

  return menuItems;
};

export const getScoutAccessManagementActionsCell = (
  params: GridCellParams,
  canManageAccess: boolean
) => {
  if (canManageAccess) {
    if (
      params?.value?.numberOfRequests &&
      params?.value?.numberOfRequests.total > 0
    ) {
      const accessChips = [];

      Object.entries(params?.value?.numberOfRequests)
        .filter(([key, value]) => parseInt(value, 10) > 0 && key !== 'total')
        .forEach(([key, value]) => {
          const approvedStatus = key === 'denied' ? 'rejected' : key;
          const item = {
            id: key,
            name: `${String(value)} ${approvedStatus}`,
            color: APPROVED_STATUS_COLORS[key] || '',
            textColor: APPROVED_STATUS_COLORS[key] ? 'white' : '',
          };

          if (
            key === 'requested' ||
            key === 'pending' ||
            (!params?.value?.numberOfRequests.requested &&
              !params?.value?.numberOfRequests.pending &&
              key === 'approved')
          ) {
            accessChips.unshift(item);
          } else {
            accessChips.push(item);
          }
        });

      return <LimitedChips items={accessChips} maxVisible={1} />;
    }
    return null;
  }
  return (
    <ScoutRequestAccessButton
      eventId={params?.value?.eventId}
      userEventRequests={params?.value?.userEventRequests}
      setUserEventRequests={params?.value?.setUserEventRequests}
      userEventRequest={params?.value?.userEventRequest}
      requestButtonViewable={params?.value?.requestButtonViewable}
    />
  );
};

export const getScoutAttendeesCell = (params: GridCellParams) => {
  const items =
    params.value?.map((user) => {
      return {
        id: user.id,
        name: `${user.firstname} ${user.lastname}`,
      };
    }) ?? [];

  if (!items.length) {
    return null;
  }

  return <LimitedChips items={items} maxVisible={1} />;
};
