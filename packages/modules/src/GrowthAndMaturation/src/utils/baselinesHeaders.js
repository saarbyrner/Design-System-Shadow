// @flow
import { mapHeaderKeysToColumnDef } from '@kitman/modules/src/shared/MassUpload/New/utils';

const baselinesHeaders = mapHeaderKeysToColumnDef([
  'athlete_id',
  'athlete_first_name',
  'athlete_last_name',
  'date_of_birth_of_player',
  'gender',
  'method_for_assessing_mothers_height',
  'biological_mothers_height_cm',
  'method_for_assessing_fathers_height',
  'biological_fathers_height_cm',
]);

export default baselinesHeaders;
