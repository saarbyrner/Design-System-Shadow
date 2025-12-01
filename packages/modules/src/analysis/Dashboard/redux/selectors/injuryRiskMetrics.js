// @flow
import _find from 'lodash/find';
import type { Store } from '../types/store';

export const isInjuryRiskMetricsLoading = (state: Store) =>
  state.injuryRiskMetrics.isLoading;

export const hasInjuryRiskMetricsErrored = (state: Store) =>
  state.injuryRiskMetrics.hasErrored;

export const getThresholdByMetricFactory =
  (metricKey: string) => (state: Store) => {
    const uuid = metricKey.split('|')[1];
    const metrics = state.injuryRiskMetrics.metrics;
    const riskMetric = _find(metrics, { variable_uuid: uuid });

    if (riskMetric) {
      return riskMetric.alarm_threshold;
    }

    return -1;
  };
