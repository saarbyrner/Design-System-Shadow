// @flow
import $ from 'jquery';

export const saveGridColumn = (
  eventId: number,
  tab: 'collections_tab' | 'athletes_tab',
  columnName: string,
  columnType: string,
  planningStatusDefinition: Object
): Promise<any> => {
  return new Promise<void>((resolve: (value: any) => void, reject) => {
    $.ajax({
      method: 'POST',
      url: `/planning_hub/events/${eventId}/grid_columns`,
      contentType: 'application/json',
      data: JSON.stringify({
        tab,
        columns: [
          {
            column_name: columnName,
            column_type: columnType,
            planning_status_definition: planningStatusDefinition,
          },
        ],
      }),
    })
      .done(() => resolve())
      .fail(() => reject());
  });
};

export const saveAssessmentGridColumn = (
  eventId: number,
  tab: 'collections_tab_assessment',
  columnName: string,
  columnType: string,
  planningStatusDefinition: Object,
  trainingVariableId?: number,
  selectedGridId?: number
): Promise<any> => {
  return new Promise<void>((resolve: (value: any) => void, reject) => {
    const data =
      columnType === 'status'
        ? {
            tab,
            assessment_group_id: selectedGridId,
            columns: [
              {
                column_name: columnName,
                column_type: columnType,
                planning_status_definition: planningStatusDefinition,
              },
            ],
          }
        : {
            tab,
            assessment_group_id: selectedGridId,
            columns: [
              {
                column_name: columnName,
                column_type: columnType,
                training_variable_id: trainingVariableId,
              },
            ],
          };

    $.ajax({
      method: 'POST',
      url: `/planning_hub/events/${eventId}/grid_columns`,
      contentType: 'application/json',
      data: JSON.stringify(data),
    })
      .done(() => resolve())
      .fail(() => reject());
  });
};
