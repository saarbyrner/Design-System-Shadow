import $ from 'jquery';
import { fakeAjaxSuccess } from '@kitman/modules/src/analysis/Dashboard/utils/ajaxMocks';
import {
  updateActions,
  fetchActionsLoading,
  resetActionList,
  fetchActions,
} from '../actionsWidget';

describe('actionsWidget actions', () => {
  describe('simple action creators', () => {
    it('creates UPDATE_ACTIONS action', () => {
      const result = updateActions(1, [{ id: 1, content: 'foo' }], 10);
      expect(result).toEqual({
        type: 'UPDATE_ACTIONS',
        payload: {
          widgetId: 1,
          actions: [{ id: 1, content: 'foo' }],
          nextId: 10,
        },
      });
    });

    it('creates FETCH_ACTIONS_LOADING action', () => {
      const result = fetchActionsLoading(5);
      expect(result).toEqual({
        type: 'FETCH_ACTIONS_LOADING',
        payload: {
          widgetId: 5,
        },
      });
    });

    it('creates RESET_ACTION_LIST action', () => {
      const result = resetActionList(99);
      expect(result).toEqual({
        type: 'RESET_ACTION_LIST',
        payload: {
          widgetId: 99,
        },
      });
    });
  });

  describe('fetchActions thunk', () => {
    let dispatch;
    let getState;
    let widgetId;
    let options;

    beforeEach(() => {
      dispatch = jest.fn();
      getState = jest.fn(() => ({
        staticData: { containerType: 'HomeDashboard' },
        dashboard: {
          activeDashboard: { id: 2 },
        },
      }));

      widgetId = 123;
      options = {
        next_id: 2,
        population: {},
        completed: true,
        organisation_annotation_type_ids: [1, 2],
      };

      // Clean head and inject CSRF token
      document.head.innerHTML =
        '<meta name="csrf-token" content="FAKE_TOKEN" />';
    });

    afterEach(() => {
      jest.clearAllMocks();
      document.head.innerHTML = '';
    });

    it('dispatches RESET and makes AJAX call with correct data if reset=true', () => {
      jest
        .spyOn($, 'ajax')
        .mockImplementation(() =>
          fakeAjaxSuccess({
            actions: [{ id: 1, content: 'action' }],
            next_id: 3,
          })
        );

      const thunk = fetchActions(widgetId, options, true);
      thunk(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith(resetActionList(widgetId));
      expect($.ajax).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: '/widgets/widget_render',
          headers: {
            'X-CSRF-Token': 'FAKE_TOKEN',
          },
          contentType: 'application/json',
          data: JSON.stringify({
            container_type: 'HomeDashboard',
            container_id: 2,
            container_widget_id: widgetId,
            options,
          }),
        })
      );

      expect(dispatch).toHaveBeenCalledWith(
        updateActions(widgetId, [{ id: 1, content: 'action' }], 3)
      );
    });

    it('does not dispatch RESET if reset is false', () => {
      jest
        .spyOn($, 'ajax')
        .mockImplementation(() => fakeAjaxSuccess({ actions: [], next_id: 1 }));

      const thunk = fetchActions(widgetId, options);
      thunk(dispatch, getState);

      expect(dispatch).not.toHaveBeenCalledWith(resetActionList(widgetId));
      expect(dispatch).toHaveBeenCalledWith(updateActions(widgetId, [], 1));
    });
  });
});
