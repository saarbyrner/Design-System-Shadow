// @flow
import $ from 'jquery';
import type { Action, ThunkAction } from '../types/actions';
import { getDashboardLayout } from './dashboard';
import { saveWidgetSuccess, updateExistingWidgetYPosition } from './widgets';

export const openTableWidgetModal = (): Action => ({
  type: 'OPEN_TABLE_WIDGET_MODAL',
});

export const closeTableWidgetModal = (): Action => ({
  type: 'CLOSE_TABLE_WIDGET_MODAL',
});

export const addTableWidgetLoading = (): Action => ({
  type: 'ADD_TABLE_WIDGET_LOADING',
});

export const addTableWidgetSuccess = (): Action => ({
  type: 'ADD_TABLE_WIDGET_SUCCESS',
});

export const addTableWidgetFailure = (): Action => ({
  type: 'ADD_TABLE_WIDGET_FAILURE',
});

export const addTableWidget =
  (tableType: string): ThunkAction =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    dispatch(addTableWidgetLoading());

    $.ajax({
      method: 'POST',
      url: '/widgets',
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
      contentType: 'application/json',
      data: JSON.stringify({
        container_type: getState().staticData.containerType,
        container_id: getState().dashboard.activeDashboard.id,
        widget: {
          type: 'table',
          config: {
            table_type: tableType,
          },
        },
      }),
    })
      .done((response) => {
        dispatch(updateExistingWidgetYPosition(response.container_widget));
        dispatch(saveWidgetSuccess(response.container_widget));
        dispatch(addTableWidgetSuccess());
        dispatch(getDashboardLayout(getState().dashboard.widgets));
      })
      .fail(() => {
        dispatch(addTableWidgetFailure());
      });
  };
