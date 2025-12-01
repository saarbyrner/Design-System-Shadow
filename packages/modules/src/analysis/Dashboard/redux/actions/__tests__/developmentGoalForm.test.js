import saveDevelopmentGoalRequest from '@kitman/modules/src/PlanningHub/src/services/saveDevelopmentGoal';
import {
  openDevelopmentGoalForm,
  closeDevelopmentGoalForm,
  saveDevelopmentGoalLoading,
  saveDevelopmentGoalFailure,
  saveDevelopmentGoalSuccess,
  editDevelopmentGoalSuccess,
  saveDevelopmentGoal,
} from '../developmentGoalForm';

import { fetchWidgetContent } from '../widgets';

jest.mock(
  '@kitman/modules/src/PlanningHub/src/services/saveDevelopmentGoal',
  () => jest.fn()
);

jest.mock('../widgets', () => ({
  fetchWidgetContent: jest.fn((id) => ({
    type: 'FETCH_WIDGET_CONTENT',
    payload: id,
  })),
}));

describe('developmentGoalActions', () => {
  describe('plain actions', () => {
    it('openDevelopmentGoalForm returns correct action', () => {
      const action = openDevelopmentGoalForm({ id: 1 }, [101, 102]);
      expect(action).toEqual({
        type: 'OPEN_DEVELOPMENT_GOAL_FORM',
        payload: {
          developmentGoal: { id: 1 },
          pivotedAthletes: [101, 102],
        },
      });
    });

    it('closeDevelopmentGoalForm returns correct action', () => {
      expect(closeDevelopmentGoalForm()).toEqual({
        type: 'CLOSE_DEVELOPMENT_GOAL_FORM',
      });
    });

    it('saveDevelopmentGoalLoading returns correct action', () => {
      expect(saveDevelopmentGoalLoading()).toEqual({
        type: 'SAVE_DEVELOPMENT_GOAL_LOADING',
      });
    });

    it('saveDevelopmentGoalFailure returns correct action', () => {
      expect(saveDevelopmentGoalFailure()).toEqual({
        type: 'SAVE_DEVELOPMENT_GOAL_FAILURE',
      });
    });

    it('saveDevelopmentGoalSuccess returns correct action', () => {
      expect(saveDevelopmentGoalSuccess()).toEqual({
        type: 'SAVE_DEVELOPMENT_GOAL_SUCCESS',
      });
    });

    it('editDevelopmentGoalSuccess returns correct action', () => {
      const goal = { id: 5, title: 'Refactor' };
      expect(editDevelopmentGoalSuccess(goal)).toEqual({
        type: 'EDIT_DEVELOPMENT_GOAL_SUCCESS',
        payload: { developmentGoal: goal },
      });
    });
  });

  describe('saveDevelopmentGoal thunk', () => {
    let dispatch;
    let getState;

    beforeEach(() => {
      dispatch = jest.fn();
      getState = jest.fn(() => ({
        dashboard: {
          widgets: [
            { id: 1, widget_type: 'development_goal' },
            { id: 2, widget_type: 'other_type' },
          ],
        },
      }));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('dispatches correct actions on success in CREATE mode', async () => {
      const mockGoal = { id: 99 };
      saveDevelopmentGoalRequest.mockResolvedValue(mockGoal);

      const form = { title: 'New Goal' };
      await saveDevelopmentGoal(form)(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith(saveDevelopmentGoalLoading());
      expect(saveDevelopmentGoalRequest).toHaveBeenCalledWith(form);
      expect(dispatch).toHaveBeenCalledWith(saveDevelopmentGoalSuccess());
      expect(dispatch).toHaveBeenCalledWith(fetchWidgetContent(1));
      expect(dispatch).not.toHaveBeenCalledWith(
        editDevelopmentGoalSuccess(expect.anything())
      );
    });

    it('dispatches correct actions on success in EDIT mode', async () => {
      const mockGoal = { id: 99 };
      saveDevelopmentGoalRequest.mockResolvedValue(mockGoal);

      const form = { id: 99, title: 'Update Goal' };
      await saveDevelopmentGoal(form)(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith(saveDevelopmentGoalLoading());
      expect(saveDevelopmentGoalRequest).toHaveBeenCalledWith(form);
      expect(dispatch).toHaveBeenCalledWith(saveDevelopmentGoalSuccess());
      expect(dispatch).toHaveBeenCalledWith(
        editDevelopmentGoalSuccess(mockGoal)
      );
      expect(dispatch).not.toHaveBeenCalledWith(
        fetchWidgetContent(expect.anything())
      );
    });

    it('dispatches failure action on error', async () => {
      saveDevelopmentGoalRequest.mockRejectedValue(new Error('Request failed'));

      const form = { title: 'Failing Goal' };
      await saveDevelopmentGoal(form)(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith(saveDevelopmentGoalLoading());
      expect(dispatch).toHaveBeenCalledWith(saveDevelopmentGoalFailure());
    });
  });
});
