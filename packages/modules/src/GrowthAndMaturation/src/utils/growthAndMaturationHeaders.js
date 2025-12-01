// @flow
import { mapHeaderKeysToColumnDef } from '@kitman/modules/src/shared/MassUpload/New/utils';

const growthAndMaturationHeaders = mapHeaderKeysToColumnDef([
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
]);

export default growthAndMaturationHeaders;
