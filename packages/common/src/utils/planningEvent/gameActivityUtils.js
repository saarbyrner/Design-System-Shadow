// @flow
import structuredClone from 'core-js/stable/structured-clone';
import getFormationPositionsCoordinates from '@kitman/services/src/services/planning/getFormationPositionsCoordinates';
import type {
  GameActivity,
  GamePeriod,
  GameActivityKind,
} from '@kitman/common/src/types/GameEvent';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import type { Athlete } from '@kitman/common/src/types/Event';
import type {
  FormationCoordinates,
  InFieldPlayers,
  PlayerWithPosition,
  PositionData,
  Team,
} from '@kitman/common/src/types/PitchView';
import { getMaxMinForEventActivities } from '@kitman/modules/src/PlanningEvent/src/components/GameEventsTab/utils';
import type { EnrichedLineUpTemplate } from '@kitman/modules/src/PlanningEvent/src/services/lineUpTemplate';
import type { GameActivityForm } from '@kitman/modules/src/PlanningEvent/src/services/gameActivities';
import type { Formation } from '@kitman/modules/src/PlanningEvent/src/services/formations';

export const checkIfPlayersHaveActivity = (
  gameActivities: Array<GameActivity>,
  players: Array<string>
): ?GameActivity =>
  gameActivities.find(
    (activity) =>
      activity.athlete_id && players.includes(activity.athlete_id.toString())
  );

export const findFormationForPeriod = (
  gameActivities: Array<GameActivity>,
  currentPeriod: ?GamePeriod
): ?GameActivity =>
  gameActivities.find(
    (activity) =>
      activity.kind === eventTypes.formation_change &&
      +activity.absolute_minute === currentPeriod?.absolute_duration_start
  );

export const findIndexOfFormationForPeriod = (
  gameActivities: Array<GameActivity>,
  currentPeriod: GamePeriod
): number =>
  gameActivities.findIndex(
    (activity) =>
      activity.kind === eventTypes.formation_change &&
      +activity.absolute_minute === currentPeriod?.absolute_duration_start
  );

export const findPeriodPlayerPitchChangeActivities = (
  gameActivities: Array<GameActivity>,
  currentPeriod: ?GamePeriod
): Array<GameActivity> =>
  gameActivities.filter(
    (activity) =>
      activity.kind === eventTypes.formation_position_view_change &&
      +activity.absolute_minute === currentPeriod?.absolute_duration_start &&
      !activity.delete &&
      !activity.game_activity_id
  );

export const findPeriodFormationCompleteActivity = (
  gameActivities: Array<GameActivity>,
  currentPeriod: ?GamePeriod
): ?GameActivity =>
  gameActivities.find(
    (activity) =>
      activity.kind === eventTypes.formation_complete &&
      +activity.absolute_minute === currentPeriod?.absolute_duration_start &&
      !activity.delete
  );

export const findPeriodPlayerPitchChangeActivityForAthlete = (
  gameActivities: Array<GameActivity>,
  athleteId: number,
  currentPeriod: GamePeriod | null
): Object =>
  gameActivities.find(
    (activity) =>
      activity.kind === eventTypes.formation_position_view_change &&
      activity.athlete_id === athleteId &&
      +activity.absolute_minute === +currentPeriod?.absolute_duration_start &&
      !activity.delete
  );

export const findPeriodPositionChangeActivityForAthlete = (
  gameActivities: Array<GameActivity>,
  athleteId: number,
  currentPeriod: GamePeriod | null
): Object =>
  gameActivities.find(
    (activity) =>
      activity.kind === eventTypes.position_change &&
      activity.athlete_id === athleteId &&
      +activity.absolute_minute === +currentPeriod?.absolute_duration_start &&
      !activity.delete
  );

export const findActivityForThePosition = ({
  gameActivities,
  positionId,
  currentPeriodMinute,
  positionType,
}: {
  gameActivities: Array<GameActivity>,
  positionId: number,
  currentPeriodMinute: number,
  positionType: string,
}): ?GameActivity =>
  gameActivities.find(
    (activity) =>
      activity.kind === positionType &&
      +activity.absolute_minute === currentPeriodMinute &&
      positionId === activity.relation?.id &&
      !activity.delete
  );

export const checkIfActivityExistsWithinPeriod = ({
  activity,
  currentPeriod,
  includeDeletes,
  isLastPeriodSelected,
}: {
  activity: GameActivity,
  currentPeriod: ?GamePeriod,
  includeDeletes?: boolean,
  isLastPeriodSelected?: boolean,
}): boolean => {
  const activityMin = +activity.absolute_minute;
  const checkIsMinBeforePeriodEndTime = isLastPeriodSelected
    ? activityMin <= +currentPeriod?.absolute_duration_end
    : activityMin < +currentPeriod?.absolute_duration_end;

  const inPeriodTimeRange =
    activityMin >= +currentPeriod?.absolute_duration_start &&
    checkIsMinBeforePeriodEndTime;

  if (includeDeletes) return inPeriodTimeRange;
  return inPeriodTimeRange && !activity.delete;
};

export const getMostRecentFormation = (
  gameActivities: Array<GameActivity>,
  currentPeriod: ?GamePeriod
): ?GameActivity =>
  [...gameActivities]
    .sort((a, b) => +b.absolute_minute - +a.absolute_minute)
    .find(
      (activity) =>
        activity.kind === eventTypes.formation_change &&
        checkIfActivityExistsWithinPeriod({ activity, currentPeriod }) &&
        !activity.delete
    );

export const findMostRecentFormationsForPeriod = (
  gameActivities: Array<Object>,
  currentPeriod: ?GamePeriod
): Array<GameActivity> =>
  gameActivities
    .filter(
      (activity) =>
        activity.kind === eventTypes.formation_change &&
        checkIfActivityExistsWithinPeriod({ activity, currentPeriod }) &&
        !activity.delete
    )
    .sort((a, b) => +b.absolute_minute - +a.absolute_minute);

export const getCaptainForTeamActivity = (
  gameActivities: Array<GameActivity>
) =>
  gameActivities.find(
    (activity) => activity.kind === eventTypes.captain_assigned
  );

export const getYellowCards = (
  pitchActivities: Array<GameActivity>,
  playerId: ?number
): Array<GameActivity> =>
  pitchActivities.filter((activity) => {
    const activityPlayerId = activity.athlete_id
      ? activity.athlete_id
      : activity.user_id;
    return (
      activityPlayerId === playerId &&
      activity.kind === eventTypes.yellow &&
      !activity.delete
    );
  });

export const getRedCard = (
  pitchActivities: Array<GameActivity>,
  playerId: ?number
): ?GameActivity =>
  pitchActivities.find((activity) => {
    const activityPlayerId = activity.athlete_id
      ? activity.athlete_id
      : activity.user_id;
    return (
      activityPlayerId === playerId &&
      activity.kind === eventTypes.red &&
      !activity.delete
    );
  });

export const getGoals = (
  pitchActivities: Array<GameActivity>,
  playerId: ?number
): Array<GameActivity> =>
  pitchActivities.filter(
    (activity) =>
      activity.athlete_id === playerId &&
      activity.kind === eventTypes.goal &&
      !activity.delete
  );

export const getOwnGoals = (
  pitchActivities: Array<GameActivity>,
  playerId: ?number
): Array<GameActivity> =>
  pitchActivities
    .map((activity) => {
      const isOwnGoal =
        activity.athlete_id === playerId &&
        activity.kind === eventTypes.own_goal &&
        !activity.delete;

      const hasNestedOwnGoal =
        activity.athlete_id === playerId &&
        activity.kind === eventTypes.goal &&
        activity.game_activities?.[0]?.kind === eventTypes.own_goal &&
        !activity.delete;

      if (isOwnGoal) {
        return activity;
      }
      if (hasNestedOwnGoal) {
        return activity.game_activities?.[0];
      }

      return null;
    })
    .filter(Boolean);

export const getSwitches = (
  pitchActivities: Array<GameActivity>,
  playerId: ?number
): Array<GameActivity> =>
  pitchActivities.filter(
    (activity) =>
      (activity.athlete_id === playerId ||
        activity.relation?.id === playerId) &&
      activity.kind === eventTypes.switch &&
      !activity.delete
  );

export const getSubs = (
  pitchActivities: Array<GameActivity>,
  playerId: ?number
): Array<GameActivity> =>
  pitchActivities.filter(
    (activity) =>
      (activity.athlete_id === playerId ||
        activity.relation?.id === playerId) &&
      activity.kind === eventTypes.sub &&
      !activity.delete
  );

export const getRedCardForSecondYellow = (
  pitchActivities: Array<GameActivity>,
  playerId: number,
  cardMin: number
): ?GameActivity =>
  pitchActivities.find((activity) => {
    const activityPlayerId = activity.athlete_id
      ? activity.athlete_id
      : activity.user_id;
    return (
      activityPlayerId === playerId &&
      activity.kind === eventTypes.red &&
      +activity.absolute_minute === cardMin &&
      !activity.delete
    );
  });

export const getLinkedActivitiesFromEvent = ({
  gameActivities,
  event,
  type,
}: {
  gameActivities: Array<GameActivity>,
  event: GameActivity,
  type: string,
}): Array<GameActivity> =>
  gameActivities.filter(
    (activity) =>
      activity.kind === type && event?.id === activity.game_activity_id
  );

export const getLinkedActivitiesIndexesFromEvent = (
  gameActivities: Array<GameActivity>,
  event: GameActivity,
  type: string
): Array<number> => {
  const relatedActivitiesToEvent = [];

  gameActivities.forEach((activity, index) => {
    if (activity.kind === type && event.id === activity.game_activity_id)
      relatedActivitiesToEvent.push(index);
  });
  return relatedActivitiesToEvent;
};

export const getEventPositionActivitiesIndexes = (
  gameActivities: Array<GameActivity>,
  gameActivityId: ?number,
  activityType?: string
): Array<number> => {
  const relevantActivityIndexes = [];

  gameActivities.forEach((activity, index) => {
    if (gameActivityId !== activity?.game_activity_id) {
      return;
    }

    const isEitherPositionActivity =
      activity.kind === eventTypes.formation_position_view_change ||
      activity.kind === eventTypes.position_change;

    if (activityType) {
      const isActivityTypeEqual = activity.kind === activityType;
      if (isActivityTypeEqual) relevantActivityIndexes.push(index);
    } else if (isEitherPositionActivity) {
      relevantActivityIndexes.push(index);
    }
  });
  return relevantActivityIndexes;
};

export const getGameActivitiesByType = (
  gameActivities: Array<GameActivity>,
  gameActivityEventTypes: Array<GameActivityKind>
): Array<GameActivity> => {
  const filteredGameActivities: Array<GameActivity> = gameActivities
    .filter(
      (gameActivity) =>
        gameActivityEventTypes.includes(gameActivity.kind) &&
        !gameActivity.delete
    )
    .sort((a, b) => +b.id - +a.id)
    .sort((a, b) => +b.absolute_minute - +a.absolute_minute);
  return filteredGameActivities.length ? filteredGameActivities : [];
};

export const canEditSubSwapGameActivity = (
  gameActivities: Array<GameActivity>,
  gameActivity: Object
): boolean => {
  let gameActivityIsEditable: boolean = true;

  if (
    gameActivity.kind === eventTypes.sub ||
    gameActivity.kind === eventTypes.switch
  ) {
    const filteredGameActivities = getGameActivitiesByType(gameActivities, [
      eventTypes.sub,
      eventTypes.switch,
    ]);
    if (filteredGameActivities.length) {
      filteredGameActivities.forEach((filteredGameActivity, index) => {
        if (index !== 0 && filteredGameActivity.id === gameActivity.id) {
          gameActivityIsEditable = false;
        }
      });
    }
  }
  return gameActivityIsEditable;
};

export const getAthletePositionData = (
  athletePosition: Object
): PositionData => ({
  id: +athletePosition?.relation?.id,
  position: {
    id: athletePosition?.relation?.position?.id,
    abbreviation: athletePosition?.relation?.position?.abbreviation,
  },
});

export const getAthleteCurrentPosition = (
  gameActivities: Array<GameActivity>,
  athleteId: number,
  currentPeriod: GamePeriod
) => {
  const athletePitchViewPositionActivities = gameActivities
    .filter((gameActivity) => {
      return (
        checkIfActivityExistsWithinPeriod({
          activity: gameActivity,
          currentPeriod,
        }) &&
        gameActivity.athlete_id === athleteId &&
        gameActivity.kind === eventTypes.formation_position_view_change
      );
    })
    .sort((a, b) => +b.absolute_minute - +a.absolute_minute);

  return athletePitchViewPositionActivities.length
    ? athletePitchViewPositionActivities[0]
    : null;
};

export const onCreateFormationActivity = (
  formationMin: number,
  formationInfo: Object
) => ({
  absolute_minute: formationMin,
  relation: {
    id: formationInfo.id,
    name: formationInfo.name,
  },
  minute: 0,
  kind: eventTypes.formation_change,
});

export const onUpdatedFormation = (
  gameActivities: Array<GameActivity>,
  currentPeriod: GamePeriod,
  formationInfo: Object
) => {
  const currentGameActivities = [...gameActivities];
  const foundActivityIndex = findIndexOfFormationForPeriod(
    gameActivities,
    currentPeriod
  );

  currentGameActivities[foundActivityIndex] = {
    ...currentGameActivities[foundActivityIndex],
    relation: {
      ...(currentGameActivities[foundActivityIndex]?.relation || {}),
      id: formationInfo.id,
      name: formationInfo.name,
    },
  };

  return currentGameActivities;
};

export const createPlayerFormationViewChange = ({
  playerId,
  positionInfo,
  periodMin,
}: {
  playerId: number,
  positionInfo: ?PositionData,
  periodMin: number,
}): Array<GameActivity> => [
  {
    athlete_id: playerId,
    absolute_minute: periodMin,
    minute: 0,
    relation: {
      id: positionInfo?.id,
    },
    kind: eventTypes.formation_position_view_change,
  },
  {
    athlete_id: playerId,
    absolute_minute: periodMin,
    minute: 0,
    relation: {
      id: positionInfo?.position?.id,
    },
    kind: eventTypes.position_change,
  },
];

export const updatePlayerFormationViewChange = ({
  gameActivities,
  playerId,
  prevPlayerId,
  currentPeriodMinute,
}: {
  gameActivities: Array<GameActivity>,
  playerId: number,
  prevPlayerId: number,
  currentPeriodMinute: number,
}): Array<GameActivity> => {
  const currentGameActivities = [...gameActivities];
  const formationPositionIndex = gameActivities.findIndex(
    (activity) =>
      activity.athlete_id === prevPlayerId &&
      activity.kind === eventTypes.formation_position_view_change &&
      +activity.absolute_minute === currentPeriodMinute
  );
  const positionChangeIndex = gameActivities.findIndex(
    (activity) =>
      activity.athlete_id === prevPlayerId &&
      activity.kind === eventTypes.position_change &&
      +activity.absolute_minute === currentPeriodMinute
  );
  currentGameActivities[formationPositionIndex] = {
    ...currentGameActivities[formationPositionIndex],
    athlete_id: playerId,
  };
  currentGameActivities[positionChangeIndex] = {
    ...currentGameActivities[positionChangeIndex],
    athlete_id: playerId,
  };
  return currentGameActivities;
};

export const handleFootballSinglePlayerEvent = ({
  gameActivities,
  athleteId,
  eventType,
  organisationId,
  periodStartTime = 0,
  userType = 'athlete',
}: {
  gameActivities: Array<GameActivity>,
  athleteId: number,
  eventType: $Values<typeof eventTypes>,
  organisationId?: number,
  periodStartTime?: number,
  userType?: string,
}): Array<GameActivity> => {
  const maxEventTime = getMaxMinForEventActivities(
    gameActivities,
    undefined,
    true
  );
  const eventStartTime =
    maxEventTime > periodStartTime ? maxEventTime : periodStartTime;

  const events = [
    {
      absolute_minute: eventStartTime,
      minute: eventStartTime - periodStartTime,
      kind: eventType,
      ...(userType === 'athlete'
        ? { athlete_id: athleteId }
        : { user_id: athleteId }),
      relation: { id: null },
      organisation_id: organisationId,
    },
  ];

  if (
    eventType === eventTypes.yellow &&
    getYellowCards(gameActivities, athleteId).length === 1
  ) {
    events.push({
      absolute_minute: eventStartTime,
      minute: eventStartTime - periodStartTime,
      kind: eventTypes.red,
      ...(userType === 'athlete'
        ? { athlete_id: athleteId }
        : { user_id: athleteId }),
      relation: { id: null },
      organisation_id: organisationId,
    });
  }
  return events;
};

export const handleFootballMultiPlayerPitchEvent = ({
  athleteId,
  eventType,
  positionData,
  pitchActivities,
  periodStartTime,
  selectedPitchPlayer,
}: {
  athleteId: number,
  eventType: $Values<typeof eventTypes>,
  positionData: PositionData,
  pitchActivities: Array<GameActivity>,
  periodStartTime: number,
  selectedPitchPlayer: ?PlayerWithPosition,
}) => {
  const maxMultiEventTime = getMaxMinForEventActivities(
    pitchActivities,
    undefined,
    true
  );
  const eventStartTime =
    maxMultiEventTime > periodStartTime ? maxMultiEventTime : periodStartTime;

  return [
    {
      athlete_id: selectedPitchPlayer?.player?.id || null,
      absolute_minute: eventStartTime,
      minute: eventStartTime - periodStartTime,
      relation: {
        id: athleteId,
      },
      kind: eventType,
      game_activities: [
        ...(selectedPitchPlayer?.player
          ? [
              {
                athlete_id: selectedPitchPlayer?.player?.id,
                absolute_minute: eventStartTime,
                minute: eventStartTime - periodStartTime,
                relation: {
                  id: positionData.position.id,
                },
                kind: eventTypes.position_change,
              },
            ]
          : []),
        {
          athlete_id: athleteId,
          absolute_minute: eventStartTime,
          minute: eventStartTime - periodStartTime,
          relation: {
            id: selectedPitchPlayer?.positionData?.position?.id,
          },
          kind: eventTypes.position_change,
        },
        ...(selectedPitchPlayer?.player
          ? [
              {
                athlete_id: selectedPitchPlayer?.player?.id,
                absolute_minute: eventStartTime,
                minute: eventStartTime - periodStartTime,
                relation: {
                  id: positionData.id,
                },
                kind: eventTypes.formation_position_view_change,
              },
            ]
          : []),
        {
          athlete_id: athleteId,
          absolute_minute: eventStartTime,
          minute: eventStartTime - periodStartTime,
          relation: {
            id: selectedPitchPlayer?.positionData?.id,
          },
          kind: eventTypes.formation_position_view_change,
        },
      ],
    },
  ];
};

/**
 * Retrieves a list of old game activities based on the provided game activities, current period, and formation ID.
 *
 * The function filters the `gameActivities` array to include only those activities that:
 * - Exist within the specified `currentPeriod` (including deleted activities).
 * - Are either of type `formation_change` or have a valid `id`.
 *
 * After filtering, the function processes the activities as follows:
 * - If the activity is of type `formation_change`, it updates the `relation.id` to the provided `formationId`.
 * - If the activity is of type `captain_assigned`, it is returned as-is.
 * - For all other activity types, a `delete` flag is added to the activity.
 */
export const getOldActivities = ({
  gameActivities,
  currentPeriod,
  formationId,
}: {
  gameActivities: Array<GameActivity>,
  currentPeriod: GamePeriod,
  formationId: number,
}): Array<GameActivity> => {
  const oldActivities = gameActivities
    .filter(
      (activity) =>
        checkIfActivityExistsWithinPeriod({
          activity,
          currentPeriod,
          includeDeletes: true,
        }) &&
        (activity.kind === eventTypes.formation_change || activity.id)
    )
    .map((activity) => {
      if (activity.kind === eventTypes.formation_change) {
        return {
          ...activity,
          relation: {
            ...activity.relation,
            id: formationId,
          },
        };
      }

      if (activity.kind === eventTypes.captain_assigned) {
        return activity;
      }

      return {
        ...activity,
        delete: true,
      };
    });

  return oldActivities;
};

export const createGameEventsFromSavedLineUpTemplate = ({
  currentPeriod,
  lineUpTemplate,
  gameActivities,
  players,
}: {
  currentPeriod: GamePeriod,
  lineUpTemplate: EnrichedLineUpTemplate,
  gameActivities: Array<GameActivity>,
  players: Array<Athlete>,
}): {
  events: Array<Object>,
  inFieldPlayers: InFieldPlayers,
} => {
  const otherPeriodsActivities = gameActivities.filter(
    (activity) =>
      +activity.absolute_minute !== +currentPeriod.absolute_duration_start
  );

  const oldActivities = getOldActivities({
    gameActivities,
    currentPeriod,
    formationId: lineUpTemplate.formation_id,
  });

  const formationIndex = oldActivities.findIndex(
    (activity) => activity.kind === eventTypes.formation_change
  );

  if (formationIndex >= 0)
    oldActivities[formationIndex] = {
      ...oldActivities[formationIndex],
      relation: { ...lineUpTemplate?.formation },
    };

  const inFieldPlayers = {};

  const currentPeriodPositionViewChanges = lineUpTemplate.lineup_positions
    .map((lineUpPosition) => {
      const coordId = `${lineUpPosition.formation_position_view.x}_${lineUpPosition.formation_position_view.y}`;
      const athleteId = lineUpPosition.athlete_id;

      const foundPlayer = players.find((player) => +player.id === +athleteId);
      if (foundPlayer) inFieldPlayers[coordId] = foundPlayer;

      return createPlayerFormationViewChange({
        playerId: +athleteId,
        positionInfo: {
          id: lineUpPosition.formation_position_view.id,
          position: {
            id: lineUpPosition.formation_position_view.position.id,
          },
          x: lineUpPosition.formation_position_view.x,
          y: lineUpPosition.formation_position_view.y,
        },
        periodMin: currentPeriod.absolute_duration_start || 0,
      });
    })
    .filter((positionChange) => {
      // filter out athlete's events that are not part of the pre game player selection
      return players.some(
        (player) => +player.id === +positionChange[0].athlete_id
      );
    });
  return {
    events: [
      otherPeriodsActivities,
      oldActivities,
      currentPeriodPositionViewChanges,
    ].flat(2),
    inFieldPlayers,
  };
};

export const transformListViewActivitiesWithPitchViewCompatability = (
  gameActivities: Array<GameActivity>,
  activitiesToUpdate: Array<GameActivityForm>,
  formationCoordinates: FormationCoordinates
) => {
  const getNumberOfSpecificPositionsInFormation = (positionId: ?number) =>
    Object.values(formationCoordinates).filter(
      (coordinate: Object) => coordinate.position.id === positionId
    );

  const currentGameActivities = [];
  activitiesToUpdate.forEach((activity) => {
    if (activity.kind === eventTypes.position_change) {
      const formationPositions: Object[] =
        getNumberOfSpecificPositionsInFormation(+activity.relation_id);
      let coordIndex = 0;
      if (formationPositions.length > 1) {
        formationPositions.forEach((formationPosition, index) => {
          const foundActivity = findActivityForThePosition({
            gameActivities,
            positionId: +formationPosition.id,
            currentPeriodMinute: +activity.absolute_minute,
            positionType: eventTypes.formation_position_view_change,
          });
          if (!foundActivity) coordIndex = index;
        });
      }
      currentGameActivities.push({
        ...activity,
        relation_id: +formationPositions[coordIndex]?.id,
        kind: eventTypes.formation_position_view_change,
      });
    }
    if (
      activity.kind === eventTypes.yellow &&
      activitiesToUpdate.length === 2 &&
      !currentGameActivities.find(
        (currentActivity) => currentActivity.kind === eventTypes.red
      )
    ) {
      currentGameActivities.push({
        ...activitiesToUpdate[1],
        kind: eventTypes.red,
      });
    }
    currentGameActivities.push(activity);
  });

  return currentGameActivities;
};

export const removeFormationComplete = (
  gameActivities: Array<GameActivity>,
  period: GamePeriod
) => {
  const currentGameActivities = structuredClone(gameActivities);
  const formationCompleteCheck = (activity: GameActivity) =>
    activity.kind === eventTypes.formation_complete &&
    +activity.absolute_minute === period?.absolute_duration_start &&
    !activity.delete;

  const formationCompleteIndex = currentGameActivities.findIndex((activity) =>
    formationCompleteCheck(activity)
  );

  if (
    formationCompleteIndex >= 0 &&
    currentGameActivities[formationCompleteIndex].id
  ) {
    currentGameActivities[formationCompleteIndex] = {
      ...currentGameActivities[formationCompleteIndex],
      delete: true,
    };
  }

  return currentGameActivities;
};

export const generateNewFormationPlayerActivities = ({
  inFieldTeam,
  updatedCoordinates,
  minuteOfFormation,
  currentPeriod,
}: {
  inFieldTeam: InFieldPlayers,
  updatedCoordinates: FormationCoordinates,
  minuteOfFormation: number,
  currentPeriod: ?GamePeriod,
}) => {
  const inFieldKeys = Object.keys(inFieldTeam);
  const newActivityArr = inFieldKeys.map((key) => [
    {
      kind: eventTypes.position_change,
      relation: { id: +updatedCoordinates[key].position.id },
      athlete_id: +inFieldTeam[key].id,
      absolute_minute: minuteOfFormation,
      minute: minuteOfFormation - +currentPeriod?.absolute_duration_start,
    },
    {
      kind: eventTypes.formation_position_view_change,
      relation: { id: +updatedCoordinates[key].id },
      athlete_id: +inFieldTeam[key].id,
      absolute_minute: minuteOfFormation,
      minute: minuteOfFormation - +currentPeriod?.absolute_duration_start,
    },
  ]);
  return newActivityArr.flat();
};

export const updateFormationPlayerActivities = ({
  gameActivities,
  currentActivity,
  inFieldTeam,
  updatedCoordinates,
  eventIndex,
  foundNewFormation,
  currentPeriod,
}: {
  gameActivities: Array<Object>,
  currentActivity: Object,
  inFieldTeam: InFieldPlayers,
  updatedCoordinates: FormationCoordinates,
  eventIndex: number,
  foundNewFormation?: Formation,
  currentPeriod: ?GamePeriod,
}) => {
  const currentGameActivities = [...gameActivities];

  if (currentActivity.game_activities) {
    currentGameActivities[eventIndex] = {
      ...currentGameActivities[eventIndex],
      relation: { id: foundNewFormation?.id, name: foundNewFormation?.name },
      game_activities: generateNewFormationPlayerActivities({
        inFieldTeam,
        updatedCoordinates,
        minuteOfFormation: currentGameActivities[eventIndex].absolute_minute,
        currentPeriod,
      }),
    };
  } else {
    const athletePositionPitchListIndexes = getEventPositionActivitiesIndexes(
      currentGameActivities,
      currentActivity.id
    );

    athletePositionPitchListIndexes.forEach((index) => {
      const coordKey = Object.keys(inFieldTeam).find(
        (key) => inFieldTeam[key].id === currentGameActivities[index].athlete_id
      );
      if (coordKey)
        currentGameActivities[index] = {
          ...currentGameActivities[index],
          relation: {
            id:
              currentGameActivities[index].kind === eventTypes.position_change
                ? updatedCoordinates[coordKey].position.id
                : updatedCoordinates[coordKey].id,
          },
        };
    });

    currentGameActivities[eventIndex] = {
      ...currentGameActivities[eventIndex],
      relation: { id: foundNewFormation?.id, name: foundNewFormation?.name },
    };
  }

  return currentGameActivities;
};

export const handleTeamUpdatedFormationAssignments = async (
  fieldId: number,
  currentTeam: Team,
  formationActivity: GameActivity,
  positionChangeActivities: Array<GameActivity>
) => {
  const { inFieldPlayers } = currentTeam;

  const coordinateResults = await getFormationPositionsCoordinates({
    fieldId,
    formationId: +formationActivity.relation?.id,
  });

  const updatedCoordinates: FormationCoordinates = {};
  const updatedInFieldPlayers = {};

  coordinateResults.forEach((coordinate) => {
    const xy = `${coordinate.x}_${coordinate.y}`;
    updatedCoordinates[xy] = coordinate;
  });

  const inFieldTeamPlayers = Object.keys(inFieldPlayers).map(
    (key) => inFieldPlayers[key]
  );
  const updatedCoordinateValues = Object.keys(updatedCoordinates).map(
    (coordinateKey) => updatedCoordinates[coordinateKey]
  );

  positionChangeActivities.forEach((activity) => {
    const foundCoord = updatedCoordinateValues.find(
      (coordinate) => coordinate?.id === activity?.relation?.id
    );
    if (foundCoord) {
      const foundPlayer = inFieldTeamPlayers.find(
        (player) => +player.id === +activity.athlete_id
      );
      if (foundPlayer)
        updatedInFieldPlayers[`${foundCoord.x}_${foundCoord.y}`] = foundPlayer;
    }
  });

  return {
    updatedTeam: {
      inFieldPlayers: updatedInFieldPlayers,
      players: currentTeam.players,
    },
    updatedCoordinates,
  };
};

export const createFormationCompleteActivity = ({
  gameActivities,
  currentPeriod,
}: {
  gameActivities: Array<GameActivity>,
  currentPeriod: ?GamePeriod,
}): Array<GameActivity> => {
  let currentActivities = [...gameActivities];
  const foundFormationCompleteIndex = currentActivities.findIndex(
    (activity) =>
      activity.kind === eventTypes.formation_complete &&
      +activity.absolute_minute === +currentPeriod?.absolute_duration_start
  );
  if (foundFormationCompleteIndex < 0) {
    const foundFormationActivity = findFormationForPeriod(
      currentActivities,
      currentPeriod
    );
    currentActivities = [
      ...currentActivities,
      {
        absolute_minute: currentPeriod?.absolute_duration_start || 0,
        minute: 0,
        relation: { id: foundFormationActivity?.relation?.id },
        kind: 'formation_complete',
      },
    ];
  } else {
    currentActivities[foundFormationCompleteIndex] = {
      ...currentActivities[foundFormationCompleteIndex],
      delete: false,
    };
  }

  return currentActivities;
};

export const doesOwnGoalExistForEvent = (
  gameActivities: Array<GameActivity>,
  event: GameActivity
) => {
  const hasNestedOwnGoal =
    event.game_activities?.[0]?.kind === eventTypes.own_goal;

  const hasLinkedOwnGoal = !!gameActivities.find(
    (activity) =>
      activity.kind === eventTypes.own_goal &&
      event.id === activity.game_activity_id &&
      !activity.delete
  );

  return hasNestedOwnGoal || hasLinkedOwnGoal;
};

export const updateGameActivitiesForOwnGoal = ({
  gameActivities,
  eventIndex,
  markAsOwnGoal,
}: {
  gameActivities: Array<GameActivity>,
  eventIndex: number,
  markAsOwnGoal: boolean,
}): Array<GameActivity> => {
  const currentActivity = gameActivities[eventIndex];
  const currentGameActivities = structuredClone(gameActivities);
  const linkedActivitiesIndex = getLinkedActivitiesIndexesFromEvent(
    currentGameActivities,
    currentActivity,
    eventTypes.own_goal
  );

  const firstLinkedActivityIndex =
    linkedActivitiesIndex.length && linkedActivitiesIndex[0];
  const firstLinkedActivity =
    linkedActivitiesIndex.length &&
    currentGameActivities[firstLinkedActivityIndex];
  const nestedActivity = currentGameActivities[eventIndex];

  // If the own goal is marked
  if (markAsOwnGoal) {
    // If the nested event doesn't exist
    // Create a nested own goal event
    if (
      linkedActivitiesIndex.length < 1 &&
      !nestedActivity?.game_activities?.length
    ) {
      currentGameActivities[eventIndex] = {
        ...nestedActivity,
        game_activities: [
          {
            kind: eventTypes.own_goal,
            absolute_minute: currentActivity.absolute_minute,
            additional_minute: currentActivity.additional_minute,
            relation_id: null,
            minute: currentActivity.minute,
            organisation_id: currentActivity.organisation_id,
            athlete_id: currentActivity.athlete_id,
          },
        ],
      };
    } else {
      // If the linked event exists update it here
      delete currentGameActivities[firstLinkedActivityIndex].delete;
    }
  } // If the own goal is unmarked
  else if (nestedActivity?.game_activities?.length) {
    // If the nested own goal event exists, remove it
    delete currentGameActivities[eventIndex].game_activities;
  } else if (linkedActivitiesIndex.length && firstLinkedActivity.id) {
    // If linked own goal event exists, add delete flag
    currentGameActivities[firstLinkedActivityIndex] = {
      ...firstLinkedActivity,
      delete: true,
    };
  }

  return currentGameActivities;
};
