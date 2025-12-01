// @flow
import { DndContext } from '@dnd-kit/core';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import structuredClone from 'core-js/stable/structured-clone';
import { isEqual } from 'lodash';

import type { OrganisationFormat } from '@kitman/services/src/services/planning/getOrganisationFormats';
import type {
  Coordinate,
  Formation,
  Team,
  PitchViewInitialState,
  FormationCoordinates,
  PlayerWithPosition,
} from '@kitman/common/src/types/PitchView';
import type {
  GameActivity,
  GameActivityStorage,
  GamePeriod,
  EventActivityTypes,
  GamePeriodStorage,
} from '@kitman/common/src/types/GameEvent';
import type { Athlete, Game } from '@kitman/common/src/types/Event';
import {
  eventTypes,
  sportFormats,
  pitchViewFormats,
} from '@kitman/common/src/consts/gameEventConsts';
import {
  findFormationForPeriod,
  createPlayerFormationViewChange,
  findActivityForThePosition,
  updatePlayerFormationViewChange,
  handleFootballMultiPlayerPitchEvent,
} from '@kitman/common/src/utils/planningEvent/gameActivityUtils';
import { getHasPeriodStarted } from '@kitman/common/src/utils/planningEvent/gamePeriodUtils';
import EventListPitchViewContainer from '@kitman/modules/src/PlanningEvent/src/components/EventList/Containers/EventListPitchViewContainer';
import { FormationSelectorTranslated as FormationSelector } from '@kitman/modules/src/PlanningEvent/src/components/FormationSelector';
import { AvailablePlayerListTranslated as AvailablePlayerList } from '@kitman/modules/src/PlanningEvent/src/components/AvailablePlayerList';
import { getClearedTeam } from '@kitman/modules/src/PlanningEvent/src/components/GameEventsTab/utils';
import { SubstitutionPlayerListTranslated as SubstitutionPlayerList } from '@kitman/modules/src/PlanningEvent/src/components/SubstitutionPlayerList';
import { setUnsavedGameActivities } from '@kitman/modules/src/PlanningEvent/src/redux/slices/gameActivitiesSlice';
import {
  setActiveEventSelection,
  setFormationCoordinates,
  setPitchActivities,
  setTeam,
  setSelectedPitchPlayer,
} from '@kitman/modules/src/PlanningEvent/src/redux/slices/pitchViewSlice';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';

import Pitch from './Pitch';
import styles from './styles';
import {
  autoSetStartOfPeriodAssignmentsToPitch,
  getEventListPitchActivities,
  getMultiEventActivities,
  recursiveMultiEventPitchUpdate,
} from './pitchViewUtils';

type Props = {
  sport?: string,
  currentPeriod: ?GamePeriod,
  isLastPeriodSelected?: boolean,
  event: Game,
  activeTabKey: string,
  preventGameEvents: boolean,
  isImportedGame: boolean,
  gameFormats: Array<OrganisationFormat>,
  formations: Array<Formation>,
  isDmrLocked?: boolean,
  selectedEvent: ?GameActivity,
  onSetSelectedEvent: (?GameActivity) => void,
  dispatchMandatoryCheck: () => void,
  isMidGamePlayerPositionChangeDisabled: boolean,
  dispatchFailedFormationCoordsToast: () => void,
};

const PitchView = (props: Props) => {
  const { isLeagueStaffUser } = useLeagueOperations();

  const dispatch = useDispatch();

  const { sport = sportFormats.soccer } = props;

  const { localGameActivities: gameActivities } =
    useSelector<GameActivityStorage>(
      (state) => state.planningEvent.gameActivities
    );

  const { localEventPeriods } = useSelector<GamePeriodStorage>(
    (state) => state.planningEvent.eventPeriods
  );

  const isSelectedPeriodStartingPeriod = isEqual(
    localEventPeriods[0],
    props.currentPeriod
  );

  const hasStartingPeriodStarted = getHasPeriodStarted(
    gameActivities,
    localEventPeriods[0]
  );

  const {
    field,
    activeEventSelection,
    team,
    formationCoordinates,
    pitchActivities,
    selectedFormation,
    isLoading,
    selectedPitchPlayer,
  } = useSelector<PitchViewInitialState>(
    (state) => state.planningEvent.pitchView
  );

  // period has started if the formation_complete activity is present and it is a club user
  const hasPeriodStarted =
    getHasPeriodStarted(gameActivities, props.currentPeriod) &&
    !isLeagueStaffUser;

  const isPlayerInField = Object.keys(team.inFieldPlayers).length > 0;

  const updateLocalGameActivities = (
    updatedGameActivities: Array<GameActivity>
  ) => dispatch(setUnsavedGameActivities(updatedGameActivities));

  const updateActiveEventSelection = (eventType: EventActivityTypes) =>
    dispatch(setActiveEventSelection(eventType));

  const updateTeam = (updatedTeam: Team) => dispatch(setTeam(updatedTeam));

  const updateFormationCoordinates = (
    updatedCoordinates: FormationCoordinates
  ) => dispatch(setFormationCoordinates(updatedCoordinates));

  const updatePitchActivities = (updatedPitchActivities: Array<GameActivity>) =>
    dispatch(setPitchActivities(updatedPitchActivities));

  const updateSelectedPitchPlayer = (value: ?PlayerWithPosition) =>
    dispatch(setSelectedPitchPlayer(value));

  useEffect(() => {
    if (activeEventSelection !== eventTypes.switch && selectedPitchPlayer)
      updateSelectedPitchPlayer(null);
  }, [activeEventSelection]);

  // resets the team of infield players if the period changes
  useEffect(() => {
    if (isPlayerInField || props.activeTabKey) {
      updateTeam(getClearedTeam(team));
      if (selectedPitchPlayer) updateSelectedPitchPlayer(null);
    }
  }, [props.currentPeriod, props.activeTabKey]);

  const handleAutoPitchAssignments = async () => {
    let currentFormationCoordinates = structuredClone(formationCoordinates);

    let currentTeam = autoSetStartOfPeriodAssignmentsToPitch({
      gameActivities,
      currentPeriod: props.currentPeriod,
      team,
      formationCoordinates,
    });

    // Handles the retrieval of the switch/substitute/formation change activities
    const multiEventActivities = getMultiEventActivities({
      gameActivities,
      currentPeriod: props.currentPeriod,
      isLastPeriodSelected: props.isLastPeriodSelected,
    });

    if (multiEventActivities.length > 0 && hasPeriodStarted) {
      // This block recursively iterates through the multi event (sub/switch/formation change) activities retrieved above
      // updating the current team and coordinates as it goes to maintain pitch integrity.
      const { updatedTeam, updatedFormationCoordinates } =
        await recursiveMultiEventPitchUpdate({
          indexCounter: 0,
          allGameActivities: gameActivities,
          loopActivities: multiEventActivities,
          fieldId: field.id,
          team: currentTeam,
          formationCoordinates,
        });
      currentTeam = updatedTeam;
      currentFormationCoordinates = updatedFormationCoordinates;
    }

    // sets the team in one final rerender when all finished
    if (!isEqual(currentFormationCoordinates, formationCoordinates)) {
      updateFormationCoordinates(currentFormationCoordinates);
    }

    if (!isEqual(team, currentTeam)) {
      updateTeam(currentTeam);
    }
  };

  useEffect(() => {
    // use effect for handling the automatic setup of the field with prior activities
    if (!(isPlayerInField || isLoading)) {
      const coordinateKeys = Object.keys(formationCoordinates);
      const currentFirstCoord = formationCoordinates[coordinateKeys[0]];
      const foundStartingFormationActivity = findFormationForPeriod(
        gameActivities,
        props.currentPeriod
      );

      // Checks if a formation exists for this period, then checks to make sure the formation coordinates match it and then
      // checks to see if the formation activity also matches the respective formation selected before continuing.
      const isSelectedFormationSyncedWithCoords =
        selectedFormation?.id === currentFirstCoord?.formation_id;
      const isCoordsSyncedWithStartingFormationActivity =
        currentFirstCoord?.formation_id ===
        foundStartingFormationActivity?.relation?.id;

      if (
        foundStartingFormationActivity &&
        isSelectedFormationSyncedWithCoords &&
        isCoordsSyncedWithStartingFormationActivity
      ) {
        handleAutoPitchAssignments().catch(() => {
          props.dispatchFailedFormationCoordsToast?.();
        });
      }
    }
  }, [
    props.currentPeriod,
    formationCoordinates,
    team.inFieldPlayers,
    gameActivities,
    selectedFormation,
    isLoading,
  ]);

  useEffect(() => {
    // useEffect for handling the respective pitch event activities for the period
    // attaches a index to keep track of which activity is what and then sorts them in descending order.
    if (hasPeriodStarted && props.currentPeriod) {
      const filteredPitchEvents = getEventListPitchActivities({
        gameActivities,
        currentPeriod: props.currentPeriod,
        isLastPeriodSelected: props.isLastPeriodSelected,
      });

      updatePitchActivities(filteredPitchEvents);
    } else {
      updatePitchActivities([]);
    }
  }, [gameActivities, hasPeriodStarted, props.currentPeriod]);

  const handleOnDropStartingLineupPositions = ({
    positionInfo,
    player,
    prevPlayer,
  }: {
    positionInfo: Coordinate,
    player: Athlete,
    prevPlayer: Athlete,
  }) => {
    const foundActivity = findActivityForThePosition({
      gameActivities,
      positionId: +positionInfo?.id,
      currentPeriodMinute: +props.currentPeriod?.absolute_duration_start,
      positionType: eventTypes.formation_position_view_change,
    });
    if (foundActivity) {
      updateLocalGameActivities(
        updatePlayerFormationViewChange({
          gameActivities,
          playerId: +player.id,
          prevPlayerId: +prevPlayer.id,
          currentPeriodMinute: +props.currentPeriod?.absolute_duration_start,
        })
      );
    } else {
      const playerAssignedActivities = createPlayerFormationViewChange({
        playerId: +player.id,
        positionInfo,
        periodMin: +props.currentPeriod?.absolute_duration_start,
      });

      updateLocalGameActivities([
        ...gameActivities,
        ...playerAssignedActivities,
      ]);
    }
  };

  const handleOnDropMultiPositionPitchChanges = ({
    positionInfo,
    player,
    prevPlayer,
  }: {
    positionInfo: Coordinate,
    player: Athlete,
    prevPlayer: Athlete,
  }) => {
    const substituteEvents = handleFootballMultiPlayerPitchEvent({
      athleteId: +player.id,
      eventType: eventTypes.sub,
      positionData: { id: null, position: { id: null } },
      pitchActivities,
      periodStartTime: +props.currentPeriod?.absolute_duration_start,
      selectedPitchPlayer: { player: prevPlayer, positionData: positionInfo },
    });

    updateLocalGameActivities([...gameActivities, ...substituteEvents]);

    // when a new event is created automatically select it instead
    props.onSetSelectedEvent?.({
      ...substituteEvents[0],
      activityIndex: gameActivities.length,
    });
  };

  const onDropPlayer = ({
    positionId, // coordinates of the position x_y,
    player,
    prevPlayer,
  }: {
    positionId: string,
    player: Athlete,
    prevPlayer: Athlete,
  }) => {
    updateTeam({
      ...team,
      inFieldPlayers: {
        ...team.inFieldPlayers,
        [positionId]: player,
      },
      players:
        prevPlayer && Object.keys(prevPlayer).length
          ? [team.players.filter((p) => p.id !== player.id), prevPlayer].flat()
          : team.players.filter((p) => p.id !== player.id),
    });

    const positionInfo = formationCoordinates[positionId];
    if (!hasPeriodStarted) {
      handleOnDropStartingLineupPositions({ positionInfo, player, prevPlayer });
    } else if (activeEventSelection === eventTypes.sub) {
      handleOnDropMultiPositionPitchChanges({
        positionInfo,
        player,
        prevPlayer,
      });
    }
  };

  const onDragEnd = (e) => {
    if (
      e.over?.id &&
      (!hasPeriodStarted ||
        (hasPeriodStarted && activeEventSelection === eventTypes.sub))
    ) {
      onDropPlayer({
        positionId: e.over.id,
        player: e.active.data.current,
        prevPlayer: e.over.data?.current,
      });
    }
  };

  const renderPitch = () => (
    <Pitch
      sport={sport}
      pitchFormat={pitchViewFormats.gameEvents}
      selectedFormationCoordinates={formationCoordinates}
      periodStartTime={+props.currentPeriod?.absolute_duration_start}
      setSelectedEvent={props.onSetSelectedEvent}
      hasPeriodStarted={hasPeriodStarted}
      isImportedGame={props.isImportedGame}
      isDmrLocked={props.isDmrLocked && !hasStartingPeriodStarted}
      team={team}
      setTeam={updateTeam}
      selectedSquadOrganisationId={props.event?.squad?.owner_id}
    />
  );

  const renderSubsList = () => (
    <SubstitutionPlayerList
      pitchFormat={pitchViewFormats.gameEvents}
      periodStartTime={props.currentPeriod?.absolute_duration_start}
      team={team}
      staff={props.event?.event_users || []}
      formationCoordinates={formationCoordinates}
      onSetSelectedEvent={props.onSetSelectedEvent}
      onSetTeam={updateTeam}
    />
  );

  const renderGameEventsEventList = () => (
    <EventListPitchViewContainer
      formations={props.formations}
      gameFormats={props.gameFormats}
      currentPeriod={props.currentPeriod}
      isLastPeriodSelected={props.isLastPeriodSelected}
      setSelectedEvent={props.onSetSelectedEvent}
      dispatchMandatoryCheck={props.dispatchMandatoryCheck}
      preventGameEvents={props.preventGameEvents}
      setActiveEventSelection={updateActiveEventSelection}
      selectedEvent={props.selectedEvent}
      staff={props.event?.event_users || []}
      isMidGamePlayerPositionChangeDisabled={
        props.isMidGamePlayerPositionChangeDisabled
      }
    />
  );

  const renderGameEventsAvailablePlayerList = () => (
    <div
      data-testid="available-player-list-container"
      css={styles.availablePlayerList}
    >
      <AvailablePlayerList
        eventId={props.event?.id}
        isCaptainEnabled={props.event?.competition?.show_captain}
        periodStartTime={props.currentPeriod?.absolute_duration_start}
        currentPeriod={props.currentPeriod}
        gameFormats={props.gameFormats}
        formations={props.formations}
        isDmrLocked={props.isDmrLocked && isSelectedPeriodStartingPeriod}
        isImportedGame={props.isImportedGame}
      />
    </div>
  );

  return (
    <DndContext onDragEnd={onDragEnd}>
      <div css={styles.pitchViewWrapper}>
        <div css={styles.pitchWrapper}>
          <div>
            <div data-testid="pitch-container" className="pitch">
              {!!field?.id && (
                <>
                  <div
                    className={activeEventSelection}
                    css={styles.formationSelectorWrapper}
                  >
                    <FormationSelector
                      hasPeriodStarted={hasPeriodStarted}
                      formations={props.formations}
                      gameFormats={props.gameFormats}
                      currentPeriod={props.currentPeriod}
                      isLastPeriodSelected={props.isLastPeriodSelected}
                      isDmrLocked={
                        props.isDmrLocked && isSelectedPeriodStartingPeriod
                      }
                    />
                  </div>
                  {renderPitch()}
                </>
              )}
            </div>
            {hasPeriodStarted && (
              <div css={styles.substitutionPlayerList}>{renderSubsList()}</div>
            )}
          </div>
          {hasPeriodStarted
            ? renderGameEventsEventList()
            : renderGameEventsAvailablePlayerList()}
        </div>
      </div>
    </DndContext>
  );
};

export default PitchView;
