// @flow
export type FilterValidations = {
  training_variable_ids: {
    isValid: boolean,
    errorMessage: string,
  },
  seasons: {
    isValid: boolean,
    errorMessage: string,
  },
  testing_window_ids: {
    isValid: boolean,
    errorMessage: string,
  },
  age_group_ids: {
    isValid: boolean,
    errorMessage: string,
  },
  club_results?: {
    isValid: boolean,
    errorMessage: string,
  },
  compare_to_seasons?: {
    isValid: boolean,
    errorMessage: string,
  },
  compare_to_testing_window_ids?: {
    isValid: boolean,
    errorMessage: string,
  },
};

export type BioBandOption = { value: Array<number>, label: string };
