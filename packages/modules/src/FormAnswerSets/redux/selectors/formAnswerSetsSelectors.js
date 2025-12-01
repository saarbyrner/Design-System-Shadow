// @flow

import {
  REDUCER_KEY,
  type FormAnswerSetsState,
  type DateRange,
} from '../slices/formAnswerSetsSlice';

type Store = {
  [typeof REDUCER_KEY]: FormAnswerSetsState,
};

export const getFilters = (state: Store): Object => {
  return state[REDUCER_KEY];
};

export const selectAthleteStatusFilter = (state: Store): ?string => {
  return state[REDUCER_KEY].athlete_status;
};

export const selectFormCategoryFilter = (state: Store): ?number => {
  return state[REDUCER_KEY].form_category_id;
};

export const selectFormFilter = (state: Store): ?number | Array<number> => {
  return state[REDUCER_KEY].form_id;
};

export const selectAthleteFilter = (state: Store): ?number | Array<number> => {
  return state[REDUCER_KEY].athlete_id;
};

export const selectStatusesFilter = (state: Store): Array<string> => {
  return state[REDUCER_KEY].statuses;
};

export const selectDateRangeFilter = (state: Store): ?DateRange => {
  return state[REDUCER_KEY].date_range;
};
