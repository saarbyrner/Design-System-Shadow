// @flow
import { useState, useCallback, useMemo } from 'react';
import { withNamespaces } from 'react-i18next';
import classNames from 'classnames';
import { AppStatus, TextButton, EditInPlace } from '@kitman/components';
import { KitmanIcon } from '@kitman/playbook/icons';
import { IconButton } from '@kitman/playbook/components';
import {
  sortCacheTimestamps,
  isDashboardPivoted,
} from '@kitman/modules/src/analysis/Dashboard/utils';
import { DATA_STATUS } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/consts';
import {
  getCachedAtRolloverContent,
  getColumnCachedAt,
  getRowCachedAt,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/utils';
import { ComparisonTableTranslated as ComparisonTable } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/ComparisonTable';
import { ScorecardTableTranslated as ScorecardTable } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/ScorecardTable';
import { LongitudinalTableTranslated as LongitudinalTable } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/LongitudinalTable';
import WidgetMenu from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/WidgetMenu';
import { ExportProvider } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/Export';
import WidgetCard from '@kitman/modules/src/analysis/Dashboard/components/WidgetCard';
import {
  type SquadAthletesSelection,
  type SquadAthletes,
} from '@kitman/components/src/types';
import { type Squad } from '@kitman/common/src/types/Squad';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import { type LabelPopulation } from '@kitman/services/src/services/analysis/labels';
import { type GroupPopulation } from '@kitman/services/src/services/analysis/groups';
import { type ContainerType } from '@kitman/modules/src/analysis/Dashboard/types';
import {
  type AddColumnData,
  type TableWidgetDataSource,
  type TableWidgetColumn,
  type TableWidgetRow,
  type TableWidgetType,
  type ColumnWidthType,
  type ColumnSortType,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';

type Props = {
  locale: string,
  labels: LabelPopulation,
  groups: GroupPopulation[],
  isLoadingAthleteData: boolean,
  appliedColumnDetails: Array<TableWidgetColumn>,
  appliedRowDetails: Array<TableWidgetRow>,
  canManageDashboard: boolean,
  containerType: ContainerType,
  columnWidthType: ColumnWidthType,
  hasError?: boolean,
  isLoading?: boolean,
  onChangeColumnSummary: Function,
  onChangeRowSummary: Function,
  onClickAddColumn: (data: AddColumnData) => void,
  onClickAddRow: Function,
  onClickDeleteColumn: Function,
  onClickDeleteRow: Function,
  onClickEditComparisonColumn: Function,
  onClickEditLongitudinalColumn: Function,
  onClickEditRow: Function,
  onClickEditScorecardColumn: Function,
  onClickFormatColumn: Function,
  onClickFormatScorecardRow: Function,
  onClickLockColumnPivot: Function,
  onColumnOrderUpdated: Function,
  onRefreshCache: Function,
  onDelete: Function,
  onDuplicate: Function,
  onDuplicateColumn: Function,
  onUpdateSummaryVisibility: Function,
  onUpdateTableName: Function,
  pivotedDateRange?: Object,
  pivotedPopulation: SquadAthletesSelection,
  pivotedTimePeriod?: string,
  pivotedTimePeriodLength?: ?number,
  renderedByPrintBuilder: boolean,
  setColumnWidthType: Function,
  setColumnRankingCalculation: Function,
  setRowRankingCalculation: Function,
  sortedColumnId: ?number,
  sortedOrder: ColumnSortType,
  onColumnSortUpdated: Function,
  showSummary: boolean,
  squadAthletes: SquadAthletes,
  allSquadAthletes: Array<SquadAthletes>,
  squads: Array<Squad>,
  tableContainerId: number,
  tableName: string,
  tableType: TableWidgetType,
  widgetId: number,
};

const getColumnWidthLayout = (columnWidthType: ColumnWidthType) => {
  const prefix = 'tableWidget__layout--';

  switch (columnWidthType) {
    case 'FIT_TO_CONTENT': {
      return `${prefix}fit-to-content`;
    }
    case 'FIT_TO_WIDTH': {
      return `${prefix}fit-to-width`;
    }
    case 'NARROW': {
      return `${prefix}narrow`;
    }
    case 'NORMAL': {
      return `${prefix}normal`;
    }
    case 'WIDE': {
      return `${prefix}wide`;
    }
    default: {
      return `${prefix}normal`;
    }
  }
};

const styles = {
  rollover: {
    fontSize: '10px',
    padding: '0.2rem',
  },
  refreshButton: { width: '20px', height: '20px' },
  refreshIcon: { height: '18px' },
};

function TableWidget(props: I18nProps<Props>) {
  const [feedbackModalStatus, setFeedbackModalStatus] = useState(null);
  const [feedbackModalMessage, setFeedbackModalMessage] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const tableWidgetClasses = classNames(
    'tableWidget',
    {
      'tableWidget--loading': props.isLoading,
      'tableWidget--error': props.hasError,
    },
    getColumnWidthLayout(props.columnWidthType)
  );

  const emptyTableContent = () => {
    return (
      <div className="tableWidget__empty">
        <button
          type="button"
          className="tableWidget__editTable"
          onClick={() => {
            setEditMode(true);
          }}
        >
          <i className="tableWidget__editTable--icon icon-edit" />
          <span className="tableWidget__editTable--text">
            {props.t('Edit Table')}
          </span>
        </button>
      </div>
    );
  };

  const { loadingStatusList, cachedAtArray } = useMemo(() => {
    let loadList = [];
    let cArray = [];
    if (props.tableType === 'SCORECARD') {
      loadList = props.appliedRowDetails.map((row) => row.loadingStatus);
      cArray = props.appliedRowDetails
        .map((row) => getRowCachedAt(row))
        .filter(Boolean);
    } else {
      loadList = props.appliedColumnDetails.map((col) => col.loadingStatus);
      cArray = props.appliedColumnDetails
        .map((col) => getColumnCachedAt(col))
        .filter(Boolean);
    }
    return {
      loadingStatusList: loadList,
      cachedAtArray: cArray,
    };
  }, [props.appliedColumnDetails, props.appliedRowDetails, props.tableType]);

  const cachedAtRollover = useMemo(() => {
    if (cachedAtArray.length === 0) {
      return '';
    }

    const sortedCachedAtTimestamps = sortCacheTimestamps(cachedAtArray);

    return getCachedAtRolloverContent(
      sortedCachedAtTimestamps[0],
      loadingStatusList.includes(DATA_STATUS.caching)
        ? DATA_STATUS.caching
        : DATA_STATUS.success,
      props.locale
    );
  }, [cachedAtArray, loadingStatusList, props.locale]);

  const getTableContent = () => {
    if (
      !editMode &&
      props.appliedColumnDetails.length === 0 &&
      props.appliedRowDetails.length === 0
    ) {
      return emptyTableContent();
    }

    const commonProps = {
      locale: props.locale,
      appliedColumnDetails: props.appliedColumnDetails,
      appliedRowDetails: props.appliedRowDetails,
      canManageDashboard: props.canManageDashboard,
      isEditMode: editMode,
      pivotedDateRange: props.pivotedDateRange,
      pivotedPopulation: props.pivotedPopulation,
      pivotedTimePeriod: props.pivotedTimePeriod,
      pivotedTimePeriodLength: props.pivotedTimePeriodLength,

      renderedByPrintBuilder: props.renderedByPrintBuilder,
      showSummary: props.showSummary,

      sortedColumnId: props.sortedColumnId,
      sortedOrder: props.sortedOrder,
      onColumnSortUpdated: props.onColumnSortUpdated,

      squadAthletes: props.squadAthletes,
      squads: props.squads,
      tableContainerId: props.tableContainerId,
      widgetId: props.widgetId,

      onColumnOrderUpdated: (oldIndex, newIndex) => {
        props.onColumnOrderUpdated(props.widgetId, oldIndex, newIndex);
      },
      onClickAddRow: (source) => {
        props.onClickAddRow(
          source,
          props.widgetId,
          props.appliedColumnDetails,
          props.appliedRowDetails,
          props.tableContainerId,
          props.tableName,
          props.tableType,
          props.showSummary
        );
      },
      onClickAddColumn: (
        source: TableWidgetDataSource,
        sourceSubtypeId?: number
      ) => {
        props.onClickAddColumn({
          source,
          sourceSubtypeId,
          widgetId: props.widgetId,
          existingTableColumns: props.appliedColumnDetails,
          existingTableRows: props.appliedRowDetails,
          tableContainerId: props.tableContainerId,
          tableName: props.tableName,
          tableType: props.tableType,
          showSummary: props.showSummary,
        });
      },
      onClickDeleteColumn: (columnId) => {
        props.onClickDeleteColumn(
          props.widgetId,
          props.tableContainerId,
          columnId
        );
      },
      onClickDeleteRow: (rowId) => {
        props.onClickDeleteRow(props.widgetId, props.tableContainerId, rowId);
      },
      onClickEditRow: (row) => {
        props.onClickEditRow(
          row,
          props.tableContainerId,
          props.tableType,
          props.widgetId
        );
      },
      onClickLockColumnPivot: (columnId, pivotLocked) => {
        props.onClickLockColumnPivot(
          props.tableContainerId,
          columnId,
          pivotLocked,
          props.widgetId
        );
      },
      onDuplicateColumn: (columnId) => {
        props.onDuplicateColumn(props.widgetId, columnId);
      },
    };

    if (props.tableType === 'COMPARISON') {
      return (
        <ComparisonTable
          {...commonProps}
          labels={props.labels}
          groups={props.groups}
          isLoadingAthleteData={props.isLoadingAthleteData}
          allSquadAthletes={props.allSquadAthletes}
          setColumnRankingCalculation={props.setColumnRankingCalculation}
          onChangeColumnSummary={(columnId, summaryCalc) => {
            props.onChangeColumnSummary(
              props.tableContainerId,
              columnId,
              summaryCalc,
              props.widgetId,
              props.appliedColumnDetails
            );
          }}
          onClickEditColumn={(columnDetails) =>
            props.onClickEditComparisonColumn(
              props.widgetId,
              props.appliedColumnDetails,
              props.tableContainerId,
              columnDetails,
              props.tableType
            )
          }
          onClickFormatColumn={(
            columnId,
            columnName,
            metricUnit,
            appliedFormat
          ) =>
            props.onClickFormatColumn(
              props.appliedColumnDetails,
              props.tableContainerId,
              props.tableType,
              props.widgetId,
              columnId,
              columnName,
              metricUnit,
              appliedFormat
            )
          }
        />
      );
    }

    if (props.tableType === 'SCORECARD') {
      return (
        <ScorecardTable
          {...commonProps}
          labels={props.labels}
          groups={props.groups}
          onChangeRowSummary={(rowMetricId, summaryCalc) => {
            props.onChangeRowSummary(
              props.tableContainerId,
              rowMetricId,
              summaryCalc,
              props.widgetId,
              props.appliedRowDetails
            );
          }}
          onClickFormatRow={(
            rowMetricId,
            metricName,
            metricUnit,
            appliedFormat
          ) =>
            props.onClickFormatScorecardRow(
              props.appliedRowDetails,
              props.tableContainerId,
              props.widgetId,
              rowMetricId,
              metricName,
              metricUnit,
              appliedFormat
            )
          }
          setRowRankingCalculation={props.setRowRankingCalculation}
          onClickEditColumn={(columnDetails) => {
            props.onClickEditScorecardColumn(
              props.widgetId,
              props.appliedColumnDetails,
              props.tableContainerId,
              columnDetails,
              props.tableType
            );
          }}
        />
      );
    }

    if (props.tableType === 'LONGITUDINAL') {
      return (
        <LongitudinalTable
          {...commonProps}
          labels={props.labels}
          groups={props.groups}
          setColumnRankingCalculation={props.setColumnRankingCalculation}
          onChangeColumnSummary={(columnId, summaryCalc) => {
            props.onChangeColumnSummary(
              props.tableContainerId,
              columnId,
              summaryCalc,
              props.widgetId,
              props.appliedColumnDetails
            );
          }}
          onClickEditColumn={(columnDetails) =>
            props.onClickEditLongitudinalColumn(
              props.widgetId,
              props.appliedColumnDetails,
              props.tableContainerId,
              columnDetails,
              props.tableType
            )
          }
          onClickFormatColumn={(
            columnId,
            columnName,
            metricUnit,
            appliedFormat
          ) =>
            props.onClickFormatColumn(
              props.appliedColumnDetails,
              props.tableContainerId,
              props.tableType,
              props.widgetId,
              columnId,
              columnName,
              metricUnit,
              appliedFormat
            )
          }
        />
      );
    }

    return null;
  };

  const onUpdateTableName = useCallback(
    (newTableName) => {
      props.onUpdateTableName(props.widgetId, newTableName, {
        table_type: props.tableType,
        show_summary: props.showSummary,
      });
    },
    [props.widgetId, props.tableType, props.showSummary]
  );

  const isDashboardUIUpgradeFF = window.getFlag('rep-dashboard-ui-upgrade');

  return (
    <ExportProvider filename={props.tableName}>
      <WidgetCard className={tableWidgetClasses}>
        <WidgetCard.Header className="tableWidget__header">
          <div className="tableWidget__headerRightDetails">
            {!props.isLoading ? (
              <WidgetCard.Title>
                <EditInPlace
                  editOnTextOnly={isDashboardUIUpgradeFF}
                  value={props.tableName}
                  onChange={onUpdateTableName}
                />
              </WidgetCard.Title>
            ) : null}
          </div>
          <div className="tableWidget__headerRightDetails">
            {window.getFlag('rep-table-widget-caching') &&
              cachedAtRollover &&
              !isDashboardPivoted() &&
              !loadingStatusList.includes(DATA_STATUS.pending) && (
                <div css={styles.rollover}>
                  {!loadingStatusList.includes(DATA_STATUS.caching) && (
                    <IconButton
                      css={styles.refreshButton}
                      onClick={() => props.onRefreshCache()}
                    >
                      <KitmanIcon
                        css={styles.refreshIcon}
                        name="RefreshOutlined"
                      />
                    </IconButton>
                  )}
                  {cachedAtRollover}
                </div>
              )}
            {props.canManageDashboard && !props.isLoading && !editMode ? (
              <WidgetMenu
                showSummary={props.showSummary}
                onClickDeleteTableWidget={() => {
                  setFeedbackModalStatus('confirm');
                  setFeedbackModalMessage(props.t('Delete Table widget?'));
                }}
                onClickDuplicateTableWidget={() => {
                  props.onDuplicate();
                }}
                onClickEditTableWidget={() => {
                  setEditMode(true);
                }}
                onClickShowHideSummary={() => {
                  props.onUpdateSummaryVisibility(
                    props.widgetId,
                    props.tableName,
                    props.tableType,
                    !props.showSummary
                  );
                }}
                onClickSetColumnWidthType={(type) => {
                  props.setColumnWidthType(type);
                }}
                onClickRefreshCache={() => {
                  props.onRefreshCache();
                }}
                columnWidthType={props.columnWidthType}
                containerType={props.containerType}
              />
            ) : null}
            {editMode ? (
              <div className="tableWidget__doneEditing">
                <TextButton
                  text={props.t('Done')}
                  type="primary"
                  onClick={() => {
                    setEditMode(false);
                  }}
                />
              </div>
            ) : null}
          </div>
        </WidgetCard.Header>
        <div className="tableWidget__content">{getTableContent()}</div>
        <AppStatus
          status={feedbackModalStatus}
          message={feedbackModalMessage}
          confirmButtonText={props.t('Delete')}
          hideConfirmation={() => {
            setFeedbackModalStatus(null);
            setFeedbackModalMessage(null);
          }}
          close={() => {
            setFeedbackModalStatus(null);
            setFeedbackModalMessage(null);
          }}
          confirmAction={() => {
            props.onDelete();
          }}
        />
      </WidgetCard>
    </ExportProvider>
  );
}

export const TableWidgetTranslated = withNamespaces()(TableWidget);
export default TableWidget;
