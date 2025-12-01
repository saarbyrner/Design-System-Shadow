// @flow
import $ from 'jquery';
import type { Squads } from '@kitman/services/src/services/getSquads';
import type { ActivityTypeCategory } from '@kitman/services/src/services/getActivityTypeCategories';

export type DevelopmentGoalCompletionType = {
  id: number | string,
  name: string,
  event_activity_type_category?: ?ActivityTypeCategory,
  archived?: boolean,
  squads?: Squads,
  isNewItem?: boolean,
};

const getDevelopmentGoalCompletionTypes = (): Promise<
  Array<DevelopmentGoalCompletionType>
> =>
  new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/ui/planning_hub/development_goal_completion_types',
    })
      .done(resolve)
      .fail(reject);
  });

export default getDevelopmentGoalCompletionTypes;
