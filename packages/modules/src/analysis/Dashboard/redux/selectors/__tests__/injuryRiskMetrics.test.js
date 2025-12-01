import {
  isInjuryRiskMetricsLoading,
  hasInjuryRiskMetricsErrored,
  getThresholdByMetricFactory,
} from '../injuryRiskMetrics';
// eslint-disable-next-line jest/no-mocks-import
import injuryRiskMetrics from '../../__mocks__/injuryRiskMetrics';

describe('analyticalDashboard - injuryRiskMetrics selectors', () => {
  const state = {
    injuryRiskMetrics: {
      isLoading: false,
      hasErrored: false,
      metrics: [],
    },
  };

  it('returns loading state for isInjuryRiskMetricsLoading() selector', () => {
    const selectedState = isInjuryRiskMetricsLoading({
      ...state,
      injuryRiskMetrics: {
        ...state.injuryRiskMetrics,
        isLoading: true,
      },
    });

    expect(selectedState).toBe(true);
  });

  it('returns error state for hasInjuryRiskMetricsErrored() selector', () => {
    const selectedState = hasInjuryRiskMetricsErrored({
      ...state,
      injuryRiskMetrics: {
        ...state.injuryRiskMetrics,
        hasErrored: true,
      },
    });

    expect(selectedState).toBe(true);
  });

  it('returns threshold for metric key in getThresholdByMetricFactory', () => {
    const selector = getThresholdByMetricFactory(
      'kitman:injury_risk|ac233802-0c07-4923-8523-8e3da7fa995e'
    );
    const selectedState = selector({
      ...state,
      injuryRiskMetrics: {
        ...state.injuryRiskMetrics,
        metrics: injuryRiskMetrics,
      },
    });

    expect(selectedState).toBe(36.2747);
  });

  it('returns -1 for metric key when it is not a injury risk metric in getThresholdByMetricFactory', () => {
    const selector = getThresholdByMetricFactory('combination|%_difference');
    const selectedState = selector({
      ...state,
      injuryRiskMetrics: {
        ...state.injuryRiskMetrics,
        metrics: injuryRiskMetrics,
      },
    });

    expect(selectedState).toBe(-1);
  });
});
