// @flow

import { useState, useEffect, useRef } from 'react';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { isEqual } from 'lodash';

import { AppStatus, DelayedLoadingFeedback } from '@kitman/components';
import {
  getMatchReportNotes,
  saveMatchReportNotes,
  saveMatchReportScores,
} from '@kitman/services';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import type { Game } from '@kitman/common/src/types/Event';
import type {
  GameActivity,
  GamePeriod,
  GameScores,
  TeamsPenalties,
  MatchReportPenaltyListStorage,
  MatchReportNoteStorage,
  GameActivityStorage,
  GamePeriodStorage,
} from '@kitman/common/src/types/GameEvent';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import { getEventPeriods } from '@kitman/modules/src/PlanningEvent/src/services/eventPeriods';
import { getGameActivities } from '@kitman/modules/src/PlanningEvent/src/services/gameActivities';
import { transformGameActivitiesDataFromServer } from '@kitman/modules/src/PlanningEvent/src/components/GameEventsTab/utils';
import saveEvent from '@kitman/modules/src/PlanningEvent/src/services/saveEvent';
import getPlanningHubEvent from '@kitman/modules/src/PlanningHub/src/services/getPlanningHubEvent';
import { getEditorStateFromValue } from '@kitman/modules/src/Medical/shared/utils';
import { updateAllPeriodGameActivities } from '@kitman/common/src/utils/planningEvent/gamePeriodUtils';
import {
  setActiveEventSelection,
  setField,
  setPitchActivities,
  setTeams,
} from '@kitman/modules/src/PlanningEvent/src/redux/slices/pitchViewSlice';
import { setSavedGameActivities } from '@kitman/modules/src/PlanningEvent/src/redux/slices/gameActivitiesSlice';
import { setSavedEventPeriods } from '@kitman/modules/src/PlanningEvent/src/redux/slices/eventPeriodsSlice';
import { useGetGameFieldsQuery } from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/gameFieldsApi';
import { useLazyGetFormationPositionsCoordinatesQuery } from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/formationPositionsCoordinatesApi';
import {
  matchReportEventListGameView,
  viewableEventTypes,
} from '@kitman/common/src/consts/gameEventConsts';
import type { PitchViewInitialState } from '@kitman/common/src/types/PitchView';

import { MatchReportSubmitModalTranslated as MatchReportSubmitModal } from './MatchReportSubmitModal';
import { MatchReportMUITranslated as MatchReportMUI } from './MatchReportMUI';
import { MatchReportLegacyTranslated as MatchReportLegacy } from './MatchReportLegacy';
import {
  calculateTeamGoals,
  separateNormalGameTimeAndPenaltyActivities,
  getTeamPenaltyShootoutScores,
  combineAllNormalTimeAndPenaltyActivities,
  prepareBothTeamsReportData,
} from '../utils/matchReportUtils';
import { TOAST_ANIMATION_DURATION } from '../consts/matchReportConsts';

type Props = {
  eventId: number,
  toastDispatch?: Function,
};

const MatchReportApp = (props: I18nProps<Props>) => {
  const { eventId, toastDispatch } = props;
  const { isLeague, isOrgSupervised, isScout, isOfficial } =
    useLeagueOperations();
  const { permissions } = usePermissions();
  const { preferences } = usePreferences();
  const dispatch = useDispatch();

  const muiMatchRefereeReportFeatureFlag = window.getFlag(
    'league-ops-refactor-match-report'
  );

  const editorRef = useRef(null);
  const isCurrentFieldSetup = useRef(false);

  const gameActivities = useSelector<GameActivityStorage>(
    (state) => state.planningEvent.gameActivities
  );
  const { apiEventPeriods: eventPeriods } = useSelector<GamePeriodStorage>(
    (state) => state.planningEvent.eventPeriods
  );
  const { field, teams } = useSelector<PitchViewInitialState>(
    (state) => state.planningEvent.pitchView
  );

  const [event, setEvent] = useState<?Object>();
  const [penaltyShootoutActivities, setPenaltyShootoutActivities] =
    useState<MatchReportPenaltyListStorage>({
      apiPenaltyLists: { homePenalties: [], awayPenalties: [] },
      localPenaltyLists: { homePenalties: [], awayPenalties: [] },
    });
  const [gameScores, setGameScores] = useState<GameScores>({
    orgScore: 0,
    opponentScore: 0,
  });
  const [requestStatus, setRequestStatus] = useState<string>('PENDING');
  const [selectedEventListGameView, setSelectedEventListGameView] =
    useState<string>(matchReportEventListGameView.regular);
  const [showSaveReportModal, setShowSaveReportModal] =
    useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [gameNotes, setGameNotes] = useState<MatchReportNoteStorage>({
    apiNotes: '',
    localNotes: '',
  });
  const [flagDisciplinaryIssue, setFlagDisciplinaryIssue] =
    useState<boolean>(false);
  const [readOnlyMode, setReadOnlyMode] = useState<boolean>(true);
  const [finalSubmitMode, setFinalSubmitMode] = useState<boolean>(false);

  const checkIfHeaderButtonsAreDisabled = (isSubmit?: boolean) => {
    const canOfficialEdit =
      isOfficial && permissions.leagueGame?.manageMatchReport;
    const isOfficialOrLeague = canOfficialEdit || isLeague;
    const homePenaltyActivities =
      penaltyShootoutActivities.localPenaltyLists.homePenalties.filter(
        (penalty) => penalty.athlete_id
      );
    const awayPenaltyActivities =
      penaltyShootoutActivities.localPenaltyLists.awayPenalties.filter(
        (penalty) => penalty.athlete_id
      );

    const localActivitiesLength = isSubmit
      ? gameActivities.localGameActivities.filter(
          (activity) => !activity.delete
        ).length
      : gameActivities.localGameActivities.length;

    const combinedMatchReportActivityLength =
      localActivitiesLength +
      homePenaltyActivities.length +
      awayPenaltyActivities.length;

    return (
      !isOfficialOrLeague ||
      (canOfficialEdit && event?.match_report_submitted_by_id) ||
      (!!event &&
        !(
          event?.home_athletes?.length > 0 && event?.away_athletes?.length > 0
        )) ||
      combinedMatchReportActivityLength === 0
    );
  };

  const { data: gameFields = [] } = useGetGameFieldsQuery(undefined, {
    skip: !preferences?.league_match_report_pitch_view,
  });

  const [getFormationPositionsCoordinates] =
    useLazyGetFormationPositionsCoordinatesQuery();

  const updateAllGameActivities = (
    updatedGameActivities: Array<GameActivity>
  ) => dispatch(setSavedGameActivities(updatedGameActivities));

  const updateAllEventPeriods = (updatedEventPeriods: Array<GamePeriod>) =>
    dispatch(setSavedEventPeriods(updatedEventPeriods));

  const updatePenaltyLists = (
    apiPenaltyLists: TeamsPenalties,
    localPenaltyLists: TeamsPenalties
  ) =>
    setPenaltyShootoutActivities({
      apiPenaltyLists,
      localPenaltyLists,
    });

  const updateGameNotes = (apiNotes: string, localNotes: string) =>
    setGameNotes({ apiNotes, localNotes });

  const updateGameScores = (
    gameEvent: Game,
    transformedGameActivities: Array<GameActivity>
  ) => {
    const {
      teamScore: homeActivityGoals,
      teamOwnGoalScore: homeActivityOwnGoals,
    } = calculateTeamGoals(gameEvent.home_athletes, transformedGameActivities);
    const {
      teamScore: awayActivityGoals,
      teamOwnGoalScore: awayActivityOwnGoals,
    } = calculateTeamGoals(gameEvent.away_athletes, transformedGameActivities);

    const orgScore = homeActivityGoals + awayActivityOwnGoals;
    const opponentScore = awayActivityGoals + homeActivityOwnGoals;

    setGameScores({
      orgScore: orgScore || gameEvent.score,
      opponentScore: opponentScore || gameEvent.opponent_score,
    });
  };

  const transformAndUpdateGameActivitiesForPeriod = ({
    gameEvent,
    fetchedGameActivities,
    gamePeriods,
  }: {
    gameEvent: Object,
    fetchedGameActivities: Array<GameActivity>,
    gamePeriods: Array<GamePeriod>,
  }) => {
    const transformedActivities = transformGameActivitiesDataFromServer(
      fetchedGameActivities
    );
    let transformedActivitiesForPeriod = transformedActivities.filter(
      (activity) => activity.game_period_id === gamePeriods[0].id
    );

    // If the penalty shootout preference is enabled separate the penalty activities from the normal time
    if (preferences?.league_match_report_penalty_shootout) {
      const { filteredTeamPenalties, normalGameTimeActivities } =
        separateNormalGameTimeAndPenaltyActivities(
          gameEvent,
          transformedActivitiesForPeriod
        );

      // If there are no saved penalties then create local ones only
      if (filteredTeamPenalties.homePenalties[0].id) {
        // Saving the filtered penalties to the local and api storage
        updatePenaltyLists(filteredTeamPenalties, filteredTeamPenalties);
      } else {
        updatePenaltyLists(
          { homePenalties: [], awayPenalties: [] },
          filteredTeamPenalties
        );
      }
      transformedActivitiesForPeriod = normalGameTimeActivities;
    }

    updateGameScores(gameEvent, transformedActivitiesForPeriod);

    updateAllGameActivities(transformedActivitiesForPeriod);
  };

  const getParentEventGameInfo = () =>
    Promise.all([
      getEventPeriods({
        eventId,
        supervisorView: isOrgSupervised,
      }),
      getGameActivities({
        eventId,
        supervisorView: isOrgSupervised,
      }),
      getMatchReportNotes({ eventId, supervisorView: isOrgSupervised }),
    ]);

  const getChildEventsGameInfo = (
    homeId: number,
    awayId: number,
    supervisorView: boolean
  ) =>
    Promise.all([
      /** Home team: game activities */
      getGameActivities({
        eventId: homeId,
        supervisorView,
      }),
      /** Away team:  game activities */
      getGameActivities({
        eventId: awayId,
        supervisorView,
      }),
    ]);

  useEffect(() => {
    if (!isCurrentFieldSetup.current && gameFields?.length > 0) {
      isCurrentFieldSetup.current = true;
      dispatch(setField(gameFields[0]));
    }
  }, [gameFields]);

  const handleEventRelatedApiDataRetrieval = async (gameInfo: Game) => {
    try {
      const [
        fetchedEventPeriods,
        fetchedGameActivities,
        fetchedMatchReportNote,
      ] = await getParentEventGameInfo();

      if (
        preferences?.league_match_report_pitch_view &&
        gameInfo.home_event_id &&
        gameInfo.away_event_id
      ) {
        const [fetchedHomeChildGameActivities, fetchedAwayChildGameActivities] =
          await getChildEventsGameInfo(
            gameInfo.home_event_id,
            gameInfo.away_event_id,
            isOrgSupervised
          );

        const [{ data: homeChildCoordinates }, { data: awayChildCoordinates }] =
          await Promise.all([
            getFormationPositionsCoordinates({
              fieldId: field.id,
              formationId: fetchedHomeChildGameActivities[0]?.relation?.id,
            }),
            getFormationPositionsCoordinates({
              fieldId: field.id,
              formationId: fetchedAwayChildGameActivities[0]?.relation?.id,
            }),
          ]);

        dispatch(
          setTeams(
            prepareBothTeamsReportData({
              event: gameInfo,
              homeCoords: homeChildCoordinates,
              awayCoords: awayChildCoordinates,
              homeActivities: fetchedHomeChildGameActivities,
              awayActivities: fetchedAwayChildGameActivities,
            })
          )
        );
      } else {
        dispatch(
          setTeams({
            home: {
              ...teams.home,
              players: gameInfo.home_athletes,
              listPlayers: gameInfo.home_athletes,
              staff: gameInfo.home_event_users,
            },
            away: {
              ...teams.away,
              players: gameInfo.away_athletes,
              listPlayers: gameInfo.away_athletes,
              staff: gameInfo.away_event_users,
            },
          })
        );
      }

      if (fetchedEventPeriods.length > 0) {
        transformAndUpdateGameActivitiesForPeriod({
          gameEvent: gameInfo,
          fetchedGameActivities,
          gamePeriods: fetchedEventPeriods,
        });
        updateAllEventPeriods(fetchedEventPeriods);
      }

      const matchNote = fetchedMatchReportNote.event_notes || '';
      updateGameNotes(matchNote, matchNote);

      setRequestStatus('SUCCESS');
    } catch {
      setRequestStatus('FAILURE');
    }
  };

  useEffect(() => {
    if (!preferences?.league_match_report_pitch_view || field.id !== 0) {
      getPlanningHubEvent({
        eventId,
        showAthletesAndStaff: true,
        supervisorView: isOrgSupervised,
        includeGraduationDate: isScout,
      })
        // This is game event for reference always, flow never perceives it as.
        .then(async (eventResponse: Object) => {
          setEvent(eventResponse.event);

          if (
            isOfficial &&
            permissions.leagueGame?.manageMatchReport &&
            !eventResponse.event?.match_report_submitted_by_id
          ) {
            setReadOnlyMode(false);
          }

          setFlagDisciplinaryIssue(!!eventResponse.event?.disciplinary_issue);

          await handleEventRelatedApiDataRetrieval(eventResponse.event);
        })
        .catch(() => {
          setRequestStatus('FAILURE');
        });
    }
  }, [isLeague, isOrgSupervised, isScout, field.id]);

  useEffect(() => {
    const currentActivities = gameActivities.localGameActivities
      .map((activity, index) => ({
        ...activity,
        activityIndex: index,
      }))
      .filter(
        (activity) =>
          viewableEventTypes.includes(activity.kind) && !activity.delete
      )
      .sort((a, b) => {
        if (b.absolute_minute !== a.absolute_minute)
          return +b.absolute_minute - +a.absolute_minute;
        return +b.activityIndex - +a.activityIndex;
      });
    dispatch(setPitchActivities(currentActivities));
  }, [gameActivities.localGameActivities, event]);

  useEffect(() => {
    if (selectedEventListGameView === matchReportEventListGameView.penalty)
      dispatch(setActiveEventSelection(''));
  }, [selectedEventListGameView]);

  const saveMatchReportGameActivities = async ({
    apiActivities,
    localActivities,
    updatedEvent,
  }: {
    apiActivities: Array<GameActivity>,
    localActivities: Array<GameActivity>,
    // Used Object for type and not Game to avoid a flow error.
    // TODO: refactor to work with Game type.
    updatedEvent: Object,
  }) => {
    const updatedActivities = await updateAllPeriodGameActivities({
      gamePeriods: eventPeriods,
      apiGameActivities: apiActivities,
      localGameActivities: localActivities,
      gameId: eventId,
    });

    transformAndUpdateGameActivitiesForPeriod({
      gameEvent: updatedEvent,
      fetchedGameActivities: updatedActivities.flat(),
      gamePeriods: eventPeriods,
    });
  };

  const saveMatchReportGameNote = async () => {
    const updatedNotes = await saveMatchReportNotes(
      eventId,
      gameNotes.localNotes
    );

    updateGameNotes(updatedNotes.event_notes, updatedNotes.event_notes);
  };

  const saveMatchReportGameEvent = async () => {
    const isReportYetToBeSubmitted =
      finalSubmitMode && !event?.match_report_submitted_by_id;

    const hasDisciplinaryIssueResultChanged =
      flagDisciplinaryIssue !== !!event?.disciplinary_issue;

    const homePenaltyScores = getTeamPenaltyShootoutScores(
      penaltyShootoutActivities.localPenaltyLists.homePenalties
    );
    const awayPenaltyScores = getTeamPenaltyShootoutScores(
      penaltyShootoutActivities.localPenaltyLists.awayPenalties
    );

    let updatedEvent: Object = {
      ...event,
      score: +gameScores.orgScore,
      opponent_score: +gameScores.opponentScore,
      ...(preferences?.league_match_report_penalty_shootout && {
        penalty_shootout_score: homePenaltyScores,
        opponent_penalty_shootout_score: awayPenaltyScores,
      }),
    };

    if (isReportYetToBeSubmitted || hasDisciplinaryIssueResultChanged) {
      const savedEvent: Object = await saveEvent({
        event: {
          id: updatedEvent.id,
          type: updatedEvent.type,
          score: updatedEvent.score,
          opponent_score: updatedEvent.opponent_score,
          ...(preferences?.league_match_report_penalty_shootout && {
            penalty_shootout_score: updatedEvent.penalty_shootout_score,
            opponent_penalty_shootout_score:
              updatedEvent.opponent_penalty_shootout_score,
          }),
          ...(finalSubmitMode && { match_report_submitted: true }),
          disciplinary_issue: flagDisciplinaryIssue,
        },
      });
      updatedEvent = { ...updatedEvent, ...savedEvent };
    } else {
      await saveMatchReportScores({
        eventId,
        homeScore: gameScores.orgScore,
        opponentScore: gameScores.opponentScore,
        homePenaltyScore: preferences?.league_match_report_penalty_shootout
          ? homePenaltyScores
          : 0,
        opponentPenaltyScore: preferences?.league_match_report_penalty_shootout
          ? awayPenaltyScores
          : 0,
      });
    }

    setEvent(updatedEvent);
    return updatedEvent;
  };

  const handleSaveSuccess = async () => {
    if (isLeague || !finalSubmitMode) {
      setSaveStatus('SUCCESS');
      setRequestStatus('SUCCESS');
      setShowSaveReportModal(false);
      dispatch(setActiveEventSelection(''));
      if (isLeague) setReadOnlyMode(true);
    } else {
      await new Promise((resolve) =>
        setTimeout(resolve, TOAST_ANIMATION_DURATION)
      );
      window.location.href = '/league-fixtures';
    }
  };

  const handleSaveFailure = async () => {
    // Handles re-fetching the data if the save fails at any point to avoid duplicate saving of Activities.
    const refreshedGameActivities = await getGameActivities({
      eventId,
      supervisorView: isOrgSupervised,
    });
    transformAndUpdateGameActivitiesForPeriod({
      gameEvent: event,
      fetchedGameActivities: refreshedGameActivities,
      gamePeriods: eventPeriods,
    });

    setShowSaveReportModal(false);
    setSaveStatus('FAILURE');
  };

  const saveMatchReportData = async () => {
    try {
      setSaveStatus('PENDING');

      const hasGameNotesBeenChanged =
        gameNotes.localNotes && gameNotes.localNotes !== gameNotes.apiNotes;

      const { combinedAllLocalActivities, combinedAllApiActivities } =
        combineAllNormalTimeAndPenaltyActivities(
          gameActivities,
          penaltyShootoutActivities
        );

      const updatedEvent = await saveMatchReportGameEvent();

      if (
        eventPeriods.length > 0 &&
        !isEqual(combinedAllLocalActivities, combinedAllApiActivities)
      ) {
        await saveMatchReportGameActivities({
          apiActivities: combinedAllApiActivities,
          localActivities: combinedAllLocalActivities,
          updatedEvent,
        });
      }

      if (hasGameNotesBeenChanged) {
        await saveMatchReportGameNote();
      }

      toastDispatch?.({
        type: 'UPDATE_TOAST',
        toast: {
          id: 1,
          title: props.t(
            '{{leagueStaffType}} Match Report Successfully {{saveType}}!',
            {
              leagueStaffType: isLeague
                ? props.t('League')
                : props.t('Officials'),
              saveType: finalSubmitMode
                ? props.t('Submitted')
                : props.t('Saved'),
            }
          ),
          status: 'SUCCESS',
        },
      });

      await handleSaveSuccess();
    } catch {
      toastDispatch?.({
        type: 'UPDATE_TOAST',
        toast: {
          id: 2,
          title: props.t(
            'Error {{saveType}} the match report. Please try again!',
            {
              saveType: finalSubmitMode
                ? props.t('Submitting')
                : props.t('Saving'),
            }
          ),
          status: 'ERROR',
        },
      });

      await handleSaveFailure();
    }
  };

  const revertLocalChanges = () => {
    updateAllGameActivities(gameActivities.apiGameActivities);

    if (penaltyShootoutActivities.apiPenaltyLists.homePenalties.length > 0)
      updatePenaltyLists(
        penaltyShootoutActivities.apiPenaltyLists,
        penaltyShootoutActivities.apiPenaltyLists
      );
    else
      updatePenaltyLists(
        penaltyShootoutActivities.localPenaltyLists,
        penaltyShootoutActivities.localPenaltyLists
      );

    updateGameNotes(gameNotes.apiNotes, gameNotes.apiNotes);
    editorRef.current?.update(getEditorStateFromValue(gameNotes.apiNotes));
    setFlagDisciplinaryIssue(!!event?.disciplinary_issue);
    setGameScores({
      orgScore: event?.score || 0,
      opponentScore: event?.opponent_score || 0,
    });
    dispatch(setActiveEventSelection(''));
  };

  const renderSubmitReportModal = () => {
    return (
      <MatchReportSubmitModal
        showSaveReportModal={showSaveReportModal}
        finalSubmitMode={finalSubmitMode}
        saveStatus={saveStatus}
        handleOnClose={() => {
          setShowSaveReportModal(false);
          setFinalSubmitMode(false);
        }}
        handleOnSubmit={saveMatchReportData}
      />
    );
  };

  const renderMatchReportContent = (status: string) => {
    if (status === 'PENDING') return <DelayedLoadingFeedback />;
    if (status === 'FAILURE') return <AppStatus status="error" isEmbed />;

    return (
      <>
        {muiMatchRefereeReportFeatureFlag ? (
          <MatchReportMUI
            event={event}
            areHeaderButtonsDisabled={checkIfHeaderButtonsAreDisabled(
              isOfficial
            )}
            isEditMode={!readOnlyMode}
            gameScores={gameScores}
            setGameScores={setGameScores}
            penaltyShootoutActivities={penaltyShootoutActivities}
            enableEditMode={() => setReadOnlyMode(false)}
            handleOnSaveReport={({ isSubmit }) => {
              setShowSaveReportModal(true);
              if (isSubmit) setFinalSubmitMode(true);
            }}
            handleRevertingReportChanges={() => {
              revertLocalChanges();
              setReadOnlyMode(true);
            }}
          />
        ) : (
          <MatchReportLegacy
            event={event}
            selectedEventListGameView={selectedEventListGameView}
            setSelectedEventListGameView={setSelectedEventListGameView}
            gameScores={gameScores}
            setGameScores={setGameScores}
            penaltyShootoutActivities={penaltyShootoutActivities}
            gameNotes={gameNotes}
            updateGameNotes={updateGameNotes}
            updatePenaltyLists={updatePenaltyLists}
            readOnlyMode={readOnlyMode}
            setReadOnlyMode={setReadOnlyMode}
            flagDisciplinaryIssue={flagDisciplinaryIssue}
            setFlagDisciplinaryIssue={setFlagDisciplinaryIssue}
            setShowSaveReportModal={setShowSaveReportModal}
            setFinalSubmitMode={setFinalSubmitMode}
            checkIfHeaderButtonsAreDisabled={checkIfHeaderButtonsAreDisabled}
            revertLocalChanges={revertLocalChanges}
          />
        )}
        {(isLeague || isOfficial) &&
          showSaveReportModal &&
          renderSubmitReportModal()}
      </>
    );
  };

  return renderMatchReportContent(requestStatus);
};

export const MatchReportAppTranslated: ComponentType<Props> =
  withNamespaces()(MatchReportApp);
export default MatchReportApp;
