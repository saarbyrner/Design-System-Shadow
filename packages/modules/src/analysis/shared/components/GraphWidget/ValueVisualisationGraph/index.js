// @flow
import { useRef } from 'react';
import { withNamespaces } from 'react-i18next';
import classNames from 'classnames';
import moment from 'moment';
import Tippy from '@tippyjs/react';
import { Link } from '@kitman/components';
import { TrackEvent } from '@kitman/common/src/utils';
import { buildGraphLink } from '@kitman/modules/src/analysis/shared/resources/graph/GraphUtils';
import useRelativeFontSize from '@kitman/modules/src/analysis/shared/hooks/useRelativeFontSize';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { ValueVisualisationData } from '../../../types';
import { isDrillGraph } from '../../../utils';
import { GraphDescriptionTranslated as GraphDescription } from '../GraphDescription';

type Props = {
  graphData: ValueVisualisationData,
  showTitle?: boolean,
  underText?: string,
  openRenameGraphModal?: Function,
  canSaveGraph?: boolean,
  condensed?: boolean,
  valueColour?: string,
};

const MAX_VALUE_FONT_SIZE = 435;
const MIN_UNIT_FONT_SIZE = 12;

const ValueVisualisationGraph = (props: I18nProps<Props>) => {
  const valueVisualisatonEl: Object = useRef(null);
  const [valueFontSize, valueContainerRef, valueRef] =
    useRelativeFontSize(MAX_VALUE_FONT_SIZE);
  const unitFontSize =
    valueFontSize / 6 < MIN_UNIT_FONT_SIZE
      ? MIN_UNIT_FONT_SIZE
      : valueFontSize / 6;

  const metric = props.graphData.metrics[0];
  let unit = '';
  if (props.underText && props.underText.length > 0) {
    unit = props.underText;
  } else if (metric.type === 'medical') {
    unit = props.t('Total');
  } else if (metric.type === 'metric') {
    unit =
      metric.calculation === 'count'
        ? props.t('Total')
        : metric.status.localised_unit;
  }

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

  const baseUrl = window.featureFlags['side-nav-update']
    ? '/analytics/injury_risk_contributing_factors'
    : '/settings/injury_risk_contributing_factors';

  const unixEndTimeSeconds =
    moment(props.graphData.date_range?.end_date).valueOf() / 1000;
  const unixStartTimeSeconds =
    moment(props.graphData.date_range?.start_date).valueOf() / 1000;
  const isOneDayRange = unixStartTimeSeconds - unixEndTimeSeconds <= 3600 * 24;
  const targetUrl =
    metric.athlete_ids && metric.status?.variables
      ? `${baseUrl}?athlete_id=${metric.athlete_ids[0]}&injury_risk_variable_uuid=${metric.status.variables[0]?.variable}&prediction_timestamp=${unixEndTimeSeconds}`
      : '';

  return (
    <div ref={valueVisualisatonEl} className="valueVisualisation">
      <GraphDescription
        showTitle={props.showTitle}
        graphData={props.graphData}
        openRenameGraphModal={props.openRenameGraphModal}
        graphGroup="value_visualisation"
        condensed={props.condensed}
        canSaveGraph={props.canSaveGraph}
      />
      <div className="valueVisualisation__valueContainer">
        {metric.series[0]?.value || metric.series[0]?.value === 0 ? (
          <div
            ref={valueContainerRef}
            onClick={onClickValueVisualisation}
            className={classNames('valueVisualisation__valueWrapper', {
              valueVisualisation__link:
                metric.linked_dashboard_id && !isDrillGraph(props.graphData),
            })}
          >
            <div
              ref={valueRef}
              className="valueVisualisation__value"
              style={{
                fontSize: valueFontSize,
                lineHeight: 1,
                color: props.valueColour,
              }}
            >
              {props.graphData.id !== null &&
              metric.status?.variables &&
              metric.status?.variables[0]?.source === 'kitman:injury_risk' &&
              metric.series &&
              metric.series[0].population_type === 'athlete' &&
              isOneDayRange &&
              window.getFlag('injury-risk-metrics-contributing-factors') ? (
                <Tippy
                  offset={[0, -50]}
                  content={
                    <div className="valueVisualisationTooltip">
                      <div className="valueVisualisationTooltip__name">
                        {metric.series[0].name}
                      </div>
                      <div className="valueVisualisationTooltip__legend">
                        <span className="valueVisualisationTooltip__circle" />
                        <span className="valueVisualisationTooltip__metricName">
                          {metric.status.name}
                        </span>
                        <span className="valueVisualisationTooltip__value">
                          {metric.series[0].value}
                        </span>
                      </div>
                      <div className="valueVisualisationTooltip__footer">
                        <Link href={targetUrl}>
                          {props.t('Contributing Factors')}
                        </Link>
                      </div>
                    </div>
                  }
                  placement="top"
                  theme="neutral-tooltip--kitmanDesignSystem"
                  interactive
                >
                  <span>{metric.series[0].value}</span>
                </Tippy>
              ) : (
                metric.series[0].value
              )}
            </div>
            <div
              className="valueVisualisation__unit"
              style={{
                fontSize: unitFontSize,
              }}
            >
              {unit}
            </div>
          </div>
        ) : (
          <div className="valueVisualisation__noValue">
            {props.t('No data to display')}
          </div>
        )}
      </div>
    </div>
  );
};

export const ValueVisualisationGraphTranslated = withNamespaces()(
  ValueVisualisationGraph
);
export default ValueVisualisationGraph;
