// @flow
import i18n from '@kitman/common/src/utils/i18n';
import { TooltipMenu } from '@kitman/components';
import { TrackEvent } from '@kitman/common/src/utils';
import type { ContainerType } from '../../../../types';

type Props = {
  onClickDuplicateWidget: Function,
  onClickWidgetSettings: Function,
  onClickRemoveWidget: Function,
  containerType: ContainerType,
};

const WidgetMenu = (props: Props) => {
  const widgetSettings = {
    description: i18n.t('Actions Widget Settings'),
    icon: 'icon-settings',
    onClick: () => {
      TrackEvent('Graph Dashboard', 'Click', 'Actions Widget Settings');
      props.onClickWidgetSettings();
    },
  };

  const duplicateWidget = {
    description: i18n.t('Duplicate Widget'),
    icon: 'icon-duplicate',
    onClick: () => {
      TrackEvent('Graph Dashboard', 'Click', 'Duplicate Actions Widget');
      props.onClickDuplicateWidget();
    },
  };

  const removeWidget = {
    description: i18n.t('Remove Actions Widget'),
    icon: 'icon-bin',
    onClick: () => {
      TrackEvent('Graph Dashboard', 'Click', 'Remove Actions Widget');
      props.onClickRemoveWidget();
    },
  };

  return (
    <TooltipMenu
      placement="bottom-end"
      offset={[10, 10]}
      menuItems={
        props.containerType === 'AnalyticalDashboard'
          ? [widgetSettings, duplicateWidget, removeWidget]
          : [widgetSettings, removeWidget]
      }
      tooltipTriggerElement={
        <button type="button" className="widgetMenu">
          <i className="icon-more" />
        </button>
      }
      kitmanDesignSystem
    />
  );
};

export default WidgetMenu;
