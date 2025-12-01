// @flow
import { data as mockedPositionGroups } from '@kitman/services/src/mocks/handlers/getPositionGroups';

export const validData = [
  {
    athlete_id: 1,
    athlete_first_name: 'John',
    athlete_last_name: 'Doe',
    date_of_test: '2023-01-09',
    player_exempt: true,
    '05m_sprint': 1,
    '10m_sprint': 2,
    '20m_sprint': 2,
    '30m_sprint': 3,
    '505_agility_right': 2,
    '505_agility_left': 2,
    cmj_optojump: 1,
    cmj_vald: 1,
    cmj_flight_time: 100,
    yo_yo_intermittent_recovery_test_level_1: 1,
    yo_yo_intermittent_recovery_test_level_2: 1,
    player_position: mockedPositionGroups[0].name,
    agility_arrow_head_left: 6,
    agility_arrow_head_right: 6,
  },
];

export const invalidData = [
  {
    athlete_id: 1,
    athlete_first_name: 'John',
    athlete_last_name: 'Doe',
    date_of_test: '01-09-2023',
    player_exempt: undefined,
    player_position: null,
    '05m_sprint': 100,
    '10m_sprint': 100,
    '20m_sprint': 100,
    '30m_sprint': 100,
    '505_agility_right': 100,
    '505_agility_left': 100,
    cmj_optojump: 100,
    cmj_vald: 100,
    cmj_flight_time: 100,
    yo_yo_intermittent_recovery_test_level_1: 100,
    yo_yo_intermittent_recovery_test_level_2: 100,
    agility_arrow_head_left: 100,
    agility_arrow_head_right: 100,
  },
];

export const data = {
  validData,
  invalidData,
};
