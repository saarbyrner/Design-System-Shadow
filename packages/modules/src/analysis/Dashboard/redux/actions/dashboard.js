// @flow
import $ from 'jquery';
import i18n from '@kitman/common/src/utils/i18n';
import { axios } from '@kitman/common/src/utils/services';
import _uniqueId from 'lodash/uniqueId';
import closeToastItem from '@kitman/components/src/Toast/actions';
import type { ToastAction, ToastItem } from '@kitman/components/src/types';
import type {
  Dashboard,
  WidgetLayout,
} from '@kitman/modules/src/analysis/shared/types';
import type { Action, ThunkAction } from '../types/actions';
import type { ContainerType, WidgetData } from '../../types';

export const addDashboardToast = (item: ToastItem): Action => ({
  type: 'ADD_DASHBOARD_TOAST',
  payload: {
    item,
  },
});

export const updateDashboardToast = (
  itemId: number,
  item: ToastItem
): Action => ({
  type: 'UPDATE_DASHBOARD_TOAST',
  payload: {
    itemId,
    item,
  },
});

export const getDashboardLayout = (widgets: Array<WidgetData>): Action => ({
  type: 'GET_DASHBOARD_LAYOUT',
  payload: {
    widgets,
  },
});

export const saveDashboardSuccess = (dashboardId: number): Action => ({
  type: 'SAVE_DASHBOARD_SUCCESS',
  payload: {
    dashboardId,
  },
});

export const saveDashboardFailure = (dashboardId: number): Action => ({
  type: 'SAVE_DASHBOARD_FAILURE',
  payload: {
    dashboardId,
  },
});

export const saveDashboard =
  (showToast: boolean = false): ThunkAction =>
  (dispatch: (action: Action | ToastAction) => Action, getState: Function) => {
    const dashboard = getState().dashboard.activeDashboard;

    const toastId =
      getState().dashboard.toast.reduce(
        (max, item) => (item.id > max ? item.id : max),
        1
      ) + 1;

    if (showToast === true) {
      const toastItem: ToastItem = {
        text: i18n.t('Saving'),
        status: 'PROGRESS',
        id: toastId,
      };
      dispatch(addDashboardToast(toastItem));
    }

    const updatedDashboard = {
      name: dashboard.name,
      print_paper_size: dashboard.print_paper_size,
      print_orientation: dashboard.print_orientation,
    };

    $.ajax({
      method: 'PUT',
      url: `/analysis/dashboard/${dashboard.id}`,
      contentType: 'application/json',
      data: JSON.stringify(updatedDashboard),
    })
      .done(() => {
        if (showToast === true) {
          const toastItem: ToastItem = {
            text: i18n.t('Saving'),
            status: 'SUCCESS',
            id: toastId,
          };
          dispatch(updateDashboardToast(toastId, toastItem));
          setTimeout(() => {
            dispatch(closeToastItem(toastId));
          }, 3000);
        }
        dispatch(saveDashboardSuccess(dashboard.id));
      })
      .fail(() => {
        if (showToast === true) {
          const toastItem: ToastItem = {
            text: i18n.t('Saving'),
            status: 'ERROR',
            id: toastId,
          };
          dispatch(updateDashboardToast(toastId, toastItem));
        }
        dispatch(saveDashboardFailure(dashboard.id));
      });
  };

export const saveDashboardLayoutSuccess = (
  containerType: ContainerType,
  containerId: number
): Action => ({
  type: 'SAVE_DASHBOARD_LAYOUT_SUCCESS',
  payload: {
    containerType,
    containerId,
  },
});

export const saveDashboardLayoutFailure = (
  containerType: ContainerType,
  containerId: number
): Action => ({
  type: 'SAVE_DASHBOARD_LAYOUT_FAILURE',
  payload: {
    containerType,
    containerId,
  },
});

export const saveDashboardLayout =
  (
    containerType: ContainerType,
    containerId: number,
    showToast: boolean = false
  ): ThunkAction =>
  (dispatch: (action: Action | ToastAction) => Action, getState: Function) => {
    const widgets = getState().dashboard.widgets.map(
      ({
        id,
        cols,
        rows,
        horizontal_position, // eslint-disable-line camelcase
        vertical_position, // eslint-disable-line camelcase
        print_cols, // eslint-disable-line camelcase
        print_rows, // eslint-disable-line camelcase
        print_horizontal_position, // eslint-disable-line camelcase
        print_vertical_position, // eslint-disable-line camelcase
      }) => ({
        container_widget: id,
        cols,
        rows,
        horizontal_position,
        vertical_position,
        print_cols,
        print_rows,
        print_horizontal_position,
        print_vertical_position,
      })
    );
    const data = JSON.stringify({
      container_type: containerType,
      container_id: containerId,
      container_widgets_params: widgets,
    });

    const toastId =
      getState().dashboard.toast.reduce(
        (max, item) => (item.id > max ? item.id : max),
        1
      ) + 1;

    if (showToast === true) {
      const toastItem: ToastItem = {
        text: i18n.t('Saving'),
        status: 'PROGRESS',
        id: toastId,
      };
      dispatch(addDashboardToast(toastItem));
    }

    $.ajax({
      method: 'POST',
      url: '/widgets/update_layout',
      contentType: 'application/json',
      data,
    })
      .done(() => {
        if (showToast === true) {
          const toastItem: ToastItem = {
            text: i18n.t('Saving'),
            status: 'SUCCESS',
            id: toastId,
          };
          dispatch(updateDashboardToast(toastId, toastItem));
          setTimeout(() => {
            dispatch(closeToastItem(toastId));
          }, 3000);
        }
        dispatch(saveDashboardLayoutSuccess(containerType, containerId));
      })
      .fail(() => {
        if (showToast === true) {
          const toastItem: ToastItem = {
            text: i18n.t('Saving'),
            status: 'ERROR',
            id: toastId,
          };
          dispatch(updateDashboardToast(toastId, toastItem));
        }
        dispatch(saveDashboardLayoutFailure(containerType, containerId));
      });
  };

export const updateDashboardLayout = (
  dashboardLayout: Array<WidgetLayout>
): Action => ({
  type: 'UPDATE_DASHBOARD_LAYOUT',
  payload: {
    dashboardLayout,
  },
});

export const updateDashboardPrintLayout = (
  dashboardPrintLayout: Array<WidgetLayout>
): Action => ({
  type: 'UPDATE_DASHBOARD_PRINT_LAYOUT',
  payload: {
    dashboardPrintLayout,
  },
});

export const updateDashboard = (dashboard: Dashboard): Action => ({
  type: 'UPDATE_DASHBOARD',
  payload: {
    dashboard,
  },
});

export const sortGraphWidgetSuccess = (
  widgetId: number,
  sortOptions: Object
): Action => ({
  type: 'SORT_GRAPH_WIDGET_SUCCESS',
  payload: {
    widgetId,
    sortOptions,
  },
});

export const sortGraphWidgetFailure = (widgetId: number): Action => ({
  type: 'SORT_GRAPH_WIDGET_FAILURE',
  payload: {
    widgetId,
  },
});

export const sortGraphWidget =
  (widgetId: number, sortOptions: Object): ThunkAction =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    const graphWidget = getState().dashboard.widgets.find(
      (widget) => widget.id === widgetId
    ).widget;

    $.ajax({
      method: 'PATCH',
      url: `/analysis/graph/${graphWidget.analytical_dashboard_graph_id}`,
      data: JSON.stringify({
        configuration: {
          ...graphWidget.configuration,
          sorting: sortOptions,
        },
      }),
      contentType: 'application/json',
    })
      .done(() => {
        dispatch(sortGraphWidgetSuccess(widgetId, sortOptions));
      })
      .fail(() => {
        dispatch(sortGraphWidgetFailure(widgetId));
      });
  };

export const setCodingSystemKey = (codingSystemKey: string): Action => ({
  type: 'SET_CODING_SYSTEM_KEY',
  payload: {
    codingSystemKey,
  },
});

export const refreshDashboard = (
  dashboardId: number,
  dashboardCacheRefreshKey: string
): Action => ({
  type: 'REFRESH_DASHBOARD',
  payload: {
    dashboardId,
    dashboardCacheRefreshKey,
  },
});

export const refreshDashboardCache =
  (dashboardId: number): ThunkAction =>
  (dispatch: (action: Action) => Action) => {
    axios
      .get(`/analysis/dashboard/${dashboardId}/refresh_cache`)
      .then(() => dispatch(refreshDashboard(dashboardId, _uniqueId())))
      .catch(() => {
        dispatch(refreshDashboard(dashboardId, ''));
      });
  };
