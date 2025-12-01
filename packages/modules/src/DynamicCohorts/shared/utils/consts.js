// @flow
export const getInitialFilters = () => {
  return {
    searchValue: '',
    createdBy: [],
    createdOn: null,
  };
};

export const manageLabelsStateKey = 'manageLabelsSlice';
export const manageSegmentsStateKey = 'manageSegmentsSlice';

export const duplicateNameErrorCode = 409;
