// @flow
import _forOwn from 'lodash/forOwn';
import _isEqual from 'lodash/isEqual';
import _uniqBy from 'lodash/uniqBy';
import _groupBy from 'lodash/groupBy';
import type { PositionGroup } from '@kitman/services/src/services/getPositionGroups';
import type { Athlete, AthleteEventV2 } from '@kitman/common/src/types/Event';
import i18n from '@kitman/common/src/utils/i18n';
import type { GridSorting } from '@kitman/components/src/types';
import type { FilterOption } from '@kitman/components/src/Select';
import { orderBy, uniqBy } from 'lodash';
import type { OrganisationFormat } from '@kitman/services/src/services/planning/getOrganisationFormats';
import getFormationPositionsCoordinates from '@kitman/services/src/services/planning/getFormationPositionsCoordinates';
import type {
  GameActivity,
  GamePeriod,
  EventActivityTypes,
} from '@kitman/common/src/types/GameEvent';
import {
  eventTypes,
  viewableEventTypes,
} from '@kitman/common/src/consts/gameEventConsts';
import type { Translation } from '@kitman/common/src/types/i18n';
import type {
  Formation as GameFormation,
  FormationCoordinates,
  InFieldPlayers,
  Team,
} from '@kitman/common/src/types/PitchView';

import type { GameActivityForm } from '../../services/gameActivities';
import type { Formation } from '../../services/formations';
import type { EnrichedLineUpTemplate } from '../../services/lineUpTemplate';

export const getEventTypeText = (
  eventType: EventActivityTypes,
  t: Translation
) => {
  switch (eventType) {
    case eventTypes.sub:
      return t('Substitution');
    case eventTypes.switch:
      return t('Position Switch');
    case eventTypes.formation_change:
      return t('Formation Change');
    default:
      return '';
  }
};

export const renderEventSrc = (type: EventActivityTypes): string => {
  switch (type) {
    case eventTypes.goal:
      return '/img/pitch-view/goal.png';
    case eventTypes.own_goal:
      return '/img/pitch-view/ownGoal.png';
    case eventTypes.yellow:
      return '/img/pitch-view/yellowCard.png';
    case eventTypes.red:
      return '/img/pitch-view/redCard.png';
    case eventTypes.switch:
      return '/img/pitch-view/switch.png';
    case eventTypes.formation_change:
      return '/img/pitch-view/formation.png';
    default:
      return '/img/pitch-view/subArrow.png';
  }
};

// The server sets SUBSTITUTE positions as null
// but on the frontend, we use the string "SUBSTITUTE" as null
// is the empty value of the dropdowns
export const transformGameActivitiesDataFromServer = (
  gameActivities: Array<GameActivity>
) =>
  gameActivities.map<GameActivity>((gameActivity) =>
    gameActivity.kind === 'position_change' &&
    !gameActivity.relation?.id &&
    !gameActivity.game_activity_id
      ? {
          ...gameActivity,
          relation: {
            id: 'SUBSTITUTE',
            name: gameActivity.relation?.name || '',
          },
        }
      : gameActivity
  );

// The server sets SUBSTITUTE positions as null
export const transformGameActivitiesDataFromForm = (
  gameActivities: Array<GameActivityForm>
) =>
  gameActivities.map<GameActivityForm>((gameActivity) =>
    gameActivity.kind === 'position_change' &&
    gameActivity.relation_id === 'SUBSTITUTE'
      ? { ...gameActivity, relation_id: null }
      : gameActivity
  );

export const orderAthletesByStartPosition = (
  athletes: Array<Athlete>,
  gameActivities: Array<GameActivity>,
  positionGroups: Array<PositionGroup>
): Array<Athlete> => {
  // List of athletes positions changes at minute 0 as [{ athleteId, startPositionId }]
  const startPositions = _uniqBy(
    gameActivities
      .filter(
        (gameActivity) =>
          gameActivity.kind === 'position_change' && gameActivity.minute === 0
      )
      .map((positionChange) => ({
        athleteId: positionChange.athlete_id,
        startPositionId: positionChange.relation?.id,
      })),
    'athleteId'
  );

  // List of athletes start positions and position groups order as { [athleteId]: { athleteId, positionOrder, positionGroupOrder } }
  const athletesStartPosition = {};
  _forOwn(startPositions, ({ athleteId, startPositionId }) => {
    const athleteStartPositionGroup = positionGroups.find((positionGroup) =>
      positionGroup.positions.find(
        (position) => position.id === startPositionId
      )
    );

    athletesStartPosition[athleteId] = {
      athleteId,
      positionOrder: athleteStartPositionGroup?.positions.find(
        (position) => position.id === startPositionId
      )?.order,
      positionGroupOrder: athleteStartPositionGroup?.order,
    };
  });

  /*
   * Returns the list of athletes ordered by:
   * 1. Position group at minute 0
   * 2. Position at minute 0
   * 3. Subs at minute 0
   * 4. Initial athletes list order
   */
  return athletes.sort((athleteA, athleteB) => {
    // Move athletes without positions at the bottom
    if (!athletesStartPosition[athleteA.id]) {
      return 1;
    }
    if (!athletesStartPosition[athleteB.id]) {
      return -1;
    }

    // Then subs should move under the athletes with a proper position
    // (Subs are identified as not having an order)
    if (!athletesStartPosition[athleteA.id].positionGroupOrder) {
      return 1;
    }
    if (!athletesStartPosition[athleteB.id].positionGroupOrder) {
      return -1;
    }

    // Then, at the top, athlete with a start position should be sorted by position group, then position order
    return (
      athletesStartPosition[athleteA.id]?.positionGroupOrder -
        athletesStartPosition[athleteB.id]?.positionGroupOrder ||
      athletesStartPosition[athleteA.id]?.positionOrder -
        athletesStartPosition[athleteB.id]?.positionOrder
    );
  });
};

export const sortAthletes = (
  gridSorting: GridSorting,
  athletesSortedByStartPosition: Array<Athlete>
): Array<Athlete> => {
  if (gridSorting.order === null) {
    return athletesSortedByStartPosition;
  }

  switch (gridSorting.column) {
    case 'athlete': {
      const athletesSortedByName = athletesSortedByStartPosition.sort(
        (athleteA, athleteB) =>
          athleteA.lastname.localeCompare(athleteB.lastname)
      );

      return gridSorting.order === 'DESCENDING'
        ? athletesSortedByName
        : athletesSortedByName.reverse();
    }
    case 'position_change':
    default: {
      return gridSorting.order === 'DESCENDING'
        ? athletesSortedByStartPosition
        : athletesSortedByStartPosition.reverse();
    }
  }
};

export const formatFormationsToDropdownOptions = (
  formations: Array<Formation>,
  hasPeriodStarted: boolean,
  formationChanges: GameActivity[]
) => {
  const formattedFormations = [];
  if (hasPeriodStarted) {
    // Retrieved the first formation_change activity
    const firstFormationChange = formationChanges[0];
    // Gets the corresponding formation details that the formation_change is related to
    const foundFormation = formations.find(
      (formation) => formation.id === firstFormationChange?.relation?.id
    );
    // Filtered out the formations to only include the same ones that have the same number_of_players
    const filteredFormations = formations.filter(
      (formation) =>
        formation.number_of_players === foundFormation?.number_of_players
    );
    filteredFormations.forEach((formation) => {
      formattedFormations.push({ value: formation.id, label: formation.name });
    });
  } else {
    _forOwn(_groupBy(formations, 'number_of_players'), (value, key) => {
      formattedFormations.push({
        label: i18n.t('{{NUMBER_OF_PLAYERS}} A SIDE', {
          NUMBER_OF_PLAYERS: key,
        }),
        options: value.map(({ id, name }) => ({
          value: id,
          label: name,
        })),
      });
    });
  }

  return formattedFormations;
};

export const filterFormationOptions: FilterOption = (candidate, input) => {
  return candidate?.label?.includes(input);
};

export const groupFormationsByGameFormat = (
  gameFormats: OrganisationFormat[] = [],
  formations: GameFormation[] = []
): { [key: number]: Formation[] } => {
  const formationsGroupedByGameFormat = {};

  gameFormats.forEach((gameFormat) => {
    formationsGroupedByGameFormat[gameFormat.number_of_players] =
      formations.filter(
        (f) => gameFormat.number_of_players === f.number_of_players
      );
  });

  return formationsGroupedByGameFormat;
};

export const getPlayerJerseyNumber = (
  squadNumbers: void | { [key: number]: number },
  athleteId: number | string
) => {
  let playerJerseyNumber: number;

  if (squadNumbers != null && typeof athleteId === 'number') {
    const squadNumbersNotNull: { [key: number]: number } = (squadNumbers: any);

    playerJerseyNumber = squadNumbersNotNull[athleteId];
  }

  return playerJerseyNumber;
};

export const orderPlayersByGroupAndPositionAndId = (
  players: Array<Athlete>
): Array<Athlete> =>
  orderBy(
    players,
    ['id', 'position.position_group.order', 'position.order'],
    ['asc', 'asc', 'asc']
  );

export const lineUpSelectorOptions = {
  SaveLineUpTemplate: 'save_line_up_template',
  CopyLastPeriodLineUp: 'copy_last_period_line_up',
  CopyLastGameLineUp: 'copy_last_game_line_up',
  UseSavedLineUpTemplate: 'use_saved_line_up_template',
};

export const getLineUpOptions = ({
  isSaveLineUpDisabled,
  isCopyLastPeriodLineUpDisabled,
  isCopyLastFixtureDisabled,
  isUsedSavedLineUpDisabled,
}: {
  isSaveLineUpDisabled?: boolean,
  isCopyLastPeriodLineUpDisabled?: boolean,
  isCopyLastFixtureDisabled?: boolean,
  isUsedSavedLineUpDisabled?: boolean,
}) => [
  {
    value: lineUpSelectorOptions.SaveLineUpTemplate,
    label: i18n.t('Save line-up template'),
    isDisabled: isSaveLineUpDisabled,
  },
  {
    value: lineUpSelectorOptions.CopyLastPeriodLineUp,
    label: i18n.t('Copy from last period'),
    isDisabled: isCopyLastPeriodLineUpDisabled,
  },
  {
    value: lineUpSelectorOptions.CopyLastGameLineUp,
    label: i18n.t('Copy from last fixture'),
    isDisabled: isCopyLastFixtureDisabled,
  },
  {
    value: lineUpSelectorOptions.UseSavedLineUpTemplate,
    label: i18n.t('Use saved line-up'),
    isDisabled: isUsedSavedLineUpDisabled,
  },
];

export const removeInFieldAthletesFromSelectedAthleteIds = (
  selectedAthletes: Array<Athlete>,
  inFieldPlayers: InFieldPlayers
): Array<Athlete> => {
  const inFieldIds = Object.keys(inFieldPlayers).map(
    (key: string) => inFieldPlayers[key]?.id
  );

  return selectedAthletes.filter((athlete) => !inFieldIds.includes(athlete.id));
};

export const updateTeamFromSquadData = ({
  athleteEvents,
  currentTeam,
}: {
  athleteEvents: Array<AthleteEventV2>,
  currentTeam: Team,
}) => {
  const playersWithPosition = athleteEvents.map(
    (athleteEvent) => athleteEvent.athlete
  );

  const playersOnBench = removeInFieldAthletesFromSelectedAthleteIds(
    playersWithPosition,
    currentTeam.inFieldPlayers
  );

  const playersOnField = {};
  Object.keys(currentTeam.inFieldPlayers).forEach((key) => {
    playersOnField[key] = playersWithPosition.find(
      (player) => player.id === currentTeam.inFieldPlayers[key].id
    );
  });

  return {
    inFieldPlayers: playersOnField,
    players: orderPlayersByGroupAndPositionAndId(playersOnBench),
  };
};

export const getClearedTeam = (team: Team): Team => {
  const allPlayers = [...team.players];
  const removedPlayers = Object.keys(team.inFieldPlayers).map(
    (athleteKey) => team.inFieldPlayers[athleteKey]
  );
  const combinedPlayers = [...allPlayers, ...removedPlayers];

  return {
    inFieldPlayers: {},
    players: orderPlayersByGroupAndPositionAndId(combinedPlayers),
  };
};

export const getMaxMinForEventActivities = (
  gameActivities: Array<Object>,
  currentActivity?: ?GameActivity,
  useAllTypes?: boolean
) => {
  let currentGameActivities = [...gameActivities];
  if (currentActivity)
    currentGameActivities = currentGameActivities.filter(
      (activity) => activity !== currentActivity
    );

  const usableEventTypes = useAllTypes
    ? [...viewableEventTypes, eventTypes.formation_change]
    : [eventTypes.switch, eventTypes.sub, eventTypes.formation_change];

  return Math.max(
    ...currentGameActivities
      .filter(
        (activity) =>
          usableEventTypes.includes(activity.kind) && !activity.delete
      )
      .map((activity) => +activity.absolute_minute)
  );
};

const parseGameActivity = (period: Object, activity) => {
  const event: Object = {
    absolute_minute: period.absolute_duration_start,
    athlete_id: activity.athlete_id,
    kind: activity.kind,
  };

  if (activity.relation) {
    event.relation = activity.relation;
  }

  return event;
};

export const copyEventsToSelectPeriod = (
  period: GamePeriod,
  events: Object[]
): $Shape<GameActivity>[] => {
  return events.map((item) => {
    return parseGameActivity(period, item);
  });
};

export const getHasLineUpPositionChangeEvents = (events: Object[]) => {
  return events.length > 1;
};

export const getShouldPromptToClearPeriod = (opts: {
  gameActivities: Array<GameActivity>,
  periodStart?: number,
}) =>
  opts.gameActivities.some(
    (item) =>
      item.absolute_minute === opts.periodStart &&
      ![eventTypes.formation_change, eventTypes.total_time].includes(item.kind)
  );

export const getPreviousPeriodFormationChange = (events: GameActivity[]) => {
  return [...events]
    .reverse()
    .find((event) => event.kind === eventTypes.formation_change);
};

export const getPreviousPeriodGameConfig = (opts: {
  previousPeriodEvents: GameActivity[],
  gameFormats: OrganisationFormat[],
  formations: Formation[],
}): {
  previousPeriodGameFormat: ?OrganisationFormat,
  previousPeriodFormation: ?Object,
} => {
  const formationChangeActivity = getPreviousPeriodFormationChange(
    opts.previousPeriodEvents
  );
  const relation = formationChangeActivity?.relation || {};
  const previousPeriodFormation =
    opts.formations.find((formation) => formation.id === relation.id) || null;

  const previousPeriodGameFormat =
    opts.gameFormats.find(
      (gameFormat) =>
        gameFormat.number_of_players ===
        previousPeriodFormation?.number_of_players
    ) || null;

  return {
    previousPeriodGameFormat,
    previousPeriodFormation,
  };
};

export const getLineUpFormationCoordinates = async (
  fieldId: number,
  formationId: number
): FormationCoordinates => {
  const data = await getFormationPositionsCoordinates({
    fieldId,
    formationId,
  });

  const coordinates = {};

  data.forEach((coordinate) => {
    const xy = `${coordinate.x}_${coordinate.y}`;
    coordinates[xy] = coordinate;
  });

  return coordinates;
};

export const getNewTeam = (opts: {
  inFieldPlayers: InFieldPlayers,
  players: Array<Athlete>,
}): {
  inFieldPlayers: InFieldPlayers,
  players: Array<Athlete>,
} => {
  const newInFieldPlayers = Object.keys(opts.inFieldPlayers).map(
    (inFieldKeys) => opts.inFieldPlayers[inFieldKeys]
  );
  const inFieldPlayerIds = newInFieldPlayers.map((player) => player?.id);

  return {
    inFieldPlayers: opts.inFieldPlayers,
    players: opts.players.filter(
      (player) => !inFieldPlayerIds.includes(player?.id)
    ),
  };
};

export const getAllPlayers = (currentTeam: Team): Array<Athlete> => {
  const oldInFieldPlayers: Object[] = Object.values(currentTeam.inFieldPlayers);
  const players = orderPlayersByGroupAndPositionAndId([
    ...oldInFieldPlayers,
    ...currentTeam.players,
  ]);

  return uniqBy(players, 'id');
};

export const isGameFormatAndFormationSupported = (opts: {
  template: EnrichedLineUpTemplate,
  gameFormats: OrganisationFormat[],
  formations: Formation[],
  onError: Function,
}): boolean => {
  const getMatchingGameFormat = (gameFormat) =>
    gameFormat.id === opts.template.gameFormat.id;
  const getMatchingFormation = (formation) =>
    formation.id === opts.template.formation.id;

  if (
    opts.gameFormats.find(getMatchingGameFormat) &&
    opts.formations.find(getMatchingFormation)
  ) {
    return true;
  }

  opts.onError();

  return false;
};

export const showUnsavedDataModal = async (
  modalShowAsync: Function
): Promise<boolean> => {
  const result = await modalShowAsync({
    title: i18n.t('You have unsaved data!'),
    content: i18n.t(
      'All previous events added to the selected period will be deleted.'
    ),
  });

  return result;
};

export const getPreviousPeriodLineUp = ({
  gameActivities,
  period,
  gamePeriods,
}: {
  gameActivities: Array<GameActivity>,
  period: GamePeriod | null,
  gamePeriods: Array<GamePeriod>,
}): Object[] => {
  if (!period) {
    return [];
  }

  const eventsByAthletes = {};

  const getEventId = (item: GameActivity) => {
    return `${item.athlete_id || ''}_${item.kind}`;
  };

  const getSubAndSwapEvents = (childActivity: GameActivity, index: number) => {
    const eventId = getEventId(childActivity);
    eventsByAthletes[eventId] = eventsByAthletes[eventId] || {
      ...childActivity,
      index,
    };
  };

  const getEventsByAthletes = (item, index) => {
    if (!item.athlete_id && item.kind === eventTypes.formation_change) {
      const eventId = getEventId(item);
      eventsByAthletes[eventId] = eventsByAthletes[eventId] || {
        ...item,
        index,
      };
    }

    if (item.athlete_id && !item.game_activities) {
      const eventId = getEventId(item);
      eventsByAthletes[eventId] = eventsByAthletes[eventId] || {
        ...item,
        index,
      };
    }

    if (
      item.game_activities &&
      [eventTypes.sub, eventTypes.switch].includes(item.kind)
    ) {
      item.game_activities.forEach(
        (gameActivity: GameActivity, gameActivityIndex: number) =>
          getSubAndSwapEvents(gameActivity, index + gameActivityIndex + 1)
      );
    }
  };

  const periodEvents = gameActivities.filter((item) => {
    if (
      !period.absolute_duration_start &&
      period.absolute_duration_start !== 0
    ) {
      return false;
    }

    const currentPeriodIndex = gamePeriods.findIndex((gamePeriod) =>
      _isEqual(gamePeriod, period)
    );

    const periodStart =
      gamePeriods[currentPeriodIndex - 1].absolute_duration_start;

    return (
      +item.absolute_minute === periodStart &&
      !item.delete &&
      [
        eventTypes.formation_position_view_change,
        eventTypes.position_change,
        eventTypes.sub,
        eventTypes.switch,
        eventTypes.formation_change,
      ].includes(item.kind)
    );
  });

  periodEvents.reverse();
  periodEvents.forEach(getEventsByAthletes);

  return orderBy(
    Object.values(eventsByAthletes).filter((event: Object) =>
      [
        eventTypes.formation_change,
        eventTypes.formation_position_view_change,
        eventTypes.position_change,
      ].includes(event.kind)
    ),
    ['index'],
    'desc'
  );
};

export const getGameActivitiesForTotalTime = (
  athlete: Athlete,
  gameActivities: Array<GameActivity>
): Array<GameActivity> =>
  gameActivities.filter(
    (gameActivity) =>
      gameActivity.athlete_id === athlete.id &&
      (gameActivity.kind === eventTypes.position_change ||
        gameActivity.kind === eventTypes.red)
  );

export const getNextCoords = async (fieldId: number, formationId: number) => {
  const coordinateResults = await getFormationPositionsCoordinates({
    fieldId,
    formationId,
  });

  const updatedCoordinates: FormationCoordinates = {};
  coordinateResults.forEach((coordinate) => {
    const xy = `${coordinate.x}_${coordinate.y}`;
    updatedCoordinates[xy] = coordinate;
  });
  return updatedCoordinates;
};
