// @flow
export const validData = [
  {
    athlete_id: 1,
    athlete_first_name: 'John',
    athlete_last_name: 'Doe',
    date_measured: '2023-01-09',
    measured_by_user_id_optional: 1,
    head_attire_worn: 'yes',
    standing_height_1_cm: 100,
    standing_height_2_cm: 105,
    standing_height_3_cm: 104,
    box_height_cm: 100,
    sitting_height_1_cm: 100,
    sitting_height_2_cm: 100,
    sitting_height_3_cm: '',
    leg_length_1_cm_optional: 100,
    leg_length_2_cm_optional: 100,
    leg_length_3_cm_optional: 100,
    weight_1_kg: 100,
    weight_2_kg: 100,
    weight_3_kg: '',
  },
];

export const invalidData = [
  {
    athlete_id: 1,
    athlete_first_name: 'John',
    athlete_last_name: 'Doe',
    date_measured: '01/09',
    measured_by_user_id_optional: 1,
    head_attire_worn: 'yes',
    standing_height_1_cm: 100,
    standing_height_2_cm: 200,
    standing_height_3_cm: 100,
    box_heigh_cmt: 100,
    sitting_height_1_cm: 100,
    sitting_height_2_cm: 100,
    sitting_height_3_cm: 100,
    leg_length_1_cm_optional: 100,
    leg_length_2_cm_optional: 100,
    leg_length_3_cm_optional: 100,
    weight_1_kg: 100,
    weight_2_kg: 100,
    weight_3_kg: 100,
  },
];

export const data = {
  validData,
  invalidData,
};
