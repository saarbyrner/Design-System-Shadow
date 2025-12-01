// @flow
import { useEffect, useRef } from 'react';
import _isEqual from 'lodash/isEqual';
import _pick from 'lodash/pick';
import _findIndex from 'lodash/findIndex';
import { searchParams } from '@kitman/common/src/utils';
import useShouldRefreshDashboard from '@kitman/modules/src/analysis/shared/hooks/useShouldRefreshDashboard';

import type { TableWidgetColumn, TableWidgetRow } from '../types';

const useDataFetcherEffect = (
  rows: Array<TableWidgetRow>,
  columns: Array<TableWidgetColumn>,
  fetchData: Function,
  fetchColumn: Function,
  refreshCache: boolean,
  initiateRefreshCache: Function
) => {
  const columnsCacheRef = useRef([]);
  const rowsCacheRef = useRef([]);
  const prevRefreshCache = useRef(false);
  const isPivoted = !!(
    window.getFlag('table-updated-pivot') && searchParams('pivot')
  );

  const shouldRefreshDashboard = useShouldRefreshDashboard();

  const fetchColumnWrapper = () => {
    if (!_isEqual(rowsCacheRef.current, rows)) {
      // If the rows have changed at all, we bust the columns cache to trigger a refetch
      columnsCacheRef.current = [];
      rowsCacheRef.current = [...rows];
    }

    columns.forEach((fullColumn) => {
      // Don't fetch if there are no rows
      if (rows.length === 0) {
        return;
      }

      if (isPivoted) {
        return;
      }
      // Only picking out relevant fields when fetching columns
      const column = _pick({ ...fullColumn }, [
        'id',
        'column_id',
        'table_element.calculation',
        'table_element.config',
        'table_element.data_source',
        'table_element.name',
        'population',
        'time_scope',
      ]);
      const cachedIndex = _findIndex(columnsCacheRef.current, {
        id: column.id,
      });

      if (cachedIndex === -1 || refreshCache || shouldRefreshDashboard) {
        fetchColumn(column.id, column.column_id);
        columnsCacheRef.current.push({ ...column });

        return;
      }

      if (
        !_isEqual(columnsCacheRef.current[cachedIndex], column) &&
        !isPivoted
      ) {
        fetchColumn(column.id, column.column_id);
        columnsCacheRef.current[cachedIndex] = { ...column };
      }
    });
  };

  const refreshAllCacheWrapper = async () => {
    const response = await initiateRefreshCache();
    if (response?.status === 200) {
      fetchColumnWrapper();
    }
  };

  useEffect(() => {
    if (isPivoted) {
      fetchData();
    }
    const isRefreshTransition = !prevRefreshCache.current && refreshCache;

    if (window.getFlag('rep-table-widget-caching') && isRefreshTransition) {
      refreshAllCacheWrapper();
    } else if (
      !refreshCache ||
      (window.getFlag('rep-table-widget-caching') && shouldRefreshDashboard)
    ) {
      fetchColumnWrapper();
    }
    prevRefreshCache.current = refreshCache;
  }, [columns, rows, isPivoted, refreshCache, shouldRefreshDashboard]);
};

export default useDataFetcherEffect;
