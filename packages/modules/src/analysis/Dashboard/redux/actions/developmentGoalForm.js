// @flow
import type { DevelopmentGoal } from '@kitman/modules/src/PlanningHub/src/services/getDevelopmentGoals';
import type { DevelopmentGoalFormType } from '@kitman/modules/src/PlanningHub/src/services/saveDevelopmentGoal';
import saveDevelopmentGoalRequest from '@kitman/modules/src/PlanningHub/src/services/saveDevelopmentGoal';
import type { Action, ThunkAction } from '../types/actions';
import { fetchWidgetContent } from './widgets';

export const openDevelopmentGoalForm = (
  developmentGoal: ?DevelopmentGoal,
  pivotedAthletes: Array<number>
): Action => ({
  type: 'OPEN_DEVELOPMENT_GOAL_FORM',
  payload: {
    developmentGoal: developmentGoal || null,
    pivotedAthletes: pivotedAthletes || [],
  },
});

export const closeDevelopmentGoalForm = (): Action => ({
  type: 'CLOSE_DEVELOPMENT_GOAL_FORM',
});

export const saveDevelopmentGoalLoading = (): Action => ({
  type: 'SAVE_DEVELOPMENT_GOAL_LOADING',
});

export const saveDevelopmentGoalFailure = (): Action => ({
  type: 'SAVE_DEVELOPMENT_GOAL_FAILURE',
});

export const saveDevelopmentGoalSuccess = (): Action => ({
  type: 'SAVE_DEVELOPMENT_GOAL_SUCCESS',
});

export const editDevelopmentGoalSuccess = (
  developmentGoal: DevelopmentGoal
): Action => ({
  type: 'EDIT_DEVELOPMENT_GOAL_SUCCESS',
  payload: {
    developmentGoal,
  },
});

export const saveDevelopmentGoal =
  (form: DevelopmentGoalFormType): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action, getState: Function) => {
    dispatch(saveDevelopmentGoalLoading());

    const savingMode = form.id ? 'EDIT' : 'CREATE';

    saveDevelopmentGoalRequest(form).then(
      (developmentGoal) => {
        dispatch(saveDevelopmentGoalSuccess());

        if (savingMode === 'CREATE') {
          getState()
            .dashboard.widgets.filter(
              (widget) => widget.widget_type === 'development_goal'
            )
            // $FlowFixMe
            .forEach(({ id }) => dispatch(fetchWidgetContent(id)));
        }

        if (savingMode === 'EDIT') {
          dispatch(editDevelopmentGoalSuccess(developmentGoal));
        }
      },
      () => dispatch(saveDevelopmentGoalFailure())
    );
  };
