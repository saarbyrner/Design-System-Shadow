import contactsGridSlice, {
  updateFilter,
  updatePagination,
  reset,
  defaultFilters,
  defaultPagination,
} from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/contactsGridSlice';

const initialState = {
  filters: defaultFilters,
  pagination: defaultPagination,
};

describe('[contactsGridSlice]', () => {
  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = initialState;

    expect(contactsGridSlice.reducer(initialState, action)).toEqual(
      expectedState
    );
  });

  it('should correctly update a filter', () => {
    const actionToSearch = updateFilter({ query: 'dummy' });
    const stateToSearch = contactsGridSlice.reducer(
      initialState,
      actionToSearch
    );
    expect(stateToSearch.filters.query).toEqual('dummy');
  });

  it('should correctly update pagination', () => {
    const actionToUpdatePagination = updatePagination({
      page: 3,
      per_page: 100,
    });
    const stateToUpdatePagination = contactsGridSlice.reducer(
      initialState,
      actionToUpdatePagination
    );
    expect(stateToUpdatePagination.pagination.page).toEqual(3);
    expect(stateToUpdatePagination.pagination.per_page).toEqual(100);
  });

  it('should correctly reset', () => {
    const actionToSearch = updateFilter({ query: 'dummy' });
    const stateToSearch = contactsGridSlice.reducer(
      initialState,
      actionToSearch
    );
    expect(stateToSearch.filters.query).toEqual('dummy');

    const actionToReset = reset();
    const stateToReset = contactsGridSlice.reducer(
      stateToSearch,
      actionToReset
    );
    expect(stateToReset.filters).toEqual(defaultFilters);
    expect(stateToReset.pagination).toEqual(defaultPagination);
  });
});
