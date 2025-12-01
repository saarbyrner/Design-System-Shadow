// @flow
import $ from 'jquery';

type DevelopmentGoalCompletionTypeParam = {
  id?: number | string,
  name?: string,
  delete?: boolean,
  archived?: boolean,
  squad_ids?: Array<number | string>,
};

const saveDevelopmentGoalCompletionTypes = async (
  developmentGoalCompletionTypes: Array<DevelopmentGoalCompletionTypeParam>
) =>
  new Promise<void>((resolve: (value: any) => void, reject) => {
    $.ajax({
      method: 'POST',
      url: '/ui/planning_hub/development_goal_completion_types/bulk_save',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        development_goal_completion_types: developmentGoalCompletionTypes,
      }),
    })
      .done(() => {
        resolve();
      })
      .fail(() => {
        reject();
      });
  });

export default saveDevelopmentGoalCompletionTypes;
