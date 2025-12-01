// @flow
import { createSelector } from '@reduxjs/toolkit';
import _get from 'lodash/get';
import _find from 'lodash/find';
import _flatMap from 'lodash/flatMap';
import { getWidgets, getWidgetById } from './dashboard';
import type { Store } from '../types/store';
import type {
  TableWidgetColumn,
  TableWidgetRow,
} from '../../components/TableWidget/types';

const emptyColumn = {
  column_id: '',
  config: null,
  id: -1,
  name: '',
  data: [],
  order: -1,
  summary: '',
  population: {
    all_squads: false,
    applies_to_squad: false,
    athletes: [],
    squads: [],
    positions: [],
    position_groups: [],
  },
  table_element: {
    calculation: '',
    config: {},
    data_source: {
      id: -1,
      type: 'TableMetric',
      source: '',
      variable: '',
      config: {},
    },
    id: -1,
    name: '',
  },
  time_scope: {
    time_period: '',
  },
};

const emptyRow = {
  config: null,
  id: -1,
  name: '',
  order: -1,
  population: null,
  row_id: '',
  table_element: null,
  time_scope: {
    time_period: '',
  },
};

export const getTableContainerByWidgetId = (state: Store, widgetId: number) => {
  const widget = getWidgetById(state, widgetId);

  return _get(widget, 'widget.table_container', {});
};

export const getTableContainerByIdFactory =
  (tableContainerId: number) => (state: Store) => {
    const widgets = getWidgets(state);
    const widget = _find(widgets, (wid) => {
      return wid.widget.table_container?.id === tableContainerId;
    }) || { id: -1, widget: { table_container: {} } };

    return widget.widget.table_container || {};
  };

export const getTableColumnsByWidgetId = (state: Store, widgetId: number) => {
  const tableContainer = getTableContainerByWidgetId(state, widgetId);

  return _get(tableContainer, 'columns', []);
};

export const getTableRowsByTableContainerIdFactory = (
  tableContainerId: number
): Array<TableWidgetRow> =>
  createSelector(
    [getTableContainerByIdFactory(tableContainerId)],
    (tableContainer) =>
      _get(tableContainer, 'rows', [])
        .sort((a, b) => a.order - b.order)
        .filter((row) => {
          if (typeof row.active === 'undefined') {
            return true;
          }

          return row.active;
        })
  );

export const getTableColumnsByTableContainerIdFactory = (
  tableContainerId: number
): Array<TableWidgetRow> =>
  createSelector(
    [getTableContainerByIdFactory(tableContainerId)],
    (tableContainer) =>
      _get(tableContainer, 'columns', [])
        .sort((a, b) => a.order - b.order)
        .filter((column) => {
          if (typeof column.active === 'undefined') {
            return true;
          }

          return column.active;
        })
  );

export const getTableColumnByIdFactory =
  (tableColumnId: number) =>
  (state: Store): TableWidgetColumn => {
    const widgets = getWidgets(state);
    const allColumns = _flatMap(widgets, (widget) => {
      const columns = _get(widget, 'widget.table_container.columns', []);

      return columns;
    });

    return _find(allColumns, { id: tableColumnId }) || emptyColumn;
  };

export const getColumnConfigByColumnIdFactory =
  (tableColumnId: number) =>
  (state: Store): TableWidgetColumn => {
    const column = getTableColumnByIdFactory(tableColumnId)(state);

    return _get(column, 'config', {});
  };

export const getDuplicateColumn = (state: Store) => {
  return state.tableWidget.duplicateColumn;
};

export const getTableRowByIdFactory =
  (tableRowId: number) =>
  (state: Store): TableWidgetRow => {
    const widgets = getWidgets(state);
    const allRows = _flatMap(widgets, (widget) =>
      _get(widget, 'widget.table_container.rows', [])
    );

    return _find(allRows, { id: tableRowId }) || emptyRow;
  };

export const getDuplicateColumnError = (state: Store) => {
  const duplicateColumn = getDuplicateColumn(state);

  return duplicateColumn.error;
};

export const getDuplicateColumnLoading = (state: Store) => {
  const duplicateColumn = getDuplicateColumn(state);

  return duplicateColumn.loading;
};

export const isColumnDuplicating = (state: Store, columnId: number) => {
  const loadingColumns = getDuplicateColumnLoading(state);

  return loadingColumns.indexOf(columnId) > -1;
};

export const hasColumnErroredDuplicting = (state: Store, columnId: number) => {
  const errorColumns = getDuplicateColumnError(state);

  return errorColumns.indexOf(columnId) > -1;
};

export const getColumnTypeFactory = (widgetId: number) => (state: Store) => {
  const tableContainer = getTableContainerByWidgetId(state, widgetId);

  return _get(tableContainer, 'config.column_width_type', 'NORMAL');
};

export const getTableSortColumnIdFactory =
  (widgetId: number) => (state: Store) => {
    const tableContainer = getTableContainerByWidgetId(state, widgetId);

    return _get(tableContainer, 'config.table_sort[0].column_id', null);
  };

export const getTableSortOrderFactory =
  (widgetId: number) => (state: Store) => {
    const tableContainer = getTableContainerByWidgetId(state, widgetId);

    return _get(
      tableContainer,
      'config.table_sort[0].order_direction',
      'DEFAULT'
    );
  };
