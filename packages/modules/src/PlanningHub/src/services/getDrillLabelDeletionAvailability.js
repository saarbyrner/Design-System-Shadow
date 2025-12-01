// @flow
import $ from 'jquery';
import type { DeletionAvailability } from '@kitman/common/src/types/DeletionAvailability';

const getDrillLabelDeletionAvailability = (
  drillLabelId: number
): Promise<DeletionAvailability> =>
  new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: `/ui/planning_hub/event_activity_drill_labels/${drillLabelId}/check_destruction`,
    })
      .done((data) => {
        resolve(data);
      })
      .fail(() => {
        reject();
      });
  });

export default getDrillLabelDeletionAvailability;
