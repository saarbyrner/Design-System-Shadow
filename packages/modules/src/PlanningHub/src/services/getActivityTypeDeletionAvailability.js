// @flow
import $ from 'jquery';
import type { DeletionAvailability } from '@kitman/common/src/types/DeletionAvailability';

const getActivityTypeDeletionAvailability = (
  activityTypeId: number
): Promise<DeletionAvailability> =>
  new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: `/ui/planning_hub/event_activity_types/${activityTypeId}/check_destruction`,
    })
      .done((data) => {
        resolve(data);
      })
      .fail(() => {
        reject();
      });
  });

export default getActivityTypeDeletionAvailability;
