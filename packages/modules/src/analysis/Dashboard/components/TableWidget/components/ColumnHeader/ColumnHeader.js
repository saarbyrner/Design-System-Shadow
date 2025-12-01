// @flow
import { withNamespaces } from 'react-i18next';
import classNames from 'classnames';
import _isEmpty from 'lodash/isEmpty';
import { searchParams } from '@kitman/common/src/utils';
import { InfoTooltip, TooltipMenu } from '@kitman/components';

import type { TooltipItem } from '@kitman/components/src/TooltipMenu/index';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type {
  ColumnSortType,
  RankingCalculationConfig,
  TableWidgetType,
} from '../../types';

import { getRankingCalculationMenuItem } from '../../utils';

type Props = {
  columnCalculation: string,
  columnName: string,
  hasError: boolean,
  isForbidden: boolean,
  isPivotLocked: boolean,
  isSorted: boolean,
  onClickDeleteColumn: Function,
  onClickEditColumn: Function,
  onClickFormatColumn: Function,
  onClickLockColumnPivot: Function,
  onClickSortColumn: Function,
  onDuplicateColumn: Function,
  sortOrder: ColumnSortType,
  canManageDashboard: boolean,
  rankingCalculation: RankingCalculationConfig,
  setColumnRankingCalculation: Function,
  tableType?: TableWidgetType,
};

const emptyTooltipItem = {
  description: '',
};

const filterEmptyTooltipItem = (item) => !_isEmpty(item.description);

const ColumnHeader = (props: I18nProps<Props>) => {
  const isPivoted =
    window.getFlag('table-updated-pivot') && !!searchParams('pivot');

  const columnNameClasses = classNames('columnHeader__metricName', {
    'columnHeader__metricName--sorted':
      props.isSorted && props.sortOrder !== 'DEFAULT',
    'columnHeader__metricName--error': props.hasError || props.isForbidden,
  });

  const columnSortIconClasses = classNames('columnHeader__sortIcon', {
    'columnHeader__sortIcon--lowHigh icon-arrow-up':
      props.isSorted && props.sortOrder !== 'LOW_HIGH',
    'columnHeader__sortIcon--highLow icon-arrow-down':
      props.isSorted && props.sortOrder !== 'HIGH_LOW',
  });

  const columnHeaderClasses = classNames('tableWidget__columnHeader', {
    'tableWidget__columnHeader--disabled': !props.canManageDashboard,
  });

  const getMenuItems = () => {
    let menuItems: Array<TooltipItem> = [];

    const editColumn = {
      description: props.t('Edit'),
      icon: 'icon-edit',
      onClick: () => props.onClickEditColumn(),
      isDisabled: props.isForbidden || isPivoted,
    };

    const formatColumn = {
      description: props.t('Conditional Formatting'),
      icon: 'icon-nav-alert',
      onClick: () => props.onClickFormatColumn(),
      isDisabled: isPivoted,
    };

    const lockPivot = {
      description: props.isPivotLocked
        ? props.t('Unlock Pivot')
        : props.t('Lock Pivot'),
      icon: 'icon-lock',
      onClick: () => props.onClickLockColumnPivot(!props.isPivotLocked),
      isDisabled: isPivoted,
    };

    const sortColumn = {
      description: props.t('Sort'),
      icon: 'icon-arrows-up-down',
      isDisabled: isPivoted,
      subMenuItems: isPivoted
        ? []
        : [
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
          ],
    };

    const deleteColumn = {
      description: props.t('Delete Column'),
      icon: 'icon-bin',
      onClick: () => props.onClickDeleteColumn(),
      isDestructive: true,
      isDisabled: props.isForbidden || isPivoted,
    };

    const duplicateColumn =
      props.canManageDashboard &&
      window.getFlag('table-widget-duplicate-column')
        ? {
            description: props.t('Duplicate Column'),
            icon: 'icon-duplicate',
            onClick: props.onDuplicateColumn,
            isDestructive: false,
            isDisabled: props.isForbidden || isPivoted,
          }
        : emptyTooltipItem;

    if (props.isForbidden || props.hasError) {
      menuItems = [editColumn, deleteColumn];
    } else {
      menuItems = [editColumn, formatColumn];

      if (
        window.getFlag('table-updated-pivot') &&
        !window.getFlag('rep-defense-bmt-mvp')
      ) {
        menuItems.push(lockPivot);
      }

      if (window.getFlag('table-widget-ranking')) {
        menuItems.push(
          getRankingCalculationMenuItem(
            isPivoted,
            props.rankingCalculation,
            props.setColumnRankingCalculation
          )
        );
      }

      menuItems.push(sortColumn, duplicateColumn, deleteColumn);
    }

    return menuItems.filter(filterEmptyTooltipItem);
  };

  const tooltipContent = props.isForbidden
    ? props.t('You do not have permission to view this metric')
    : props.columnName;

  return (
    <TooltipMenu
      placement="bottom-end"
      menuItems={getMenuItems()}
      tooltipTriggerElement={
        <div className={columnHeaderClasses}>
          {props.isPivotLocked && (
            <InfoTooltip content={props.t('Pivot locked')}>
              <i className="icon-lock columnHeader__pivotLocked" />
            </InfoTooltip>
          )}

          <InfoTooltip content={tooltipContent}>
            <div>
              {props.canManageDashboard && (
                <i className="columnHeader__burgerMenu icon-more" />
              )}
              {props.isSorted && props.sortOrder !== 'DEFAULT' ? (
                <i className={columnSortIconClasses} />
              ) : null}
              {props.isForbidden ? (
                <i className="columnHeader__forbiddenIcon icon-lock" />
              ) : null}
              <div className={columnNameClasses}>{props.columnName}</div>
            </div>
          </InfoTooltip>

          <div className="columnHeader__calculation">
            {!props.isForbidden && props.columnCalculation}
          </div>
        </div>
      }
      disabled={!props.canManageDashboard}
      kitmanDesignSystem
    />
  );
};

export default ColumnHeader;
export const ColumnHeaderTranslated = withNamespaces()(ColumnHeader);
