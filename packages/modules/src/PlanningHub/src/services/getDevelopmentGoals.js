// @flow
import $ from 'jquery';
import type { Athlete } from '@kitman/common/src/types/Athlete';
import type { Principles } from '@kitman/common/src/types/Principles';
import type { DevelopmentGoalType } from './getDevelopmentGoalTypes';

export type DevelopmentGoal = {
  id: number,
  athlete?: Athlete,
  description: string,
  start_time: string,
  close_time: ?string,
  principles: Principles,
  development_goal_types: Array<DevelopmentGoalType>,
};
export type DevelopmentGoals = Array<DevelopmentGoal>;

const getDevelopmentGoals = (): Promise<DevelopmentGoal> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/ui/planning_hub/development_goals',
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getDevelopmentGoals;
