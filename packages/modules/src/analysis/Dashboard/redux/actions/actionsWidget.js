// @flow

import $ from 'jquery';
import type { SquadAthletesSelection } from '@kitman/components/src/types';
import type { Actions } from '../../types';
import type { Action, ThunkAction } from '../types/actions';

export const updateActions = (
  widgetId: number,
  actions: Array<Actions>,
  nextId: number
): Action => ({
  type: 'UPDATE_ACTIONS',
  payload: {
    widgetId,
    actions,
    nextId,
  },
});

export const fetchActionsLoading = (widgetId: number): Action => ({
  type: 'FETCH_ACTIONS_LOADING',
  payload: {
    widgetId,
  },
});

export const resetActionList = (widgetId: number): Action => ({
  type: 'RESET_ACTION_LIST',
  payload: {
    widgetId,
  },
});

export const fetchActions =
  (
    widgetId: number,
    options: {
      next_id: ?number,
      population: SquadAthletesSelection,
      completed: boolean,
      organisation_annotation_type_ids: Array<number>,
    },
    reset?: boolean
  ): ThunkAction =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    if (reset) {
      dispatch(resetActionList(widgetId));
    }

    fetchActionsLoading(widgetId);

    $.ajax({
      method: 'POST',
      url: '/widgets/widget_render',
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
      contentType: 'application/json',
      data: JSON.stringify({
        container_type: getState().staticData.containerType,
        container_id: getState().dashboard.activeDashboard.id,
        container_widget_id: widgetId,
        options,
      }),
    }).done((response) => {
      dispatch(updateActions(widgetId, response.actions, response.next_id));
    });
  };
