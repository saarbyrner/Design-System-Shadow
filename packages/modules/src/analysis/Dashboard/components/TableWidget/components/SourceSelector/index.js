// @flow
import { cloneElement, useMemo } from 'react';
import { withNamespaces } from 'react-i18next';

import { TooltipMenu } from '@kitman/components';
import {
  TABLE_WIDGET_DATA_SOURCES,
  type TableWidgetDataSource,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';
import { getSupportedFormulas } from '@kitman/modules/src/analysis/shared/utils';
import { CHART_TYPE } from '@kitman/modules/src/analysis/Dashboard/components/ChartWidget/types';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import { type TooltipItem } from '@kitman/components/src/types';
import { getDataSourceLabel } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/utils';

type Props = {
  triggerElement: Object,
  menuItems: Array<TableWidgetDataSource>,
  onClickSourceItem: (
    source: TableWidgetDataSource,
    sourceSubtypeId?: number
  ) => void,
  placement?: string,
  widgetType: string,
};

function SourceSelector(props: I18nProps<Props>) {
  const { permissions } = usePermissions();

  const chartFormulaFlags = {
    [CHART_TYPE.value]: window.getFlag('rep-charts-formula'),
    [CHART_TYPE.xy]: window.getFlag('rep-xy-charts-formula'),
  };

  const menuItems = useMemo(() => {
    const sourceItemAccessRights = {
      [TABLE_WIDGET_DATA_SOURCES.metric]: true,
      [TABLE_WIDGET_DATA_SOURCES.activity]: window.getFlag(
        'table-widget-activity-source'
      ),
      [TABLE_WIDGET_DATA_SOURCES.availability]: window.getFlag(
        'table-widget-availability-data-type'
      ),
      [TABLE_WIDGET_DATA_SOURCES.participation]: window.getFlag(
        'table-widget-participation-data-type'
      ),
      [TABLE_WIDGET_DATA_SOURCES.medical]: window.getFlag(
        'table-widget-medical-data-type'
      ),
      [TABLE_WIDGET_DATA_SOURCES.games]: window.getFlag(
        'planning-game-events-field-view'
      ),
      [TABLE_WIDGET_DATA_SOURCES.formula]:
        chartFormulaFlags[props.widgetType] ??
        window.getFlag('rep-table-formula-columns'),
      [TABLE_WIDGET_DATA_SOURCES.growthAndMaturation]:
        window.getFlag(
          'rep-pac-analysis-show-g-and-m-data-source-under-add-data'
        ) && permissions?.analysis.growthAndMaturationReportArea.canView,
    };
    return props.menuItems.reduce((acc, item) => {
      const items = [...acc];
      if (sourceItemAccessRights[item]) {
        items.push(item);
      }
      return items;
    }, []);
  }, [props.menuItems]);

  const getFormulaMenuItems = (): Array<TooltipItem> => {
    return getSupportedFormulas().map((formula) => ({
      description: formula.label,
      onClick: () =>
        props.onClickSourceItem(TABLE_WIDGET_DATA_SOURCES.formula, formula.id),
    }));
  };

  return menuItems.length === 1 ? (
    cloneElement(props.triggerElement, {
      onClick: () => {
        props.onClickSourceItem(props.menuItems[0]);
      },
    })
  ) : (
    <TooltipMenu
      data-testid="SourceSelector|TooltipMenu"
      placement={props.placement || 'bottom-end'}
      menuItems={menuItems.map((key) => {
        if (key === 'formula') {
          return {
            description: getDataSourceLabel(key),
            subMenuItems: getFormulaMenuItems(),
          };
        }
        return {
          description: getDataSourceLabel(key),
          onClick: () => props.onClickSourceItem(key),
        };
      })}
      tooltipTriggerElement={props.triggerElement}
      kitmanDesignSystem
    />
  );
}

export const SourceSelectorTranslated = withNamespaces()(SourceSelector);
export default SourceSelector;
