import manageSegmentsSlice, {
  setNextId,
  resetNextId,
  setFilter,
  getInitialState,
} from '../manageSegmentsSlice';

describe('manageSegmentsSlice', () => {
  const initialState = getInitialState();

  const updatedNextId = 1234;

  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = initialState;

    expect(manageSegmentsSlice.reducer(initialState, action)).toEqual(
      expectedState
    );
  });

  it('should set the next id properly', () => {
    const action = setNextId(updatedNextId);
    const newNextId = manageSegmentsSlice.reducer(initialState, action);
    expect(newNextId).toEqual({ ...initialState, nextId: updatedNextId });
  });

  it('should reset the next id', () => {
    const action = resetNextId();
    const newNextId = manageSegmentsSlice.reducer(
      { ...initialState, nextId: updatedNextId },
      action
    );
    expect(newNextId).toEqual(initialState);
  });

  it('should set the filters at the given key', () => {
    const updatedSearchValue = 'my updated value';
    const action = setFilter({ key: 'searchValue', value: updatedSearchValue });
    const filteredState = manageSegmentsSlice.reducer(initialState, action);
    expect(filteredState).toEqual({
      nextId: null,
      filters: {
        ...initialState.filters,
        searchValue: updatedSearchValue,
      },
    });
  });
});
