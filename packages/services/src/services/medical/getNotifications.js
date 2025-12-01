// @flow
import $ from 'jquery';

type RequestResponse = {
  report_count: number,
  message_count: number,
};

const getNotifications = (): Promise<RequestResponse> =>
  new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/ui/medical/drfirst/notification_counts',
    })
      .done(resolve)
      .fail(reject);
  });

export default getNotifications;
