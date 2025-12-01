// @flow
import { withNamespaces } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
  useRef,
} from 'react';
import moment from 'moment-timezone';
import structuredClone from 'core-js/stable/structured-clone';
import { useGridApiRef } from '@mui/x-data-grid-pro';
import { compact, groupBy, isEqual } from 'lodash';

import {
  athleteAvailabilities,
  type AthleteEventV2,
  type EventActivityV2,
  type Event,
  type AthleteEventStorage,
  type Athlete,
} from '@kitman/common/src/types/Event';
import {
  ReactDataGrid,
  SearchBar,
  TextButton,
  UserAvatar,
  Select,
} from '@kitman/components';
import { type Option } from '@kitman/components/src/Select';

import {
  getAthleteEvents as getAthleteEventsPaginated,
  getEventActivityGlobalStates,
  saveEventActivities,
  saveEventParticipants,
  updateEventAttributes,
  getAthleteEventsSortingOptions,
  type GetAthleteEventsFilters,
  type GetAthleteEventsSortingOptions,
} from '@kitman/services/src/services/planning';
import type { ParticipationLevel } from '@kitman/services/src/services/getParticipationLevels';
import type { ParticipationLevelSelectOption } from '@kitman/modules/src/PlanningEvent/types';
import type { RequestStatus } from '@kitman/common/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import AthleteAvailabilityPill from '@kitman/components/src/AthleteAvailabilityPill';
import { getPositionGroups, getFixtureRatings } from '@kitman/services';
import {
  DataGrid as MuiDataGrid,
  Stack,
  Box,
  Alert,
  Switch,
} from '@kitman/playbook/components';
import updateAthleteAttributes from '@kitman/services/src/services/athlete/updateAthleteAttributes';
import useGameEventsModal from '@kitman/modules/src/PlanningEvent/src/hooks/useGameEventsModal';
import { PlanningEventContext } from '@kitman/modules/src/PlanningEvent/src/contexts/PlanningEventContext';
import getAthleteEvents from '@kitman/modules/src/PlanningEvent/src/services/getAthleteEvents';
import { eventTypePermaIds } from '@kitman/services/src/services/planning/getEventLocations';
import type {
  GameActivityStorage,
  GamePeriodStorage,
} from '@kitman/common/src/types/GameEvent';
import { getCaptainForTeamActivity } from '@kitman/common/src/utils/planningEvent/gameActivityUtils';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import { setSavedGameActivities } from '@kitman/modules/src/PlanningEvent/src/redux/slices/gameActivitiesSlice';
import {
  checkIsDmrLocked,
  getDmrBannerChecks,
} from '@kitman/common/src/utils/planningEvent';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';

import type { SetState } from '@kitman/common/src/types/react';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { getHumanReadableEventType } from '@kitman/common/src/utils/events';
import { getAthleteFiltersAndSorting } from '@kitman/common/src/utils/TrackingData/src/data/planningHub/getPlanningHubEventData';

import {
  setApiAthleteEvents,
  updateAthleteEvent,
} from '../../redux/slices/athleteEventsSlice';
import saveAllPeriodGameActivities from '../../services/saveAllPeriodGameActivities';
import useUpdateDmrStatus from '../../hooks/useUpdateDmrStatus';
import { AddAthletesSidePanelTranslated as AddAthletesSidePanel } from '../AddAthletesSidePanel';
import styles from '../AvailablePlayerList/styles';
import { orderPlayersByGroupAndPositionAndId } from '../GameEventsTab/utils';
import { GameEventsFooterTranslated as GameEventsFooter } from '../GameEventsTab/GameEventsFooter';
import {
  columnHeaders,
  muiDataGridProps,
} from './gameEventSelectionGridConfig';
import {
  type JerseyNumberOption,
  getJerseyNumberOptions,
  getSelectionHeaders,
  BULK_ACTIVITY_TOGGLERS_COLUMN_KEY,
  ACTIVITY_TOGGLERS_COLUMN_KEY_PREFIX,
  PARTICIPATION_SELECTORS_COLUMN_KEY,
  GROUP_CALCULATIONS_TOGGLERS_COLUMN_KEY,
  updateSelectionHeaders,
  getActivityDrillKey,
  handleBulkUpdateEventParticipationLevel,
  handleSingularUpdateEventParticipationLevel,
  getSortingOptionLabel,
  type SelectionHeader,
  type CombinedParticipationLevels,
  type SelectionHeadersSummary,
} from './utils';
import style, { tableStyle } from './style';
import { updateClubAndLeagueEventsCompliance } from '../../helpers/utils';

type Props = I18nProps<{
  requestStatus: RequestStatus,
  eventSessionActivities: Array<EventActivityV2>,
  participationLevels: Array<ParticipationLevel>,
  participationLevelReasons: Array<ParticipationLevelSelectOption>,
  event: Event,
  leagueEvent: Event,
  onUpdateLeagueEvent: SetState<Event>,
  onUpdateEvent: Function,
  isGameEventSelectionEnabled: boolean,
  onSaveParticipantsSuccess: ({ selectedAthletes: Array<string> }) => void,
  toastAction: Function,
}>;

type Rating = {
  id: number,
  name: string,
};

export type Row = {
  ...AthleteEventV2,
  related_issue: ?{
    id: number,
    full_pathology?: string,
    issue_type: string,
  },
};

const jerseyNumberOptions: Array<JerseyNumberOption> =
  getJerseyNumberOptions(999);

const AthletesSelectionTab = (props: Props) => {
  const { trackEvent } = useEventTracking();

  const { isLeague, isLeagueStaffUser } = useLeagueOperations();
  const { permissions } = usePermissions();
  const { preferences } = usePreferences();
  const { getUpdatedDmrStatusInfo } = useUpdateDmrStatus();

  const isImportedGame =
    props.event.type === eventTypePermaIds.game.type &&
    !!props.event.league_setup;

  const isMatchDayFlow = isImportedGame && preferences?.league_game_team;
  const isMatchDayCommunicationsFlow =
    isMatchDayFlow && preferences?.league_game_match_report;

  const isMatchDayLockedFlow =
    isMatchDayFlow && preferences?.league_game_team_lock_minutes;

  const canEditTeamsPermissions =
    preferences?.league_game_team && permissions?.leagueGame.manageGameTeam;

  /**
   * Determines if the user can manage DMR (Digital Match Report). this is
   * based on the permissions feature flag, the user's permissions, the event
   * type, and the DMR club user flag.
   */
  const isDmrLocked = isMatchDayLockedFlow
    ? checkIsDmrLocked({
        event: props.event,
        isDmrClubUser: !isLeagueStaffUser,
        isEditPermsPresent: canEditTeamsPermissions,
      })
    : false;

  const showCaptain =
    props.event.type === eventTypePermaIds.game.type &&
    props.event.competition?.show_captain;

  const apiRef = useGridApiRef();
  const reduxDispatch = useDispatch();

  const isMounted = useRef<boolean>(false);

  let maxSelectedAthletes = null;
  if (
    props.event.type === eventTypePermaIds.game.type &&
    props.event?.competition?.maximum_players
  )
    maxSelectedAthletes = props.event?.competition?.maximum_players;

  const isRosterUpdatesDisabled =
    props.event.type === eventTypePermaIds.game.type &&
    props.event?.competition?.athlete_selection_locked;
  const jerseyNumbersViewModeOnly =
    isMatchDayFlow && !preferences?.league_game_match_report && !isLeague;

  const { apiAthleteEvents: athleteEvents } = useSelector<AthleteEventStorage>(
    (state) => state.planningEvent.athleteEvents
  );

  const { localGameActivities } = useSelector<GameActivityStorage>(
    (state) => state.planningEvent.gameActivities
  );
  const { localEventPeriods } = useSelector<GamePeriodStorage>(
    (state) => state.planningEvent.eventPeriods
  );

  const foundCaptainActivity = getCaptainForTeamActivity(localGameActivities);

  const [requestStatus, setRequestStatus] = useState<RequestStatus>('PENDING');
  const { dispatch, planningState } = useContext(PlanningEventContext);
  const [requestStatusTableAction, setRequestStatusTableAction] =
    useState<RequestStatus>('SUCCESS');

  const [nextId, setNextId] = useState<?number>();
  const [
    participationLevelsCombinedWithReasons,
    setParticipationLevelsCombinedWithReasons,
  ] = useState<Array<CombinedParticipationLevels>>([]);
  const [selectionTeam, setSelectionTeam] = useState<Array<Athlete>>([]);
  const [selectionHeadersSummaryState, setSelectionHeadersSummaryState] =
    useState<Array<SelectionHeadersSummary>>([{}]);

  const [eventActivityIds, setEventActivityIds] = useState<Array<number>>(
    props.eventSessionActivities.map(({ id }) => id)
  );
  const [selectionHeaders, setSelectionHeaders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const gameModal = useGameEventsModal();
  const [fixtureRatings, setFixtureRatings] = useState<Array<Option>>([]);
  const [athleteRatingsMap, setAthleteRatingsMap] = useState<{
    [key: number | string]: Rating,
  }>({});
  const [isAddAthletesPanelOpen, setAddAthletesPanelOpen] =
    useState<boolean>(false);
  const [allPositions, setAllPositions] = useState<
    Array<{ ...Option, options: Array<Option> }>
  >([]);
  const [filters, setFilters] = useState<GetAthleteEventsFilters>({
    athleteName: '',
    positions: [],
    availabilities: [],
    participationLevels: [],
  });
  const [isCaptainSaveInProgress, setIsCaptainSaveInProgress] =
    useState<boolean>(false);
  const [sortBy, setSortBy] = useState<GetAthleteEventsSortingOptions>(
    getAthleteEventsSortingOptions.Position
  );

  const { complianceCheckValues, complianceValidationChecks } =
    getDmrBannerChecks({
      event: props.event,
      gameActivities: localGameActivities,
      eventPeriod: localEventPeriods[0],
    });

  const filteredSelectionTeam = useMemo(() => {
    if (searchQuery?.trim().length > 0) {
      const keywords = searchQuery.split(' ');

      return selectionTeam.filter((athlete) => {
        return keywords.some((word) => {
          return athlete.fullname.toLowerCase().includes(word);
        });
      });
    }

    return selectionTeam;
  }, [selectionTeam, searchQuery]);

  const playerGroupedByJerseyNumber = isImportedGame
    ? groupBy(selectionTeam, 'squad_number')
    : {};

  const mapAthleteRatings = () => {
    const tmpAthleteRatingIdsMap = {};
    athleteEvents.forEach((item) => {
      tmpAthleteRatingIdsMap[item.athlete.id] = item.rating?.id;
    });
    setAthleteRatingsMap(tmpAthleteRatingIdsMap);
  };

  const updateEventDmrRulesStatus = (updatedStatuses: Array<string>) => {
    updateClubAndLeagueEventsCompliance({
      isLeague,
      updatedEvent: {
        ...props.event,
        dmr: updatedStatuses,
      },
      leagueEvent: props.leagueEvent,
      updateClubEvent: props.onUpdateEvent,
      updateLeagueEvent: props.onUpdateLeagueEvent,
    });
  };

  const refetchGameComplianceRules = () => {
    if (props.event.type === eventTypePermaIds.game.type)
      getUpdatedDmrStatusInfo({
        eventId: props.event?.id,
        currentStatuses: props.event?.dmr || [],
      }).then((complianceRuleStatuses) => {
        if (
          props.event.type === eventTypePermaIds.game.type &&
          !isEqual(complianceRuleStatuses, props.event?.dmr)
        ) {
          // if there are new rules completed to update our local event state
          updateEventDmrRulesStatus(complianceRuleStatuses);
        }
        setIsCaptainSaveInProgress(false);
      });
  };

  const fetchAndSetEventActivityStates = () => {
    if (eventActivityIds.length === 0) return;
    getEventActivityGlobalStates({
      eventId: +props.event.id,
      eventActivityIds,
    }).then((response) => {
      const activitiesStates = response.reduce((states, state) => {
        /* eslint-disable-next-line no-param-reassign */
        states[state.eventActivityId] = state;
        return states;
      }, {});
      const summaryRow = {};
      props.eventSessionActivities.forEach(
        ({ event_activity_drill: eventActivityDrill, id }, index) => {
          const key = eventActivityDrill
            ? getActivityDrillKey(eventActivityDrill.name, index)
            : `na_${index}`;
          summaryRow[key] = activitiesStates[id];
        }
      );
      setSelectionHeadersSummaryState([summaryRow]);
    });
  };

  const getAndSetPositions = async () => {
    let positionGroups: Array<any>;
    try {
      positionGroups = await getPositionGroups();
    } catch {
      setRequestStatus('FAILURE');
      return;
    }

    if (!isMounted.current) {
      return;
    }

    setAllPositions(
      positionGroups.map(({ id, name, positions }) => ({
        value: id,
        label: name,
        options: positions.map((p) => ({
          value: p.id,
          label: p.name,
        })),
      }))
    );
  };

  const getNextAthleteEvents = async (
    { useNextId }: { useNextId: boolean } = { useNextId: true }
  ) => {
    if (!isMounted.current) return;
    setRequestStatus('PENDING');
    if (!useNextId && isMounted.current) {
      setNextId(null);
    }
    const getAthleteEventsResponse = await getAthleteEventsPaginated({
      eventId: +props.event.id,
      nextId: useNextId ? nextId : null,
      includeEventActivityIds: true,
      filters,
      sortBy,
    });
    trackEvent(
      `Calendar — ${getHumanReadableEventType(
        props.event
      )} details — Athlete selection — Load more athletes`,
      getAthleteFiltersAndSorting({ filters, sortBy })
    );
    if (!isMounted.current) return;
    setRequestStatus('SUCCESS');
    dispatch({
      type: 'SET_ATHLETE_EVENTS',
      athletes: [
        ...(useNextId ? planningState.athleteEvents : []),
        ...getAthleteEventsResponse.athlete_events.map((event) => ({
          ...event,
        })),
      ],
    });
    setNextId(getAthleteEventsResponse.next_id);
  };

  const onFiltersOrSortByChange = async () => {
    const arePositionsLoaded = allPositions.length > 0;
    if (!arePositionsLoaded) {
      await getAndSetPositions();
    }

    await getNextAthleteEvents({ useNextId: false });
  };

  const updateGroupCalculations = (
    rowId: number,
    athleteId: number,
    newValue: boolean
  ) => {
    apiRef?.current.updateRows([
      {
        id: rowId,
        include_in_group_calculations: newValue,
      },
    ]);
    updateEventAttributes({
      eventId: props.event.id,
      athleteId,
      tab: 'athletes_tab',
      attributes: {
        include_in_group_calculations: newValue,
      },
    });
  };

  // using call-back here to avoid closure/stale data
  const bulkUpdateEventActivityAttendance = useCallback(
    (activityId: number, newValue: boolean) => {
      saveEventActivities({
        eventId: props.event.id,
        eventActivityIds: [activityId],
        value: newValue,
      }).then((states) => {
        dispatch({
          type: 'SET_ATHLETE_EVENTS',
          athletes: planningState.athleteEvents.map((event) => {
            const newEvent = { ...event };
            if (newValue) {
              if (!newEvent.event_activity_ids?.includes(activityId)) {
                newEvent.event_activity_ids?.push(activityId);
              }
            } else {
              newEvent.event_activity_ids = newEvent.event_activity_ids?.filter(
                // eslint-disable-next-line max-nested-callbacks
                (id) => id !== activityId
              );
            }
            return newEvent;
          }),
        });

        updateSelectionHeaders(
          states,
          props.eventSessionActivities,
          setSelectionHeadersSummaryState
        );
      });
    },
    [planningState.athleteEvents]
  );

  const updateActivityAttendance = (
    newEventActivityIds: Array<number>,
    athleteId: number,
    value: boolean
  ) => {
    saveEventActivities({
      eventId: props.event.id,
      eventActivityIds: newEventActivityIds,
      filters: { athleteIds: [athleteId] },
      value,
    }).then((states) => {
      updateSelectionHeaders(
        states,
        props.eventSessionActivities,
        setSelectionHeadersSummaryState
      );
    });
  };

  const updateActivityParticipation = (
    newRow: Row,
    previousParticipationCanonicalLevel: string
  ) => {
    handleSingularUpdateEventParticipationLevel({
      eventId: props.event.id,
      row: newRow,
      previousParticipationCanonicalLevel,
      allEventActivityIds: eventActivityIds,
      dispatch,
      fetchEventActivityStates: fetchAndSetEventActivityStates,
      setRequestStatusTableAction,
    });
  };

  useEffect(() => {
    getFixtureRatings().then((response) => {
      const fixtureRatingOptions = response.map((rating) => {
        return {
          value: rating.id,
          label: rating.name,
        };
      });
      setFixtureRatings(fixtureRatingOptions);
    });
  }, []);

  useEffect(() => {
    mapAthleteRatings();
  }, [athleteEvents]);

  useEffect(() => {
    if (!props.isGameEventSelectionEnabled)
      setParticipationLevelsCombinedWithReasons(
        props.participationLevels.flatMap((level) => {
          if (level.canonical_participation_level === 'full') {
            return {
              id: level.id,
              name: level.name,
              label: level.name,
              value: level.id,
              participation_level_reason: null,
              canonical_participation_level:
                level.canonical_participation_level,
            };
          }
          const levelParticipation = [
            {
              id: level.id,
              name: level.name,
              label: level.name,
              value: level.id,
              participation_level_reason: null,
              canonical_participation_level:
                level.canonical_participation_level,
            },
          ];

          return levelParticipation.concat(
            props.participationLevelReasons.map((reason) => {
              return {
                id: `${level.id}_${reason.id || ''}`,
                participation_level_id: level.id,
                name: level.name,
                label: `${level.name} - ${reason.label}`,
                value: `${level.id}_${reason.id || ''}`,
                participation_level_reason: reason,
                asyncOptions: reason.requireIssue === true,
                canonical_participation_level:
                  level.canonical_participation_level,
              };
            })
          );
        })
      );
  }, [props.participationLevels, props.participationLevelReasons]);

  useEffect(() => {
    isMounted.current = true;

    onFiltersOrSortByChange();

    return () => {
      isMounted.current = false;
    };
  }, [allPositions, filters, sortBy]);

  useEffect(() => {
    const playersWithPosition = athleteEvents.map(
      (athleteEvent) => athleteEvent.athlete
    );

    setSelectionTeam(orderPlayersByGroupAndPositionAndId(playersWithPosition));
  }, [athleteEvents]);

  useEffect(() => {
    const onEventSessionActivitiesChange = async () => {
      if (!props.isGameEventSelectionEnabled) {
        await getNextAthleteEvents({ useNextId: false });
      }

      const ids = props.eventSessionActivities.map(({ id }) => id);
      setEventActivityIds(ids);

      if (ids.length > 0) {
        // get the current check box states for each activity
        updateSelectionHeaders(
          await getEventActivityGlobalStates({
            eventId: +props.event.id,
            eventActivityIds: ids,
          }),
          props.eventSessionActivities,
          setSelectionHeadersSummaryState
        );
      }
    };
    onEventSessionActivitiesChange();
  }, [props.eventSessionActivities]);

  useEffect(() => {
    if (!props.isGameEventSelectionEnabled) {
      const bulkUpdateParticipationProps = {
        eventId: props.event.id,
        setRequestStatusTableAction,
        athleteEvents: planningState.athleteEvents,
        dispatch,
        allEventActivityIds: eventActivityIds,
        allParticipationLevels: props.participationLevels,
        fetchEventActivityStates: fetchAndSetEventActivityStates,
      };
      setSelectionHeaders(
        getSelectionHeaders({
          activities: props.eventSessionActivities,
          allEventActivityIds: eventActivityIds,
          disableActions: requestStatusTableAction === 'PENDING',
          bulkUpdateEventActivityAttendance,
          bulkUpdateEventParticipationLevel: (selectedParticipationLevel) => {
            return handleBulkUpdateEventParticipationLevel({
              selectedParticipationLevel,
              filters,
              sortBy,
              ...bulkUpdateParticipationProps,
            });
          },
          participationLevels: props.participationLevels,
          participationLevelsWithReasons:
            participationLevelsCombinedWithReasons,
          apiRef,
          updateActivityAttendance,
          updateActivityParticipation,
          updateGroupCalculations,
          selectionHeadersSummaryState,
          t: props.t,
        })
      );
    }
  }, [
    requestStatusTableAction,
    props.eventSessionActivities,
    eventActivityIds,
    bulkUpdateEventActivityAttendance,
    participationLevelsCombinedWithReasons,
    selectionHeadersSummaryState,
  ]);

  const isAtBottom = ({
    currentTarget: { scrollTop, scrollHeight, clientHeight },
  }: SyntheticUIEvent<HTMLDivElement>) => {
    const LAZY_LOADING_SCROLL_OFFSET = 10;
    const scrollPosition = scrollTop + LAZY_LOADING_SCROLL_OFFSET;
    const threshold = scrollHeight - clientHeight;
    return scrollPosition >= threshold;
  };

  const handleScroll = (event: SyntheticUIEvent<HTMLDivElement>) => {
    if (isAtBottom(event) && requestStatus !== 'PENDING' && nextId) {
      getNextAthleteEvents();
    }
  };

  const onRowsChange = async (
    currentRows: Array<Row>,
    { indexes, column }: { indexes: Array<number>, column: SelectionHeader }
  ) => {
    const newRows = [...currentRows];
    const [rowIndex] = indexes;
    const row = newRows[rowIndex];
    let value = true;
    let newEventActivityIds = [];
    switch (true) {
      case column.key === BULK_ACTIVITY_TOGGLERS_COLUMN_KEY:
        value = !eventActivityIds.every((id) =>
          row.event_activity_ids?.includes(id)
        );
        newEventActivityIds = eventActivityIds;
        row.event_activity_ids = value ? eventActivityIds : [];
        row.include_in_group_calculations = value;
        updateEventAttributes({
          eventId: props.event.id,
          athleteId: row.athlete.id,
          tab: 'athletes_tab',
          attributes: {
            include_in_group_calculations: value,
          },
        });
        break;
      case column.key.startsWith(ACTIVITY_TOGGLERS_COLUMN_KEY_PREFIX): {
        const activityIndexToToggle = row.event_activity_ids?.findIndex(
          (id) => id === column.id
        );
        if (activityIndexToToggle === -1) {
          // $FlowIgnore column.id must be present
          row.event_activity_ids?.push(column.id);
        } else {
          // $FlowIgnore activityToToggleIndex must be present
          row.event_activity_ids = row.event_activity_ids?.filter(
            (id) => id !== column.id
          );
          value = false;
        }
        newEventActivityIds.push(column.id);
        break;
      }
      case column.key === PARTICIPATION_SELECTORS_COLUMN_KEY: {
        const previousParticipationCanonicalLevel =
          planningState.athleteEvents[rowIndex].participation_level
            .canonical_participation_level;
        handleSingularUpdateEventParticipationLevel({
          eventId: props.event.id,
          row,
          previousParticipationCanonicalLevel,
          allEventActivityIds: eventActivityIds,
          dispatch,
          fetchEventActivityStates: fetchAndSetEventActivityStates,
          setRequestStatusTableAction,
        });
        return;
      }
      case column.key === GROUP_CALCULATIONS_TOGGLERS_COLUMN_KEY:
        value = !row.include_in_group_calculations;
        row.include_in_group_calculations = value;
        dispatch({
          type: 'SET_ATHLETE_EVENTS',
          athletes: newRows,
        });
        await updateEventAttributes({
          eventId: props.event.id,
          athleteId: row.athlete.id,
          tab: 'athletes_tab',
          attributes: {
            include_in_group_calculations: value,
          },
        });
        return;
      default:
        throw new Error('unknown column key');
    }

    dispatch({
      type: 'SET_ATHLETE_EVENTS',
      athletes: newRows,
    });
    const states = await saveEventActivities({
      eventId: props.event.id,
      // $FlowIgnore newEventActivityIds has to have values at this stage
      eventActivityIds: newEventActivityIds,
      filters: { athleteIds: [row.athlete.id] },
      value,
    });
    updateSelectionHeaders(
      states,
      props.eventSessionActivities,
      setSelectionHeadersSummaryState
    );
  };

  const updatePlayerJerseyNumberApi = ({
    playerId,
    jerseyNumber,
  }: {
    playerId: number | string,
    jerseyNumber: ?number | ?string,
  }) => {
    return updateAthleteAttributes(props.event.id, {
      athlete_id: playerId,
      squad_number: jerseyNumber,
      disable_grid: true,
    });
  };

  const updatePlayerJerseyNumberInRedux = ({
    playerId,
    jerseyNumber,
  }: {
    playerId: number,
    jerseyNumber: ?number | ?string,
  }) => {
    const foundAthleteEvent = athleteEvents.find(
      (athleteEvent) => athleteEvent.athlete.id === playerId
    );
    reduxDispatch(
      updateAthleteEvent({
        ...foundAthleteEvent,
        athlete: { ...foundAthleteEvent.athlete, squad_number: jerseyNumber },
      })
    );
  };

  const updatePlayerFixtureRatingRedux = ({
    playerId,
    fixtureRating,
  }: {
    playerId: number,
    fixtureRating: number,
  }) => {
    const foundAthleteEvent = athleteEvents.find(
      (athleteEvent) => athleteEvent.athlete.id === playerId
    );

    reduxDispatch(
      updateAthleteEvent({
        ...foundAthleteEvent,
        rating: { id: fixtureRating },
      })
    );
  };

  const onChangeJerseyNumber = async (
    player: Athlete,
    jerseyNumber: ?number | ?string
  ) => {
    const promises = [];

    const playersWithSameJersey =
      typeof jerseyNumber === 'number'
        ? playerGroupedByJerseyNumber[jerseyNumber]?.filter(
            (i) => i.id !== player.id
          )
        : [];

    if (jerseyNumber !== null && playersWithSameJersey?.length) {
      const proceed = await gameModal.showAsync({
        title: 'Duplicate jersey number',
        content: (
          <span>
            Jersey no. <b>{jerseyNumber}</b> is taken by{' '}
            {playersWithSameJersey.length > 1 ? (
              'other players'
            ) : (
              <b>{playersWithSameJersey[0].fullname}</b>
            )}
            , do you want to set Jersey no. to <b>{player.fullname}</b> ?
          </span>
        ),
      });

      if (!proceed) {
        return;
      }

      playersWithSameJersey.forEach((p) => {
        promises.push(
          updatePlayerJerseyNumberApi({ playerId: p.id, jerseyNumber: null })
        );
        updatePlayerJerseyNumberInRedux({
          playerId: p.id,
          jerseyNumber: null,
        });
      });
    }

    promises.push(
      updatePlayerJerseyNumberApi({ playerId: player.id, jerseyNumber })
    );
    updatePlayerJerseyNumberInRedux({ playerId: player.id, jerseyNumber });

    try {
      await Promise.all(promises);
    } catch (e) {
      props.toastAction({
        type: 'CREATE_TOAST',
        toast: {
          id: 'update_jersey',
          title: props.t(
            'Something went wrong while setting the jersey number.'
          ),
          status: 'ERROR',
        },
      });
      const timeout = setTimeout(() => {
        props.toastAction({
          type: 'REMOVE_TOAST_BY_ID',
          id: 'update_jersey',
        });

        clearTimeout(timeout);
      }, 3000);
    }
  };

  const handleCaptainChange = (athleteId: number) => {
    setIsCaptainSaveInProgress(true);
    let currentCaptainActivity = foundCaptainActivity;
    if (!currentCaptainActivity) {
      currentCaptainActivity = {
        athlete_id: athleteId,
        absolute_minute: 0,
        minute: 0,
        kind: eventTypes.captain_assigned,
      };
    } else if (currentCaptainActivity.athlete_id === athleteId) {
      currentCaptainActivity = { ...currentCaptainActivity, delete: true };
    } else {
      currentCaptainActivity = {
        ...currentCaptainActivity,
        athlete_id: athleteId,
      };
    }

    saveAllPeriodGameActivities(props.event.id, localEventPeriods[0].id, [
      currentCaptainActivity,
    ]).then((result) => {
      let updatedGameActivities;
      // If captain activity didn't exist prior add it to the activities array
      // and set the captain status
      if (!foundCaptainActivity) {
        updatedGameActivities = [...localGameActivities, ...result];
      } else if (currentCaptainActivity?.delete) {
        // If captain activity was removed, remove it from the local array and
        // then remove it from the status if it exists prevents captain from
        // being un-toggled
        updatedGameActivities = localGameActivities.filter(
          (activity) => activity.kind !== eventTypes.captain_assigned
        );
      } else {
        // If captain activity was swapped with another athlete set the
        // activity to the updated athlete
        updatedGameActivities = structuredClone(localGameActivities);
        const updatedCaptainIndex = updatedGameActivities.findIndex(
          (activity) => activity.kind === eventTypes.captain_assigned
        );
        updatedGameActivities[updatedCaptainIndex] = {
          ...updatedGameActivities[updatedCaptainIndex],
          athlete_id: currentCaptainActivity?.athlete_id,
        };
      }
      if (isMatchDayFlow) {
        refetchGameComplianceRules();
      }
      reduxDispatch(setSavedGameActivities(updatedGameActivities));
      setIsCaptainSaveInProgress(false);
    });
  };

  const onChangeFixtureRating = async (
    athleteId: number,
    fixtureRatingId: number
  ) => {
    await updateAthleteAttributes(props.event.id, {
      athlete_id: athleteId,
      disable_grid: true,
      rating_id: fixtureRatingId,
    });

    updatePlayerFixtureRatingRedux({
      playerId: athleteId,
      fixtureRating: fixtureRatingId,
    });
  };

  const handleAthleteSelectionPanelSuccessfulUpdate = async ({
    selectedAthletes,
  }) => {
    if (props.isGameEventSelectionEnabled) {
      reduxDispatch(
        setApiAthleteEvents(
          await getAthleteEvents(props.event.id, {
            includeSquadName: true,
            includeSquadNumber: true,
            includePositionGroup: true,
            includeDesignation: true,
          })
        )
      );
    } else {
      setRequestStatus('PENDING');
      props.onSaveParticipantsSuccess({ selectedAthletes });
    }

    if (isMatchDayFlow) {
      setIsCaptainSaveInProgress(true);
      refetchGameComplianceRules();
    }
    setAddAthletesPanelOpen(false);
  };

  const renderTabHeader = () => {
    if (props.isGameEventSelectionEnabled) {
      return (
        <div css={style.headerContainer}>
          {maxSelectedAthletes && (
            <span className="header-title">
              {props.t('Selected')} (
              {requestStatus !== 'SUCCESS' ? '...' : selectionTeam.length}/
              {maxSelectedAthletes})
            </span>
          )}
          {isRosterUpdatesDisabled &&
            props.event.type === eventTypePermaIds.game.type && (
              <Alert severity="warning" sx={{ marginBottom: '20px' }}>
                {props.t('Roster Updates have been disabled from: {{date}}', {
                  date: moment(
                    props.event?.competition?.athlete_selection_deadline
                  ).format('LL'),
                })}
              </Alert>
            )}
          <div className="header-action-row">
            <div data-testid="search-bar" css={style.searchBarContainer}>
              <SearchBar
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
                placeholder={props.t('Search')}
              />
            </div>
            <TextButton
              onClick={() => setAddAthletesPanelOpen(true)}
              text={props.t('Add Players')}
              kitmanDesignSystem
              isDisabled={isRosterUpdatesDisabled || isDmrLocked}
              type="primary"
            />
          </div>
        </div>
      );
    }

    return (
      <>
        <div css={style.header}>
          <h2 css={style.heading}>{props.t('Athletes')}</h2>
          <TextButton
            onClick={() => setAddAthletesPanelOpen(true)}
            text={props.t('Add/remove athletes')}
            kitmanDesignSystem
            type="primary"
          />
        </div>
        <div css={style.filters}>
          <SearchBar
            icon="icon-search"
            placeholder={props.t('Search')}
            value={filters.athleteName}
            onChange={(e) => {
              // https://fb.me/react-event-pooling
              // TODO: remove e.persist() if React version is 17+.
              e.persist();
              setFilters(
                (prev: GetAthleteEventsFilters): GetAthleteEventsFilters => ({
                  ...prev,
                  athleteName: e.target?.value,
                })
              );
            }}
          />
          <Select
            placeholder={props.t('Status')}
            options={Object.entries(athleteAvailabilities).map(
              ([label, value]) => ({ label, value })
            )}
            value={filters.availabilities}
            onChange={(availabilities) => {
              setFilters(
                (prev: GetAthleteEventsFilters): GetAthleteEventsFilters => ({
                  ...prev,
                  availabilities,
                })
              );
            }}
            onClear={() => {
              setFilters(
                (prev: GetAthleteEventsFilters): GetAthleteEventsFilters => ({
                  ...prev,
                  availabilities: [],
                })
              );
            }}
            isSearchable
            isClearable
            isMulti
          />
          <div css={style.positionFilter}>
            <Select
              placeholder={props.t('Position')}
              options={allPositions}
              value={filters.positions}
              onChange={(positions) => {
                setFilters(
                  (prev: GetAthleteEventsFilters): GetAthleteEventsFilters => ({
                    ...prev,
                    positions,
                  })
                );
              }}
              onClear={() => {
                setFilters(
                  (prev: GetAthleteEventsFilters): GetAthleteEventsFilters => ({
                    ...prev,
                    positions: [],
                  })
                );
              }}
              isSearchable
              isClearable
              isMulti
              showAutoWidthDropdown
            />
          </div>
          <Select
            placeholder={props.t('Participation')}
            options={props.participationLevels.map((l) => ({
              label: l.name,
              value: l.id,
            }))}
            value={filters.participationLevels}
            onChange={(participationLevels) => {
              setFilters(
                (prev: GetAthleteEventsFilters): GetAthleteEventsFilters => ({
                  ...prev,
                  participationLevels,
                })
              );
            }}
            onClear={() => {
              setFilters(
                (prev: GetAthleteEventsFilters): GetAthleteEventsFilters => ({
                  ...prev,
                  participationLevels: [],
                })
              );
            }}
            isSearchable
            isClearable
            isMulti
          />
          {window.getFlag('group-by-athlete-selection-sessions') && (
            <Select
              options={Object.values(getAthleteEventsSortingOptions).map(
                // $FlowIssue[incompatible-call] Flow isn’t able to detect the type.
                (opt: GetAthleteEventsSortingOptions) => ({
                  label: getSortingOptionLabel(opt, props.t),
                  value: opt,
                })
              )}
              value={sortBy}
              onChange={setSortBy}
            />
          )}
        </div>
      </>
    );
  };

  const renderSessionEventSelectionGrid = () => (
    <>
      <div css={style.gridWrapper}>
        {window.getFlag('planning-area-mui-data-grid') ? (
          <div style={{ height: 500, width: '100%' }}>
            <MuiDataGrid
              apiRef={apiRef}
              rows={planningState.athleteEvents}
              noRowsMessage={props.t('No athletes added')}
              columns={selectionHeaders}
              leftPinnedColumns={[BULK_ACTIVITY_TOGGLERS_COLUMN_KEY, 'user']}
              infiniteLoading
              infiniteLoadingCall={() => {
                if (nextId) {
                  getNextAthleteEvents();
                }
              }}
              loading={requestStatus === 'PENDING'}
            />
          </div>
        ) : (
          <>
            <ReactDataGrid
              tableHeaderData={selectionHeaders}
              tableBodyData={planningState.athleteEvents}
              onRowsChange={onRowsChange}
              onScroll={handleScroll}
              selectableRows
              summaryRows={selectionHeadersSummaryState}
              tableGrow
              tableStyling={tableStyle}
            />
            {requestStatus === 'PENDING' && (
              <div css={style.loadingText}>{props.t('Loading')} ...</div>
            )}
          </>
        )}
      </div>
    </>
  );

  const renderPlayerCell = (row: Athlete) => {
    return (
      <>
        <Box mr={2} sx={style.athleteAvatar}>
          <UserAvatar
            url={row.avatar_url}
            firstname={row.firstname}
            lastname={row.lastname}
            size="SMALL"
            displayInitialsAsFallback
          />
        </Box>
        <Stack direction="row" gap={0.75} alignItems="baseline">
          <span css={style.athleteFullName}>{row.fullname}</span>
          <span css={style.athletePositionName}>{row.position.name}</span>
        </Stack>
      </>
    );
  };

  const renderStatusCell = (row: Athlete) => {
    return <AthleteAvailabilityPill availability={row.availability} />;
  };

  const renderTeamCell = (row: Athlete) => {
    return <span css={style.team}>{row?.squad_name}</span>;
  };

  const renderRatingCell = (row: Athlete) => {
    return (
      <div data-testid="cell-rating">
        <Select
          value={athleteRatingsMap[row.id]}
          onChange={(fixtureRating) =>
            onChangeFixtureRating(row.id, fixtureRating)
          }
          options={fixtureRatings}
          css={{
            width: '200px',
          }}
        />
      </div>
    );
  };

  const renderDesignationCell = (row: Athlete) => {
    return row?.designation || '--';
  };

  const renderJerseyCell = ({
    row,
    jerseyNumber,
    isDuplicate,
  }: {
    row: Athlete,
    jerseyNumber: ?number | ?string,
    isDuplicate: boolean,
  }) => {
    const renderJerseyNumber = () => {
      if (jerseyNumber === -1) return '00';
      return jerseyNumber;
    };

    return (
      <div data-testid="cell-jersey">
        {isRosterUpdatesDisabled || jerseyNumbersViewModeOnly ? (
          <span>{renderJerseyNumber()}</span>
        ) : (
          <Select
            value={jerseyNumber}
            onChange={(value) => {
              onChangeJerseyNumber(row, value);
            }}
            options={jerseyNumberOptions}
            css={{
              width: '100px',
            }}
            invalid={jerseyNumber !== null && !!isDuplicate}
            isClearable={jerseyNumber !== null}
            onClear={() => {
              onChangeJerseyNumber(row, null);
            }}
            isSearchable
            isDisabled={isDmrLocked}
          />
        )}
      </div>
    );
  };

  const renderCaptainCell = (row: Athlete) => {
    const isAthleteCaptain = foundCaptainActivity?.athlete_id === row.id;
    return (
      <Switch
        id={`${row.id}-switch`}
        checked={isAthleteCaptain}
        onChange={() => handleCaptainChange(row.id)}
        disabled={isDmrLocked || isCaptainSaveInProgress}
      />
    );
  };

  const renderActionsCell = (row: Athlete) => {
    const handleAthleteRemoval = async () => {
      const selectedPlayerIds = [];
      const newSelectionTeam = selectionTeam.filter((player) => {
        if (+player.id !== +row.id) {
          selectedPlayerIds.push(player.id);
          return true;
        }
        return false;
      });
      setSelectionTeam(newSelectionTeam);
      await saveEventParticipants({
        eventId: +props.event.id,
        athleteIds: selectedPlayerIds,
      });
      reduxDispatch(
        setApiAthleteEvents(
          athleteEvents.filter(
            (athleteEvent) => athleteEvent.athlete.id !== row.id
          )
        )
      );

      if (isMatchDayFlow) {
        refetchGameComplianceRules();
      }
    };

    return (
      <div css={style.actions}>
        <TextButton
          onClick={handleAthleteRemoval}
          iconBefore="icon-bin"
          type="subtle"
          kitmanDesignSystem
          testId="delete-athlete"
        />
      </div>
    );
  };

  const renderGameEventSelectionGrid = () => {
    if (filteredSelectionTeam.length > 0) {
      return (
        <div
          style={{
            width: '100%',
            marginBottom: selectionTeam?.length > 0 ? 75 : 0,
          }}
        >
          <MuiDataGrid
            rowSelection={false}
            unstable_cellSelection
            disableRowSelectionOnClick
            {...muiDataGridProps}
            columns={compact([
              columnHeaders.player,
              isMatchDayFlow ? null : columnHeaders.status,
              !isMatchDayFlow && columnHeaders.team,
              window.getFlag('individual-game-rating') && columnHeaders.rating,
              isMatchDayCommunicationsFlow && columnHeaders.designation,
              isMatchDayFlow && columnHeaders.jersey,
              showCaptain && columnHeaders.captain,
              ...(!isRosterUpdatesDisabled ? [columnHeaders.actions] : []),
            ])}
            rows={filteredSelectionTeam.map((row: Athlete) => {
              let playerJerseyNumber: ?number;
              let isDuplicateJerseyNumber = false;
              const hasAthleteAssignedActivities = localGameActivities.find(
                (activity) => activity.athlete_id === row.id
              );

              if (isImportedGame) {
                playerJerseyNumber = filteredSelectionTeam.find(
                  (athlete) => athlete.id === row.id
                )?.squad_number;
                if (playerJerseyNumber !== undefined)
                  isDuplicateJerseyNumber = !!playerGroupedByJerseyNumber[
                    playerJerseyNumber
                  ]?.find((i) => i.id !== row.id);
              }

              return {
                id: row.id,
                player: renderPlayerCell(row),
                status: renderStatusCell(row),
                team: renderTeamCell(row),
                rating: renderRatingCell(row),
                designation: renderDesignationCell(row),
                jersey: renderJerseyCell({
                  row,
                  jerseyNumber: playerJerseyNumber,
                  isDuplicate: isDuplicateJerseyNumber,
                }),
                captain: renderCaptainCell(row),
                ...(!isRosterUpdatesDisabled &&
                  !isDmrLocked &&
                  !hasAthleteAssignedActivities && {
                    actions: renderActionsCell(row),
                  }),
              };
            })}
            // TODO: address this by  change the renderJerseyCell to Autocomplete MUI component
            sx={{
              '& .MuiDataGrid-row:not(.MuiDataGrid-row--dynamicHeight) > .MuiDataGrid-cell':
                {
                  overflow: 'unset',
                },
            }}
          />
        </div>
      );
    }

    let emptyMessage =
      requestStatus === 'PENDING'
        ? props.t('...Loading')
        : props.t('No players selected');

    if (searchQuery && filteredSelectionTeam.length === 0) {
      emptyMessage = props.t('No players found');
    }

    return (
      <div css={styles.emptyPlayers}>
        <p>{emptyMessage}</p>
      </div>
    );
  };

  return (
    <div css={style.wrapper}>
      {renderTabHeader()}
      {props.requestStatus === 'SUCCESS' &&
        (props.isGameEventSelectionEnabled
          ? renderGameEventSelectionGrid()
          : renderSessionEventSelectionGrid())}
      <AddAthletesSidePanel
        title={
          props.isGameEventSelectionEnabled ? props.t('Player selection') : ''
        }
        event={props.event}
        playerSelection
        isOpen={isAddAthletesPanelOpen}
        onClose={() => setAddAthletesPanelOpen(false)}
        onSaveParticipantsSuccess={handleAthleteSelectionPanelSuccessfulUpdate}
        maxSelectedAthletes={maxSelectedAthletes}
        shouldIncludeGameStatus={props.event.type === 'game_event'}
      />
      {gameModal.renderModal()}
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

export const AthletesSelectionTabTranslated =
  withNamespaces()(AthletesSelectionTab);
export default AthletesSelectionTab;
