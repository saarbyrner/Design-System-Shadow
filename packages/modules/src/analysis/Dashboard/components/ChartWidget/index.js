// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import { ErrorBoundary } from '@kitman/components';
import { useUpdateChartWidgetMutation } from '@kitman/modules/src/analysis/Dashboard/redux/services/chartBuilder';
import {
  beginWidgetEditMode,
  updateChartName,
  updateChartConfig,
} from '@kitman/modules/src/analysis/Dashboard/redux/slices/chartBuilder';
import { editWidgetSuccess } from '@kitman/modules/src/analysis/Dashboard/redux/actions/widgets';
import {
  isWidgetInEditModeFactory,
  getChartConfig,
  getChartTypeByWidgetId,
} from '@kitman/modules/src/analysis/Dashboard/redux/selectors/chartBuilder';
import {
  getChartTitle,
  sortCacheTimestamps,
} from '@kitman/modules/src/analysis/Dashboard/utils';
import { CHART_TYPE } from '@kitman/modules/src/analysis/Dashboard/components/ChartWidget/types';
import { WidgetTranslated as Widget } from '../Widget';
import type { ChartWidgetData, PivotData } from './types';
import { ChartTranslated as Chart } from '../Chart';
import {
  ChartBuilderTranslated as ChartBuilder,
  BuilderActionButtons,
} from '../ChartBuilder';
import { isPivotEnabled } from '../ChartBuilder/utils';
import { DataLabelSwitchTranslated as DataLabelSwitch } from '../ChartBuilder/components/DataLabelSwitch';
import { ChartOptionsMenuTranslated as ChartOptionsMenu } from '../ChartBuilder/components/ChartOptionsMenu';

const style = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

type Props = {
  widgetData: ChartWidgetData,
  pivotData: PivotData,
  isDashboardManager?: boolean,
};

function ChartWidget(props: I18nProps<Props>) {
  const dispatch = useDispatch();
  const { containerType, containerId } = useSelector((state) => ({
    containerType: state.staticData.containerType,
    containerId: state.dashboard.activeDashboard.id,
  }));

  const cachedAtTimestampArray = props.widgetData?.widget?.chart_elements
    ?.filter((i) => i.cached_at)
    .map((i) => i.cached_at);

  const cachedAt = sortCacheTimestamps(cachedAtTimestampArray);

  const [updateChartWidget] = useUpdateChartWidgetMutation();

  const isEditModeActive = useSelector(
    isWidgetInEditModeFactory(props.widgetData.id)
  );

  const { chartOptions: selectedChartOptions } = useSelector(
    getChartConfig(props.widgetData.widget.chart_id)
  );

  const chartType = useSelector(getChartTypeByWidgetId(props.widgetData.id));

  const beginActiveMode = () => dispatch(beginWidgetEditMode(props.widgetData));

  const onUpdateChartWidgetConfig = (config: Object) => {
    updateChartWidget({
      widgetId: props.widgetData.id,
      containerType,
      containerId,
      widget: {
        ...props.widgetData.widget,
        config: {
          ...props.widgetData.widget?.config,
          ...config,
        },
      },
    })
      .unwrap()
      .then((response) => {
        dispatch(editWidgetSuccess(response.container_widget));
      });
  };

  const onChangeWidgetName = (name) => {
    updateChartWidget({
      widgetId: props.widgetData.id,
      containerType,
      containerId,
      widget: {
        ...props.widgetData.widget,
        name,
        type: 'chart',
      },
    })
      .unwrap()
      .then((response) => {
        dispatch(editWidgetSuccess(response.container_widget));
        dispatch(updateChartName({ widgetId: props.widgetData.id, name }));
      });
  };

  const hideWidgetMenu = isEditModeActive || !props.isDashboardManager;

  return (
    <Widget
      widgetId={props.widgetData.id}
      cachedAt={cachedAt}
      widgetName={getChartTitle(props.widgetData.widget.name)}
      widgetType={props.widgetData.widget_type}
      chartElements={props.widgetData.widget?.chart_elements}
      onEdit={beginActiveMode}
      chartType={chartType}
      hideWidgetMenu={hideWidgetMenu}
      onChangeWidgetName={onChangeWidgetName}
      renderHeaderRight={() => {
        if (isEditModeActive) {
          return (
            <div css={style}>
              {chartType === 'xy' && (
                <DataLabelSwitch
                  widget={props.widgetData.widget}
                  onUpdateChartWidget={onUpdateChartWidgetConfig}
                />
              )}
              {chartType !== CHART_TYPE.value && (
                <ChartOptionsMenu
                  selectedChartOptions={
                    selectedChartOptions ??
                    props.widgetData.widget.config?.chartOptions
                  }
                  chartType={chartType}
                  onChartOptionUpdate={(chartOption, value) => {
                    dispatch(
                      updateChartConfig({
                        chartId: props.widgetData.widget.chart_id,
                        partialConfig: {
                          chartOptions: {
                            ...(selectedChartOptions ??
                              props.widgetData.widget.config?.chartOptions),
                            [chartOption]: value,
                          },
                        },
                      })
                    );
                    onUpdateChartWidgetConfig({
                      chartOptions: {
                        ...props.widgetData.widget?.config?.chartOptions,
                        [chartOption]: value,
                      },
                    });
                  }}
                />
              )}
              <BuilderActionButtons widgetId={props.widgetData.id} />
            </div>
          );
        }

        return null;
      }}
      canEdit={!isPivotEnabled(props.pivotData)}
    >
      <ErrorBoundary kitmanDesignSystem>
        {isEditModeActive ? (
          <ChartBuilder widgetId={props.widgetData.id} />
        ) : (
          <Chart widgetData={props.widgetData} pivotData={props.pivotData} />
        )}
      </ErrorBoundary>
    </Widget>
  );
}

export const ChartWidgetTranslated: ComponentType<Props> =
  withNamespaces()(ChartWidget);
export default ChartWidget;
