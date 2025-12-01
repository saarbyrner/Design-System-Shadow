// @flow
import classNames from 'classnames';
import moment from 'moment';
import { withNamespaces } from 'react-i18next';
import { TrackEvent } from '@kitman/common/src/utils';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { buildGraphLink } from '@kitman/modules/src/analysis/shared/resources/graph/GraphUtils';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { LongitudinalGraphData } from '../../../types';
import { GraphDescriptionTranslated as GraphDescription } from '../GraphDescription';
import { isDrillGraph, getFullMedicalCategoryName } from '../../../utils';
import formatGraphData from './utils';

type Props = {
  graphData: LongitudinalGraphData,
  showTitle?: boolean,
  openRenameGraphModal?: Function,
  canSaveGraph?: boolean,
  condensed?: boolean,
};

const LongitudinalGraphTable = (props: I18nProps<Props>) => {
  const tableData = formatGraphData(props.graphData);

  const getTableHeaders = () =>
    tableData.categories.length
      ? tableData.categories.map((category) => (
          <th key={category}>{category}</th>
        ))
      : tableData.dates.map((date) => (
          <th key={date}>
            {window.featureFlags['standard-date-formatting']
              ? DateFormatter.formatVeryShort(moment(date))
              : moment(date).format('DD/MM')}
          </th>
        ));

  const onClickValueVisualisation = (seriesIndex, metricIndex) => {
    const metric = props.graphData.metrics[metricIndex];
    const linkedDashboardId = metric.linked_dashboard_id;

    if (linkedDashboardId && !isDrillGraph(props.graphData)) {
      TrackEvent('Graph Dashboard', 'Click', 'Click data point link');

      const graphLink = buildGraphLink({
        linkedDashboardId: metric.linked_dashboard_id,
        populationType: metric.series[seriesIndex].population_type,
        populationId: metric.series[seriesIndex].population_id,
        timePeriod: props.graphData.time_period,
        dateRange: props.graphData.date_range,
        timePeriodLength: metric.status.time_period_length,
      });
      window.location.assign(graphLink);
    }
  };

  return (
    <>
      <GraphDescription
        showTitle={props.showTitle}
        graphData={props.graphData}
        graphGroup="longitudinal"
        openRenameGraphModal={props.openRenameGraphModal}
        canSaveGraph={props.canSaveGraph}
        condensed={props.condensed}
      />
      <div
        className={classNames('longitudinalGraphTable', {
          'longitudinalGraphTable--condensed': props.condensed,
        })}
      >
        <div className="longitudinalGraphTable__fixed">
          <table className="table km-table">
            <thead>
              <tr>
                <th>{props.t('Name')}</th>
                <th>{props.t('Data')}</th>
              </tr>
            </thead>
            <tbody>
              {props.graphData.metrics.map((metric) =>
                metric.series.map((item) => {
                  let metricName = '';
                  if (metric.type === 'medical') {
                    metricName = getFullMedicalCategoryName(
                      metric.category,
                      metric.main_category
                    );
                  } else {
                    metricName = metric.status.name;
                  }
                  return (
                    <tr key={`${item.fullname}_${metricName}`}>
                      <td>{item.fullname}</td>
                      <td>{metricName}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="longitudinalGraphTable__scrollable">
          <table className="table km-table">
            <thead>
              <tr>{getTableHeaders()}</tr>
            </thead>
            <tbody>
              {
                // Allow react Key to be an array index. The table won't be reordered.
                /* eslint-disable */
                tableData.datapoints.map((datapoint, index) => (
                  <tr
                    key={index}
                    onClick={() =>
                      onClickValueVisualisation(
                        tableData.lines[index].seriesIndex,
                        tableData.lines[index].metricIndex
                      )
                    }
                    className={classNames({
                      longitudinalGraphTable__link:
                        props.graphData.metrics[
                          tableData.lines[index].metricIndex
                        ].linked_dashboard_id && !isDrillGraph(props.graphData),
                    })}
                  >
                    {tableData.dates.map((date) => (
                      <td key={date}>{datapoint[date] || '-'}</td>
                    ))}
                  </tr>
                ))
                /* eslint-enable */
              }
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export const LongitudinalGraphTableTranslated = withNamespaces()(
  LongitudinalGraphTable
);
export default LongitudinalGraphTable;
