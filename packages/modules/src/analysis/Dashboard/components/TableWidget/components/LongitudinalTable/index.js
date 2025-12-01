// @flow
import { Fragment, useState, useEffect, useMemo } from 'react';
import { withNamespaces } from 'react-i18next';
import { arrayMove } from 'react-sortable-hoc';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import _groupBy from 'lodash/groupBy';
import _omit from 'lodash/omit';
import _isEqual from 'lodash/isEqual';
import _uniq from 'lodash/uniq';
import { searchParams } from '@kitman/common/src/utils';
import {
  type SquadAthletesSelection,
  type SquadAthletes,
} from '@kitman/components/src/types';
import { type Squad } from '@kitman/common/src/types/Squad';
import { InfoTooltip, TooltipMenu } from '@kitman/components';
import { getPeriodName } from '@kitman/modules/src/analysis/shared/utils';
import { type LabelPopulation } from '@kitman/services/src/services/analysis/labels';
import { type GroupPopulation } from '@kitman/services/src/services/analysis/groups';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import {
  getCellDetails,
  getCalculationTitle,
  getTablePopulation,
  getSummaryName,
  getSummaryValue,
  getColumnId,
  getColumnCachedAt,
  getFormattedCellValue,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/utils';
import useTableData from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/hooks/useTableData';
import useDataFetcher from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/hooks/useDataFetcher';
import {
  type ColumnSortType,
  type TableWidgetColumn,
  type TableWidgetRow,
  TABLE_WIDGET_DATA_SOURCES,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';

import { LongitudinalColumnTranslated as LongitudinalColumn } from '../Column/LongitudinalColumn';
import Table from '../Table';
import { SourceSelectorTranslated as SourceSelector } from '../SourceSelector';
import DuplicatingStatus from '../DuplicatingStatus';
import { ExportData } from '../Export';

type Props = {
  locale: string,
  appliedColumnDetails: Array<TableWidgetColumn>,
  appliedRowDetails: Array<TableWidgetRow>,
  canManageDashboard: boolean,
  isEditMode: boolean,
  onChangeColumnSummary: Function,
  onClickAddColumn: Function,
  onClickAddRow: Function,
  onClickDeleteColumn: Function,
  onClickDeleteRow: Function,
  onClickEditColumn: Function,
  onClickEditRow: Function,
  onClickFormatColumn: Function,
  onClickLockColumnPivot: Function,
  onColumnOrderUpdated: Function,
  onColumnSortUpdated: Function,
  sortedColumnId: ?number,
  sortedOrder: ColumnSortType,
  onDuplicateColumn: Function,
  pivotedDateRange?: Object,
  pivotedPopulation: SquadAthletesSelection,
  pivotedTimePeriod?: string,
  pivotedTimePeriodLength?: ?number,
  renderedByPrintBuilder: boolean,
  showSummary: boolean,
  squadAthletes: SquadAthletes,
  squads: Array<Squad>,
  setColumnRankingCalculation: Function,
  tableContainerId: number,
  widgetId: number,
  labels?: Array<LabelPopulation>,
  groups?: Array<GroupPopulation>,
};

const getRowTimePeriodName = (rowTimeScope) => {
  return getPeriodName(
    rowTimeScope.time_period,
    {
      startDate: rowTimeScope.start_time,
      endDate: rowTimeScope.end_time,
    },
    rowTimeScope.time_period_length,
    rowTimeScope.time_period_length_offset
  );
};
const getColumnName = (column) => {
  return column.name || '';
};

function LongitudinalTable(props: I18nProps<Props>) {
  const isPivoted =
    window.getFlag('table-updated-pivot') && !!searchParams('pivot');
  const [rows, setRows] = useState(props.appliedRowDetails);
  const [columns, setColumns] = useState(props.appliedColumnDetails);
  const [pivotedSummaryCalcs, setPivotedSumamryCalcs] = useState({});

  const rowHeaderClasses = classNames('tableWidget__rowHeader', {
    'tableWidget__rowHeader--disabled': !props.canManageDashboard,
  });

  const {
    fetchData,
    fetchColumn,
    tableData,
    sortedRows,
    initiateRefreshCache,
  } = useTableData(
    props.tableContainerId,
    props.widgetId,
    columns,
    rows,
    props.sortedColumnId,
    props.sortedOrder,
    isPivoted
      ? {
          pivot: {
            time_period: props.pivotedTimePeriod,
            time_period_length: props.pivotedTimePeriodLength,
            date_range: props.pivotedDateRange,
            population: props.pivotedPopulation,
          },
        }
      : null,
    props.locale
  );

  const currentWidget = useSelector((state) =>
    state.dashboard?.widgets?.find((item) => item.id === props.widgetId)
  );

  const refreshCacheStatus =
    currentWidget?.widget?.table_container?.refreshCacheStatus;

  useDataFetcher(
    rows,
    columns,
    fetchData,
    fetchColumn,
    refreshCacheStatus ?? false,
    initiateRefreshCache
  );

  useEffect(() => {
    /**
     * This useEffect syncs the colums with the props.appliedColumnDetails
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

  useEffect(() => {
    /**
     * This useEffect syncs the colums with the props.appliedRowDetails
     * Checks if it is equal on every field except `order` as that is loaded
     * once on component mount and maintained locally in the rows variable
     */

    const stripOrder = (row) => _omit(row, 'order');

    if (
      !_isEqual(
        _groupBy(props.appliedRowDetails.map(stripOrder), 'id'),
        _groupBy(rows.map(stripOrder), 'id')
      )
    ) {
      setRows(props.appliedRowDetails);
    }
  }, [props.appliedRowDetails]);

  const { exportData, exportOptions } = useMemo(() => {
    const isColumnForbidden = (column) => {
      const columnData = tableData[getColumnId(column)] || {
        data: [],
        status: '',
        message: '',
      };

      return columnData.status === 'FORBIDDEN';
    };

    const getPopulationDetails = (column) => {
      const population = getTablePopulation(
        column.population,
        props.squadAthletes,
        props.squads,
        []
      )[0];

      return population ? population.name : '';
    };

    const getCalculation = (column) => {
      return getCalculationTitle(column.table_element?.calculation);
    };

    const getSummary = (column) => {
      const columnData = tableData[getColumnId(column)] || {
        data: [],
        status: '',
        message: '',
      };

      const summaryId = isPivoted
        ? pivotedSummaryCalcs[getColumnId(column)]
        : column.config?.summary_calculation;

      return `${getSummaryName(summaryId || 'mean')}: ${getSummaryValue(
        summaryId || '',
        columnData.data.map(({ value }) => value),
        column?.table_element?.calculation
      )}`;
    };

    const columnsProcesser = (
      getCellDetailsCallback: Function,
      title: string
    ) => {
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
          }
        ),
      };
    };

    const titleRows = [
      columnsProcesser((column) => {
        return isColumnForbidden(column) ? '-' : getPopulationDetails(column);
      }, ' '),
      columnsProcesser((column) => {
        return isColumnForbidden(column) ? '-' : getCalculation(column);
      }, ' '),
    ];

    const dataRows = sortedRows.map((row) => {
      return columnsProcesser((column) => {
        if (isColumnForbidden(column)) {
          return ' ';
        }

        const columnData = tableData[getColumnId(column)] || {
          data: [],
          status: '',
          message: '',
        };
        const cellDetails = getCellDetails(columnData.data, row.row_id);

        return getFormattedCellValue(cellDetails.value, column.summary);
      }, getRowTimePeriodName(row.time_scope));
    });

    const summary = props.showSummary
      ? [
          columnsProcesser(
            (column) => {
              return getSummary(column);
            },
            props.t('Count: {{count}}', {
              count: sortedRows.length,
            })
          ),
        ]
      : [];

    const fields = [
      { value: 'title', label: ' ' },
      ...columns.map((column) => {
        return {
          value: `${getColumnId(column)}`,
          label: getColumnName(column),
        };
      }),
    ];

    return {
      exportOptions: { fields },
      exportData: [...titleRows, ...dataRows, ...summary],
    };
  }, [tableData, columns, sortedRows, props.showSummary, pivotedSummaryCalcs]);

  return (
    <Table
      onUpdateColumnOrder={({ oldIndex, newIndex }) => {
        if (oldIndex !== newIndex) {
          setColumns(arrayMove(columns, oldIndex, newIndex));

          if (!isPivoted) {
            props.onColumnOrderUpdated(oldIndex, newIndex);
          }
        }
      }}
    >
      <ExportData data={exportData} options={exportOptions} />
      <Table.Column className="tableWidget__dateRange tableWidget__title-column">
        <Table.BlankRow />
        <Table.BlankRow header />
        {sortedRows.map((row) => {
          return (
            <Table.Row
              data-testid="LongitudinalTable|AppliedTimeScope"
              key={`${row.id}_${row.row_id}`}
            >
              <td className={rowHeaderClasses}>
                <TooltipMenu
                  placement="bottom-end"
                  menuItems={[
                    {
                      description: props.t('Edit'),
                      icon: 'icon-edit',
                      isDisabled: isPivoted,
                      onClick: () => props.onClickEditRow(row),
                    },
                    {
                      description: props.t('Delete Row'),
                      icon: 'icon-bin',
                      isDisabled: isPivoted,
                      onClick: () => props.onClickDeleteRow(row.id),
                      isDestructive: true,
                    },
                  ]}
                  tooltipTriggerElement={
                    <div className="tableWidget__rowHeader--container">
                      <InfoTooltip
                        content={getRowTimePeriodName(row.time_scope)}
                      >
                        <div>
                          <i className="tableWidget__rowHeader--burgerMenu icon-more" />
                          <div className="tableWidget__rowHeader--populationName">
                            {getRowTimePeriodName(row.time_scope)}
                          </div>
                        </div>
                      </InfoTooltip>
                    </div>
                  }
                  disabled={!props.canManageDashboard}
                  kitmanDesignSystem
                />
              </td>
            </Table.Row>
          );
        })}
        {props.showSummary ? (
          <tr className="tableWidget__summaryRow">
            <td className="tableWidget__summaryRow--count">
              {props.t('Count: {{count}}', {
                count: rows.length,
              })}
            </td>
          </tr>
        ) : null}
        {props.isEditMode ? (
          <tr>
            <td
              className="tableWidget__addRow icon-add"
              onClick={() => props.onClickAddRow(null)}
            />
          </tr>
        ) : null}
      </Table.Column>
      {columns.map((columnDetails, index) => {
        const id = getColumnId(columnDetails);
        const columnData = tableData[id] || {
          data: [],
          status: '',
          message: '',
        };

        const getSelectedSquad = (squadId: number | string) =>
          props.squads.find((squad) => squad.id === squadId)?.name;

        const selectedSquads =
          _uniq(
            columnDetails.population?.context_squads?.map(getSelectedSquad)
          ) || [];
        return (
          <Fragment key={id}>
            <Table.ColumnSortable className="tableWidget__column" index={index}>
              <LongitudinalColumn
                appliedRowDetails={sortedRows}
                canManageDashboard={props.canManageDashboard}
                data={columnData.data}
                dataStatus={columnData.status}
                dataMessage={columnData.message}
                fetchColumn={() => {
                  fetchColumn(columnDetails.id, columnDetails.column_id);
                }}
                formattingRules={
                  columnDetails.config?.conditional_formatting || []
                }
                id={columnDetails.id}
                cachedAt={getColumnCachedAt(columnDetails)}
                columnId={columnDetails.column_id}
                isEditMode={props.isEditMode}
                isPivoted={isPivoted}
                isPivotLocked={columnDetails.config?.pivot_locked || false}
                isSorted={columnDetails.id === props.sortedColumnId}
                metricDetails={columnDetails.table_element}
                name={columnDetails.name}
                onChangeColumnSummary={(columnId, summaryCalc) => {
                  if (isPivoted) {
                    setPivotedSumamryCalcs((prevState) => {
                      return {
                        ...prevState,
                        [columnId]: summaryCalc,
                      };
                    });
                  } else {
                    props.onChangeColumnSummary(columnId, summaryCalc);
                  }
                }}
                onClickDeleteColumn={() =>
                  props.onClickDeleteColumn(columnDetails.id)
                }
                onClickEditColumn={() => props.onClickEditColumn(columnDetails)}
                onClickFormatColumn={(
                  columnId,
                  columnName,
                  metricUnit,
                  appliedFormat
                ) => {
                  props.onClickFormatColumn(
                    columnId,
                    columnName,
                    metricUnit,
                    appliedFormat
                  );
                }}
                onClickLockColumnPivot={(columnId, pivotLocked) =>
                  props.onClickLockColumnPivot(columnId, pivotLocked)
                }
                sortedOrder={props.sortedOrder}
                rankingCalculation={columnDetails.config?.ranking_calculation}
                setColumnRankingCalculation={(type, calculation) => {
                  props.setColumnRankingCalculation(
                    columnDetails.id,
                    type,
                    calculation
                  );
                }}
                onClickSortColumn={(order) => {
                  props.onColumnSortUpdated(columnDetails.id, order);
                }}
                onDuplicateColumn={props.onDuplicateColumn}
                pivotedData={columnDetails.data || {}}
                pivotedDateRange={props.pivotedDateRange}
                pivotedPopulation={props.pivotedPopulation}
                pivotedTimePeriod={props.pivotedTimePeriod}
                pivotedTimePeriodLength={props.pivotedTimePeriodLength}
                populationDetails={columnDetails.population}
                renderedByPrintBuilder={props.renderedByPrintBuilder}
                showSummary={props.showSummary}
                squadAthletes={props.squadAthletes}
                squads={props.squads}
                selectedSquads={selectedSquads}
                summaryCalculation={
                  isPivoted
                    ? pivotedSummaryCalcs[columnDetails.column_id] || 'mean'
                    : columnDetails.config?.summary_calculation || 'mean'
                }
                tableContainerId={props.tableContainerId}
                labels={props.labels}
                groups={props.groups}
              />
            </Table.ColumnSortable>
            <DuplicatingStatus
              widgetId={props.widgetId}
              columnId={columnDetails.id}
              numRows={rows.length}
            />
          </Fragment>
        );
      })}
      <Table.Column>
        {props.isEditMode ? (
          <>
            <Table.BlankRow />
            <tr>
              <SourceSelector
                data-testid="LongitudinalTable|SourceSelector"
                menuItems={[
                  TABLE_WIDGET_DATA_SOURCES.metric,
                  TABLE_WIDGET_DATA_SOURCES.activity,
                  TABLE_WIDGET_DATA_SOURCES.availability,
                  TABLE_WIDGET_DATA_SOURCES.participation,
                  TABLE_WIDGET_DATA_SOURCES.medical,
                  TABLE_WIDGET_DATA_SOURCES.games,
                  TABLE_WIDGET_DATA_SOURCES.growthAndMaturation,
                ]}
                onClickSourceItem={(source) => props.onClickAddColumn(source)}
                triggerElement={
                  <td className="tableWidget__addColumn icon-add" />
                }
              />
            </tr>
          </>
        ) : null}
      </Table.Column>
    </Table>
  );
}

export const LongitudinalTableTranslated = withNamespaces()(LongitudinalTable);
export default LongitudinalTable;
