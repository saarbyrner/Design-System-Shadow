import { LOADING_LEVEL } from '@kitman/modules/src/analysis/Dashboard/types';
import {
  selectRefreshKey,
  selectChartLoadingStatus,
  selectTableLoadingStatus,
  selectWidgetsAllSuccess,
  selectCacheTimestamps,
  selectDashboardCache,
} from '../dashboardCache';

jest.mock(
  '@kitman/modules/src/analysis/Dashboard/redux/selectors/chartBuilder',
  () => ({
    getChartBuilder: (state) => state.chartBuilder,
  })
);

jest.mock(
  '@kitman/modules/src/analysis/Dashboard/components/TableWidget/utils',
  () => ({
    getColumnCachedAt: (col) => col.cached_at,
    getRowCachedAt: (row) => row.cached_at,
  })
);

jest.mock('@kitman/modules/src/analysis/Dashboard/utils', () => ({
  sortCacheTimestamps: (arr) =>
    arr.slice().sort((a, b) => {
      if (a > b) return -1;
      if (a < b) return 1;
      return 0;
    }),
}));

jest.mock('@kitman/common/src/utils/i18n', () => ({
  t: (s) => s,
}));
jest.mock('@kitman/common/src/utils/dateFormatter', () => ({
  humanizeTimestamp: jest.fn(() => 'HUMAN_DATE'),
}));

describe('dashboardCache selectors', () => {
  let state;
  const enableFlags = () => {
    window.getFlag = jest.fn(() => true);
  };
  const disableFlags = () => {
    window.getFlag = jest.fn(() => false);
  };

  beforeEach(() => {
    state = {
      dashboard: {
        dashboardCacheRefreshKey: 'rk-1',
        widgets: [],
      },
      chartBuilder: {
        loaderLevelMap: {},
      },
    };
    enableFlags();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('selectRefreshKey returns the refresh key from state', () => {
    expect(selectRefreshKey(state)).toBe('rk-1');
    state = {
      ...state,
      dashboard: { ...state.dashboard, dashboardCacheRefreshKey: 'rk-2' },
    };
    expect(selectRefreshKey(state)).toBe('rk-2');
  });

  it('selectChartLoadingStatus maps loader levels to statuses', () => {
    state = {
      ...state,
      chartBuilder: {
        loaderLevelMap: {
          a: LOADING_LEVEL.IDLE,
          b: LOADING_LEVEL.INITIAL_LOAD,
          c: LOADING_LEVEL.LONG_LOAD,
        },
      },
    };
    expect(selectChartLoadingStatus(state)).toEqual([
      'SUCCESS',
      'PENDING',
      'CACHING',
    ]);
  });

  it('selectTableLoadingStatus collects statuses from scorecard rows and table columns', () => {
    state = {
      ...state,
      dashboard: {
        ...state.dashboard,
        widgets: [
          {
            widget_type: 'table',
            widget: {
              table_container: {
                config: { table_type: 'SCORECARD' },
                rows: [
                  { loadingStatus: 'SUCCESS' },
                  { loadingStatus: 'PENDING' },
                ],
              },
            },
          },
          {
            widget_type: 'table',
            widget: {
              table_container: {
                config: { table_type: 'DEFAULT' },
                columns: [
                  { loadingStatus: 'CACHING' },
                  { loadingStatus: undefined },
                ],
              },
            },
          },
          {
            widget_type: 'chart',
            widget: {},
          },
        ],
      },
    };

    expect(selectTableLoadingStatus(state)).toEqual([
      'SUCCESS',
      'PENDING',
      'CACHING',
    ]);
  });

  it('selectWidgetsAllSuccess is true only when all statuses are SUCCESS', () => {
    // All SUCCESS
    state = {
      ...state,
      chartBuilder: { loaderLevelMap: { a: LOADING_LEVEL.IDLE } },
      dashboard: {
        ...state.dashboard,
        widgets: [
          {
            widget_type: 'table',
            widget: {
              table_container: {
                config: { table_type: 'DEFAULT' },
                columns: [{ loadingStatus: 'SUCCESS' }],
              },
            },
          },
        ],
      },
    };
    expect(selectWidgetsAllSuccess(state)).toBe(true);

    state = {
      ...state,
      chartBuilder: { loaderLevelMap: { a: LOADING_LEVEL.INITIAL_LOAD } },
    };
    expect(selectWidgetsAllSuccess(state)).toBe(false);
  });

  it('selectCacheTimestamps returns [] when caching disabled or not all success', () => {
    state = {
      ...state,
      chartBuilder: { loaderLevelMap: { a: LOADING_LEVEL.INITIAL_LOAD } },
      dashboard: { ...state.dashboard, widgets: [] },
    };
    expect(selectCacheTimestamps(state)).toEqual([]);

    state = {
      ...state,
      chartBuilder: { loaderLevelMap: { a: LOADING_LEVEL.IDLE } },
      dashboard: { ...state.dashboard, widgets: [] },
    };
    disableFlags();
    expect(selectCacheTimestamps(state)).toEqual([]);
  });

  it('selectCacheTimestamps combines unique timestamps from tables and charts (sorted desc)', () => {
    enableFlags();
    state = {
      ...state,
      chartBuilder: { loaderLevelMap: { a: LOADING_LEVEL.IDLE } },
      dashboard: {
        ...state.dashboard,
        widgets: [
          // Table: scorecard rows
          {
            widget_type: 'table',
            widget: {
              table_container: {
                config: { table_type: 'SCORECARD' },
                rows: [
                  {
                    loadingStatus: 'SUCCESS',
                    cached_at: '2025-08-29T10:00:00.000Z',
                  },
                  {
                    loadingStatus: 'SUCCESS',
                    cached_at: '2025-08-29T11:00:00.000Z',
                  },
                ],
              },
            },
          },
          // Table: default columns
          {
            widget_type: 'table',
            widget: {
              table_container: {
                config: { table_type: 'DEFAULT' },
                columns: [
                  {
                    loadingStatus: 'SUCCESS',
                    cached_at: '2025-08-29T09:30:00.000Z',
                  },
                  {
                    loadingStatus: 'SUCCESS',
                    cached_at: '2025-08-29T10:00:00.000Z',
                  },
                ],
              },
            },
          },
          // Chart
          {
            widget_type: 'chart',
            widget: {
              chart_elements: [
                { cached_at: '2025-08-29T12:00:00.000Z' },
                { cached_at: null },
              ],
            },
          },
        ],
      },
    };

    expect(selectCacheTimestamps(state)).toEqual([
      '2025-08-29T12:00:00.000Z',
      '2025-08-29T11:00:00.000Z',
      '2025-08-29T10:00:00.000Z',
      '2025-08-29T09:30:00.000Z',
    ]);
  });

  it('selectDashboardCache aggregates refreshKey, cachedAtTimestamp and effectiveLoadingStatus', () => {
    enableFlags();
    state = {
      ...state,
      dashboard: {
        ...state.dashboard,
        dashboardCacheRefreshKey: 'rk-42',
        widgets: [
          {
            widget_type: 'chart',
            widget: {
              chart_elements: [{ cached_at: '2025-08-29T13:00:00.000Z' }],
            },
          },
        ],
      },
      chartBuilder: { loaderLevelMap: { a: LOADING_LEVEL.IDLE } },
    };

    const result = selectDashboardCache(state);
    expect(result.dashboardCacheRefreshKey).toBe('rk-42');
    expect(result.cachedAtTimestamp).toEqual('2025-08-29T13:00:00.000Z');
    expect(result.effectiveLoadingStatus).toEqual(['SUCCESS']);
  });
});
