// @flow
import $ from 'jquery';
import type { Squads } from '@kitman/services/src/services/getSquads';
import type { ActivityTypeCategory } from '@kitman/services/src/services/getActivityTypeCategories';

export type ActivityTypeId = number | string;
export type ActivityType = {
  id: ActivityTypeId,
  name: string,
  event_activity_type_category?: ?ActivityTypeCategory,
  archived?: boolean,
  squads?: Squads,
  isNewItem?: boolean,
};

const getActivityTypes = (
  {
    onlyForCurrentSquad = false,
  }: {
    onlyForCurrentSquad: boolean,
  } = { onlyForCurrentSquad: false }
): Promise<Array<ActivityType>> =>
  new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: onlyForCurrentSquad
        ? '/ui/planning_hub/event_activity_types?current_squad=true'
        : '/ui/planning_hub/event_activity_types',
    })
      .done((data) => {
        resolve(data);
      })
      .fail(() => {
        reject();
      });
  });

export default getActivityTypes;
