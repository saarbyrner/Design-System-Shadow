// @flow
import i18n from '@kitman/common/src/utils/i18n';
import { TooltipMenu } from '@kitman/components';
import { searchParams, TrackEvent } from '@kitman/common/src/utils';
import type { ContainerType } from '../../../../types';

import type { ColumnWidthType } from '../../types';
import { useExport } from '../Export';
import style from '../../style';
import WidgetCard from '../../../WidgetCard';

type Props = {
  showSummary: boolean,
  onClickDeleteTableWidget: Function,
  onClickDuplicateTableWidget: Function,
  onClickEditTableWidget: Function,
  onClickShowHideSummary: Function,
  onClickSetColumnWidthType: Function,
  onClickRefreshCache: Function,
  columnWidthType: ColumnWidthType,
  containerType: ContainerType,
};

const getExport = (onClick) => {
  return {
    description: i18n.t('Export CSV'),
    icon: 'file-icon-csv',
    onClick: () => {
      TrackEvent('Graph Dashboard', 'Click', 'Export CSV');
      onClick();
    },
  };
};

const WidgetMenu = (props: Props) => {
  const isPivoted =
    window.getFlag('table-updated-pivot') && !!searchParams('pivot');

  const { exportData } = useExport();

  const editWidget = {
    description: i18n.t('Edit Table'),
    icon: 'icon-edit',
    isDisabled: isPivoted,
    onClick: () => {
      TrackEvent('Graph Dashboard', 'Click', 'Edit widget table');
      props.onClickEditTableWidget();
    },
  };

  const refreshCache = {
    description: i18n.t('Refresh Data'),
    icon: 'icon-refresh',
    isDisabled: isPivoted,
    onClick: () => {
      TrackEvent('Graph Dashboard', 'Click', 'Refresh Data');
      props.onClickRefreshCache();
    },
  };

  const showHideSummary = {
    description: props.showSummary
      ? i18n.t('Hide Summary')
      : i18n.t('Show Summary'),
    icon: props.showSummary ? 'icon-hide' : 'icon-show',
    onClick: () => {
      if (props.showSummary) {
        TrackEvent('Graph Dashboard', 'Click', 'Hide Summary');
      } else {
        TrackEvent('Graph Dashboard', 'Click', 'Show Summary');
      }
      props.onClickShowHideSummary();
    },
  };

  const duplicateWidget = {
    description: i18n.t('Duplicate Widget'),
    icon: 'icon-duplicate',
    isDisabled: isPivoted,
    onClick: () => {
      TrackEvent('Graph Dashboard', 'Click', 'Duplicate widget table');
      props.onClickDuplicateTableWidget();
    },
  };

  const deleteWidget = {
    description: i18n.t('Delete'),
    icon: 'icon-bin',
    onClick: () => {
      TrackEvent('Graph Dashboard', 'Click', 'Delete widget table');
      props.onClickDeleteTableWidget();
    },
  };

  const getColumnWidthSubmenuItem = (key, label) => ({
    description: label,
    isSelected: props.columnWidthType === key,
    onClick: () => {
      props.onClickSetColumnWidthType(key);
    },
  });

  const columnWidth = {
    description: i18n.t('Column Width'),
    icon: 'icon-reorder',
    subMenuAlignment: 'left',
    subMenuItems: [
      getColumnWidthSubmenuItem('FIT_TO_WIDTH', i18n.t('Fit to width')),
      getColumnWidthSubmenuItem('FIT_TO_CONTENT', i18n.t('Fit to content')),
      getColumnWidthSubmenuItem('NARROW', i18n.t('Narrow')),
      getColumnWidthSubmenuItem('NORMAL', i18n.t('Normal')),
      getColumnWidthSubmenuItem('WIDE', i18n.t('Wide')),
    ],
  };

  const getMenuItems = () => {
    const menuItems = [editWidget];

    if (window.getFlag('rep-table-widget-caching'))
      menuItems.push(refreshCache);

    menuItems.push(showHideSummary);

    if (props.containerType === 'AnalyticalDashboard')
      menuItems.push(duplicateWidget);

    if (window.getFlag('table-column-widths')) menuItems.push(columnWidth);

    if (window.getFlag('table-export-csv')) {
      menuItems.push(
        getExport(() => {
          exportData();
        })
      );
    }

    menuItems.push(deleteWidget);

    return menuItems;
  };

  const isDashboardUIUpgradeFF = window.getFlag('rep-dashboard-ui-upgrade');

  return (
    <TooltipMenu
      placement="bottom-end"
      offset={[10, 10]}
      menuItems={getMenuItems()}
      onVisibleChange={(isVisible) => {
        if (isVisible) {
          TrackEvent(
            'Meat ball menu table widget',
            'Click',
            'Open table widget menu'
          );
        } else {
          TrackEvent(
            'Meat ball menu table widget',
            'Click',
            'Close table widget menu'
          );
        }
      }}
      tooltipTriggerElement={
        <button
          type="button"
          className="widgetMenu"
          {...(isDashboardUIUpgradeFF ? { css: style.widgetMenu } : {})}
        >
          <WidgetCard.MenuIcon />
        </button>
      }
      kitmanDesignSystem
    />
  );
};

export default WidgetMenu;
