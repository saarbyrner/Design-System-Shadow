import { renderHook, act } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';

import store from '@kitman/modules/src/Imports/redux/store';
import { data as mockData } from '@kitman/services/src/mocks/handlers/searchImportsList';

import useImportsListGrid from '../useImportsListGrid';

jest.useFakeTimers();

const defaultFilter = {
  per_page: 25,
  page: 0,
  creator_ids: [],
  import_types: [],
  statuses: [],
};

const renderTestComponent = () => {
  return ({ children }) => <Provider store={store}>{children}</Provider>;
};

describe('useImportsListGrid', () => {
  describe('[initial data]', () => {
    let renderHookResult;

    it('returns initial data', async () => {
      await act(async () => {
        renderHookResult = renderHook(() => useImportsListGrid({}), {
          wrapper: renderTestComponent(),
        }).result;
      });

      expect(renderHookResult.current).toHaveProperty('isFetching');
      expect(renderHookResult.current).toHaveProperty('isLoading');
      expect(renderHookResult.current).toHaveProperty('isError');
      expect(renderHookResult.current).toHaveProperty('onHandleFilteredSearch');
      expect(renderHookResult.current).toHaveProperty('filteredSearchParams');
      expect(renderHookResult.current).toHaveProperty('onUpdateFilter');
      expect(renderHookResult.current).toHaveProperty('grid');
      expect(renderHookResult.current.grid).toHaveProperty('rows');
      expect(renderHookResult.current.grid).toHaveProperty('columns');
      expect(renderHookResult.current.grid).toHaveProperty('emptyTableText');
      expect(renderHookResult.current.grid.emptyTableText).toEqual(
        'No Imports have been made.'
      );
      expect(renderHookResult.current.grid).toHaveProperty('id');
      expect(renderHookResult.current).toHaveProperty('meta');
      expect(renderHookResult.current).toHaveProperty('filterConfig');
      expect(renderHookResult.current.filterConfig).toHaveProperty(
        'importTypeOptions'
      );
      expect(renderHookResult.current.filterConfig).toHaveProperty(
        'creatorOptions'
      );
      expect(renderHookResult.current.filterConfig).toHaveProperty(
        'statusOptions'
      );
    });
  });

  describe('[computed data]', () => {
    let renderHookResult;

    afterEach(() => {
      jest.clearAllTimers();
    });

    it('fetches the import list', async () => {
      await act(async () => {
        renderHookResult = renderHook(() => useImportsListGrid({}), {
          wrapper: renderTestComponent(),
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
        renderHookResult = renderHook(() => useImportsListGrid({}), {
          wrapper: renderTestComponent(),
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
        expect(rows[2].id).toEqual(mockData[2].id);
      });
    });

    it('has the correct columns', async () => {
      await act(async () => {
        renderHookResult = renderHook(() => useImportsListGrid({}), {
          wrapper: renderTestComponent(),
        }).result;
      });

      expect(renderHookResult.current.grid.columns).toHaveLength(7);
      const columns = renderHookResult.current.grid.columns;
      expect(columns[0].id).toEqual('name');
      expect(columns[1].id).toEqual('import_type');
      expect(columns[2].id).toEqual('created_at');
      expect(columns[3].id).toEqual('download_link');
      expect(columns[4].id).toEqual('status');
      expect(columns[5].id).toEqual('creator');
      expect(columns[6].id).toEqual('errors');
    });
  });
});

describe('[filters]', () => {
  let renderHookResult;

  beforeEach(async () => {
    jest.useFakeTimers();

    await act(async () => {
      renderHookResult = renderHook(() => useImportsListGrid({}), {
        wrapper: renderTestComponent(),
      }).result;
    });

    await act(async () => {
      renderHookResult.current.onHandleFilteredSearch({});
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('correctly set per_page for per_page', async () => {
    await act(async () => {
      renderHookResult.current.onUpdateFilter({
        per_page: 115,
      });
    });

    await act(async () => {
      expect(renderHookResult.current.filteredSearchParams).toEqual({
        ...defaultFilter,
        per_page: 115,
      });
    });
  });

  it('correctly set page for page', async () => {
    await act(async () => {
      renderHookResult.current.onUpdateFilter({
        page: 115,
      });
    });

    await act(async () => {
      expect(renderHookResult.current.filteredSearchParams).toEqual({
        ...defaultFilter,
        page: 115,
      });
    });
  });

  it('correctly set creator_ids for creator_ids', async () => {
    await act(async () => {
      renderHookResult.current.onUpdateFilter({
        creator_ids: [115],
      });
    });

    await act(async () => {
      expect(renderHookResult.current.filteredSearchParams).toEqual({
        ...defaultFilter,
        creator_ids: [115],
      });
    });
  });

  it('correctly set import_types for import_types', async () => {
    await act(async () => {
      renderHookResult.current.onUpdateFilter({
        import_types: [115],
      });
    });

    await act(async () => {
      expect(renderHookResult.current.filteredSearchParams).toEqual({
        ...defaultFilter,
        import_types: [115],
      });
    });
  });

  it('correctly set statuses for statuses', async () => {
    await act(async () => {
      renderHookResult.current.onUpdateFilter({
        statuses: [115],
      });
    });

    await act(async () => {
      expect(renderHookResult.current.filteredSearchParams).toEqual({
        ...defaultFilter,
        statuses: [115],
      });
    });
  });
});
