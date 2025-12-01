// @flow

import { jest } from '@jest/globals';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

export const commonProps = {
  isOpen: true,
  eventConditions: { temperature_units: 20 },
  createNewEventType: 'session_event',
  onUpdatedEventTimeInfoCallback: jest.fn(),
  onUpdatedEventTitleCallback: jest.fn(),
  onUpdatedEventDetailsCallback: jest.fn(),
  onSaveEventSuccess: jest.fn(),
  onClose: jest.fn(),
  onFileUploadStart: jest.fn(),
  onFileUploadSuccess: jest.fn(),
  onFileUploadFailure: jest.fn(),
  removeFileUploadToast: jest.fn(),
  t: i18nextTranslateStub(),
};

const localTimezone = 'Europe/Dublin';
const startDate = '2021-07-12T10:00:16+00:00';
const title = '';

export const sessionEvent = {
  id: '1',
  type: 'session_event',
  title,
  workload_type: 1,
  session_type: {
    id: 1,
    name: 'some session',
  },
  local_timezone: localTimezone,
  are_participants_duplicated: false,
  start_date: startDate,
  duration: 20,
};

const gameAndSavedGameCommonFields = {
  type: 'game_event',
  id: 2,
  title,
  turnaround_prefix: '',
  turnaround_fixture: true,
  local_timezone: localTimezone,
  start_date: startDate,
};

export const gameEvent = {
  ...gameAndSavedGameCommonFields,
  competition_id: undefined,
  duration: 60,
  number_of_periods: 2,
  score: 5,
  opponent_score: 2,
  venue_type: { id: 2, name: 'Away' },
  organisation_team: { id: 1479, name: 'Club Team' },
  opponent_team: { id: 76, name: 'Australia' },
  competition: {
    competition_categories: [],
    id: 2,
    name: 'Cup',
  },
  competition_category: undefined,
  competition_category_id: undefined,
  event_location: undefined,
  custom_opposition_name: '',
  league_setup: false,
};

export const gameEventWithCustomLocalPeriods = {
  ...gameEvent,
  id: undefined,
  custom_periods: [
    {
      name: 'Period 1',
      duration: 30,
      absolute_duration_start: 0,
      absolute_duration_end: 30,
    },
    {
      name: 'Period 2',
      duration: 30,
      absolute_duration_start: 30,
      absolute_duration_end: 60,
    },
  ],
  custom_period_duration_enabled: false,
};

export const savedGameEvent = {
  event: {
    ...gameAndSavedGameCommonFields,
    duration: 100,
    number_of_periods: 3,
    attachments: [
      { attachment: { confirmed: false, id: 10, name: 'test name' } },
    ],
    opponent_team: {
      id: 10,
      name: 'Chelsea',
    },
  },
};

export const customPeriodsSaved = [
  {
    absolute_duration_end: 80,
    absolute_duration_start: 0,
    additional_duration: null,
    duration: 80,
    id: 10,
    name: 'Period 1',
    order: 9,
  },
  {
    absolute_duration_end: 110,
    absolute_duration_start: 80,
    additional_duration: null,
    duration: 30,
    id: 10,
    name: 'Period 2',
    order: 9,
  },
];

export const periodMock = [
  {
    id: 10,
    name: 'Period 1',
    duration: 30,
    additional_duration: null,
    order: 9,
    absolute_duration_start: 0,
    absolute_duration_end: 30,
  },
  {
    id: 10,
    name: 'Period 11',
    duration: 30,
    additional_duration: null,
    order: 9,
    absolute_duration_start: 30,
    absolute_duration_end: 60,
  },
];

export const gameEventWithCustomSavedPeriods = {
  ...gameEvent,
  custom_periods: periodMock,
  custom_period_duration_enabled: false,
};

export const undefinedFields = {
  attachments_attributes: undefined,
  are_participants_duplicated: undefined,
  athlete_events_count: undefined,
  competition_category: undefined,
  competition_category_id: undefined,
  custom_event_type_id: undefined,
  description: undefined,
  duplicate_event_activities: undefined,
  duplicated_event_id: undefined,
  event_location: undefined,
  event_location_id: undefined,
  fas_game_key: undefined,
  field_condition: undefined,
  humidity: undefined,
  id: undefined,
  mls_game_key: undefined,
  nfl_equipment_id: undefined,
  nfl_location_feed_id: undefined,
  nfl_location_id: undefined,
  nfl_surface_composition_id: undefined,
  nfl_surface_type_id: undefined,
  no_participants: undefined,
  opponent_squad: undefined,
  organisation_fixture_rating_id: undefined,
  organisation_format_id: undefined,
  round_number: undefined,
  surface_quality: undefined,
  surface_type: undefined,
  temperature: undefined,
  weather: undefined,
  workload_units: undefined,
};
