// @flow
import $ from 'jquery';

const deleteGridColumn = (
  eventId: number,
  columnId: number,
  tab: 'collections_tab' | 'athletes_tab'
): Promise<any> => {
  return new Promise<void>((resolve: (value: any) => void, reject) => {
    $.ajax({
      method: 'DELETE',
      url: `/planning_hub/events/${eventId}/grid_columns/${columnId}`,
      contentType: 'application/json',
      data: JSON.stringify({
        tab,
      }),
    })
      .done(() => resolve())
      .fail(() => reject());
  });
};

export default deleteGridColumn;
