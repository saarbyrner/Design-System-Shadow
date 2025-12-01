import { ExportTypeValues } from '@kitman/services/src/services/exports/generic/redux/services/types';

export const requestBody = {
  ids: [1, 2, 3],
  filename: 'exampleFileName',
  export_type: ExportTypeValues.ATHLETE_PROFILE,
  fields: [
    { object: 'athlete', field: 'date_of_birth' },
    { object: 'emergency_contacts', field: 'name' },
  ],
};

export default requestBody;
