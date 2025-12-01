/* eslint-disable */
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

export const eventMock = {
  id: 122,
  score: 2,
  opponent_score: 3,
  type: 'game_event',
  duration: 80,
  mls_game_key: '',
  event_users: [],
};

export const periodMock = [
  {
    id: 10,
    name: 'Period 1',
    duration: 80,
    additional_duration: null,
    order: 9,
    absolute_duration_start: 0,
    absolute_duration_end: 80,
  },
];

export const newPeriodMock = [
  periodMock[0],
  {
    localId: 11,
    name: 'Period 2',
    duration: 80,
  },
];

export const gameActivities = {
  localGameActivities: [],
  apiGameActivities: [],
};
export const newLocalGameActivities = {
  apiGameActivities: [],
  localGameActivities: [
    {
      absolute_minute: 0,
      kind: eventTypes.formation_position_view_change,
      relation: { id: 1 },
    },
  ],
};

export const eventListActivities = {
  apiGameActivities: [],
  localGameActivities: [
    {
      absolute_minute: 0,
      kind: eventTypes.formation_change,
      relation: { id: 1 },
    },
    {
      absolute_minute: 0,
      kind: eventTypes.formation_position_view_change,
      relation: { id: 1 },
    },
    {
      absolute_minute: 0,
      kind: eventTypes.position_change,
      relation: { id: 1 },
    },
    {
      absolute_minute: 0,
      kind: eventTypes.formation_complete,
      relation: { id: 1 },
    },
  ],
};

export const eventPeriods = {
  localEventPeriods: periodMock,
  apiEventPeriods: periodMock,
};

export const athletePlayTimes = {
  localAthletePlayTimes: [],
  apiAthletePlayTimes: [],
};

export const eventResponse = {
  event: {
    id: 1,
    type: 'game_event',
    score: 2,
    opponent_score: 4,
  },
};

export const mockActivityStore = {
  apiGameActivities: [],
  localGameActivities: [
    {
      absolute_minute: 0,
      kind: eventTypes.formation_change,
      relation: { id: 1, number_of_players: 2 },
    },
    {
      absolute_minute: 0,
      kind: eventTypes.formation_position_view_change,
      relation: { id: 1 },
    },
    {
      absolute_minute: 0,
      kind: eventTypes.formation_position_view_change,
      relation: { id: 3 },
    },
  ],
};

export const defaultStore = {
  planningEvent: {
    gameActivities,
    eventPeriods,
    athletePlayTimes,
    athleteEvents: { apiAthleteEvents: [] },
    pitchView: {
      team: {
        inFieldPlayers: {},
        players: [],
      },
      selectedFormation: { id: 2, number_of_players: 11, name: '4-4-2' },
      selectedGameFormat: {
        id: 2,
        name: '11v11',
        number_of_players: 11,
      },
      formationCoordinates: {},
      activeEventSelection: '',
      pitchActivities: [],
      isLoading: false,
      field: {
        id: 0,
      },
    },
  },
};

export const defaultProps = {
  t: i18nextTranslateStub(),
  activeTabKey: '0',
  canEditEvent: true,
  event: eventMock,
  leagueEvent: {},
  eventSquads: { squads: [], selected_athletes: [], squad_numbers: {} },
  showPrompt: false,
  reloadData: false,
  setReloadData: jest.fn(),
  onUpdateEvent: jest.fn(),
  setIsPromptConfirmed: jest.fn(),
  setShowPrompt: jest.fn(),
  setSaveProgressIsActive: jest.fn(),
  onUpdateLeagueEvent: jest.fn(),
};
