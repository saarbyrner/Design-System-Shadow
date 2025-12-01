import $ from 'jquery';
import { axios } from '@kitman/common/src/utils/services';
import _uniqueId from 'lodash/uniqueId';
import { waitFor } from '@testing-library/react';
import {
  fakeAjaxSuccess,
  fakeAjaxFailure,
} from '@kitman/modules/src/analysis/Dashboard/utils/ajaxMocks';
import {
  saveDashboard,
  saveDashboardLayout,
  refreshDashboardCache,
  sortGraphWidget,
} from '../dashboard';

jest.mock('@kitman/common/src/utils/i18n', () => ({
  t: (key) => key,
}));

jest.mock('lodash/uniqueId', () => jest.fn());

jest.mock('@kitman/components/src/Toast/actions', () => jest.fn());

describe('dashboardActions thunks', () => {
  let dispatch;
  let getState;

  beforeEach(() => {
    dispatch = jest.fn();
    getState = jest.fn(() => ({
      dashboard: {
        activeDashboard: {
          id: 1,
          name: 'Test',
          print_paper_size: 'A4',
          print_orientation: 'landscape',
        },
        toast: [],
        widgets: [
          {
            id: 101,
            cols: 2,
            rows: 3,
            horizontal_position: 0,
            vertical_position: 0,
            print_cols: 2,
            print_rows: 3,
            print_horizontal_position: 0,
            print_vertical_position: 0,
            widget: {
              analytical_dashboard_graph_id: 555,
              configuration: { sorting: { foo: 'bar' } },
            },
          },
        ],
      },
    }));

    jest.spyOn($, 'ajax');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('saveDashboard', () => {
    it('dispatches success actions with toast', () => {
      $.ajax.mockImplementation(() => fakeAjaxSuccess());

      const thunk = saveDashboard(true);
      thunk(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'ADD_DASHBOARD_TOAST',
        })
      );
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'UPDATE_DASHBOARD_TOAST',
        })
      );
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'SAVE_DASHBOARD_SUCCESS',
        })
      );
    });

    it('dispatches failure actions with toast', () => {
      $.ajax.mockImplementation(() => fakeAjaxFailure());

      const thunk = saveDashboard(true);
      thunk(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'UPDATE_DASHBOARD_TOAST',
        })
      );
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'SAVE_DASHBOARD_FAILURE',
        })
      );
    });
  });

  describe('saveDashboardLayout', () => {
    it('dispatches success actions with toast', () => {
      $.ajax.mockImplementation(() => fakeAjaxSuccess());

      const thunk = saveDashboardLayout('HomeDashboard', 1, true);
      thunk(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'ADD_DASHBOARD_TOAST',
        })
      );
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'UPDATE_DASHBOARD_TOAST',
        })
      );
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'SAVE_DASHBOARD_LAYOUT_SUCCESS',
        })
      );
    });

    it('dispatches failure actions with toast', () => {
      $.ajax.mockImplementation(() => fakeAjaxFailure());

      const thunk = saveDashboardLayout('HomeDashboard', 1, true);
      thunk(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'UPDATE_DASHBOARD_TOAST',
        })
      );
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'SAVE_DASHBOARD_LAYOUT_FAILURE',
        })
      );
    });
  });

  describe('sortGraphWidget', () => {
    it('dispatches success action', () => {
      $.ajax.mockImplementation(() => fakeAjaxSuccess());

      const thunk = sortGraphWidget(101, { order: 'desc' });
      thunk(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'SORT_GRAPH_WIDGET_SUCCESS',
        })
      );
    });

    it('dispatches failure action', () => {
      $.ajax.mockImplementation(() => fakeAjaxFailure());

      const thunk = sortGraphWidget(101, { order: 'desc' });
      thunk(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'SORT_GRAPH_WIDGET_FAILURE',
        })
      );
    });
  });

  describe('refreshDashboardCache', () => {
    const dashboardId = 101;
    let getSpy;

    beforeEach(() => {
      getSpy = jest.spyOn(axios, 'get');
      getSpy.mockReset();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('dispatches success action', async () => {
      getSpy.mockResolvedValue({});
      _uniqueId.mockReturnValue('1234');
      const thunk = refreshDashboardCache(dashboardId);
      thunk(dispatch, getState);

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(
          `/analysis/dashboard/${dashboardId}/refresh_cache`
        );
        expect(dispatch).toHaveBeenCalledWith({
          type: 'REFRESH_DASHBOARD',
          payload: { dashboardId, dashboardCacheRefreshKey: '1234' },
        });
      });
    });

    it('dispatches failure action', async () => {
      getSpy.mockRejectedValue(new Error('Network error'));
      const thunk = refreshDashboardCache(dashboardId);
      thunk(dispatch, getState);
      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(
          `/analysis/dashboard/${dashboardId}/refresh_cache`
        );
        expect(dispatch).toHaveBeenCalledWith({
          type: 'REFRESH_DASHBOARD',
          payload: { dashboardId, dashboardCacheRefreshKey: '' },
        });
      });
    });
  });
});
