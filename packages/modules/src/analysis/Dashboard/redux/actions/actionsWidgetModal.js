// @flow
import $ from 'jquery';
import type { SquadAthletesSelection } from '@kitman/components/src/types';
import type { Action, ThunkAction } from '../types/actions';
import type { ActionsTableColumn } from '../../types';
import { getDashboardLayout } from './dashboard';
import {
  editWidgetSuccess,
  saveWidgetSuccess,
  fetchWidgetContent,
  updateExistingWidgetYPosition,
} from './widgets';

export const openActionsWidgetModal = (
  widgetId: number,
  annotationTypes: Array<Object>,
  population: Object,
  hiddenColumns: Array<ActionsTableColumn>
): Action => ({
  type: 'OPEN_ACTIONS_WIDGET_MODAL',
  payload: {
    widgetId,
    annotationTypes,
    population,
    hiddenColumns,
  },
});

export const closeActionsWidgetModal = (): Action => ({
  type: 'CLOSE_ACTIONS_WIDGET_MODAL',
});

export const selectAnnotationType = (annotationTypeId: number): Action => ({
  type: 'SELECT_ACTIONS_WIDGET_ANNOTATION_TYPE',
  payload: {
    annotationTypeId,
  },
});

export const unselectAnnotationType = (annotationTypeId: number): Action => ({
  type: 'UNSELECT_ACTIONS_WIDGET_ANNOTATION_TYPE',
  payload: {
    annotationTypeId,
  },
});

export const setPopulation = (population: SquadAthletesSelection): Action => ({
  type: 'SET_ACTIONS_WIDGET_POPULATION',
  payload: {
    population,
  },
});

export const setHiddenColumns = (
  hiddenColumns: Array<ActionsTableColumn>
): Action => ({
  type: 'SET_ACTIONS_WIDGET_HIDDEN_COLUMNS',
  payload: {
    hiddenColumns,
  },
});

export const saveActionsWidgetLoading = (): Action => ({
  type: 'SAVE_ACTIONS_WIDGET_LOADING',
});

export const saveActionsWidgetSuccess = (): Action => ({
  type: 'SAVE_ACTIONS_WIDGET_SUCCESS',
});

export const saveActionsWidgetFailure = (): Action => ({
  type: 'SAVE_ACTIONS_WIDGET_FAILURE',
});

export const closeActionsWidgetAppStatus = (): Action => ({
  type: 'CLOSE_ACTIONS_WIDGET_APP_STATUS',
});

export const saveActionsWidget =
  (): ThunkAction =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    dispatch(saveActionsWidgetLoading());

    $.ajax({
      method: 'POST',
      url: '/widgets',
      contentType: 'application/json',
      data: JSON.stringify({
        container_type: getState().staticData.containerType,
        container_id: getState().dashboard.activeDashboard.id,
        widget: {
          type: 'action',
          organisation_annotation_type_ids:
            getState().actionsWidgetModal.organisation_annotation_type_ids,
          completed: false,
          population: getState().actionsWidgetModal.population,
          hidden_columns: getState().actionsWidgetModal.hidden_columns,
        },
      }),
    })
      .done((response) => {
        dispatch(updateExistingWidgetYPosition(response.container_widget));
        dispatch(saveWidgetSuccess(response.container_widget));
        dispatch(saveActionsWidgetSuccess());
        dispatch(getDashboardLayout(getState().dashboard.widgets));
        // $FlowFixMe
        dispatch(fetchWidgetContent(response.container_widget.id));
      })
      .fail(() => {
        dispatch(saveActionsWidgetFailure());
      });
  };

export const editActionsWidget =
  (widgetId: number): ThunkAction =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    dispatch(saveActionsWidgetLoading());

    $.ajax({
      method: 'PUT',
      url: `/widgets/${widgetId}`,
      contentType: 'application/json',
      data: JSON.stringify({
        container_type: getState().staticData.containerType,
        container_id: getState().dashboard.activeDashboard.id,
        widget: {
          type: 'action',
          organisation_annotation_type_ids:
            getState().actionsWidgetModal.organisation_annotation_type_ids,
          completed: false,
          population: getState().actionsWidgetModal.population,
          hidden_columns: getState().actionsWidgetModal.hidden_columns,
        },
      }),
    })
      .done((response) => {
        dispatch(editWidgetSuccess(response.container_widget));
        dispatch(saveActionsWidgetSuccess());
        // $FlowFixMe
        dispatch(fetchWidgetContent(widgetId));
      })
      .fail(() => {
        dispatch(saveActionsWidgetFailure());
      });
  };
