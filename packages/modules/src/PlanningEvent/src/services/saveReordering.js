// @flow
import $ from 'jquery';
import type { planningTab } from '../../types';

const saveGridReordering = (
  eventId: number,
  selectedGridId: number | string,
  tab: planningTab,
  orderedIds: Array<number>
): Promise<any> => {
  const data: {
    tab: planningTab,
    assessment_group_id?: number | string,
    ordered_ids: Array<number>,
  } = {
    tab,
    ordered_ids: orderedIds,
  };
  if (selectedGridId !== 'default') data.assessment_group_id = selectedGridId;
  return new Promise<void>((resolve: (value: any) => void, reject) => {
    $.ajax({
      method: 'POST',
      url: `/planning_hub/events/${eventId}/grid_columns/reorder`,
      contentType: 'application/json',
      data: JSON.stringify(data),
    })
      .done(() => resolve())
      .fail(() => reject());
  });
};

export default saveGridReordering;
