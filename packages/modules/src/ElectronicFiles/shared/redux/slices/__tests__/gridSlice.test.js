import structuredClone from 'core-js/stable/structured-clone';
import { MENU_ITEM } from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sidebarSlice';
import gridSlice, {
  updateStateFilter,
  updatePersistedFilter,
  updatePagination,
  copyPersistedFiltersToStateFilters,
  resetPersistedFilters,
  resetStateFilters,
  defaultFiltersGrouped,
  defaultPagination,
} from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/gridSlice';

const initialState = {
  filters: {
    stateFilters: {
      inbox: null,
      sent: null,
    },
    persistedFilters: defaultFiltersGrouped,
  },
  pagination: defaultPagination,
};

const mockGetItem = jest.fn();
const mockSetItem = jest.fn();

describe('[gridSlice]', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: mockGetItem,
        setItem: mockSetItem,
      },
    });
  });
  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = initialState;

    expect(gridSlice.reducer(initialState, action)).toEqual(expectedState);
  });

  it('should correctly update a state filter', () => {
    const actionToSearch = updateStateFilter({
      selectedMenuItem: MENU_ITEM.inbox,
      partialFilter: { query: 'dummy' },
    });
    const stateToSearch = gridSlice.reducer(initialState, actionToSearch);
    expect(stateToSearch.filters.stateFilters.inbox.query).toEqual('dummy');
  });

  it('should correctly update a persisted filter', () => {
    const actionToUpdateArchived = updatePersistedFilter({
      selectedMenuItem: MENU_ITEM.inbox,
      partialFilter: { archived: true },
    });
    const stateToUpdateArchived = gridSlice.reducer(
      initialState,
      actionToUpdateArchived
    );
    expect(
      stateToUpdateArchived.filters.persistedFilters.inbox.archived
    ).toEqual(true);

    const filtersToPersist = structuredClone(
      stateToUpdateArchived.filters.persistedFilters
    );
    delete filtersToPersist.inbox.query;
    delete filtersToPersist.sent.query;

    expect(mockSetItem).toHaveBeenCalledWith(
      'EFILE|FILTERS',
      JSON.stringify({
        ...filtersToPersist,
        inbox: {
          ...filtersToPersist.inbox,
          archived: true,
        },
      })
    );
  });

  it('should correctly update pagination', () => {
    const actionToUpdatePagination = updatePagination({
      page: 3,
      per_page: 100,
    });
    const stateToUpdatePagination = gridSlice.reducer(
      initialState,
      actionToUpdatePagination
    );
    expect(stateToUpdatePagination.pagination.page).toEqual(3);
    expect(stateToUpdatePagination.pagination.per_page).toEqual(100);
  });

  it('should correctly copy persisted filters to state filters', () => {
    const actionToCopy = copyPersistedFiltersToStateFilters();
    const stateToCopy = gridSlice.reducer(initialState, actionToCopy);
    expect(stateToCopy.filters.stateFilters).toEqual(
      stateToCopy.filters.persistedFilters
    );
  });

  it('should correctly reset state filters', () => {
    const actionToSearch = updateStateFilter({
      selectedMenuItem: MENU_ITEM.sent,
      partialFilter: { query: 'dummy' },
    });
    const stateToSearch = gridSlice.reducer(initialState, actionToSearch);
    expect(stateToSearch.filters.stateFilters.sent.query).toEqual('dummy');

    const actionToReset = resetStateFilters();
    const stateToReset = gridSlice.reducer(stateToSearch, actionToReset);
    expect(stateToReset.filters.stateFilters).toEqual(
      initialState.filters.stateFilters
    );
  });

  it('should correctly reset persisted filters', () => {
    const actionToUpdateArchived = updatePersistedFilter({
      selectedMenuItem: MENU_ITEM.inbox,
      partialFilter: { archived: true },
    });
    const stateToUpdateArchived = gridSlice.reducer(
      initialState,
      actionToUpdateArchived
    );
    expect(
      stateToUpdateArchived.filters.persistedFilters.inbox.archived
    ).toEqual(true);

    const filtersToPersist = structuredClone(
      stateToUpdateArchived.filters.persistedFilters
    );
    delete filtersToPersist.inbox.query;
    delete filtersToPersist.sent.query;

    expect(mockSetItem).toHaveBeenCalledWith(
      'EFILE|FILTERS',
      JSON.stringify({
        ...filtersToPersist,
        inbox: {
          ...filtersToPersist.inbox,
          archived: true,
        },
      })
    );

    const actionToReset = resetPersistedFilters();
    const stateToReset = gridSlice.reducer(
      stateToUpdateArchived,
      actionToReset
    );
    expect(stateToReset.filters.persistedFilters).toEqual(
      initialState.filters.persistedFilters
    );

    expect(mockSetItem).toHaveBeenNthCalledWith(
      2,
      'EFILE|FILTERS',
      JSON.stringify({
        ...filtersToPersist,
        inbox: {
          ...filtersToPersist.inbox,
          archived: false,
        },
      })
    );
  });
});
