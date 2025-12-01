// @flow
import { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import _find from 'lodash/find';
import _isEmpty from 'lodash/isEmpty';
import _difference from 'lodash/difference';
import _get from 'lodash/get';
import pollingServiceWrapper from '@kitman/common/src/utils/pollingServiceWrapper';
import getTableColumnDataRender from '@kitman/services/src/services/analysis/getTableColumnDataRender';
import statusCodes from '@kitman/common/src/variables/httpStatusCodes';
import {
  setRefreshWidgetCacheStatus,
  setColumnCalculatedCachedAtRefreshCache,
  setColumnLoadingStatus,
} from '@kitman/modules/src/analysis/Dashboard/redux/actions/tableWidget';
import { searchParams } from '@kitman/common/src/utils';
import useIsMountedCheck from '@kitman/common/src/hooks/useIsMountedCheck';
import type { SquadAthletesSelection } from '@kitman/components/src/types';
import { localeSortByField } from '@kitman/common/src/utils/localeSort';
import usePromiseQueue from '@kitman/common/src/hooks/usePromiseQueue';
import validateResponseWithRetry from '@kitman/common/src/utils/serviceQueryPolling';
import refreshWidgetCache from '@kitman/services/src/services/analysis/refreshWidgetCache';
import useShouldRefreshDashboard from '@kitman/modules/src/analysis/shared/hooks/useShouldRefreshDashboard';

import type {
  ColumnDataStatus,
  ColumnDataArray,
  ColumnSortType,
  TableWidgetRow,
  TableWidgetColumn,
  DynamicRows,
  DynamicRowChildren,
  ColumnDataItem,
} from '../types';
import {
  getRankingCalculation,
  getColumnId,
  getFormattedCellValue,
  addLabelToDynamicRows,
  hasValidGrouping,
  sortDynamicRows,
} from '../utils';

const blankRow: TableWidgetRow = {
  id: 0,
  name: '',
  source: '',
  summary: '',
  variable: '',
  order: 0,
  population: null,
  row_id: '',
  table_element: null,
  config: null,
  time_scope: {
    time_period: '',
  },
};

const useTableData = (
  tableContainerId: number,
  widgetId: number,
  columns: Array<TableWidgetColumn>,
  rows: Array<TableWidgetRow>,
  sortedColumnId: ?number,
  sortOrder: ColumnSortType,
  pivotParams: null | {
    pivot: {
      date_range?: Object,
      time_period?: string,
      time_period_length?: ?number,
      population: SquadAthletesSelection,
    },
  },
  locale: string
) => {
  const dispatch = useDispatch();
  const [rawData, setRawData] = useState({});
  const [dynamicRows, setDynamicRows] = useState<DynamicRows>({});
  const checkIsMounted = useIsMountedCheck();
  const addToQueue = usePromiseQueue(3);
  const isPivoted = !!(
    window.getFlag('table-updated-pivot') && searchParams('pivot')
  );

  const shouldRefreshDashboard = useShouldRefreshDashboard();
  const getRowChildren = (res, id): DynamicRowChildren => {
    const rowData = res?.[id];
    if (!rowData) return [];

    return Object.keys(rowData).map((label) => {
      setDynamicRows((prev) => addLabelToDynamicRows(prev, id, label));

      return {
        id: label,
        ...rowData[label],
      };
    });
  };

  // Helper function to sort rows
  const sortByValueField = (items) => {
    const orderMap = {
      HIGH_LOW: 'desc',
      LOW_HIGH: 'asc',
      DEFAULT: 'asc',
    };

    return localeSortByField(items, 'value', locale, orderMap[sortOrder], {
      emptyAtEnd: true,
    });
  };

  const setColumnData = (
    id: string | number,
    status: ColumnDataStatus,
    data: ColumnDataArray,
    message: string = ''
  ) => {
    setRawData((prevState) => ({
      ...prevState,
      [`${id}`]: {
        data,
        status,
        message,
      },
    }));
  };

  const handleSuccess = (dataId: string | number, res: Object) => {
    if (!checkIsMounted()) {
      return;
    }

    if (res.error) {
      setColumnData(dataId, 'FORBIDDEN', [], res.error);
    } else {
      const data = rows.map((row) => {
        const id = row.row_id;
        const value = _get(res, `${id}.value`, null);

        const rowData: ColumnDataItem = {
          id,
          value,
        };

        // Only process children if groupings exist
        if (hasValidGrouping(row.config?.groupings)) {
          rowData.children = getRowChildren(res, id);
        }

        return rowData;
      });

      setColumnData(dataId, 'SUCCESS', data);
    }
  };

  const waitForAndRetrieveData = async ({ id, columnId, data }) => {
    const loaderTimeout = setTimeout(() => {
      setColumnData(id, 'CACHING', []);
    }, 4000);
    try {
      const response = await validateResponseWithRetry(
        pollingServiceWrapper(getTableColumnDataRender),
        {
          tableContainerId,
          columnId,
          data,
        }
      );
      if (response?.error) {
        throw response;
      }
      return { data: response };
    } finally {
      dispatch(setRefreshWidgetCacheStatus(tableContainerId, false));
      if (shouldRefreshDashboard) {
        dispatch(setColumnCalculatedCachedAtRefreshCache(widgetId));
      }
      clearTimeout(loaderTimeout);
    }
  };

  const initiateRequest = async ({ id, columnId, data }) => {
    let response;
    try {
      if (window.getFlag('rep-table-widget-caching')) {
        response = await waitForAndRetrieveData({ id, columnId, data });
      } else {
        response = await getTableColumnDataRender({
          tableContainerId,
          columnId,
          data,
        });
      }
      handleSuccess(id, response?.data);
    } catch (error) {
      const errorMessage =
        error?.error?.status === statusCodes.forbidden
          ? error?.error?.error
          : 'Error loading data, please try again';
      if (checkIsMounted()) {
        setColumnData(id, 'FAILURE', [], errorMessage);
      }
    }
  };

  const initiateRefreshCache = async () => {
    const columnList = columns.map((c) =>
      getColumnId({ id: c.id, column_id: c.column_id })
    );
    columnList.forEach((c) => setColumnData(c, 'PENDING', []));
    try {
      const response = await refreshWidgetCache(tableContainerId);
      return response;
    } catch (error) {
      if (checkIsMounted()) {
        columnList.forEach((c) =>
          setColumnData(
            c,
            'FAILURE',
            [],
            'Error refreshing data, please try again'
          )
        );
      }
      return error;
    }
  };

  const fetchColumn = (
    columnId: number,
    dataId: string,
    isPivotLocked?: boolean
  ) => {
    if (rows.length > 0) {
      const id = getColumnId({ id: columnId, column_id: dataId });
      setColumnData(id, 'PENDING', []);
      const data = isPivotLocked ? null : pivotParams;

      if (window.getFlag('rep-table-widget-lazy-load')) {
        addToQueue(() => initiateRequest({ id, columnId, data }));
      } else {
        initiateRequest({ id, columnId, data });
      }
    }
  };

  const fetchData = () => {
    setRawData({});
    columns.forEach((column) => {
      const isPivotLocked = column.config?.pivot_locked || false;

      if (!isPivotLocked && isPivoted) {
        handleSuccess(getColumnId(column), column.data || {});
      } else {
        fetchColumn(column.id, column.column_id, isPivotLocked);
      }
    });
  };

  const tableData = useMemo(() => {
    return columns.reduce((acc, column) => {
      const id = `${getColumnId(column)}`;
      const columnData = {
        ..._get(rawData, id, {
          data: [],
          status: '',
          message: '',
        }),
      };
      const allValues = columnData.data.map(({ value }) => value);
      const rankingCalculation = column.config?.ranking_calculation;

      if (rankingCalculation) {
        // Helper function to calculate ranking
        const calculateRanking = (itemValue, values) =>
          getRankingCalculation(
            itemValue,
            values,
            rankingCalculation.type,
            rankingCalculation.direction,
            column.summary
          );

        // Rank children rows
        const rankChildren = (dataItem) => {
          const childrenValues = dataItem.children.map(
            (child) => child.value || 0
          );

          return dataItem.children.map((child) => ({
            ...child,
            value: calculateRanking(child.value || 0, childrenValues),
          }));
        };

        columnData.data = columnData.data.map((dataItem) => {
          const updatedItem = {
            ...dataItem,
            value: calculateRanking(dataItem.value, allValues),
          };

          // Only rank children if exist
          if (dataItem.children) {
            updatedItem.children = rankChildren(dataItem);
          }

          return updatedItem;
        });
      }
      dispatch(
        setColumnLoadingStatus(tableContainerId, column.id, columnData.status)
      );
      return {
        ...acc,
        [id]: columnData,
      };
    }, {});
  }, [columns, rawData]);

  const sortedData: {
    rows: Array<TableWidgetRow>,
    dynamicRows: DynamicRows,
  } = useMemo(() => {
    const sortedAppliedColumn: Object =
      _find(columns, {
        id: sortedColumnId,
      }) || {};
    const columnToSort = tableData[`${getColumnId(sortedAppliedColumn)}`];

    // eslint-disable-next-line camelcase
    let sortedRowIds = rows.map(({ row_id }) => row_id);
    let sortedDynamicRows = dynamicRows;

    if (
      sortOrder !== 'DEFAULT' &&
      !_isEmpty(sortedAppliedColumn) &&
      columnToSort &&
      columnToSort.data.length
    ) {
      const sortedColumns = sortByValueField(
        columnToSort.data.map((item) => ({
          ...item,
          value: getFormattedCellValue(item.value),
        }))
      );

      const sortedIds = sortedColumns.map((item) => {
        // Only sort dynamic rows if children exist
        if (item?.children) {
          sortedDynamicRows = sortDynamicRows(
            item,
            sortedDynamicRows,
            sortByValueField
          );
        }
        return item.id;
      });

      // In some edge cases, ids may be missing in the data returned.
      // This just makes sure that any id's are not missed in that process
      const missingIds = _difference(sortedRowIds, sortedIds);

      sortedRowIds = [...sortedIds, ...missingIds];
    }

    const sortedRows = sortedRowIds.map((id) => {
      const row = _find(rows, { row_id: id }) || blankRow;

      // Only set isDynamic if groupings exist
      if (hasValidGrouping(row.config?.groupings)) {
        return {
          ...row,
          isDynamic: true,
        };
      }

      return row;
    });

    return { rows: sortedRows, dynamicRows: sortedDynamicRows };
  }, [rawData, sortedColumnId, sortOrder, columns, rows]);

  return {
    fetchData,
    fetchColumn,
    tableData,
    sortedRows: sortedData.rows,
    dynamicRows: sortedData.dynamicRows,
    initiateRefreshCache,
  };
};

export default useTableData;
