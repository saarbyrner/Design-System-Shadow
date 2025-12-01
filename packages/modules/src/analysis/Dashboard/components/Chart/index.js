// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import _get from 'lodash/get';
import useElementVisibilityTracker from '@kitman/common/src/hooks/useElementVisibilityTracker';
import { EmptyStateTranslated as EmptyState } from '@kitman/modules/src/analysis/shared/components/EmptyState';
import type { ChartWidgetData, PivotData } from '../ChartWidget/types';
import { isChartEmpty } from '../ChartBuilder/utils';
import { ValueTranslated as Value } from './components/Value';
import { XYChartTranslated as XYChart } from './components/XYChart';
import { PieChartTranslated as PieChart } from './components/PieChart';
import useGetPreviewData from './hooks/useGetPreviewData';

type Props = {
  widgetData: ChartWidgetData,
  pivotData: PivotData,
};

const style = {
  container: {
    height: '100%',
    overflow: 'hidden',
  },
};

function Chart(props: I18nProps<Props>) {
  const isEmpty = isChartEmpty(props.widgetData.widget);
  const widget = props.widgetData.widget;
  const [containerRef, { hasBeenVisible }] = useElementVisibilityTracker({
    disconnectOnFirstRender: true,
  });

  const {
    data,
    isFetching,
    error: serverError,
    refetch,
  } = useGetPreviewData(isEmpty, props.widgetData, props.pivotData);

  const renderChart = () => {
    if (window.getFlag('rep-charts-v2-caching') && !hasBeenVisible) return null;

    if (serverError && !isFetching) {
      return (
        <EmptyState
          title={props.t('Unable to load')}
          infoMessage={props.t('Something went wrong loading data')}
          icon="icon-circled-error"
          actionButtonText={props.t('Reload')}
          onActionButtonClick={refetch}
        />
      );
    }

    switch (widget.chart_type) {
      case 'value':
        return (
          <Value
            value={_get(data, '[0].chart[0].value', null)}
            calculation={
              props.widgetData?.widget.chart_elements[0]?.calculation
            }
            unit={_get(data, '[0].metadata.unit', '')}
            isEmpty={isEmpty}
            widgetId={props.widgetData.id}
          />
        );
      case 'xy':
        return (
          <XYChart
            data={data}
            isEmpty={isEmpty}
            isLoading={isFetching}
            chartElements={props.widgetData.widget.chart_elements}
            widgetData={props.widgetData}
          />
        );
      case 'pie':
        return (
          <PieChart
            data={data}
            isEmpty={isEmpty}
            isLoading={isFetching}
            chartElements={props.widgetData.widget.chart_elements}
            widgetData={props.widgetData}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div
      ref={containerRef}
      data-name={props.widgetData.widget.name}
      css={style.container}
    >
      {renderChart()}
    </div>
  );
}

export const ChartTranslated: ComponentType<Props> = withNamespaces()(Chart);
export default Chart;
