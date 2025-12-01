// @flow
import { Fragment, useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { arrayMove } from 'react-sortable-hoc';
import _isEmpty from 'lodash/isEmpty';
import _isEqual from 'lodash/isEqual';
import _groupBy from 'lodash/groupBy';
import _uniq from 'lodash/uniq';
import _omit from 'lodash/omit';

import { searchParams } from '@kitman/common/src/utils';
import { getTimePeriodName } from '@kitman/common/src/utils/status_utils';
import { ExpandButton } from '@kitman/playbook/components';
import { InfoTooltip, TooltipMenu } from '@kitman/components';
import { DynamicColumnHeaderTranslated as DynamicColumnHeader } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/ColumnHeader/DynamicColumnHeader';
import {
  type SquadAthletesSelection,
  type SquadAthletes,
} from '@kitman/components/src/types';
import { type Squad } from '@kitman/common/src/types/Squad';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import {
  type TableWidgetDataSource,
  type ColumnSortType,
  type TableWidgetColumn,
  type TableWidgetRow,
  TABLE_WIDGET_DATA_SOURCES,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';
import { type LabelPopulation } from '@kitman/services/src/services/analysis/labels';
import { type GroupPopulation } from '@kitman/services/src/services/analysis/groups';
import useTableData from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/hooks/useTableData';
import useDataFetcher from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/hooks/useDataFetcher';
import {
  getCellDetails,
  getCalculationTitle,
  getSummaryName,
  getSummaryValue,
  getColumnId,
  getFormattedCellValue,
  getColumnCachedAt,
  getPopulationSelectedItems,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/utils';

import Table from '../Table';
import { ComparisonColumnTranslated as ComparisonColumn } from '../Column/ComparisonColumn';
import DuplicatingStatus from '../DuplicatingStatus';
import { SourceSelectorTranslated as SourceSelector } from '../SourceSelector';
import { ExportData } from '../Export';

type Props = {
  locale: string,
  labels: LabelPopulation[],
  groups: GroupPopulation[],
  isLoadingAthleteData: boolean,
  appliedColumnDetails: Array<TableWidgetColumn>,
  appliedRowDetails: Array<TableWidgetRow>,
  canManageDashboard: boolean,
  isEditMode: boolean,
  onChangeColumnSummary: Function,
  onClickAddColumn: (
    source: TableWidgetDataSource,
    sourceSubtypeId?: number
  ) => void,
  onClickAddRow: Function,
  onClickDeleteColumn: Function,
  onClickDeleteRow: Function,
  onClickEditColumn: Function,
  onClickEditRow: Function,
  onClickFormatColumn: Function,
  onClickLockColumnPivot: Function,
  onColumnOrderUpdated: Function,
  onDuplicateColumn: Function,
  onColumnSortUpdated: Function,
  sortedColumnId: ?number,
  sortedOrder: ColumnSortType,
  setColumnRankingCalculation: Function,
  pivotedDateRange?: Object,
  pivotedTimePeriod?: string,
  pivotedTimePeriodLength?: ?number,
  pivotedPopulation: SquadAthletesSelection,
  renderedByPrintBuilder: boolean,
  showSummary: boolean,
  allSquadAthletes: Array<SquadAthletes>,
  squads: Array<Squad>,
  tableContainerId: number,
  widgetId: number,
};

const emptySquadAthletes: SquadAthletesSelection = {
  all_squads: false,
  applies_to_squad: false,
  athletes: [],
  squads: [],
  positions: [],
  position_groups: [],
};

const getColumnName = (column) => {
  return column.name || '';
};

const getCalculation = (column) => {
  return getCalculationTitle(column.table_element?.calculation);
};

function ComparisonTable(props: I18nProps<Props>) {
  const isPivoted =
    window.getFlag('table-updated-pivot') && !!searchParams('pivot');
  const [rows, setRows] = useState(props.appliedRowDetails);
  const [columns, setColumns] = useState(props.appliedColumnDetails);
  const [pivotedSummaryCalcs, setPivotedSumamryCalcs] = useState({});
  const [collapsedRows, setCollapsedRows] = useState({});

  const tableDataClasses = classNames('tableWidget__rowHeader', {
    'tableWidget__rowHeader--disabled': !props.canManageDashboard,
  });

  const dynamicTableDataClasses = classNames(
    'tableWidget__rowHeader',
    'tableWidget__rowHeader--dynamicTableData'
  );

  const dynamicPopulationClasses = classNames(
    'tableWidget__rowHeader--populationName',
    'tableWidget__rowHeader--lightText'
  );

  const toggleRow = (rowId: number) => {
    setCollapsedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  const {
    fetchData,
    fetchColumn,
    tableData,
    sortedRows,
    dynamicRows,
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

  const refreshCacheStatus = useSelector((state) => {
    const currentWidget = state.dashboard?.widgets?.find(
      (item) => item.id === props.widgetId
    );
    return currentWidget?.widget?.table_container?.refreshCacheStatus ?? false;
  });

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
     * This useEffect syncs the colums with the props.appliecColumnDetails
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

    const getDatePeriod = (column) => {
      const isPivotLocked = column.config?.pivot_locked || false;
      const dateSettings = column.time_scope;

      if (isPivoted && props.pivotedTimePeriod !== '' && !isPivotLocked) {
        return getTimePeriodName(
          props.pivotedTimePeriod,
          {
            startDate: props.pivotedDateRange?.start_date,
            endDate: props.pivotedDateRange?.end_date,
          },
          props.pivotedTimePeriodLength
        );
      }

      return getTimePeriodName(
        dateSettings.time_period,
        {
          startDate: dateSettings.start_time,
          endDate: dateSettings.end_time,
        },
        dateSettings.time_period_length,
        dateSettings.time_period_length_offset
      );
    };

    const getSummary = (column) => {
      const columnData = tableData[getColumnId(column)] || {
        data: [],
        status: '',
        message: '',
      };

      const summaryId = isPivoted
        ? pivotedSummaryCalcs[column.id]
        : column.config?.summary_calculation;

      return `${getSummaryName(summaryId || '')}: ${getSummaryValue(
        summaryId || 'mean',
        columnData.data.map(({ value }) => value),
        column.table_element?.calculation
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
        return isColumnForbidden(column) ? '-' : getDatePeriod(column);
      }, ' '),
      columnsProcesser((column) => {
        return isColumnForbidden(column) ? '-' : getCalculation(column);
      }, ' '),
    ];

    const dataRows = sortedRows.map((row) => {
      const selectedItems = getPopulationSelectedItems({
        squads: props.squads,
        allSquadAthletes: props.allSquadAthletes,
        labels: props.labels,
        groups: props.groups,
        population: row.population,
      });
      const selectedItemsString = selectedItems.join(', ');

      return columnsProcesser((column) => {
        if (isColumnForbidden(column)) {
          return '';
        }

        const columnData = tableData[getColumnId(column)] || {
          data: [],
          status: '',
          message: '',
        };
        const cellDetails = getCellDetails(columnData.data, row.row_id);

        return getFormattedCellValue(cellDetails.value, column.summary);
      }, selectedItemsString);
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

          //  Only persisting the column order if there is no pivoted date range:
          if (_isEmpty(props.pivotedTimePeriod)) {
            props.onColumnOrderUpdated(oldIndex, newIndex);
          }
        }
      }}
    >
      <ExportData data={exportData} options={exportOptions} />
      <Table.Column className="tableWidget__population tableWidget__title-column">
        <Table.BlankRow />
        <Table.BlankRow header />
        {sortedRows.map((row, index) => {
          const rowPopulation = row.population || emptySquadAthletes;

          if (props.isLoadingAthleteData) {
            return (
              // eslint-disable-next-line react/no-array-index-key
              <Table.Row key={`${row.id}-${row.row_id}-${index}`}>
                <Table.LoadingCell className="tableWidget__rowHeader" />
              </Table.Row>
            );
          }

          const selectedItems = getPopulationSelectedItems({
            squads: props.squads,
            allSquadAthletes: props.allSquadAthletes,
            labels: props.labels,
            groups: props.groups,
            population: rowPopulation,
          });
          const selectedItemsString = selectedItems.join(', ');

          const getSelectedSquad = (squadId: string) =>
            props.squads.find((squad) => squad.id === squadId)?.name;

          const selectedSquads =
            _uniq(row.population?.context_squads?.map(getSelectedSquad)) || [];

          const getTooltipContent = () => {
            if (selectedSquads.length > 0) {
              return (
                <>
                  <span className="tableWidget__tooltip--populationName">
                    {selectedItemsString}
                  </span>
                  <span className="tableWidget__tooltip--contextSquad">
                    {props.squads.length === selectedSquads.length
                      ? props.t('All squads')
                      : selectedSquads.join(', ')}
                  </span>
                </>
              );
            }

            return null;
          };

          // Render dynamic parent row
          if (
            window.getFlag('rep-table-widget-dynamic-rows') &&
            row?.isDynamic
          ) {
            return (
              // eslint-disable-next-line react/no-array-index-key
              <Fragment key={`dynamic-row-${row.id}-${index}`}>
                <Table.Row
                  data-testid="ComparisonTable|PopulationRow"
                  className="tableWidget__comparisonPopulationRow"
                >
                  <td className={dynamicTableDataClasses}>
                    <ExpandButton
                      ariaLabel={props.t('Expand rows')}
                      handleClick={() => toggleRow(row.id)}
                      isCollapsed={collapsedRows[row.id]}
                      isDisabled={!dynamicRows[row.row_id]?.length}
                    />
                    <DynamicColumnHeader
                      columnName={selectedItemsString}
                      onClickDeleteRow={() => props.onClickDeleteRow(row.id)}
                      onClickEditRow={() => props.onClickEditRow(row)}
                      canManageDashboard={props.canManageDashboard}
                      isHistoricPopulation={!!rowPopulation?.historic}
                      squads={props.squads}
                    />
                  </td>
                </Table.Row>

                {
                  // If not collapsed, render dynamic rows
                  !collapsedRows[row.id] &&
                    // Map over dynamic rows associated with the given row_id
                    dynamicRows[row.row_id]?.map((label) => {
                      return (
                        <Table.Row
                          className="tableWidget__comparisonPopulationRow--disabled"
                          key={`dynamic-row-${row.id}-${label}`}
                        >
                          <td className="tableWidget__rowHeader--dynamic">
                            <div className="tableWidget__rowHeader--container">
                              <span className={dynamicPopulationClasses}>
                                {label}
                              </span>
                            </div>
                          </td>
                        </Table.Row>
                      );
                    })
                }
              </Fragment>
            );
          }

          return (
            <Table.Row
              data-testid="ComparisonTable|PopulationRow"
              className="tableWidget__comparisonPopulationRow"
              // eslint-disable-next-line react/no-array-index-key
              key={`${row.id}-${row.row_id}-${index}`}
            >
              <td className={tableDataClasses}>
                <TooltipMenu
                  data-testid="ComparisonTable|PopulationRowTooltip"
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
                        content={getTooltipContent()}
                        placement="bottom-start"
                      >
                        <div data-testid="ComparisonTable|PopulationRowData">
                          <i className="tableWidget__rowHeader--burgerMenu icon-more" />
                          <span className="tableWidget__rowHeader--populationName">
                            {selectedItemsString}
                          </span>
                          {selectedSquads.length > 0 && (
                            <span className="tableWidget__rowHeader--contextSquad">
                              {selectedSquads.join(', ')}
                            </span>
                          )}
                          {window.getFlag('rep-historic-reporting') &&
                            rowPopulation?.historic && (
                              <div className="tableWidget__rowHeader--contextSquad">
                                {props.t('Historical squad')}
                              </div>
                            )}
                        </div>
                      </InfoTooltip>
                    </div>
                  }
                  kitmanDesignSystem
                />
              </td>
            </Table.Row>
          );
        })}
        {props.showSummary ? (
          <Table.Row className="tableWidget__summaryRow">
            <td className="tableWidget__summaryRow--count">
              {props.t('Count: {{count}}', {
                count: rows.length,
              })}
            </td>
          </Table.Row>
        ) : null}
        {props.isEditMode ? (
          <Table.Row>
            <td
              className="tableWidget__addRow icon-add"
              onClick={() => props.onClickAddRow(null)}
            />
          </Table.Row>
        ) : null}
      </Table.Column>
      {columns.map((columnDetails, index) => {
        const id = getColumnId(columnDetails);
        const columnData = tableData[id];
        return (
          <Fragment key={`column-${id}`}>
            <Table.ColumnSortable className="tableWidget__column" index={index}>
              <ComparisonColumn
                appliedRowDetails={sortedRows}
                dynamicRows={dynamicRows}
                calculation={columnDetails.table_element?.calculation}
                canManageDashboard={props.canManageDashboard}
                cachedAt={getColumnCachedAt(columnDetails)}
                data={columnData.data}
                dataStatus={columnData.status}
                dataMessage={columnData.message}
                dateSettings={columnDetails.time_scope}
                fetchColumn={() => {
                  fetchColumn(columnDetails.id, columnDetails.column_id);
                }}
                formattingRules={
                  columnDetails.config?.conditional_formatting || []
                }
                id={columnDetails.id}
                dataId={columnDetails.column_id}
                isEditMode={props.isEditMode}
                isPivotLocked={columnDetails.config?.pivot_locked || false}
                isSorted={columnDetails.id === props.sortedColumnId}
                metricDetails={columnDetails.table_element?.data_source}
                name={columnDetails.name}
                setColumnRankingCalculation={(type, calculation) => {
                  props.setColumnRankingCalculation(
                    columnDetails.id,
                    type,
                    calculation
                  );
                }}
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
                columnRankingCalculation={
                  columnDetails.config?.ranking_calculation
                }
                onClickSortColumn={(order) => {
                  props.onColumnSortUpdated(columnDetails.id, order);
                }}
                onDuplicateColumn={props.onDuplicateColumn}
                pivotedData={columnDetails.data || {}}
                pivotedDateRange={props.pivotedDateRange}
                pivotedPopulation={props.pivotedPopulation}
                pivotedTimePeriod={props.pivotedTimePeriod}
                pivotedTimePeriodLength={props.pivotedTimePeriodLength}
                renderedByPrintBuilder={props.renderedByPrintBuilder}
                showSummary={props.showSummary}
                summaryCalculation={
                  isPivoted
                    ? pivotedSummaryCalcs[columnDetails.id] || 'mean'
                    : columnDetails.config?.summary_calculation || 'mean'
                }
                tableContainerId={props.tableContainerId}
                collapsedRows={collapsedRows}
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
                data-testid="ComparisonTable|SourceSelector"
                menuItems={[
                  TABLE_WIDGET_DATA_SOURCES.metric,
                  TABLE_WIDGET_DATA_SOURCES.activity,
                  TABLE_WIDGET_DATA_SOURCES.availability,
                  TABLE_WIDGET_DATA_SOURCES.participation,
                  TABLE_WIDGET_DATA_SOURCES.medical,
                  TABLE_WIDGET_DATA_SOURCES.games,
                  TABLE_WIDGET_DATA_SOURCES.formula,
                  TABLE_WIDGET_DATA_SOURCES.growthAndMaturation,
                ]}
                onClickSourceItem={(
                  source: TableWidgetDataSource,
                  sourceSubtypeId?: number
                ) => props.onClickAddColumn(source, sourceSubtypeId)}
                triggerElement={
                  <td
                    className="tableWidget__addColumn icon-add"
                    data-testid="addColumnTrigger"
                  />
                }
              />
            </tr>
          </>
        ) : null}
      </Table.Column>
    </Table>
  );
}

export const ComparisonTableTranslated = withNamespaces()(ComparisonTable);
export default ComparisonTable;
