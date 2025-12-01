// @flow
import $ from 'jquery';
import type { Squads } from '@kitman/services/src/services/getSquads';
import type { ActivityTypeCategory } from '@kitman/services/src/services/getActivityTypeCategories';

export type DevelopmentGoalType = {
  id: number | string,
  name: string,
  event_activity_type_category?: ?ActivityTypeCategory,
  archived?: boolean,
  squads?: Squads,
  isNewItem?: boolean,
};

const getDevelopmentGoalTypes = (): Promise<Array<DevelopmentGoalType>> =>
  new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/ui/planning_hub/development_goal_types?current_squad=true',
    })
      .done((data) => {
        resolve(data);
      })
      .fail(() => {
        reject();
      });
  });

export default getDevelopmentGoalTypes;
