// @flow

import type { injuryVariableSettingsState } from '../../RiskAdvisor/src/types';

export type contributingFactorsState = {
  graphData: {
    analytics_metadata: {
      date_range: {
        start_date: string,
        end_date: string,
      },
      position_group_ids: ?Array<string>,
      exposures: ?Array<'game' | 'training_session'>,
      mechanisms: ?Array<'contact' | 'non_contact'>,
      body_area_ids: ?Array<string>,
      injuries: ?number,
      athletes: ?number,
      severity: Array<string>,
    },
    dashboard_header: {
      athlete_name: ?string,
      injury_risk: ?number,
      injury_risk_variable_name: ?string,
    },
  },
};

type fetchGraphDataLoading = {
  type: 'FETCH_GRAPH_DATA_LOADING',
};

type fetchGraphDataSuccess = {
  type: 'FETCH_GRAPH_DATA_SUCCESS',
  payload: {
    graphData: Object,
  },
};

type fetchGraphDataError = {
  type: 'FETCH_GRAPH_DATA_ERROR',
};

type hideAppStatus = {
  type: 'HIDE_APP_STATUS',
};

export type Action =
  | fetchGraphDataLoading
  | fetchGraphDataSuccess
  | fetchGraphDataError
  | hideAppStatus;

type Dispatch = (
  // eslint-disable-next-line no-use-before-define
  action: Action | ThunkAction
) => any;
type GetState = () => injuryVariableSettingsState;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
