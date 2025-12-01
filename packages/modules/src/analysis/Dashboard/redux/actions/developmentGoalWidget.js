// @flow
import $ from 'jquery';
import type { DevelopmentGoals } from '@kitman/modules/src/PlanningHub/src/services/getDevelopmentGoals';
import type { Action, ThunkAction } from '../types/actions';
import {
  saveWidgetSuccess,
  updateExistingWidgetYPosition,
  fetchWidgetContent,
} from './widgets';
import { getDashboardLayout } from './dashboard';

export const onDeleteDevelopmentGoalSuccess = (
  developmentGoalId: number
): Action => ({
  type: 'ON_DELETE_DEVELOPMENT_GOAL_SUCCESS',
  payload: {
    developmentGoalId,
  },
});

export const saveDevelopmentGoalWidgetFailure = (): Action => ({
  type: 'SAVE_DEVELOPMENT_GOAL_WIDGET_FAILURE',
});

export const updateDevelopmentGoals = (
  widgetId: number,
  nextDevelopmentGoals: DevelopmentGoals,
  nextId: ?number
): Action => ({
  type: 'UPDATE_DEVELOPMENT_GOALS',
  payload: {
    widgetId,
    nextDevelopmentGoals,
    nextId,
  },
});

export const developmentGoalWidget =
  (): ThunkAction =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    $.ajax({
      method: 'POST',
      url: '/widgets',
      contentType: 'application/json',
      data: JSON.stringify({
        container_type: getState().staticData.containerType,
        container_id: getState().dashboard.activeDashboard.id,
        widget: {
          type: 'development_goal',
        },
      }),
    })
      .done((response) => {
        dispatch(updateExistingWidgetYPosition(response.container_widget));
        dispatch(saveWidgetSuccess(response.container_widget));
        dispatch(getDashboardLayout(getState().dashboard.widgets));
        // $FlowFixMe
        dispatch(fetchWidgetContent(response.container_widget.id));
      })
      .fail(() => {
        dispatch(saveDevelopmentGoalWidgetFailure());
      });
  };

export const fetchNextDevelopmentGoals =
  (widgetId: number, nextId?: number): ThunkAction =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    if (nextId === null) {
      return;
    }

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
        options: {
          next_id: nextId,
        },
      }),
    }).done((response) => {
      dispatch(
        updateDevelopmentGoals(
          widgetId,
          response.development_goals,
          response.next_id
        )
      );
    });
  };
