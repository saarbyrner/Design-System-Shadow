// @flow
import i18n from '@kitman/common/src/utils/i18n';
import { TooltipMenu } from '@kitman/components';
import { TrackEvent } from '@kitman/common/src/utils';
import type { ContainerType } from '../../../../types';
import style from '../../style';
import WidgetCard from '../../../WidgetCard';

type Props = {
  isArchiveView: boolean,
  onClickDuplicate: Function,
  onClickNotesWidgetSettings: Function,
  onClickRemoveNotesWidget: Function,
  onClickViewArchivedNotes: Function,
  onClickAddNotes: Function,
  containerType: ContainerType,
};

const WidgetMenu = (props: Props) => {
  const isDashboardUIUpgradeFF =
    window.getFlag('rep-dashboard-ui-upgrade');

  const notesWidgetSettings = {
    description: i18n.t('Notes Widget Settings'),
    icon: 'icon-settings',
    onClick: () => {
      TrackEvent('Graph Dashboard', 'Click', 'Notes Widget Settings');
      props.onClickNotesWidgetSettings();
    },
  };

  const viewArchivedNotes = {
    description: i18n.t('View Archived Notes'),
    icon: 'icon-archive',
    onClick: () => {
      TrackEvent('Graph Dashboard', 'Click', 'View Archived Notes');
      props.onClickViewArchivedNotes();
    },
  };

  const duplicateWidget = {
    description: i18n.t('Duplicate Widget'),
    icon: 'icon-duplicate',
    onClick: () => {
      TrackEvent('Graph Dashboard', 'Click', 'Duplicate Notes Widget');
      props.onClickDuplicate();
    },
  };

  const removeWidget = {
    description: i18n.t('Remove Notes Widget'),
    icon: 'icon-hide',
    onClick: () => {
      TrackEvent('Graph Dashboard', 'Click', 'Remove Notes Widget');
      props.onClickRemoveNotesWidget();
    },
  };

  const addNotesWidget = {
    description: i18n.t('Add Notes'),
    icon: 'icon-add',
    onClick: () => {
      TrackEvent('Graph Dashboard', 'Click', 'Add Notes');
      props.onClickAddNotes();
    },
  };

  const getMenuItems = () => {
    const menuItems = [notesWidgetSettings];

    if (!props.isArchiveView) {
      menuItems.push(viewArchivedNotes);
    }

    if (props.containerType === 'AnalyticalDashboard') {
      menuItems.push(duplicateWidget);
    }

    if (isDashboardUIUpgradeFF) {
      menuItems.push(addNotesWidget);
    }

    menuItems.push(removeWidget);

    return menuItems;
  };

  return (
    <TooltipMenu
      placement="bottom-end"
      offset={[10, 10]}
      menuItems={getMenuItems()}
      tooltipTriggerElement={
        <button
          type="button"
          className="widgetMenu"
          css={isDashboardUIUpgradeFF ? style.widgetMenu : null}
        >
          <WidgetCard.MenuIcon />
        </button>
      }
      kitmanDesignSystem
    />
  );
};

export default WidgetMenu;
