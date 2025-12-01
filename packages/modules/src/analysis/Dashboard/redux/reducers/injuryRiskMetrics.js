// @flow
import type { Action } from '../types/actions';
import type { InjuryRiskMetricsState } from '../types/store';

const injuryRiskMetricsReducer = (
  state: InjuryRiskMetricsState = {},
  action: Action
) => {
  switch (action.type) {
    case 'INJURY_METRICS_IS_LOADING':
      return {
        ...state,
        hasErrored: false,
        isLoading: true,
      };
    case 'INJURY_METRICS_HAS_LOADED':
      return {
        ...state,
        isLoading: false,
      };
    case 'INJURY_METRICS_HAS_ERRORED':
      return {
        ...state,
        hasErrored: true,
      };
    case 'SET_INJURY_RISK_METRICS':
      return {
        ...state,
        hasErrored: false,
        metrics: action.payload,
      };
    default:
      return state;
  }
};

export default injuryRiskMetricsReducer;
