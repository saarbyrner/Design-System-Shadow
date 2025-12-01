// @flow
import { withNamespaces } from 'react-i18next';
import classNames from 'classnames';
import { searchParams } from '@kitman/common/src/utils';
import _isEmpty from 'lodash/isEmpty';
import { InfoTooltip, TooltipMenu } from '@kitman/components';

import type { TooltipItem } from '@kitman/components/src/TooltipMenu/index';
import type { SquadAthletesSelection } from '@kitman/components/src/Athletes/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Squad } from '@kitman/common/src/types/Squad';
import type { ColumnSortType } from '../../types';

import Table from '../Table';

type Props = {
  isLoading: boolean,
  columnName: string,
  isPivotLocked: boolean,
  isSorted: boolean,
  onClickDeleteColumn: Function,
  onClickEditColumn: Function,
  onClickLockColumnPivot: Function,
  onClickSortColumn: Function,
  onDuplicateColumn: Function,
  sortOrder: ColumnSortType,
  canManageDashboard: boolean,
  populationDetails: SquadAthletesSelection,
  squads: Array<Squad>,
};

const emptyTooltipItem = {
  description: '',
};

const filterEmptyTooltipItem = (item: TooltipItem) =>
  !_isEmpty(item.description);

const ScorecardColumnHeader = (props: I18nProps<Props>) => {
  const isPivoted =
    window.getFlag('table-updated-pivot') && !!searchParams('pivot');

  const columnNameClasses = classNames('columnHeader__metricName', {
    'columnHeader__metricName--sorted':
      props.isSorted && props.sortOrder !== 'DEFAULT',
  });

  const columnSortIconClasses = classNames('columnHeader__sortIcon', {
    'columnHeader__sortIcon--lowHigh icon-arrow-up':
      props.isSorted && props.sortOrder !== 'LOW_HIGH',
    'columnHeader__sortIcon--highLow icon-arrow-down':
      props.isSorted && props.sortOrder !== 'HIGH_LOW',
  });

  const scoreCardColumnHeader = classNames('tableWidget__columnHeader', {
    'tableWidget__columnHeader--historicalSquad': window.getFlag(
      'rep-historic-reporting'
    ),
    'tableWidget__columnHeader--disabled': !props.canManageDashboard,
  });

  const sortSubmenuItems = [
    {
      description: props.t('High - Low'),
      isSelected: props.isSorted && props.sortOrder === 'HIGH_LOW',
      onClick: () => {
        props.onClickSortColumn('HIGH_LOW');
      },
    },
    {
      description: props.t('Low - High'),
      isSelected: props.isSorted && props.sortOrder === 'LOW_HIGH',
      onClick: () => {
        props.onClickSortColumn('LOW_HIGH');
      },
    },
    {
      description: props.t('Default'),
      isSelected: props.isSorted && props.sortOrder === 'DEFAULT',
      onClick: () => {
        props.onClickSortColumn('DEFAULT');
      },
    },
  ];

  const getMenuItems = () => {
    const editColumn = {
      description: props.t('Edit'),
      icon: 'icon-edit',
      onClick: () => props.onClickEditColumn(),
      isDisabled: isPivoted,
    };

    const lockPivot =
      window.getFlag('table-updated-pivot') &&
      !window.getFlag('rep-defense-bmt-mvp')
        ? {
            description: props.isPivotLocked
              ? props.t('Unlock Pivot')
              : props.t('Lock Pivot'),
            icon: 'icon-lock',
            onClick: () => props.onClickLockColumnPivot(!props.isPivotLocked),
            isDisabled: isPivoted,
          }
        : emptyTooltipItem;

    const sortColumn = {
      description: props.t('Sort'),
      icon: 'icon-arrows-up-down',
      isDisabled: isPivoted,
      subMenuItems: isPivoted ? [] : sortSubmenuItems,
    };

    const deleteColumn = {
      description: props.t('Delete Column'),
      icon: 'icon-bin',
      onClick: () => props.onClickDeleteColumn(),
      isDestructive: true,
      isDisabled: isPivoted,
    };

    const duplicateColumn =
      props.canManageDashboard &&
      window.getFlag('table-widget-duplicate-column')
        ? {
            description: props.t('Duplicate Column'),
            icon: 'icon-duplicate',
            onClick: props.onDuplicateColumn,
            isDestructive: false,
            isDisabled: isPivoted,
          }
        : emptyTooltipItem;

    return [
      editColumn,
      lockPivot,
      sortColumn,
      duplicateColumn,
      deleteColumn,
    ].filter(filterEmptyTooltipItem);
  };

  if (props.isLoading) {
    return <Table.LoadingCell />;
  }

  return (
    <td>
      <TooltipMenu
        placement="bottom-end"
        menuItems={getMenuItems()}
        tooltipTriggerElement={
          <div className={scoreCardColumnHeader}>
            <InfoTooltip content={props.t('Pivot locked')}>
              {props.isPivotLocked && (
                <i className="icon-lock columnHeader__pivotLocked" />
              )}
            </InfoTooltip>
            <InfoTooltip content={props.columnName}>
              <div>
                {props.canManageDashboard && (
                  <i className="columnHeader__burgerMenu icon-more" />
                )}
                {props.isSorted && props.sortOrder !== 'DEFAULT' ? (
                  <i className={columnSortIconClasses} />
                ) : null}
                <div className={columnNameClasses}>{props.columnName}</div>
              </div>
            </InfoTooltip>
            {window.getFlag('graph-squad-selector') && (
              <div className="columnHeader__calculation">
                {props.populationDetails.context_squads?.length
                  ? props.populationDetails.context_squads
                      .map(
                        (squadId) =>
                          props.squads.find(({ id }) => id === squadId)?.name ||
                          ''
                      )
                      .join(', ')
                  : props.t('All Squads')}
              </div>
            )}
            {window.getFlag('rep-historic-reporting') &&
              props.populationDetails?.historic && (
                <div className="columnHeader__calculation">
                  {props.t('Historical squad')}
                </div>
              )}
          </div>
        }
        disabled={!props.canManageDashboard}
        kitmanDesignSystem
      />
    </td>
  );
};

export default ScorecardColumnHeader;
export const ScorecardColumnHeaderTranslated = withNamespaces()(
  ScorecardColumnHeader
);
