// @flow
import { mapHeaderKeysToColumnDef } from '@kitman/modules/src/shared/MassUpload/New/utils';

const benchmarkHeaders = mapHeaderKeysToColumnDef([
  'athlete_id',
  'athlete_first_name',
  'athlete_last_name',
  'squad',
  'date_of_test',
  'player_exempt',
  '05m_sprint',
  '10m_sprint',
  '20m_sprint',
  '30m_sprint',
  '505_agility_right',
  '505_agility_left',
  'cmj_optojump',
  'cmj_vald',
  'cmj_flight_time',
  'yo_yo_intermittent_recovery_test_level_1',
  'yo_yo_intermittent_recovery_test_level_2',
  'player_position',
  'agility_arrow_head_left',
  'agility_arrow_head_right',
]);

export default benchmarkHeaders;
