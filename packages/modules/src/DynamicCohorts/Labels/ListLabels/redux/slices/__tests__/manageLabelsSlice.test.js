import manageLabelsSlice, {
  onOpenLabelModal,
  onCloseLabelModal,
  setFilter,
  setNextId,
  resetNextId,
} from '../manageLabelsSlice';

describe('manageLabelsSlice', () => {
  const initialState = {
    isLabelModalOpen: false,
    nextId: null,
    filters: {
      searchValue: '',
      createdBy: [],
    },
  };

  const updatedNextId = 1234;

  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = initialState;

    expect(manageLabelsSlice.reducer(initialState, action)).toEqual(
      expectedState
    );
  });

  it('should open the label modal', () => {
    const action = onOpenLabelModal();
    const openedState = manageLabelsSlice.reducer(initialState, action);
    expect(openedState).toEqual({ ...initialState, isLabelModalOpen: true });
  });

  it('should close the label modal', () => {
    const action = onCloseLabelModal();
    const closedState = manageLabelsSlice.reducer(
      { ...initialState, isLabelModalOpen: true },
      action
    );
    expect(closedState).toEqual(initialState);
  });

  it('should set the filters at the given key', () => {
    const updatedSearchValue = 'my updated value';
    const action = setFilter({ key: 'searchValue', value: updatedSearchValue });
    const filteredState = manageLabelsSlice.reducer(initialState, action);
    expect(filteredState).toEqual({
      isLabelModalOpen: initialState.isLabelModalOpen,
      nextId: null,
      filters: {
        searchValue: updatedSearchValue,
        createdBy: initialState.filters.createdBy,
      },
    });
  });

  it('should set the next id properly', () => {
    const action = setNextId(updatedNextId);
    const newNextId = manageLabelsSlice.reducer(initialState, action);
    expect(newNextId).toEqual({ ...initialState, nextId: updatedNextId });
  });

  it('should reset the next id', () => {
    const action = resetNextId();
    const newNextId = manageLabelsSlice.reducer(
      { ...initialState, nextId: updatedNextId },
      action
    );
    expect(newNextId).toEqual(initialState);
  });
});
