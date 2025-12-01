// @flow
import $ from 'jquery';
import type { SquadAthletesSelection } from '@kitman/components/src/types';
import type { Action, ThunkAction } from '../types/actions';
import { getDashboardLayout } from './dashboard';
import {
  editWidgetSuccess,
  saveWidgetSuccess,
  fetchWidgetContent,
  updateExistingWidgetYPosition,
} from './widgets';

export const openNotesWidgetSettingsModal = (
  widgetId: number,
  widgetName: string,
  annotationTypes: Array<Object>,
  population: Object,
  timeScope: Object
): Action => ({
  type: 'OPEN_NOTES_WIDGET_SETTINGS_MODAL',
  payload: {
    widgetId,
    widgetName,
    annotationTypes,
    population,
    timeScope,
  },
});

export const closeNotesWidgetSettingsModal = (): Action => ({
  type: 'CLOSE_NOTES_WIDGET_SETTINGS_MODAL',
});

export const setNotesWidgetSettingsPopulation = (
  population: SquadAthletesSelection
): Action => ({
  type: 'SET_NOTES_WIDGET_SETTINGS_POPULATION',
  payload: {
    population,
  },
});

export const setNotesWidgetSettingsTimePeriod = (
  timePeriod: string
): Action => ({
  type: 'SET_NOTES_WIDGET_SETTINGS_TIME_PERIOD',
  payload: {
    timePeriod,
  },
});

export const selectAnnotationType = (annotationTypeId: number): Action => ({
  type: 'SELECT_ANNOTATION_TYPE',
  payload: {
    annotationTypeId,
  },
});

export const unselectAnnotationType = (annotationTypeId: number): Action => ({
  type: 'UNSELECT_ANNOTATION_TYPE',
  payload: {
    annotationTypeId,
  },
});

export const updateNotesWidgetSettingsDateRange = (
  dateRange: Object
): Action => ({
  type: 'UPDATE_NOTES_WIDGET_SETTINGS_DATE_RANGE',
  payload: {
    dateRange,
  },
});

export const updateNotesWidgetSettingsTimePeriodLength = (
  timePeriodLength: number
): Action => ({
  type: 'UPDATE_NOTES_WIDGET_SETTINGS_TIME_PERIOD_LENGTH',
  payload: {
    timePeriodLength,
  },
});

export const saveNotesWidgetSettingsLoading = (): Action => ({
  type: 'SAVE_NOTES_WIDGET_SETTINGS_LOADING',
});

export const saveNotesWidgetSettingsSuccess = (): Action => ({
  type: 'SAVE_NOTES_WIDGET_SETTINGS_SUCCESS',
});

export const saveNotesWidgetSettingsFailure = (): Action => ({
  type: 'SAVE_NOTES_WIDGET_SETTINGS_FAILURE',
});

export const editNotesWidgetSettingsSuccess = (): Action => ({
  type: 'EDIT_NOTES_WIDGET_SETTINGS_SUCCESS',
});

export const editNotesWidgetSettingsFailure = (): Action => ({
  type: 'EDIT_NOTES_WIDGET_SETTINGS_FAILURE',
});

export const saveNotesWidgetSettings =
  (): ThunkAction =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    dispatch(saveNotesWidgetSettingsLoading());

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
          type: 'annotation',
          widget_annotation_types:
            getState().notesWidgetSettingsModal.widget_annotation_types,
          population: getState().notesWidgetSettingsModal.population,
          time_scope: getState().notesWidgetSettingsModal.time_scope,
        },
      }),
    })
      .done((response) => {
        dispatch(updateExistingWidgetYPosition(response.container_widget));
        dispatch(saveWidgetSuccess(response.container_widget));
        dispatch(saveNotesWidgetSettingsSuccess());
        dispatch(getDashboardLayout(getState().dashboard.widgets));
        // $FlowFixMe
        dispatch(fetchWidgetContent(response.container_widget.id));
      })
      .fail(() => {
        dispatch(saveNotesWidgetSettingsFailure());
      });
  };

export const editNotesWidgetSettings =
  (widgetId: number): ThunkAction =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    dispatch(saveNotesWidgetSettingsLoading());
    $.ajax({
      method: 'PUT',
      url: `/widgets/${widgetId}`,
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
      contentType: 'application/json',
      data: JSON.stringify({
        container_type: getState().staticData.containerType,
        container_id: getState().dashboard.activeDashboard.id,
        widget: {
          widget_annotation_types:
            getState().notesWidgetSettingsModal.widget_annotation_types,
          name: getState().notesWidgetSettingsModal.widgetName,
          population: getState().notesWidgetSettingsModal.population,
          time_scope: getState().notesWidgetSettingsModal.time_scope,
        },
      }),
    })
      .done((response) => {
        dispatch(editWidgetSuccess(response.container_widget));
        dispatch(editNotesWidgetSettingsSuccess());
        // $FlowFixMe
        dispatch(fetchWidgetContent(widgetId));
      })
      .fail(() => {
        dispatch(editNotesWidgetSettingsFailure());
      });
  };
