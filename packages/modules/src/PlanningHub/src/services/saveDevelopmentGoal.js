// @flow
import $ from 'jquery';
import type { DevelopmentGoal } from './getDevelopmentGoals';

export type DevelopmentGoalFormType = {
  id?: ?number,
  athlete_id?: ?number,
  description?: string,
  development_goal_type_ids?: Array<number>,
  principle_ids?: Array<number>,
  start_time?: ?string,
  close_time?: ?string,
};

const saveDevelopmentGoal = async (
  developmentGoalForm: DevelopmentGoalFormType
): Promise<DevelopmentGoal> =>
  new Promise((resolve, reject) => {
    $.ajax({
      method: developmentGoalForm.id ? 'PATCH' : 'POST',
      url: developmentGoalForm.id
        ? `/ui/planning_hub/development_goals/${developmentGoalForm.id}`
        : '/ui/planning_hub/development_goals',
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
      contentType: 'application/json',
      data: JSON.stringify(developmentGoalForm),
    })
      .done((developmentGoal) => resolve(developmentGoal))
      .fail(() => reject());
  });

export default saveDevelopmentGoal;
