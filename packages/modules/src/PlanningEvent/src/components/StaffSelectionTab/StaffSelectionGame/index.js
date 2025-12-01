// @flow
/* eslint-disable camelcase */
import { withNamespaces } from 'react-i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { compact, isEqual } from 'lodash';

import type { Event, Game } from '@kitman/common/src/types/Event';

import { SearchBar, TextButton } from '@kitman/components';
import type { GetEventsUsersResponse } from '@kitman/services/src/services/planning';
import { eventsUsersOrder, getEventsUsers } from '@kitman/services/src/services/planning';
import type { RequestStatus } from '@kitman/modules/src/PlanningEvent/types';
import { CircularProgress, DataGrid as MuiDataGrid } from '@kitman/playbook/components';
import { eventTypePermaIds } from '@kitman/services/src/services/planning/getEventLocations';
import type { GameActivityStorage, GamePeriodStorage } from '@kitman/common/src/types/GameEvent';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { checkIsDmrLocked, getDmrBannerChecks } from '@kitman/common/src/utils/planningEvent';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { updateClubAndLeagueEventsCompliance } from '@kitman/modules/src/PlanningEvent/src/helpers/utils';
import type { SetState } from '@kitman/common/src/types/react';
import useUpdateDmrStatus from '@kitman/modules/src/PlanningEvent/src/hooks/useUpdateDmrStatus';

import { AddStaffSidePanelTranslated as AddStaffSidePanel } from '../../AddStaffSidePanel';
import { gameStaffColumnHeaders, reorderEvents, userFormatter } from '../utils';
import style from '../style';
import athleteSelectionStyles from '../../AthletesSelectionTab/style';
import { GameEventsFooterTranslated as GameEventsFooter } from '../../GameEventsTab/GameEventsFooter';
import { muiDataGridProps } from '../../AthletesSelectionTab/gameEventSelectionGridConfig';
import type { Row } from '../index';

type Props = {
  requestStatus: RequestStatus,
  event: Game,
  leagueEvent: Event,
  onUpdateLeagueEvent: SetState<Event>,
  onUpdateEvent: Function,
};

const StaffSelectionGame = (props: I18nProps<Props>) => {
  const { isLeague, isLeagueStaffUser } = useLeagueOperations();
  const { preferences } = usePreferences();
  const { permissions } = usePermissions();

  const { getUpdatedDmrStatusInfo } = useUpdateDmrStatus();

  const isImportedGame = props.event.league_setup;

  const isMatchDayFlow = isImportedGame && preferences?.league_game_team;

  const isMatchDayLockedFlow =
    isMatchDayFlow && preferences?.league_game_team_lock_minutes;

  const canEditTeamsPermissions =
    preferences?.league_game_team && permissions?.leagueGame.manageGameTeam;

  /**
   * Determines if the user can manage DMR (Digital Match Report).
   * this is based on the permissions feature flag, the user's permissions, the event type, and the DMR club user flag.
   */
  const isDmrLocked = isMatchDayLockedFlow
    ? checkIsDmrLocked({
        event: props.event,
        isDmrClubUser: !isLeagueStaffUser,
        isEditPermsPresent: canEditTeamsPermissions,
      })
    : false;

  const { localGameActivities } = useSelector<GameActivityStorage>(
    (state) => state.planningEvent.gameActivities
  );

  const { localEventPeriods } = useSelector<GamePeriodStorage>(
    (state) => state.planningEvent.eventPeriods
  );

  const [requestStatus, setRequestStatus] = useState<RequestStatus>('LOADING');
  const [usersEvents, setUsersEvents] = useState<Array<Row>>([]);
  const [isAddStaffPanelOpen, setAddStaffPanelOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectionHeaders = compact([
    gameStaffColumnHeaders.staff,
    gameStaffColumnHeaders.role,
  ]);

  const { complianceCheckValues, complianceValidationChecks } =
    getDmrBannerChecks({
      event: props.event,
      gameActivities: localGameActivities,
      eventPeriod: localEventPeriods[0],
    });

  const filteredStaffEvents = useMemo(() => {
    if (searchQuery?.trim().length > 0) {
      const keywords = searchQuery.split(' ');

      return usersEvents.filter((staff) => {
        return keywords.some((word) => {
          return staff.fullname.toLowerCase().includes(word.toLowerCase());
        });
      });
    }

    return usersEvents;
  }, [usersEvents, searchQuery]);
  const updateEventDmrRulesStatus = (
    updatedStatuses: Array<string>,
    eventUsers: GetEventsUsersResponse
  ) => {
    updateClubAndLeagueEventsCompliance({
      isLeague,
      updatedEvent: {
        ...props.event,
        event_users: eventUsers,
        dmr: updatedStatuses,
      },
      leagueEvent: props.leagueEvent,
      updateClubEvent: props.onUpdateEvent,
      updateLeagueEvent: props.onUpdateLeagueEvent,
    });
  };

  const refetchGameComplianceRules = (eventUsers: GetEventsUsersResponse) => {
    if (props.event.type === eventTypePermaIds.game.type)
      getUpdatedDmrStatusInfo({
        eventId: props.event?.id,
        currentStatuses: props.event?.dmr || [],
      }).then((complianceRuleStatuses) => {
        // if there are new rules completed to update our local event state
        if (
          props.event.type === eventTypePermaIds.game.type &&
          !isEqual(complianceRuleStatuses, props.event?.dmr)
        ) {
          updateEventDmrRulesStatus(complianceRuleStatuses, eventUsers);
        }
      });
  };

  const getUsersEvents = useCallback(async () => {
    setRequestStatus('LOADING');
    const getEventsUsersResponse = await getEventsUsers({
      eventId: props.event.id,
      includeStaffRole: isMatchDayFlow,
    });

    const eventsUserData = getEventsUsersResponse.map(
      ({ user, user_order }, index) => {
        return {
          ...user,
          id: user.id,
          user: user.fullname,
          order: user_order ?? index,
        };
      }
    );

    // Sort the staff by order
    const sortedEventsUserData = eventsUserData.sort(
      (userA, userB) => userA.order - userB.order
    );

    setRequestStatus('SUCCESS');
    setUsersEvents(sortedEventsUserData);

    // default flow
    if (!isMatchDayFlow)
      props.onUpdateEvent(
        {
          ...props.event,
          event_users: getEventsUsersResponse,
        },
        true
      );

    if (isMatchDayFlow) {
      refetchGameComplianceRules(getEventsUsersResponse);
    }
  }, [props.event]);

  useEffect(() => {
    getUsersEvents();
  }, []);

  const renderGameStaffGrid = () => {
    const renderStaffCell = (row: Row) => userFormatter({ row, isGame: true });
    const renderRoleCell = (role?: string) => <p>{role}</p>;
    // eslint-disable-next-line no-unused-vars
    const emptyTableText =
      requestStatus === 'LOADING'
        ? props.t('Loading...')
        : props.t('No staff added');

    return filteredStaffEvents?.length > 0 ? (
      <div style={{ width: '100%', marginBottom: '75px', height: '100%' }}>
        <MuiDataGrid
          rowSelection={false}
          rowReordering={!isDmrLocked}
          unstable_cellSelection
          disableRowSelectionOnClick
          {...muiDataGridProps}
          columns={selectionHeaders}
          rows={filteredStaffEvents?.map((row: Row) => ({
            id: row.id,
            staff: renderStaffCell(row),
            role: renderRoleCell(isMatchDayFlow ? row?.staff_role : row?.role),
          }))}
          onRowOrderChange={(params) => {
            // Reorder the event users
            const reorderedEventUsers = reorderEvents({
              events: filteredStaffEvents,
              oldIndex: params.oldIndex,
              newIndex: params.targetIndex,
            });
            // Get the user order to send to the backend
            const getEventsUserOrder = reorderedEventUsers.map((event) => ({
              user_id: event.id,
              order: event.order,
            }));
            // Update the local state with the reordered event users
            setUsersEvents(reorderedEventUsers);
            // Update the backend with the reordered event users
            eventsUsersOrder({
              eventId: props.event.id,
              usersOrder: getEventsUserOrder,
            });
          }}
          pagination
          autoHeight
        />
      </div>
    ) : (
      <div css={style.emptyTable}>
        {requestStatus === 'LOADING' ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
            }}
          >
            <CircularProgress
              size={22}
              thickness={5}
              aria-label={props.t('Loading')}
            />
            <p css={style.emptyTableText} style={{ margin: 0 }}>
              {props.t('Loading...')}…
            </p>
          </div>
        ) : (
          <p css={style.emptyTableText}>{props.t('No staff added')}</p>
        )}
      </div>
    );
  };

  return (
    <div css={style.wrapper}>
      <div css={style.header}>
        <div
          data-testid="search-bar"
          css={athleteSelectionStyles.searchBarContainer}
        >
          <SearchBar
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            placeholder={props.t('Search')}
          />
        </div>
        <TextButton
          onClick={() => setAddStaffPanelOpen(true)}
          text={props.t('Add/remove staff')}
          type="primary"
          kitmanDesignSystem
          isDisabled={isDmrLocked}
        />
      </div>
      {props.requestStatus === 'SUCCESS' && renderGameStaffGrid()}
      <AddStaffSidePanel
        title={props.t('Add/remove staff')}
        useOrgId={isLeague}
        event={props.event}
        maxStaffs={props.event.competition?.max_staffs || null}
        isOpen={isAddStaffPanelOpen}
        onClose={() => setAddStaffPanelOpen(false)}
        onSaveUsersSuccess={() => {
          getUsersEvents();
          setAddStaffPanelOpen(false);
        }}
        preferences={preferences}
      />

      {isMatchDayFlow && (
        <GameEventsFooter
          isImportedGame={isImportedGame}
          footerValidationValues={complianceCheckValues}
          footerValidationChecks={complianceValidationChecks}
        />
      )}
    </div>
  );
};

export const StaffSelectionGameTranslated =
  withNamespaces()(StaffSelectionGame);
export default StaffSelectionGame;
