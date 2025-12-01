// @flow
import { withNamespaces } from 'react-i18next';
import classNames from 'classnames';
import type {
  SquadAthletesSelection,
  SquadAthletes,
} from '@kitman/components/src/types';
import type { Squad } from '@kitman/common/src/types/Squad';
import { getPeriodName } from '@kitman/modules/src/analysis/shared/utils';
import AnimatedCalculateLoader from '@kitman/modules/src/analysis/shared/components/CachingLoader/AnimatedCalculateLoader';
import { colors } from '@kitman/common/src/variables';
import { DATA_STATUS } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/consts';
import type { LabelPopulation } from '@kitman/services/src/services/analysis/labels';
import type { GroupPopulation } from '@kitman/services/src/services/analysis/groups';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  getTablePopulation,
  getCellColour,
  getFormattedCellValue,
} from '../../utils';
import Table from '../Table';
import { ScorecardColumnHeaderTranslated as ScorecardColumnHeader } from '../ColumnHeader/ScorecardColumnHeader';
import type {
  ColumnSortType,
  TableWidgetScorecardColumnData,
} from '../../types';

const styles = {
  animatedLoader: {
    display: 'grid',
    placeSelf: 'center',
    justifyItems: 'center',
    fontSize: '10px',
    width: '7.5rem',
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

type Props = {
  canManageDashboard: boolean,
  columnData: TableWidgetScorecardColumnData,
  dateSettings: Object,
  formattingRules: Object,
  id: number,
  isEditMode: boolean,
  isPivotLocked: boolean,
  isSorted: boolean,
  name: string,
  onClickDeleteColumn: Function,
  onClickEditColumn: Function,
  onClickLockColumnPivot: Function,
  onClickSortColumn: Function,
  onDuplicateColumn: Function,
  pivotedDateRange?: Object,
  pivotedTimePeriod?: string,
  pivotedTimePeriodLength?: ?number,
  populationDetails: SquadAthletesSelection,
  renderedByPrintBuilder: boolean,
  sortedOrder: ColumnSortType,
  squadAthletes: SquadAthletes,
  squads: Array<Squad>,
  fetchRow: Function,
  labels?: Array<LabelPopulation>,
  groups?: Array<GroupPopulation>,
};

const ScorecardColumn = (props: I18nProps<Props>) => {
  const columnHeaderClasses = classNames('tableWidget__columnHeader', {
    'tableWidget__columnHeader--disabled': !props.canManageDashboard,
  });

  const getSessionOrDateDetails = () => {
    return (
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

  const getColumnHeaders = () => {
    const isLoadingAthletes = props.squadAthletes.position_groups.length === 0;
    const population = getTablePopulation(
      props.populationDetails,
      props.squadAthletes,
      props.squads,
      [],
      props.labels,
      props.groups
    )[0];
    const populationName = population ? population.name : '';
    const columnName = props.name || populationName;

    return (
      <ScorecardColumnHeader
        isLoading={isLoadingAthletes}
        columnName={columnName}
        sortOrder={props.sortedOrder}
        isPivotLocked={props.isPivotLocked}
        isSorted={props.isSorted}
        onClickDeleteColumn={() => {
          props.onClickDeleteColumn();
        }}
        onClickEditColumn={() => {
          props.onClickEditColumn();
        }}
        onClickLockColumnPivot={(isLocked) => {
          props.onClickLockColumnPivot(props.id, isLocked);
        }}
        onClickSortColumn={(sortOrder) => {
          sortColumn(sortOrder);
        }}
        onDuplicateColumn={() => props.onDuplicateColumn(props.id)}
        canManageDashboard={props.canManageDashboard}
        populationDetails={props.populationDetails}
        squads={props.squads}
      />
    );
  };

  const priorityOrderedFormattingRules = (rowId) => {
    const rules = props.formattingRules[rowId]?.formattingRules.slice();

    // The top rule in the panel is the most important.
    // In order for that to be applied on top of all others
    // we need to reverse() the array so that it is applied last.
    return rules ? rules.reverse() : [];
  };

  const getColumnHeaderRows = () => {
    const canSort =
      props.canManageDashboard &&
      !props.isEditMode &&
      !props.renderedByPrintBuilder;

    return (
      <>
        <tr className="tableWidget__sessionOrDateRow">
          <td key={props.id}>
            {canSort && <Table.SortHandle absolute />}
            {getSessionOrDateDetails()}
          </td>
        </tr>
        <tr className={columnHeaderClasses}>{getColumnHeaders()}</tr>
      </>
    );
  };

  return (
    <>
      {getColumnHeaderRows()}
      {props.columnData.map((row) => {
        const cellStyle =
          row.status === DATA_STATUS.success
            ? getCellColour(
                priorityOrderedFormattingRules(row.id),
                row.value,
                row.rowDetails.summary
              )
            : {};

        const renderCellContent = () => {
          switch (row.status) {
            case DATA_STATUS.forbidden:
              return (
                <div className="tableWidget__errorColumn--content">
                  <i className="tableWidget__errorColumn--icon icon-error" />
                  <span className="tableWidget__errorColumn--message">
                    {props.t('User not allowed to display protected data')}
                  </span>
                  <span
                    className="tableWidget__errorColumn--reload"
                    onClick={() => props.fetchRow(row.id)}
                  >
                    {props.t('Reload')}
                  </span>
                </div>
              );
            case DATA_STATUS.failure:
              return (
                <>
                  <i className="icon-error" />
                  <span
                    className="tableWidget__errorColumn--reload"
                    onClick={() => props.fetchRow(row.id)}
                  >
                    {props.t('Reload Row')}
                  </span>
                </>
              );

            case DATA_STATUS.caching:
              return (
                <div style={styles.animatedLoader}>
                  <span role="status">
                    <AnimatedCalculateLoader />
                  </span>
                  <div css={styles.levelTwoLoaderTitle}>
                    {props.t('Calculating large dataset')}
                  </div>
                  <div css={styles.levelTwoLoaderSubtitle}>
                    {props.t('This may take a while...')}
                  </div>
                </div>
              );
            case DATA_STATUS.pending:
              return <div className="tableWidget__loadingCell" />;
            case DATA_STATUS.success:
              return getFormattedCellValue(
                row.value,
                row.rowDetails.table_element?.calculation
              );
            default:
              return null;
          }
        };

        return (
          <tr key={row.id}>
            <td
              className={classNames('tableWidget__dataCell', {
                'tableWidget__dataCell--forbidden': row.status === 'FORBIDDEN',
                'tableWidget__dataCell--error': row.status === 'FAILURE',
              })}
              style={cellStyle}
            >
              {renderCellContent()}
            </td>
          </tr>
        );
      })}
    </>
  );
};

export default ScorecardColumn;
export const ScorecardColumnTranslated = withNamespaces()(ScorecardColumn);
