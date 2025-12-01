// @flow
import { createSelector } from 'reselect';
import { getChartBuilder } from '@kitman/modules/src/analysis/Dashboard/redux/selectors/chartBuilder';
import { LOADING_LEVEL } from '@kitman/modules/src/analysis/Dashboard/types';
import { sortCacheTimestamps } from '@kitman/modules/src/analysis/Dashboard/utils';
import { DATA_STATUS } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/consts';
import {
  getColumnCachedAt,
  getRowCachedAt,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/utils';

const selectDashboard = (state) => state.dashboard;

const selectLastCalculatedCachedAt = createSelector(
  selectDashboard,
  (dashboard) => dashboard?.lastCalculatedCachedAt || null
);

const selectWidgets = createSelector(
  selectDashboard,
  (dashboard) => dashboard?.widgets || []
);

export const selectRefreshKey = createSelector(
  selectDashboard,
  (dashboard) => dashboard?.dashboardCacheRefreshKey
);

export const selectCachingEnabled = () =>
  Boolean(
    window.getFlag('rep-table-widget-caching') ||
      window.getFlag('rep-charts-v2-caching')
  );

export const selectChartLoadingStatus = createSelector(
  getChartBuilder,
  (chartBuilder) => {
    const loaderLevelMap = chartBuilder?.loaderLevelMap || {};
    return Object.values(loaderLevelMap).map((level) => {
      if (level === LOADING_LEVEL.IDLE) return DATA_STATUS.success;
      if (level === LOADING_LEVEL.INITIAL_LOAD) return DATA_STATUS.pending;
      return DATA_STATUS.caching;
    });
  }
);

export const selectTableLoadingStatus = createSelector(
  selectWidgets,
  (widgets) => {
    return widgets
      .filter(
        (widget) =>
          widget.widget_type === 'table' && widget.widget?.table_container
      )
      .flatMap((widget) => {
        const tableContainer = widget.widget.table_container;
        if (tableContainer?.config?.table_type === 'SCORECARD') {
          return (tableContainer.rows ?? []).map((row) => row.loadingStatus);
        }
        return (tableContainer.columns ?? []).map((col) => col.loadingStatus);
      })
      .filter(Boolean);
  }
);

export const selectEffectiveLoadingStatus = createSelector(
  selectChartLoadingStatus,
  selectTableLoadingStatus,
  (chartStatuses, tableStatuses) => {
    return Array.from(new Set([...tableStatuses, ...chartStatuses]));
  }
);

export const selectWidgetsAllSuccess = createSelector(
  selectChartLoadingStatus,
  selectTableLoadingStatus,
  (chartStatuses, tableStatuses) => {
    const all = [...tableStatuses, ...chartStatuses];
    return all.length > 0 && all.every((s) => s === DATA_STATUS.success);
  }
);

export const selectCacheTimestamps = createSelector(
  selectWidgets,
  selectWidgetsAllSuccess,
  () => selectCachingEnabled(),
  (widgets, allSuccess, cachingEnabled) => {
    if (!cachingEnabled || !allSuccess) return [];

    const tableTimestamps = widgets
      .filter(
        (widget) =>
          widget.widget_type === 'table' && widget.widget?.table_container
      )
      .flatMap((widget) => {
        const tableContainer = widget.widget.table_container;
        if (tableContainer?.config?.table_type === 'SCORECARD') {
          return (tableContainer.rows ?? []).map((row) => getRowCachedAt(row));
        }
        return (tableContainer.columns ?? []).map((col) =>
          getColumnCachedAt(col)
        );
      })
      .filter(Boolean)
      .map(String);

    const chartTimestamps = widgets
      .filter((widget) => widget.widget_type === 'chart')
      .flatMap((widget) =>
        (widget.widget.chart_elements ?? []).map(
          (chartElement) => chartElement.cached_at
        )
      )
      .filter(Boolean)
      .map(String);

    const unique = Array.from(
      new Set([...tableTimestamps, ...chartTimestamps])
    );
    return sortCacheTimestamps(unique);
  }
);

export const selectCachedAtTimestamp = createSelector(
  selectCacheTimestamps,
  selectLastCalculatedCachedAt,
  (timestamps, lastCalculatedCachedAt) => {
    return lastCalculatedCachedAt ?? timestamps[0];
  }
);

export const selectDashboardCache = createSelector(
  selectRefreshKey,
  selectCachedAtTimestamp,
  selectEffectiveLoadingStatus,
  (dashboardCacheRefreshKey, cachedAtTimestamp, effectiveLoadingStatus) => ({
    dashboardCacheRefreshKey,
    cachedAtTimestamp,
    effectiveLoadingStatus,
  })
);
