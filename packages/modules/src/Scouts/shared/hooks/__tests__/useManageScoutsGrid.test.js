import { renderHook, act } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import store from '../../redux/store';
import { data as mockData } from '../../redux/services/mocks/data/mock_scout_list';

import useManageScoutsGrid, { getEmptyTableText } from '../useManageScoutsGrid';

jest.useFakeTimers();

const defaultFilter = {
  search_expression: '',
  is_active: true,
  per_page: 30,
  page: 1,
  types: ['scout'],
};

const wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;

describe('useManageScoutsGrid', () => {
  describe('[initial data]', () => {
    let renderHookResult;

    it('returns initial data', async () => {
      await act(async () => {
        renderHookResult = renderHook(() => useManageScoutsGrid({}), {
          wrapper,
        }).result;
      });

      const expectedData = {
        isScoutsListFetching: expect.any(Boolean),
        isScoutsListError: expect.any(Boolean),
        filteredSearchParams: {
          search_expression: '',
          per_page: expect.any(Number),
          page: expect.any(Number),
          is_active: expect.any(Boolean),
          types: ['scout'],
        },
        onUpdateFilter: expect.any(Function),
        onHandleFilteredSearch: expect.any(Function),
        grid: {
          rows: expect.anything(),
          columns: expect.anything(),
          emptyTableText: 'No scouts have been registered yet',
          id: 'ManageScoutsGrid',
        },
        meta: {
          current_page: expect.any(Number),
          next_page: null,
          prev_page: null,
          total_count: expect.any(Number),
          total_pages: expect.any(Number),
        },
      };

      expect(renderHookResult.current).toEqual(
        expect.objectContaining(expectedData)
      );
    });
  });

  describe('[computed data]', () => {
    let renderHookResult;

    afterEach(() => {
      jest.clearAllTimers();
    });

    it('fetches the scouts', async () => {
      await act(async () => {
        renderHookResult = renderHook(() => useManageScoutsGrid({}), {
          wrapper,
        }).result;
      });

      await act(async () => {
        renderHookResult.current.onHandleFilteredSearch({});
      });

      await act(async () => {
        expect(renderHookResult.current.grid.rows.length).toEqual(
          mockData.length
        );
      });
    });

    it('has the correct grid.rows', async () => {
      await act(async () => {
        renderHookResult = renderHook(() => useManageScoutsGrid({}), {
          wrapper,
        }).result;
      });

      await act(async () => {
        renderHookResult.current.onHandleFilteredSearch({});
      });

      await act(async () => {
        expect(renderHookResult.current.grid.rows.length).toEqual(
          mockData.length
        );
        const rows = renderHookResult.current.grid.rows;
        expect(rows[0].id).toEqual(mockData[0].id);
      });
    });

    it('has the correct columns', async () => {
      await act(async () => {
        renderHookResult = renderHook(() => useManageScoutsGrid({}), {
          wrapper,
        }).result;
      });

      expect(renderHookResult.current.grid.columns).toHaveLength(5);
      const columns = renderHookResult.current.grid.columns;
      expect(columns[0].id).toEqual('fullname');
      expect(columns[1].id).toEqual('username');
      expect(columns[2].id).toEqual('email');
      expect(columns[3].id).toEqual('created_at');
      expect(columns[4].id).toEqual('edit');
    });
  });

  describe('[FILTERS]', () => {
    let renderHookResult;

    beforeEach(async () => {
      jest.useFakeTimers();

      await act(async () => {
        renderHookResult = renderHook(() => useManageScoutsGrid({}), {
          wrapper,
        }).result;
      });

      await act(async () => {
        renderHookResult.current.onHandleFilteredSearch({});
      });
    });

    afterEach(() => {
      jest.clearAllTimers();
    });

    it('correctly updates the filter for search_expression', async () => {
      await act(async () => {
        renderHookResult.current.onUpdateFilter({
          search_expression: 'Hi',
        });
      });

      await act(async () => {
        expect(renderHookResult.current.filteredSearchParams).toEqual({
          ...defaultFilter,
          search_expression: 'Hi',
        });
      });
    });
  });
});

describe('getEmptyTableText', () => {
  it('show the correct text when the filter is empty', () => {
    expect(getEmptyTableText({ search_expression: '' })).toEqual(
      'No scouts have been registered yet'
    );
  });
  it('show the correct text when the table is filtered', () => {
    expect(getEmptyTableText({ search_expression: 'search term' })).toEqual(
      'No scouts match the search criteria'
    );
  });
});
