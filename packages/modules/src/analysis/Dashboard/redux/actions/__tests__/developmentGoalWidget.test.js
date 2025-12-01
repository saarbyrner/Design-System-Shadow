import $ from 'jquery';
import {
  fakeAjaxSuccess,
  fakeAjaxFailure,
} from '@kitman/modules/src/analysis/Dashboard/utils/ajaxMocks';
import {
  onDeleteDevelopmentGoalSuccess,
  saveDevelopmentGoalWidgetFailure,
  updateDevelopmentGoals,
  developmentGoalWidget,
  fetchNextDevelopmentGoals,
} from '../developmentGoalWidget';
import {
  saveWidgetSuccess,
  updateExistingWidgetYPosition,
  fetchWidgetContent,
} from '../widgets';
import { getDashboardLayout } from '../dashboard';

jest.mock('../widgets', () => {
  const original = jest.requireActual('../widgets');
  return {
    ...original,
    fetchWidgetContent: jest.fn((id) => ({
      type: 'FETCH_WIDGET_CONTENT',
      payload: { id },
    })),
  };
});

describe('developmentGoalActions', () => {
  describe('action creators', () => {
    it('onDeleteDevelopmentGoalSuccess creates correct action', () => {
      const action = onDeleteDevelopmentGoalSuccess(123);
      expect(action).toEqual({
        type: 'ON_DELETE_DEVELOPMENT_GOAL_SUCCESS',
        payload: { developmentGoalId: 123 },
      });
    });

    it('saveDevelopmentGoalWidgetFailure creates correct action', () => {
      expect(saveDevelopmentGoalWidgetFailure()).toEqual({
        type: 'SAVE_DEVELOPMENT_GOAL_WIDGET_FAILURE',
      });
    });

    it('updateDevelopmentGoals creates correct action', () => {
      const nextGoals = [{ id: 1 }, { id: 2 }];
      const action = updateDevelopmentGoals(10, nextGoals, 5);
      expect(action).toEqual({
        type: 'UPDATE_DEVELOPMENT_GOALS',
        payload: {
          widgetId: 10,
          nextDevelopmentGoals: nextGoals,
          nextId: 5,
        },
      });
    });
  });

  describe('developmentGoalWidget thunk', () => {
    let dispatch;
    let getState;

    beforeEach(() => {
      dispatch = jest.fn();
      getState = jest.fn(() => ({
        staticData: { containerType: 'someContainer' },
        dashboard: {
          activeDashboard: { id: 42 },
          widgets: [{ id: 1 }, { id: 2 }],
        },
      }));
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('dispatches success actions on successful AJAX', async () => {
      const response = { container_widget: { id: 99, y_position: 10 } };

      jest.spyOn($, 'ajax').mockImplementation(() => fakeAjaxSuccess(response));

      await developmentGoalWidget()(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith(
        updateExistingWidgetYPosition(response.container_widget)
      );
      expect(dispatch).toHaveBeenCalledWith(
        saveWidgetSuccess(response.container_widget)
      );
      expect(dispatch).toHaveBeenCalledWith(
        getDashboardLayout(getState().dashboard.widgets)
      );
      expect(dispatch).toHaveBeenCalledWith(
        fetchWidgetContent(response.container_widget.id)
      );
    });

    it('dispatches failure action on AJAX failure', async () => {
      jest.spyOn($, 'ajax').mockImplementation(() => fakeAjaxFailure());

      await developmentGoalWidget()(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith(saveDevelopmentGoalWidgetFailure());
    });
  });

  describe('fetchNextDevelopmentGoals thunk', () => {
    let dispatch;
    let getState;

    beforeEach(() => {
      dispatch = jest.fn();
      getState = jest.fn(() => ({
        staticData: { containerType: 'someContainer' },
        dashboard: { activeDashboard: { id: 42 }, widgets: [] },
      }));
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('does nothing if nextId is null', async () => {
      await fetchNextDevelopmentGoals(10, null)(dispatch, getState);

      expect(dispatch).not.toHaveBeenCalled();
    });

    it('dispatches updateDevelopmentGoals on successful AJAX', async () => {
      const response = {
        development_goals: [{ id: 1 }, { id: 2 }],
        next_id: 5,
      };

      jest.spyOn($, 'ajax').mockImplementation(() => fakeAjaxSuccess(response));

      await fetchNextDevelopmentGoals(10, 3)(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith({
        type: 'UPDATE_DEVELOPMENT_GOALS',
        payload: {
          widgetId: 10,
          nextDevelopmentGoals: response.development_goals,
          nextId: response.next_id,
        },
      });
    });
  });
});
