// @flow
import $ from 'jquery';

const deletePrinciple = (principleId: number | string): Promise<{}> =>
  new Promise((resolve, reject) => {
    $.ajax({
      method: 'DELETE',
      url: `/ui/planning_hub/principles/${principleId}`,
    })
      .done((data) => {
        resolve(data);
      })
      .fail(() => {
        reject();
      });
  });

export default deletePrinciple;
