// @flow
import $ from 'jquery';
import _isEmpty from 'lodash/isEmpty';
import { isSelectionEmpty } from '@kitman/components/src/AthleteSelector/utils';
import { buildGraphData } from '@kitman/modules/src/analysis/Dashboard/components/utils';
import { getDashboardLayout } from '@kitman/modules/src/analysis/Dashboard/redux/actions/dashboard';
import { TIME_PERIODS } from '@kitman/modules/src/analysis/shared/constants';

// Types
import type { Action, ThunkAction } from '../types/actions';
import type { WidgetData } from '../../types';
import type { Store } from '../types/store';

export const saveWidgetSuccess = (widget: WidgetData): Action => ({
  type: 'SAVE_WIDGET_SUCCESS',
  payload: {
    widget,
  },
});

export const editWidgetSuccess = (widget: WidgetData): Action => ({
  type: 'EDIT_WIDGET_SUCCESS',
  payload: {
    widget,
  },
});

export const deleteWidgetSuccess = (widgetId: number): Action => ({
  type: 'DELETE_WIDGET_SUCCESS',
  payload: {
    widgetId,
  },
});

export const updateExistingWidgetYPosition = (widget: WidgetData): Action => ({
  type: 'UPDATE_EXISTING_WIDGET_Y_POSITION',
  payload: {
    widget,
  },
});

export const fetchWidgetsSuccess = (widgets: Array<WidgetData>): Action => ({
  type: 'FETCH_WIDGETS_SUCCESS',
  payload: {
    widgets,
  },
});

export const fetchWidgetsFailure = (): Action => ({
  type: 'FETCH_WIDGETS_FAILURE',
});

export const fetchWidgetsLoading = (): Action => ({
  type: 'FETCH_WIDGETS_LOADING',
});

export const fetchWidgetContentSuccess = (
  widgetId: number,
  widgetContent: Object
): Action => ({
  type: 'FETCH_WIDGET_CONTENT_SUCCESS',
  payload: {
    widgetId,
    widgetContent,
  },
});

export const fetchWidgetContentForbidden = (widgetId: number): Action => ({
  type: 'FETCH_WIDGET_CONTENT_FORBIDDEN',
  payload: {
    widgetId,
  },
});

export const fetchWidgetContentFailure = (
  widgetId: number,
  errorMessage?: ?string
): Action => ({
  type: 'FETCH_WIDGET_CONTENT_FAILURE',
  payload: {
    widgetId,
    errorMessage,
  },
});

export const fetchWidgetContentLoading = (widgetId: number): Action => ({
  type: 'FETCH_WIDGET_CONTENT_LOADING',
  payload: {
    widgetId,
  },
});

export const getPivotData = (dashboard: $PropertyType<Store, 'dashboard'>) => {
  const pivotData = {};

  if (!isSelectionEmpty(dashboard.appliedSquadAthletes)) {
    pivotData.population = dashboard.appliedSquadAthletes;
  }
  if (dashboard.appliedTimePeriod !== '') {
    pivotData.time_period = dashboard.appliedTimePeriod;
  }

  const timePeriod = dashboard.appliedTimePeriod;

  if (
    timePeriod === TIME_PERIODS.customDateRange &&
    !_isEmpty(dashboard.appliedDateRange)
  ) {
    pivotData.date_range = dashboard.appliedDateRange;
  }

  if (
    timePeriod === TIME_PERIODS.lastXDays &&
    dashboard.appliedTimePeriodLength
  ) {
    pivotData.time_period_length = dashboard.appliedTimePeriodLength;
  }

  return pivotData;
};

export const fetchWidgetContent =
  (widgetId: number, widgetType: string, options?: Object): ThunkAction =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    dispatch(fetchWidgetContentLoading(widgetId));
    const pivotData = getPivotData(getState().dashboard);
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
        pivot: pivotData,
        options,
      }),
    })
      .done((response) => {
        const isForbidden =
          response.graph_data && response.graph_data.forbidden;
        const updatedWidgetContent =
          widgetType === 'graph' && !isForbidden
            ? buildGraphData(
                response.graph_data,
                getState().staticData.availableVariablesHash
              )
            : response;

        if (isForbidden) {
          dispatch(fetchWidgetContentForbidden(widgetId));
        } else {
          dispatch(fetchWidgetContentSuccess(widgetId, updatedWidgetContent));
        }
      })
      .fail((xhr) => {
        if (xhr.statusText !== 'REQUEST_ABORTED') {
          const errorMessage = xhr.responseJSON
            ? xhr.responseJSON.message
            : null;
          dispatch(fetchWidgetContentFailure(widgetId, errorMessage));
        }
      });
  };

export const fetchWidgets =
  (): ThunkAction =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    dispatch(fetchWidgetsLoading());

    const pivotData = getPivotData(getState().dashboard);

    $.ajax({
      method: 'POST',
      url: '/widgets/container_widgets',
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
      contentType: 'application/json',
      data: JSON.stringify({
        container_type: getState().staticData.containerType,
        container_id: getState().dashboard.activeDashboard.id,
        pivot: pivotData,
      }),
    })
      .done((response) => {
        dispatch(fetchWidgetsSuccess(response.container_widgets));
        dispatch(getDashboardLayout(response.container_widgets));
      })
      .fail((xhr) => {
        if (xhr.statusText !== 'REQUEST_ABORTED') {
          dispatch(fetchWidgetsFailure());
        }
      });
  };

export const deleteWidget =
  (id: number): ThunkAction =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    $.ajax({
      method: 'DELETE',
      url: `/widgets/${id}`,
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
      data: {
        container_type: getState().staticData.containerType,
        container_id: getState().dashboard.activeDashboard.id,
      },
    }).done(() => {
      dispatch(deleteWidgetSuccess(id));
    });
  };
