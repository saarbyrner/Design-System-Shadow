// @flow
import $ from 'jquery';

export type Sport = {
  id: number,
  name: string,
  duration: number, // Default game duration
  perma_id: string,
};

const getSport = (): Promise<Sport> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/sports',
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getSport;
