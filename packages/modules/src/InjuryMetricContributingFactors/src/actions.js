// @flow
import $ from 'jquery';
import type { Action, ThunkAction } from './types';

export const fetchGraphDataLoading = (): Action => ({
  type: 'FETCH_GRAPH_DATA_LOADING',
});

export const fetchGraphDataSuccess = (graphData: Object): Action => ({
  type: 'FETCH_GRAPH_DATA_SUCCESS',
  payload: {
    graphData,
  },
});

export const fetchGraphDataError = (): Action => ({
  type: 'FETCH_GRAPH_DATA_ERROR',
});

export const hideAppStatus = (): Action => ({
  type: 'HIDE_APP_STATUS',
});

export const fetchGraphData =
  (
    athleteId: string,
    injuryRiskVariableUuid: string,
    predictionTimeStamp: string
  ): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action) => {
    dispatch(fetchGraphDataLoading());

    $.ajax({
      method: 'POST',
      url: window.featureFlags['side-nav-update']
        ? '/analytics/injury_risk_contributing_factors/build'
        : '/settings/injury_risk_contributing_factors/build',
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({
        athlete_id: athleteId,
        injury_risk_variable_uuid: injuryRiskVariableUuid,
        prediction_timestamp: predictionTimeStamp,
      }),
    })
      .done((graphData) => {
        dispatch(fetchGraphDataSuccess(graphData));
        setTimeout(() => {
          dispatch(hideAppStatus());
        }, 1000);
      })
      .fail(() => {
        dispatch(fetchGraphDataError());
      });
  };
