// @flow
import { IMPORT_TYPES } from './consts';

const getExpectedHeaders = (
  importType: $Values<typeof IMPORT_TYPES>
): Array<string> => {
  switch (importType) {
    case IMPORT_TYPES.Baselines:
      return [
        'athlete_id',
        'athlete_first_name',
        'athlete_last_name',
        'date_of_birth_of_player',
        'gender',
        'method_for_assessing_mothers_height',
        'biological_mothers_height_cm',
        'method_for_assessing_fathers_height',
        'biological_fathers_height_cm',
      ];
    case IMPORT_TYPES.LeagueBenchmarking:
      return [
        'athlete_id',
        'athlete_first_name',
        'athlete_last_name',
        'squad',
        'date_of_test',
        'player_exempt',
        'player_position',
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
        'agility_arrow_head_left',
        'agility_arrow_head_right',
      ];
    case IMPORT_TYPES.GrowthAndMaturation:
      return [
        'athlete_id',
        'athlete_first_name',
        'athlete_last_name',
        'date_measured',
        'measured_by_user_id_optional',
        'head_attire_worn',
        'standing_height_1_cm',
        'standing_height_2_cm',
        'standing_height_3_cm',
        'box_height_cm',
        'sitting_height_1_cm',
        'sitting_height_2_cm',
        'sitting_height_3_cm',
        'leg_length_1_cm_optional',
        'leg_length_2_cm_optional',
        'leg_length_3_cm_optional',
        'weight_1_kg',
        'weight_2_kg',
        'weight_3_kg',
      ];
    case IMPORT_TYPES.TrainingVariablesAnswer:
      return ['id', 'first_name', 'last_name', 'time_measured'];

    case IMPORT_TYPES.LeagueGame:
      return [
        'Match ID',
        'Competition',
        'Match Day',
        'Date Time',
        'Kick Time',
        'Timezone',
        'Duration',
        'Home Team',
        'Away Team',
        'Home Squad',
        'Away Squad',
        'Venue',
        'TV',
        'Match Director',
        'Referee',
        'AR1',
        'AR2',
        '4th Official',
        'VAR',
        'AVAR',
        'Notification Recipient',
        'Hide from club',
      ];
    case IMPORT_TYPES.KitMatrix:
      return [
        'Type',
        'Club',
        'Season',
        'Kit name',
        'Kit Color',
        'Jersey Color',
        'Jersey URL',
        'Shorts Color',
        'Shorts URL',
        'Socks Color',
        'Socks URL',
      ];
    default:
      return [];
  }
};

export default getExpectedHeaders;
