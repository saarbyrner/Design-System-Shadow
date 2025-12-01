// @flow
/* eslint-disable react/no-array-index-key */
import classNames from 'classnames';
import { withNamespaces } from 'react-i18next';
import { TrackEvent } from '@kitman/common/src/utils';
import { buildGraphLink } from '@kitman/modules/src/analysis/shared/resources/graph/GraphUtils';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { GraphDescriptionTranslated as GraphDescription } from '../GraphDescription';
import { isDrillGraph } from '../../../utils';
import type { SummaryDonutGraphData } from '../../../types';

type Props = {
  graphData: SummaryDonutGraphData,
  showTitle?: boolean,
  canSaveGraph?: boolean,
  condensed?: boolean,
};

const SummaryDonutGraphTable = (props: I18nProps<Props>) => {
  const metric = props.graphData.metrics[0];

  const onClickValueVisualisation = (seriesIndex) => {
    const linkedDashboardId = metric.linked_dashboard_id;

    if (linkedDashboardId && !isDrillGraph(props.graphData)) {
      TrackEvent('Graph Dashboard', 'Click', 'Click data point link');

      const graphLink = buildGraphLink({
        linkedDashboardId: metric.linked_dashboard_id,
        populationType: metric.series[seriesIndex].population_type,
        populationId: metric.series[seriesIndex].population_id,
        timePeriod: props.graphData.time_period,
        dateRange: props.graphData.date_range,
        timePeriodLength: metric.time_period_length,
      });

      window.location.assign(graphLink);
    }
  };

  return (
    <>
      <GraphDescription
        showTitle={props.showTitle}
        graphData={props.graphData}
        graphGroup="summary_donut"
        canSaveGraph={props.canSaveGraph}
        condensed={props.condensed}
      />
      <div
        className={classNames('summaryDonutGraphTable', {
          'summaryDonutGraphTable--condensed': props.condensed,
        })}
      >
        <div className="summaryDonutGraphTable__fixed">
          <table className="table km-table">
            <thead>
              <tr>
                <th>{props.t('Name')}</th>
              </tr>
            </thead>
            <tbody>
              {metric.series.map((serie) => (
                <tr>
                  <td key={serie.name}>{serie.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="summaryDonutGraphTable__scrollable">
          <table className="table km-table">
            <thead>
              {metric.series.map((serie) => (
                <tr>
                  {serie.datapoints.map((datapoint, index) => (
                    <th key={index}>{datapoint.name}</th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {props.graphData.metrics[0].series.map((serie, seriesIndex) => (
                <tr
                  onClick={() => onClickValueVisualisation(seriesIndex)}
                  className={classNames({
                    summaryDonutGraphTable__link:
                      metric.linked_dashboard_id &&
                      !isDrillGraph(props.graphData),
                  })}
                >
                  {serie.datapoints.map((datapoint, index) => (
                    <td key={index}>{datapoint.y || '-'}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export const SummaryDonutGraphTableTranslated = withNamespaces()(
  SummaryDonutGraphTable
);
export default SummaryDonutGraphTable;
