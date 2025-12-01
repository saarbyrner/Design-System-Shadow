// @flow
import { useEffect, useState, useMemo, useRef } from 'react';
import { withNamespaces } from 'react-i18next';
import { isEqual, orderBy } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import colors from '@kitman/common/src/variables/colors';
import type {
  AthleteEventStorage,
  Event,
  Game,
} from '@kitman/common/src/types/Event';
import type {
  GameActivity,
  GamePeriod,
  GameScores,
  AthletePlayTime,
  GameActivityStorage,
  GamePeriodStorage,
  AthletePlayTimesStorage,
} from '@kitman/common/src/types/GameEvent';
import {
  ToastDialog,
  useToasts,
} from '@kitman/components/src/Toast/KitmanDesignSystem';
import useGameEventsModal from '@kitman/modules/src/PlanningEvent/src/hooks/useGameEventsModal';
import {
  setSavedEventPeriods,
  setUnsavedEventPeriods,
} from '@kitman/modules/src/PlanningEvent/src/redux/slices/eventPeriodsSlice';
import {
  setSavedGameActivities,
  setUnsavedGameActivities,
  setLocalAndApiGameActivities,
} from '@kitman/modules/src/PlanningEvent/src/redux/slices/gameActivitiesSlice';
import { setSavedAthletePlayTimes } from '@kitman/modules/src/PlanningEvent/src/redux/slices/athletePlayTimesSlice';
import { useGetPositionGroupsQuery } from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/positionGroupsApi';
import { useGetOrganisationFormatsQuery } from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/organisationFormatsApi';
import { useGetFormationsQuery } from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/formationsApi';
import { useGetParticipationLevelsQuery } from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/participationLevelsApi';
import { useLazyGetEventPeriodsQuery } from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/eventPeriodsApi';
import { useLazyGetGameActivitiesQuery } from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/gameActivitiesApi';
import saveEvent from '@kitman/modules/src/PlanningEvent/src/services/saveEvent';
import updateEventPeriods from '@kitman/modules/src/PlanningEvent/src/services/updateEventPeriods';
import {
  getAthletePlayTimes,
  bulkUpdateAthletePlayTimes,
} from '@kitman/services';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  eventTypes,
  gameViews,
  venueTypes,
} from '@kitman/common/src/consts/gameEventConsts';
import {
  deleteAndRecalculateCustomPeriods,
  getCurrentLocalPeriods,
  onAddPeriod,
  onDeletePeriod,
  recalculateCustomPeriodExistingActivities,
  sumUpPeriodDurations,
  updateAllPeriodGameActivities,
  hasStartingPeriodLineupBeenCompleted,
  getHasPeriodStarted,
} from '@kitman/common/src/utils/planningEvent/gamePeriodUtils';
import {
  onCreateFormationActivity,
  findFormationForPeriod,
  findPeriodPlayerPitchChangeActivities,
  createFormationCompleteActivity,
} from '@kitman/common/src/utils/planningEvent/gameActivityUtils';
import PitchView from '@kitman/modules/src/shared/PitchView';
import type {
  FormationCoordinates,
  PitchViewInitialState,
} from '@kitman/common/src/types/PitchView';
import { eventTypePermaIds } from '@kitman/services/src/services/planning/getEventLocations';
import {
  checkIsDmrLocked,
  getDmrBannerChecks,
  getTeamMatchDayCompletionStatus,
} from '@kitman/common/src/utils/planningEvent';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';
import { toastStatusEnumLike } from '@kitman/components/src/Toast/enum-likes';
import type { SetState } from '@kitman/common/src/types/react';
import { CircularProgress, Stack } from '@kitman/playbook/components';

import { GameEventsListViewTranslated as GameEventsListView } from './GameEventsListView/GameEventsListView';
import PlanningTab from '../PlanningTabLayout';
import { GameEventsHeaderTranslated as GameEventsHeader } from './GameEventsHeader/GameEventsHeader';
import { GameEventsFooterTranslated as GameEventsFooter } from './GameEventsFooter';
import GameEventsModal from '../GameEventsModal';
import {
  transformGameActivitiesDataFromServer,
  updateTeamFromSquadData,
} from './utils';
import { PeriodTimelineTranslated as PeriodTimeline } from './PeriodTimeline/PeriodTimeline';
import {
  setField,
  setFormationCoordinates,
  setIsLoading,
  setSelectedFormation,
  setSelectedGameFormat,
  setTeam,
} from '../../redux/slices/pitchViewSlice';
import { setApiAthleteEvents } from '../../redux/slices/athleteEventsSlice';
import { useGetGameFieldsQuery } from '../../redux/reducers/rtk/gameFieldsApi';
import { useGetFormationPositionsCoordinatesQuery } from '../../redux/reducers/rtk/formationPositionsCoordinatesApi';
import { FormationEditorTranslated as FormationEditor } from './FormationEditor';
import getAthleteEvents from '../../services/getAthleteEvents';
import useUpdateDmrStatus, {
  dmrEventStatusProgress,
} from '../../hooks/useUpdateDmrStatus';
import { updateClubAndLeagueEventsCompliance } from '../../helpers/utils';

type Props = I18nProps<{
  canEditEvent: boolean,
  event: Game,
  leagueEvent: Game,
  reloadData: boolean,
  showPrompt: boolean,
  preventGameEvents: boolean,
  activeTabKey: string,
  setReloadData: Function,
  onUpdateLeagueEvent: SetState<Event>,
  onUpdateEvent: Function,
  setSaveProgressIsActive: Function,
  setShowPrompt: Function,
  setIsPromptConfirmed: Function,
  setMandatoryFieldsToast: Function,
}>;

const saveFormats = {
  default: 'DEFAULT',
  share: 'SHARE',
  add: 'ADD',
  delete: 'DELETE',
  lock: 'LOCK',
};

const GameEventsTab = (props: Props) => {
  const { permissions } = usePermissions();
  const { preferences } = usePreferences();

  const isPitchViewToggleEnabled = window.getFlag(
    'planning-game-events-field-view'
  );
  const customPeriodDurationFF = window.getFlag(
    'games-custom-duration-and-additional-time'
  );
  const hideGameEventsFeaturesForNonPayingFlag = window.getFlag(
    'hide-game-events-header-and-events-list'
  );
  const isManualPlayerMinutesEditingAllowed = window.getFlag(
    'set-overall-game-minutes'
  );
  const isAutosaveSpinnerAllowed = window.getFlag(
    'league-ops-game-auto-save-spinner'
  );

  const isImportedGame = props.event?.league_setup;

  const isMatchDayFlow = isImportedGame && preferences?.league_game_team;

  const isMatchDayLockedFlow =
    isMatchDayFlow && preferences?.league_game_team_lock_minutes;

  const isPitchAutoSaveActive =
    isMatchDayFlow || window.getFlag('pitch-view-autosave');

  const { isLeague, isLeagueStaffUser } = useLeagueOperations();

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

  const dispatch = useDispatch();
  const { getUpdatedDmrStatusInfo } = useUpdateDmrStatus();

  const { localGameActivities, apiGameActivities } =
    useSelector<GameActivityStorage>(
      (state) => state.planningEvent.gameActivities
    );
  const { localEventPeriods, apiEventPeriods } = useSelector<GamePeriodStorage>(
    (state) => state.planningEvent.eventPeriods
  );

  const { apiAthleteEvents: athleteEvents } = useSelector<AthleteEventStorage>(
    (state) => state.planningEvent.athleteEvents
  );

  const { localAthletePlayTimes, apiAthletePlayTimes } =
    useSelector<AthletePlayTimesStorage>(
      (state) => state.planningEvent.athletePlayTimes
    );

  const { field, team, formationCoordinates } =
    useSelector<PitchViewInitialState>(
      (state) => state.planningEvent.pitchView
    );

  const { showPrompt, setShowPrompt, t, activeTabKey } = props;
  const [selectedView, setSelectedView] = useState<string>('');
  const [currentView, setCurrentView] = useState<string>(gameViews.pitch);

  const [pageRequestStatus, setPageRequestStatus] = useState<string>('LOADING');
  const [selectedPeriod, setSelectedPeriod] = useState<GamePeriod | null>(null);
  const [periodToUpdate, setPeriodToUpdate] = useState();
  const [gameScores, setGameScores] = useState<GameScores>({
    orgScore: props.event.score,
    opponentScore: props.event.opponent_score,
  });
  const [selectedEvent, setSelectedEvent] = useState<?GameActivity>(null);
  const [updatedLocalDuration, setUpdatedLocalDuration] = useState<number>(
    +props.event.duration
  );
  const [isFormationEditorOpen, setIsFormationEditorOpen] = useState(false);

  const [isAutoSaveComplete, setIsAutoSaveComplete] = useState<boolean>(true);

  const { toasts, toastDispatch } = useToasts();
  const modal = useGameEventsModal();

  const { complianceCheckValues, complianceValidationChecks } =
    getDmrBannerChecks({
      event: props.event,
      gameActivities: localGameActivities,
      eventPeriod: localEventPeriods[0],
    });

  const hasStartingPeriodStarted = getHasPeriodStarted(
    localGameActivities,
    localEventPeriods[0]
  );

  const isSelectedPeriodStartingPeriod = isEqual(
    localEventPeriods[0],
    selectedPeriod
  );

  const isPaidEventsDefaultFlowEnabled = !(
    hideGameEventsFeaturesForNonPayingFlag || isLeagueStaffUser
  );

  const isPaidEventsMatchDayLockedFlowEnabled =
    isDmrLocked && hasStartingPeriodStarted;

  const isPaidGameEventsFlowEnabled = isMatchDayLockedFlow
    ? isPaidEventsDefaultFlowEnabled &&
      window.getFlag('league-ops-club-game-events') &&
      isPaidEventsMatchDayLockedFlowEnabled
    : isPaidEventsDefaultFlowEnabled;

  const updateAllEventPeriods = (updatedEventPeriods: Array<GamePeriod>) =>
    dispatch(setSavedEventPeriods(updatedEventPeriods));

  const updateAllGameActivities = (
    updatedGameActivities: Array<GameActivity>
  ) => {
    dispatch(setSavedGameActivities(updatedGameActivities));
  };

  const updateAllAthletePlayTimes = (
    updatedAthletePlayTimes: Array<AthletePlayTime>
  ) => dispatch(setSavedAthletePlayTimes(updatedAthletePlayTimes));

  const prevFormationPositionsCoordinates = useRef([]);
  const currentFormation = useRef();
  const isCurrentFieldSetup = useRef(false);

  // period has started if the formation_complete activity is present and it is a club user
  const hasPeriodStarted =
    getHasPeriodStarted(localGameActivities, selectedPeriod) &&
    !isLeagueStaffUser;

  // use memo responsible for checking if its an match day league imported game and that it is the starting period in starting lineup mode selected
  const isMatchDayGameStartingPeriod = useMemo(() => {
    return (
      isMatchDayFlow &&
      localEventPeriods.length > 0 &&
      isSelectedPeriodStartingPeriod &&
      !hasPeriodStarted
    );
  }, [
    localEventPeriods,
    localGameActivities,
    isSelectedPeriodStartingPeriod,
    hasPeriodStarted,
  ]);

  const isStartingLineupAssigned = useMemo(
    () =>
      hasStartingPeriodLineupBeenCompleted(localGameActivities, selectedPeriod),
    [localGameActivities, selectedPeriod]
  );

  const isLastPeriodSelected =
    localEventPeriods.length > 0 &&
    !!selectedPeriod &&
    isEqual(selectedPeriod, localEventPeriods[localEventPeriods.length - 1]);

  const isCustomPeriodsEnabled =
    customPeriodDurationFF && props.event.custom_period_duration_enabled;

  const isManualAthletePlayerTimePresentInPeriod = localAthletePlayTimes.some(
    (playTimes) =>
      playTimes.game_period_id === selectedPeriod?.id &&
      playTimes.minutes !== selectedPeriod?.duration &&
      !playTimes.delete
  );

  const hasScoreChanged = !(
    props.event.score === gameScores.orgScore &&
    props.event.opponent_score === gameScores.opponentScore
  );

  const hasPeriodsChanged = !isEqual(apiEventPeriods, localEventPeriods);

  const hasActivitiesChanged = !isEqual(localGameActivities, apiGameActivities);

  const hasAthletePlayTimesChanged = !isEqual(
    localAthletePlayTimes,
    apiAthletePlayTimes
  );

  const canUserSave =
    hasScoreChanged ||
    hasPeriodsChanged ||
    hasActivitiesChanged ||
    hasAthletePlayTimesChanged;

  const hasPeriodHadPlayerAssignment =
    !hasPeriodStarted &&
    findPeriodPlayerPitchChangeActivities(localGameActivities, selectedPeriod)
      .length > 0;

  const shouldRenderFooter =
    isMatchDayGameStartingPeriod ||
    canUserSave ||
    hasPeriodHadPlayerAssignment ||
    isMatchDayFlow;

  const {
    data: gameFields = [],
    isError: isGameFieldsError,
    refetch: refetchGameFields,
  } = useGetGameFieldsQuery(undefined, {
    skip: !isPitchViewToggleEnabled,
  });

  const {
    data: gameFormats,
    isError: isOrganisationFormatsError,
    refetch: refetchOrganisationFormats,
  } = useGetOrganisationFormatsQuery(undefined, {
    skip: !isPitchViewToggleEnabled,
    selectFromResult: ({ data = [] }) => {
      const orderedGameFormats = orderBy(data, ['number_of_players'], ['desc']);
      return {
        data: orderedGameFormats,
      };
    },
  });

  const {
    data: formations = [],
    isError: isFormationsError,
    refetch: refetchFormations,
  } = useGetFormationsQuery(undefined);

  const {
    data: positionGroups = [],
    isError: isPositionGroupsError,
    refetch: refetchPositionGroups,
  } = useGetPositionGroupsQuery(undefined, {
    skip: !activeTabKey,
  });

  const {
    data: participationLevels,
    isError: isParticipationLevelsError,
    refetch: refetchParticipationLevels,
  } = useGetParticipationLevelsQuery(
    { eventType: props.event.type },
    {
      skip: !activeTabKey,
      selectFromResult: ({ data, ...rest }) => {
        if (!data) {
          return {
            ...rest,
            data: [],
          };
        }

        return {
          ...rest,
          data:
            data?.map((participationLevel) => ({
              value: participationLevel.id,
              label: participationLevel.name,
              canonical_participation_level:
                participationLevel.canonical_participation_level,
              include_in_group_calculations:
                participationLevel.include_in_group_calculations,
            })) || [],
        };
      },
    }
  );

  const [getEventPeriods, { error: isGetEventPeriodsError }] =
    useLazyGetEventPeriodsQuery();

  const [getGameActivities, { error: isGetGameActivitiesError }] =
    useLazyGetGameActivitiesQuery({
      selectFromResult: ({ data = [], ...rest }) => {
        const transformedActivities =
          transformGameActivitiesDataFromServer(data);
        return {
          ...rest,
          data: transformedActivities,
        };
      },
    });

  const formationForPeriod = useMemo(() => {
    const foundFormationForPeriod = findFormationForPeriod(
      localGameActivities,
      selectedPeriod
    );
    return formations.find(
      (formation) => formation.id === foundFormationForPeriod?.relation?.id
    );
  }, [selectedPeriod, localGameActivities, formations]);

  // Set the the game format ex: 11vs11 and the formation ex: 4-4-2 on the first render.
  if (formationForPeriod) {
    const gameFormatForFormation = gameFormats.find(
      (i) => i.number_of_players === formationForPeriod.number_of_players
    );
    if (
      gameFormatForFormation &&
      !isEqual(currentFormation.current, formationForPeriod)
    ) {
      dispatch(setSelectedGameFormat(gameFormatForFormation));
      dispatch(setSelectedFormation(formationForPeriod));
      currentFormation.current = formationForPeriod;
    }
  }

  const {
    data: formationPositionsCoordinates = [],
    isError: isFormationPositionsCoordinatesError,
    refetch: refetchFormationPositionsCoordinates,
  } = useGetFormationPositionsCoordinatesQuery(
    {
      fieldId: field.id,
      formationId: formationForPeriod?.id,
    },
    {
      skip: !field.id || !formationForPeriod?.id,
    }
  );

  const refetchInitialData = () => {
    refetchPositionGroups();
    refetchOrganisationFormats();
    refetchFormations();
    refetchParticipationLevels();
    refetchGameFields();
    refetchFormationPositionsCoordinates();
  };

  const refetchAthleteEvents = async () => {
    dispatch(
      setApiAthleteEvents(
        await getAthleteEvents(props.event.id, {
          includeSquadName: true,
          includeSquadNumber: true,
          includePositionGroup: true,
          includeDesignation: true,
          forceLatest: true,
        })
      )
    );
  };

  const refreshData = async () => {
    refetchInitialData();
    updateAllEventPeriods(
      (await getEventPeriods({ eventId: props.event.id })).data
    );
    updateAllGameActivities(
      (await getGameActivities({ eventId: props.event.id })).data
    );

    updateAllAthletePlayTimes(await getAthletePlayTimes(props.event.id));
    await refetchAthleteEvents();
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
    getUpdatedDmrStatusInfo({
      eventId: props.event?.id,
      currentStatuses: props.event?.dmr || [],
    }).then((complianceRuleStatuses) => {
      // if there are new rules completed to update our local event state
      if (
        props.event.type === eventTypePermaIds.game.type &&
        !isEqual(complianceRuleStatuses, props.event?.dmr)
      ) {
        updateEventDmrRulesStatus(complianceRuleStatuses);
      }
    });
  };

  const updateLocalGameActivities = (
    updatedGameActivities: Array<GameActivity>
  ) => dispatch(setUnsavedGameActivities(updatedGameActivities));

  const updateLocalGamePeriods = (updatedGamePeriods: Array<GamePeriod>) =>
    dispatch(setUnsavedEventPeriods(updatedGamePeriods));

  const generateStartingFormationForPeriod = (
    gameActivities: Array<GameActivity>,
    period: GamePeriod
  ) => {
    const foundFormation = findFormationForPeriod(gameActivities, period);

    if (foundFormation) return gameActivities;
    // Checks if the formation_change exists

    const formationActivities = gameActivities
      .filter(
        (activity) =>
          activity.kind === eventTypes.formation_change &&
          +activity.absolute_minute < +period.absolute_duration_start
      )
      .sort((a, b) => +a.absolute_minute - +b.absolute_minute);

    const defaultFormationRelation =
      formationActivities.length > 0
        ? formationActivities[formationActivities.length - 1].relation
        : formations?.[0];
    const newFormationActivity = onCreateFormationActivity(
      period.absolute_duration_start || 0,
      defaultFormationRelation
    );

    return [...gameActivities, newFormationActivity];
  };

  const updateGameEventAthletePlayTimes = async (gameId: number) => {
    const updatedAthleteTimes = await bulkUpdateAthletePlayTimes({
      eventId: gameId,
      athletePlayTimes: localAthletePlayTimes,
    });
    updateAllAthletePlayTimes(updatedAthleteTimes);
  };

  const updateGameEvent = async (
    gameId: number,
    saveType: string,
    updatedDuration?: number
  ) => {
    const updatedEventData = await saveEvent({
      event: {
        id: gameId,
        type: props.event.type,
        score: +gameScores.orgScore,
        opponent_score: +gameScores.opponentScore,
        duration: updatedDuration || props.event.duration,
        ...(saveType === saveFormats.share && { roster_submitted: true }),
      },
    });

    if (updatedEventData.type === eventTypePermaIds.game.type) {
      props.onUpdateEvent({ ...props.event, ...updatedEventData });
    }
  };

  const updateGameEventPeriods = async (
    gameId: number,
    currentEventPeriods: Array<GamePeriod>
  ) => {
    const updatedEventPeriodsData = await updateEventPeriods(
      currentEventPeriods,
      gameId
    );
    const selectedIndex = getCurrentLocalPeriods(currentEventPeriods).findIndex(
      (period) => isEqual(period, selectedPeriod)
    );
    updateAllEventPeriods(updatedEventPeriodsData);
    setSelectedPeriod(updatedEventPeriodsData[selectedIndex]);
    return updatedEventPeriodsData;
  };

  const updateGameEventActivities = async (
    gameId: number,
    gamePeriods: Array<GamePeriod>,
    activitiesToSave: Array<GameActivity>
  ) => {
    const updatedPeriodGameActivities = await updateAllPeriodGameActivities({
      gamePeriods,
      apiGameActivities,
      localGameActivities: activitiesToSave,
      gameId,
    });
    updateAllGameActivities(updatedPeriodGameActivities.flat());
    await refetchAthleteEvents();
  };

  const handleAutoSaveFailure = () => {
    dispatch(
      add({
        status: toastStatusEnumLike.Error,
        title: props.t('Autosave failed, page refreshing.'),
      })
    );
    props.setReloadData(true);
  };

  const handlePitchAutoSave = async () => {
    setIsAutoSaveComplete(false);

    try {
      const updatedGamePeriodActivities = await updateAllPeriodGameActivities({
        gamePeriods: localEventPeriods.filter((period) => !period.delete),
        apiGameActivities,
        localGameActivities,
        gameId: props.event.id,
        onlySelectedPeriod: selectedPeriod,
      });

      const allUpdatedCombinedActivities = updatedGamePeriodActivities.flat();

      const savedActivities = allUpdatedCombinedActivities.filter(
        (activity) => activity.id
      );

      // Check if all the activities returned have been saved for this period and there are no local activities only
      if (isEqual(savedActivities, allUpdatedCombinedActivities)) {
        updateAllGameActivities(allUpdatedCombinedActivities);
        // if there exists unsaved activities in another period we need to maintain the local state
      } else {
        dispatch(
          setLocalAndApiGameActivities({
            localGameActivities: allUpdatedCombinedActivities,
            apiGameActivities: savedActivities,
          })
        );
      }

      if (isMatchDayFlow) {
        refetchGameComplianceRules();
      }
    } catch {
      handleAutoSaveFailure();
    }

    setIsAutoSaveComplete(true);
  };

  useEffect(() => {
    if (isManualPlayerMinutesEditingAllowed) {
      getAthletePlayTimes(props.event.id).then((data) =>
        updateAllAthletePlayTimes(data)
      );
    }
  }, []);

  useEffect(() => {
    // Autosave functionality for starting lineup changes
    if (
      isPitchAutoSaveActive &&
      currentView === gameViews.pitch &&
      selectedPeriod &&
      !hasPeriodStarted &&
      hasActivitiesChanged &&
      isAutoSaveComplete
    ) {
      handlePitchAutoSave();
    }
  }, [localGameActivities, selectedPeriod]);

  useEffect(() => {
    dispatch(setIsLoading(true));
    const updatedTeamInfo = updateTeamFromSquadData({
      athleteEvents,
      currentTeam: team,
    });

    dispatch(setTeam(updatedTeamInfo));
    dispatch(setIsLoading(false));
  }, [athleteEvents, props.activeTabKey]);

  useEffect(() => {
    if (
      isPitchViewToggleEnabled &&
      !isCurrentFieldSetup.current &&
      gameFields?.length > 0
    ) {
      isCurrentFieldSetup.current = true;
      dispatch(setField(gameFields[0]));
    }
  }, [gameFields]);

  useEffect(() => {
    const hasPreviousFormationCoordsCacheChanged = !isEqual(
      prevFormationPositionsCoordinates.current,
      formationPositionsCoordinates
    );

    const isPitchViewStateDifferentFromCache = !isEqual(
      Object.values(formationCoordinates),
      formationPositionsCoordinates
    );

    // This check is required for whenever we change periods to make sure we have the correct formation coordinates needed
    // to render the pitch.
    if (
      hasPreviousFormationCoordsCacheChanged ||
      isPitchViewStateDifferentFromCache
    ) {
      prevFormationPositionsCoordinates.current = formationPositionsCoordinates;
      const coordinates: FormationCoordinates = {};
      formationPositionsCoordinates.forEach((coordinate) => {
        const xy = `${coordinate.x}_${coordinate.y}`;
        coordinates[xy] = coordinate;
      });
      dispatch(setFormationCoordinates(coordinates));
    }
  }, [formationPositionsCoordinates, selectedPeriod]);

  useEffect(() => {
    if (!isPitchAutoSaveActive && canUserSave) {
      props.setSaveProgressIsActive(true);
    }
  }, [canUserSave]);

  useEffect(() => {
    if (
      isPositionGroupsError ||
      isOrganisationFormatsError ||
      isFormationsError ||
      isParticipationLevelsError ||
      isGetEventPeriodsError ||
      isGetGameActivitiesError ||
      isGameFieldsError ||
      isFormationPositionsCoordinatesError
    ) {
      setPageRequestStatus('FAILURE');
      if (props.reloadData) {
        props.setReloadData(false);
      }
    } else {
      setPageRequestStatus('SUCCESS');
      if (props.reloadData) {
        props.setReloadData(false);
      }
    }
  }, [
    isPositionGroupsError,
    isOrganisationFormatsError,
    isFormationsError,
    isParticipationLevelsError,
    isGetEventPeriodsError,
    isGetGameActivitiesError,
    isGameFieldsError,
    isFormationPositionsCoordinatesError,
  ]);

  useEffect(() => {
    if (props.event.duration !== updatedLocalDuration)
      setUpdatedLocalDuration(+props.event.duration);
  }, [props.event]);

  useEffect(() => {
    // default the selected period to the first period if it exists
    const periods = getCurrentLocalPeriods(localEventPeriods);
    if (
      isPitchViewToggleEnabled &&
      currentView === gameViews.pitch &&
      (!selectedPeriod ||
        (!periods.find((period) => isEqual(period, selectedPeriod)) &&
          periods.length > 0))
    ) {
      setSelectedPeriod(periods[0]);
    }
  }, [selectedPeriod, localEventPeriods, setSelectedPeriod, currentView]);

  useEffect(() => {
    if (props.reloadData) {
      refreshData().then(() => {
        props.setReloadData(false);
      });
    }
  }, [props.reloadData]);

  // Handles the initial formation creation for each period if it does not exist
  useEffect(() => {
    if (isPitchViewToggleEnabled && selectedPeriod && formations?.length > 0) {
      updateLocalGameActivities(
        generateStartingFormationForPeriod(localGameActivities, selectedPeriod)
      );
    }
  }, [selectedPeriod, formations]);

  const hadDurationChanged = (newDuration: number) =>
    props.event.duration !== newDuration;

  const determineToastText = (saveType: string) => {
    switch (saveType) {
      case saveFormats.add:
        return props.t('Game Period Added');
      case saveFormats.delete:
        return props.t('Game Period Deleted');
      case saveFormats.share:
        return props.t('Squad Info Successfully Shared with Officials');
      default:
        return props.t('Game Progress Saved');
    }
  };

  const onSaveGameEventUpdates = async ({
    currentGameActivities,
    currentEventPeriods,
    saveType,
    updatedDuration,
  }: {
    currentGameActivities: Array<Object>,
    currentEventPeriods: Array<GamePeriod>,
    saveType: string,
    updatedDuration?: number,
  }) => {
    let updatedEventPeriodsData;
    setPageRequestStatus('LOADING');
    const gameId = +props.event.id;

    let activitiesToSave = [...currentGameActivities];

    if (
      (saveType === saveFormats.share || saveType === saveFormats.lock) &&
      isStartingLineupAssigned &&
      isPaidEventsDefaultFlowEnabled
    ) {
      activitiesToSave = createFormationCompleteActivity({
        gameActivities: activitiesToSave,
        currentPeriod: selectedPeriod,
      });
    }

    const hasGamePeriodsRequiredSaving = !isEqual(
      currentEventPeriods,
      apiEventPeriods
    );

    const hasGameActivitiesRequiredSaving = !isEqual(
      activitiesToSave,
      apiGameActivities
    );

    const shareWithOfficialsSave =
      saveType === saveFormats.share && !props.event.roster_submitted_by_id;

    try {
      // Saves the game periods new and existing
      if (hasGamePeriodsRequiredSaving)
        updatedEventPeriodsData = await updateGameEventPeriods(
          gameId,
          currentEventPeriods
        );

      // Saves the game activities
      if (hasGameActivitiesRequiredSaving) {
        await updateGameEventActivities(
          gameId,
          updatedEventPeriodsData || currentEventPeriods,
          activitiesToSave
        );
      }

      if (isManualPlayerMinutesEditingAllowed) {
        if (hasAthletePlayTimesChanged) {
          // Saves the manual athlete play times
          await updateGameEventAthletePlayTimes(gameId);
          // Refreshes the activities to include the newly generated position_changes from the athlete_play_times
          const refreshedActivities = await getGameActivities({
            eventId: gameId,
          });
          updateAllGameActivities(refreshedActivities.data);
        } else if (
          !hasAthletePlayTimesChanged &&
          hasGameActivitiesRequiredSaving
        ) {
          // Re-fires a refetch of the athlete play times if the game activities changed (while they didnt)
          // to keep the data up to date.
          updateAllAthletePlayTimes(await getAthletePlayTimes(gameId));
        }
      }

      const isMatchDayCommunicationsFlow =
        isMatchDayFlow && preferences?.league_game_match_report;

      // Saves the game event (score/duration/roster submitted by share with officials)
      if (
        (isMatchDayCommunicationsFlow && shareWithOfficialsSave) ||
        hasScoreChanged ||
        (updatedDuration && hadDurationChanged(updatedDuration))
      ) {
        await updateGameEvent(gameId, saveType, updatedDuration);
      }

      toastDispatch({
        type: 'CREATE_TOAST',
        toast: {
          id: 'game_progress_saved',
          title: determineToastText(saveType),
          status: 'SUCCESS',
        },
      });

      setPageRequestStatus('SUCCESS');
      props.setSaveProgressIsActive(false);
    } catch {
      toastDispatch({
        type: 'CREATE_TOAST',
        toast: {
          id: 'game_progress_saved',
          title: props.t('Failed: {{toastText}}', {
            toastText: determineToastText(saveType),
          }),
          status: 'ERROR',
        },
      });
      setPageRequestStatus('FAILURE');
    }
  };

  const handleOnUpdatePitchViewPeriod = async ({
    updatedPeriods,
    updatedActivities,
    updatedDuration,
  }: {
    updatedPeriods: Array<GamePeriod>,
    updatedActivities: Array<GameActivity>,
    updatedDuration?: number,
  }) => {
    updateLocalGamePeriods(updatedPeriods);
    updateLocalGameActivities(updatedActivities);

    // The auto save flow
    if (isPitchAutoSaveActive) {
      setIsAutoSaveComplete(false);
      try {
        await updateGameEventPeriods(props.event.id, updatedPeriods);
      } catch {
        handleAutoSaveFailure();
      }
      setIsAutoSaveComplete(true);
    }

    if (updatedDuration) setUpdatedLocalDuration(updatedDuration);
  };

  const handleOnAddPeriod = async (
    updatedCustomPeriods?: Array<GamePeriod>
  ) => {
    let updatedPeriods;
    let updatedActivities;
    let updatedDuration;

    if (updatedCustomPeriods) {
      updatedPeriods = updatedCustomPeriods;
      updatedActivities = recalculateCustomPeriodExistingActivities(
        localEventPeriods,
        updatedPeriods,
        localGameActivities
      );
      updatedDuration = sumUpPeriodDurations(updatedPeriods);
      const foundSelectedPeriod = updatedPeriods.find(
        (period) =>
          period.id === selectedPeriod?.id ||
          period.localId === selectedPeriod?.localId
      );
      if (foundSelectedPeriod) setSelectedPeriod(foundSelectedPeriod);
    } else {
      const { recalculatedPeriods, recalculatedActivities } = onAddPeriod(
        localEventPeriods,
        localGameActivities,
        props.event.duration,
        selectedPeriod,
        setSelectedPeriod
      );
      updatedPeriods = recalculatedPeriods;
      updatedActivities = recalculatedActivities;
    }

    if (currentView === gameViews.pitch) {
      await handleOnUpdatePitchViewPeriod({
        updatedPeriods,
        updatedActivities,
        updatedDuration,
      });
    } else {
      const activitiesToSave = generateStartingFormationForPeriod(
        updatedActivities,
        updatedPeriods[updatedPeriods.length - 1]
      );
      if (updatedDuration) setUpdatedLocalDuration(updatedDuration);
      await onSaveGameEventUpdates({
        currentGameActivities: activitiesToSave,
        currentEventPeriods: updatedPeriods,
        saveType: saveFormats.add,
        updatedDuration,
      });
    }
  };

  const handleOnDeletePeriod = async (
    period: Object,
    isCustom: boolean = false
  ) => {
    let updatedPeriods;
    let updatedActivities;
    let updatedDuration;

    if (isCustom) {
      const { periodDurationSum, currentPeriods, currentActivities } =
        deleteAndRecalculateCustomPeriods(
          period,
          localEventPeriods,
          localGameActivities
        );
      updatedPeriods = currentPeriods;
      updatedDuration = periodDurationSum;
      updatedActivities = recalculateCustomPeriodExistingActivities(
        localEventPeriods,
        updatedPeriods,
        currentActivities
      );
    } else {
      const { recalculatedPeriods, recalculatedActivities } = onDeletePeriod(
        period,
        localEventPeriods,
        localGameActivities,
        props.event.duration,
        selectedPeriod,
        setSelectedPeriod
      );
      updatedPeriods = recalculatedPeriods;
      updatedActivities = recalculatedActivities;
    }

    if (currentView === gameViews.pitch) {
      await handleOnUpdatePitchViewPeriod({
        updatedPeriods,
        updatedActivities,
        updatedDuration,
      });
    } else {
      if (updatedDuration) setUpdatedLocalDuration(updatedDuration);
      await onSaveGameEventUpdates({
        currentGameActivities: updatedActivities,
        currentEventPeriods: updatedPeriods,
        saveType: saveFormats.delete,
        updatedDuration,
      });
    }
  };

  const hasAnyPeriodStarted = () =>
    localGameActivities.filter(
      (activity) => activity.kind === 'formation_complete'
    ).length > 0;

  // Checks if the lineup has been completed and a staff member has been added.
  // If the roster has already been submitted then the share with officials button can be used as a bulk save whenever
  // overriding the previous conditions
  const checkIfImportedGameHasCompletedLineupSelection = () => {
    // match day communications flow when all business rules are done then the lineup selection is completed
    if (preferences?.league_game_match_report) {
      const matchDayStatus = getTeamMatchDayCompletionStatus({
        competitionConfig: props.event?.competition,
        dmrStatuses: props.event?.dmr,
        isHomeStatuses: props.event?.venue_type?.name === venueTypes.home,
      });
      return matchDayStatus === dmrEventStatusProgress.complete;
    }

    const rosterSubmittedAndNewChanges =
      !!props.event?.roster_submitted_by_id && hasActivitiesChanged;

    const staffSelected = props.event.event_users.length > 0;

    return (
      (isStartingLineupAssigned && staffSelected) ||
      rosterSubmittedAndNewChanges
    );
  };

  const handleStateReset = async () => {
    // reset game activity and period
    updateLocalGameActivities(apiGameActivities);
    setGameScores({
      orgScore: props.event.score,
      opponentScore: props.event.opponent_score,
    });
    updateAllEventPeriods(apiEventPeriods);

    props.setSaveProgressIsActive(false);
    setShowPrompt(false);
  };
  // reset game activity on tab change
  const confirmTabBarChanges = () => {
    handleStateReset();
    props.setIsPromptConfirmed(true);
  };

  const handleCurrentViewChange = (view: string) => {
    if (view === gameViews.pitch) setSelectedPeriod(null);
    setCurrentView(view);
  };
  // reset game activity on view change
  const confirmViewChanges = () => {
    handleStateReset();
    refetchInitialData();
    handleCurrentViewChange(selectedView);
  };

  const dispatchMandatoryFieldsToast = () => {
    props.setMandatoryFieldsToast(true);
  };

  const dispatchFailedFormationCoordsToast = () => {
    toastDispatch({
      type: 'CREATE_TOAST',
      toast: {
        id: 'get_formation_coordinates',
        title: props.t('Failed: Formation Coordinates Fetch'),
        status: 'ERROR',
      },
    });
  };

  const renderAutoSaveLoadingSpinner = () => (
    <Stack
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.semi_transparent_background,
        position: 'absolute',
        zIndex: 1000,
      }}
    >
      <CircularProgress size={100} />
    </Stack>
  );

  const renderListView = () => (
    <GameEventsListView
      event={props.event}
      isDmrLocked={isDmrLocked && isSelectedPeriodStartingPeriod}
      canEditEvent={props.canEditEvent}
      reloadData={props.reloadData}
      pageRequestStatus={pageRequestStatus}
      formations={formations}
      positionGroups={positionGroups}
      selectedPeriod={selectedPeriod}
      setSelectedPeriod={setSelectedPeriod}
      periodToUpdate={periodToUpdate}
      setPeriodToUpdate={setPeriodToUpdate}
      participationLevels={participationLevels}
      isPitchViewEnabled={isPitchViewToggleEnabled}
      preventGameEvents={props.preventGameEvents}
      isCustomPeriods={isCustomPeriodsEnabled}
      isMidGamePlayerPositionChangeDisabled={
        isManualAthletePlayerTimePresentInPeriod
      }
      isLastPeriodSelected={isLastPeriodSelected}
      getInitialData={refreshData}
      handleDeletePeriod={handleOnDeletePeriod}
      dispatchMandatoryFieldsToast={dispatchMandatoryFieldsToast}
      setPageRequestStatus={setPageRequestStatus}
      setEventPeriods={updateAllEventPeriods}
      setApiGameActivities={updateAllGameActivities}
      setLocalGameActivities={updateLocalGameActivities}
    />
  );

  const renderPitchView = () => (
    <PitchView
      event={props.event}
      currentPeriod={selectedPeriod}
      isLastPeriodSelected={isLastPeriodSelected}
      formations={formations}
      gameFormats={gameFormats}
      activeTabKey={activeTabKey}
      selectedEvent={selectedEvent}
      onSetSelectedEvent={setSelectedEvent}
      dispatchMandatoryCheck={dispatchMandatoryFieldsToast}
      preventGameEvents={props.preventGameEvents}
      isImportedGame={isImportedGame}
      isDmrLocked={isDmrLocked}
      isMidGamePlayerPositionChangeDisabled={
        isManualPlayerMinutesEditingAllowed &&
        isManualAthletePlayerTimePresentInPeriod
      }
      dispatchFailedFormationCoordsToast={dispatchFailedFormationCoordsToast}
      preferences={preferences}
    />
  );

  const renderPitchListViewArea = () => (
    <Stack sx={{ position: 'relative' }}>
      {isAutosaveSpinnerAllowed &&
        !isAutoSaveComplete &&
        renderAutoSaveLoadingSpinner()}
      {isPaidGameEventsFlowEnabled && (
        <PlanningTab>
          <GameEventsHeader
            currentView={currentView}
            setCurrentView={handleCurrentViewChange}
            setSelectedView={setSelectedView}
            gameEvent={props.event}
            gameViews={gameViews}
            gameScores={gameScores}
            setGameScores={setGameScores}
            eventPeriods={getCurrentLocalPeriods(localEventPeriods)}
            onAddPeriod={handleOnAddPeriod}
            isAddPeriodDisabled={pageRequestStatus === 'LOADING'}
            hasUnsavedChanges={canUserSave}
            setShowPrompt={setShowPrompt}
            hasAPeriodStarted={hasAnyPeriodStarted()}
            isCustomPeriods={isCustomPeriodsEnabled}
            setIsFormationEditorOpen={setIsFormationEditorOpen}
          />
          <PeriodTimeline
            isImportedGame={isImportedGame}
            selectedPeriod={selectedPeriod}
            setSelectedPeriod={setSelectedPeriod}
            totalGameTime={updatedLocalDuration ?? 0}
            onDeletePeriod={handleOnDeletePeriod}
            setSelectedEvent={setSelectedEvent}
            isCustomPeriods={isCustomPeriodsEnabled}
          />
        </PlanningTab>
      )}
      {currentView === gameViews.pitch ? renderPitchView() : renderListView()}
      {shouldRenderFooter && (
        <GameEventsFooter
          isAutoSaveComplete={isAutoSaveComplete}
          isImportedGame={isImportedGame}
          isMatchDayFlowLocked={
            isDmrLocked && window.getFlag('league-ops-club-game-events')
          }
          isMatchDayGameStartingPeriod={isMatchDayGameStartingPeriod}
          footerValidationValues={complianceCheckValues}
          footerValidationChecks={complianceValidationChecks}
          hasPlayersBeenAssigned={
            isMatchDayGameStartingPeriod
              ? checkIfImportedGameHasCompletedLineupSelection()
              : hasPeriodHadPlayerAssignment
          }
          onFinishPeriod={() => {
            if (isMatchDayLockedFlow && isMatchDayGameStartingPeriod) {
              onSaveGameEventUpdates({
                currentGameActivities: localGameActivities,
                currentEventPeriods: localEventPeriods,
                saveType: saveFormats.lock,
                updatedDuration: updatedLocalDuration,
              });
            } else {
              updateLocalGameActivities(
                createFormationCompleteActivity({
                  gameActivities: localGameActivities,
                  currentPeriod: selectedPeriod,
                })
              );
            }
          }}
          saveEnabled={
            isPitchAutoSaveActive
              ? canUserSave && hasPeriodStarted
              : canUserSave
          }
          onSave={() =>
            onSaveGameEventUpdates({
              currentGameActivities: localGameActivities,
              currentEventPeriods: localEventPeriods,
              saveType: isMatchDayGameStartingPeriod
                ? saveFormats.share
                : saveFormats.default,
              updatedDuration: updatedLocalDuration,
            })
          }
          pageRequestStatus={pageRequestStatus}
        />
      )}
      {window.getFlag('game-formations-editor') && (
        <FormationEditor
          sport="soccer"
          open={isFormationEditorOpen}
          onClose={() => setIsFormationEditorOpen(false)}
          gameFormats={gameFormats}
          formations={formations}
        />
      )}
    </Stack>
  );

  if (props.reloadData) {
    return (
      <Stack
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '75vh',
        }}
      >
        <CircularProgress size={100} />
      </Stack>
    );
  }

  return (
    <>
      {isPitchViewToggleEnabled ? renderPitchListViewArea() : renderListView()}
      <GameEventsModal
        isOpen={showPrompt}
        onPressEscape={() => setShowPrompt(false)}
        onClose={() => setShowPrompt(false)}
        title={t('You have unsaved data!')}
        content={t(`It appears that you have made changes that have not been saved.
          Leaving this page now will result in the loss of your unsaved
          data. Are you sure you want to leave the page without saving?`)}
        cancelButtonText={t('No')}
        confirmButtonText={t('Yes')}
        onCancel={() => setShowPrompt(false)}
        onConfirm={() => {
          if (selectedView) {
            confirmViewChanges();
            setSelectedView('');
          } else {
            confirmTabBarChanges();
          }
        }}
      />
      {modal.renderModal()}
      <ToastDialog
        toasts={toasts}
        onCloseToast={(toastId) =>
          toastDispatch({
            type: 'REMOVE_TOAST_BY_ID',
            id: toastId,
          })
        }
      />
    </>
  );
};

export const GameEventsTabTranslated = withNamespaces()(GameEventsTab);

export default GameEventsTab;
