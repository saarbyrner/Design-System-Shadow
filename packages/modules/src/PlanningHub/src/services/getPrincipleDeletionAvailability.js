// @flow
import $ from 'jquery';
import type { PrincipleId } from '@kitman/common/src/types/Principles';
import type { DeletionAvailability } from '@kitman/common/src/types/DeletionAvailability';

const getPrincipleDeletionAvailability = (
  principleId: PrincipleId
): Promise<DeletionAvailability> =>
  new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: `/ui/planning_hub/principles/${principleId}/check_destruction`,
    })
      .done((data) => {
        resolve(data);
      })
      .fail(() => {
        reject();
      });
  });

export default getPrincipleDeletionAvailability;
