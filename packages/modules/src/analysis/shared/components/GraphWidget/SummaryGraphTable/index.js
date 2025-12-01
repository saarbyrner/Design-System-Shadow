// @flow
import classNames from 'classnames';
import { withNamespaces } from 'react-i18next';
import { TrackEvent } from '@kitman/common/src/utils';
import { buildGraphLink } from '@kitman/modules/src/analysis/shared/resources/graph/GraphUtils';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { GraphDescriptionTranslated as GraphDescription } from '../GraphDescription';
import { isDrillGraph, summaryTableFormatting } from '../../../utils';
import type { SummaryGraphData } from '../../../types';

type Props = {
  graphData: SummaryGraphData,
  showTitle?: boolean,
  openRenameGraphModal?: Function,
  canSaveGraph?: boolean,
  condensed?: boolean,
};

const SummaryGraphTable = (props: I18nProps<Props>) => {
  const graphData = summaryTableFormatting(props.graphData);

  const onClickValueVisualisation = (seriesIndex, metric) => {
    const linkedDashboardId = metric.linked_dashboard_id;

    if (linkedDashboardId && !isDrillGraph(props.graphData)) {
      TrackEvent('Graph Dashboard', 'Click', 'Click data point link');

      const graphLink = buildGraphLink({
        linkedDashboardId: metric.linked_dashboard_id,
        populationType: props.graphData.series[seriesIndex].population_type,
        populationId: props.graphData.series[seriesIndex].population_id,
        timePeriod: props.graphData.series[seriesIndex].timePeriod,
        timePeriodLength:
          props.graphData.series[seriesIndex].time_period_length,
        dateRange: {
          start_date: props.graphData.series[seriesIndex].dateRange.startDate,
          end_date: props.graphData.series[seriesIndex].dateRange.endDate,
        },
      });

      window.location.assign(graphLink);
    }
  };

  return (
    <>
      <GraphDescription
        showTitle={props.showTitle}
        graphData={props.graphData}
        graphGroup={props.graphData.graphGroup}
        openRenameGraphModal={props.openRenameGraphModal}
        condensed={props.condensed}
        canSaveGraph={props.canSaveGraph}
      />
      <div
        className={classNames('summaryGraphTable', {
          'summaryGraphTable--condensed': props.condensed,
        })}
      >
        <div className="summaryGraphTable__fixed">
          <table className="table km-table">
            <thead>
              <tr>
                <th>{props.t('Value')}</th>
              </tr>
            </thead>
            <tbody>
              {graphData.metrics.map((metric) => (
                <tr key={`${metric.name}`}>
                  <td>{metric.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="summaryGraphTable__scrollable">
          <table className="table km-table">
            <thead>
              <tr>
                {graphData.series.map((item) => (
                  <th key={item}>{item}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {graphData.metrics.map((metric) => (
                <tr key={metric.name}>
                  {metric.data.map((datapoint, seriesIndex) => (
                    <td
                      key={datapoint || seriesIndex}
                      onClick={() =>
                        onClickValueVisualisation(seriesIndex, metric)
                      }
                      className={classNames({
                        summaryGraphTable__link:
                          metric.linked_dashboard_id &&
                          !isDrillGraph(props.graphData),
                      })}
                    >
                      {datapoint || '-'}
                    </td>
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

export const SummaryGraphTableTranslated = withNamespaces()(SummaryGraphTable);
export default SummaryGraphTable;
