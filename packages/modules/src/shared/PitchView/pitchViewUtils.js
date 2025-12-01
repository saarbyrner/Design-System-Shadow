// @flow
import structuredClone from 'core-js/stable/structured-clone';
import {
  checkIfActivityExistsWithinPeriod,
  findPeriodPlayerPitchChangeActivities,
  getLinkedActivitiesFromEvent,
  handleTeamUpdatedFormationAssignments,
} from '@kitman/common/src/utils/planningEvent/gameActivityUtils';
import {
  eventTypes,
  viewableEventTypes,
} from '@kitman/common/src/consts/gameEventConsts';
import type {
  GameActivity,
  GamePeriod,
} from '@kitman/common/src/types/GameEvent';
import type { Athlete } from '@kitman/common/src/types/Event';
import type {
  FormationCoordinates,
  Team,
} from '@kitman/common/src/types/PitchView';
import { orderPlayersByGroupAndPositionAndId } from '@kitman/modules/src/PlanningEvent/src/components/GameEventsTab/utils';

const findPlayerAndCorrespondingFormationCoord = ({
  allPlayers,
  athleteId,
  formationId,
  formationCoordinates,
}: {
  allPlayers: Array<Athlete>,
  athleteId: number,
  formationId: number,
  formationCoordinates: FormationCoordinates,
}): { foundPlayer: Athlete, foundFormationCoord: string } => {
  const foundPlayer = allPlayers.filter((player) => player.id === athleteId)[0];
  const foundFormationCoord = Object.keys(formationCoordinates).filter(
    (key) => formationCoordinates[key].id === formationId
  )[0];

  return { foundPlayer, foundFormationCoord };
};

const getSinglePitchPositionTeamChange = ({
  team,
  playerMovedToPitch,
  pitchCoord,
}: {
  team: Team,
  playerMovedToPitch: Athlete,
  pitchCoord: string,
}) => ({
  inFieldPlayers: {
    ...team.inFieldPlayers,
    ...(playerMovedToPitch &&
      pitchCoord && { [pitchCoord]: playerMovedToPitch }),
  },
  players: team.players.filter(
    (player) => player.id !== playerMovedToPitch?.id
  ),
});

export const handleSubSwapTeamPositionAssignments = ({
  team,
  multiPositionActivities,
  formationCoordinates,
  gameActivityType,
}: {
  team: Team,
  multiPositionActivities: Array<GameActivity>,
  formationCoordinates: FormationCoordinates,
  gameActivityType: string,
}) => {
  const currentTeam = structuredClone(team);
  const allPlayers = [
    ...Object.keys(currentTeam.inFieldPlayers).map(
      (key) => currentTeam.inFieldPlayers[key]
    ),
    ...currentTeam.players,
  ];

  const { foundPlayer, foundFormationCoord } =
    findPlayerAndCorrespondingFormationCoord({
      allPlayers,
      athleteId: +multiPositionActivities[0]?.athlete_id,
      formationId: +multiPositionActivities[0].relation?.id,
      formationCoordinates,
    });

  const {
    foundPlayer: foundSecondPlayer,
    foundFormationCoord: foundSecondFormationCoord,
  } = findPlayerAndCorrespondingFormationCoord({
    allPlayers,
    athleteId: +multiPositionActivities[1]?.athlete_id,
    formationId: +multiPositionActivities[1]?.relation?.id,
    formationCoordinates,
  });

  const isSwitchEvent = eventTypes.switch === gameActivityType;

  // Player in field swap event scenario
  if (
    isSwitchEvent &&
    foundFormationCoord &&
    foundPlayer &&
    foundSecondFormationCoord &&
    foundSecondPlayer
  )
    return {
      inFieldPlayers: {
        ...currentTeam.inFieldPlayers,
        [foundFormationCoord]: foundPlayer,
        [foundSecondFormationCoord]: foundSecondPlayer,
      },
      players: currentTeam.players,
    };

  // scenario for if its a substitution of a player to an empty spot and theres only one formation position change
  if (!(foundSecondPlayer || foundSecondFormationCoord)) {
    return getSinglePitchPositionTeamChange({
      team: currentTeam,
      playerMovedToPitch: foundPlayer,
      pitchCoord: foundFormationCoord,
    });
  }

  // normal substitute scenario
  if (foundSecondPlayer && foundPlayer && foundSecondFormationCoord)
    return {
      inFieldPlayers: {
        ...currentTeam.inFieldPlayers,
        [foundSecondFormationCoord]: foundSecondPlayer,
      },
      players: orderPlayersByGroupAndPositionAndId([
        ...currentTeam.players.filter(
          (player) => player.id !== foundSecondPlayer?.id
        ),
        foundPlayer,
      ]),
    };

  return currentTeam;
};

export const handleInitialTeamPositionAssignments = ({
  initialTeam,
  formationActivity,
  formationCoordinates,
}: {
  initialTeam: Team,
  formationActivity: GameActivity,
  formationCoordinates: FormationCoordinates,
}) => {
  const currentTeam = structuredClone(initialTeam);
  const allPlayers = [
    ...Object.keys(currentTeam.inFieldPlayers).map(
      (key) => currentTeam.inFieldPlayers[key]
    ),
    ...currentTeam.players,
  ];

  const { foundPlayer, foundFormationCoord } =
    findPlayerAndCorrespondingFormationCoord({
      allPlayers,
      athleteId: +formationActivity?.athlete_id,
      formationId: +formationActivity.relation?.id,
      formationCoordinates,
    });

  return getSinglePitchPositionTeamChange({
    team: currentTeam,
    playerMovedToPitch: foundPlayer,
    pitchCoord: foundFormationCoord,
  });
};

export const getMultiEventActivities = ({
  gameActivities,
  currentPeriod,
  isLastPeriodSelected,
}: {
  gameActivities: Array<GameActivity>,
  currentPeriod: ?GamePeriod,
  isLastPeriodSelected?: boolean,
}): Array<GameActivity> =>
  gameActivities
    .map((activity, index) => ({ ...activity, activityIndex: index }))
    .filter((activity) => {
      const isSwitchOrSubEvent = [eventTypes.switch, eventTypes.sub].includes(
        activity.kind
      );
      const isMidPeriodFormationChange =
        activity.kind === eventTypes.formation_change &&
        +activity.absolute_minute !== +currentPeriod?.absolute_duration_start;

      return (
        (isSwitchOrSubEvent || isMidPeriodFormationChange) &&
        checkIfActivityExistsWithinPeriod({
          activity,
          currentPeriod,
          isLastPeriodSelected,
        })
      );
    })
    .sort((a, b) => {
      // sorts on the absolute minute if they are not of equal values
      if (+a.absolute_minute !== +b.absolute_minute) {
        return +a.absolute_minute - +b.absolute_minute;
      }
      // if the absolute minute is the same sorts on the saved ID values if they both exist
      if (a.id && b.id) return a.id - b.id;

      // if at least one activity is unsaved refers to the local activityIndex instead
      return +a.activityIndex - +b.activityIndex;
    });

export const getEventListPitchActivities = ({
  gameActivities,
  currentPeriod,
  isLastPeriodSelected,
}: {
  gameActivities: Array<GameActivity>,
  currentPeriod: GamePeriod,
  isLastPeriodSelected?: boolean,
}): Array<GameActivity> =>
  gameActivities
    .map((activity, index) => ({ ...activity, activityIndex: index }))
    .filter((activity) => {
      const isMidPeriodFormationChange =
        activity.kind === eventTypes.formation_change &&
        +activity.absolute_minute !== +currentPeriod.absolute_duration_start;

      return (
        (viewableEventTypes.includes(activity.kind) ||
          isMidPeriodFormationChange) &&
        checkIfActivityExistsWithinPeriod({
          activity,
          currentPeriod,
          isLastPeriodSelected,
        })
      );
    })
    .sort((a, b) => {
      if (+a.absolute_minute !== +b.absolute_minute) {
        return +b.absolute_minute - +a.absolute_minute;
      }
      if (a.id && b.id) return b.id - a.id;
      return +b.activityIndex - +a.activityIndex;
    });

export const getLinkedOrNestedFormationChangeActivities = (
  currentMultiEventActivity: GameActivity,
  allGameActivities: Array<GameActivity>
): Array<GameActivity> => {
  // Gets the activities if it is a flat array activity structure that is linked to the multi-position activity
  // else retrieves it from the nested attribute game_activities.
  if (!currentMultiEventActivity.game_activities)
    return getLinkedActivitiesFromEvent({
      gameActivities: allGameActivities,
      event: currentMultiEventActivity,
      type: eventTypes.formation_position_view_change,
    }).sort((a, b) => +a.id - +b.id);

  return currentMultiEventActivity.game_activities.filter(
    (gameActivity) =>
      gameActivity.kind === eventTypes.formation_position_view_change
  );
};

export const recursiveMultiEventPitchUpdate = async ({
  indexCounter,
  allGameActivities,
  loopActivities,
  fieldId,
  team,
  formationCoordinates,
}: {
  indexCounter: number,
  allGameActivities: Array<GameActivity>,
  loopActivities: Array<GameActivity>,
  fieldId: number,
  team: Team,
  formationCoordinates: FormationCoordinates,
}) => {
  let updatedTeamData = structuredClone(team);
  let updatedFormationCoordinatesData = structuredClone(formationCoordinates);

  const formationChangeActivities = getLinkedOrNestedFormationChangeActivities(
    loopActivities[indexCounter],
    allGameActivities
  );

  // Awaits the sync call for getting the up to date formationCoordinates
  if (loopActivities[indexCounter].kind === eventTypes.formation_change) {
    const { updatedTeam, updatedCoordinates } =
      await handleTeamUpdatedFormationAssignments(
        fieldId,
        updatedTeamData,
        loopActivities[indexCounter],
        formationChangeActivities
      );
    updatedTeamData = updatedTeam;
    updatedFormationCoordinatesData = updatedCoordinates;
  } else {
    // Normal case that handles subs/position swaps
    updatedTeamData = handleSubSwapTeamPositionAssignments({
      team: updatedTeamData,
      multiPositionActivities: formationChangeActivities,
      formationCoordinates: updatedFormationCoordinatesData,
      gameActivityType: loopActivities[indexCounter].kind,
    });
  }

  // Recursively calls itself until there is no more activities
  if (indexCounter + 1 !== loopActivities.length) {
    const { updatedTeam, updatedFormationCoordinates } =
      await recursiveMultiEventPitchUpdate({
        indexCounter: indexCounter + 1,
        allGameActivities,
        loopActivities,
        fieldId,
        team: updatedTeamData,
        formationCoordinates: updatedFormationCoordinatesData,
      });
    updatedTeamData = updatedTeam;
    updatedFormationCoordinatesData = updatedFormationCoordinates;
  }

  return {
    updatedTeam: updatedTeamData,
    updatedFormationCoordinates: updatedFormationCoordinatesData,
  };
};

export const autoSetStartOfPeriodAssignmentsToPitch = ({
  gameActivities,
  currentPeriod,
  team,
  formationCoordinates,
}: {
  gameActivities: Array<GameActivity>,
  currentPeriod: ?GamePeriod,
  team: Team,
  formationCoordinates: FormationCoordinates,
}) => {
  const foundPlayerActivities = findPeriodPlayerPitchChangeActivities(
    gameActivities,
    currentPeriod
  );

  let currentTeam = structuredClone(team);
  // sets players in the field based on the amount of formation position change activities there are
  foundPlayerActivities.forEach((activity) => {
    currentTeam = handleInitialTeamPositionAssignments({
      initialTeam: currentTeam,
      formationActivity: activity,
      formationCoordinates,
    });
  });

  return currentTeam;
};
