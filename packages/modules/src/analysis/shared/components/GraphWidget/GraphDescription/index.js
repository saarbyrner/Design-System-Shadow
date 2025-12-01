/* eslint-disable react/no-array-index-key, react/sort-comp */
// @flow
import type { Node } from 'react';

import { Component } from 'react';
import classNames from 'classnames';
import { withNamespaces } from 'react-i18next';
import { getTimePeriodName } from '@kitman/common/src/utils/status_utils';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { IconButton } from '@kitman/components';
import type {
  SummaryGraphData,
  LongitudinalGraphData,
  SummaryBarGraphData,
  SummaryStackBarGraphData,
  SummaryDonutGraphData,
  ValueVisualisationData,
  GraphGroup,
} from '../../../types';
import {
  getGraphTitles,
  formatFilterNames,
  getEventsDetails,
} from '../../../utils';

type GraphData =
  | SummaryGraphData
  | LongitudinalGraphData
  | SummaryBarGraphData
  | SummaryStackBarGraphData
  | SummaryDonutGraphData
  | ValueVisualisationData;

type Props = {
  graphData: GraphData,
  graphGroup: GraphGroup,
  showTitle?: boolean,
  openRenameGraphModal?: Function,
  canSaveGraph?: boolean,
  condensed?: boolean,
};

class GraphDescription extends Component<I18nProps<Props>> {
  getTimePeriod = () => {
    if (this.props.graphData.graphGroup === 'summary') {
      return null;
    }
    const graphData = this.props.graphData;
    const timePeriodKey = graphData.time_period;
    const startDate = graphData.date_range.start_date;
    const endDate = graphData.date_range.end_date;
    const timePeriodLength = graphData.metrics[0].status
      ? graphData.metrics[0].status.time_period_length
      : graphData.metrics[0].time_period_length;
    const timePeriodLengthOffset = graphData.metrics[0].status
      ? graphData.metrics[0].status.time_period_length_offset
      : graphData.metrics[0].time_period_length_offset;

    return getTimePeriodName(
      timePeriodKey,
      {
        startDate,
        endDate,
      },
      timePeriodLength,
      timePeriodLengthOffset
    );
  };

  getPopulation = () => {
    if (this.props.graphGroup === 'summary_donut') {
      const metrics = this.props.graphData.metrics;
      return metrics.length > 0 && metrics[0].series.length > 0
        ? metrics[0].series[0].name
        : '';
    }

    if (this.props.graphGroup === 'value_visualisation') {
      return this.props.graphData.metrics[0].series[0].name;
    }

    return null;
  };

  getRenameBtn() {
    return (
      this.props.canSaveGraph && (
        <IconButton
          icon="icon-edit-name"
          isTransparent
          onClick={() => {
            if (this.props.openRenameGraphModal) {
              this.props.openRenameGraphModal();
            }
          }}
        />
      )
    );
  }

  buildGraphTitles(graphTitles: Array<{ title: string, unit: ?string }>): Node {
    if (graphTitles.length > 2) {
      return (
        <div className="graphDescription__metricName">
          {this.props.t('{{titleCount}} Metrics', {
            titleCount: graphTitles.length,
          })}
        </div>
      );
    }

    return graphTitles.map((metric, index) => {
      const unitElement = metric.unit ? (
        <span className="graphDescription__metricUnit">({metric.unit})</span>
      ) : null;

      return index > 0 ? (
        <div className="graphDescription__metricName" key={index}>
          &nbsp;- <span>{metric.title}</span> {unitElement}
        </div>
      ) : (
        <div className="graphDescription__metricName" key={index}>
          <span>{metric.title}</span> {unitElement}
        </div>
      );
    });
  }

  renderGraphTitle(data: GraphData) {
    return (
      <h4 className="graphDescription__status graphDescription__status--renaming">
        <div className="graphDescription__statusName">
          {data.name || this.buildGraphTitles(getGraphTitles(data))}
        </div>
        {this.getRenameBtn()}
      </h4>
    );
  }

  getSeries(graphData: SummaryGraphData): Node {
    const periodLength = graphData.series[0].time_period_length;
    const periodLengthOffset = graphData.series[0].time_period_length_offset;

    return graphData.series.map((item, index) => (
      <span key={index} className="graphDescription__seriesItem">
        {item.event_type_time_period === 'game' ||
        item.event_type_time_period === 'training_session' ? (
          <>
            {getEventsDetails(
              item.event_type_time_period,
              item.selected_games,
              item.selected_training_sessions
            )}
          </>
        ) : (
          <>
            <span className="graphDescription__separator">
              {`${item.name}: `}
            </span>
            {getTimePeriodName(
              item.timePeriod,
              item.dateRange,
              periodLength,
              periodLengthOffset
            )}
          </>
        )}
      </span>
    ));
  }

  getFilters(): Node {
    const metrics = this.props.graphData.metrics;
    const filtersName =
      metrics.length > 0 ? formatFilterNames(metrics[0].filter_names) : null;

    return filtersName && ` (${filtersName})`;
  }

  renderGraphDateRange(graphData: GraphData) {
    const metricStatus =
      graphData.metrics.length > 0 && graphData.metrics[0]
        ? graphData.metrics[0].status
        : {};

    if (graphData.graphGroup === 'summary') {
      return this.getSeries(graphData);
    }

    if (
      (this.props.graphGroup === 'longitudinal' ||
        this.props.graphGroup === 'summary_bar' ||
        this.props.graphGroup === 'value_visualisation') &&
      graphData.metrics[0].status &&
      (graphData.metrics[0].status.event_type_time_period === 'game' ||
        graphData.metrics[0].status.event_type_time_period ===
          'training_session')
    ) {
      return (
        <>
          {getEventsDetails(
            metricStatus.event_type_time_period,
            metricStatus.selected_games,
            metricStatus.selected_training_sessions
          )}
        </>
      );
    }

    return <>{this.getTimePeriod()}</>;
  }

  render() {
    return (
      <div
        className={classNames('graphDescription', {
          'graphDescription--condensed': this.props.condensed,
        })}
      >
        {this.props.showTitle
          ? this.renderGraphTitle(this.props.graphData)
          : null}
        <p>
          {this.renderGraphDateRange(this.props.graphData)}
          &ensp;
          {this.props.graphGroup === 'summary_donut' ||
          this.props.graphGroup === 'value_visualisation' ? (
            <>
              <span className="graphDescription__separator">{`${this.props.t(
                '#sport_specific__Athletes'
              )}: `}</span>
              {this.getPopulation()}
            </>
          ) : null}
          {(this.props.graphGroup === 'summary_donut' ||
            this.props.graphGroup === 'value_visualisation') && (
            <span className="graphDescription__filters">
              {this.getFilters()}
            </span>
          )}
        </p>
      </div>
    );
  }
}

export const GraphDescriptionTranslated = withNamespaces()(GraphDescription);
export default GraphDescription;
