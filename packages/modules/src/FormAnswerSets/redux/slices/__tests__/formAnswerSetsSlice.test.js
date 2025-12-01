import {
  formAnswerSetsSlice,
  setCategoryFilter,
  setFormFilter,
  setStatusesFilter,
  setDateRangeFilter,
  initialState,
} from '../formAnswerSetsSlice';

describe('formAnswerSetsSlice', () => {
  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = initialState;

    expect(formAnswerSetsSlice.reducer(initialState, action)).toEqual(
      expectedState
    );
  });

  it('should correctly update state on setCategoryFilter', () => {
    const newCategory = 'rehab';
    const action = setCategoryFilter(newCategory);

    expect(formAnswerSetsSlice.reducer(initialState, action)).toEqual({
      ...initialState,
      category: newCategory,
    });
  });

  it('should correctly update state on setFormFilter', () => {
    const newForm = 1;
    const action = setFormFilter(newForm);

    expect(formAnswerSetsSlice.reducer(initialState, action)).toEqual({
      ...initialState,
      form_id: newForm,
    });
  });

  it('should correctly update state on setStatusesFilter', () => {
    const newStatuses = ['complete'];
    const action = setStatusesFilter(newStatuses);

    expect(formAnswerSetsSlice.reducer(initialState, action)).toEqual({
      ...initialState,
      statuses: newStatuses,
    });
  });

  it('should correctly update date_range on setDateRangeFilter', () => {
    const newDateRange = {
      start_date: '2024-11-08T00:00:00+00:00',
      end_date: '2024-12-01T00:00:00+00:00',
    };
    const action = setDateRangeFilter(newDateRange);

    expect(formAnswerSetsSlice.reducer(initialState, action)).toEqual({
      ...initialState,
      date_range: newDateRange,
    });
  });

  it('should correctly update date_range on setDateRangeFilter - start date only', () => {
    const newDateRange = {
      start_date: '2024-11-08T00:00:00+00:00',
      end_date: null,
    };
    const action = setDateRangeFilter(newDateRange);

    expect(formAnswerSetsSlice.reducer(initialState, action)).toEqual({
      ...initialState,
      date_range: newDateRange,
    });
  });

  it('should correctly update date_range on setDateRangeFilter - end date only', () => {
    const newDateRange = {
      start_date: null,
      end_date: '2024-12-01T00:00:00+00:00',
    };
    const action = setDateRangeFilter(newDateRange);

    expect(formAnswerSetsSlice.reducer(initialState, action)).toEqual({
      ...initialState,
      date_range: newDateRange,
    });
  });
});
