// @flow
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import structuredClone from 'core-js/stable/structured-clone';
import type { Option } from '@kitman/components/src/Select';
import { useGetDisciplinaryReasonsQuery } from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/disciplinaryReasonsApi';
import type {
  Formation,
  PitchViewInitialState,
} from '@kitman/common/src/types/PitchView';
import type { OrganisationFormat } from '@kitman/services/src/services/planning/getOrganisationFormats';
import type {
  GameActivity,
  GameActivityStorage,
  GamePeriod,
  EventActivityTypes,
} from '@kitman/common/src/types/GameEvent';
import type { EventUser, Athlete } from '@kitman/common/src/types/Event';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import { clearPeriodActivities } from '@kitman/common/src/utils/planningEvent/gamePeriodUtils';
import {
  findFormationForPeriod,
  findMostRecentFormationsForPeriod,
  getEventPositionActivitiesIndexes,
  getLinkedActivitiesFromEvent,
  getLinkedActivitiesIndexesFromEvent,
  updateFormationPlayerActivities,
  updateGameActivitiesForOwnGoal,
  doesOwnGoalExistForEvent,
} from '@kitman/common/src/utils/planningEvent/gameActivityUtils';
import {
  setTeam,
  setActiveEventSelection,
  setFormationCoordinates,
} from '@kitman/modules/src/PlanningEvent/src/redux/slices/pitchViewSlice';
import { setUnsavedGameActivities } from '@kitman/modules/src/PlanningEvent/src/redux/slices/gameActivitiesSlice';

import { EventListTranslated as EventList } from '../EventList';
import {
  getClearedTeam,
  getMaxMinForEventActivities,
  groupFormationsByGameFormat,
  orderPlayersByGroupAndPositionAndId,
  getNextCoords,
} from '../../GameEventsTab/utils';
import {
  eventTypeFilterOptions,
  handleEventButtonSelection,
  getPlayerFilterOptions,
  getDoubleYellowRedCardIndexForDeletion,
  updatePitchEventSwapActivities,
  preparePenaltyReasonsOptions,
  addPairedRedCardForSecondYellowIndex,
  addPairedGoalActivityIndex,
} from '../eventListUtils';
import {
  eventListValueChangeTypes,
  eventListFormatTypes,
} from '../eventListConsts';

type Props = {
  gameFormats: Array<OrganisationFormat>,
  formations: Array<Formation>,
  currentPeriod: ?GamePeriod,
  selectedEvent: ?GameActivity,
  setSelectedEvent?: (GameActivity) => void,
  dispatchMandatoryCheck?: () => void,
  preventGameEvents: boolean,
  staff: Array<EventUser>,
  isLastPeriodSelected?: boolean,
  isMidGamePlayerPositionChangeDisabled?: boolean,
};

const EventListPitchViewContainer = (props: Props) => {
  const dispatch = useDispatch();

  const { currentPeriod, isLastPeriodSelected } = props;

  const { localGameActivities: gameActivities } =
    useSelector<GameActivityStorage>(
      (state) => state.planningEvent.gameActivities
    );

  const {
    field,
    activeEventSelection,
    team,
    formationCoordinates,
    pitchActivities,
    selectedGameFormat,
  } = useSelector<PitchViewInitialState>(
    (state) => state.planningEvent.pitchView
  );

  const players = [...Object.values(team.inFieldPlayers), ...team.players];

  const [eventTypeFilter, setEventTypeFilter] = useState<?Option>(null);
  const [playerFilter, setPlayerFilter] = useState<?Option>(null);
  const [filteredActivities, setFilteredActivities] = useState<
    Array<GameActivity>
  >([]);

  const updateActiveEventSelection = (eventType: EventActivityTypes) =>
    dispatch(setActiveEventSelection(eventType));

  const { data: penaltyDisciplinaryReasons } = useGetDisciplinaryReasonsQuery(
    undefined,
    {
      selectFromResult: ({ data = [] }) => {
        return {
          data: preparePenaltyReasonsOptions(data),
        };
      },
    }
  );

  useEffect(() => {
    let currentActivities = [...pitchActivities];
    if (eventTypeFilter) {
      currentActivities = currentActivities.filter((activity) => {
        // Custom filtering for the Own Goal since it is linked to the goal event (and not included in viewableEventTypes)
        const isGoalFilter = [eventTypes.goal, eventTypes.own_goal].includes(
          eventTypeFilter
        );

        if (activity.kind === eventTypes.goal && isGoalFilter) {
          const isOwnGoal = doesOwnGoalExistForEvent(gameActivities, activity);
          return eventTypeFilter === eventTypes.own_goal
            ? isOwnGoal
            : !isOwnGoal;
        }

        return activity.kind === eventTypeFilter;
      });
    }
    if (playerFilter) {
      currentActivities = currentActivities.filter(
        (activity) => activity.athlete_id === playerFilter
      );
    }
    setFilteredActivities(currentActivities);
  }, [eventTypeFilter, playerFilter, pitchActivities, gameActivities]);

  const getPositionSwapPlayers = (activity: GameActivity) => {
    const inFieldPlayers = Object.keys(team.inFieldPlayers).map(
      (key) => team.inFieldPlayers[key]
    );
    const foundSubPlayer = players.find(
      (player) => player.id === activity.relation?.id
    );

    if (foundSubPlayer) {
      return [...new Set([foundSubPlayer, ...inFieldPlayers])];
    }

    return inFieldPlayers;
  };

  const findPlayerRelatedToAssistOnTeamOrBench = (
    inFieldPlayers: Array<Athlete>,
    athleteId: number
  ) => {
    const foundAssistPlayer = inFieldPlayers.find(
      (player: Athlete) => player.id === athleteId
    );

    if (foundAssistPlayer) return foundAssistPlayer;

    return players.find((player: Athlete) => player.id === athleteId);
  };

  const getGoalAssistPlayers = (activity: GameActivity) => {
    const linkedAssists = getLinkedActivitiesFromEvent({
      gameActivities,
      event: activity,
      type: eventTypes.assist,
    });
    const inFieldPlayers = Object.keys(team.inFieldPlayers).map(
      (key) => team.inFieldPlayers[key]
    );

    // Searches the current pitch and if not found searches the player bench for the person who took the goal.
    const foundPlayer = findPlayerRelatedToAssistOnTeamOrBench(
      inFieldPlayers,
      +activity.relation?.id
    );

    let foundAssistPlayer;
    // Searches the linked activities for if the player exists on the bench or pitch for the assist
    if (linkedAssists.length > 0) {
      foundAssistPlayer = findPlayerRelatedToAssistOnTeamOrBench(
        inFieldPlayers,
        +linkedAssists[0].athlete_id
      );

      // Searches the nested activities for the player if not found from the linked.
    } else if (activity.game_activities) {
      const assistActivities = activity.game_activities;
      foundAssistPlayer = findPlayerRelatedToAssistOnTeamOrBench(
        inFieldPlayers,
        +assistActivities[0].athlete_id
      );
    }

    if (foundAssistPlayer) {
      return [
        ...new Set([foundPlayer, foundAssistPlayer, ...inFieldPlayers]),
      ].filter(Boolean);
    }

    return [...new Set([foundPlayer, ...inFieldPlayers])].filter(Boolean);
  };

  const getSubstitutionPlayers = (activity: GameActivity) => {
    const inPlayPlayer = players.find(
      (player) => player?.id === activity.relation?.id
    );

    return [inPlayPlayer, ...team.players];
  };

  const getPlayerSelectOptions = (
    activity: GameActivity,
    selectedPlayer: ?Athlete
  ) => {
    const isPlayerDropdownIncludedInEvent = [
      eventTypes.switch,
      eventTypes.sub,
      eventTypes.goal,
    ].includes(activity.kind);

    if (isPlayerDropdownIncludedInEvent) {
      let playerArray = [];

      if (eventTypes.switch === activity.kind) {
        playerArray = getPositionSwapPlayers(activity);
      } else if (activity.kind === eventTypes.sub) {
        playerArray = getSubstitutionPlayers(activity);
      } else if (activity.kind === eventTypes.goal) {
        playerArray = getGoalAssistPlayers(activity);
      }
      return playerArray
        .filter((player) => player?.id !== selectedPlayer?.id)
        .map((player) => ({
          label: player?.fullname,
          value: player?.id,
        }));
    }
    return [];
  };

  const checkIfInvalidMinute = (minute: number, event: GameActivity) => {
    // If it is the last period include the period end time as a possible minute the activity can be set for
    const isWithinEndOfPeriodBoundary = isLastPeriodSelected
      ? minute > +currentPeriod?.absolute_duration_end
      : minute >= +currentPeriod?.absolute_duration_end;

    const isInvalidMinuteInPeriod =
      minute < +currentPeriod?.absolute_duration_start ||
      isWithinEndOfPeriodBoundary;

    const isInvalidPlayerSwapMinute =
      [eventTypes.switch, eventTypes.sub].includes(event.kind) &&
      minute < getMaxMinForEventActivities(pitchActivities, event);
    const isInvalidFormationMinute =
      eventTypes.formation_change === event.kind &&
      minute <=
        +findMostRecentFormationsForPeriod(gameActivities, currentPeriod)[0]
          .absolute_minute;

    return (
      isInvalidMinuteInPeriod ||
      isInvalidPlayerSwapMinute ||
      isInvalidFormationMinute
    );
  };

  const getMultiEventIndexesFromActivity = (currentActivity: GameActivity) =>
    getEventPositionActivitiesIndexes(gameActivities, currentActivity.id);

  // Function to handle the updated pitch positions once a switch/sub activity has been altered in its player selected
  const updateNewPitchViewPositions = ({
    updatedGameActivities,
    eventIndex,
    currentActivity,
    updatedFormationPositionChangeIndex,
    athleteNumber,
    foundCurrentPositionCoord,
  }: {
    updatedGameActivities: Array<GameActivity>,
    eventIndex: number,
    currentActivity: GameActivity,
    updatedFormationPositionChangeIndex: number,
    athleteNumber: number,
    foundCurrentPositionCoord: ?string,
  }) => {
    const coordinateKeys = Object.keys(formationCoordinates);
    const inFieldPlayerKeys = Object.keys(team.inFieldPlayers);
    const inFieldPlayers = inFieldPlayerKeys.map(
      (key) => team.inFieldPlayers[key]
    );

    const updatedActivity = updatedGameActivities[eventIndex];

    const FIRST_NESTED_FORMATION_POSITION_CHANGE_INDEX = 1;
    const SECOND_NESTED_FORMATION_POSITION_CHANGE_INDEX = 3;
    // handles the index selection if it is dealing with a sub event with 2 activities
    const nestedIndex =
      updatedActivity.game_activities &&
      updatedActivity.game_activities.length > 2
        ? SECOND_NESTED_FORMATION_POSITION_CHANGE_INDEX
        : FIRST_NESTED_FORMATION_POSITION_CHANGE_INDEX;

    const newAthleteFormationPositionActivity = updatedActivity.game_activities
      ? updatedActivity.game_activities[nestedIndex]
      : updatedGameActivities[updatedFormationPositionChangeIndex];

    // Retrieves the respective info for the swapped players, and the previously swapped player so it can be restored
    const foundNewFormationCoord = coordinateKeys.find(
      (positionIdKey) =>
        formationCoordinates[positionIdKey].id ===
        newAthleteFormationPositionActivity?.relation?.id
    );

    const foundNewPlayer = players.find(
      (player) => player.id === athleteNumber
    );
    const foundPrevPlayerToRestore = players.find(
      (player) => player.id === currentActivity.relation?.id
    );

    if (currentActivity.kind === eventTypes.switch) {
      const foundPrevPositionCoordToRestore = inFieldPlayerKeys.find(
        (inFieldKey) =>
          team.inFieldPlayers[inFieldKey].id === currentActivity.athlete_id
      );

      const foundCurrentPlayer = inFieldPlayers.find(
        (player) => player.id === updatedActivity.athlete_id
      );

      // Handles the swapping of the updated players and the restoration of the old swapped
      if (
        foundPrevPositionCoordToRestore &&
        foundCurrentPositionCoord &&
        foundNewFormationCoord
      )
        dispatch(
          setTeam({
            ...team,
            inFieldPlayers: {
              ...team.inFieldPlayers,
              [foundCurrentPositionCoord]: foundCurrentPlayer,
              [foundNewFormationCoord]: foundNewPlayer,
              [foundPrevPositionCoordToRestore]: foundPrevPlayerToRestore,
            },
          })
        );
    } else if (foundNewFormationCoord && foundNewPlayer)
      // Handles the restoration of the previous subbed in player to the subbed pool and the change of the new subbed player
      dispatch(
        setTeam({
          inFieldPlayers: {
            ...team.inFieldPlayers,
            [foundNewFormationCoord]: foundNewPlayer,
          },
          players: orderPlayersByGroupAndPositionAndId(
            [...team.players.filter((p) => p.id !== foundNewPlayer.id)].concat(
              foundPrevPlayerToRestore || []
            )
          ),
        })
      );
  };

  const handleEventMinuteChanges = (
    newMinute: number,
    currentActivity: GameActivity,
    eventIndex: number
  ) => {
    const currentGameActivities = structuredClone(gameActivities);
    let indexesToUpdate = [eventIndex];

    // Checks to see if this is the second yellow card so it also auto adjusts the red cards time
    if (currentActivity.kind === eventTypes.yellow) {
      indexesToUpdate = addPairedRedCardForSecondYellowIndex({
        indexesToUpdate,
        gameActivities: pitchActivities,
        currentActivity,
      });
    }

    if (currentActivity.kind === eventTypes.goal) {
      // handles the case where it is updating a goal and its nested assist
      if (currentGameActivities[eventIndex].game_activities) {
        currentGameActivities[eventIndex] = {
          ...currentGameActivities[eventIndex],
          game_activities: [
            {
              ...currentGameActivities[eventIndex].game_activities[0],
              absolute_minute: newMinute,
              minute: newMinute - +currentPeriod?.absolute_duration_start,
            },
          ],
        };
      }

      const linkedOwnGoalActivitiesIndex = getLinkedActivitiesIndexesFromEvent(
        currentGameActivities,
        currentActivity,
        eventTypes.own_goal
      );
      const linkedAssistActivitiesIndex = getLinkedActivitiesIndexesFromEvent(
        currentGameActivities,
        currentActivity,
        eventTypes.assist
      );

      // there can be a linked assist or own goal marked for deletion even if there is a nested activity
      if (
        linkedOwnGoalActivitiesIndex.length ||
        linkedAssistActivitiesIndex.length
      ) {
        // handles the case where it is updating the goal and its linked assist / own_goal
        let pairedAssistIndexes = [];
        let pairedOwnGoalIndexes = [];
        if (linkedOwnGoalActivitiesIndex.length) {
          pairedOwnGoalIndexes = addPairedGoalActivityIndex({
            currentGameActivities,
            currentActivity,
            indexesToUpdate,
            eventType: eventTypes.own_goal,
          });
        }

        if (linkedAssistActivitiesIndex.length) {
          pairedAssistIndexes = addPairedGoalActivityIndex({
            currentGameActivities,
            currentActivity,
            indexesToUpdate,
            eventType: eventTypes.assist,
          });
        }

        indexesToUpdate = [
          ...new Set([...pairedOwnGoalIndexes, ...pairedAssistIndexes]),
        ];
      }
    }

    // handles the case where it is updating a switch or a substitute event and all their position/formation_view_changes
    const isPitchPositionSwapActivity = [
      eventTypes.switch,
      eventTypes.sub,
      eventTypes.formation_change,
    ].includes(currentActivity.kind);

    if (isPitchPositionSwapActivity && !currentActivity.game_activities) {
      // If the game_activity_id exists retrieve a list of indexes to combine
      indexesToUpdate = [
        ...indexesToUpdate,
        ...getMultiEventIndexesFromActivity(currentActivity),
      ];
    } else if (
      isPitchPositionSwapActivity &&
      currentActivity?.game_activities &&
      currentActivity.game_activities.length > 0
    ) {
      // If the id doesnt exist check the subtree game_activities array and update those accordingly
      const updatedNestedActivities = currentActivity.game_activities.map(
        (activity) => ({
          ...activity,
          absolute_minute: newMinute,
          minute: newMinute - +currentPeriod?.absolute_duration_start,
        })
      );
      currentGameActivities[eventIndex] = {
        ...currentGameActivities[eventIndex],
        game_activities: updatedNestedActivities,
      };
    }

    indexesToUpdate.forEach((index) => {
      currentGameActivities[index] = {
        ...currentGameActivities[index],
        absolute_minute: newMinute,
        minute: newMinute - +currentPeriod?.absolute_duration_start,
      };
    });

    dispatch(setUnsavedGameActivities(currentGameActivities));
  };

  const handleEventPlayerSwapDropdownChanges = (
    newPlayerId: number,
    currentActivity: GameActivity,
    eventIndex: number
  ) => {
    const currentGameActivities = structuredClone(gameActivities);
    // case where the player select dropdown is changed in the EventListActivity for subs/position_swaps
    const foundPositionCoord = Object.keys(team.inFieldPlayers).find(
      (inFieldPositionKey) =>
        team.inFieldPlayers[inFieldPositionKey].id === newPlayerId
    );

    const positionInfo = formationCoordinates[foundPositionCoord || ''] || null;

    const { updatedGameActivities, updatedFormationPositionChangeIndex } =
      updatePitchEventSwapActivities({
        gameActivities: currentGameActivities,
        currentActivity,
        positionData: positionInfo,
        athleteId: +newPlayerId,
        eventIndex,
      });

    dispatch(setUnsavedGameActivities(updatedGameActivities));
    updateNewPitchViewPositions({
      updatedGameActivities,
      eventIndex,
      currentActivity,
      updatedFormationPositionChangeIndex,
      athleteNumber: +newPlayerId,
      foundCurrentPositionCoord: foundPositionCoord,
    });
  };

  const handleGoalAssistDropdownChanges = ({
    newPlayerId,
    currentActivity,
    eventIndex,
  }: {
    newPlayerId: ?number,
    currentActivity: GameActivity,
    eventIndex: number,
  }) => {
    // case where it is the goal assist being changed
    const currentGameActivities = structuredClone(gameActivities);
    const linkedActivitiesIndex = getLinkedActivitiesIndexesFromEvent(
      currentGameActivities,
      currentActivity,
      eventTypes.assist
    );

    // Checks to see if a nested or a linked ID exists if it doesnt create a nested event
    if (
      linkedActivitiesIndex.length < 1 &&
      !currentGameActivities[eventIndex].game_activities
    ) {
      currentGameActivities[eventIndex] = {
        ...currentGameActivities[eventIndex],
        game_activities: [
          {
            athlete_id: newPlayerId,
            kind: eventTypes.assist,
            absolute_minute: currentActivity.absolute_minute,
            relation_id: null,
            minute: currentActivity.minute,
          },
        ],
      };
      // If the nested event exists update it here
    } else if (currentGameActivities[eventIndex].game_activities) {
      if (newPlayerId) {
        currentGameActivities[eventIndex] = {
          ...currentGameActivities[eventIndex],
          game_activities: [
            {
              ...currentGameActivities[eventIndex].game_activities[0],
              athlete_id: newPlayerId,
            },
          ],
        };
      }
      // If the assist is being removed, remove the nested activity
      else delete currentGameActivities[eventIndex].game_activities;

      // If the linked assist exists update it here
      // If the linked assist is being changed to a new player, update the linked activity
    } else if (newPlayerId) {
      // In case of an assist being linked but marked for deletion
      // Restore it by removing the delete flag
      delete currentGameActivities[linkedActivitiesIndex[0]].delete;

      currentGameActivities[linkedActivitiesIndex[0]] = {
        ...currentGameActivities[linkedActivitiesIndex[0]],
        athlete_id: newPlayerId,
      };
    }
    // If the linked assist is being changed to null (dropdown cleared), mark it for deletion
    else {
      currentGameActivities[linkedActivitiesIndex[0]] = {
        ...currentGameActivities[linkedActivitiesIndex[0]],
        athlete_id: newPlayerId,
        delete: true,
      };
    }

    dispatch(setUnsavedGameActivities(currentGameActivities));
  };

  const handleEventFormationChange = async (
    newFormationId: number,
    currentActivity: GameActivity,
    eventIndex: number
  ) => {
    const foundNewFormationInfo = props.formations?.find(
      (formation) => formation.id === newFormationId
    );
    if (foundNewFormationInfo) {
      const currentGameActivities = structuredClone(gameActivities);
      const updatedCoordinates = await getNextCoords(
        field.id,
        foundNewFormationInfo.id
      );

      const currentTeamSize = Object.values(team.inFieldPlayers).length;
      const newTeamCoords = Object.keys(updatedCoordinates).slice(
        0,
        currentTeamSize
      );

      const updatedInField = {};
      newTeamCoords.forEach((coord, index) => {
        // Extracting the infield players from the team in the correct precise order each time
        const currentPlayersInField = Object.keys(team.inFieldPlayers)
          .sort()
          .map((key) => team.inFieldPlayers[key]);
        updatedInField[coord] = currentPlayersInField[index];
      });

      dispatch(setFormationCoordinates(updatedCoordinates));
      dispatch(
        setTeam({ inFieldPlayers: updatedInField, players: team.players })
      );
      dispatch(
        setUnsavedGameActivities(
          updateFormationPlayerActivities({
            gameActivities: currentGameActivities,
            currentActivity,
            inFieldTeam: updatedInField,
            updatedCoordinates,
            eventIndex,
            foundNewFormation: foundNewFormationInfo,
            currentPeriod,
          })
        )
      );
    }
  };

  const handleEventReasonChange = (value: number, eventIndex: number) => {
    const currentGameActivities = structuredClone(gameActivities);
    currentGameActivities[eventIndex] = {
      ...currentGameActivities[eventIndex],
      relation: { id: value },
    };
    dispatch(setUnsavedGameActivities(currentGameActivities));
  };

  const handleEventValueChange = async (
    eventActivityIndex: number,
    eventValueChangeType: string,
    value: number
  ) => {
    const currentActivity = gameActivities[eventActivityIndex];
    // red card or yellow card disciplinary reason
    if (eventValueChangeType === eventListValueChangeTypes.reasonChange) {
      handleEventReasonChange(value, eventActivityIndex);
      // event minute change
    } else if (
      eventValueChangeType === eventListValueChangeTypes.absoluteMinuteChange
    ) {
      handleEventMinuteChanges(value, currentActivity, eventActivityIndex);
      // switch/sub player dropdown change
    } else if (
      eventValueChangeType === eventListValueChangeTypes.playerChange &&
      [eventTypes.sub, eventTypes.switch].includes(currentActivity.kind)
    ) {
      handleEventPlayerSwapDropdownChanges(
        value,
        currentActivity,
        eventActivityIndex
      );
      // mid game formation dropdown change
    } else if (
      eventValueChangeType === eventListValueChangeTypes.formationChange &&
      currentActivity.kind === eventTypes.formation_change
    ) {
      await handleEventFormationChange(
        value,
        currentActivity,
        eventActivityIndex
      );
      // goal assist player dropdown change
    } else {
      handleGoalAssistDropdownChanges({
        newPlayerId: value,
        currentActivity,
        eventIndex: eventActivityIndex,
      });
    }
  };

  const addPairedRedCardIndexForDeletion = (
    deletableEventIndexes: Array<number>,
    currentActivity: GameActivity
  ) => {
    const pairedRedCardIndex = getDoubleYellowRedCardIndexForDeletion(
      players,
      currentActivity,
      pitchActivities
    );

    if (pairedRedCardIndex || pairedRedCardIndex === 0)
      deletableEventIndexes.push(pairedRedCardIndex);
    return deletableEventIndexes;
  };

  const handleTeamClearAfterDeletion = async (
    currentActivity: GameActivity
  ) => {
    const isActivitySwitchOrSub = [eventTypes.switch, eventTypes.sub].includes(
      currentActivity.kind
    );

    if (isActivitySwitchOrSub) dispatch(setTeam(getClearedTeam(team)));

    const isMidGameFormationPresentInActivities = !!pitchActivities.find(
      (activity) => activity.kind === eventTypes.formation_change
    );
    // When deleting a formation (or sub/switch when a formation exists) revert the pitch to be the previous formation
    if (
      currentActivity.kind === eventTypes.formation_change ||
      isMidGameFormationPresentInActivities
    ) {
      const currentFormation = findFormationForPeriod(
        gameActivities,
        currentPeriod
      );

      if (currentFormation) {
        const updatedCoordinates = await getNextCoords(
          field.id,
          +currentFormation.relation?.id
        );
        dispatch(setFormationCoordinates(updatedCoordinates));
      }
      dispatch(setTeam(getClearedTeam(team)));
    }
  };

  const handleEventDeletion = async (eventIndex: number) => {
    let currentGameActivities = structuredClone(gameActivities);
    const currentActivity = currentGameActivities[eventIndex];

    let deletableEventIndexes = [eventIndex];

    // handles the double yellow/red card pairing deletion
    if (currentActivity.kind === eventTypes.yellow) {
      deletableEventIndexes = addPairedRedCardIndexForDeletion(
        deletableEventIndexes,
        currentActivity
      );
    }

    // handles goal related deletions (assist/own goal)
    if (currentActivity.kind === eventTypes.goal) {
      deletableEventIndexes = [
        ...addPairedGoalActivityIndex({
          currentGameActivities,
          currentActivity,
          indexesToUpdate: deletableEventIndexes,
          eventType: eventTypes.assist,
        }),
        ...addPairedGoalActivityIndex({
          currentGameActivities,
          currentActivity,
          indexesToUpdate: deletableEventIndexes,
          eventType: eventTypes.own_goal,
        }),
      ];
    }

    // handles the saved events related to the sub/position_swap/formation_change
    const isActivityPitchPositionSwapEvent = [
      eventTypes.switch,
      eventTypes.sub,
      eventTypes.formation_change,
    ].includes(currentActivity.kind);

    if (isActivityPitchPositionSwapEvent && !currentActivity.game_activities)
      deletableEventIndexes = [
        ...deletableEventIndexes,
        ...getMultiEventIndexesFromActivity(currentActivity),
      ];

    // handles the deletion of events by setting them to delete if they were previously saved to the backend so
    // the backend can cleanup/delete when save progress is hit
    if (currentActivity.id) {
      deletableEventIndexes.forEach((index) => {
        currentGameActivities[index] = {
          ...currentGameActivities[index],
          delete: true,
        };
      });
    } else {
      // if it is a local event then it is just filtered out and removed from the local memory
      currentGameActivities = currentGameActivities.filter(
        (_, i) => !deletableEventIndexes.includes(i)
      );
    }

    dispatch(setUnsavedGameActivities(currentGameActivities));

    await handleTeamClearAfterDeletion(currentActivity);
  };

  const resetEventList = async () => {
    dispatch(
      setUnsavedGameActivities(
        clearPeriodActivities({
          gameActivities,
          currentPeriod: props.currentPeriod,
          isEventListShown: true,
          isLastPeriodSelected,
        })
      )
    );

    const currentFormation = findFormationForPeriod(
      gameActivities,
      currentPeriod
    );

    if (currentFormation) {
      const updatedCoordinates = await getNextCoords(
        field.id,
        +currentFormation.relation?.id
      );
      dispatch(setFormationCoordinates(updatedCoordinates));
    }

    dispatch(setTeam(getClearedTeam(team)));
    updateActiveEventSelection('');
  };

  const getFormationOptions = () => {
    const formationsGroupedByGameFormat = groupFormationsByGameFormat(
      props.gameFormats,
      props.formations
    );
    const formationsForSelectedGameFormat = selectedGameFormat
      ? formationsGroupedByGameFormat?.[selectedGameFormat?.number_of_players]
      : [];

    return (
      formationsForSelectedGameFormat?.map((formation) => ({
        value: formation.id,
        label: formation.name,
      })) || []
    );
  };

  const createMidGameFormationChange = () => {
    let maxEventTime = getMaxMinForEventActivities(pitchActivities, null, true);

    const mostRecentFormationsInPeriod = findMostRecentFormationsForPeriod(
      gameActivities,
      currentPeriod
    );
    const lastFormationChangeActivity = mostRecentFormationsInPeriod[0];

    if (maxEventTime === lastFormationChangeActivity.absolute_minute)
      maxEventTime += 1;

    const eventStartTime =
      maxEventTime > +lastFormationChangeActivity.absolute_minute
        ? maxEventTime
        : +lastFormationChangeActivity.absolute_minute + 1;

    const newFormationChange = {
      kind: eventTypes.formation_change,
      absolute_minute: eventStartTime,
      relation: { id: null },
      game_activities: [],
    };

    dispatch(setUnsavedGameActivities([...gameActivities, newFormationChange]));
  };

  const handleOwnGoal = (eventIndex: number, markAsOwnGoal: boolean) => {
    const currentGameActivities = structuredClone(gameActivities);
    const currentActivity = gameActivities[eventIndex];

    const linkedAssistActivitiesIndex = getLinkedActivitiesIndexesFromEvent(
      currentGameActivities,
      currentActivity,
      eventTypes.assist
    );

    // If the own goal is marked
    if (markAsOwnGoal) {
      if (currentGameActivities[eventIndex]?.game_activities?.length) {
        // If the nested event (assist) exists remove it here
        delete currentGameActivities[eventIndex].game_activities;
      } else if (linkedAssistActivitiesIndex.length) {
        // If the linked event (assist) exists mark it for deletion here
        currentGameActivities[linkedAssistActivitiesIndex[0]] = {
          ...currentGameActivities[linkedAssistActivitiesIndex[0]],
          delete: true,
        };
      }
    }
    // If the own goal is unmarked
    // If the linked event exists (assist) restore it by removing the delete flag
    else if (linkedAssistActivitiesIndex.length) {
      delete currentGameActivities[linkedAssistActivitiesIndex[0]].delete;
    }

    const updatedGameActivities = updateGameActivitiesForOwnGoal({
      gameActivities: currentGameActivities,
      eventIndex,
      markAsOwnGoal,
    });

    dispatch(setUnsavedGameActivities(updatedGameActivities));
  };

  return (
    <EventList
      {...props}
      players={players}
      listType={eventListFormatTypes.pitch}
      eventTypeFilter={eventTypeFilter}
      setEventTypeFilter={setEventTypeFilter}
      eventTypeFilterOptions={eventTypeFilterOptions(
        eventListFormatTypes.pitch
      )}
      playerFilter={playerFilter}
      setPlayerFilter={setPlayerFilter}
      gameActivities={gameActivities}
      filteredActivities={filteredActivities}
      pitchActivities={pitchActivities}
      activeEventSelection={activeEventSelection}
      setActiveEventSelection={updateActiveEventSelection}
      playerFilterSelectOptions={getPlayerFilterOptions(
        players,
        pitchActivities
      )}
      handleCheckInvalidMinute={checkIfInvalidMinute}
      handleEventDeletion={handleEventDeletion}
      handleEventValueChange={handleEventValueChange}
      getPlayerSelectOptions={getPlayerSelectOptions}
      handleEventButtonSelection={(eventType) =>
        handleEventButtonSelection({
          activeEventSelection,
          setActiveEventSelection: updateActiveEventSelection,
          eventType,
          preventEvent: props.preventGameEvents,
          dispatchMandatoryFieldsToast: props.dispatchMandatoryCheck,
        })
      }
      resetEventList={resetEventList}
      createEventListFormationChange={createMidGameFormationChange}
      formationOptions={getFormationOptions()}
      reasonOptions={penaltyDisciplinaryReasons}
      staff={props.staff}
      handleClearAssist={(eventIndex) => {
        const currentActivity = gameActivities[eventIndex];
        handleGoalAssistDropdownChanges({
          newPlayerId: null,
          currentActivity,
          eventIndex,
        });
      }}
      handleOwnGoal={handleOwnGoal}
    />
  );
};

export default EventListPitchViewContainer;
