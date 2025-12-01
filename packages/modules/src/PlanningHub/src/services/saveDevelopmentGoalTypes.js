// @flow
import $ from 'jquery';

type DevelopmentGoalTypeParam = {
  id?: number | string,
  name?: string,
  delete?: boolean,
  archived?: boolean,
  squad_ids?: Array<number | string>,
};

const saveDevelopmentGoalTypes = async (
  developmentGoalTypes: Array<DevelopmentGoalTypeParam>
) =>
  new Promise<void>((resolve: (value: any) => void, reject) => {
    $.ajax({
      method: 'POST',
      url: '/ui/planning_hub/development_goal_types/bulk_save',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        development_goal_types: developmentGoalTypes,
      }),
    })
      .done(() => {
        resolve();
      })
      .fail(() => {
        reject();
      });
  });

export default saveDevelopmentGoalTypes;
