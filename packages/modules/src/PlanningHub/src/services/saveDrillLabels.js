// @flow
import $ from 'jquery';

type DrillLabelTypeParam = {
  id?: number | string,
  name?: string,
  delete?: boolean,
  archived?: boolean,
  squad_ids?: Array<number | string>,
};

const saveDrillLabels = async (drillLabels: Array<DrillLabelTypeParam>) =>
  new Promise<void>((resolve: (value: any) => void, reject) => {
    $.ajax({
      method: 'POST',
      url: '/ui/planning_hub/event_activity_drill_labels/bulk_save',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({ event_activity_drill_labels: drillLabels }),
    })
      .done(() => {
        resolve();
      })
      .fail(() => {
        reject();
      });
  });

export default saveDrillLabels;
