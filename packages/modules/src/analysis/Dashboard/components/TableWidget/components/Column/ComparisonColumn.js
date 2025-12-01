// @flow
import { useMemo, Fragment } from 'react';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import { withNamespaces } from 'react-i18next';
import classNames from 'classnames';
import { TooltipMenu } from '@kitman/components';
import { Tooltip } from '@kitman/playbook/components';
import AnimatedCalculateLoader from '@kitman/modules/src/analysis/shared/components/CachingLoader/AnimatedCalculateLoader';
import { colors } from '@kitman/common/src/variables';
import { getPeriodName } from '@kitman/modules/src/analysis/shared/utils';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { LOADER_LEVEL } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/consts';
import {
  getCalculationTitle,
  getSummaryName,
  getCachedAtRolloverContent,
  getSummaryValue,
} from '../../utils';
import { ColumnHeaderTranslated as ColumnHeader } from '../ColumnHeader/ColumnHeader';
import { DataCellTranslated as DataCell } from '../DataCell';
import Table from '../Table';
import type {
  TableWidgetElementSource,
  TableWidgetFormatRule,
  TableWidgetRow,
  ColumnDataStatus,
  ColumnDataArray,
  ColumnSortType,
  RankingCalculationConfig,
  DynamicRows,
} from '../../types';

type Props = {
  appliedRowDetails: Array<TableWidgetRow>,
  calculation: string,
  canManageDashboard: boolean,
  data: ColumnDataArray,
  dataStatus: ColumnDataStatus,
  dataMessage: string,
  dateSettings: Object,
  fetchColumn: Function,
  formattingRules: Array<TableWidgetFormatRule>,
  id: number,
  isEditMode: boolean,
  isPivotLocked: boolean,
  isSorted: boolean,
  metricDetails: TableWidgetElementSource,
  name: string,
  onChangeColumnSummary: Function,
  onClickDeleteColumn: Function,
  onClickEditColumn: Function,
  onClickFormatColumn: Function,
  onClickLockColumnPivot: Function,
  onClickSortColumn: Function,
  onDuplicateColumn: Function,
  sortedOrder: ColumnSortType,
  pivotedDateRange?: Object,
  pivotedTimePeriod?: string,
  pivotedTimePeriodLength?: ?number,
  renderedByPrintBuilder: boolean,
  columnRankingCalculation: RankingCalculationConfig,
  setColumnRankingCalculation: Function,
  showSummary: boolean,
  summaryCalculation: string,
  collapsedRows?: { [number]: boolean },
  dynamicRows?: DynamicRows,
  cachedAt?: string,
};

const styles = {
  animatedLoader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    fontSize: '10px',
  },
  levelTwoLoaderTitle: {
    color: colors.grey_200,
    fontWeight: 600,
  },
  levelTwoLoaderSubtitle: {
    color: colors.grey_100,
    fontWeight: 400,
  },
};

const ComparisonColumn = (props: I18nProps<Props>) => {
  const { organisation } = useOrganisation();

  const summarySelectorClasses = classNames(
    'tableWidget__summaryRow--selector',
    {
      'tableWidget__summaryRow--selector--disabled': !props.canManageDashboard,
    }
  );

  const summaryData = useMemo(() => {
    return props.data.flatMap(({ value, children }) => {
      // If children exist, extract their values
      if (children?.length) {
        return children.map((child) => Number(child.value));
      }
      return value;
    });
  }, [props.data]);

  const priorityOrderedFormattingRules = () => {
    const rules = props.formattingRules.slice();

    // The top rule in the panel is the most important.
    // In order for that to be applied on top of all others
    // we need to reverse() the array so that it is applied last.
    return rules ? rules.reverse() : [];
  };

  const getDynamicRowData = (label) => ({
    label,
    isDynamic: true,
  });

  const renderDataCell = (id, rowData) => (
    <DataCell
      id={id}
      rowData={rowData}
      calculation={props.calculation}
      columnData={props.data}
      orderedFormattingRules={priorityOrderedFormattingRules()}
      isLoading={[LOADER_LEVEL.PENDING, LOADER_LEVEL.CACHING].includes(
        props.dataStatus
      )}
    />
  );

  const getSessionOrDateDetails = () => {
    return props.dataStatus === 'FORBIDDEN' ? null : (
      <div className="tableWidget__sessionOrDateDetails">
        {(!props.isPivotLocked &&
          getPeriodName(
            props.pivotedTimePeriod,
            {
              startDate: props.pivotedDateRange?.start_date,
              endDate: props.pivotedDateRange?.end_date,
            },
            props.pivotedTimePeriodLength
          )) ||
          getPeriodName(
            props.dateSettings.time_period,
            {
              startDate: props.dateSettings.start_time,
              endDate: props.dateSettings.end_time,
            },
            props.dateSettings.time_period_length,
            props.dateSettings.time_period_length_offset
          )}
      </div>
    );
  };

  const sortColumn = (sortOrder) => {
    props.onClickSortColumn(sortOrder);
  };

  const rolloverContent = useMemo(() => {
    return getCachedAtRolloverContent(
      props.cachedAt,
      props.dataStatus,
      organisation.locale
    );
  }, [props.cachedAt, organisation.locale, props.dataStatus]);

  const getColumnHeaders = () => {
    const appliedRules = props.formattingRules.length
      ? props.formattingRules
      : [
          {
            type: null,
            condition: null,
            value: null,
            color: colors.red_100_20,
          },
        ];
    return (
      <td>
        <ColumnHeader
          columnCalculation={getCalculationTitle(props.calculation)}
          columnName={props.name}
          hasError={props.dataStatus === 'FAILURE'}
          isForbidden={props.dataStatus === 'FORBIDDEN'}
          isPivotLocked={props.isPivotLocked}
          isSorted={props.isSorted}
          rankingCalculation={props.columnRankingCalculation}
          setColumnRankingCalculation={props.setColumnRankingCalculation}
          onClickDeleteColumn={() => {
            props.onClickDeleteColumn();
          }}
          onClickEditColumn={() => {
            props.onClickEditColumn();
          }}
          onClickFormatColumn={() => {
            props.onClickFormatColumn(
              props.id,
              props.name,
              props.metricDetails.unit,
              appliedRules
            );
          }}
          onClickLockColumnPivot={(isLocked) => {
            props.onClickLockColumnPivot(props.id, isLocked);
          }}
          onClickSortColumn={(sortOrder) => {
            sortColumn(sortOrder);
          }}
          onDuplicateColumn={() => {
            props.onDuplicateColumn(props.id);
          }}
          sortOrder={props.sortedOrder}
          canManageDashboard={props.canManageDashboard}
        />
      </td>
    );
  };

  const summaryMenuItems = () => {
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

    return summaryIds.map((summaryId) => {
      return {
        description: getSummaryName(summaryId),
        onClick: () => {
          props.onChangeColumnSummary(props.id, summaryId);
        },
        isSelected: summaryId === props.summaryCalculation,
      };
    });
  };

  const getTableColumnHeight = () => {
    const appliedRows = props.appliedRowDetails || [];
    let totalRows = appliedRows.length;

    const dynamicRows = appliedRows.filter((row) => row.isDynamic);

    // Count extra rows when dynamic rows are present (not collapsed)
    if (dynamicRows.length && window.getFlag('rep-table-widget-dynamic-rows')) {
      const extraRows = dynamicRows.reduce((acc, row) => {
        const childCount = !props.collapsedRows?.[row.id]
          ? props.dynamicRows?.[row.row_id]?.length || 0
          : 0;
        return acc + childCount;
      }, 0);

      totalRows += extraRows;
    }

    return totalRows * 55;
  };

  const getColumnHeaderRows = () => {
    const headerClasses = classNames('tableWidget__columnHeader', {
      'tableWidget__columnHeader--error':
        props.dataStatus === 'FORBIDDEN' || props.dataStatus === 'FAILURE',
      'tableWidget__columnHeader--disabled': !props.canManageDashboard,
    });
    const canSort =
      props.canManageDashboard &&
      !props.isEditMode &&
      !props.renderedByPrintBuilder;

    return (
      <>
        <tr className="tableWidget__sessionOrDateRow">
          <td key={props.id}>
            {canSort && <Table.SortHandle absolute />}
            <Tooltip title={rolloverContent} placement="bottom">
              {getSessionOrDateDetails()}
            </Tooltip>
          </td>
        </tr>
        <tr className={headerClasses}>{getColumnHeaders()}</tr>
      </>
    );
  };

  const getSummaryRow = () => {
    return (
      <>
        {props.showSummary ? (
          <tr className="tableWidget__summaryRow">
            {[LOADER_LEVEL.PENDING, LOADER_LEVEL.CACHING].includes(
              props.dataStatus
            ) ? (
              <td />
            ) : (
              <td className={summarySelectorClasses}>
                <TooltipMenu
                  disabled={!props.canManageDashboard}
                  menuItems={summaryMenuItems()}
                  placement="top-start"
                  tooltipTriggerElement={
                    <div className="tableWidget__summaryRow--tooltip">
                      <span className="tableWidget__summaryRow--calc">
                        {getSummaryName(props.summaryCalculation)}
                      </span>
                      <span className="tableWidget__summaryRow--value">
                        {getSummaryValue(
                          props.summaryCalculation,
                          summaryData,
                          props.calculation
                        )}
                      </span>
                    </div>
                  }
                  kitmanDesignSystem
                />
              </td>
            )}
          </tr>
        ) : null}
      </>
    );
  };

  switch (props.dataStatus) {
    case 'FAILURE':
      return (
        <>
          {getColumnHeaderRows()}
          <tr className="tableWidget__errorColumn">
            <td style={{ height: getTableColumnHeight() }}>
              <div className="tableWidget__errorColumn--content">
                <i className="tableWidget__errorColumn--icon icon-error" />
                <span className="tableWidget__errorColumn--message">
                  {props.dataMessage}
                </span>
                <span
                  className="tableWidget__errorColumn--reload"
                  onClick={() => props.fetchColumn()}
                >
                  {props.t('Reload')}
                </span>
              </div>
            </td>
          </tr>
          {props.showSummary ? (
            <tr className="tableWidget__summaryRow">
              <td />
            </tr>
          ) : null}
        </>
      );
    case 'FORBIDDEN':
      return (
        <>
          {getColumnHeaderRows()}
          <tr className="tableWidget__errorColumn">
            <td style={{ height: getTableColumnHeight() }} />
          </tr>
          {props.showSummary ? (
            <tr className="tableWidget__summaryRow">
              <td />
            </tr>
          ) : null}
        </>
      );
    case 'CACHING':
      return (
        <>
          {getColumnHeaderRows()}
          <tr
            style={{ backgroundColor: colors.white }}
            data-testid="caching-loader"
          >
            <td
              style={{
                height: getTableColumnHeight(),
                ...styles.animatedLoader,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top:
                    props.appliedRowDetails?.length === 1 ? '172px' : '184px',
                  ...styles.animatedLoader,
                }}
              >
                <AnimatedCalculateLoader />
                <div css={styles.levelTwoLoaderTitle}>
                  {props.t('Calculating large dataset')}
                </div>
                <div css={styles.levelTwoLoaderSubtitle}>
                  {props.t('This may take a while...')}
                </div>
              </div>
            </td>
          </tr>
          {getSummaryRow()}
        </>
      );
    case 'PENDING':
    case 'SUCCESS':
      return (
        <>
          {getColumnHeaderRows()}
          {props.appliedRowDetails.map((row, rowIndex) => {
            if (
              row?.isDynamic &&
              window.getFlag('rep-table-widget-dynamic-rows')
            ) {
              return (
                <Fragment key={`row-${row.row_id}`}>
                  <tr>{renderDataCell(row.row_id, getDynamicRowData())}</tr>

                  {
                    // If not collapsed, render dynamic rows
                    !props.collapsedRows?.[row.id] &&
                      // Map over dynamic rows associated with the given row_id
                      props.dynamicRows?.[row.row_id]?.map((label, index) => {
                        return (
                          // Using index as part of the key to avoid duplicated row_ids
                          // eslint-disable-next-line react/no-array-index-key
                          <tr key={`children-row-${label}-${index}`}>
                            {renderDataCell(
                              row.row_id,
                              getDynamicRowData(label)
                            )}
                          </tr>
                        );
                      })
                  }
                </Fragment>
              );
            }

            return (
              // eslint-disable-next-line react/no-array-index-key
              <tr key={`row-${row?.row_id}-${rowIndex}`}>
                {renderDataCell(row?.row_id)}
              </tr>
            );
          })}
          {getSummaryRow()}
        </>
      );
    default:
      return null;
  }
};

export default ComparisonColumn;
export const ComparisonColumnTranslated = withNamespaces()(ComparisonColumn);
