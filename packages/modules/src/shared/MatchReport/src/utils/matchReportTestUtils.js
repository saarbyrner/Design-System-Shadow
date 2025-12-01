/* eslint-disable */
import '@testing-library/jest-dom';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { defaultTeamPitchInfo } from '../consts/matchReportConsts';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';

const mockEvent = {
  id: 1,
  start_date: '2025-03-01T19:15:00Z',
  local_timezone: 'Europe/Dublin',
  event_location: 'Stadium Name',
  mls_game_key: '12345',
  squad: { name: 'U16', owner_name: 'KL Toronto' },
  opponent_squad: { name: 'U17', owner_name: 'KL Atlanta' },
};

export const mockPermissions = {
  leagueGame: {
    manageMatchReport: true,
  },
};

export const mockPenalties = {
  homePenalties: [
    { kind: 'penalty_shootout', game_activities: [{ kind: 'goal' }] },
    { kind: 'penalty_shootout', game_activities: [{ kind: 'goal' }] },
    {
      id: 6,
      kind: 'penalty_shootout',
    },
    { id: 7, kind: 'no_goal', game_activity_id: 6 },
    {
      id: 1,
      kind: 'penalty_shootout',
    },
    { id: 2, kind: 'goal', game_activity_id: 1 },
  ],
  awayPenalties: [
    { kind: 'penalty_shootout', game_activities: [{ kind: 'goal' }] },
    { kind: 'penalty_shootout', game_activities: [{ kind: 'no_goal' }] },
    {
      id: 3,
      kind: 'penalty_shootout',
    },
    { id: 4, kind: 'goal', game_activity_id: 3 },
    {
      id: 8,
      kind: 'penalty_shootout',
    },
    { id: 9, kind: 'no_goal', game_activity_id: 8 },
  ],
};

export const defaultProps = {
  event: mockEvent,
  areHeaderButtonsDisabled: false,
  isEditMode: false,
  gameScores: { orgScore: 3, opponentScore: 0 },
  penaltyShootoutActivities: {
    localPenaltyLists: { homePenalties: [], awayPenalties: [] },
    apiPenaltyLists: { homePenalties: [], awayPenalties: [] },
  },
  setGameScores: jest.fn(),
  enableEditMode: jest.fn(),
  handleOnSaveReport: jest.fn(),
  handleRevertingReportChanges: jest.fn(),
  t: i18nextTranslateStub(),
};

const teamPlayers = [
  {
    id: 1,
    fullname: 'Stone Cold Steve Austin',
    birthyear: '2002',
    position: { id: 4, abbreviation: 'GK' },
    jersey: 11,
    designation: 'Primary',
    date_of_birth: '28 Feb 2021',
  },
  {
    id: 2,
    fullname: 'Cody Rhodes',
    birthyear: '2002',
    position: { id: 5, abbreviation: 'GK' },
    jersey: 11,
    designation: 'Primary',
  },
  {
    id: 3,
    fullname: 'Roman Reigns',
    birthyear: '2001',
    position: { id: 6, abbreviation: 'GK' },
    jersey: 11,
    designation: 'Primary',
  },
];

const mockStaff = [
  {
    id: 1,
    user: {
      id: 1,
      fullname: 'Paul Levesque',
      role: 'The Boss',
    },
  },
];

export const defaultStore = {
  planningEvent: {
    gameActivities: { localGameActivities: [] },
    eventPeriods: {
      apiEventPeriods: [
        { absolute_duration_start: 0, absolute_duration_end: 90 },
      ],
    },
    pitchView: {
      teams: {
        home: {
          ...defaultTeamPitchInfo.home,
          players: [teamPlayers[0], teamPlayers[1]],
          listPlayers: [teamPlayers[0], teamPlayers[1]],
          staff: mockStaff,
        },
        away: {
          ...defaultTeamPitchInfo.away,
          players: [teamPlayers[2]],
          listPlayers: [teamPlayers[2]],
          staff: mockStaff,
        },
      },
      pitchActivities: [],
    },
  },
};
