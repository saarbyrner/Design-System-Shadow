// @flow
import structuredClone from 'core-js/stable/structured-clone';
import type { Option } from '@kitman/components/src/Select';
import _isEqual from 'lodash/isEqual';
import type {
  EventAthlete,
  EventUser,
  Athlete,
} from '@kitman/common/src/types/Event';
import type {
  GameActivity,
  GameActivityKind,
  ActivityDisciplinaryReason,
  DisciplinaryReasonOptions,
} from '@kitman/common/src/types/GameEvent';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import {
  getEventPositionActivitiesIndexes,
  getLinkedActivitiesIndexesFromEvent,
  getRedCard,
  getRedCardForSecondYellow,
  getYellowCards,
} from '@kitman/common/src/utils/planningEvent/gameActivityUtils';
import type { PositionData } from '@kitman/common/src/types/PitchView';

import { eventListFormatTypes } from './eventListConsts';

export const eventTypeFilterOptions = (type: string) => [
  {
    label: 'Substitute',
    value: eventTypes.sub,
  },
  {
    label: 'Goal',
    value: eventTypes.goal,
  },
  // Temporary check until league-ops-game-events-own-goal FF is removed
  ...((type === eventListFormatTypes.pitch &&
    window.getFlag('league-ops-game-events-own-goal')) ||
  (type === eventListFormatTypes.match &&
    window.getFlag('league-ops-match-report-v2'))
    ? [
        {
          label: 'Own Goal',
          value: eventTypes.own_goal,
        },
      ]
    : []),
  ...(type === eventListFormatTypes.pitch
    ? [
        {
          label: 'Swap',
          value: eventTypes.switch,
        },
      ]
    : []),
  {
    label: 'Yellow Card',
    value: eventTypes.yellow,
  },
  {
    label: 'Red Card',
    value: eventTypes.red,
  },
  {
    label: 'Formation Change',
    value: eventTypes.formation_change,
  },
];

export const handleEventButtonSelection = ({
  activeEventSelection,
  setActiveEventSelection,
  eventType,
  preventEvent,
  dispatchMandatoryFieldsToast,
}: {
  activeEventSelection: string,
  setActiveEventSelection: (string) => void,
  eventType: string,
  preventEvent?: boolean,
  dispatchMandatoryFieldsToast?: () => void,
}) => {
  if (preventEvent && dispatchMandatoryFieldsToast) {
    dispatchMandatoryFieldsToast();
  } else if (activeEventSelection === eventType) setActiveEventSelection('');
  else setActiveEventSelection(eventType);
};

export const getPlayerFilterOptions = (
  players: Array<$Shape<EventAthlete & EventUser & Athlete>>,
  gameActivities: Array<GameActivity>
): Array<Option> => {
  const foundPlayers = players.filter((player) =>
    gameActivities.some((activity) =>
      activity.athlete_id
        ? activity.athlete_id === player?.id
        : activity.user_id === player?.user?.id
    )
  );
  return foundPlayers.map((player) => ({
    label: player.user ? player.user.fullname : player.fullname,
    value: player.user ? player.user.id : player.id,
  }));
};

export const getDoubleYellowRedCardIndexForDeletion = (
  players: Array<$Shape<EventAthlete & EventUser & Athlete>>,
  currentActivity: GameActivity,
  gameActivities: Array<GameActivity>
) => {
  const playerForActivity = players.find((player) =>
    currentActivity.athlete_id
      ? currentActivity.athlete_id === player.id
      : currentActivity.user_id === player?.user?.id
  );
  const playerForActivityId = playerForActivity?.user
    ? +playerForActivity?.user?.id
    : +playerForActivity?.id;

  const yellowCards = getYellowCards(gameActivities, playerForActivityId);
  const foundRedCard = getRedCard(gameActivities, playerForActivityId);

  if (yellowCards.length === 2 && foundRedCard)
    return foundRedCard?.activityIndex;

  return null;
};

export const preparePenaltyReasonsOptions = (
  apiReasons: Array<ActivityDisciplinaryReason>
): DisciplinaryReasonOptions => {
  const createReasonOptions = (
    reasonOptions: Array<ActivityDisciplinaryReason>,
    penaltyType: string
  ) =>
    reasonOptions
      .filter((reason) => reason.penalty_card === penaltyType)
      .map((reason) => ({ label: reason.description, value: reason.id }));

  const yellowCardPenalties = createReasonOptions(
    apiReasons,
    eventTypes.yellow
  );
  const redCardPenalties = createReasonOptions(apiReasons, eventTypes.red);

  return {
    yellow_options: yellowCardPenalties,
    red_options: redCardPenalties,
  };
};

export const updateMatchReportEventSwapActivities = ({
  gameActivities,
  currentActivity,
  swappedAthlete,
  eventIndex,
}: {
  gameActivities: Array<GameActivity>,
  currentActivity: GameActivity,
  swappedAthlete: EventAthlete,
  eventIndex: number,
}) => {
  const currentGameActivities = structuredClone(gameActivities);

  if (!currentActivity.game_activities) {
    const athletePositionChangeIndexes = getEventPositionActivitiesIndexes(
      currentGameActivities,
      currentActivity.id,
      eventTypes.position_change
    );

    // Updates the position_change position id for the primary athlete the switch/sub event relates to
    currentGameActivities[athletePositionChangeIndexes[0]] = {
      ...currentGameActivities[athletePositionChangeIndexes[0]],
      relation: {
        id: swappedAthlete.position.id,
      },
    };
    // Updates the position_change athlete id for the swapped athlete the switch/sub event relates to
    currentGameActivities[athletePositionChangeIndexes[1]] = {
      ...currentGameActivities[athletePositionChangeIndexes[1]],
      athlete_id: swappedAthlete.id,
    };
  } else if (currentGameActivities[eventIndex].game_activities) {
    currentGameActivities[eventIndex] = {
      ...currentGameActivities[eventIndex],
      game_activities: [
        {
          ...currentGameActivities[eventIndex].game_activities[0],
          relation: {
            id: swappedAthlete.position.id,
          },
        },
        {
          ...currentGameActivities[eventIndex].game_activities[1],
          athlete_id: swappedAthlete.id,
        },
      ],
    };
  }

  // updates the swap/sub event with the respective changed information
  currentGameActivities[eventIndex] = {
    ...currentGameActivities[eventIndex],
    relation: { id: swappedAthlete.id },
  };

  return currentGameActivities;
};

const updateLinkedGameActivitiesForPositionSwaps = ({
  gameActivities,
  currentActivity,
  athleteId,
  positionData,
}: {
  gameActivities: Array<GameActivity>,
  currentActivity: GameActivity,
  athleteId: number,
  positionData: ?PositionData,
}) => {
  const currentGameActivities = structuredClone(gameActivities);

  let currentFormationPositionChangeIndex = 0;

  const athletePositionChangeIndexes = getEventPositionActivitiesIndexes(
    currentGameActivities,
    currentActivity.id,
    eventTypes.position_change
  );
  const athleteFormationPositionChangeIndexes =
    getEventPositionActivitiesIndexes(
      currentGameActivities,
      currentActivity.id,
      eventTypes.formation_position_view_change
    );

  // handles the case where it is a substitute to an empty position
  if (athleteFormationPositionChangeIndexes.length === 1) {
    currentGameActivities[athletePositionChangeIndexes[0]] = {
      ...currentGameActivities[athletePositionChangeIndexes[0]],
      athlete_id: athleteId,
    };
    currentGameActivities[athleteFormationPositionChangeIndexes[0]] = {
      ...currentGameActivities[athleteFormationPositionChangeIndexes[0]],
      athlete_id: athleteId,
    };
    currentFormationPositionChangeIndex =
      athleteFormationPositionChangeIndexes[0];
  } else {
    // Updates the position_change position id for the primary athlete the switch/sub event relates to
    currentGameActivities[athletePositionChangeIndexes[0]] = {
      ...currentGameActivities[athletePositionChangeIndexes[0]],
      relation: {
        id: positionData ? positionData.position.id : null,
      },
    };

    // Updates the position_change athlete id for the swapped athlete the switch/sub event relates to
    currentGameActivities[athletePositionChangeIndexes[1]] = {
      ...currentGameActivities[athletePositionChangeIndexes[1]],
      athlete_id: athleteId,
    };

    // Updates the formation_position_view_change position id for the primary athlete the switch/sub event relates to
    currentGameActivities[athleteFormationPositionChangeIndexes[0]] = {
      ...currentGameActivities[athleteFormationPositionChangeIndexes[0]],
      relation: { id: positionData ? positionData.id : null },
    };

    // Updates the formation_position_view_change athlete id for the swapped athlete the switch/sub event relates to
    currentGameActivities[athleteFormationPositionChangeIndexes[1]] = {
      ...currentGameActivities[athleteFormationPositionChangeIndexes[1]],
      athlete_id: athleteId,
    };
    currentFormationPositionChangeIndex =
      athleteFormationPositionChangeIndexes[1];
  }

  return {
    updatedGameActivities: currentGameActivities,
    currentFormationPositionChangeIndex,
  };
};

const updateNestedGameActivitiesForPositionSwaps = ({
  gameActivities,
  positionData,
  athleteId,
  eventIndex,
}: {
  gameActivities: Array<GameActivity>,
  positionData: ?PositionData,
  athleteId: number,
  eventIndex: number,
}) => {
  const currentGameActivities = structuredClone(gameActivities);
  if (currentGameActivities[eventIndex].game_activities.length > 2) {
    currentGameActivities[eventIndex] = {
      ...currentGameActivities[eventIndex],
      game_activities: [
        {
          ...currentGameActivities[eventIndex].game_activities[0],
          relation: {
            id: positionData ? positionData.position.id : null,
          },
        },
        {
          ...currentGameActivities[eventIndex].game_activities[1],
          athlete_id: athleteId,
        },
        {
          ...currentGameActivities[eventIndex].game_activities[2],
          relation: { id: positionData ? positionData.id : null },
        },
        {
          ...currentGameActivities[eventIndex].game_activities[3],
          athlete_id: athleteId,
        },
      ],
    };
  } else {
    currentGameActivities[eventIndex] = {
      ...currentGameActivities[eventIndex],
      game_activities: [
        {
          ...currentGameActivities[eventIndex].game_activities[0],
          athlete_id: athleteId,
        },
        {
          ...currentGameActivities[eventIndex].game_activities[1],
          athlete_id: athleteId,
        },
      ],
    };
  }
  return currentGameActivities;
};

// Util that handles updating the related position_change and formation_position_view_change for a switch/sub event.
export const updatePitchEventSwapActivities = ({
  gameActivities,
  currentActivity,
  positionData,
  athleteId,
  eventIndex,
}: {
  gameActivities: Array<GameActivity>,
  currentActivity: GameActivity,
  positionData: ?PositionData,
  athleteId: number,
  eventIndex: number,
}) => {
  let currentGameActivities = structuredClone(gameActivities);
  let updatedFormationPositionChangeIndex = 0;

  if (!currentActivity.game_activities) {
    const { updatedGameActivities, currentFormationPositionChangeIndex } =
      updateLinkedGameActivitiesForPositionSwaps({
        gameActivities: currentGameActivities,
        currentActivity,
        athleteId,
        positionData,
      });
    currentGameActivities = updatedGameActivities;
    updatedFormationPositionChangeIndex = currentFormationPositionChangeIndex;
  } else if (currentGameActivities[eventIndex].game_activities) {
    currentGameActivities = updateNestedGameActivitiesForPositionSwaps({
      gameActivities: currentGameActivities,
      positionData,
      athleteId,
      eventIndex,
    });
  }

  // updates the swap/sub event with the respective changed information
  currentGameActivities[eventIndex] = {
    ...currentGameActivities[eventIndex],
    relation: { id: athleteId },
  };

  return {
    updatedGameActivities: currentGameActivities,
    updatedFormationPositionChangeIndex,
  };
};

export const checkIfYellowCardTimeIsValid = ({
  pitchActivities,
  eventPlayerId,
  event,
  eventMinute,
}: {
  pitchActivities: Array<GameActivity>,
  eventPlayerId: number,
  event: GameActivity,
  eventMinute: number,
}) => {
  const playerYellowCardEvents = getYellowCards(pitchActivities, eventPlayerId);
  let IsYellowCardTime = false;

  if (
    //  $FlowIgnore[invalid-compare] this is typed.
    event?.activityIndex < playerYellowCardEvents[0]?.activityIndex &&
    playerYellowCardEvents.length > 1 &&
    _isEqual(event, playerYellowCardEvents[1])
  ) {
    IsYellowCardTime =
      eventMinute > Number(playerYellowCardEvents[0]?.absolute_minute);
  }

  if (
    // $FlowIgnore[invalid-compare] this is typed.
    event?.activityIndex > playerYellowCardEvents[1]?.activityIndex &&
    playerYellowCardEvents.length > 1 &&
    _isEqual(event, playerYellowCardEvents[0])
  ) {
    IsYellowCardTime =
      eventMinute < Number(playerYellowCardEvents[1]?.absolute_minute);
  }

  return IsYellowCardTime;
};

export const addPairedRedCardForSecondYellowIndex = ({
  indexesToUpdate,
  gameActivities,
  currentActivity,
}: {
  indexesToUpdate: Array<number>,
  gameActivities: Array<GameActivity>,
  currentActivity: GameActivity,
}): Array<number> => {
  const activityPlayerOrStaffId = currentActivity.athlete_id
    ? +currentActivity.athlete_id
    : +currentActivity.user_id;
  const foundRedCard = getRedCardForSecondYellow(
    gameActivities,
    activityPlayerOrStaffId,
    currentActivity.absolute_minute
  );

  if (foundRedCard?.activityIndex)
    indexesToUpdate.push(foundRedCard.activityIndex);

  return indexesToUpdate;
};

export const addPairedGoalActivityIndex = ({
  currentGameActivities,
  currentActivity,
  indexesToUpdate,
  eventType,
}: {
  currentGameActivities: Array<GameActivity>,
  currentActivity: GameActivity,
  indexesToUpdate: Array<number>,
  eventType: GameActivityKind,
}) => {
  const linkedActivitiesIndex = getLinkedActivitiesIndexesFromEvent(
    currentGameActivities,
    currentActivity,
    eventType
  );
  if (linkedActivitiesIndex.length > 0)
    indexesToUpdate.push(linkedActivitiesIndex[0]);

  return indexesToUpdate;
};
