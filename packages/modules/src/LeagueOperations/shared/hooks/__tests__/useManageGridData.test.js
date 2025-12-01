import { renderHook, act } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';

import {
  REDUCER_KEY,
  useSearchOrganisationListQuery,
} from '@kitman/modules/src/LeagueOperations/shared/redux/api/leagueOperations';
import { useFetchRegistrationGridsQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGridApi';
import { response } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_organisations_list';
import useManageGridData from '../useManageGridData';

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/leagueOperations',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/api/leagueOperations'
    ),
    useSearchOrganisationListQuery: jest.fn(),
  })
);
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGridApi',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGridApi'
    ),
    useFetchRegistrationGridsQuery: jest.fn(),
  })
);
jest.mock('@kitman/common/src/hooks/useSquadScopedPersistentState');

const filters = {
  organisation_ids: null,
  page: 1,
  per_page: 30,
  registration_status: '',
  registration_system_status_id: null,
  search_expression: '',
  squad_ids: null,
};

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = storeFake({
  [REDUCER_KEY]: {
    useSearchOrganisationListQuery: jest.fn(),
  },
  'LeagueOperations.registration.api.grids': {
    useFetchRegistrationGridsQuery: jest.fn(),
  },
  globalApi: {},
});

const wrapper = ({ children }) => {
  return <Provider store={defaultStore}>{children}</Provider>;
};

describe('useManageGridData', () => {
  beforeEach(() => {
    useSearchOrganisationListQuery.mockReturnValue({
      data: response,
    });
    useFetchRegistrationGridsQuery.mockReturnValue({
      data: {},
      isLoading: false,
      isFetching: false,
      isError: false,
    });
  });

  it('has a correct default state', () => {
    const result = renderHook(
      () =>
        useManageGridData({
          initialFilters: filters,
          useSearchQuery: () => ({
            data: {},
            isLoading: false,
            isFetching: false,
            isError: false,
          }),
          gridQueryParams: { key: '', userType: '' },
        }),
      {
        wrapper,
      }
    ).result;
    expect(result.current.response).toEqual({});
    expect(result.current.filters).toEqual(filters);
    expect(result.current.actions).toEqual({
      onSearch: expect.any(Function),
      onUpdate: expect.any(Function),
      onScroll: expect.any(Function),
    });
    expect(result.current.requestStatus).toEqual({
      isLoading: false,
      isFetching: false,
      isError: false,
    });
    expect(result.current.noResultsMessage).toEqual(
      'No results match the search criteria.'
    );
  });

  it('returns the data when loaded', () => {
    const result = renderHook(
      () =>
        useManageGridData({
          initialFilters: filters,
          useSearchQuery: () => ({
            data: response,
            isLoading: false,
            isFetching: false,
            isError: false,
          }),
          gridQueryParams: { key: '' },
        }),
      {
        wrapper,
      }
    ).result;
    expect(result.current.response).toEqual(response);
  });

  it('returns the error state', () => {
    const result = renderHook(
      () =>
        useManageGridData({
          initialFilters: filters,
          useSearchQuery: () => ({
            data: response,
            isLoading: false,
            isFetching: false,
            isError: true,
          }),
          gridQueryParams: { key: '' },
        }),
      {
        wrapper,
      }
    ).result;
    expect(result.current.requestStatus.isError).toEqual(true);
  });

  it('returns the loading state', () => {
    const result = renderHook(
      () =>
        useManageGridData({
          initialFilters: filters,
          useSearchQuery: () => ({
            data: response,
            isLoading: true,
            isFetching: false,
            isError: false,
          }),
          gridQueryParams: { key: '' },
        }),
      {
        wrapper,
      }
    ).result;
    expect(result.current.requestStatus.isLoading).toEqual(true);
  });

  it('returns the fetching state', () => {
    const result = renderHook(
      () =>
        useManageGridData({
          initialFilters: filters,
          useSearchQuery: () => ({
            data: response,
            isLoading: false,
            isFetching: true,
            isError: false,
          }),
          gridQueryParams: { key: '' },
        }),
      {
        wrapper,
      }
    ).result;
    expect(result.current.requestStatus.isFetching).toEqual(true);
  });

  it('correctly updates the filter for search_expression', async () => {
    const result = renderHook(
      () =>
        useManageGridData({
          initialFilters: filters,
          useSearchQuery: () => ({
            data: response,
            isLoading: false,
            isFetching: true,
            isError: false,
          }),
          gridQueryParams: { key: '' },
        }),
      {
        wrapper,
      }
    ).result;

    await act(async () => {
      result.current.actions.onUpdate({
        search_expression: 'Hi',
      });
    });

    expect(result.current.filters).toEqual({
      ...filters,
      search_expression: 'Hi',
    });
  });

  it('handles scroll event correctly', async () => {
    const result = renderHook(
      () =>
        useManageGridData({
          initialFilters: filters,
          useSearchQuery: () => ({
            data: response,
            isLoading: false,
            isFetching: false,
            isError: false,
          }),
          gridQueryParams: { key: '' },
        }),
      {
        wrapper,
      }
    ).result;

    await act(async () => {
      result.current.actions.onScroll();
    });

    expect(result.current.filters).toEqual(filters);
    expect(result.current.requestStatus.isFetching).toEqual(false); // No change in fetching state
    expect(result.current.requestStatus.isLoading).toEqual(false); // No change in loading state
    expect(result.current.requestStatus.isError).toEqual(false); // No change in error state
    expect(result.current.response).toEqual(response); // No change in response <datalist></datalist>
  });

  it('does not update filters if onSearch is called with null or undefined', async () => {
    const result = renderHook(
      () =>
        useManageGridData({
          initialFilters: filters,
          useSearchQuery: () => ({
            data: response,
            isLoading: false,
            isFetching: false,
            isError: false,
          }),
          gridQueryParams: { key: '' },
        }),
      {
        wrapper,
      }
    ).result;

    await act(async () => {
      result.current.actions.onSearch(null);
    });

    expect(result.current.filters).toEqual(filters);

    await act(async () => {
      result.current.actions.onSearch(undefined);
    });

    expect(result.current.filters).toEqual(filters);
  });

  it('triggers a debounced search when onSearch is called', async () => {
    jest.useFakeTimers();

    const result = renderHook(
      () =>
        useManageGridData({
          initialFilters: filters,
          useSearchQuery: () => ({
            data: response,
            isLoading: false,
            isFetching: false,
            isError: false,
          }),
          gridQueryParams: { key: '' },
        }),
      {
        wrapper,
      }
    ).result;

    await act(async () => {
      result.current.actions.onSearch({
        search_expression: 'DebounceTest',
      });
    });

    expect(result.current.filters).toEqual({
      ...filters,
      search_expression: 'DebounceTest',
    });

    jest.runAllTimers();
    jest.useRealTimers();
  });

  it('updates filters correctly when onSearch is called', async () => {
    const result = renderHook(
      () =>
        useManageGridData({
          initialFilters: filters,
          useSearchQuery: () => ({
            data: response,
            isLoading: false,
            isFetching: false,
            isError: false,
          }),
          gridQueryParams: { key: '' },
        }),
      {
        wrapper,
      }
    ).result;

    await act(async () => {
      result.current.actions.onSearch({
        search_expression: 'Test',
        page: 2,
      });
    });

    expect(result.current.filters).toEqual({
      ...filters,
      search_expression: 'Test',
      page: 2,
    });
  });

  it('should handle bulk action mapping', () => {
    const mockData = {
      data: [
        { id: 1, user_id: 101 },
        { id: 2, user_id: 102 },
      ],
      meta: {},
    };
    const mockInitialFilters = {
      search_expression: '',
      page: 1,
      per_page: 10,
    };
    const mockSearchQuery = jest.fn();
    mockSearchQuery.mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
      isFetching: false,
    });

    const { result } = renderHook(
      () =>
        useManageGridData({
          initialFilters: mockInitialFilters,
          useSearchQuery: mockSearchQuery,
          gridQueryParams: { grid: 'test-grid' },
          bulkAction: 'athlete',
        }),
      { wrapper }
    );

    expect(result.current.rowIdToUserIdMap.get(1)).toBe(101);
    expect(result.current.rowIdToUserIdMap.get(2)).toBe(102);
  });
});
