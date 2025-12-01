// @flow
import moment from 'moment';
import $ from 'jquery';

const expireNote = (id: number): Promise<any> =>
  new Promise((resolve, reject) => {
    $.ajax({
      method: 'PUT',
      url: `/medical/notes/${id}/expire`,
      contentType: 'application/json',
      data: JSON.stringify({ expiration_date: moment(), scope_to_org: true }),
    })
      .done(resolve)
      .fail(reject);
  });

export default expireNote;
