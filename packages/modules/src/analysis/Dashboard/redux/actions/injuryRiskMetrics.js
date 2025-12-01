// @flow
import $ from 'jquery';
import type { InjuryVariable } from '@kitman/common/src/types/RiskAdvisor';
import type { Action, ThunkAction } from '../types/actions';

export const injuryRiskMetricsIsLoading = (): Action => ({
  type: 'INJURY_METRICS_IS_LOADING',
});

export const injuryRiskMetricsHasLoaded = (): Action => ({
  type: 'INJURY_METRICS_HAS_LOADED',
});

export const injuryRiskMetricsHasErrored = (): Action => ({
  type: 'INJURY_METRICS_HAS_ERRORED',
});

export const setInjuryRiskMetrics = (metrics: Array<InjuryVariable>) => ({
  type: 'SET_INJURY_RISK_METRICS',
  payload: metrics,
});

export const fetchInjuryriskMetrics =
  (): ThunkAction => (dispatch: (action: Action) => Action) => {
    dispatch(injuryRiskMetricsIsLoading());

    $.ajax({
      method: 'GET',
      url: window.featureFlags['side-nav-update']
        ? '/administration/analytics.json'
        : '/settings/injury_risk_variables.json',
      contentType: 'application/json',
    })
      .done((response) => {
        dispatch(setInjuryRiskMetrics(response));
        dispatch(injuryRiskMetricsHasLoaded());
      })
      .fail(() => {
        dispatch(injuryRiskMetricsHasErrored());
        dispatch(injuryRiskMetricsHasLoaded());
      });
  };
