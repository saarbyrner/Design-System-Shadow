// @flow
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import structuredClone from 'core-js/stable/structured-clone';

import type { Option } from '@kitman/components/src/Select';
import type { EventAthlete, EventUser } from '@kitman/common/src/types/Event';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import { calculateTeamGoals } from '@kitman/modules/src/shared/MatchReport/src/utils/matchReportUtils';
import { useGetDisciplinaryReasonsQuery } from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/disciplinaryReasonsApi';
import type {
  GameActivity,
  GameScores,
  TeamsPlayers,
  GamePeriodStorage,
  GameActivityStorage,
  EventActivityTypes,
} from '@kitman/common/src/types/GameEvent';
import type { PitchViewInitialState } from '@kitman/common/src/types/PitchView';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import {
  getLinkedActivitiesIndexesFromEvent,
  doesOwnGoalExistForEvent,
  updateGameActivitiesForOwnGoal,
} from '@kitman/common/src/utils/planningEvent/gameActivityUtils';
import { clearPeriodActivities } from '@kitman/common/src/utils/planningEvent/gamePeriodUtils';
import { setUnsavedGameActivities } from '@kitman/modules/src/PlanningEvent/src/redux/slices/gameActivitiesSlice';
import { setActiveEventSelection } from '@kitman/modules/src/PlanningEvent/src/redux/slices/pitchViewSlice';

import { EventListTranslated as EventList } from '../EventList';
import {
  eventTypeFilterOptions,
  getDoubleYellowRedCardIndexForDeletion,
  getPlayerFilterOptions,
  handleEventButtonSelection,
  updateMatchReportEventSwapActivities,
  preparePenaltyReasonsOptions,
  addPairedRedCardForSecondYellowIndex,
  addPairedGoalActivityIndex,
} from '../eventListUtils';
import {
  eventListValueChangeTypes,
  eventListFormatTypes,
} from '../eventListConsts';

type Props = {
  isReadOnly?: boolean,
  players: TeamsPlayers,
  staff: Array<EventUser>,
  gameScores: GameScores,
  setFlagDisciplinaryIssue: (boolean) => void,
  setGameScores: (GameScores) => void,
};

const EventListMatchReportContainer = (props: Props) => {
  const dispatch = useDispatch();

  const { isLeague } = useLeagueOperations();

  const { localGameActivities: gameActivities } =
    useSelector<GameActivityStorage>(
      (state) => state.planningEvent.gameActivities
    );

  const { apiEventPeriods: eventPeriods } = useSelector<GamePeriodStorage>(
    (state) => state.planningEvent.eventPeriods
  );
  const matchPeriod = eventPeriods[0];

  const { pitchActivities: matchReportActivities, activeEventSelection } =
    useSelector<PitchViewInitialState>(
      (state) => state.planningEvent.pitchView
    );

  const [eventTypeFilter, setEventTypeFilter] = useState<?Option>(null);
  const [playerFilter, setPlayerFilter] = useState<?Option>(null);
  const [filteredActivities, setFilteredActivities] = useState<
    Array<GameActivity>
  >([]);

  const allPlayers = [
    ...props.players.homePlayers,
    ...props.players.awayPlayers,
  ];
  const allPlayersAndStaff = [...allPlayers, ...props.staff];

  const handleActiveEventSelectionUpdate = (eventType: EventActivityTypes) =>
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
    let currentActivities = structuredClone(matchReportActivities);
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
        (activity) =>
          activity.athlete_id === playerFilter ||
          activity.user_id === playerFilter
      );
    }
    setFilteredActivities(currentActivities);
  }, [eventTypeFilter, playerFilter, matchReportActivities, gameActivities]);

  const getSubstitutionPlayers = (activity: GameActivity) =>
    props.players.homePlayers.find(
      (athlete) => athlete.id === activity.athlete_id
    )
      ? props.players.homePlayers
      : props.players.awayPlayers;

  const getPlayerSelectOptions = (
    activity: GameActivity,
    selectedPlayer: ?EventAthlete
  ) => {
    if (eventTypes.sub === activity.kind) {
      return getSubstitutionPlayers(activity)
        .filter((player: EventAthlete) => player?.id !== selectedPlayer?.id)
        .map((player: EventAthlete) => ({
          label: player?.fullname,
          value: player?.id,
        }));
    }

    return [];
  };

  const checkIfInvalidMinute = (minute: number) => {
    const isInvalidMinuteInPeriod =
      minute < +matchPeriod.absolute_duration_start ||
      minute > +matchPeriod.absolute_duration_end;

    return isInvalidMinuteInPeriod;
  };

  const handleEventPlayerSwapDropdownChanges = (
    newPlayerId: number,
    currentActivity: GameActivity,
    eventIndex: number
  ) => {
    const currentGameActivities = structuredClone(gameActivities);
    // case where the player select dropdown is changed in the EventListActivity for subs/position_swaps
    const foundAthlete = allPlayers.find(
      (player) => player.id === +newPlayerId
    );

    if (foundAthlete) {
      const updatedGameActivities = updateMatchReportEventSwapActivities({
        gameActivities: currentGameActivities,
        currentActivity,
        swappedAthlete: foundAthlete,
        eventIndex,
      });

      dispatch(setUnsavedGameActivities(updatedGameActivities));
    }
  };

  const handleEventMinuteChanges = ({
    newMinute,
    currentActivity,
    eventActivityIndex,
    type,
  }: {
    newMinute: number,
    currentActivity: GameActivity,
    eventActivityIndex: number,
    type: string,
  }) => {
    const currentGameActivities = structuredClone(gameActivities);
    let indexesToUpdate = [eventActivityIndex];

    const updateMinuteChanges = (activityToUpdate: GameActivity) => ({
      ...activityToUpdate,
      absolute_minute:
        type === eventListValueChangeTypes.absoluteMinuteChange
          ? newMinute
          : activityToUpdate.absolute_minute,
      minute:
        type === eventListValueChangeTypes.absoluteMinuteChange
          ? newMinute
          : activityToUpdate.minute,
      additional_minute:
        type === eventListValueChangeTypes.additionalMinuteChange
          ? newMinute
          : activityToUpdate.additional_minute,
    });

    // Checks to see if this is the second yellow card so it also auto adjusts the red cards time
    if (currentActivity.kind === eventTypes.yellow) {
      indexesToUpdate = addPairedRedCardForSecondYellowIndex({
        indexesToUpdate,
        gameActivities: matchReportActivities,
        currentActivity,
      });
    }

    if (currentActivity.kind === eventTypes.goal) {
      // Update nested activities if present
      if (currentActivity?.game_activities?.length) {
        const updatedNestedActivities = currentActivity.game_activities?.map(
          (activity) => updateMinuteChanges(activity)
        );
        currentGameActivities[eventActivityIndex] = {
          ...currentGameActivities[eventActivityIndex],
          game_activities: updatedNestedActivities,
        };
      }
      // Update linked own_goal activities if present
      else {
        indexesToUpdate = addPairedGoalActivityIndex({
          currentGameActivities,
          currentActivity,
          indexesToUpdate,
          eventType: eventTypes.own_goal,
        });
      }
    }

    if (
      eventTypes.sub === currentActivity.kind &&
      !currentActivity.game_activities
    ) {
      // If the game_activity_id exists retrieve a list of indexes to combine
      indexesToUpdate = [
        ...indexesToUpdate,
        ...getLinkedActivitiesIndexesFromEvent(
          currentGameActivities,
          currentActivity,
          eventTypes.position_change
        ),
      ];
    } else if (
      eventTypes.sub === currentActivity.kind &&
      currentActivity?.game_activities &&
      currentActivity.game_activities.length > 0
    ) {
      // If the id doesnt exist check the subtree game_activities array and update those accordingly
      const updatedNestedActivities = currentActivity.game_activities.map(
        (activity) => updateMinuteChanges(activity)
      );
      currentGameActivities[eventActivityIndex] = {
        ...currentGameActivities[eventActivityIndex],
        game_activities: updatedNestedActivities,
      };
    }

    indexesToUpdate.forEach((index) => {
      currentGameActivities[index] = updateMinuteChanges(
        currentGameActivities[index]
      );
    });

    dispatch(setUnsavedGameActivities(currentGameActivities));
  };

  const handleEventReasonChange = (value: number, eventIndex: number) => {
    const currentGameActivities = structuredClone(gameActivities);
    currentGameActivities[eventIndex] = {
      ...currentGameActivities[eventIndex],
      relation: { id: value },
    };
    dispatch(setUnsavedGameActivities(currentGameActivities));
  };

  const handleEventValueChange = (
    eventActivityIndex: number,
    eventValueChangeType: string,
    value: number
  ) => {
    const currentActivity = gameActivities[eventActivityIndex];

    if (
      eventValueChangeType === eventListValueChangeTypes.playerChange &&
      eventTypes.sub === currentActivity.kind
    ) {
      handleEventPlayerSwapDropdownChanges(
        +value,
        currentActivity,
        eventActivityIndex
      );
    } else if (
      eventValueChangeType === eventListValueChangeTypes.reasonChange
    ) {
      handleEventReasonChange(+value, eventActivityIndex);
    } else {
      handleEventMinuteChanges({
        newMinute: value,
        currentActivity,
        eventActivityIndex,
        type: eventValueChangeType,
      });
    }
  };

  const handleGoalScoreDeduction = (currentActivity: GameActivity) => {
    const { teamScore: homeTeamScore, teamOwnGoalScore: homeTeamOwnGoalScore } =
      calculateTeamGoals(props.players.homePlayers, gameActivities);
    const { teamScore: awayTeamScore, teamOwnGoalScore: awayTeamOwnGoalScore } =
      calculateTeamGoals(props.players.awayPlayers, gameActivities);

    const markedAsOwnGoal = doesOwnGoalExistForEvent(
      gameActivities,
      currentActivity
    );

    const isHomeTeamGoal =
      props.players.homePlayers.find(
        (player) => player.id === currentActivity.athlete_id
      ) && !markedAsOwnGoal;
    const isAwayTeamOwnGoal =
      props.players.awayPlayers.find(
        (player) => player.id === currentActivity.athlete_id
      ) && markedAsOwnGoal;

    if (isHomeTeamGoal || isAwayTeamOwnGoal) {
      props.setGameScores({
        ...props.gameScores,
        orgScore: homeTeamScore + awayTeamOwnGoalScore - 1,
      });
    } else {
      props.setGameScores({
        ...props.gameScores,
        opponentScore: awayTeamScore + homeTeamOwnGoalScore - 1,
      });
    }
  };

  const handleEventDeletion = (eventIndex: number) => {
    let currentGameActivities = structuredClone(gameActivities);
    const currentActivity = currentGameActivities[eventIndex];
    let deletableEventIndexes = [eventIndex];

    const getOtherRedCards = (currentIndex) =>
      currentGameActivities.filter(
        (activity, index) =>
          activity.kind === eventTypes.red &&
          index !== currentIndex &&
          !activity.delete
      );

    // handles the double yellow/red card pairing deletion
    if (currentActivity.kind === eventTypes.yellow) {
      const pairedRedCardIndex = getDoubleYellowRedCardIndexForDeletion(
        allPlayersAndStaff,
        currentActivity,
        matchReportActivities
      );
      if (pairedRedCardIndex !== null) {
        deletableEventIndexes.push(pairedRedCardIndex);
        const otherRedCards = getOtherRedCards(pairedRedCardIndex);
        if (!otherRedCards.length) props.setFlagDisciplinaryIssue(false);
      }
    }

    if (currentActivity.kind === eventTypes.red) {
      const otherRedCards = getOtherRedCards(eventIndex);
      if (!otherRedCards.length) props.setFlagDisciplinaryIssue(false);
    }

    // handles the goal deletion
    if (currentActivity.kind === eventTypes.goal) {
      deletableEventIndexes = deletableEventIndexes.filter(
        (index) => index !== undefined
      );
      deletableEventIndexes = addPairedGoalActivityIndex({
        currentGameActivities,
        currentActivity,
        // $FlowFixMe deletableEventIndexes is already filtered above
        indexesToUpdate: deletableEventIndexes,
        eventType: eventTypes.own_goal,
      });
    }

    if (
      eventTypes.sub === currentActivity.kind &&
      !currentActivity.game_activities
    )
      deletableEventIndexes = [
        ...deletableEventIndexes,
        ...getLinkedActivitiesIndexesFromEvent(
          currentGameActivities,
          currentActivity,
          eventTypes.position_change
        ),
      ];

    if (currentActivity.id) {
      deletableEventIndexes
        .filter((index) => index !== undefined)
        .forEach((index) => {
          currentGameActivities[+index] = {
            ...currentGameActivities[+index],
            delete: true,
          };
        });
    } else {
      currentGameActivities = currentGameActivities.filter(
        (_, i) => !deletableEventIndexes.includes(i)
      );
    }
    dispatch(setUnsavedGameActivities(currentGameActivities));

    // Subtracts off the scoreline if a player's goal is removed
    if (currentActivity.kind === eventTypes.goal) {
      handleGoalScoreDeduction(currentActivity);
    }
  };

  const resetEventList = () => {
    const foundRedCard = gameActivities.find(
      (activity) => activity.kind === eventTypes.red && !activity.delete
    );
    if (foundRedCard) {
      props.setFlagDisciplinaryIssue(false);
    }

    dispatch(
      setUnsavedGameActivities(
        clearPeriodActivities({
          gameActivities,
          currentPeriod: matchPeriod,
          isEventListShown: true,
          isLastPeriodSelected: true,
        })
      )
    );
    handleActiveEventSelectionUpdate('');
    props.setGameScores({
      orgScore: 0,
      opponentScore: 0,
    });
  };

  const handleOwnGoal = (eventIndex: number, markAsOwnGoal: boolean) => {
    const currentGameActivities = structuredClone(gameActivities);
    const updatedGameActivities = updateGameActivitiesForOwnGoal({
      gameActivities: currentGameActivities,
      eventIndex,
      markAsOwnGoal,
    });
    dispatch(setUnsavedGameActivities(updatedGameActivities));

    // Calculate and update scores after own goal add/delete
    const { teamScore: homeTeamScore, teamOwnGoalScore: homeTeamOwnGoalScore } =
      calculateTeamGoals(props.players.homePlayers, updatedGameActivities);
    const { teamScore: awayTeamScore, teamOwnGoalScore: awayTeamOwnGoalScore } =
      calculateTeamGoals(props.players.awayPlayers, updatedGameActivities);

    props.setGameScores({
      orgScore: homeTeamScore + awayTeamOwnGoalScore,
      opponentScore: awayTeamScore + homeTeamOwnGoalScore,
    });
  };

  return (
    <EventList
      isReadOnly={props.isReadOnly}
      gameActivities={gameActivities}
      staff={props.staff}
      activeEventSelection={activeEventSelection}
      players={allPlayersAndStaff}
      hideFilters={!isLeague}
      listType={eventListFormatTypes.match}
      eventTypeFilter={eventTypeFilter}
      setEventTypeFilter={setEventTypeFilter}
      eventTypeFilterOptions={eventTypeFilterOptions(
        eventListFormatTypes.match
      )}
      playerFilter={playerFilter}
      setPlayerFilter={setPlayerFilter}
      filteredActivities={filteredActivities}
      pitchActivities={matchReportActivities}
      playerFilterSelectOptions={getPlayerFilterOptions(
        allPlayersAndStaff,
        matchReportActivities
      )}
      setActiveEventSelection={handleActiveEventSelectionUpdate}
      handleEventDeletion={handleEventDeletion}
      handleEventValueChange={handleEventValueChange}
      handleEventButtonSelection={(eventType) =>
        handleEventButtonSelection({
          activeEventSelection,
          setActiveEventSelection: handleActiveEventSelectionUpdate,
          eventType,
        })
      }
      handleCheckInvalidMinute={checkIfInvalidMinute}
      getPlayerSelectOptions={getPlayerSelectOptions}
      reasonOptions={penaltyDisciplinaryReasons}
      resetEventList={resetEventList}
      handleOwnGoal={handleOwnGoal}
    />
  );
};

export default EventListMatchReportContainer;
