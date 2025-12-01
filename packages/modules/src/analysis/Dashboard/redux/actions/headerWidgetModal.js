// @flow
import $ from 'jquery';
import type { SquadAthletesSelection } from '@kitman/components/src/types';
import type { Action, ThunkAction } from '../types/actions';
import { getDashboardLayout } from './dashboard';
import {
  editWidgetSuccess,
  saveWidgetSuccess,
  updateExistingWidgetYPosition,
} from './widgets';

export const openHeaderWidgetModal = (
  widgetId: number,
  name: string,
  population: SquadAthletesSelection,
  backgroundColor: string,
  showOrganisationLogo: boolean,
  showOrganisationName: boolean,
  hideOrganisationDetails: boolean
): Action => ({
  type: 'OPEN_HEADER_WIDGET_MODAL',
  payload: {
    widgetId,
    name,
    population,
    backgroundColor,
    showOrganisationLogo,
    showOrganisationName,
    hideOrganisationDetails,
  },
});

export const closeHeaderWidgetModal = (): Action => ({
  type: 'CLOSE_HEADER_WIDGET_MODAL',
});

export const setHeaderWidgetName = (name: string): Action => ({
  type: 'SET_HEADER_WIDGET_NAME',
  payload: {
    name,
  },
});

export const setHeaderWidgetPopulation = (
  population: SquadAthletesSelection
): Action => ({
  type: 'SET_HEADER_WIDGET_POPULATION',
  payload: {
    population,
  },
});

export const setHeaderWidgetBackgroundColor = (color: string): Action => ({
  type: 'SET_HEADER_WIDGET_BACKGROUND_COLOR',
  payload: {
    color,
  },
});

export const setShowOrganisationLogo = (
  showOrganisationLogo: boolean
): Action => ({
  type: 'SET_SHOW_ORGANISATION_LOGO',
  payload: {
    showOrganisationLogo,
  },
});

export const setShowOrganisationName = (
  showOrganisationName: boolean
): Action => ({
  type: 'SET_SHOW_ORGANISATION_NAME',
  payload: {
    showOrganisationName,
  },
});

export const setHideOrganisationDetails = (
  hideOrganisationDetails: boolean
): Action => ({
  type: 'SET_HIDE_ORGANISATION_DETAILS',
  payload: {
    hideOrganisationDetails,
  },
});

export const saveHeaderWidgetLoading = (): Action => ({
  type: 'SAVE_HEADER_WIDGET_LOADING',
});

export const saveHeaderWidgetSuccess = (): Action => ({
  type: 'SAVE_HEADER_WIDGET_SUCCESS',
});

export const saveHeaderWidgetFailure = (): Action => ({
  type: 'SAVE_HEADER_WIDGET_FAILURE',
});

export const editHeaderWidgetSuccess = (): Action => ({
  type: 'EDIT_HEADER_WIDGET_SUCCESS',
});

export const editHeaderWidgetFailure = (): Action => ({
  type: 'EDIT_HEADER_WIDGET_FAILURE',
});

export const saveHeaderWidget =
  (): ThunkAction =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    dispatch(saveHeaderWidgetLoading());

    const isDashboardName =
      getState().headerWidgetModal.name ===
      getState().dashboard.activeDashboard.name;

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
          type: 'header',
          name_from_container: isDashboardName,
          name: isDashboardName ? null : getState().headerWidgetModal.name,
          background_color: getState().headerWidgetModal.color,
          population: getState().headerWidgetModal.population,
          show_organisation_logo: getState().headerWidgetModal.showOrgLogo,
          show_organisation_name: getState().headerWidgetModal.showOrgName,
          hide_organisation_details:
            getState().headerWidgetModal.hideOrgDetails,
        },
      }),
    })
      .done((response) => {
        dispatch(updateExistingWidgetYPosition(response.container_widget));
        dispatch(saveWidgetSuccess(response.container_widget));
        dispatch(saveHeaderWidgetSuccess());
        dispatch(getDashboardLayout(getState().dashboard.widgets));
      })
      .fail(() => {
        dispatch(saveHeaderWidgetFailure());
      });
  };

export const editHeaderWidget =
  (widgetId: number): ThunkAction =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    dispatch(saveHeaderWidgetLoading());
    const isDashboardName =
      getState().headerWidgetModal.name ===
      getState().dashboard.activeDashboard.name;
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
          name_from_container: isDashboardName,
          name: getState().headerWidgetModal.name,
          background_color: getState().headerWidgetModal.color,
          population: getState().headerWidgetModal.population,
          show_organisation_logo: getState().headerWidgetModal.showOrgLogo,
          show_organisation_name: getState().headerWidgetModal.showOrgName,
          hide_organisation_details:
            getState().headerWidgetModal.hideOrgDetails,
        },
      }),
    })
      .done((response) => {
        dispatch(editWidgetSuccess(response.container_widget));
        dispatch(editHeaderWidgetSuccess());
      })
      .fail(() => {
        dispatch(editHeaderWidgetFailure());
      });
  };
