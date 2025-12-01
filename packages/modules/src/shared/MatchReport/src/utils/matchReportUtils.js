// @flow
import moment from 'moment';
import _ from 'lodash';
import structuredClone from 'core-js/stable/structured-clone';
import type { Translation } from '@kitman/common/src/types/i18n';
import type {
  EventAthlete,
  EventUser,
  Game,
} from '@kitman/common/src/types/Event';
import type {
  GameActivity,
  GameActivityStorage,
  TeamsPenalties,
  MatchReportPenaltyListStorage,
} from '@kitman/common/src/types/GameEvent';
import { getMaxMinForEventActivities } from '@kitman/modules/src/PlanningEvent/src/components/GameEventsTab/utils';
import type { Coordinate } from '@kitman/common/src/types/PitchView';
import {
  eventTypes,
  SCORED_TYPE,
} from '@kitman/common/src/consts/gameEventConsts';
import { getOpponentName } from '@kitman/common/src/utils/workload';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { doesOwnGoalExistForEvent } from '@kitman/common/src/utils/planningEvent/gameActivityUtils';

export const getMatchReportEventName = (event: ?Game) => {
  if (!event) return '';

  const opponentName = getOpponentName(event);
  const orgName = event.squad
    ? `${event.squad.name} ${event.squad.owner_name}`
    : event.organisation_team?.name;

  return orgName ? `${orgName} v ${opponentName}` : opponentName;
};

export const formatMatchReportDate = (
  date: moment,
  useDateWithTimeFormat?: boolean
) => {
  if (useDateWithTimeFormat) {
    return date.format('MMM D, YYYY h:mma');
  }

  if (window.featureFlags['standard-date-formatting']) {
    return DateFormatter.formatStandard({
      date,
      showCompleteDate: true,
      displayLongDate: true,
    });
  }

  return date.format('LLL');
};

const getPlayersWithTeamName = (
  players: Array<EventAthlete>,
  teamType: string
): Array<EventAthlete> =>
  players.map((player) => ({
    ...player,
    fullname: `${player.fullname} (${teamType})`,
  }));

const getStaffWithTeamName = (
  staffMembers: Array<EventUser>,
  teamType: string
): Array<EventUser> =>
  staffMembers.map((staff) => ({
    ...staff,
    user: { ...staff.user, fullname: `${staff.user.fullname} (${teamType})` },
  }));

export const getHomeAndAwayTeamAthletesWithTeamName = ({
  gameEvent,
  isScout,
  t,
}: {
  gameEvent: Game,
  isScout: boolean,
  t: Translation,
}) => ({
  homePlayers: getPlayersWithTeamName(
    gameEvent?.home_athletes,
    isScout ? gameEvent.squad?.owner_name : t('Home Team')
  ),
  awayPlayers: getPlayersWithTeamName(
    gameEvent?.away_athletes,
    isScout && gameEvent.opponent_squad
      ? gameEvent.opponent_squad?.owner_name
      : t('Away Team')
  ),
});

export const getStaffMembersWithTeamName = ({
  gameEvent,
  isScout,
  t,
}: {
  gameEvent: Game,
  isScout: boolean,
  t: Translation,
}) => [
  ...getStaffWithTeamName(
    gameEvent?.home_event_users,
    isScout ? gameEvent.squad?.owner_name : t('Home Team')
  ),
  ...getStaffWithTeamName(
    gameEvent?.away_event_users,
    isScout && gameEvent.opponent_squad
      ? gameEvent.opponent_squad?.owner_name
      : t('Away Team')
  ),
];

export const calculateTeamGoals = (
  players: Array<EventAthlete>,
  gameActivities: Array<GameActivity>
) => {
  let teamOwnGoalScore = 0;
  let teamScore = 0;

  const teamPlayerIds = players.map((athlete) => athlete.id);
  const teamGoalActivities = gameActivities.filter(
    (activity) =>
      teamPlayerIds.includes(activity.athlete_id) &&
      activity.kind === eventTypes.goal &&
      !activity.delete
  );

  teamGoalActivities.forEach((activity) => {
    if (doesOwnGoalExistForEvent(gameActivities, activity)) {
      teamOwnGoalScore += 1;
    } else {
      teamScore += 1;
    }
  });

  return { teamScore, teamOwnGoalScore };
};

export const handleMatchReportSubEvent = (
  matchActivities: Array<GameActivity>,
  initialSelectedPlayer: EventAthlete,
  subbedPlayer: EventAthlete,
  matchStartTime: number = 0
) => {
  const maxMultiEventTime = getMaxMinForEventActivities(
    matchActivities,
    undefined,
    true
  );
  const eventStartTime =
    maxMultiEventTime > matchStartTime ? maxMultiEventTime : matchStartTime;

  return [
    {
      athlete_id: initialSelectedPlayer.id,
      absolute_minute: eventStartTime,
      relation: {
        id: subbedPlayer.id,
      },
      kind: eventTypes.sub,
      game_activities: [
        {
          athlete_id: initialSelectedPlayer.id,
          absolute_minute: eventStartTime,
          relation: {
            id: subbedPlayer.position?.id,
          },
          kind: eventTypes.position_change,
        },
        {
          athlete_id: subbedPlayer.id,
          absolute_minute: eventStartTime,
          relation: {
            id: initialSelectedPlayer.position?.id,
          },
          kind: eventTypes.position_change,
        },
      ],
    },
  ];
};

export const generateInitialPenaltyShootoutActivities = (
  defaultPenaltyCount: number = 1
): TeamsPenalties => {
  const initialPenalties = new Array(defaultPenaltyCount)
    .fill({ kind: eventTypes.penalty_shootout, athlete_id: null })
    .map((penalty, index) => ({
      ...penalty,
      absolute_minute: index + 1,
      minute: index + 1,
    }));
  return {
    homePenalties: initialPenalties,
    awayPenalties: initialPenalties,
  };
};

export const getPenaltyShootoutActivities = (
  penaltyActivities: Array<GameActivity>
): Array<GameActivity> =>
  penaltyActivities.filter(
    (penalty) => penalty.kind === eventTypes.penalty_shootout && !penalty.delete
  );

const getTeamPenaltyActivities = (
  teamAthletes: Array<EventAthlete>,
  penaltyActivities: Array<GameActivity>
): Array<GameActivity> =>
  penaltyActivities.filter((penaltyActivity) =>
    teamAthletes.find((athlete) => athlete.id === penaltyActivity.athlete_id)
  );

const groupHomeAndAwayPenalties = (
  gameEvent: Object,
  penaltyActivities: Array<GameActivity>
): TeamsPenalties => {
  const homePenalties = getTeamPenaltyActivities(
    gameEvent.home_athletes,
    penaltyActivities
  );
  const awayPenalties = getTeamPenaltyActivities(
    gameEvent.away_athletes,
    penaltyActivities
  );

  // If there are not an equal amount of home/away penalties from the backend auto generates some on the front
  // in the case where they save 2 penalties for home and 1 penalty for away as an example
  const homeToAwayPenaltyLengthDiff =
    getPenaltyShootoutActivities(homePenalties).length -
    getPenaltyShootoutActivities(awayPenalties).length;

  if (homeToAwayPenaltyLengthDiff > 0) {
    for (let i = 0; i < homeToAwayPenaltyLengthDiff; i++) {
      const awayPenaltyLength =
        getPenaltyShootoutActivities(homePenalties).length;
      awayPenalties.push({
        kind: eventTypes.penalty_shootout,
        athlete_id: null,
        absolute_minute: awayPenaltyLength,
        minute: awayPenaltyLength,
      });
    }
  } else if (homeToAwayPenaltyLengthDiff < 0) {
    for (let i = 0; i > homeToAwayPenaltyLengthDiff; i--) {
      const homePenaltyLength =
        getPenaltyShootoutActivities(homePenalties).length;
      homePenalties.push({
        kind: eventTypes.penalty_shootout,
        athlete_id: null,
        absolute_minute: homePenaltyLength + 1,
        minute: homePenaltyLength + 1,
      });
    }
  }

  return { homePenalties, awayPenalties };
};

export const separateNormalGameTimeAndPenaltyActivities = (
  gameEvent: Object,
  allGameActivities: Array<GameActivity>
): {
  filteredTeamPenalties: TeamsPenalties,
  normalGameTimeActivities: Array<GameActivity>,
} => {
  const penaltyActivities = getPenaltyShootoutActivities(allGameActivities);

  if (penaltyActivities.length > 0) {
    const penaltyRelatedActivities = allGameActivities.filter((activity) =>
      penaltyActivities.find(
        (penaltyActivity) => activity?.game_activity_id === penaltyActivity.id
      )
    );

    const combinedPenaltyActivities = [
      ...penaltyActivities,
      ...penaltyRelatedActivities,
    ];

    // Group the penalty data, separating the activity data to their relevant teams based on athlete_ids
    const filteredTeamPenalties = groupHomeAndAwayPenalties(
      gameEvent,
      combinedPenaltyActivities
    );

    const normalGameTimeActivities = _.difference(
      allGameActivities,
      combinedPenaltyActivities
    );

    return { filteredTeamPenalties, normalGameTimeActivities };
  }
  return {
    filteredTeamPenalties: generateInitialPenaltyShootoutActivities(),
    normalGameTimeActivities: allGameActivities,
  };
};

export const getPlayersEligibleForPenalties = (
  players: Array<EventAthlete>,
  activities: Array<GameActivity>
): Array<EventAthlete> =>
  players.filter(
    (player) =>
      !activities.find(
        (activity) =>
          activity.kind === eventTypes.red && activity.athlete_id === player.id
      )
  );

export const getTeamPenaltyShootoutScores = (
  penaltyActivities: Array<GameActivity>
) => {
  const teamPenaltyParentActivities =
    getPenaltyShootoutActivities(penaltyActivities);
  // Filter penalties into an array based on if they are local goals or saved penalty goals then return the goal array length.
  return teamPenaltyParentActivities.filter((penalty) => {
    const localNestedGoalEventsCheck =
      penalty.game_activities &&
      penalty.game_activities?.length > 0 &&
      penalty.game_activities[0].kind === eventTypes.goal;

    const savedLinkedGoalEventsCheck = !!penaltyActivities.find(
      (linkedPenalty) =>
        linkedPenalty.game_activity_id === penalty.id &&
        linkedPenalty.kind === eventTypes.goal &&
        !linkedPenalty.delete
    );

    return localNestedGoalEventsCheck || savedLinkedGoalEventsCheck;
  }).length;
};

export const updatePenaltyAthleteAssigned = ({
  scoreStatus,
  currentPenaltyActivity,
  currentTeamTypeActivities,
  activityIndex,
}: {
  scoreStatus: ?string,
  currentPenaltyActivity: GameActivity,
  currentTeamTypeActivities: Array<GameActivity>,
  activityIndex: number,
}): Array<GameActivity> => {
  const penaltyActivities = [...currentTeamTypeActivities];

  // If the activity is previously saved update any linked activities to have the new athlete_id
  if (currentPenaltyActivity.id) {
    const foundLinkedActivityIndex = penaltyActivities.findIndex(
      (activity) => activity?.game_activity_id === currentPenaltyActivity.id
    );
    if (foundLinkedActivityIndex) {
      penaltyActivities[foundLinkedActivityIndex] = {
        ...penaltyActivities[foundLinkedActivityIndex],
        athlete_id: +scoreStatus,
      };
    }
  }

  penaltyActivities[activityIndex] = {
    ...currentPenaltyActivity,
    athlete_id: +scoreStatus,
    ...(currentPenaltyActivity.game_activities && {
      game_activities: [
        {
          ...currentPenaltyActivity.game_activities[0],
          athlete_id: +scoreStatus,
        },
      ],
    }),
  };

  return penaltyActivities;
};

export const updatePenaltyScoreStatus = ({
  scoreStatus,
  currentPenaltyActivity,
  currentTeamTypeActivities,
  activityIndex,
}: {
  scoreStatus: ?string,
  currentPenaltyActivity: GameActivity,
  currentTeamTypeActivities: Array<GameActivity>,
  activityIndex: number,
}): Array<GameActivity> => {
  const penaltyActivities = [...currentTeamTypeActivities];

  // If the activity is previously saved update any linked activities to be deleted for the new change
  if (currentPenaltyActivity.id) {
    const foundLinkedActivityIndex = penaltyActivities.findIndex(
      (activity) => activity?.game_activity_id === currentPenaltyActivity.id
    );
    if (foundLinkedActivityIndex) {
      penaltyActivities[foundLinkedActivityIndex] = {
        ...penaltyActivities[foundLinkedActivityIndex],
        delete: true,
      };
    }
  }

  // create a new nested activity whenever a change occurs
  const newPenaltyResultValue = [];
  if (scoreStatus) {
    newPenaltyResultValue.push({
      kind: scoreStatus === SCORED_TYPE ? eventTypes.goal : eventTypes.no_goal,
      athlete_id: currentPenaltyActivity.athlete_id,
      minute: 0,
      absolute_minute: 0,
    });
  }

  penaltyActivities[activityIndex] = {
    ...currentPenaltyActivity,
    game_activities:
      newPenaltyResultValue.length > 0 ? newPenaltyResultValue : null,
  };

  return penaltyActivities;
};

export const combineAllNormalTimeAndPenaltyActivities = (
  allGameActivities: GameActivityStorage,
  allPenaltyActivities: MatchReportPenaltyListStorage
) => {
  const combinedAllLocalActivities = [
    ...allGameActivities.localGameActivities,
    ...allPenaltyActivities.localPenaltyLists.homePenalties.filter(
      (penalty) => penalty.athlete_id
    ),
    ...allPenaltyActivities.localPenaltyLists.awayPenalties.filter(
      (penalty) => penalty.athlete_id
    ),
  ];

  const combinedAllApiActivities = [
    ...allGameActivities.apiGameActivities,
    ...allPenaltyActivities.apiPenaltyLists.homePenalties.filter(
      (penalty) => penalty.athlete_id
    ),
    ...allPenaltyActivities.apiPenaltyLists.awayPenalties.filter(
      (penalty) => penalty.athlete_id
    ),
  ];
  return { combinedAllLocalActivities, combinedAllApiActivities };
};

export const penaltyRetrievalCheck = (
  penalty: GameActivity,
  penaltyMinute: number
): boolean =>
  +penalty.absolute_minute === +penaltyMinute &&
  penalty.kind === eventTypes.penalty_shootout &&
  !penalty.delete;

const penaltyExclusionCheck = (
  penalty: GameActivity,
  penaltyMinute: number
): boolean => +penalty.absolute_minute !== +penaltyMinute || !!penalty?.delete;

const updatePenaltyNumbers = (
  penalties: Array<GameActivity>
): Array<GameActivity> => {
  let penaltyCounter = 0;
  return penalties.map((penalty) => {
    const isActivePenaltyShootout =
      !penalty.delete && penalty.kind === eventTypes.penalty_shootout;

    if (isActivePenaltyShootout) penaltyCounter += 1;

    const penaltyMin = isActivePenaltyShootout
      ? penaltyCounter
      : penalty.absolute_minute;

    return {
      ...penalty,
      absolute_minute: penaltyMin,
      minute: penaltyMin,
    };
  });
};

export const deleteAndUpdatePenalties = ({
  allPenaltyActivities,
  homeIndex,
  awayIndex,
  penaltyMinute,
}: {
  allPenaltyActivities: TeamsPenalties,
  homeIndex: number,
  awayIndex: number,
  penaltyMinute: number,
}): TeamsPenalties => {
  const currentPenaltyActivities = structuredClone(allPenaltyActivities);

  if (currentPenaltyActivities.homePenalties[homeIndex]?.id) {
    currentPenaltyActivities.homePenalties[homeIndex] = {
      ...currentPenaltyActivities.homePenalties[homeIndex],
      delete: true,
    };
  } else {
    currentPenaltyActivities.homePenalties =
      currentPenaltyActivities.homePenalties.filter((penalty) =>
        penaltyExclusionCheck(penalty, penaltyMinute)
      );
  }

  currentPenaltyActivities.homePenalties = updatePenaltyNumbers(
    currentPenaltyActivities.homePenalties
  );

  if (currentPenaltyActivities.awayPenalties[awayIndex]?.id) {
    currentPenaltyActivities.awayPenalties[awayIndex] = {
      ...currentPenaltyActivities.awayPenalties[awayIndex],
      delete: true,
    };
  } else {
    currentPenaltyActivities.awayPenalties =
      currentPenaltyActivities.awayPenalties.filter((penalty) =>
        penaltyExclusionCheck(penalty, penaltyMinute)
      );
  }

  currentPenaltyActivities.awayPenalties = updatePenaltyNumbers(
    currentPenaltyActivities.awayPenalties
  );

  return currentPenaltyActivities;
};

const getStartingLineupActivities = (
  gameActivities: Array<GameActivity>
): Array<GameActivity> =>
  gameActivities.filter(
    (activity) =>
      (activity.kind === eventTypes.formation_position_view_change ||
        activity.kind === eventTypes.formation_change) &&
      +activity.absolute_minute === 0 &&
      !activity.game_activity_id
  );

const transformFormationCoordinates = (formationCoordinates) => {
  const coordinates = {};
  formationCoordinates.forEach((coordinate) => {
    const xy = `${coordinate.x}_${coordinate.y}`;
    coordinates[xy] = coordinate;
  });
  return coordinates;
};

export const prepareBothTeamsReportData = ({
  event,
  homeCoords,
  awayCoords,
  homeActivities,
  awayActivities,
}: {
  event: Game,
  homeCoords: Array<Coordinate>,
  awayCoords: Array<Coordinate>,
  homeActivities: Array<GameActivity>,
  awayActivities: Array<GameActivity>,
}) => ({
  home: {
    formation: homeActivities?.[0]?.relation,
    formationCoordinates: transformFormationCoordinates(homeCoords),
    positions: getStartingLineupActivities(homeActivities),
    inFieldPlayers: {},
    players: event.home_athletes,
    listPlayers: event.home_athletes,
    staff: event.home_event_users,
  },
  away: {
    formation: awayActivities?.[0]?.relation,
    formationCoordinates: transformFormationCoordinates(awayCoords),
    positions: getStartingLineupActivities(awayActivities),
    inFieldPlayers: {},
    players: event.away_athletes,
    listPlayers: event.away_athletes,
    staff: event.away_event_users,
  },
});
