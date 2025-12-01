import injuryRiskMetricsReducer from '../injuryRiskMetrics';
// eslint-disable-next-line jest/no-mocks-import
import injuryRiskMetrics from '../../__mocks__/injuryRiskMetrics';

describe('analyticalDashboard - injuryRiskMetricsReducer', () => {
  const defaultState = {
    isLoading: false,
    hasErrored: false,
    metrics: [],
  };

  it('returns correct state on INJURY_METRICS_IS_LOADING', () => {
    const action = {
      type: 'INJURY_METRICS_IS_LOADING',
    };

    const nextState = injuryRiskMetricsReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      isLoading: true,
    });
  });

  it('returns correct state on INJURY_METRICS_HAS_LOADED', () => {
    const action = {
      type: 'INJURY_METRICS_HAS_LOADED',
    };

    const nextState = injuryRiskMetricsReducer(
      { ...defaultState, isLoading: true },
      action
    );
    expect(nextState).toStrictEqual({
      ...defaultState,
      isLoading: false,
    });
  });

  it('returns correct state on INJURY_METRICS_HAS_ERRORED', () => {
    const action = {
      type: 'INJURY_METRICS_HAS_ERRORED',
    };

    const nextState = injuryRiskMetricsReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      hasErrored: true,
    });
  });

  it('returns correct state on SET_INJURY_RISK_METRICS', () => {
    const action = {
      type: 'SET_INJURY_RISK_METRICS',
      payload: injuryRiskMetrics,
    };

    const nextState = injuryRiskMetricsReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      metrics: injuryRiskMetrics,
    });
  });
});
