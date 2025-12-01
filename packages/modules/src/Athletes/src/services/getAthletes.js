// @flow
import $ from 'jquery';

const getAthletes = (): Promise<any> =>
  new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/athletes.json',
      dataType: 'json',
    })
      .done((data) => {
        resolve(data);
      })
      .fail(() => {
        reject();
      });
  });

export default getAthletes;
