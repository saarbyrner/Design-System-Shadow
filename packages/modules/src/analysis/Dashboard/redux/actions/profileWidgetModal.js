// @flow
import $ from 'jquery';
import type { Action, ThunkAction } from '../types/actions';
import type { WidgetData } from '../../types';
import { getDashboardLayout } from './dashboard';
import {
  editWidgetSuccess,
  saveWidgetSuccess,
  updateExistingWidgetYPosition,
} from './widgets';

export const openProfileWidgetModal = (
  widgetId: number,
  athleteId: string,
  showAvailabilityIndicator: boolean,
  showSquadNumber: boolean,
  selectedInfoFields: Array<Object>,
  backgroundColour: string
): Action => ({
  type: 'OPEN_PROFILE_WIDGET_MODAL',
  payload: {
    widgetId,
    athleteId,
    showAvailabilityIndicator,
    showSquadNumber,
    selectedInfoFields,
    backgroundColour,
  },
});

export const closeProfileWidgetModal = (): Action => ({
  type: 'CLOSE_PROFILE_WIDGET_MODAL',
});

export const selectAthlete = (athleteId: string): Action => ({
  type: 'SELECT_ATHLETE',
  payload: {
    athleteId,
  },
});

export const selectWidgetInfoItem = (
  index: number,
  itemId: string
): Action => ({
  type: 'SELECT_WIDGET_INFO_ITEM',
  payload: {
    index,
    itemId,
  },
});

export const setAvatarAvailability = (
  showAvailabilityIndicator: boolean
): Action => ({
  type: 'SET_AVATAR_AVAILABILITY',
  payload: {
    showAvailabilityIndicator,
  },
});

export const setAvatarSquadNumber = (showSquadNumber: boolean): Action => ({
  type: 'SET_AVATAR_SQUAD_NUMBER',
  payload: {
    showSquadNumber,
  },
});

export const updatePreviewSuccess = (widget: WidgetData): Action => ({
  type: 'UPDATE_PREVIEW_SUCCESS',
  payload: {
    widget,
  },
});

export const setProfileBackgroundColour = (
  backgroundColour: string
): Action => ({
  type: 'SET_PROFILE_BACKGROUND_COLOUR',
  payload: {
    backgroundColour,
  },
});

export const saveProfileWidgetLoading = (): Action => ({
  type: 'SAVE_PROFILE_WIDGET_LOADING',
});

export const saveProfileWidgetSuccess = (): Action => ({
  type: 'SAVE_PROFILE_WIDGET_SUCCESS',
});

export const saveProfileWidgetFailure = (): Action => ({
  type: 'SAVE_PROFILE_WIDGET_FAILURE',
});

export const editProfileWidgetSuccess = (): Action => ({
  type: 'EDIT_PROFILE_WIDGET_SUCCESS',
});

export const editProfileWidgetFailure = (): Action => ({
  type: 'EDIT_PROFILE_WIDGET_FAILURE',
});

export const updatePreview =
  (): ThunkAction =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    $.ajax({
      method: 'POST',
      url: '/widgets/preview',
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
      contentType: 'application/json',
      data: JSON.stringify({
        container_type: getState().staticData.containerType,
        container_id: getState().dashboard.activeDashboard.id,
        widget: {
          type: 'athlete_profile',
          athlete_id: getState().profileWidgetModal.athlete_id,
          fields: getState().profileWidgetModal.fields,
          avatar_availability:
            getState().profileWidgetModal.avatar_availability,
          avatar_squad_number:
            getState().profileWidgetModal.avatar_squad_number,
          background_colour: getState().profileWidgetModal.backgroundColour,
        },
      }),
    }).done((response) => {
      dispatch(updatePreviewSuccess(response));
    });
  };

export const saveProfileWidget =
  (): ThunkAction =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    dispatch(saveProfileWidgetLoading());

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
          type: 'athlete_profile',
          athlete_id: getState().profileWidgetModal.athlete_id,
          fields: getState().profileWidgetModal.fields,
          avatar_availability:
            getState().profileWidgetModal.avatar_availability,
          avatar_squad_number:
            getState().profileWidgetModal.avatar_squad_number,
          background_colour: getState().profileWidgetModal.backgroundColour,
        },
      }),
    })
      .done((response) => {
        dispatch(updateExistingWidgetYPosition(response.container_widget));
        dispatch(saveWidgetSuccess(response.container_widget));
        dispatch(saveProfileWidgetSuccess());
        dispatch(getDashboardLayout(getState().dashboard.widgets));
      })
      .fail(() => {
        dispatch(saveProfileWidgetFailure());
      });
  };

export const editProfileWidget =
  (widgetId: number): ThunkAction =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    dispatch(saveProfileWidgetLoading());
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
          athlete_id: getState().profileWidgetModal.athlete_id,
          fields: getState().profileWidgetModal.fields,
          avatar_availability:
            getState().profileWidgetModal.avatar_availability,
          avatar_squad_number:
            getState().profileWidgetModal.avatar_squad_number,
          background_colour: getState().profileWidgetModal.backgroundColour,
        },
      }),
    })
      .done((response) => {
        dispatch(editWidgetSuccess(response.container_widget));
        dispatch(editProfileWidgetSuccess());
      })
      .fail(() => {
        dispatch(editProfileWidgetFailure());
      });
  };
