// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { css } from '@emotion/react';
import { ErrorBoundary } from '@kitman/components';
import type { TemplateDashboardWidget } from '@kitman/services/src/services/analysis/getTemplateDashboardWidgets';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { WidgetColors } from '@kitman/modules/src/analysis/shared/types/charts';
import { EmptyStateTranslated as EmptyState } from '@kitman/modules/src/analysis/shared/components/EmptyState';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import { processDataToAddMissingValues } from '@kitman/modules/src/analysis/shared/utils';
import { XYChartResponsiveTranslated as XYChartResponsive } from '../XYChart';
import useFilterValues from '../../hooks/useFilterValues';
import { useGetDataQuery } from '../../redux/services/templateDashboards';
import Card from './Card';
import Value from '../Value';
import { isColorCodedChart } from '../../utils';

type Props = {
  widget: TemplateDashboardWidget,
  widgetColors: WidgetColors,
};

const styles = {
  cardTitle: css`
    h4 {
      font-size: 16px;
    }
  `,
  cardRoot: css`
    @media print {
      div {
        break-inside: avoid;
      }
    }
  `,
  cardContent: css`
    .errorBoundary {
      text-align: center;

      h4 {
        font-size: 18px;
      }
    }
  `,
};

function Widget(props: I18nProps<Props>) {
  const widgetFilters = useFilterValues(['timescope', 'population']);
  const {
    data = [],
    isFetching,
    error,
    refetch,
  } = useGetDataQuery(
    {
      id: props.widget.id,
      chart_type: props.widget.chart_type,
      chart_elements: [
        {
          // --- Widget paramaeters
          calculation: props.widget.calculation,
          data_source_type: props.widget.data_source_type,
          input_params: props.widget.input_params,
          config: props.widget.config,
          overlays: props.widget.overlays,
          // --- Filter paramaters
          population: widgetFilters.population,
          time_scope: widgetFilters.timescope,
        },
      ],
    },
    props.widget.title
  );
  const { organisation } = useOrganisation();
  const locale = organisation?.locale || navigator.language;

  const renderContent = () => {
    const chartData = data[0]?.error
      ? data
      : processDataToAddMissingValues(data);
    switch (props.widget.chart_type) {
      case 'value':
        // Temporary fix to unblock the users till we have designs for unpermitted users.
        // <https://kitmanlabs.atlassian.net/browse/REP-795>
        // $FlowIgnore[prop-missing] error will be available through rtk query
        if (chartData[0]?.error) {
          return <Value type={props.widget.chart_type} value=" - " />;
        }
        return (
          <Value
            type={props.widget.chart_type}
            // $FlowIgnore[incompatible-type] value should be available
            value={chartData[0]?.chart[0]?.value || ' - '}
          />
        );
      case 'bar':
      case 'line':
      case 'summary_stack':
        return (
          <XYChartResponsive
            locale={locale}
            hideEmptyState={isFetching}
            chartType={props.widget.chart_type}
            chartData={chartData[0] || {}}
            isColorCoded={
              window.getFlag('rep-show-player-care-dev-journey') &&
              isColorCodedChart(
                props.widget.config,
                props.widgetColors.grouping
              )
            }
            widgetColors={props.widgetColors}
            config={props.widget.config}
          />
        );
      default:
        return <pre>{JSON.stringify(data, null, 2)}</pre>;
    }
  };

  const errorStateProps = {
    title: props.t('Unable to load'),
    infoMessage: props.t('Something went wrong on our end'),
    icon: 'icon-circled-error',
    actionButtonText: props.t('Reload'),
    onActionButtonClick: () => {
      refetch();
    },
  };

  return (
    <Card css={styles.cardRoot}>
      <Card.Header styles={styles.cardTitle}>
        <Card.Title>
          <h4>{props.widget.title}</h4>
        </Card.Title>
      </Card.Header>
      <Card.Content styles={styles.cardContent}>
        <ErrorBoundary kitmanDesignSystem>
          {!error && renderContent()}
          {error && !isFetching && <EmptyState {...errorStateProps} />}
          <Card.Loading isLoading={isFetching} />
        </ErrorBoundary>
      </Card.Content>
    </Card>
  );
}

export const WidgetTranslated: ComponentType<Props> = withNamespaces()(Widget);
export default Widget;
