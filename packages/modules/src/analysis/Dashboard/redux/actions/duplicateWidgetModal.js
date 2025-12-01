// @flow
import $ from 'jquery';
import type { Squad } from '@kitman/common/src/types/Squad';
import type { Dashboard } from '@kitman/modules/src/analysis/shared/types';
import type { Action, ThunkAction } from '../types/actions';
import { getDashboardLayout } from './dashboard';
import {
  saveWidgetSuccess,
  fetchWidgetContent,
  updateExistingWidgetYPosition,
} from './widgets';

export const openDuplicateWidgetModal = (
  widgetId: number,
  widgetType: string,
  isNameEditable: boolean,
  widgetName: string
): Action => ({
  type: 'OPEN_DUPLICATE_WIDGET_MODAL',
  payload: {
    widgetId,
    widgetType,
    isNameEditable,
    widgetName,
  },
});

export const changeSelectedDashboard = (
  selectedDashboard: Dashboard
): Action => ({
  type: 'CHANGE_SELECTED_DASHBOARD',
  payload: {
    selectedDashboard,
  },
});

export const changeSelectedSquad = (selectedSquad: Squad): Action => ({
  type: 'CHANGE_SELECTED_SQUAD',
  payload: {
    selectedSquad,
  },
});

export const changeDuplicateWidgetName = (widgetName: string): Action => ({
  type: 'CHANGE_DUPLICATE_WIDGET_NAME',
  payload: {
    widgetName,
  },
});

export const closeDuplicateWidgetAppStatus = (): Action => ({
  type: 'CLOSE_DUPLICATE_WIDGET_APP_STATUS',
});

export const closeDuplicateWidgetModal = (
  activeDashboard: Dashboard
): Action => ({
  type: 'CLOSE_DUPLICATE_WIDGET_MODAL',
  payload: {
    activeDashboard,
  },
});

export const duplicateWidgetLoading = (): Action => ({
  type: 'DUPLICATE_WIDGET_LOADING',
});

export const duplicateWidgetSuccess = (): Action => ({
  type: 'DUPLICATE_WIDGET_SUCCESS',
});

export const duplicateWidgetFailure = (): Action => ({
  type: 'DUPLICATE_WIDGET_FAILURE',
});

export const saveDuplicateWidget =
  (): ThunkAction =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    dispatch(duplicateWidgetLoading());

    const activeDashboardId = getState().dashboard.activeDashboard.id;
    const targetDashboardId =
      getState().duplicateWidgetModal.selectedDashboard.id;
    const targetSquadId = getState().duplicateWidgetModal.selectedSquad.id;
    const containerType = getState().staticData.containerType;

    const targetContainerType =
      containerType === 'HomeDashboard' &&
      activeDashboardId === targetDashboardId
        ? containerType
        : 'AnalyticalDashboard';

    $.ajax({
      method: 'POST',
      url: '/widgets/duplicate',
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
      contentType: 'application/json',
      data: JSON.stringify({
        container_type: containerType,
        container_id: activeDashboardId,
        container_widget_id: getState().duplicateWidgetModal.widgetId,
        widget: {
          name: getState().duplicateWidgetModal.widgetName,
        },
        target_container_type: targetContainerType,
        target_container_id: targetDashboardId,
        target_squad_id: targetSquadId,
      }),
    })
      .done((response) => {
        dispatch(duplicateWidgetSuccess());

        if (activeDashboardId === targetDashboardId) {
          dispatch(updateExistingWidgetYPosition(response.container_widget));
          dispatch(saveWidgetSuccess(response.container_widget));
          dispatch(getDashboardLayout(getState().dashboard.widgets));

          // eslint-disable-next-line no-underscore-dangle
          if (response.container_widget.widget_render.__async__) {
            dispatch(
              // $FlowFixMe
              fetchWidgetContent(
                response.container_widget.id,
                getState().duplicateWidgetModal.widgetType
              )
            );
          }
        }
        setTimeout(() => {
          dispatch(closeDuplicateWidgetAppStatus());
        }, 1000);
      })
      .fail(() => {
        dispatch(duplicateWidgetFailure());
      });
  };
