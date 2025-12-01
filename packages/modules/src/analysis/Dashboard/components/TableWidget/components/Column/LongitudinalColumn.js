// @flow
import { useMemo } from 'react';
import { withNamespaces } from 'react-i18next';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import classNames from 'classnames';
import type {
  SquadAthletesSelection,
  SquadAthletes,
} from '@kitman/components/src/types';
import AnimatedCalculateLoader from '@kitman/modules/src/analysis/shared/components/CachingLoader/AnimatedCalculateLoader';
import { colors } from '@kitman/common/src/variables';
import { Tooltip } from '@kitman/playbook/components';
import type { Squad } from '@kitman/common/src/types/Squad';
import { InfoTooltip, TooltipMenu } from '@kitman/components';
import type { LabelPopulation } from '@kitman/services/src/services/analysis/labels';
import type { GroupPopulation } from '@kitman/services/src/services/analysis/groups';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { LOADER_LEVEL } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/consts';
import {
  getCalculationTitle,
  getTablePopulation,
  getSummaryName,
  getCachedAtRolloverContent,
  getSummaryValue,
} from '../../utils';
import { ColumnHeaderTranslated as ColumnHeader } from '../ColumnHeader/ColumnHeader';
import { DataCellTranslated as DataCell } from '../DataCell';
import Table from '../Table';
import type {
  TableWidgetFormatRule,
  TableWidgetElement,
  TableWidgetRow,
  ColumnSortType,
  ColumnDataStatus,
  ColumnDataArray,
  RankingCalculationConfig,
} from '../../types';

type Props = {
  appliedRowDetails: Array<TableWidgetRow>,
  canManageDashboard: boolean,
  formattingRules: Array<TableWidgetFormatRule>,
  columnId: string,
  data: ColumnDataArray,
  dataStatus: ColumnDataStatus,
  dataMessage: string,
  fetchColumn: Function,
  id: number,
  isEditMode: boolean,
  isPivotLocked: boolean,
  isPivoted: boolean,
  isSorted: boolean,
  metricDetails: TableWidgetElement,
  name: string,
  onChangeColumnSummary: Function,
  onClickDeleteColumn: Function,
  onClickEditColumn: Function,
  onClickFormatColumn: Function,
  onClickLockColumnPivot: Function,
  onClickSortColumn: Function,
  onDuplicateColumn: Function,
  sortedOrder: ColumnSortType,
  populationDetails: SquadAthletesSelection,
  renderedByPrintBuilder: boolean,
  rankingCalculation: RankingCalculationConfig,
  setColumnRankingCalculation: Function,
  showSummary: boolean,
  squadAthletes: SquadAthletes,
  squads: Array<Squad>,
  selectedSquads: Array<Squad>,
  summaryCalculation: string,
  cachedAt?: string,
  labels?: Array<LabelPopulation>,
  groups?: Array<GroupPopulation>,
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
  cachingLoader: {},
};

const LongitudinalColumn = (props: I18nProps<Props>) => {
  const { organisation } = useOrganisation();

  const summarySelectorClasses = classNames(
    'tableWidget__summaryRow--selector',
    {
      'tableWidget__summaryRow--selector--disabled': !props.canManageDashboard,
    }
  );

  const summaryData = useMemo(() => {
    return props.data.map(({ value }) => value);
  }, [props.data]);

  const priorityOrderedFormattingRules = () => {
    const rules = props.formattingRules.slice();

    // The top rule in the panel is the most important.
    // In order for that to be applied on top of all others
    // we need to reverse() the array so that it is applied last.
    return rules ? rules.reverse() : [];
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
          columnCalculation={getCalculationTitle(
            props.metricDetails?.calculation
          )}
          columnName={props.name}
          hasError={props.dataStatus === 'FAILURE'}
          isForbidden={props.dataStatus === 'FORBIDDEN'}
          isPivotLocked={props.isPivotLocked}
          isSorted={props.isSorted}
          rankingCalculation={props.rankingCalculation}
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
              props.metricDetails.data_source.unit,
              appliedRules
            );
          }}
          onClickLockColumnPivot={(isLocked) => {
            props.onClickLockColumnPivot(props.id, isLocked);
          }}
          onClickSortColumn={(sortOrder) => {
            sortColumn(sortOrder);
          }}
          onDuplicateColumn={() => props.onDuplicateColumn(props.id)}
          sortOrder={props.sortedOrder}
          canManageDashboard={props.canManageDashboard}
          tableType="LONGITUDINAL"
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
          props.onChangeColumnSummary(
            props.isPivoted ? props.columnId : props.id,
            summaryId
          );
        },
        isSelected: summaryId === props.summaryCalculation,
      };
    });
  };

  const getTableColumnHeight = () => {
    return props.appliedRowDetails?.length * 55;
  };

  const getColumnHeaderRows = () => {
    const headerClasses = classNames('tableWidget__columnHeader', {
      'tableWidget__columnHeader--error':
        props.dataStatus === 'FORBIDDEN' || props.dataStatus === 'FAILURE',
    });

    const canSort =
      props.canManageDashboard &&
      !props.isEditMode &&
      !props.renderedByPrintBuilder;

    const population = getTablePopulation(
      props.populationDetails,
      props.squadAthletes,
      props.squads,
      [],
      props.labels,
      props.groups
    )[0];
    const name = population ? population.name : '';

    const renderSelectedSquads = () => {
      const selectedSquadsText = props.selectedSquads.join(', ');

      return (
        <InfoTooltip content={selectedSquadsText} placement="bottom-start">
          <span className="tableWidget__columnHeader--contextSquad">
            {selectedSquadsText}
          </span>
        </InfoTooltip>
      );
    };

    return (
      <>
        <tr className="tableWidget__populationRow">
          <td>
            {canSort && <Table.SortHandle absolute />}
            {props.dataStatus === 'FORBIDDEN' ? null : (
              <Tooltip title={rolloverContent} placement="bottom">
                <div className="tableWidget__populationDetails">{name}</div>
              </Tooltip>
            )}
            {props.selectedSquads.length > 0 && renderSelectedSquads()}
            {window.getFlag('rep-historic-reporting') &&
              props.populationDetails?.historic && (
                <div className="columnHeader__historicalSquad">
                  {props.t('Historical squad')}
                </div>
              )}
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
                          props.metricDetails?.calculation
                        )}
                      </span>
                    </div>
                  }
                  disabled={!props.canManageDashboard}
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
          <tr style={{ backgroundColor: colors.white }}>
            <td
              style={{
                height: getTableColumnHeight(),
                ...styles.animatedLoader,
              }}
            >
              <div
                data-testid="caching-loader"
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
          {props.appliedRowDetails.map((row) => (
            <tr key={row.row_id}>
              <DataCell
                columnData={props.data}
                id={row.row_id}
                calculation={props.metricDetails?.calculation}
                orderedFormattingRules={priorityOrderedFormattingRules()}
                isLoading={[
                  LOADER_LEVEL.PENDING,
                  LOADER_LEVEL.CACHING,
                ].includes(props.dataStatus)}
                loadingStatus={props.dataStatus}
              />
            </tr>
          ))}
          {getSummaryRow()}
        </>
      );
    default:
      return getColumnHeaderRows();
  }
};

export default LongitudinalColumn;
export const LongitudinalColumnTranslated =
  withNamespaces()(LongitudinalColumn);
