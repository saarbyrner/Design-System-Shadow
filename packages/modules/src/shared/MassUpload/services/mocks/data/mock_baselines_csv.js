// @flow
export const validData = [
  {
    athlete_id: 1,
    athlete_first_name: 'John',
    athlete_last_name: 'Doe',
    date_of_birth_of_player: '2023-01-09',
    gender: 'Male',
    method_for_assessing_mothers_height: 'Measured by staff',
    biological_mothers_height_cm: 170,
    method_for_assessing_fathers_height: 'Not available',
    biological_fathers_height_cm: null,
  },
];

export const invalidData = [
  {
    athlete_id: 1,
    athlete_first_name: 'John',
    athlete_last_name: 'Doe',
    date_of_birth_of_player: 'today',
    gender: 'Something',
    method_for_assessing_mothers_height: 'Measured by staff',
    biological_mothers_height_cm: 170,
    method_for_assessing_fathers_height: 'Measured by staff',
    biological_fathers_height_cm: 170,
  },
];

export const invalidDataWithInvalidHeight = [
  {
    athlete_id: 1,
    athlete_first_name: 'John',
    athlete_last_name: 'Doe',
    date_of_birth_of_player: '2023-01-09',
    gender: 'Male',
    method_for_assessing_mothers_height: 'Measured by staff',
    biological_mothers_height_cm: 'N/A',
    method_for_assessing_fathers_height: 'Measured by staff',
    biological_fathers_height_cm: '170',
  },
];

export const data = {
  validData,
  invalidData,
  invalidDataWithInvalidHeight,
};
