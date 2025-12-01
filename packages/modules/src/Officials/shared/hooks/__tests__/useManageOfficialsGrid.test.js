import { renderHook, act } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import store from '../../redux/store';
import { data as mockData } from '../../redux/services/mocks/data/mock_official_list';

import useManageOfficialsGrid, {
  getEmptyTableText,
} from '../useManageOfficialsGrid';

jest.useFakeTimers();

const defaultFilter = {
  search_expression: '',
  is_active: true,
  per_page: 30,
  page: 1,
};

const wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;

describe('useManageOfficialsGrid', () => {
  describe('[initial data]', () => {
    let renderHookResult;

    it('returns initial data', async () => {
      await act(async () => {
        renderHookResult = renderHook(() => useManageOfficialsGrid({}), {
          wrapper,
        }).result;
      });

      const expectedData = {
        isOfficialsListFetching: expect.any(Boolean),
        isOfficialsListError: expect.any(Boolean),
        filteredSearchParams: {
          search_expression: '',
          per_page: expect.any(Number),
          page: expect.any(Number),
          is_active: expect.any(Boolean),
        },
        onUpdateFilter: expect.any(Function),
        onHandleFilteredSearch: expect.any(Function),
        grid: {
          rows: expect.anything(),
          columns: expect.anything(),
          emptyTableText: 'No officials have been registered yet',
          id: 'ManageOfficialsGrid',
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

    it('fetches the officials', async () => {
      await act(async () => {
        renderHookResult = renderHook(() => useManageOfficialsGrid({}), {
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
        renderHookResult = renderHook(() => useManageOfficialsGrid({}), {
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
        expect(rows[1].id).toEqual(mockData[1].id);
      });
    });

    it('has the correct columns', async () => {
      await act(async () => {
        renderHookResult = renderHook(() => useManageOfficialsGrid({}), {
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
        renderHookResult = renderHook(() => useManageOfficialsGrid({}), {
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
  describe('when viewing active officials', () => {
    it('show the correct text when the filter is empty', () => {
      expect(getEmptyTableText({ search_expression: '' }, true)).toEqual(
        'No officials have been registered yet'
      );
    });
    it('show the correct text when the table is filtered', () => {
      expect(
        getEmptyTableText({ search_expression: 'search term' }, true)
      ).toEqual('No officials match the search criteria');
    });
  });
  describe('when viewing inactive officials', () => {
    it('show the correct text when the filter is empty', () => {
      expect(getEmptyTableText({ search_expression: '' }, false)).toEqual(
        'No inactive officials found'
      );
    });
    it('show the correct text when the table is filtered', () => {
      expect(
        getEmptyTableText({ search_expression: 'search term' }, false)
      ).toEqual('No officials match the search criteria');
    });
  });
});
