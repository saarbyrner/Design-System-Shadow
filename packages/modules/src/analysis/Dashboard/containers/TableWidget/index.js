// @flow
import { useSelector, useDispatch } from 'react-redux';
import { ErrorBoundary } from '@kitman/components';
import { TABLE_WIDGET_DATA_SOURCES } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';
import { setupFormulaPanel } from '@kitman/modules/src/analysis/Dashboard/redux/slices/columnFormulaPanelSlice';
import { TableWidgetTranslated as TableWidget } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget';
import {
  changeColumnSummary,
  deleteTableColumn,
  deleteTableRow,
  lockColumnPivot,
  openTableColumnFormattingPanel,
  openScorecardTableFormattingPanel,
  updateSummaryVisibility,
  updateTableName,
  updateTableColumns,
  duplicateTableColumn,
  setColumnWidthTypeRequest,
  setTableSortOrderRequest,
  updateColumnConfigRequest,
  setRefreshWidgetCacheStatus,
  setRowCalculatedCachedAtRefreshCache,
  setColumnCalculatedCachedAtRefreshCache,
  updateRowConfigRequest,
} from '@kitman/modules/src/analysis/Dashboard/redux/actions/tableWidget';
import {
  editComparisonTableColumn,
  editScorecardTableColumn,
  editLongitudinalTableColumn,
  openTableRowPanel,
  editTableRow,
  openTableColumnPanel,
  openTableColumnFormulaPanel,
} from '@kitman/modules/src/analysis/Dashboard/redux/actions/tableWidget/panel';
import {
  getColumnTypeFactory,
  getTableColumnsByTableContainerIdFactory,
  getTableRowsByTableContainerIdFactory,
  getTableSortColumnIdFactory,
  getTableSortOrderFactory,
} from '@kitman/modules/src/analysis/Dashboard/redux/selectors';
import {
  useGetPermissionsQuery,
  useGetAllGroupsQuery,
  useGetAllLabelsQuery,
  useGetAllSquadAthletesQuery,
  useGetPermittedSquadsQuery,
  useGetSquadAthletesQuery,
} from '@kitman/modules/src/analysis/Dashboard/redux/services/dashboard';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { getWidgetCacheRefreshData } from '@kitman/common/src/utils/TrackingData/src/data/analysis/getWidgetEventData';
import reportingEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/reporting';
import { getMatchingFormulaId } from '@kitman/modules/src/analysis/shared/utils';

// Types
import type {
  RankingCalculation,
  RankingDirection,
  AddColumnData,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';

// TODO define Props type here, defined as Object so flow types can be used in this file.
// Will require a large refactor for proper flow types
export default (props: Object) => {
  const dispatch = useDispatch();
  const containerType = useSelector((state) => state.staticData.containerType);
  const { data: permissions, isSuccess } = useGetPermissionsQuery();
  const canReportOnLabelsAndGroups =
    isSuccess && permissions.analysis.labelsAndGroups.canReport;
  const canManageDashboard = useSelector(
    (state) => state.staticData.canManageDashboard
  );

  const dashboardId = useSelector(
    (state) => state.dashboard.activeDashboard?.id
  );

  const columns = useSelector(
    getTableColumnsByTableContainerIdFactory(props.tableContainerId)
  );
  const rows = useSelector(
    getTableRowsByTableContainerIdFactory(props.tableContainerId)
  );

  const onDuplicateColumn = (widgetId, columnId) => {
    dispatch(duplicateTableColumn(widgetId, columnId));
  };
  const columnWidthType = useSelector(getColumnTypeFactory(props.widgetId));

  const { trackEvent } = useEventTracking();

  const setColumnWidthType = (type) => {
    dispatch(setColumnWidthTypeRequest(props.widgetId, type));
  };
  const setColumnRankingCalculation = (
    columnId: number,
    type: RankingCalculation,
    direction: RankingDirection
  ) => {
    dispatch(
      updateColumnConfigRequest(props.widgetId, columnId, {
        ranking_calculation: {
          type,
          direction,
        },
      })
    );
  };

  const sortedColumnId = useSelector(
    getTableSortColumnIdFactory(props.widgetId)
  );
  const sortedOrder = useSelector(getTableSortOrderFactory(props.widgetId));
  const { data: squadAthletes } = useGetSquadAthletesQuery();
  const { data: squads } = useGetPermittedSquadsQuery();
  const { data: allSquadAthletes, isFetching: isFetchingSquadAthletes } =
    useGetAllSquadAthletesQuery({ refreshCache: true });
  const { data: labels, isFetching: isFetchingLabels } = useGetAllLabelsQuery(
    undefined,
    { skip: !canReportOnLabelsAndGroups }
  );
  const { data: groups, isFetching: isFetchingGroups } = useGetAllGroupsQuery(
    undefined,
    { skip: !canReportOnLabelsAndGroups }
  );
  const isLoadingAthleteData =
    isFetchingSquadAthletes || isFetchingLabels || isFetchingGroups;

  return (
    <ErrorBoundary>
      <TableWidget
        labels={labels || []}
        groups={groups || []}
        isLoadingAthleteData={isLoadingAthleteData}
        appliedColumnDetails={columns}
        appliedRowDetails={rows}
        onChangeColumnSummary={(
          tableContainerId,
          columnId,
          summaryCalc,
          widgetId,
          existingTableColumns
        ) =>
          dispatch(
            changeColumnSummary(
              tableContainerId,
              columnId,
              summaryCalc,
              widgetId,
              existingTableColumns
            )
          )
        }
        onChangeRowSummary={(tableContainerId, rowMetricId, summaryCalc) =>
          dispatch(
            updateRowConfigRequest(props.widgetId, rowMetricId, {
              summary_calculation: summaryCalc,
            })
          )
        }
        onClickAddColumn={({
          source,
          sourceSubtypeId,
          widgetId,
          existingTableColumns,
          existingTableRows,
          tableContainerId,
          tableName,
          tableType,
          showSummary,
        }: AddColumnData) => {
          if (source === TABLE_WIDGET_DATA_SOURCES.formula) {
            dispatch(openTableColumnFormulaPanel());
            dispatch(
              setupFormulaPanel({
                formulaId: sourceSubtypeId,
                widgetId,
                widgetType: tableType,
                tableContainerId,
              })
            );
          } else {
            dispatch(
              openTableColumnPanel(
                source,
                widgetId,
                existingTableColumns,
                existingTableRows,
                tableContainerId,
                tableName,
                tableType,
                showSummary
              )
            );
          }
        }}
        onClickAddRow={(
          source,
          widgetId,
          existingTableColumns,
          existingTableRows,
          tableContainerId,
          tableName,
          tableType,
          showSummary
        ) =>
          dispatch(
            openTableRowPanel(
              source,
              widgetId,
              existingTableColumns,
              existingTableRows,
              tableContainerId,
              tableName,
              tableType,
              showSummary
            )
          )
        }
        onClickDeleteColumn={(widgetId, tableContainerId, columnId) => {
          dispatch(deleteTableColumn(widgetId, tableContainerId, columnId));
        }}
        onClickDeleteRow={(widgetId, tableContainerId, rowId) =>
          dispatch(deleteTableRow(widgetId, tableContainerId, rowId))
        }
        onClickEditRow={(row, tableContainerId, tableType, widgetId) =>
          dispatch(editTableRow(row, tableContainerId, tableType, widgetId))
        }
        onClickEditComparisonColumn={(
          widgetId,
          existingTableColumns,
          tableContainerId,
          columnDetails,
          tableType
        ) => {
          if (
            columnDetails.table_element?.calculation ===
            TABLE_WIDGET_DATA_SOURCES.formula
          ) {
            // TODO: want formula id to be returned by BE to avoid lookup by the expression.
            const tableConfig = columnDetails.table_element.config;
            const formulaId = getMatchingFormulaId(tableConfig.formula);

            if (formulaId == null) {
              return;
            }
            dispatch(openTableColumnFormulaPanel());
            dispatch(
              setupFormulaPanel({
                formulaId,
                widgetId,
                widgetType: tableType,
                tableContainerId,
                columnDetails,
              })
            );
          } else {
            dispatch(
              editComparisonTableColumn(
                widgetId,
                existingTableColumns,
                tableContainerId,
                columnDetails,
                tableType
              )
            );
          }
        }}
        onClickEditScorecardColumn={(
          widgetId,
          existingTableColumns,
          tableContainerId,
          columnDetails,
          tableType
        ) => {
          dispatch(
            editScorecardTableColumn(
              widgetId,
              existingTableColumns,
              tableContainerId,
              columnDetails,
              tableType
            )
          );
        }}
        onClickEditLongitudinalColumn={(
          widgetId,
          existingTableColumns,
          tableContainerId,
          columnDetails,
          tableType
        ) => {
          dispatch(
            editLongitudinalTableColumn(
              widgetId,
              existingTableColumns,
              tableContainerId,
              columnDetails,
              tableType
            )
          );
        }}
        onClickFormatColumn={(
          appliedColumns,
          tableContainerId,
          tableType,
          widgetId,
          columnId,
          columnName,
          unit,
          appliedFormat
        ) => {
          dispatch(
            openTableColumnFormattingPanel(
              appliedColumns,
              tableContainerId,
              tableType,
              widgetId,
              columnId,
              columnName,
              unit,
              appliedFormat
            )
          );
        }}
        onClickLockColumnPivot={(
          tableContainerId,
          columnId,
          pivotLocked,
          widgetId
        ) => {
          dispatch(
            lockColumnPivot(tableContainerId, columnId, pivotLocked, widgetId)
          );
        }}
        onClickFormatScorecardRow={(
          existingTableMetrics,
          tableContainerId,
          widgetId,
          rowMetricId,
          metricName,
          metricUnit,
          appliedFormat
        ) => {
          dispatch(
            openScorecardTableFormattingPanel(
              existingTableMetrics,
              tableContainerId,
              widgetId,
              rowMetricId,
              metricName,
              metricUnit,
              appliedFormat
            )
          );
        }}
        onUpdateSummaryVisibility={(
          widgetId,
          tableName,
          tableType,
          isVisible
        ) =>
          dispatch(
            updateSummaryVisibility(widgetId, tableName, tableType, isVisible)
          )
        }
        onRefreshCache={() => {
          trackEvent(
            reportingEventNames.refreshWidgetData,
            getWidgetCacheRefreshData({
              dashboardId,
              widgetId: props.widgetId,
            })
          );
          if (props.tableType === 'SCORECARD') {
            dispatch(setRowCalculatedCachedAtRefreshCache(props.widgetId));
          } else {
            dispatch(setColumnCalculatedCachedAtRefreshCache(props.widgetId));
          }
          dispatch(setRefreshWidgetCacheStatus(props.tableContainerId, true));
        }}
        onUpdateTableName={(widgetId, tableName, tableConfig) =>
          dispatch(updateTableName(widgetId, tableName, tableConfig))
        }
        canManageDashboard={canManageDashboard}
        containerType={containerType}
        onColumnOrderUpdated={(widgetId, oldIndex, newIndex) => {
          dispatch(updateTableColumns(widgetId, oldIndex, newIndex));
        }}
        sortedColumnId={sortedColumnId}
        sortedOrder={sortedOrder}
        onColumnSortUpdated={(columnId, order) => {
          dispatch(setTableSortOrderRequest(props.widgetId, columnId, order));
        }}
        onDuplicateColumn={onDuplicateColumn}
        columnWidthType={columnWidthType}
        setColumnWidthType={setColumnWidthType}
        setColumnRankingCalculation={setColumnRankingCalculation}
        setRowRankingCalculation={(
          rowId: number,
          type: RankingCalculation,
          direction: RankingDirection
        ) => {
          dispatch(
            updateRowConfigRequest(props.widgetId, rowId, {
              ranking_calculation: {
                type,
                direction,
              },
            })
          );
        }}
        {...props}
        squadAthletes={squadAthletes || { position_groups: [] }}
        allSquadAthletes={allSquadAthletes ? allSquadAthletes.squads : []}
        squads={squads || []}
      />
    </ErrorBoundary>
  );
};
