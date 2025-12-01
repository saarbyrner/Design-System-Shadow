// @flow
import {
  Fragment,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { colors } from '@kitman/common/src/variables';
import { useDispatch, useSelector } from 'react-redux';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import { withNamespaces } from 'react-i18next';
import { arrayMove } from 'react-sortable-hoc';
import _groupBy from 'lodash/groupBy';
import _omit from 'lodash/omit';
import _pick from 'lodash/pick';
import _isEqual from 'lodash/isEqual';
import _find from 'lodash/find';
import _findIndex from 'lodash/findIndex';
import _isNull from 'lodash/isNull';
import _get from 'lodash/get';
import classNames from 'classnames';
import useShouldRefreshDashboard from '@kitman/modules/src/analysis/shared/hooks/useShouldRefreshDashboard';
import {
  type SquadAthletesSelection,
  type SquadAthletes,
} from '@kitman/components/src/types';
import { type Squad } from '@kitman/common/src/types/Squad';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import { searchParams } from '@kitman/common/src/utils';
import useIsMountedCheck from '@kitman/common/src/hooks/useIsMountedCheck';
import { localeSortByField } from '@kitman/common/src/utils/localeSort';
import { InfoTooltip, TooltipMenu } from '@kitman/components';
import { Tooltip } from '@kitman/playbook/components';
import { getPeriodName } from '@kitman/modules/src/analysis/shared/utils';
import getTableRowDataRender from '@kitman/services/src/services/analysis/getTableRowDataRender';
import refreshWidgetCache from '@kitman/services/src/services/analysis/refreshWidgetCache';
import { type LabelPopulation } from '@kitman/services/src/services/analysis/labels';
import { type GroupPopulation } from '@kitman/services/src/services/analysis/groups';
import {
  type ColumnSortType,
  type TableWidgetRowMetric,
  type TableWidgetColumn,
  TABLE_WIDGET_DATA_SOURCES,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';
import {
  setRefreshWidgetCacheStatus,
  setRowCalculatedCachedAtRefreshCache,
  setRowLoadingStatus,
} from '@kitman/modules/src/analysis/Dashboard/redux/actions/tableWidget';
import statusCodes from '@kitman/common/src/variables/httpStatusCodes';
import {
  getCalculationTitle,
  getTableRowMetrics,
  getSummaryName,
  getSummaryValue,
  getTablePopulation,
  getRankingCalculationMenuItem,
  getRankingCalculation,
  getRowCachedAt,
  getFormattedCellValue,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/utils';
import { DATA_STATUS } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/consts';
import validateResponseWithRetry from '@kitman/common/src/utils/serviceQueryPolling';
import pollingServiceWrapper from '@kitman/common/src/utils/pollingServiceWrapper';
import { getCachedAtRolloverContent } from '../../utils';
import { ScorecardColumnTranslated as ScorecardColumn } from '../Column/ScorecardColumn';
import Table from '../Table';
import { SourceSelectorTranslated as SourceSelector } from '../SourceSelector';
import DuplicatingStatus from '../DuplicatingStatus';
import { ExportData } from '../Export';

type Props = {
  locale: string,
  appliedColumnDetails: Array<TableWidgetColumn>,
  appliedRowDetails: Array<TableWidgetRowMetric>,
  canManageDashboard: boolean,
  isEditMode: boolean,
  onChangeRowSummary: Function,
  onClickAddColumn: Function,
  onClickAddRow: Function,
  onClickDeleteColumn: Function,
  onClickDeleteRow: Function,
  onClickEditColumn: Function,
  onClickEditRow: Function,
  onClickFormatRow: Function,
  onClickLockColumnPivot: Function,
  onColumnOrderUpdated: Function,
  onColumnSortUpdated: Function,
  sortedColumnId: ?number,
  sortedOrder: ColumnSortType,
  onDuplicateColumn: Function,
  pivotedDateRange?: Object,
  pivotedTimePeriod?: string,
  pivotedTimePeriodLength?: ?number,
  pivotedPopulation: SquadAthletesSelection,
  renderedByPrintBuilder: boolean,
  showSummary: boolean,
  squadAthletes: SquadAthletes,
  squads: Array<Squad>,
  setRowRankingCalculation: Function,
  tableContainerId: number,
  widgetId: number,
  labels?: Array<LabelPopulation>,
  groups?: Array<GroupPopulation>,
};

const blankRow: TableWidgetRowMetric = {
  id: 0,
  metricable_id: 0,
  metricable_type: '',
  name: '',
  source: '',
  summary: '',
  variable: '',
  order: 0,
  population: null,
  row_id: '',
  table_element: null,
  time_scope: {
    time_period: '',
  },
};

const LOADER_TIMEOUT = 4000;

const getKey = (id) => `row_${id}`;
const getColumnId = (column: TableWidgetColumn): string =>
  column.id === null ? column.column_id : `${column.id}`;

const useTableData = (
  tableContainerId,
  widgetId,
  rows,
  columns,
  pivotParams,
  refreshCacheStatus
) => {
  const dispatch = useDispatch();
  const [forbiddenRows, setForbiddenRows] = useState([]);
  const [cachedColumns, setCachedColumns] = useState([]);
  const [rowData, setRowData] = useState({});
  const [rowDataStatus, setRowDataStatus] = useState({});
  const checkIsMounted = useIsMountedCheck();
  const rowsCacheRef = useRef([]);
  const prevRefreshCache = useRef(false);

  const shouldRefreshDashboard = useShouldRefreshDashboard();

  const updateStatus = useCallback(
    (rowId, status) => {
      if (!checkIsMounted()) {
        return;
      }
      dispatch(setRowLoadingStatus(tableContainerId, rowId, String(status)));
      setRowDataStatus((prevState) => ({
        ...prevState,
        [getKey(rowId)]: status,
      }));
    },
    [rowDataStatus]
  );

  const updateData = useCallback(
    (rowId, data) => {
      if (!checkIsMounted()) {
        return;
      }

      updateStatus(rowId, DATA_STATUS.success);
      setRowData((prevState) => ({
        ...prevState,
        [getKey(rowId)]: data,
      }));
    },
    [rowData]
  );

  const initiateRequest = (params, refreshDashboard) => {
    if (window.getFlag('rep-table-widget-caching')) {
      const loaderTimeout = setTimeout(() => {
        updateStatus(params.rowId, DATA_STATUS.caching);
      }, LOADER_TIMEOUT);

      return validateResponseWithRetry(
        pollingServiceWrapper(getTableRowDataRender),
        params
      ).finally(() => {
        clearTimeout(loaderTimeout);
        if (refreshDashboard) {
          dispatch(setRowCalculatedCachedAtRefreshCache(widgetId));
        }
        dispatch(setRefreshWidgetCacheStatus(tableContainerId, false));
      });
    }
    return getTableRowDataRender(params).then(({ data }) => data);
  };

  const fetchRow = useCallback(
    (rowId) => {
      updateStatus(rowId, DATA_STATUS.pending);

      initiateRequest(
        {
          tableContainerId,
          rowId,
          pivotParams,
        },
        shouldRefreshDashboard
      )
        .then((res) => {
          if (
            res.status === DATA_STATUS.forbidden ||
            (res.error && res.error.status === statusCodes.forbidden)
          ) {
            setForbiddenRows((prevState) => [...prevState, rowId]);
            updateStatus(rowId, DATA_STATUS.forbidden);
          } else {
            updateData(rowId, res);
          }
        })
        .catch(() => {
          updateStatus(rowId, DATA_STATUS.failure);
        });
    },
    [rowData, shouldRefreshDashboard]
  );

  const initiateRowDataFetch = () => {
    let shouldSkipCacheFind = false;

    // If columns have changed from cached columns then we want to fetch all rows
    // Setting shouldSkipCacheFind to true allows that, but ensures results enter cache
    if (
      !_isEqual(cachedColumns, columns) ||
      refreshCacheStatus ||
      shouldRefreshDashboard
    ) {
      setCachedColumns(columns);
      setForbiddenRows([]);
      setRowData({});
      rowsCacheRef.current.length = 0; // Clear the rows cache
      shouldSkipCacheFind = true; // No point searching as rows cache now empty
    }
    rows.forEach((fullRow) => {
      const row = _pick({ ...fullRow }, [
        'id',
        'row_id',
        'table_element.calculation',
        'table_element.config',
        'table_element.data_source',
        'population',
        'time_scope',
      ]);
      const cachedIndex = shouldSkipCacheFind
        ? -1
        : _findIndex(rowsCacheRef.current, {
            id: row.id,
          });

      if (cachedIndex === -1) {
        fetchRow(row.id);
        rowsCacheRef.current.push({ ...row });
        return;
      }

      if (!_isEqual(rowsCacheRef.current[cachedIndex], row)) {
        fetchRow(row.id);
        rowsCacheRef.current[cachedIndex] = { ...row };
      }
    });
  };

  const refreshAllCacheWrapper = async () => {
    const ids = rows.map(({ id }) => id);
    try {
      ids.forEach((id) => updateStatus(id, DATA_STATUS.pending));
      await refreshWidgetCache(tableContainerId);
      initiateRowDataFetch();
    } catch {
      ids.forEach((id) => updateStatus(id, DATA_STATUS.failure));
    }
  };

  useEffect(() => {
    const isRefreshTransition = !prevRefreshCache.current && refreshCacheStatus;
    if (window.getFlag('rep-table-widget-caching') && isRefreshTransition) {
      refreshAllCacheWrapper();
    } else if (!refreshCacheStatus || shouldRefreshDashboard) {
      initiateRowDataFetch();
    }
    prevRefreshCache.current = refreshCacheStatus;
  }, [rows, columns, refreshCacheStatus, shouldRefreshDashboard]);

  const tableData = useMemo(() => {
    const getValues = (data) => {
      return Object.keys(data).reduce((acc, key) => {
        const value = data[key]?.value || null;

        return [...acc, value];
      }, []);
    };

    return columns.reduce((acc, column) => {
      acc[getColumnId(column)] = rows.map((row) => {
        const status = rowDataStatus[getKey(row.id)];
        const data = rowData[getKey(row.id)] || {};
        const values = getValues(data);
        let value = data[column.column_id]?.value || null;

        const rankingCalculation = row.config?.ranking_calculation || {
          type: 'NONE',
          calculation: 'NONE',
        };

        if (rankingCalculation.type !== 'NONE') {
          value = getRankingCalculation(
            value,
            values,
            rankingCalculation.type,
            rankingCalculation.direction,
            row.summary
          );
        }

        return {
          id: row.id,
          value,
          status,
          rowDetails: { ...row },
        };
      });
      return acc;
    }, {});
  }, [rows, columns, rowData, rowDataStatus]);

  return {
    fetchRow,
    tableData,
    forbiddenRows,
  };
};

function ScorecardTable(props: I18nProps<Props>) {
  const { organisation } = useOrganisation();

  const isPivoted =
    window.getFlag('table-updated-pivot') && !!searchParams('pivot');

  const scoreCardSummaryColumn = classNames('tableWidget__blankRow--header', {
    'tableWidget__blankRow--header--historicalSquad': window.getFlag(
      'rep-historic-reporting'
    ),
  });

  const rowHeaderClasses = classNames('tableWidget__rowHeader', {
    'tableWidget__rowHeader--disabled': !props.canManageDashboard,
  });

  const summaryColumnClasses = classNames('tableWidget__summaryColumn', {
    'tableWidget__summaryColumn--disabled': !props.canManageDashboard,
  });

  const [pivotedSummaryId, setPivotedSummaryId] = useState({});
  const [columns, setColumns] = useState(props.appliedColumnDetails);
  const [rows, setRows] = useState(
    getTableRowMetrics(props.appliedRowDetails, [])
  );
  const appliedRowCache = useRef(props.appliedRowDetails);

  const pivotParams = isPivoted
    ? {
        pivot: {
          time_period: props.pivotedTimePeriod,
          time_period_length: props.pivotedTimePeriodLength,
          date_range: props.pivotedDateRange,
          population: props.pivotedPopulation,
        },
      }
    : null;

  const refreshCacheStatus = useSelector((state) => {
    const currentWidget = state.dashboard?.widgets?.find(
      (item) => item.id === props.widgetId
    );
    return currentWidget?.widget?.table_container?.refreshCacheStatus ?? false;
  });

  const { fetchRow, tableData, forbiddenRows } = useTableData(
    props.tableContainerId,
    props.widgetId,
    rows,
    columns,
    pivotParams,
    refreshCacheStatus
  );

  const sortedRows: Array<TableWidgetRowMetric> = useMemo(() => {
    const columnToSort = _get(tableData, props.sortedColumnId, []);

    let ids = [];
    if (props.sortedOrder === 'DEFAULT' || columnToSort.length === 0) {
      ids = rows.map(({ id }) => id);
    } else {
      const sort = props.sortedOrder === 'HIGH_LOW' ? 'desc' : 'asc';

      ids = localeSortByField(
        columnToSort.map((item) => ({
          ...item,
          value: `${getFormattedCellValue(item.value)}`,
        })),
        'value',
        props.locale,
        sort,
        { emptyAtEnd: true }
      ).map((item) => item.id);
    }

    return ids.map((id) => _find(rows, { id }) || blankRow);
  }, [tableData, rows, props.sortedColumnId, props.sortedOrder]);

  useEffect(() => {
    if (!_isEqual(props.appliedRowDetails, appliedRowCache.current)) {
      setRows(getTableRowMetrics(props.appliedRowDetails, []));
      appliedRowCache.current = props.appliedRowDetails;
    }
  }, [props.appliedRowDetails]);

  useEffect(() => {
    /**
     * This useEffect syncs the columns with the props.appliedColumnDetails
     * Checks if it is equal on every field except `order` as that is loaded
     * once on component mount and maintained locally in the columns variable
     */

    const stripOrder = (column) => _omit(column, 'order');

    if (
      !_isEqual(
        _groupBy(props.appliedColumnDetails.map(stripOrder), 'id'),
        _groupBy(columns.map(stripOrder), 'id')
      )
    ) {
      setColumns(props.appliedColumnDetails);
    }
  }, [props.appliedColumnDetails]);

  const summaryMenuItems = (metric) => {
    const summaryIds = [
      'mean',
      'min',
      'max',
      'sum',
      'filled',
      'empty',
      'percentageFilled',
      'percentageEmpty',
      'range',
      'median',
      'standardDeviation',
    ];
    const metricSummaryCalc = metric.config?.summary_calculation;

    return summaryIds.map((summaryId) => {
      return {
        description: getSummaryName(summaryId),
        onClick: () => {
          if (searchParams('pivot')) {
            setPivotedSummaryId((prevState) => ({
              ...prevState,
              [metric.id]: {
                summaryCalculation: summaryId,
              },
            }));
          } else {
            props.onChangeRowSummary(metric.id, summaryId);
          }
        },
        isSelected:
          searchParams('pivot') || !metricSummaryCalc
            ? summaryId === 'mean'
            : summaryId === metricSummaryCalc,
      };
    });
  };

  const getSummaryData = (metricId) => {
    if (Object.keys(tableData).length === 0) return [];

    const summaryData = Object.values(tableData).reduce((acc, columnData) => {
      // $FlowFixMe tableColumn is always an object containing a data []
      columnData.map((row) => {
        if (!acc[row.id]) {
          acc[row.id] = [];
        }
        return acc[row.id].push(row.value);
      });
      return acc;
    }, {});

    return summaryData[metricId];
  };

  const getColumnFormattingRules = () => {
    return sortedRows.reduce((acc, row) => {
      if (!acc[row.id]) {
        acc[row.id] = {};
      }
      acc[row.id].formattingRules = row.config?.conditional_formatting || [];
      return acc;
    }, {});
  };

  const rowLoadingStatusMap = useMemo(() => {
    if (!tableData) return {};

    const col = tableData[Object.keys(tableData)[0]];
    return col?.reduce((acc, item) => {
      return { ...acc, [item.id]: item.status };
    }, {});
  }, [tableData]);

  const rolloverContent = useCallback(
    (row) => {
      if (!row) return '';
      const res = getRowCachedAt(row);
      return getCachedAtRolloverContent(
        res,
        rowLoadingStatusMap?.[row.id],
        organisation.locale
      );
    },
    [organisation.locale, rowLoadingStatusMap]
  );

  const getTableMetrics = () => {
    return sortedRows.map((row) => {
      if (forbiddenRows.includes(row.id)) {
        return (
          <Table.Row key={row.id}>
            <td className="tableWidget__rowHeader tableWidget__rowHeader--forbidden">
              <TooltipMenu
                placement="bottom-end"
                menuItems={[
                  {
                    description: props.t('Edit'),
                    icon: 'icon-edit',
                    onClick: () => props.onClickEditRow(row),
                    isDisabled: true,
                  },
                  {
                    description: props.t('Delete Row'),
                    icon: 'icon-bin',
                    onClick: () => props.onClickDeleteRow(row.id),
                    isDestructive: true,
                    isDisabled: true,
                  },
                ]}
                tooltipTriggerElement={
                  <div className="tableWidget__rowHeader--container">
                    <InfoTooltip
                      content={props.t(
                        'You do not have permission to view this metric'
                      )}
                    >
                      <div>
                        <i className="tableWidget__rowHeader--burgerMenu icon-more" />
                        <i className="tableWidget__rowHeader--forbiddenIcon icon-lock" />
                        <div className="tableWidget__rowHeader--metricName">
                          {row.name}
                        </div>
                      </div>
                    </InfoTooltip>

                    <div className="tableWidget__rowHeader--calculation" />
                  </div>
                }
                kitmanDesignSystem
              />
            </td>
          </Table.Row>
        );
      }
      const menuItems = [
        {
          description: props.t('Edit'),
          icon: 'icon-edit',
          onClick: () => props.onClickEditRow(row),
        },
        {
          description: props.t('Conditional Formatting'),
          icon: 'icon-nav-alert',
          onClick: () => {
            props.onClickFormatRow(
              row.id,
              row.name,
              null, // TODO: need unit of metric from BE
              row.config?.conditional_formatting
                ? row.config?.conditional_formatting
                : [
                    {
                      type: null,
                      condition: null,
                      value: null,
                      color: colors.red_100_20,
                    },
                  ]
            );
          },
        },
      ];

      if (window.getFlag('table-widget-ranking')) {
        menuItems.push(
          getRankingCalculationMenuItem(
            isPivoted,
            row.config?.ranking_calculation,
            (type, direction) => {
              props.setRowRankingCalculation(row.id, type, direction);
            }
          )
        );
      }

      menuItems.push({
        description: props.t('Delete Row'),
        icon: 'icon-bin',
        onClick: () => props.onClickDeleteRow(row.id),
        isDestructive: true,
      });

      return (
        <Table.Row data-testid="ScorecardTable|AppliedMetric" key={row.id}>
          <td className={rowHeaderClasses}>
            <TooltipMenu
              placement="bottom-end"
              menuItems={menuItems}
              tooltipTriggerElement={
                <div className="tableWidget__rowHeader--container">
                  <InfoTooltip content={row.name}>
                    <div>
                      <i className="tableWidget__rowHeader--burgerMenu icon-more" />
                      <div className="tableWidget__rowHeader--metricName">
                        {row.name}
                      </div>
                    </div>
                  </InfoTooltip>

                  <Tooltip
                    title={rolloverContent(row)}
                    placement="bottom"
                    key={row.id}
                  >
                    <div className="tableWidget__rowHeader--calculation">
                      {getCalculationTitle(row.table_element?.calculation)}
                    </div>
                  </Tooltip>
                </div>
              }
              disabled={!props.canManageDashboard}
              kitmanDesignSystem
            />
          </td>
        </Table.Row>
      );
    });
  };

  const updateColumns = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      setColumns(arrayMove(columns, oldIndex, newIndex));

      if (!isPivoted) {
        props.onColumnOrderUpdated(oldIndex, newIndex);
      }
    }
  };

  const { exportOptions, exportData } = useMemo(() => {
    const showSummary = props.showSummary;

    const getPopulationDetails = (column) => {
      const population = getTablePopulation(
        column.population,
        props.squadAthletes,
        props.squads,
        []
      )[0];

      const name = population ? population.name : '';

      return name;
    };

    const getDatePeriod = (column) => {
      const isPivotLocked = column.config?.pivot_locked || false;
      const dateSettings = column.time_scope;

      if (isPivoted && props.pivotedTimePeriod !== '' && !isPivotLocked) {
        return getPeriodName(
          props.pivotedTimePeriod,
          {
            startDate: props.pivotedDateRange?.start_date,
            endDate: props.pivotedDateRange?.end_date,
          },
          props.pivotedTimePeriodLength
        );
      }

      return getPeriodName(
        dateSettings.time_period,
        {
          startDate: dateSettings.start_time,
          endDate: dateSettings.end_time,
        },
        dateSettings.time_period_length,
        dateSettings.time_period_length_offset
      );
    };

    const columnsProcessor = (
      getCellDetailsCallback: Function,
      title: string = '',
      subTitle: string = '',
      summary: string = ''
    ) => {
      const summaryValue = showSummary ? { summary } : {};

      return {
        ...columns.reduce(
          (acc, column) => {
            const value = getCellDetailsCallback(column);
            return Object.assign({}, acc, {
              [getColumnId(column)]: value,
            });
          },
          {
            title,
            subTitle,
            ...summaryValue,
          }
        ),
      };
    };

    const getSummary = (row) => {
      const calculation = isPivoted
        ? pivotedSummaryId[row.id]?.summaryCalculation || 'mean'
        : row.config?.summary_calculation || 'mean';

      const data = getSummaryData(row.id);

      return `${getSummaryName(calculation || 'mean')}: ${getSummaryValue(
        row.id,
        data,
        row.table_element?.calculation
      )}`;
    };

    const titleRows = [
      columnsProcessor((column) => {
        return getPopulationDetails(column);
      }),
    ];

    const dataRows = sortedRows.map((row) => {
      if (forbiddenRows.includes(row.id)) {
        return columnsProcessor(() => '-', '-', '-', '-');
      }

      return columnsProcessor(
        (column) => {
          const columnData = tableData[getColumnId(column)] || [];
          const cellDetails = _find(columnData, { id: row.id }) || {
            value: null,
          };

          return getFormattedCellValue(cellDetails.value, row.summary);
        },
        row.name,
        getCalculationTitle(row.table_element?.calculation),
        getSummary(row)
      );
    });

    const summaryKeys = showSummary ? [{ value: 'summary', label: ' ' }] : [];

    const fields = [
      { value: 'title', label: ' ' },
      { value: 'subTitle', label: ' ' },
      ...columns.map((column) => {
        return {
          value: `${getColumnId(column)}`,
          label: getDatePeriod(column),
        };
      }),
      ...summaryKeys,
    ];

    return {
      exportOptions: { fields },
      exportData: [...titleRows, ...dataRows],
    };
  }, [tableData, columns, sortedRows, props.showSummary]);

  return (
    <Table onUpdateColumnOrder={updateColumns}>
      <ExportData data={exportData} options={exportOptions} />

      <Table.Column className="tableWidget__metric tableWidget__title-column">
        <Table.BlankRow />
        <Table.BlankRow
          header
          historicalSquadEnabled={window.getFlag('rep-historic-reporting')}
        />
        {getTableMetrics()}
        {props.isEditMode ? (
          <tr>
            <SourceSelector
              menuItems={[
                TABLE_WIDGET_DATA_SOURCES.metric,
                TABLE_WIDGET_DATA_SOURCES.activity,
                TABLE_WIDGET_DATA_SOURCES.availability,
                TABLE_WIDGET_DATA_SOURCES.participation,
                TABLE_WIDGET_DATA_SOURCES.medical,
                TABLE_WIDGET_DATA_SOURCES.games,
                TABLE_WIDGET_DATA_SOURCES.growthAndMaturation,
              ]}
              onClickSourceItem={(source) => props.onClickAddRow(source)}
              triggerElement={<td className="tableWidget__addRow icon-add" />}
            />
          </tr>
        ) : null}
      </Table.Column>
      {columns.map((columnDetails, index) => {
        const columnData = tableData[getColumnId(columnDetails)] || [];
        const sortedData = sortedRows
          .map(({ id }) => _find(columnData, { id }) || null)
          .filter((item) => !_isNull(item));

        return (
          <Fragment key={columnDetails.column_id}>
            <Table.ColumnSortable className="tableWidget__column" index={index}>
              <ScorecardColumn
                renderedByPrintBuilder={props.renderedByPrintBuilder}
                isEditMode={props.isEditMode}
                canManageDashboard={props.canManageDashboard}
                columnData={sortedData}
                dateSettings={columnDetails.time_scope}
                formattingRules={getColumnFormattingRules()}
                id={columnDetails.id}
                isPivotLocked={columnDetails.config?.pivot_locked || false}
                isSorted={columnDetails.id === props.sortedColumnId}
                name={columnDetails.name}
                onClickDeleteColumn={() =>
                  props.onClickDeleteColumn(columnDetails.id)
                }
                onClickEditColumn={() => props.onClickEditColumn(columnDetails)}
                onClickLockColumnPivot={(columnId, pivotLocked) =>
                  props.onClickLockColumnPivot(columnId, pivotLocked)
                }
                onClickSortColumn={(order) => {
                  props.onColumnSortUpdated(columnDetails.id, order);
                }}
                sortedOrder={props.sortedOrder}
                pivotedDateRange={props.pivotedDateRange}
                pivotedPopulation={props.pivotedPopulation}
                pivotedTimePeriod={props.pivotedTimePeriod}
                pivotedTimePeriodLength={props.pivotedTimePeriodLength}
                populationDetails={columnDetails.population}
                squadAthletes={props.squadAthletes}
                squads={props.squads}
                tableContainerId={props.tableContainerId}
                onDuplicateColumn={props.onDuplicateColumn}
                tableRows={sortedRows}
                fetchRow={fetchRow}
                labels={props.labels}
                groups={props.groups}
              />
            </Table.ColumnSortable>
            <DuplicatingStatus
              widgetId={props.widgetId}
              columnId={columnDetails.id}
              numRows={sortedRows.length}
            />
          </Fragment>
        );
      })}

      {props.showSummary ? (
        <tbody className={summaryColumnClasses}>
          <tr className="tableWidget__blankRow">
            <td />
          </tr>
          <tr className={scoreCardSummaryColumn}>
            <td />
          </tr>
          {sortedRows.map((row) => {
            return (
              <tr className="tableWidget__summaryColumn--row" key={row.id}>
                {forbiddenRows.includes(row.id) ? (
                  <td className="tableWidget__summaryColumn--selectorForbidden" />
                ) : (
                  <td className="tableWidget__summaryColumn--selector">
                    <TooltipMenu
                      menuItems={summaryMenuItems(row)}
                      placement="top-start"
                      tooltipTriggerElement={
                        <div className="tableWidget__summaryColumn--tooltip">
                          <span className="tableWidget__summaryColumn--calc">
                            {searchParams('pivot')
                              ? getSummaryName(
                                  pivotedSummaryId[row.id]
                                    ?.summaryCalculation || ''
                                )
                              : getSummaryName(
                                  row.config?.summary_calculation || ''
                                )}
                          </span>
                          <span className="tableWidget__summaryColumn--value">
                            {searchParams('pivot')
                              ? getSummaryValue(
                                  pivotedSummaryId[row.id]
                                    ?.summaryCalculation || '',
                                  getSummaryData(row.id),
                                  row.table_element?.calculation
                                )
                              : getSummaryValue(
                                  row.config?.summary_calculation || '',
                                  getSummaryData(row.id),
                                  row.table_element?.calculation
                                )}
                          </span>
                        </div>
                      }
                      kitmanDesignSystem
                    />
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      ) : null}
      <tbody>
        {props.isEditMode ? (
          <>
            <tr className="tableWidget__blankRow">
              <td />
            </tr>
            <tr>
              <td
                className="tableWidget__addColumn icon-add"
                onClick={() => props.onClickAddColumn(null)}
              />
            </tr>
          </>
        ) : null}
      </tbody>
    </Table>
  );
}

export const ScorecardTableTranslated = withNamespaces()(ScorecardTable);
export default ScorecardTable;
