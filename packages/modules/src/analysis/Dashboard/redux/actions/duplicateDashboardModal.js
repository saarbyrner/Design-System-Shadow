// @flow
import $ from 'jquery';
import type { Squad } from '@kitman/common/src/types/Squad';
import type { Action, ThunkAction } from '../types/actions';

export const openDuplicateDashboardModal = (dashboardName: string): Action => ({
  type: 'OPEN_DUPLICATE_DASHBOARD_MODAL',
  payload: {
    dashboardName,
  },
});

export const changeDuplicateDashboardName = (
  dashboardName: string
): Action => ({
  type: 'CHANGE_DUPLICATE_DASHBOARD_NAME',
  payload: {
    dashboardName,
  },
});

export const changeDuplicateDashboardSelectedSquad = (
  selectedSquad: Squad
): Action => ({
  type: 'CHANGE_DUPLICATE_DASHBOARD_SELECTED_SQUAD',
  payload: {
    selectedSquad,
  },
});

export const closeDuplicateDashboardAppStatus = (): Action => ({
  type: 'CLOSE_DUPLICATE_DASHBOARD_APP_STATUS',
});

export const closeDuplicateDashboardModal = (): Action => ({
  type: 'CLOSE_DUPLICATE_DASHBOARD_MODAL',
});

export const duplicateDashboardLoading = (): Action => ({
  type: 'DUPLICATE_DASHBOARD_LOADING',
});

export const duplicateDashboardSuccess = (): Action => ({
  type: 'DUPLICATE_DASHBOARD_SUCCESS',
});

export const duplicateDashboardFailure = (): Action => ({
  type: 'DUPLICATE_DASHBOARD_FAILURE',
});

export const saveDuplicateDashboard =
  (): ThunkAction =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    dispatch(duplicateDashboardLoading());
    const targetSquadId = getState().duplicateDashboardModal.selectedSquad.id;
    const activeSquadId = getState().duplicateDashboardModal.activeSquad.id;

    $.ajax({
      method: 'POST',
      url: `/analysis/dashboard/${
        getState().dashboard.activeDashboard.id
      }/duplicate`,
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
      contentType: 'application/json',
      data: JSON.stringify({
        name: getState().duplicateDashboardModal.dashboardName,
        target_squad_id: getState().duplicateDashboardModal.selectedSquad.id,
      }),
    })
      .done((response) => {
        if (targetSquadId !== activeSquadId) {
          $.ajax({
            method: 'GET',
            url: `/settings/set_squad/${targetSquadId}`,
            headers: {
              'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
            },
          }).done(() => {
            window.location.assign(`/analysis/dashboard/${response.id}`);

            setTimeout(() => {
              dispatch(closeDuplicateDashboardAppStatus());
            }, 1000);
          });
        } else {
          dispatch(duplicateDashboardSuccess());
          window.location.assign(`/analysis/dashboard/${response.id}`);

          setTimeout(() => {
            dispatch(closeDuplicateDashboardAppStatus());
          }, 1000);
        }
      })
      .fail(() => {
        dispatch(duplicateDashboardFailure());
      });
  };
