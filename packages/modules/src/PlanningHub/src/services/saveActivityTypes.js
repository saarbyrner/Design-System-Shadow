// @flow
import $ from 'jquery';

type ActivityTypeParam = {
  id?: number | string,
  name?: string,
  delete?: boolean,
  archived?: boolean,
  squad_ids?: Array<number | string>,
};

const saveActivityTypes = async (activityTypes: Array<ActivityTypeParam>) =>
  new Promise<void>((resolve: (value: any) => void, reject) => {
    $.ajax({
      method: 'POST',
      url: '/ui/planning_hub/event_activity_types/bulk_save',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({ event_activity_types: activityTypes }),
    })
      .done(() => {
        resolve();
      })
      .fail(() => {
        reject();
      });
  });

export default saveActivityTypes;
