import filtersReducer, {
  initialState,
  setFilter,
  applyFilters,
} from '../filters';

describe('BenchmarkReport|FilterSlice', () => {
  it('should update state on setFilter()', () => {
    const action = setFilter({
      key: 'training_variables_ids',
      value: [1],
    });
    const expectedState = {
      ...initialState,
      editable: {
        ...initialState.editable,
        training_variables_ids: [1],
      },
    };

    expect(filtersReducer(initialState, action)).toEqual(expectedState);
  });

  it('should update state on applyFilters()', () => {
    const action = applyFilters();

    const currentState = {
      ...initialState,
      editable: {
        ...initialState.editable,
        training_variables_ids: [1, 2, 3],
        seasons: [1, 2],
        testing_window_ids: [1],
        age_group_ids: [1, 2],
        maturation_status_ids: [1, 4],
        national_results: true,
      },
    };

    const expectedState = {
      active: {
        ...initialState.active,
        training_variables_ids: [1, 2, 3],
        seasons: [1, 2],
        testing_window_ids: [1],
        age_group_ids: [1, 2],
        maturation_status_ids: [1, 4],
        national_results: true,
      },
      editable: {
        ...initialState.editable,
        training_variables_ids: [1, 2, 3],
        seasons: [1, 2],
        testing_window_ids: [1],
        age_group_ids: [1, 2],
        maturation_status_ids: [1, 4],
        national_results: true,
      },
    };

    expect(filtersReducer(currentState, action)).toEqual(expectedState);
  });
});
