// @flow
import $ from 'jquery';

export type RequestResponse = {
  url: string,
};

const getNotificationsIFrame = (
  type: 'message' | 'report'
): Promise<RequestResponse> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: `/ui/medical/drfirst/limp_url?startup_screen=${type}`,
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getNotificationsIFrame;
