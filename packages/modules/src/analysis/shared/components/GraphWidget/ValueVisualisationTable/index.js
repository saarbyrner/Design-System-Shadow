// @flow
import { withNamespaces } from 'react-i18next';
import classNames from 'classnames';

import { TrackEvent } from '@kitman/common/src/utils';
import { buildGraphLink } from '@kitman/modules/src/analysis/shared/resources/graph/GraphUtils';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { GraphDescriptionTranslated as GraphDescription } from '../GraphDescription';
import { getFullMedicalCategoryName, isDrillGraph } from '../../../utils';
import type { ValueVisualisationData } from '../../../types';

type Props = {
  graphData: ValueVisualisationData,
  showTitle?: boolean,
  canSaveGraph?: boolean,
  condensed?: boolean,
};

const ValueVisualisationTable = (props: I18nProps<Props>) => {
  const metric = props.graphData.metrics[0];
  const metricName =
    metric.type === 'medical'
      ? getFullMedicalCategoryName(
          metric.category,
          metric.main_category,
          metric.category_division
        )
      : metric.status.name;

  const onClickValueVisualisation = () => {
    const linkedDashboardId = metric.linked_dashboard_id;

    if (linkedDashboardId && !isDrillGraph(props.graphData)) {
      TrackEvent('Graph Dashboard', 'Click', 'Click data point link');

      const graphLink = buildGraphLink({
        linkedDashboardId: metric.linked_dashboard_id,
        populationType: metric.series[0].population_type,
        populationId: metric.series[0].population_id,
        timePeriod: props.graphData.time_period,
        timePeriodLength: metric.time_period_length,
        dateRange: props.graphData.date_range,
      });

      window.location.assign(graphLink);
    }
  };

  return (
    <>
      <GraphDescription
        showTitle={props.showTitle}
        graphData={props.graphData}
        graphGroup="value_visualisation"
        canSaveGraph={props.canSaveGraph}
        condensed={props.condensed}
      />
      <table className="table km-table">
        <thead>
          <tr>
            <th>{props.t('Name')}</th>
            <th>{props.t('Data')}</th>
            <th>{props.t('Value')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{metric.series[0].name}</td>
            <td>{metricName}</td>
            <td
              onClick={onClickValueVisualisation}
              className={classNames({
                valueVisualisation__link:
                  metric.linked_dashboard_id && !isDrillGraph(props.graphData),
              })}
            >
              {metric.series[0].value}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export const ValueVisualisationTableTranslated = withNamespaces()(
  ValueVisualisationTable
);
export default ValueVisualisationTable;
